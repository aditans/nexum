document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Clear user session data
           

            localStorage.removeItem('session_id');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_role');

            // Redirect to login page in the parent 'login' directory
            window.location.href = '../login/login.html';
        });
    }
});
