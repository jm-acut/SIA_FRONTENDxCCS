const API_URL = "https://ccs-qgft.onrender.com/api";

let productCount = 1;

// =====================
// AUTH
// =====================

async function createAccount() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                confirmPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.innerText = data.message;
            return;
        }

        message.style.color = "green";
        message.innerText = data.message;

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch(error) {
        message.innerText = "Server Error";
    }
}

async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.innerText = data.message;
            return;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data.user)
        );

        message.style.color = "green";
        message.innerText = data.message;

        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);

    } catch(error) {
        message.innerText = "Server Error";
    }
}