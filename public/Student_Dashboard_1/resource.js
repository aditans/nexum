let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";
  numOfFiles.textContent = `${fileInput.files.length} Files Selected`;

  for (i of fileInput.files) {
    let reader = new FileReader();
    let listItem = document.createElement("li");
    let fileName = i.name;
    let fileSize = (i.size / 1024).toFixed(1);
    listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}KB</p>`;
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}MB</p>`;
    }
    fileList.appendChild(listItem);
  }
});




document.addEventListener("DOMContentLoaded", async function () {
  try {
      const response = await fetch("http://localhost:5001/resources");
      const data = await response.json();

      if (data.success) {
          const resourceContainer = document.querySelector(".resources");
          resourceContainer.innerHTML = ""; // Clear existing content

          data.resources.forEach((res, i) => {
              const notificationDiv = document.createElement("div");
              notificationDiv.className = `notification${i === 0 ? "" : " deactive"}`;

              notificationDiv.innerHTML = `
                  <div class="icon">
                      <span class="material-icons-sharp">
                          ${res.file_type.includes("img") || res.file_type.includes("jpg") || res.file_type.includes("jpeg") ? "image" : "description"}
                      </span>
                  </div>
                  <div class="content">
                      <div class="info">
                          <h3>${res.file_name}</h3>
                          <small class="text_muted">
                              Uploaded by - ${res.uploaded_by}
                          </small>
                      </div>
                      <div class="download-button" 
                          data-resource-id="${res.resource_id}" 
                          style="border-radius:20px; height:40px;width:40px;background-color:#e0e0e0; display:flex; align-items:center; justify-content:center;">
                          <span class="material-icons-sharp">
                              download
                          </span>
                      </div>
                  </div>
              `;


              resourceContainer.appendChild(notificationDiv);

              document.addEventListener("click", function (e) {
                const downloadBtn = e.target.closest(".download-button");
                if (downloadBtn) {
                    const resourceId = downloadBtn.dataset.resourceId;
                    if (resourceId) {
                        // Trigger the download
                        window.location.href = `http://localhost:5001/resources/${resourceId}/download`;
                    }
                }
            });
            
          });
      } else {
          console.error("Error fetching resources:", data.message);
      }
  } catch (error) {
      console.error("Fetch error:", error);
  }
});






const filesList = document.getElementById("files-list");



// When upload button is clicked
document.getElementById('resource-upload-button').addEventListener('click', async () => {
  const input = document.getElementById('file-input');
  const files = input.files;
  //const course_id = document.getElementById('course_id') ? document.getElementById('course_id').value : 1222;
const uploaded_by = document.getElementById('uploaded_by') ? document.getElementById('uploaded_by').value : localStorage.getItem('user_id');


  

  if (!files.length) {
      alert("No file selected");
      return;
  }

  for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      //formData.append("course_id", course_id);
      formData.append("uploaded_by", uploaded_by);

      const res = await fetch("http://localhost:5001/upload-resource", {
          method: "POST",
          body: formData
      });

      const data = await res.json();
      if (data.success) {
          console.log(`${files[i].name} uploaded successfully`);
          location.reload();
      } else {
          console.error(data.message);
      }
  }

  input.value = ""; // clear file input
  document.getElementById('files-list').innerHTML = '';
  document.getElementById('num-of-files').innerText = 'No Files Chosen';

  fetchResources(course_id); // Refresh the displayed list
});