document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const courseSelect = document.getElementById("courseSelect");
  const categorySelect = document.getElementById("categorySelect");
  const hwNumberWrapper = document.getElementById("hwNumberWrapper");
  const hwNumber = document.getElementById("hwNumber");
  const uploadSecret = document.getElementById("uploadSecret");
  const fileInput = document.getElementById("fileInput");
  const filePlaceholder = document.getElementById("filePlaceholder");
  const progressWrapper = document.getElementById("progressWrapper");
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("status");
  const uploadBtn = document.getElementById("uploadBtn");

  const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

  // Toggle Homework input visibility
  categorySelect.addEventListener("change", () => {
    hwNumberWrapper.classList.toggle("hidden", categorySelect.value !== "HW");
  });

  // Display selected filename and size
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      filePlaceholder.textContent = `${file.name} (${sizeMB} MB)`;
    } else {
      filePlaceholder.textContent = "Click to select a file";
    }
    clearStatus();
  });

  // Handle Form Submission
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (fileInput.files.length === 0) {
      return showStatus("Please select a file first.", "error");
    }
    if (!uploadSecret.value.trim()) {
      return showStatus("Enter the upload password.", "error");
    }
    if (categorySelect.value === "HW" && !hwNumber.value.trim()) {
      return showStatus("Enter an assignment number.", "error");
    }

    const file = fileInput.files[0];
    if (file.size > MAX_FILE_BYTES) {
      return showStatus("File exceeds maximum limit of 100MB.", "error");
    }

    uploadBtn.disabled = true;
    showStatus("Requesting upload URL…", "info");

    try {
      const contentType = file.type || "application/octet-stream";

      const presignRes = await fetch("/.netlify/functions/presign-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-secret": uploadSecret.value.trim()
        },
        body: JSON.stringify({
          course: courseSelect.value,
          category: categorySelect.value,
          hwNumber: categorySelect.value === "HW" ? hwNumber.value.trim() : undefined,
          filename: file.name,
          contentType: contentType,
          fileSize: file.size
        })
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData.error || "Could not get upload URL");
      }

      const targetUrl = presignData.url || presignData.uploadUrl;
      showStatus("Uploading…", "info");
      progressWrapper.classList.remove("hidden");

      await putWithProgress(targetUrl, file, contentType);

      showStatus("Uploaded successfully.", "success");
      uploadForm.reset();
      filePlaceholder.textContent = "Click to select a file";
      hwNumberWrapper.classList.add("hidden");

    } catch (err) {
      console.error("Upload error:", err);
      showStatus(err.message || "Upload failed.", "error");
    } finally {
      uploadBtn.disabled = false;
      progressWrapper.classList.add("hidden");
      progressBar.style.width = "0%";
    }
  });

  function putWithProgress(url, file, contentType) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          progressBar.style.width = `${percent}%`;
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Storage returned HTTP ${xhr.status}. Upload failed.`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network connection error or CORS blocked during upload."));
      };

      xhr.send(file);
    });
  }

  function showStatus(text, type) {
    statusText.textContent = text;
    statusText.className =
      "text-sm font-medium text-center min-h-[20px] " +
      (type === "error"
        ? "text-rose-500"
        : type === "success"
        ? "text-emerald-500"
        : "text-amber-500");
  }

  function clearStatus() {
    statusText.textContent = "";
  }
});