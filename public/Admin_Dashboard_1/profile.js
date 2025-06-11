const userId = localStorage.getItem('user_id');
console.log(userId); // Fetch userId from localStorage
document.addEventListener('DOMContentLoaded', () => {
    
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    fetch(`http://localhost:5001/user-profile/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          const user = data.user;
          console.log(user);
          document.getElementById('user-name').textContent = user.name;
          document.getElementById('user-role').textContent = user.role;
          document.getElementById('user-id').textContent = user.user_id;
          document.getElementById('user-email').textContent = user.email;
          document.getElementById('user-name-2').textContent = user.name;
  
          if (user.role.toLowerCase() === 'admin') {
            document.getElementById('admin-type').textContent = user.admin_type || 'N/A';
            document.getElementById('department').textContent = 'N/A';
          } else if (user.role.toLowerCase() === 'faculty') {
            document.getElementById('admin-type').textContent = 'N/A';
            document.getElementById('department').textContent = 'Faculty Department';
          } else {
            document.getElementById('admin-type').textContent = 'N/A';
            document.getElementById('department').textContent = 'Student Department';
          }
        } else {
          console.error('Failed to fetch user profile:', data.error);
        }
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
      });
  });
  