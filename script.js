// Starta med en tom array som håller alla aktiviteter

const bucketList = [];

// Jag vill att varje aktivitet blir ett objekt med följande egenskaper
// category
// description
// isDone

// Variabler jag behöver fånga upp från HTML
const bucketListsElem = document.getElementById("bucketLists");
const activityInput = document.getElementById("activityName");
const activityCategorySelect = document.getElementById("activityCategory");
// const registerForm = document.querySelector("#bucketForm");
const ulElem = document.querySelector("#bucketList");
const submitBtnElem = document.querySelector(".submitBtn");

// Eventlyssnare
submitBtnElem.addEventListener("click", addNewActivityToBucketList);
// registerForm.addEventListener("submit", addNewActivityToBucketList);

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
    console.log("Från funktion renderBucketList: ", activity);

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

    // En knapp för att klarmarkera aktiviteten
    const newBtnElemDone = document.createElement("button");
    newBtnElemDone.textContent = "Klar"; // Ska kopplas till boolean isDone - default värde = false men denna knapp ska trigga true
    newListItemElem.appendChild(newBtnElemDone);

    ulElem.appendChild(newListItemElem);

    // --------------------------------------------------------
  });
}

// Lägg till en eventlyssnare på formuläret för att lägga till nya aktiviteter

// PSEUDOKOD --------------------------------------------------
// - funktionen ska fånga upp värdet av användarens input
// - detta värde ska sparas i en variabel
// - kolla om det finns en ul med aktuell category / finns HTML-elementet
// - JA? push ny aktivitet till arrayen bucketList
// - NEJ? skapa det ul elementet först med className som sin category SEN push aktivitet till array bucketList
// ------------------------------------------------------------

function addNewActivityToBucketList() {
  // event.preventDefault();

  const activity = {
    description: activityInput.value,
    category: activityCategorySelect.value,
    isDone: false,
  };

  bucketList.push(activity);

  console.log(bucketList);

  // Återställ formulären
  activityInput.value = "";
  activityCategorySelect.value = "Resor";

  renderBucketList();
}
