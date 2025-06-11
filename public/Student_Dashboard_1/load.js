document.addEventListener('DOMContentLoaded', () => {
    async function loadDashboardStats() {
        try {
          const res = await fetch('http://localhost:5001/dashboard/stats');
          const data = await res.json();
    
          if (data.success) {
            const stats = data.data;
            const totalUsers = stats.total_users;
            const faculty = stats.total_faculty;
            const students = stats.total_students;
    
            document.getElementById('total-users').textContent = totalUsers;
            document.getElementById('total-faculty').textContent = faculty;
            document.getElementById('total-students').textContent = students;
    
            document.getElementById('faculty-percent').textContent =
              ((faculty / totalUsers) * 100).toFixed(1) + '%';
            document.getElementById('student-percent').textContent =
              ((students / totalUsers) * 100).toFixed(1) + '%';
    
            document.getElementById('total-resources').textContent = stats.total_resources;
            document.getElementById('total-courses').textContent = stats.total_courses;
            document.getElementById('total-enrollments').textContent = stats.total_enrollments;
            document.getElementById('total-credits').textContent = stats.total_credits;
          }
        } catch (error) {
          console.error('Failed to load dashboard stats:', error);
        }
      }
    
      window.onload = loadDashboardStats;
    
    



});
  