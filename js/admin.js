//Hämtar token
const token = localStorage.getItem("token");

//Om ingen token finns skickas användaren till login-sidan
if (!token) {
    window.location.href ="login.html";
}

