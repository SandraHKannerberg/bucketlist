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

// Funktion som får fram vilka kategorier som finns med i listan
function printActivityCategories(bucketListInLocalStorage) {
  bucketListsElem.innerHTML = "";
  // Skapa en uppsättning för att lagra unika kategorier
  const categories = new Set();

  // Loopar igenom aktiviteterna
  bucketListInLocalStorage.forEach((activity) => {
    if (activity.category) {
      categories.add(activity.category); // Lägg till kategorin i setet
    }
  });

  // Skriv ut kategorierna
  categories.forEach((category) => {
    // Skapa och lägg till h2 som rubrik för varje kategori
    const newCategoryHeading = document.createElement("h2");

    // Tilldela ett className
    newCategoryHeading.className = "categoryHeading";

    // Tilldela innehåll
    newCategoryHeading.textContent = category;

    // Lägg till elementet
    bucketListsElem.appendChild(newCategoryHeading);

    // Skapa och lägg till en ul för varje kategori. Dessa ska sedan lista alla aktiviteter inom varje kategori
    const newUlElem = document.createElement("ul");

    // Översätter de svenska kategorierna till engelska då jag vill ha min className på engelska
    const categoryTranslations = {
      resor: "trips",
      äventyr: "adventures",
      lärande: "learning",
      hobby: "hobby",
      hemmafix: "renovation",
    };

    const englishClassName =
      categoryTranslations[category.toLowerCase()] || "unknown";

    // Tilldelar det engelska className till de nya listorna som skapas
    newUlElem.className = englishClassName;

    // Lägger till listan i DOM:en
    bucketListsElem.appendChild(newUlElem);
  });
}

// HANDLE BUCKET LIST AND ACTIVITIES -----------------------------------------------------------------------------

