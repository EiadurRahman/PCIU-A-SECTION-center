// GET /.netlify/functions/list-files
// Returns every object in the bucket as a flat list; the client builds the
// course -> category -> (subfolder) -> file tree from this.
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { b2, BUCKET, corsHeaders, json } = require("./_b2-client");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "GET") return json(405, { error: "GET only" });

  try {
    let files = [];
    let ContinuationToken;

    do {
      const res = await b2.send(new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken,
      }));
      for (const obj of res.Contents || []) {
        if (obj.Key.endsWith("/")) continue; // skip folder placeholder objects
        files.push({ key: obj.Key, size: obj.Size, lastModified: obj.LastModified });
      }
      ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (ContinuationToken);

    return json(200, { files });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to list bucket" });
  }
};
