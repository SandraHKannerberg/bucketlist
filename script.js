// VARIABLES FROM THE HTML-FILE ---------------------------------------------------------------------------------
const bucketListsElem = document.getElementById("bucketLists");
const bucketFormElem = document.getElementById("bucketForm");
const activityInputLabel = document.querySelector(".activityNameLabel");
const activityInput = document.getElementById("activityName");
const categorySelectLabel = document.querySelector(".categoryLabel");
const activityCategorySelect = document.getElementById("activityCategory");
const registerForm = document.querySelector("#bucketForm");
const bodyElem = document.querySelector("body");

// AVAILABLE CATEGORIES
const categories = ["Resor", "Äventyr", "Lärande", "Hobby", "Hemmafix"];

// MAKE EACH CATEGORY AN OPTION ELEMENT
function createCategoryOptions(categories, selectedCategory = null) {
  return categories.map((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selectedCategory) {
      option.selected = true;
    }
    return option;
  });
}

// RENDER CATEGORY OPTIONS IN SELECT IN BUCKETFORM
const categoryOptions = createCategoryOptions(categories);
categoryOptions.forEach((option) => activityCategorySelect.appendChild(option));

// INIT --------------------------------------------------------------------------------------------

function init() {
  renderBucketList();
}

document.addEventListener("DOMContentLoaded", init);

// HANDLE LOCAL STORAGE ----------------------------------------------------------------------------

// Save the name of my list in local storage as a key
const STORAGE_KEY = "bucketListInLocalStorage";

// Get the list from från local storage
const bucketListInLocalStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));

// No list i LS? Save a new and add the activity as an object
function createNewBucketListToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([activity]));
}

// Save list to local storage - usefull for updates
function saveBucketListToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bucketListInLocalStorage));
}

// Find activity by id in local storage
function findActivityByIdInLocalStorage(id) {
  const activityInLocalStorage = bucketListInLocalStorage.find(
    (activity) => activity.id === id
  );

  return activityInLocalStorage;
}

// HANDLE CATEGORIES ----------------------------------------------------------------------------

// Group categories
let groupedCategories = [];

function updateGroupedCategories() {
  groupedCategories = bucketListInLocalStorage.reduce((acc, activity) => {
    // Find the category object in the accumulator
    let categoryObj = acc.find((group) => group.category === activity.category);

    if (!categoryObj) {
      // If the category doesn't exist, create a new one
      categoryObj = { category: activity.category, activities: [] };
      acc.push(categoryObj);
    }

    // Add the activity to the right category object
    categoryObj.activities.push(activity);

    return acc;
  }, []);
}

// HANDLE BUCKET LIST AND ACTIVITIES -----------------------------------------------------------------------------

// Render the bucket list dynamically in the DOM
function renderBucketList() {
  bucketListsElem.innerHTML = "";
  updateGroupedCategories();
  sortActivitiesAlphabetically();
  // Is there a list? Go to:
  if (groupedCategories) {
    groupedCategories.forEach((category) => {
      // Create h2 for every category
      const newCategoryHeading = document.createElement("h2");
      newCategoryHeading.className = "categoryHeading";
      newCategoryHeading.textContent = category.category;
      bucketListsElem.appendChild(newCategoryHeading);

      // Create an ul for every category
      const newUlElem = document.createElement("ul");
      bucketListsElem.appendChild(newUlElem);

      // Nested loop to access the activities
      category.activities.forEach((activity) => {
        // New listitem for every activity
        const newListItemElem = document.createElement("li");
        newUlElem.appendChild(newListItemElem);

        // Description - activity name
        const newActivityNameElem = document.createElement("p");
        newActivityNameElem.textContent = activity.description;
        newListItemElem.appendChild(newActivityNameElem);

        // Delete button
        const newBtnElemDel = document.createElement("button");
        newListItemElem.appendChild(newBtnElemDel);
        newBtnElemDel.className = "delBtn";
        newBtnElemDel.setAttribute("aria-label", "Radera aktiviteten");

        // Add trash-can icon to button
        const newIconDelElem = document.createElement("i");
        newIconDelElem.className = "fa-regular fa-trash-can";
        newBtnElemDel.appendChild(newIconDelElem);

        // Eventlistener for delete
        newBtnElemDel.addEventListener("click", () => {
          deleteActivity(activity.id);
        });

        // Edit button
        const newBtnElemEdit = document.createElement("button");
        newListItemElem.appendChild(newBtnElemEdit);
        newBtnElemEdit.className = "editBtn";
        newBtnElemEdit.setAttribute("aria-label", "Redigera aktiviteten");

        // Add edit icon to button
        const newIconEditElem = document.createElement("i");
        newIconEditElem.className = "fa-regular fa-pen-to-square";
        newBtnElemEdit.appendChild(newIconEditElem);

        // Eventlistener for mark as done
        newBtnElemEdit.addEventListener("click", () => {
          openEditModal(activity.id);
        });

        // "Mark as done" button
        const newBtnElemDone = document.createElement("button");
        newListItemElem.appendChild(newBtnElemDone);
        newBtnElemDone.className = "doneBtn";
        newBtnElemDone.setAttribute(
          "aria-label",
          "Markera aktiviteten som klar"
        );

        // Add icon element to button
        const newIconDoneElem = document.createElement("i");
        newBtnElemDone.appendChild(newIconDoneElem);

        // Eventlistener for mark as done
        newBtnElemDone.addEventListener("click", () => {
          markActivityAsDone(activity.id);
        });

        // Display different icons on the button based on the value of isDone
        newIconDoneElem.className = activity.isDone
          ? "fa-solid fa-arrow-rotate-left"
          : "fa fa-check";
      });
    });
  }
}