// Skapa en funktion som ritar upp listan dynamiskt i DOM
function renderBucketList() {
  if (!bucketListInLocalStorage) {
    console.log("Inget att visa");
  } else {
    // Kör funktionen för att kolla kategorier
    printActivityCategories(bucketListInLocalStorage);
  }

  // Översätt kategorierna
  const categoryTranslations = {
    resor: "trips",
    äventyr: "adventures",
    lärande: "learning",
    hobby: "hobby",
    hemmafix: "renovation",
  };

  // Om listan finns i local storage kör:
  if (bucketListInLocalStorage) {
    bucketListInLocalStorage.forEach((activity) => {
      // Matchar översättningen den aktuella aktivitetens kategori?
      const translatedCategory =
        categoryTranslations[activity.category.toLowerCase()];

      // Hitta UL-elementet baserat på den översatta kategorin
      const ulMatchingTheCatgeory = document.querySelector(
        `ul.${translatedCategory}`
      );

      // Ny li för varje aktivitet
      const newListItemElem = document.createElement("li");

      // Ett p-element för att skriva ut beskrivningen
      const newActivityNameElem = document.createElement("p");
      newActivityNameElem.textContent = activity.description;
      newListItemElem.appendChild(newActivityNameElem);

      // En knapp för att ta bort aktiviteten från listan
      const newBtnElemDel = document.createElement("button");
      newBtnElemDel.textContent = "Ta bort";
      newListItemElem.appendChild(newBtnElemDel);
      newBtnElemDel.className = "delBtn";

      // Eventlyssnare på Ta bort-knappen
      newBtnElemDel.addEventListener("click", () => {
        // Vilket index har aktiviteten jag vill ta bort?
        const index = bucketListInLocalStorage.indexOf(activity);

        // Ta bort aktiviteten och uppdatera listan i LS
        bucketListInLocalStorage.splice(index, 1);

        saveBucketListToLocalStorage();

        // Rendera ut bucket list igen för att få en uppdaterad version
        renderBucketList();
      });

      // En knapp för att redigera aktiviteten
      const newBtnElemEdit = document.createElement("button");
      newBtnElemEdit.textContent = "Redigera";
      newListItemElem.appendChild(newBtnElemEdit);
      newBtnElemEdit.className = "editBtn";

      // Eventlyssnare på Redigera-knappen denna ska egentligen bara öppna modalen för att ändra. Ändringarna sparas först när Spara-knappen triggas
      newBtnElemEdit.addEventListener("click", () => {
        // Vilket index har aktiviteten jag vill redigera?
        const index = bucketListInLocalStorage.indexOf(activity);

        // Redigera modalen ---------------------------------
        // Skapa modalens bakgrund (overlay)
        const modalOverlay = document.createElement("div");
        modalOverlay.className = "modal-overlay";
        bodyElem.appendChild(modalOverlay); // Lägg till i bodyn

        // Skapa modalen
        const editModal = document.createElement("div");
        editModal.className = "editModal";
        modalOverlay.appendChild(editModal); // Lägg till i modaleOverlay div:en

        // Titel
        const modalTitle = document.createElement("h3");
        modalTitle.textContent = "Redigera aktivitet";
        editModal.appendChild(modalTitle);

        // Skapa inputfält för beskrivning
        const editActivityLabel = document.createElement("label");
        editActivityLabel.setAttribute("for", "activityName");
        editActivityLabel.textContent = "Vad vill du göra?";
        editModal.appendChild(editActivityLabel);

        const editActivityInput = document.createElement("input");
        editActivityInput.id = "activityName";
        editActivityInput.type = "text";
        editActivityInput.defaultValue = activity.description; // Default nuvarande värde
        editModal.appendChild(editActivityInput);

        // Skapa en dropdown för kategori
        const editCategoryLabel = document.createElement("label");
        editCategoryLabel.setAttribute("for", "category");
        editCategoryLabel.textContent = "Välj kategori:";
        editModal.appendChild(editCategoryLabel);

        const categorySelect = document.createElement("select");
        categorySelect.id = "category";
        editModal.appendChild(categorySelect);

        const categories = ["Resor", "Äventyr", "Lärande", "Hobby", "Hemmafix"];
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          option.defaultSelected = activity.category; // Default nuvarande värde
          categorySelect.appendChild(option);
        });

        // Lägg till en knapp för att stänga modalen
        const closeButton = document.createElement("button");
        closeButton.textContent = "Stäng";
        editModal.appendChild(closeButton);

        // Funktion för att stänga modalen
        closeButton.addEventListener("click", () => {
          modalOverlay.remove();
        });

        // Skapa en knapp för att spara ändringar
        const saveButton = document.createElement("button");
        saveButton.textContent = "Spara";
        editModal.appendChild(saveButton);

        saveButton.addEventListener("click", () => {
          const editInputValue = editActivityInput.value;
          activity.description = editInputValue;

          const editSelectValue = categorySelect.value;
          activity.category = editSelectValue;

          saveBucketListToLocalStorage();

          // Stäng modalen när ändringar är sparade
          modalOverlay.remove();

          // Rendera ut bucket list igen för att få en uppdaterad version
          renderBucketList();
        });
      });

      // En knapp för att klarmarkera aktiviteten
      const newBtnElemDone = document.createElement("button");
      newListItemElem.appendChild(newBtnElemDone);
      newBtnElemDone.className = "doneBtn";

      // Dynamiskt innehåll på knappen beroende på om aktiviteten är markerad som isDone eller inte. Klar visas när isDone = false, isDone = true visar checkmark istället.
      if (!activity.isDone) {
        newBtnElemDone.textContent = "Klar";
      } else {
        newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
        newActivityNameElem.style.textDecoration = "line-through";
      }

      // Eventlyssnare på Klarmarkera-knappen
      newBtnElemDone.addEventListener("click", () => {
        // Kolla värdet på isDone
        // Ska gå att klicka igen om man klarmarkerat av misstag, och så knappen och texten återgå till ursprunglig text och style
        if (activity.isDone) {
          activity.isDone = false;
          newBtnElemDone.textContent = "Klar";
          newActivityNameElem.style.textDecoration = "none";
        } else {
          activity.isDone = true;
          newActivityNameElem.style.textDecoration = "line-through";
          newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
        }

        // Uppdatera listan i LS
        saveBucketListToLocalStorage();
      });

      // Lägg till aktiviteten/ nytt listItem i den listan med rätt kategori för aktiviteten
      ulMatchingTheCatgeory.appendChild(newListItemElem);
      // --------------------------------------------------------
    });
  }
}

// --------------------------------------------------------------------------------

// Lägg till en eventlyssnare på formuläret för att lägga till nya aktiviteter

// Eventlyssnare
registerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Förhindra att sidan laddas om
  addNewActivityToBucketList(); // Kör funktionen för att lägga till aktiviteten i bucketList
});

// Funktionen som ska triggas av eventlyssnaren submit
function addNewActivityToBucketList() {
  // Skapa objektet
  const activity = {
    description: activityInput.value,
    category: activityCategorySelect.value,
    isDone: false,
  };

  // Checka av om listan finns sparad i localStorage
  if (!bucketListInLocalStorage) {
    // Ingen lista = skapa en ny
    createNewBucketListToLocalStorage();
  } else {
    // Det finns en lista redan = pusha den nya aktiviteten till befintlig lista
    bucketListInLocalStorage.push(activity);
    saveBucketListToLocalStorage();
  }

  // Återställ formulären
  activityInput.value = "";
  activityCategorySelect.value = "Resor";

  renderBucketList();
}

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
