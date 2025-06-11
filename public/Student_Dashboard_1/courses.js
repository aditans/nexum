


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







    const addCourseBtn = document.getElementById("add-course-btn");


    // Send course data to server on "Add Course" button click
    addCourseBtn.onclick = async function() {
        const course_id = document.getElementById("course_id").value;
        const course_name = document.getElementById("course_name").value;
        const course_credits = document.getElementById("course_credits").value;
        const course_dept = document.getElementById("course_dept").value;

        if (!course_id || !course_name || !course_credits || !course_dept) {
            alert("All fields must be filled!");
            return;
        }

        // Create an object with course data
        const courseData = {
            course_id: course_id,
            name: course_name,
            dept: course_dept,
            credits: course_credits
        };

        try {
            const response = await fetch("http://localhost:5001/add-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(courseData)
            });

            const result = await response.json();
            if (result.success) {
                alert("Course added successfully!");
                modal1.style.display = "none"; 
                location.reload();// Close the modal
            } else {
                alert("Error adding course. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again."+error.stringify());
        }
    }





    document.addEventListener("DOMContentLoaded", async function () {
        
        await loadCoursesTable();
    });
    

    
    async function loadCoursesTable() {
        try {
            const response = await fetch("http://localhost:5001/courses");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            if (data.success) {
                const Courses = data.courses;
                Courses.forEach(course => {
                    const tr = document.createElement('tr');
                    const trContent = `
                        <td>${course.course_id}</td>
                        <td>${course.name}</td>
                        <td>${course.dept}</td>
                        <td>${course.credits}</td>
                        <td class="primary">Details</td>
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
    
    
   