// ADD NEW ACTIVITY --------------------------------------------------------------------------
registerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload
  addNewActivityToBucketList();
});

function addNewActivityToBucketList() {
  // Calculate id of new activity
  const id = "id" + Math.random().toString(16).slice(2);

  // Save the object
  const activity = {
    id: id,
    description: activityInput.value,
    category: activityCategorySelect.value,
    isDone: false,
  };

  // Check if a list excist in local storage
  if (!bucketListInLocalStorage) {
    // No list = create a new one
    createNewBucketListToLocalStorage();
  } else {
    // List already excist = push the new activity to that list
    bucketListInLocalStorage.push(activity);
    saveBucketListToLocalStorage();
  }

  // Reset the form
  activityInput.value = "";
  activityCategorySelect.value = "--Välj kategori--";

  renderBucketList();
}

// MARK AN ACTIVITY AS DONE -------------------------------------------------------------------
function markActivityAsDone(id) {
  const activityToMarkAsDone = findActivityByIdInLocalStorage(id);

  // Check if isDone are true or false
  if (activityToMarkAsDone.isDone) {
    activityToMarkAsDone.isDone = false;
  } else {
    activityToMarkAsDone.isDone = true;
  }

  // Save new list in local storage
  saveBucketListToLocalStorage();

  renderBucketList();
}

// DELETE AN ACTIVITY --------------------------------------------------------------------------
function deleteActivity(id) {
  const activityToDelete = findActivityByIdInLocalStorage(id);

  // Check the index
  const indexInLocalStorage =
    bucketListInLocalStorage.indexOf(activityToDelete);

  // Remove that index from bucket list in local storage
  bucketListInLocalStorage.splice(indexInLocalStorage, 1);

  // Save new list in local storage
  saveBucketListToLocalStorage();

  renderBucketList();
}

// OPEN EDIT MODAL --------------------------------------------------------------------------
function openEditModal(id) {
  const activityToEdit = findActivityByIdInLocalStorage(id);

  // Background overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  bodyElem.appendChild(modalOverlay);

  // Create the modal
  const editModal = document.createElement("div");
  editModal.className = "editModal";
  modalOverlay.appendChild(editModal);

  // Title
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Redigera aktivitet";
  editModal.appendChild(modalTitle);

  // Form
  const editFormElem = document.createElement("form");
  editFormElem.id = "editForm";
  editFormElem.className = "editForm";
  editModal.appendChild(editFormElem);

  // Label for input
  const editActivityLabel = document.createElement("label");
  editActivityLabel.setAttribute("for", "activityName");
  editActivityLabel.textContent = "Vad vill du göra?";
  editFormElem.appendChild(editActivityLabel);

  // Input
  const editActivityInput = document.createElement("input");
  editActivityInput.id = "activityName";
  editActivityInput.type = "text";
  editActivityInput.defaultValue = activityToEdit.description;
  editFormElem.appendChild(editActivityInput);

  // Category dropdown
  const editCategoryLabel = document.createElement("label");
  editCategoryLabel.setAttribute("for", "category");
  editCategoryLabel.textContent = "Välj kategori:";
  editFormElem.appendChild(editCategoryLabel);

  const categorySelect = document.createElement("select");
  categorySelect.id = "category";
  editFormElem.appendChild(categorySelect);

  const modalCategoryOptions = createCategoryOptions(
    categories,
    activityToEdit.category
  );
  modalCategoryOptions.forEach((option) => categorySelect.appendChild(option));

  // Create a button to be able to close the modal
  const closeButton = document.createElement("button");
  closeButton.textContent = "Stäng";
  editModal.appendChild(closeButton);

  closeButton.addEventListener("click", () => {
    modalOverlay.remove();
  });

  // Create save button
  const saveButton = document.createElement("button");
  saveButton.setAttribute("type", "submit");
  saveButton.textContent = "Spara";

  editFormElem.appendChild(saveButton);

  // Eventlistener on edit form
  editFormElem.addEventListener("submit", (event) => {
    event.preventDefault();

    saveEdit(activityToEdit.id, editActivityInput.value, categorySelect.value);

    // Close the modal
    modalOverlay.remove();

    // Rerender the bucketlist
    renderBucketList();
  });
}

// EDIT AN ACTIVITY ------------------------------------------------------------------
function saveEdit(id, inputText, inputSelect) {
  const activityToEdit = findActivityByIdInLocalStorage(id);

  // Save the input values
  const editInputValue = inputText;
  activityToEdit.description = editInputValue;

  const editSelectValue = inputSelect;
  activityToEdit.category = editSelectValue;

  // Update list in LS
  saveBucketListToLocalStorage();
}

// SORT ACTIVITES ------------------------------------------------------------------------
function sortActivitiesAlphabetically() {
  groupedCategories.forEach((activity) => {
    activity.activities.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  });
}
