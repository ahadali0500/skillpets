document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("skillpets");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const userId = getUserIdFromToken(token);

  fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("username").innerText = data.username || "N/A";
      document.getElementById("userId").innerText = data.user_id || "N/A";
      document.getElementById("email").innerText = data.email || "N/A";
      document.getElementById("createdOn").innerText = new Date(data.created_on).toLocaleDateString() || "N/A";
      document.getElementById("points").innerText = data.points || "N/A";

      const petsTable = document.getElementById("petsTable");
      petsTable.innerHTML = `<tr><th>Species</th><th>Happiness Level</th></tr>`;

      if (data.pets && data.pets.length > 0) {
        data.pets.forEach((pet) => {
          const petRow = document.createElement("tr");
          petRow.innerHTML = `
            <td>${pet.species}</td>
            <td>${pet.happiness_level}</td>         `;
          petsTable.appendChild(petRow);
        });
      } else {
        petsTable.innerHTML = `<tr><td colspan="3">No pets available. Adopt one to see it here!</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
      alert("Failed to load profile. Please try again later.");
    });
});

function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
