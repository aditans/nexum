


var modal1 = document.getElementById("myModal");


var btn1 = document.getElementById("user-modal");



var span = document.getElementsByClassName("close-modal");


btn1.onclick = function() {
  modal1.style.display = "block";
}





Array.from(span).forEach(function(btn) {
    btn.onclick = function() {
        btn.closest(".modal").style.display = "none";
    };
  });









window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadCoursesDropdown();
    await loadSectionsTable();
});

async function loadCoursesDropdown() {
    try {
        const response = await fetch("http://localhost:5001/courses");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            const courses = data.courses;
            const selectCoursesContainer = document.getElementById("select-courses");

            const selectDropdown = document.createElement("select");
            selectDropdown.setAttribute("id", "course-select");
            selectDropdown.setAttribute("name", "course");

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Select a Course";
            defaultOption.value = "";
            selectDropdown.appendChild(defaultOption);

            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.course_id;
                option.textContent = `${course.name} (${course.dept}${course.course_id})`;
                selectDropdown.appendChild(option);
            });

            selectCoursesContainer.appendChild(selectDropdown);
        } else {
            console.error("Error fetching courses:", data.message);
        }
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function loadSectionsTable() {
    try {
        const response = await fetch("http://localhost:5001/sections");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            const sections = data.sections;
            sections.forEach(section => {
                const tr = document.createElement('tr');
                const trContent = `
                    <td>${section.course_id}</td>
                    <td>${section.section_id}</td>
                    <td>${section.year}</td>
                    <td>${section.location}</td>
                    
                `;
                tr.innerHTML = trContent;
                document.querySelector('table tbody').appendChild(tr);

                var modal = document.getElementById("myModal-details");



                var btn = document.getElementsByClassName("primary");



                Array.from(btn).forEach(function(btn) {
                    btn.onclick = function() {
                    modal.style.display = "block";
                    };
                });
                window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                    else if (event.target == modal1) {
                      modal1.style.display = "none";
                    }
                  }


            });
        } else {
            console.error("Error fetching sections:", data.message);
        }
    } catch (error) {
        console.error("Error loading sections:", error);
    }
}

//////
const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

document.querySelector(".modal-button").addEventListener("click", async function () {
    const sectionId = document.getElementById("section-id").value;
    const year = document.getElementById("section-year").value;
    const slocation = document.getElementById("section-location").value;
    const courseId = document.getElementById("course-select").value;

    if (!sectionId || !year || !slocation || !courseId) {
        alert("Please fill all fields and select a course.");
        return;
    }

    const sectionData = {
        section_id: sectionId,
        year: year,
        location: slocation,
        course_id: courseId
    };

    try {
        const response = await fetch("http://localhost:5001/add-section", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sectionData)
        });

        const result = await response.json();
        console.log(result);
        if (result.success) {
            alert("Section added successfully!");
            // Optionally: close modal, clear fields, etc.
            location.reload();
        } else {
            alert("Failed to add section: " + result.message);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong!");
    }
});
