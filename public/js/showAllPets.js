document.addEventListener("DOMContentLoaded", function () {
  const skillpets = JSON.parse(localStorage.getItem("skillpets"));
  if (!skillpets || !skillpets.user_id) {
    console.log('Please log in first to view your inventory.');

    // If you have an element with an id of 'not', you can directly use `getElementById`
    const notElement = document.getElementById('not');
    if (notElement) {
      notElement.innerHTML = 'Please log in first to view your inventory.';
    }

    return;
  }
  // Continue with your logic, since skillpets is verified to exist and have a user_id

  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;

  // Fetch the pets data from the API
  fetch("/api/pets")
    .then((response) => response.json())
    .then((pets) => {
      const petsList = document.getElementById("petsList");
      petsList.innerHTML = ""; // Clear existing cards to avoid duplication

      pets.forEach((pet) => {
        const petCard = document.createElement("div");
        petCard.className = "flip-card";

        // Generate the pet card with flip effect
        petCard.innerHTML = `
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h5>${pet.pet_name}</h5>
            </div>
            <div class="flip-card-back">
            <h3>${pet.pet_name}</h3>
              <h5>${pet.species}</h5>
              <p>Happiness: ${pet.happiness_level}</p>
              ${isLoggedIn
            ? `<button class="btn btn-primary btn-adopt" data-pet-id="${pet.pet_id}">Adopt ${pet.species}</button>`
            : `<p class="text-muted">Login to adopt this pet.</p>`
          }
            </div>
          </div>
        `;

        petsList.appendChild(petCard);
      });

      // Add click event listeners for adopt buttons (only if logged in)
      if (isLoggedIn) {
        document.querySelectorAll(".btn-adopt").forEach((button) => {
          button.addEventListener("click", (e) => {
            const petId = e.target.getAttribute("data-pet-id");
            console.log(`Adopting pet with ID: ${petId}`);
            adoptPet(petId); // Call adoptPet function
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching pets:", error);
    });
});

// Function to handle pet adoption
function adoptPet(petId) {
  const skillpets = JSON.parse(localStorage.getItem("skillpets"));
  const data = {
    pet_id: petId,
    user_id: skillpets.user_id
  }
  fetch(`${window.location.protocol}//${window.location.host}/api/user-pets/adopt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data), // Send petId as body
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || "Pet adopted successfully!");
    })
    .catch((error) => {
      console.error("Error adopting pet:", error);
    });
}
