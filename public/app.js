// File input handling
const fileInput = document.getElementById("fileInput");
const fileInputLabel = document.querySelector(".file-input-label");
const fileNameDisplay = document.getElementById("fileName");

// Update file name display when file is selected
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = `✓ Selected: ${fileInput.files[0].name}`;
    fileNameDisplay.classList.add("show");
  } else {
    fileNameDisplay.classList.remove("show");
  }
});

// Drag and drop handling
fileInputLabel.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileInputLabel.classList.add("dragover");
});

fileInputLabel.addEventListener("dragleave", () => {
  fileInputLabel.classList.remove("dragover");
});

fileInputLabel.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInputLabel.classList.remove("dragover");
  fileInput.files = e.dataTransfer.files;
  
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = `✓ Selected: ${fileInput.files[0].name}`;
    fileNameDisplay.classList.add("show");
  }
});

// Upload function
async function upload() {
  const fileInput = document.getElementById("fileInput");
  const progressSection = document.getElementById("progressSection");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const resultSection = document.getElementById("resultSection");
  const uploadBtn = document.getElementById("uploadBtn");
  const errorMessage = document.getElementById("errorMessage");

  // Reset error message
  errorMessage.style.display = "none";
  errorMessage.textContent = "";

  if (!fileInput.files.length) {
    showError("Please select a file first");
    return;
  }

  const file = fileInput.files[0];

  // Validate file size (max 2GB)
  const maxSize = 2 * 1024 * 1024 * 1024;
  if (file.size > maxSize) {
    showError("File size exceeds 2GB limit");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // Show progress section
  progressSection.style.display = "block";
  resultSection.style.display = "none";
  uploadBtn.disabled = true;
  progressBar.style.width = "0%";

  try {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        progressBar.style.width = percentComplete + "%";
        progressText.textContent = `⏳ Uploading... ${Math.round(percentComplete)}%`;
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);

          if (data.success) {
            progressBar.style.width = "100%";
            progressText.textContent = "✅ Upload Complete!";
            
            setTimeout(() => {
              displayResult(data.download);
            }, 500);
          } else {
            showError(data.message || "Upload failed");
            progressSection.style.display = "none";
          }
        } catch (err) {
          showError("Invalid response from server");
          progressSection.style.display = "none";
        }
      } else {
        showError("Upload failed with status: " + xhr.status);
        progressSection.style.display = "none";
      }
      uploadBtn.disabled = false;
    });

    xhr.addEventListener("error", () => {
      showError("Network error during upload");
      progressSection.style.display = "none";
      uploadBtn.disabled = false;
    });

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);

  } catch (err) {
    showError("Error uploading file: " + err.message);
    progressSection.style.display = "none";
    uploadBtn.disabled = false;
  }
}

// Display result
function displayResult(downloadPath) {
  const resultSection = document.getElementById("resultSection");
  const successMessage = document.getElementById("successMessage");
  const downloadLink = document.getElementById("downloadLink");
  const downloadButton = document.getElementById("downloadButton");
  const progressSection = document.getElementById("progressSection");

  const downloadURL = `${window.location.origin}${downloadPath}`;

  successMessage.textContent = "🎉 Your file has been uploaded successfully!";
  downloadLink.value = downloadURL;
  downloadButton.href = downloadURL;

  progressSection.style.display = "none";
  resultSection.style.display = "block";
}

// Copy to clipboard
function copyToClipboard() {
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.select();
  document.execCommand("copy");
  
  const copyBtn = event.target.closest(".copy-btn");
  const originalText = copyBtn.innerHTML;
  
  copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>Copied!';
  copyBtn.style.color = "#86efac";
  
  setTimeout(() => {
    copyBtn.innerHTML = originalText;
    copyBtn.style.color = "";
  }, 2000);
}

// Reset form
function resetForm() {
  fileInput.value = "";
  fileNameDisplay.classList.remove("show");
  document.getElementById("progressSection").style.display = "none";
  document.getElementById("resultSection").style.display = "none";
  document.getElementById("uploadBtn").disabled = false;
  document.getElementById("progressBar").style.width = "0%";
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = "❌ " + message;
  errorMessage.style.display = "block";
}