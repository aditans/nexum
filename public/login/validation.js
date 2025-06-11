document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  if (!form) {
    console.warn("Form element not found on this page.");
    return;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    try {
      const res = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        document.getElementById('error-message').textContent = data.message || 'Login failed';
        return;
      }
      console.log(data);

      // Save data
      localStorage.setItem('session_id', data.session_id);
      localStorage.setItem('user_id', data.user.user_id);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_role', data.user.role);

      // Redirect
      const role = data.user.role.toLowerCase();
      if (role === 'student') {
        window.location.href = '../Student_Dashboard_1/index.html';
      } else if (role === 'admin') {
        window.location.href = '../Admin_Dashboard_1/index.html';
      } else if (role === 'faculty') {
        window.location.href = '../Faculty_Dashboard_1/index.html';
      }
    } catch (err) {
      console.error('Login error:', err);
      document.getElementById('error-message').textContent = 'Something went wrong';
    }
  });
});
