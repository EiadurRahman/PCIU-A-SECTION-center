// netlify/functions/upload.js
const { Buffer } = require('buffer');

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { fileName, fileData } = data; // fileData must be a base64 encoded string

    if (!fileName || !fileData) {
      return { statusCode: 400, body: 'Missing fileName or fileData' };
    }

    // Retrieve GitHub credentials from Netlify environment variables
    const GITHUB_TOKEN = process.env.GITHUB_PAT;
    const REPO_OWNER = "EiadurRahman"; // Replace with your GitHub username
    const REPO_NAME = "PCIU-A-SECTION-center";       // Replace with your Hugo project repository name
    const BRANCH = "main";                     // Replace with your target branch (e.g., main or master)

    const path = `uploads/${fileName}`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    // Clean up base64 prefix if present (e.g. "data:image/png;base64,...")
    const base64Content = fileData.split(',')[1] || fileData;

    // Optional: Check if the file already exists on GitHub to get its SHA (required for updating files)
    let sha;
    try {
      const getFileResponse = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      if (getFileResponse.status === 200) {
        const fileInfo = await getFileResponse.json();
        sha = fileInfo.sha;
      }
    } catch (e) {
      // File does not exist yet; proceed without a SHA
    }

    // Upload / Update file on GitHub
    const githubResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Netlify-Serverless-Function'
      },
      body: JSON.stringify({
        message: `Upload ${fileName} via Web Form`,
        content: base64Content,
        branch: BRANCH,
        sha: sha // If undefined, GitHub creates a new file. If present, it updates it.
      })
    });

    if (githubResponse.status === 201 || githubResponse.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Successfully uploaded ${fileName} to GitHub uploads/!` })
      };
    } else {
      const errorMsg = await githubResponse.text();
      return {
        statusCode: githubResponse.status,
        body: `GitHub API error: ${errorMsg}`
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};