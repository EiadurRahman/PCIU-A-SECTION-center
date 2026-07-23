document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const courseSelect = document.getElementById("courseSelect");
    const categorySelect = document.getElementById("categorySelect");
    const hwNumberWrapper = document.getElementById("hwNumberWrapper");
    const hwNumber = document.getElementById("hwNumber");
    const uploadSecret = document.getElementById("uploadSecret");
    const fileInput = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");
    const filePlaceholder = document.getElementById("filePlaceholder");
    const progressWrapper = document.getElementById("progressWrapper");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const progressSpeed = document.getElementById("progressSpeed");
    const statusText = document.getElementById("status");
    const uploadBtn = document.getElementById("uploadBtn");

    //   const MAX_FILE_BYTES = 25 * 1024 * 1024; // Sync with _b2-client.js limit (25MB)
    const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

    // Allow any file type for uploads so teachers/students can submit the formats they need.
    const ALLOWED_EXTENSIONS = {
        "CLS-CONTENT": null,
        "CLS-NOTE": null,
        "HW": null,
    };

    // Toggle Homework input visibility on select
    categorySelect.addEventListener("change", () => {
        const isHW = categorySelect.value === "HW";
        hwNumberWrapper.classList.toggle("hidden", !isHW);
        if (isHW) hwNumber.focus();
        validateSelectedFile();
    });

    // Handle Drag & Drop Events
    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("border-indigo-500", "bg-indigo-500/10");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("border-indigo-500", "bg-indigo-500/10");
        });
    });

    dropZone.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelected();
        }
    });

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", handleFileSelected);

    function handleFileSelected() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const sizeFormatted = formatBytes(file.size);
            filePlaceholder.innerHTML = `<span class="font-semibold text-indigo-600 dark:text-indigo-400">${file.name}</span> (${sizeFormatted})`;
            validateSelectedFile();
        } else {
            filePlaceholder.innerHTML = 'Drag and drop your file here, or <span class="text-indigo-600 dark:text-indigo-400 underline">browse</span>';
            clearStatus();
        }
    }

    function validateSelectedFile() {
        if (fileInput.files.length === 0) return true;

        const file = fileInput.files[0];
        const category = categorySelect.value;
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

        if (file.size > MAX_FILE_BYTES) {
            showStatus(`File size exceeds max limit of ${formatBytes(MAX_FILE_BYTES)}.`, "error");
            return false;
        }

        // ALLOW ALL EXTENSIONS SAFE CHECK
        const allowed = ALLOWED_EXTENSIONS[category];
        if (allowed !== null && Array.isArray(allowed) && !allowed.includes(ext)) {
            showStatus(`Format "${ext}" is not permitted for ${categorySelect.options[categorySelect.selectedIndex].text}.`, "error");
            return false;
        }

        clearStatus();
        return true;
    }

    // Handle Form Submission
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (fileInput.files.length === 0) {
            return showStatus("Please choose or drop a file to upload.", "error");
        }
        if (!uploadSecret.value.trim()) {
            return showStatus("Access password is required.", "error");
        }
        if (categorySelect.value === "HW" && !hwNumber.value.trim()) {
            return showStatus("Assignment number is required for Homework uploads.", "error");
        }
        if (!validateSelectedFile()) return;

        const file = fileInput.files[0];
        uploadBtn.disabled = true;
        showStatus("Initializing secure upload...", "info");

        try {
            const contentType = file.type || "application/octet-stream";

            // 1. Request presigned PUT URL from Netlify function
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
                throw new Error(presignData.error || "Authorization failed or invalid payload.");
            }

            // 2. Perform direct storage PUT with progress tracking
            showStatus("Uploading asset...", "info");
            progressWrapper.classList.remove("hidden");

            await putWithProgress(presignData.url, file, contentType);

            showStatus("File successfully uploaded to library!", "success");

            // Reset Form State
            uploadForm.reset();
            filePlaceholder.innerHTML = 'Drag and drop your file here, or <span class="text-indigo-600 dark:text-indigo-400 underline">browse</span>';
            hwNumberWrapper.classList.add("hidden");

        } catch (err) {
            console.error("Upload error:", err);
            showStatus(err.message || "Upload failed.", "error");
        } finally {
            uploadBtn.disabled = false;
            progressWrapper.classList.add("hidden");
            resetProgress();
        }
    });

    function putWithProgress(url, file, contentType) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);
            xhr.setRequestHeader("Content-Type", contentType);

            let startTime = Date.now();

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
                    const speedBytesPerSec = elapsedTime > 0 ? e.loaded / elapsedTime : 0;

                    progressBar.style.width = `${percent}%`;
                    progressPercent.textContent = `${percent}%`;
                    progressSpeed.textContent = `${formatBytes(speedBytesPerSec)}/s`;
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
                reject(new Error("Network connection lost or CORS error during upload."));
            };

            xhr.send(file);
        });
    }

    function showStatus(text, type) {
        statusText.textContent = text;
        statusText.className =
            "text-sm font-medium text-center min-h-[20px] " +
            (type === "error"
                ? "text-rose-500 dark:text-rose-400"
                : type === "success"
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-amber-500 dark:text-amber-400");
    }

    function clearStatus() {
        statusText.textContent = "";
    }

    function resetProgress() {
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
        progressSpeed.textContent = "0 KB/s";
    }

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
});