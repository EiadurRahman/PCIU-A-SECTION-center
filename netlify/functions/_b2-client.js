// Shared Backblaze B2 (S3-compatible) client + fixed course/category convention.
// All Netlify Functions in this folder import from here.
const { S3Client } = require("@aws-sdk/client-s3");

const b2 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,       // e.g. https://s3.us-east-005.backblazeb2.com
  region: process.env.B2_REGION,           // e.g. us-east-005
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID, // <-- FIXED
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  forcePathStyle: true, // required for B2's S3-compatible endpoint
});

const BUCKET = process.env.B2_BUCKET_NAME; // <-- FIXED

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

// Validates course/category/[hwNumber/]filename and returns the bucket key,
// or throws with a user-facing message.
function buildKey({ course, category, hwNumber, filename }) {
  if (!COURSES.includes(course)) throw new Error(`Unknown course: ${course}`);
  if (!CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}`);
  if (!filename || /[\/\\]/.test(filename)) throw new Error("Invalid filename");

  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS[category].includes(ext)) {
    throw new Error(`Extension ${ext} not allowed for ${category}`);
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

module.exports = { b2, BUCKET, COURSES, CATEGORIES, ALLOWED_EXTENSIONS, MAX_FILE_BYTES, corsHeaders, json, buildKey };
