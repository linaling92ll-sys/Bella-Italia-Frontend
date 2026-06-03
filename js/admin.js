//Hämtar token
const token = localStorage.getItem("token");

//Om ingen token finns skickas användaren till login-sidan
if (!token) {
    window.location.href ="login.html";
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
            <div slass="menu-card">
            
            <h3>${item.title}</h3>
            
            <p>${item.description}</p>
            
            <p><strong>${item.price} kr</strong></p>
            
            <p>Kategori: ${item.category}</p>
            
            <button class="edit-btn" data-id="${item._id}">
            Redigera
            </button>
            
            <button class="delete-btn" data-id="${item._id}">
            Ta bort maträtt
            </button>
            
            </div>
            `;

            //Lägger till kortet på sidan
            menuContainer.innerHTML += card;
        });

        const deleteButtons = document.querySelectorAll(".delete-btn");

        deleteButtons.forEach(button => {

            button.addEventListener("click", () => {
                const id = button.dataset.id;

                console.log(id);
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
        const response = await fetch("http://localhost:3000/api/menu", {
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
        });

        const data = await response.json();
        //Rensar formuläret
        menuForm.reset();

        //Laddar om alla maträtter
        loadMenuItems();
    } catch (error) {
        console.error(error);
    }
});