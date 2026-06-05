//Hämtar token
const token = localStorage.getItem("token");

//Om ingen token finns skickas användaren till login-sidan
if (!token) {
    window.location.href = "login.html";
}

//Hämtar logga ut knappen
const logoutBTN = document.getElementById("logout-btn");

//Lyssnar efter klick
logoutBTN.addEventListener("click", () => {

    //Tar bort token
    localStorage.removeItem("token");

    //Skickar användaren till logga in sidan
    window.location.href = "login.html";
});

//Hämtar container för maträtterna
const menuContainer = document.getElementById("menu-container");

//Sparar id för maträtten som redigeras
let editId = null;

//Funktion som hämtar alla maträtter
async function loadMenuItems() {
    try {
        //Hämtar alla maträtter från API:t
        const response = await fetch("http://localhost:3000/api/menu");

        //Omvandlar till JSON
        const menuItems = await response.json();

        //Tömmer containern
        menuContainer.innerHTML = "";

        //Loopar igenom alla maträtter
        menuItems.forEach(item => {

            //Skapar kort för varje maträtt
            const card = `
<div class="menu-card">

    <div class="menu-info">

        <h3>${item.title}</h3>

        <p>${item.description}</p>

        <p class="price">${item.price} kr</p>

        <p>Kategori: ${item.category}</p>

    </div>

    <div class="menu-actions">

        <button class="edit-btn" data-id="${item._id}">
            Redigera
        </button>

        <button class="delete-btn" data-id="${item._id}">
            Ta bort
        </button>

    </div>

</div>
`;

            //Lägger till kortet på sidan
            menuContainer.innerHTML += card;
        });

        //Hämtar knappen för att ta bort
        const deleteButtons = document.querySelectorAll(".delete-btn");

        deleteButtons.forEach(button => {

            button.addEventListener("click", async () => {

                const id = button.dataset.id;

                const confirmed = confirm(
                    "Är du säker på att du vill ta bort maträtten?"
                );

                if (!confirmed) {
                    return;
                }

                try {

                    const response = await fetch(
                        `http://localhost:3000/api/menu/${id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );

                    const data = await response.json();

                    console.log(data);

                    loadMenuItems();

                } catch (error) {

                    console.error(error);

                }

            });
        });

        //Hämtar alla redigera-knappar
        const editButtons = document.querySelectorAll(".edit-btn");

        //Loopar igenom alla redigera-knappar
        editButtons.forEach(button => {

            //Lyssnar efter klick på knappen
            button.addEventListener("click", () => {

                const id = button.dataset.id;

                //Letar upp maträtten i arrayen
                const item = menuItems.find(item => item._id === id);

                editId = id;

                //Fyller formuläret med maträttens nuvarande titel
                document.getElementById("title").value = item.title;

                //Fyller formuläret med maträttens nuvarande beskrivning
                document.getElementById("description").value = item.description;

                //Fyller formuläret med maträttens nuvarande pris
                document.getElementById("price").value = item.price;

                //Fyller formuläret med maträttens nuvarande kategori
                document.getElementById("category").value = item.category;

                //Ändrar rubriken så att användaren ser vad som redigeras
                document.getElementById("form-title").textContent = `Redigerar: ${item.title}`;

                //scrolla automatiskt till formuläret
                document.getElementById("form-section").scrollIntoView();
            });
        });

    } catch (error) {
        console.error(error);
    }
}
//Anropar funktionen
loadMenuItems();

//Hämtar formuläret
const menuForm = document.getElementById("menu-form");

//Lyssnar efter när formuläret skickas
menuForm.addEventListener("submit", async (event) => {

    //Hindrar sidan från att laddas om
    event.preventDefault();

    //Hämta värden från formuläret
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;

    try {
        let response;

        //Kontrollerar om användaren redigerar en maträtt
        if (editId) {

            //Uppdaterar befintlig maträtt
            response = await fetch(
                `http://localhost:3000/api/menu/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",

                        //Skickar med JWT-token
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        price,
                        category
                    })
                }
            );

        } else {
            //Skapar ny maträtt
            response = await fetch(
                "http://localhost:3000/api/menu",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",

                        //Skickar med JWT-token
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        price,
                        category
                    })
                }
            );

        }
        const data = await response.json();
        console.log(data);

        //Rensar formuläret
        menuForm.reset();

        //Återställer redigeringsläget
        editId = null;

        //Återställer rubriken
        document.getElementById("form-title").textContent =
            "Ny maträtt";

        //Laddar om alla maträtter
        loadMenuItems();

    } catch (error) {
        console.error(error);
    }
});