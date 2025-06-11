document.addEventListener("DOMContentLoaded", () => {
    const studentId = localStorage.getItem('user_id');
    // replace with session/cookie logic later

    fetch(`http://localhost:5001/timetable/student/${studentId}`)
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
