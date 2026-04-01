import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";

/**
 * ADE20K label → zone mapping for room segmentation.
 * Groups fine-grained labels into broad room zones.
 */
const LABEL_ZONE_MAP: Record<string, string> = {
  // Walls & structure
  wall: "wall",

  // Floor
  floor: "floor",
  rug: "floor",

  // Ceiling
  ceiling: "ceiling",

  // Furniture / Cabinets
  cabinet: "furniture",
  shelf: "furniture",
  bookcase: "furniture",
  "chest of drawers": "furniture",
  wardrobe: "furniture",
  table: "furniture",
  desk: "furniture",
  chair: "furniture",
  armchair: "furniture",
  sofa: "furniture",
  seat: "furniture",
  "swivel chair": "furniture",
  bench: "furniture",
  stool: "furniture",
  ottoman: "furniture",
  "coffee table": "furniture",
  buffet: "furniture",
  bar: "furniture",
  bed: "furniture",

  // Countertops (kitchen-specific)
  counter: "countertop",
  countertop: "countertop",
  "kitchen island": "countertop",

  // Appliances
  stove: "appliance",
  oven: "appliance",
  refrigerator: "appliance",
  microwave: "appliance",
  sink: "appliance",
  dishwasher: "appliance",
  washer: "appliance",
  hood: "appliance",
};

const ZONE_LABELS: Record<string, string> = {
  wall: "Стены",
  floor: "Пол",
  ceiling: "Потолок",
  furniture: "Мебель",
  countertop: "Столешница",
  appliance: "Техника",
};

const HF_MODELS = [
  "nvidia/segformer-b5-finetuned-ade-640-640",
  "facebook/mask2former-swin-large-ade-semantic",
  "shi-labs/oneformer_ade20k_swin_large",
];
const HF_BASE_URL = "https://router.huggingface.co/hf-inference/models";
const MAX_RETRIES = 3;
const MAX_IMAGE_DIM = 640;

