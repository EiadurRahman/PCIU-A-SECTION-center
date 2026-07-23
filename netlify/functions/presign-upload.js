const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  s3Client, // <-- Make sure this is named s3Client
  BUCKET,
  MAX_FILE_BYTES,
  corsHeaders,
  json,
  buildKey,
} = require("./_b2-client");

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    // Secret validation
    const secret = event.headers["x-upload-secret"];
    if (!secret || secret !== process.env.UPLOAD_SECRET) {
      return json(401, { error: "Unauthorized: Invalid upload secret" });
    }

    const body = JSON.parse(event.body || "{}");
    const { course, category, hwNumber, filename, contentType, fileSize } = body;

    if (fileSize && fileSize > MAX_FILE_BYTES) {
      return json(400, { error: "File exceeds 100MB limit" });
    }

    const key = buildKey({ course, category, hwNumber, filename });

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    // Generate presigned URL with 5-minute expiration
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return json(200, { uploadUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return json(400, { error: err.message || "Failed to generate presigned URL" });
  }
};