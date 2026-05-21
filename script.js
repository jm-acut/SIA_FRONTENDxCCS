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
        console.log(error);
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
        console.log(error);
        message.innerText = "Server Error";
    }
}

// =====================
// PRODUCTS
// =====================

async function loadProducts() {

    try {

        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();

        console.log(products);

    } catch(error) {
        console.log(error);
    }
}

// =====================
// CART
// =====================

async function addToCart(name, price, image) {

    const cartItem = {
        id: Date.now(),
        name,
        price,
        quantity: productCount,
        image
    };

    try {

        const response = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartItem)
        });

        const data = await response.json();

        alert(data.message);

    } catch(error) {
        console.log(error);
    }
}

async function displayCartItems() {

    try {

        const response = await fetch(`${API_URL}/cart`);
        const carts = await response.json();

        console.log(carts);

    } catch(error) {
        console.log(error);
    }
}

async function removeCartItem(id) {

    try {

        const response = await fetch(`${API_URL}/cart/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        location.reload();

    } catch(error) {
        console.log(error);
    }
}

// =====================
// ORDERS
// =====================

async function placeOrder() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const orderData = {
        name,
        email,
        phone,
        address,
        items: [],
        total: 0
    };

    try {

        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        alert(data.message);

        window.location.href = "order-confirmation.html";

    } catch(error) {
        console.log(error);
    }
}

// =====================
// NAVIGATION
// =====================

function goToCreate() {
    window.location.href = "create.html";
}

function goToLogin() {
    window.location.href = "index.html";
}

// =====================
// QUANTITY
// =====================

function increaseQuantity() {
    productCount++;
}

function decreaseQuantity() {

    if (productCount > 1) {
        productCount--;
    }
}