export async function POST(req: NextRequest) {
  try {
    const { imagePath } = await req.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 }
      );
    }

    // Sanitize path — prevent directory traversal
    const sanitized = path
      .normalize(imagePath)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const fullPath = path.join(process.cwd(), "public", sanitized);

    if (!fullPath.startsWith(path.join(process.cwd(), "public"))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Get original image dimensions for later upscaling
    const originalMeta = await sharp(fullPath).metadata();
    const origW = originalMeta.width!;
    const origH = originalMeta.height!;
    console.log("[segment] Original image:", origW, "x", origH);

    // Resize image to max 640px to reduce payload and match model input size
    const resizedBuffer = await sharp(fullPath)
      .resize(MAX_IMAGE_DIM, MAX_IMAGE_DIM, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    const imageBody = new Uint8Array(resizedBuffer);
    console.log("[segment] Image resized, size:", resizedBuffer.length);
    console.log("[segment] HF_TOKEN present:", !!process.env.HF_TOKEN);

    // ── Call HF Inference API — try multiple models with retry ──
    let segments: Array<{ label: string; score: number | null; mask: string }> =
      [];
    let lastError = "";

    for (const model of HF_MODELS) {
      console.log(`[segment] Trying model: ${model}`);
      let success = false;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        console.log(`[segment]   Attempt ${attempt + 1}/${MAX_RETRIES}...`);
        try {
          const hfRes = await fetch(
            `${HF_BASE_URL}/${model}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "image/jpeg",
              },
              body: imageBody,
            }
          );

          console.log(`[segment]   Response status: ${hfRes.status}`);

          if (hfRes.ok) {
            segments = await hfRes.json();
            console.log(`[segment]   Got ${segments.length} segments:`, segments.map((s: { label: string }) => s.label));
            success = true;
            break;
          }

          // Model loading — wait and retry
          if (hfRes.status === 503) {
            const body = await hfRes.json().catch(() => ({}));
            const wait = Math.min((body.estimated_time ?? 20) * 1000, 60_000);
            console.log(`[segment]   Model loading, waiting ${wait}ms...`);
            await new Promise((r) => setTimeout(r, wait));
            continue;
          }

          // Model gone or not available — try next model
          if (hfRes.status === 410 || hfRes.status === 404) {
            const errText = await hfRes.text().catch(() => "");
            lastError = `${model}: ${hfRes.status} ${errText}`;
            console.log(`[segment]   Model unavailable (${hfRes.status}), trying next...`);
            break; // break retry loop, try next model
          }

          // Token permission issue
          if (hfRes.status === 401 || hfRes.status === 403) {
            const errText = await hfRes.text().catch(() => "");
            console.error(`[segment]   Auth error: ${hfRes.status}`, errText);
            return NextResponse.json(
              {
                error: "Токен HF не имеет разрешений на Inference API. Обновите токен на huggingface.co/settings/tokens — включите 'Make calls to the serverless Inference API'.",
                details: errText,
              },
              { status: 403 }
            );
          }

          // Other errors
          const errText = await hfRes.text().catch(() => "");
          lastError = `${model}: ${hfRes.status} ${errText}`;
          console.error(`[segment]   HF API error: ${hfRes.status}`, errText);

          // 429 rate limit — wait and retry
          if (hfRes.status === 429) {
            await new Promise((r) => setTimeout(r, 10_000));
            continue;
          }

          break; // other error, try next model
        } catch (fetchErr: unknown) {
          const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
          lastError = `${model}: fetch error: ${msg}`;
          console.error(`[segment]   Fetch error:`, msg);
          break;
        }
      }

      if (success && segments.length > 0) break;
    }

    if (!segments.length) {
      return NextResponse.json(
        { error: "No segments returned from any model", details: lastError },
        { status: 502 }
      );
    }

    // ── Group segments by zone ──
    const zoneSegments: Record<string, string[]> = {};

    for (const seg of segments) {
      const zoneId = LABEL_ZONE_MAP[seg.label];
      if (!zoneId) continue;
      if (!zoneSegments[zoneId]) zoneSegments[zoneId] = [];
      zoneSegments[zoneId].push(seg.mask);
    }

    // ── Merge masks per zone using sharp ──
    // Upscale to original resolution + Gaussian blur for feathered edges
    const FEATHER_SIGMA = Math.max(2, Math.round(origW / 300)); // adaptive blur
    console.log("[segment] Feather sigma:", FEATHER_SIGMA, "for", origW, "px");

    const zones: Array<{ id: string; label: string; maskDataUrl: string }> = [];

    for (const [zoneId, masks] of Object.entries(zoneSegments)) {
      // 1. Decode all masks to raw grayscale at model resolution
      const firstBuf = Buffer.from(masks[0], "base64");
      const maskMeta = await sharp(firstBuf).metadata();
      const mw = maskMeta.width!;
      const mh = maskMeta.height!;

      const rawGrayBuffers = await Promise.all(
        masks.map((m) =>
          sharp(Buffer.from(m, "base64"))
            .grayscale()
            .raw()
            .toBuffer()
        )
      );

      // 2. OR-merge all segment masks into one (max per pixel)
      const merged = Buffer.alloc(mw * mh, 0);
      for (const buf of rawGrayBuffers) {
        for (let i = 0; i < buf.length && i < merged.length; i++) {
          merged[i] = Math.max(merged[i], buf[i]);
        }
      }

      // 3. Upscale to original image resolution with bicubic interpolation
      //    Then apply Gaussian blur for smooth feathered edges
      const enhancedPng = await sharp(merged, {
        raw: { width: mw, height: mh, channels: 1 },
      })
        .resize(origW, origH, {
          kernel: sharp.kernel.cubic,
          fit: "fill",
        })
        // Threshold to clean up — pixels > 128 become white, else black
        .threshold(100)
        // Gaussian blur for soft feathered edges
        .blur(FEATHER_SIGMA)
        // Normalize range back to full 0-255
        .normalize()
        .png()
        .toBuffer();

      const maskDataUrl = `data:image/png;base64,${enhancedPng.toString("base64")}`;
      zones.push({
        id: zoneId,
        label: ZONE_LABELS[zoneId] || zoneId,
        maskDataUrl,
      });
    }

    // Sort zones: wall → floor → ceiling → furniture → countertop → appliance
    const order = ["wall", "floor", "ceiling", "furniture", "countertop", "appliance"];
    zones.sort((a, b) => {
      const ai = order.indexOf(a.id);
      const bi = order.indexOf(b.id);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    return NextResponse.json({ zones });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[segment] FATAL:", message, error);
    return NextResponse.json(
      { error: "Segmentation failed", details: message },
      { status: 500 }
    );
  }
}
