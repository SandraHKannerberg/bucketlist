// Starta med en tom array som håller alla aktiviteter

const bucketList = [];

// Varje aktivitet blir ett objekt med följande egenskaper
// category
// description
// isDone

const activity = {
  category: "Hemmafix",
  description: "Decluttering",
  isDone: false,
};

bucketList.push(
  {
    category: "Hemmafix",
    description: "Decluttering",
    isDone: false,
  },
  {
    category: "Hemmafix",
    description: "Hallen",
    isDone: false,
  },
  {
    category: "Hemmafix",
    description: "Garderober",
    isDone: false,
  },
  {
    category: "Äventyr",
    description: "Tatuering",
    isDone: false,
  },
  {
    category: "Resor",
    description: "Varmt",
    isDone: false,
  }
);

const bucketListsEl = document.querySelector("#bucketLists");

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
    bucketListsEl.appendChild(newCategoryHeading);

    // Skapa och lägg till en ul för varje kategori. Dessa ska sedan lista alla aktiviteter inom varje kategori
    const newUl = document.createElement("ul");
    newUl.className = category;
    bucketListsEl.appendChild(newUl);
  });
}

// Kalla på funktionen inom skapa ny aktivitet funktion ???????????????
printActivityCategories(bucketList);

// Skapa en funktion som ritar upp listan dynamiskt i DOM ----------------------------------------------------
function renderBucketList() {
  bucketList.forEach((activity) => {
    // Här skapas ett nytt ul-element utifrån className = aktuell kategori
    const newUlElemByActivityCategory = document.querySelector(
      `.${activity.category}`
    );

    // Ny li för varje aktivitet
    const newListItemElem = document.createElement("li");
    newUlElemByActivityCategory.appendChild(newListItemElem);

    // Varje li får: -----------------------------------------
    // Ett p-element för att skriva ut beskrivningen
    const newParagraphElem = document.createElement("p");
    newParagraphElem.textContent = activity.description;
    newListItemElem.appendChild(newParagraphElem);

    // En knapp för att klarmarkera aktiviteten
    const newBtnElemDone = document.createElement("button");
    newBtnElemDone.textContent = "Klar"; // Ska kopplas till boolean isDone - default värde = false men denna knapp ska trigga true
    newListItemElem.appendChild(newBtnElemDone);

    // En knapp för att ta bort aktiviteten från listan
    const newBtnElemDel = document.createElement("button");
    newBtnElemDel.textContent = "Ta bort";
    newListItemElem.appendChild(newBtnElemDel);
    // --------------------------------------------------------
  });
}

renderBucketList();

// Lägg till en eventlyssnare på formuläret för att lägga till nya aktiviteter

// PSEUDOKOD --------------------------------------------------
// - funktionen ska fånga upp värdet av användarens input
// - detta värde ska sparas i en variabel
// - kolla om det finns en ul med aktuell category / finns HTML-elementet
// - JA? push ny aktivitet till arrayen bucketList
// - NEJ? skapa det ul elementet först med className som sin category SEN push aktivitet till array bucketList
// ------------------------------------------------------------

// Skapa en funktion som rensar din lista när sidan laddas om
