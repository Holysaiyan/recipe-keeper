let recipeForm = document.getElementById("recipeForm");
let recipeName = document.getElementById("recipeName");
let ingredients = document.getElementById("ingredients");
let image_url = document.getElementById("recipeImage");
let steps = document.getElementById("recipeSteps");
let displayArea = document.getElementById("recipeDisplay");

window.onload = function () {
  if (localStorage.getItem("recipes")) {
    recipes = JSON.parse(localStorage.getItem("recipes"));
    displayRecipe(recipes);
  }
};

let recipes = [];
recipeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let enteredName = recipeName.value;
  let enteredIngredients = ingredients.value;
  let enteredSteps = steps.value;
  let enteredImageUrl = image_url.value;

  let newRecipe = {
    name: enteredName,
    ingredients: enteredIngredients,
    steps: enteredSteps,
    image: enteredImageUrl,
  };

  recipes.push(newRecipe);

  // reset the values
  recipeName.value = "";
  ingredients.value = "";
  steps.value = "";
  image_url.value = "";

  saveToLocalStorage();

  displayRecipe(recipes);
});

function displayRecipe(recipes) {
  displayArea.innerHTML = ""; // Clear previous content

  recipes.forEach(function (recipe, index) {
    let recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = `<img src="${recipe.image}" alt="${recipe.name}">
                           <h3>${recipe.name}</h3>
                           <p>Ingredients: ${recipe.ingredients}</p>
                           <p>Steps: ${recipe.steps}</p>`;
    displayArea.appendChild(recipeDiv);

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteRecipe(index);
    });

    recipeDiv.appendChild(deleteButton);
  });
}

// Function to open the modal and display the selected recipe
function openModal(index) {
  const recipe = recipes[index];

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
  <img src="${recipe.image}" alt="${recipe.name}" />
    <h2>${recipe.name}</h2>
    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
    <p><strong>Steps:</strong> ${recipe.steps}</p>
  `;

  const modal = document.getElementById("recipeModal");
  modal.style.display = "flex";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("recipeModal");
  modal.style.display = "none";
}

// Attach the openModal function to each recipe card click event
displayArea.addEventListener("click", function (event) {
  if (event.target.tagName === "IMG") {
    const index = Array.from(
      event.target.parentNode.parentNode.children
    ).indexOf(event.target.parentNode);
    openModal(index);
  }
});

// Attach the closeModal function to the modal close button
document
  .getElementById("modalCloseButton")
  .addEventListener("click", closeModal);

function deleteRecipe(index) {
  // Remove the recipe at the specified index
  recipes.splice(index, 1);

  // Save to local storage after deleting a recipe
  saveToLocalStorage();

  // Update the display to reflect the changes
  displayRecipe(recipes);
}

function saveToLocalStorage() {
  console.log("Saving to local storage:", recipes);
  localStorage.setItem("recipes", JSON.stringify(recipes));
}
