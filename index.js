let recipeForm = document.getElementById('recipeForm');
let recipeName = document.getElementById('recipeName');
let ingredients = document.getElementById('ingredients');
let image_url = document.getElementById('recipeImage');
let steps = document.getElementById('recipeSteps');
let displayArea = document.getElementById('recipeDisplay');

let recipes = [];

async function read_recipe() {
  let response = await fetch('http://127.0.0.1:8000/recipes', {
    method: 'GET',
  });
  let data = await response.json();
  return data;
}

read_recipe().then((data) => {
  recipes = data;
  displayRecipe(recipes);
});

recipeForm.addEventListener('submit', function (event) {
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

  create_recipe(newRecipe).then((data) => {
    recipes.push(data);
  });

  resetForm();
});

let create_recipe = async (new_recipe) => {
  try{
    let response = await fetch("http://127.0.0.1:8000/recipes", {method: 'POST',
    headers: {
      'Content-Type': 'application/json;'
    },
    body: JSON.stringify(new_recipe)})
    if (response.ok){
      let result = await response.json();
      return result
    }
    else{
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  }catch(error){console.error('Error:', error.message);
  throw error; }}

function resetForm() {
  recipeName.value = '';
  ingredients.value = '';
  steps.value = '';
  image_url.value = '';
}

function displayRecipe(recipes) {
  displayArea.innerHTML = ''; // Clear previous content

  recipes.forEach(function (recipe, index) {
    let recipeDiv = document.createElement('div');
    recipeDiv.innerHTML = `<img src="${recipe.image}" alt="${recipe.name}">
                           <h3>${recipe.name}</h3>
                           <p>Ingredients: ${recipe.ingredients}</p>
                           <p>Steps: ${recipe.steps}</p>`;
    displayArea.appendChild(recipeDiv);

    // Delete button

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', function () {
      deleteRecipe(index);
    });

    recipeDiv.appendChild(deleteButton);

    // Edit Button

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.style.backgroundColor = 'Green';

    editButton.addEventListener('click', function () {
      editRecipe(index);
    });
    recipeDiv.appendChild(editButton);
  });
}

// Function to open the modal and display the selected recipe
function openModal(index) {
  const recipe = recipes[index];

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `

  <img src="${recipe.image}" alt="${recipe.name}" />
    <h2>${recipe.name}</h2>
    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
    <p><strong>Steps:</strong> ${recipe.steps}</p>
  `;

  const modal = document.getElementById('recipeModal');
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('recipeModal');
  modal.style.display = 'none';
}

// Attach the openModal function to each recipe card click event
displayArea.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG') {
    const index = Array.from(
      event.target.parentNode.parentNode.children
    ).indexOf(event.target.parentNode);
    openModal(index);
  }
});

// Attach the closeModal function to the modal close button
document
  .getElementById('modalCloseButton')
  .addEventListener('click', closeModal);

function deleteRecipe(index) {
  // Remove the recipe at the specified index
  recipes.splice(index, 1);

  // Update the display to reflect the changes
  displayRecipe(recipes);
}

function editRecipe(index) {
  const recipe = recipes[index];

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <form id="updateForm">
      <label for="updateRecipeName">Recipe Name:</label>
      <input type="text" id="updateRecipeName" name="updateRecipeName" value="${recipe.name}" />

      <label for="updateIngredients">Ingredients:</label>
      <textarea id="updateIngredients" name="updateIngredients">${recipe.ingredients}</textarea>

      <label for="updateRecipeSteps">Steps for Preparation:</label>
      <textarea id="updateRecipeSteps" name="updateRecipeSteps">${recipe.steps}</textarea>

      <label for="updateRecipeImage">Recipe Image URL:</label>
      <input type="url" id="updateRecipeImage" name="updateRecipeImage" value="${recipe.image}" />

      <button style="background-color: green;" type="button" onclick="updateRecipe(${index})">Update Recipe</button>
    </form>
  `;

  const modal = document.getElementById('recipeModal');
  modal.style.display = 'flex';
}

function updateRecipe(index) {
  // Get the updated values from the form
  let updatedName = document.getElementById('updateRecipeName').value;
  let updatedIngredients = document.getElementById('updateIngredients').value;
  let updatedSteps = document.getElementById('updateRecipeSteps').value;
  let updatedImageUrl = document.getElementById('updateRecipeImage').value;

  // Update the recipe in the array
  recipes[index] = {
    name: updatedName,
    ingredients: updatedIngredients,
    steps: updatedSteps,
    image: updatedImageUrl,
  };

  // Update the display to reflect the changes
  displayRecipe(recipes);

  // Reset the form and close the modal
  resetForm();
  closeModal();
}
