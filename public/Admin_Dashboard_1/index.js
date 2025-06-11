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






// Get all radio buttons
const radios = document.querySelectorAll('input[name="add-user-role"]');

// Target the text element
const roleDescription = document.getElementById('role-descriptor');

// Add listener to all radios
var faculty_flag=0;
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      switch (radio.value) {
        case 'student':
            faculty_flag=0;
            var search2 = document.getElementById("courseDropdown");
          search2.style.display = "none";
          roleDescription.textContent = 'Assign Section to Student.';
          var search = document.getElementById("select-courses");
          search.style.display = "block";
          var contain = document.getElementById("admin-type-container");
          contain.style.display = "none";
          
          break;
        case 'faculty':
            faculty_flag=1;
            roleDescription.textContent = 'Select Section  and course for faculty';
            var search2 = document.getElementById("courseDropdown");
            search2.style.display = "block";
            var search = document.getElementById("select-courses");
            search.style.display = "block";
            search2.style.width="300px";
            var contain = document.getElementById("admin-type-container");
           contain.style.display = "none";
            
            // Create or show courseDropdown
            

            // Load course options
    
            break;
        case 'admin':
            faculty_flag=0;
            var search2 = document.getElementById("courseDropdown");
          search2.style.display = "none";
          roleDescription.textContent = 'Enter Admin Type';
          var search = document.getElementById("select-courses");
          search.style.display = "none";
          const wrapper = document.createElement('div');
          wrapper.id = 'admin-type-container';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.margin = '20px 0px';

          const label = document.createElement('div');
          label.style.fontSize = 'large';
          label.style.fontWeight = 'bold';
          label.textContent = 'Admin Type:';

          const inputBox = document.createElement('div');
          inputBox.className = 'input-box';

          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Enter admin type';
          input.id = 'admin-type-input';

          inputBox.appendChild(input);
          wrapper.appendChild(label);
          wrapper.appendChild(inputBox);

          // Insert it below the roleDescription element
          roleDescription.insertAdjacentElement('afterend', wrapper);


          break;
      }
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal-button')?.addEventListener('click', () => {
        const name = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const userId = document.querySelector('#id').value;
        const password = document.querySelector('#password').value;

        const role = document.querySelector('input[name="add-user-role"]:checked')?.value;
        const adminTypeInput = document.getElementById('admin-type-input');
        const adminType = adminTypeInput ? adminTypeInput.value : null;

        const selectedOption = document.querySelector('#course-select')?.selectedOptions[0];
        const sectionId = selectedOption?.value || null;
        const year = selectedOption?.getAttribute('data-year') || null;
        const selectedOptioncourse = document.querySelector('#course-select-dropdown')?.selectedOptions[0];
        const courseId = selectedOptioncourse?.value || null;
        if(faculty_flag)
        {

            fetch('http://localhost:5001/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role, adminType, sectionId, year, courseId })
    
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    location.reload();
                }
            })
            .catch(err => console.error(err));

        }
        else{
            fetch('http://localhost:5001/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role, adminType, sectionId, year, courseId })
    
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    location.reload();
                }
            })
            .catch(err => console.error(err));

        }

        
    });
});




document.addEventListener("DOMContentLoaded", async function () {
    await loadSections();
    await loadUsers();
    
});

