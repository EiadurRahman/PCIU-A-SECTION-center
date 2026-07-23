const { PutObjectCommand, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  s3Client,
  BUCKET,
  MAX_FILE_BYTES,
  corsHeaders,
  json,
  buildKey,
} = require("./_b2-client");

exports.handler = async (event) => {
  // Handle CORS preflight for Netlify Function calls
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    // 1. Secret validation
    const secret = event.headers["x-upload-secret"];
    if (!secret || secret !== process.env.UPLOAD_SECRET) {
      return json(401, { error: "Unauthorized: Invalid upload secret" });
    }

    const body = JSON.parse(event.body || "{}");
    const { course, category, hwNumber, filename, contentType, fileSize } = body;

    // 2. File size limit validation
    if (fileSize && fileSize > MAX_FILE_BYTES) {
      return json(400, { error: "File exceeds 100MB limit" });
    }

    // 3. Construct storage path key
    const key = buildKey({ course, category, hwNumber, filename });

    // 4. Force proper CORS configuration on Backblaze B2 bucket
    // This allows browser preflight OPTIONS requests with Content-Type header
    try {
      await s3Client.send(
        new PutBucketCorsCommand({
          Bucket: BUCKET,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedOrigins: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
                AllowedHeaders: ["*"],
                ExposeHeaders: ["ETag"],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        })
      );
    } catch (corsErr) {
      console.warn("Notice: Non-fatal CORS rule update warning:", corsErr.message);
    }

    // 5. Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return json(200, { uploadUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return json(400, { error: err.message || "Failed to generate presigned URL" });
  }
};