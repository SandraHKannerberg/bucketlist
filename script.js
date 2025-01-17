// VARIABLES FROM THE HTML-FILE ---------------------------------------------------------------------------------
const bucketListsElem = document.getElementById("bucketLists");
const activityInput = document.getElementById("activityName");
const activityCategorySelect = document.getElementById("activityCategory");
const registerForm = document.querySelector("#bucketForm");
const bodyElem = document.querySelector("body");

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

  console.log(groupedCategories);
}

// HANDLE BUCKET LIST AND ACTIVITIES -----------------------------------------------------------------------------

// Render the bucket list dynamically in the DOM
function renderBucketList() {
  updateGroupedCategories();
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
        newBtnElemDel.textContent = "Ta bort";
        newListItemElem.appendChild(newBtnElemDel);
        newBtnElemDel.className = "delBtn";

        // Eventlistener for delete
        newBtnElemDel.addEventListener("click", () => {
          deleteActivity(activity.id);
        });

        // Edit button
        const newBtnElemEdit = document.createElement("button");
        newBtnElemEdit.textContent = "Redigera";
        newListItemElem.appendChild(newBtnElemEdit);
        newBtnElemEdit.className = "editBtn";

        // "Mark as done" button
        const newBtnElemDone = document.createElement("button");
        newListItemElem.appendChild(newBtnElemDone);
        newBtnElemDone.className = "doneBtn";

        if (!activity.isDone) {
          newBtnElemDone.textContent = "Klar";
        } else {
          newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
          newActivityNameElem.style.textDecoration = "line-through";
        }
      });
    });
  }
}

// Eventlyssnare på Redigera-knappen denna ska egentligen bara öppna modalen för att ändra. Ändringarna sparas först när Spara-knappen triggas
// newBtnElemEdit.addEventListener("click", () => {
//   // Vilket index har aktiviteten jag vill redigera?
//   const index = bucketListInLocalStorage.indexOf(activity);

//   // Redigera modalen ---------------------------------
//   // Skapa modalens bakgrund (overlay)
//   const modalOverlay = document.createElement("div");
//   modalOverlay.className = "modal-overlay";
//   bodyElem.appendChild(modalOverlay); // Lägg till i bodyn

//   // Skapa modalen
//   const editModal = document.createElement("div");
//   editModal.className = "editModal";
//   modalOverlay.appendChild(editModal); // Lägg till i modaleOverlay div:en

//   // Titel
//   const modalTitle = document.createElement("h3");
//   modalTitle.textContent = "Redigera aktivitet";
//   editModal.appendChild(modalTitle);

//   // Skapa inputfält för beskrivning
//   const editActivityLabel = document.createElement("label");
//   editActivityLabel.setAttribute("for", "activityName");
//   editActivityLabel.textContent = "Vad vill du göra?";
//   editModal.appendChild(editActivityLabel);

//   const editActivityInput = document.createElement("input");
//   editActivityInput.id = "activityName";
//   editActivityInput.type = "text";
//   editActivityInput.defaultValue = activity.description; // Default nuvarande värde
//   editModal.appendChild(editActivityInput);

//   // Skapa en dropdown för kategori
//   const editCategoryLabel = document.createElement("label");
//   editCategoryLabel.setAttribute("for", "category");
//   editCategoryLabel.textContent = "Välj kategori:";
//   editModal.appendChild(editCategoryLabel);

//   const categorySelect = document.createElement("select");
//   categorySelect.id = "category";
//   editModal.appendChild(categorySelect);

//   const categories = ["Resor", "Äventyr", "Lärande", "Hobby", "Hemmafix"];
//   categories.forEach((category) => {
//     const option = document.createElement("option");
//     option.value = category;
//     option.textContent = category;
//     option.defaultSelected = activity.category; // Default nuvarande värde
//     categorySelect.appendChild(option);
//   });

//   // Lägg till en knapp för att stänga modalen
//   const closeButton = document.createElement("button");
//   closeButton.textContent = "Stäng";
//   editModal.appendChild(closeButton);

//   // Funktion för att stänga modalen
//   closeButton.addEventListener("click", () => {
//     modalOverlay.remove();
//   });

//   // Skapa en knapp för att spara ändringar
//   const saveButton = document.createElement("button");
//   saveButton.textContent = "Spara";
//   editModal.appendChild(saveButton);

//   saveButton.addEventListener("click", () => {
//     const editInputValue = editActivityInput.value;
//     activity.description = editInputValue;

//     const editSelectValue = categorySelect.value;
//     activity.category = editSelectValue;

//     saveBucketListToLocalStorage();

//     // Stäng modalen när ändringar är sparade
//     modalOverlay.remove();

//     // Rendera ut bucket list igen för att få en uppdaterad version
//     // renderBucketList();

// Eventlyssnare på Klarmarkera-knappen
// newBtnElemDone.addEventListener("click", () => {
// Kolla värdet på isDone
// Ska gå att klicka igen om man klarmarkerat av misstag, och så knappen och texten återgå till ursprunglig text och style
//   if (activity.isDone) {
//     activity.isDone = false;
//     newBtnElemDone.textContent = "Klar";
//     newActivityNameElem.style.textDecoration = "none";
//   } else {
//     activity.isDone = true;
//     newActivityNameElem.style.textDecoration = "line-through";
//     newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
//   }

//   saveBucketListToLocalStorage();
// });

// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------

// Sortera aktiviteterna i varje lista i bokstavsordning
function sortActivitiesAlphabetically() {
  // Hämta alla ul-element
  const lists = document.querySelectorAll("ul"); // NodeList med ul.className

  // Iterera över varje ul och sortera dess innehåll
  lists.forEach((ul) => {
    // Konverterar resultatet från en NodeList till en array. På den kan sedan sort användas
    const listItems = Array.from(ul.querySelectorAll("li"));

    // Sortera aktiviteterna i bokstavsordning
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));

    // Omorganisera li-elementen/aktiviteterna i ul
    listItems.forEach((li) => ul.appendChild(li));
  });
}

sortActivitiesAlphabetically();

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

  // updateGroupedCategories();

  renderBucketList();
}

// DELETE AN ACTIVITY --------------------------------------------------------------------------
function deleteActivity(id) {
  // Remove from grouped list
  // const indexGroupedCategories = groupedCategories.indexOf(id);
  // groupedCategories.splice(indexGroupedCategories, 1);

  //Remove from local storage
  // Find the activity in bucketListInLocalStorage by id
  const activityToDelete = bucketListInLocalStorage.find(
    (activity) => activity.id === id
  );

  // Check the index
  const indexInLocalStorage =
    bucketListInLocalStorage.indexOf(activityToDelete);

  // Remove that index
  bucketListInLocalStorage.splice(indexInLocalStorage, 1);

  // Save new list in local storage
  saveBucketListToLocalStorage();

  updateGroupedCategories();

  renderBucketList();
}
