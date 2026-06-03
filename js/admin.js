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