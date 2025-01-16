// Starta med en tom array som håller alla aktiviteter
// Behöver inte denna då jag gått vidare till uppgiften på Level ups nivå med localStorage, så min lista sparas där och det är den jag utgår ifrån
// const bucketList = [];

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

  const bucketListInLocalStorage = JSON.parse(
    localStorage.getItem("bucketListInLocalStorage")
  );

  if (bucketListInLocalStorage) {
    bucketListInLocalStorage.forEach((activity) => {
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
        const index = bucketListInLocalStorage.indexOf(activity);
        console.log(index);

        // Ta bort aktiviteten och uppdatera listan i LS
        bucketListInLocalStorage.splice(index, 1);

        localStorage.setItem(
          "bucketListInLocalStorage",
          JSON.stringify(bucketListInLocalStorage)
        );

        // Rendera om bucket list för att få en uppdaterad version
        renderBucketList();
      });

      // En knapp för att klarmarkera aktiviteten
      const newBtnElemDone = document.createElement("button");
      newListItemElem.appendChild(newBtnElemDone);

      // Dynamiskt innehåll på knappen beroende på om aktiviteten är markerad som isDone eller inte. Klar visas när isDone = false, isDone = true visar checkmark istället.
      if (!activity.isDone) {
        newBtnElemDone.textContent = "Klar";
      } else {
        newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
        newActivityNameElem.style.textDecoration = "line-through";
        newCategoryElem.style.textDecoration = "line-through";
      }

      // Eventlyssnare på Klarmarkera-knappen
      newBtnElemDone.addEventListener("click", () => {
        // Kolla värdet på isDone
        // Ska gå att klicka igenom man klarmarkerat av misstag, och så knappen och texten återgå till ursprunglig text och style
        if (activity.isDone) {
          activity.isDone = false;
          newBtnElemDone.textContent = "Klar";
          newActivityNameElem.style.textDecoration = "none";
          newCategoryElem.style.textDecoration = "none";
        } else {
          activity.isDone = true;
          newActivityNameElem.style.textDecoration = "line-through";
          newCategoryElem.style.textDecoration = "line-through";
          newBtnElemDone.innerHTML = "<i class='fa fa-check'></i>";
        }

        // Uppdatera listan i LS
        localStorage.setItem(
          "bucketListInLocalStorage",
          JSON.stringify(bucketListInLocalStorage)
        );
      });

      // Lägg till aktiviteten/ nytt listItem i UL
      ulElem.appendChild(newListItemElem);
      // --------------------------------------------------------
    });
  }
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

  // Checka av om listan finns sparad i localStorage
  if (!localStorage.getItem("bucketListInLocalStorage")) {
    // Om ingen lista finns sparad i LS - spara listan innehållandes aktiviteten
    localStorage.setItem(
      "bucketListInLocalStorage",
      JSON.stringify([activity])
    );
  } else {
    // Om det redan finns en lista - pusha den nya aktiviteten till befintlig lista
    const bucketListInLocalStorage = JSON.parse(
      localStorage.getItem("bucketListInLocalStorage")
    );
    bucketListInLocalStorage.push(activity);
    localStorage.setItem(
      "bucketListInLocalStorage",
      JSON.stringify(bucketListInLocalStorage)
    );
  }

  // Återställ formulären
  activityInput.value = "";
  activityCategorySelect.value = "Resor";

  renderBucketList();
}
