// Shared Backblaze B2 (S3-compatible) client + fixed course/category convention.
// All Netlify Functions in this folder import from here.
const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  forcePathStyle: true,
  // Disable automatic flexible checksum query params in presigned URLs
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const BUCKET = process.env.B2_BUCKET_NAME;

// Fixed convention — keep this in sync with what's actually in the bucket.
const COURSES = ["ACC-100", "BUS 100", "ENG 101", "HIST-101", "MGT 200", "MKT 200"];
const CATEGORIES = ["CLS-CONTENT", "CLS-NOTE", "HW"];

// Allow any file type for uploads so teachers/students can submit the formats they need.
const ALLOWED_EXTENSIONS = {
  "CLS-CONTENT": null,
  "CLS-NOTE": null,
  "HW": null,
};

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type, x-upload-secret",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

// Validates course/category/[hwNumber/]filename and returns the bucket key
function buildKey({ course, category, hwNumber, filename }) {
  if (!COURSES.includes(course)) throw new Error(`Unknown course: ${course}`);
  if (!CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}`);
  if (!filename || /[\/\\]/.test(filename)) throw new Error("Invalid filename");

  // Check extension safely if allowed extensions array is provided
  const allowed = ALLOWED_EXTENSIONS[category];
  if (allowed !== null && Array.isArray(allowed)) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new Error(`Extension ${ext} not allowed for ${category}`);
    }
  }

  if (category === "HW") {
    if (!/^\d{1,3}$/.test(String(hwNumber || ""))) {
      throw new Error("HW uploads require a numeric assignment number");
    }
    const num = String(hwNumber).padStart(2, "0");
    return `${course}/${category}/${num}/${filename}`;
  }

  return `${course}/${category}/${filename}`;
}

module.exports = { 
  s3Client, 
  BUCKET, 
  COURSES, 
  CATEGORIES, 
  ALLOWED_EXTENSIONS, 
  MAX_FILE_BYTES, 
  corsHeaders, 
  json, 
  buildKey 
};

// this shoud fix the issue with the presign-upload.js and upload.js files by ensuring that the s3Client is correctly named and exported, and that the buildKey function properly validates the course, category, hwNumber, and filename before constructing the S3 key.