document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("registerForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Perform signup logic
    if (password === confirmPassword) {
      // Passwords match, proceed with signup
      console.log("Signup successful");
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      warningCard.classList.add("d-none");

      const data = {
        username: username,
        email: email,
        password: password,
      };

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("skillpets", JSON.stringify(responseData.data));

          // Redirect to profile page
          if (responseData.data.is_admin == 1) {
            window.location.href = "admin/index.html";
          } else {
            window.location.href = "profile.html";
          }
          // const responseDiv = document.getElementById('formResponse');
          // responseDiv.innerHTML = `<p class="alert alert-success">Your account created successfully!</p>`;

        } else {
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };

      // Perform signup request
      fetchMethod(currentUrl + "/api/register", callback, "POST", data);

      // Reset the form fields
      signupForm.reset();
    } else {
      // Passwords do not match, handle error
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});