$(document).ready(function () {
    $("#navbar-placeholder").load("navbar.html", function () {
        console.log("Navbar loaded successfully.");

        // Now that the navbar is loaded, check for the token
        const token = localStorage.getItem("token");
        const skillpets = JSON.parse(localStorage.getItem("skillpets"));
        const loginLink = document.getElementById('login-link');
        const registerButton = document.getElementById('register-button');
        const userProfileLink = document.getElementById('user-profile-link');
        const userLogoutLink = document.getElementById('user-logout-link');


        $('#user-logout-link').click(function(event) {
            event.preventDefault(); // Prevent the link from navigating directly
            localStorage.removeItem('token'); // Remove the token from localStorage
            localStorage.removeItem('skillpets');
            
            // Optionally, redirect the user to the login page or somewhere else
            window.location.href = 'login.html';
        });


        if (token && skillpets.is_admin==0) {
            console.log("Token found:", token);
            loginLink.style.display = 'none';  // Hide the login link
            registerButton.style.display = 'none';  // Hide the register button
            userProfileLink.style.display = 'block';  // Show the user profile link
            userLogoutLink.style.display = 'block';
        } else {
            console.log("No token found.");
            loginLink.style.display = 'block';
            registerButton.style.display = 'block';
            userProfileLink.style.display = 'none';
            userLogoutLink.style.display = 'none';
        }
    });
});