async function loadSections() {
    try {
        const response = await fetch("http://localhost:5001/sections");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
            const sections = data.sections;
            const selectCoursesContainer = document.getElementById("select-courses");

            const selectDropdown = document.createElement("select");
            selectDropdown.setAttribute("id", "course-select");
            selectDropdown.setAttribute("name", "course");

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Select a Section";
            defaultOption.value = "";
            selectDropdown.appendChild(defaultOption);

            sections.forEach(section => {
                const option = document.createElement("option");
                option.value = section.section_id;
                option.setAttribute('data-year', section.year);
                option.setAttribute('data-course-id', section.course_id); // Ensure course_id is in backend response
                option.textContent = `${section.section_id} (${section.year})`;
                selectDropdown.appendChild(option);
            });

            selectCoursesContainer.appendChild(selectDropdown);
        } else {
            console.error("Error fetching sections:", data.message);
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
    }

    try {
        const response = await fetch("http://localhost:5001/courses");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
            const courses = data.courses;
            const selectCoursesContainer = document.getElementById("courseDropdown");

            const selectDropdown = document.createElement("select");
            selectDropdown.setAttribute("id", "course-select-dropdown");
            selectDropdown.setAttribute("name", "course-dropdown");

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Select a Course";
            defaultOption.value = "";
            selectDropdown.appendChild(defaultOption);

            courses.forEach(section => {
                const option = document.createElement("option");
                option.value = section.course_id;
                option.setAttribute('data-name', section.name);
                option.setAttribute('data-course-id', section.course_id); // Ensure course_id is in backend response
                option.textContent = `${section.name} ${section.dept}(${section.course_id})`;
                selectDropdown.appendChild(option);
            });

            selectCoursesContainer.appendChild(selectDropdown);
        } else {
            console.error("Error fetching sections:", data.message);
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch("http://localhost:5001/users");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
            const users = data.users;
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = ''; // Clear previous rows

            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td class="${user.role === 'admin' ? 'danger' : user.role === 'faculty' ? 'warning' : 'medium'}">${user.role}</td>
                    <td class="primary" style="cursor:pointer;">Details</td>
                `;

                // Attach click event to the "Details" cell
                tr.querySelector('.primary').addEventListener('click', () => {
                    loadUserDetails(user.user_id); // Fetch and fill modal
                });

                tbody.appendChild(tr);
            });

        } else {
            console.error("Error fetching users:", data.message);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
async function loadUserDetails(userId) {
    try {
        const response = await fetch(`http://localhost:5001/user-profile/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
            const user = data.user;

            document.getElementById('modal-username').value = user.name || '';
            document.getElementById('modal-email').value = user.email || '';
            document.getElementById('modal-userid').value = user.user_id || '';
           

            // Set the user role (student, faculty, admin)
            document.getElementById('student').checked = user.role === 'student';
            document.getElementById('faculty').checked = user.role === 'faculty';
            document.getElementById('admin').checked = user.role === 'admin';

            // Dynamically update the role descriptor based on the user role
            const roleDescriptor = document.getElementById('role-descriptor-edit');
            const courseSectionInput = document.createElement('input');
            courseSectionInput.type = 'text';
            courseSectionInput.readOnly = true;
            courseSectionInput.style.marginTop = '10px';

            switch (user.role) {
                case 'student':
                    roleDescriptor.innerHTML = 'Section';
                    roleDescriptor.innerHTML = 'Section :' +user.section_id ;
                    break;
                case 'faculty':
                    roleDescriptor.innerHTML = 'Section & Course';
                    roleDescriptor.innerHTML = 'Section & Course :' +`${user.teaches[0].section_id || 'No Section Assigned'}, ${user.teaches[0].course_name || 'No Course Assigned'}`;
                    break;
                case 'admin':
                    roleDescriptor.innerHTML = 'Admin Type';
                    roleDescriptor.innerHTML = 'Admin Type :' +user.admin_type ;
                    break;
                default:
                    roleDescriptor.innerHTML = 'No Role Assigned';
                    roleDescriptor.innerHTML = '';
                    break;
            }

            // Insert the input below the role descriptor
            roleDescriptor.appendChild(courseSectionInput);

            // Show the modal
            document.getElementById("myModal-details").style.display = "block";
        } else {
            alert("Failed to fetch user data.");
        }
    } catch (err) {
        console.error('Error loading user details:', err);
    }
}


// Utility function to create a read-only input field
function createReadOnlyInput(value) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.disabled = true;
    input.className = "readonly-input";
    return input;
}

// Utility function to create a label and input field pair
function createLabelWithField(labelText, inputElement) {
    const labelContainer = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = labelText;
    label.className = "input-label"; // Optional class for styling
    
    labelContainer.appendChild(label);
    labelContainer.appendChild(inputElement);
    
    return labelContainer;
}
