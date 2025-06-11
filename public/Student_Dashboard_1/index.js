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
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      switch (radio.value) {
        case 'student':
          roleDescription.textContent = 'Assign Section to Student.';
          var search = document.getElementById("select-courses");
          search.style.display = "block";
          var contain = document.getElementById("admin-type-container");
          contain.style.display = "none";
          break;
        case 'faculty':
            var search = document.getElementById("select-courses");
          search.style.display = "block";
          roleDescription.textContent = 'Select Section for faculty';
          var contain = document.getElementById("admin-type-container");
          contain.style.display = "none"; 
          break;
        case 'admin':
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
        const courseId = selectedOption?.getAttribute('data-course-id') || null;

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
}

async function loadUsers() {
    try {
        const response = await fetch("http://localhost:5001/users");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
            const users = data.users;
            users.forEach(user => {
                const tr = document.createElement('tr');
                const trContent = `
                    <td>${user.user_id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td class="${user.role === 'admin' ? 'danger' : user.role === 'faculty' ? 'warning' : 'medium'}">${user.role}</td>
                    <td class="primary" id="primary">Details</td>
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
            console.error("Error fetching users:", data.message);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
