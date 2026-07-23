document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const filePlaceholder = document.getElementById("filePlaceholder");
    const categorySelect = document.getElementById("categorySelect");
    const courseSelect = document.getElementById("courseSelect");
    const hwNumberWrapper = document.getElementById("hwNumberWrapper");
    const hwNumber = document.getElementById("hwNumber");
    const uploadSecret = document.getElementById("uploadSecret");
    const uploadBtn = document.getElementById("uploadBtn");
    const progressWrapper = document.getElementById("progressWrapper");
    const progressBar = document.getElementById("progressBar");
    const statusText = document.getElementById("status");

    // 100 MB Limit
    const MAX_FILE_SIZE = 100 * 1024 * 1024;

    // Toggle HW Subfolder Input
    if (categorySelect && hwNumberWrapper) {
        categorySelect.addEventListener("change", () => {
            if (categorySelect.value === "HW") {
                hwNumberWrapper.classList.remove("hidden");
                if (hwNumber) hwNumber.setAttribute("required", "required");
            } else {
                hwNumberWrapper.classList.add("hidden");
                if (hwNumber) {
                    hwNumber.removeAttribute("required");
                    hwNumber.value = "";
                }
            }
        });
    }

    // File Input UI Change Handler
    if (fileInput && filePlaceholder) {
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                filePlaceholder.textContent = `${file.name} (${sizeInMB} MB)`;
            } else {
                filePlaceholder.textContent = "Choose any file (Max 100MB)";
            }
        });
    }

    // Form Submission
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const file = fileInput ? fileInput.files[0] : null;
            if (!file) {
                showStatus("Please select a file to upload.", true);
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                showStatus("File size exceeds the 100MB maximum limit.", true);
                return;
            }

            const course = courseSelect ? courseSelect.value : "";
            const category = categorySelect ? categorySelect.value : "";
            const secret = uploadSecret ? uploadSecret.value.trim() : "";

            if (!course || !category || !secret) {
                showStatus("Please fill in all required fields.", true);
                return;
            }

            let folder = category;
            if (category === "HW" && hwNumber) {
                const hwNum = hwNumber.value.trim().padStart(2, "0");
                if (!hwNum) {
                    showStatus("Please specify a Homework number.", true);
                    return;
                }
                folder = `HW/${hwNum}`;
            }

            // Set UI to loading state
            setUploadingState(true);
            showStatus("Requesting pre-signed URL...", false);
            updateProgress(5);

            try {
                const contentType = file.type || "application/octet-stream";

                // Step 1: Call Netlify Function for presigned URL
                const presignRes = await fetch("/.netlify/functions/presign-upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: file.name,
                        fileType: contentType,
                        fileSize: file.size,
                        courseCode: course,
                        category: folder,
                        secret: secret
                    })
                });

                const presignData = await presignRes.json();

                if (!presignRes.ok) {
                    throw new Error(presignData.error || "Failed to generate presigned upload URL.");
                }

                const { uploadUrl } = presignData;
                showStatus("Uploading file to cloud storage...", false);
                updateProgress(15);

                // Step 2: Upload directly to Backblaze B2 using pre-signed PUT URL
                await uploadFileWithProgress(uploadUrl, file, contentType, (percent) => {
                    const mappedPercent = Math.min(15 + Math.round((percent * 85) / 100), 99);
                    updateProgress(mappedPercent);
                });

                updateProgress(100);
                showStatus("Upload successful!", false);

                // Reset form
                uploadForm.reset();
                if (filePlaceholder) filePlaceholder.textContent = "Choose any file (Max 100MB)";
                if (hwNumberWrapper) hwNumberWrapper.classList.add("hidden");

            } catch (err) {
                console.error("Upload Error:", err);
                showStatus(err.message || "An unexpected error occurred during upload.", true);
                updateProgress(0);
            } finally {
                setUploadingState(false);
            }
        });
    }

    // File PUT transfer with progress via XMLHttpRequest
    function uploadFileWithProgress(url, file, contentType, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);
            xhr.setRequestHeader("Content-Type", contentType);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Storage server error (HTTP ${xhr.status}).`));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Network connection error during file transfer. Check CORS or network status."));
            };

            xhr.ontimeout = () => {
                reject(new Error("Upload request timed out. Please retry."));
            };

            xhr.send(file);
        });
    }

    function setUploadingState(isUploading) {
        if (uploadBtn) {
            uploadBtn.disabled = isUploading;
            uploadBtn.textContent = isUploading ? "Uploading..." : "Upload Material";
        }
        if (progressWrapper) {
            if (isUploading) progressWrapper.classList.remove("hidden");
        }
    }

    function updateProgress(percent) {
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    function showStatus(msg, isError) {
        if (!statusText) return;
        statusText.textContent = msg;
        statusText.className = isError
            ? "text-red-500 dark:text-red-400 text-sm text-center block mt-2 font-medium"
            : "text-indigo-600 dark:text-indigo-400 text-sm text-center block mt-2 font-medium";
    }
});