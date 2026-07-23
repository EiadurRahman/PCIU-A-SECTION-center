// POST /.netlify/functions/presign-upload
// Body: { course, category, hwNumber?, filename, contentType, fileSize }
// Header: x-upload-secret (must match UPLOAD_SECRET env var)
// Returns: { url, key } — browser then PUTs the file directly to `url`.
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const { b2, BUCKET, MAX_FILE_BYTES, corsHeaders, json, buildKey } = require("./_b2-client");
const {
  s3Client, // <-- Make sure this is named s3Client
  BUCKET,
  MAX_FILE_BYTES,
  corsHeaders,
  json,
  buildKey,
} = require("./_b2-client");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  if (event.headers["x-upload-secret"] !== process.env.UPLOAD_SECRET) {
    return json(401, { error: "Unauthorized" });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { course, category, hwNumber, filename, contentType, fileSize } = body;

  if (typeof fileSize === "number" && fileSize > MAX_FILE_BYTES) {
    return json(413, { error: `File exceeds ${MAX_FILE_BYTES / (1024 * 1024)}MB limit` });
  }

  let key;
  try {
    key = buildKey({ course, category, hwNumber, filename });
  } catch (err) {
    return json(400, { error: err.message });
  }

  try {
    const url = await getSignedUrl(
      b2,
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType || "application/octet-stream",
      }),
      { expiresIn: 300 } // 5 minutes
    );
    return json(200, { url, key });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to create upload URL" });
  }
};
