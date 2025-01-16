// Starta med en tom array som håller alla aktiviteter
const bucketList = [];

// Variabler jag behöver fånga upp från HTML
const bucketListsElem = document.getElementById("bucketLists");
const activityInput = document.getElementById("activityName");
const activityCategorySelect = document.getElementById("activityCategory");
const registerForm = document.querySelector("#bucketForm");
const ulElem = document.querySelector("#bucketList");

renderBucketList();

// Deklarera en funktion som får fram vilka kategorier som finns med i listan
// Funktionen tar in arrayen bucketList som ett argument
// Skapa ett nytt ul-element för varje kategori som finns med
// Ge varje ul en h2 med kategorin som rubrik

function printActivityCategories(bucketList) {
  // Skapa en uppsättning för att lagra unika kategorier
  const categories = new Set();

  // Loopar igenom aktiviteterna
  bucketList.forEach((activity) => {
    if (activity.category) {
      categories.add(activity.category); // Lägg till kategorin i setet
    }
  });

  // Skriv ut kategorierna
  categories.forEach((category) => {
    // Skapa och lägg till h2 som rubrik för varje kategori
    const newCategoryHeading = document.createElement("h2");
    newCategoryHeading.textContent = category;
    bucketListsElem.appendChild(newCategoryHeading);

    // Skapa och lägg till en ul för varje kategori. Dessa ska sedan lista alla aktiviteter inom varje kategori
    const newUl = document.createElement("ul");
    newUl.className = category;
    bucketListsElem.appendChild(newUl);
  });
}

// printActivityCategories(bucketList);

// Skapa en funktion som ritar upp listan dynamiskt i DOM ----------------------------------------------------
function renderBucketList() {
  // Steg 2 få in dessa istället när bucketList finns i localStorage
  // const bucketList = JSON.parse(localStorage.getItem("bucketList"));
  // if (bucketList) {FLYTTA UPP KODBLOCKET FÖR RENDERING HIT}

  ulElem.innerHTML = "";

  bucketList.forEach((activity) => {
    // Ny li för varje aktivitet
    const newListItemElem = document.createElement("li");

    // Ett p-element för att skriva ut beskrivningen
    const newActivityNameElem = document.createElement("p");
    newActivityNameElem.textContent = activity.description;
    newListItemElem.appendChild(newActivityNameElem);

    // Ett p-element för att skriva ut kategorin
    const newCategoryElem = document.createElement("p");
    newCategoryElem.textContent = activity.category;
    newListItemElem.appendChild(newCategoryElem);

    // En knapp för att ta bort aktiviteten från listan
    const newBtnElemDel = document.createElement("button");
    newBtnElemDel.textContent = "Ta bort";
    newListItemElem.appendChild(newBtnElemDel);

    // Eventlyssnare på Ta bort-knappen
    newBtnElemDel.addEventListener("click", () => {
      // Vilket index har aktiviteten jag vill ta bort?
      const index = bucketList.indexOf(activity);

      // Ta bort aktiviteten
      bucketList.splice(index, 1);

      // Rendera om bucket list för att få en uppdaterad version
      renderBucketList();
    });

    // En knapp för att klarmarkera aktiviteten
    const newBtnElemDone = document.createElement("button");
    newBtnElemDone.textContent = "Klar"; // Ska kopplas till boolean isDone - default värde = false men denna knapp ska trigga true
    newListItemElem.appendChild(newBtnElemDone);

    // Eventlyssnare på Klarmarkera-knappen
    newBtnElemDone.addEventListener("click", () => {
      // Ändra isDone till true
      activity.isDone = true;

      // Ändra style till att stryka över texten samt göra knappen till en checkmark
      newActivityNameElem.style.textDecoration = "line-through";
      newCategoryElem.style.textDecoration = "line-through";
      newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
    });

    ulElem.appendChild(newListItemElem);

    // --------------------------------------------------------
  });
}

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

  // Lägg till det nya objektet i listan
  bucketList.push(activity);

  // Återställ formulären
  activityInput.value = "";
  activityCategorySelect.value = "Resor";

  renderBucketList();
}
