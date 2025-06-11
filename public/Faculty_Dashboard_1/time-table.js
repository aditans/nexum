const faculty_id = localStorage.getItem('user_id');

document.addEventListener("DOMContentLoaded", () => {
     

    fetch(`http://localhost:5001/timetable/faculty/${faculty_id}`)
        .then(response => response.json())
        .then(data => {
            const timeMap = {
                "09:30:00": "9:30",
                "10:20:00": "10:20",
                "11:10:00": "11:10",
                "12:40:00": "12:40",
                "13:30:00": "13:30",
                "14:20:00": "14:20",
                "15:10:00": "15:10"
            };

            // Initialize all slots with a "-"
            const allCells = document.querySelectorAll("td[id]");
            allCells.forEach(cell => {
                cell.textContent = "-";
            });

            // Fill the timetable with course names and teacher names
            data.forEach(entry => {
                const day = entry.day.toLowerCase(); // e.g., "monday"
                const time = timeMap[entry.time];   // e.g., "9:30"
                const cellId = `${day}-${time}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    const courseDetails = `${entry.course_name} / Dr. ${entry.faculty_name}`;
                    cell.textContent = courseDetails;
                }
            });
        })
        .catch(error => console.error("Failed to load timetable:", error));
});

document.addEventListener("DOMContentLoaded", () => {
    
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");

    const dayMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const periodMap = {
        1: "9:30-10:20",
        2: "10:20-11:10",
        3: "11:10-12:00",
        4: "12:40-1:30",
        5: "1:30-2:20",
        6: "2:20-3:10",
        7: "3:10-4:00"
    };

    const confirmationModal = document.createElement("div");
    confirmationModal.style.position = "fixed";
    confirmationModal.style.top = "50%";
    confirmationModal.style.left = "50%";
    confirmationModal.style.transform = "translate(-50%, -50%)";
    confirmationModal.style.padding = "20px";
    confirmationModal.style.backgroundColor = "#fff";
    confirmationModal.style.border = "1px solid #000";
    confirmationModal.style.zIndex = 1000;
    confirmationModal.style.display = "none";
    document.body.appendChild(confirmationModal);

    function showModal(message) {
        confirmationModal.innerHTML = `<p>${message}</p><button id="closeModal">OK</button>`;
        confirmationModal.style.display = "block";
        document.getElementById("closeModal").onclick = () => {
            confirmationModal.style.display = "none";
        };
    }

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        let periodNum = 1; // Initialize period number here

        for (let j = 1; j < cells.length; j++) {
            const cell = cells[j];
            if (!cell.classList.contains("special")) {
                const currentPeriod = periodNum; // capture correct period number before it changes
        
                if (cell.textContent.trim() !== "") {
                    cell.style.cursor = "pointer";
                    const courseName = cell.textContent.trim();
        
                    cell.addEventListener("click", async () => {
                        const day = dayMap[i - 1];
                        const period = `Period ${currentPeriod}`;
                        const section = "CSE-A"; // This can be dynamic
                         // Replace dynamically later
        
                        const scheduleData = {
                            faculty_id,
                            day,
                            period
                        };
        
                        try {
                            const res = await fetch("http://localhost:5001/add-to-schedule", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(scheduleData)
                            });
        
                            const result = await res.json();
                            if (result.success) {
                                showModal(`Added ${courseName} to schedule on ${day} ${period}`);
                            } else {
                                showModal(`Failed: ${result.message}`);
                            }
                        } catch (err) {
                            console.error(err);
                            showModal("Error adding to schedule.");
                        }
                    });
                }
        
                periodNum++; // always increment after processing the cell
            }
        }
        
    }
});
