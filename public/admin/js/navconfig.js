$(document).ready(function () {
    console.log("load");

    const token = localStorage.getItem("token");
    const skillpets = JSON.parse(localStorage.getItem("skillpets"));

    if (skillpets && skillpets.is_admin == 1) {

    } else {
        window.location.href = '/login.html';
    }


    $('#user-logout-link').click(function (event) {
        event.preventDefault(); // Prevent the link from navigating directly
        localStorage.removeItem('token'); // Remove the token from localStorage
        localStorage.removeItem('skillpets');
        console.log("ok");

        // Optionally, redirect the user to the login page or somewhere else
        window.location.href = 'login.html';
    });
})