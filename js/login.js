//Hämtar formuläret
const loginForm = document.getElementById("login-form");

//Hämtar meddelande-elementet
const message = document.getElementById("message");

//Lyssnar efter när formuläret skickas
loginForm.addEventListener("submit", async (event) => {

    //Hindrar sidan från att laddas om
    event.preventDefault();

    //Hämtar användarnamn
    const username = document.getElementById("username").value;

    //Hämtar lösenord
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("https://bella-italia-we53.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }
        
        //Spara token i localStorage
        localStorage.setItem("token", data.token);

        //Skickar användaren till adminpanelen
        window.location.href = "admin.html";

    } catch (error) {
        console.error(error);
    }
});