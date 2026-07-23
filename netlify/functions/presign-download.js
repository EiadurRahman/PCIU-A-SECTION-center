// GET /.netlify/functions/presign-download?key=<bucket-key>
// Returns: { url } — a short-lived presigned GET URL.
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { b2, BUCKET, corsHeaders, json } = require("./_b2-client");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "GET") return json(405, { error: "GET only" });

  const key = event.queryStringParameters && event.queryStringParameters.key;
  if (!key) return json(400, { error: "Missing key" });

  try {
    const url = await getSignedUrl(
      b2,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 300 }
    );
    return json(200, { url });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to create download URL" });
  }
};
