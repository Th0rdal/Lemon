
let dropArea = null;
let fileList = null;

// Handle file upload
function handleDrop(e) {
  const files = e.dataTransfer.files; // Get the dropped files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileList.innerHTML += `<div>${file.name}</div>`; // Display the file names
    // Perform additional actions like uploading the file to the server
      console.log("UPLOADED")
  }
}

// Prevent default drag and drop behavior
function preventDefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight the drop area
function highlight() {
  dropArea.classList.add('highlight');
}

// Remove highlight from the drop area
function unhighlight() {
  dropArea.classList.remove('highlight');
}

window.addEventListener("load", function() {
    // Get references to the drop area and file list
    dropArea = document.getElementById('drop-area');
    fileList = document.getElementById('file-list');

    // Prevent default behavior for drag events
    dropArea.addEventListener('dragenter', preventDefault, false);
    dropArea.addEventListener('dragover', preventDefault, false);
    dropArea.addEventListener('dragleave', preventDefault, false);
    dropArea.addEventListener('drop', preventDefault, false);

    // Highlight drop area when dragging over it
    dropArea.addEventListener('dragenter', highlight, false);
    dropArea.addEventListener('dragover', highlight, false);

    // Remove highlight when leaving the drop area
    dropArea.addEventListener('dragleave', unhighlight, false);
    dropArea.addEventListener('drop', unhighlight, false);

    // Handle file drop
    dropArea.addEventListener('drop', handleDrop, false);
})