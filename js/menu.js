// Hämtar containers
const startersContainer = document.getElementById("starters");
const mainsContainer = document.getElementById("mains");
const dessertsContainer = document.getElementById("desserts");
const drinksContainer = document.getElementById("drinks");

// Hämtar element för felmeddelanden
const errorMessage = document.getElementById("error-message");

//Funktion som hämtar menydata från API:et
async function loadMenu() {
    try {

        //Skickar GET-request till API:et
        const response = await fetch("http://localhost:3000/api/menu");

        //Kontrollera om servern svarade med fel
        if (!response.ok) {
            throw new Error("Kunde inte hämta menyn");
        }

        //Omvandlar svaret från JSON till JavaScript-objekt
        const menuItems = await response.json();

        console.log(menuItems);

        //Loopar igenom alla maträtter
        menuItems.forEach(item => {

            //Skriver ut alla maträtter på sidan
            const card = `
            <div class="menu-card">
            
            <h3>${item.title}</h3>
            
            <p>${item.description}</p>
            
            <p><strong>${item.price} kr</strong></p>
            </div>`;

            //Kollar vilken kategori maträtterns ska visas i
            if (item.category === "Pizza") {
                startersContainer.innerHTML += card;
            }

            else if (item.category === "Pasta") {
                mainsContainer.innerHTML += card;
            }

            else if (item.category === "Efterrätt") {
                dessertsContainer.innerHTML += card;
            }

            else if (item.category === "Dryck") {
                drinksContainer.innerHTML += card;
            }
        });
    } catch (error) {

        // Visar felmeddelande på sidan
        errorMessage.textContent =
            "Tyvärr kunde menyn inte laddas just nu. Försök igen senare.";

            //Skriver även ut felet i konsolen
            console.error("Fel vid hämtning av meny:", error);
    }
}

//Anropar funktionen när sidan laddas
loadMenu();

