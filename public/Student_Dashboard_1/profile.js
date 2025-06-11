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
          document.getElementById('user-name-2').textContent = user.name;
          document.getElementById('user-role').textContent = user.role;
          document.getElementById('user-id').textContent = user.user_id;
          document.getElementById('user-email').textContent = user.email;
          document.getElementById('user-section').textContent = user.section_id;
  
          
        } else {
          console.error('Failed to fetch user profile:', data.error);
        }
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
      });
  });
  