const API_URL = "https://ccs-qgft.onrender.com/api";

let productCount = 1;

// =====================
// AUTH
// =====================

async function createAccount() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");

    try {

        const response =
            await fetch(`${API_URL}/register`, {

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

        const data =
            await response.json();

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

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("message");

    try {

        const response =
            await fetch(`${API_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data =
            await response.json();

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
// QUANTITY
// =====================

function increase() {

    productCount++;

    const count =
        document.getElementById("count");

    if (count) {
        count.innerText = productCount;
    }
}

function decrease() {

    if (productCount > 1) {

        productCount--;

        const count =
            document.getElementById("count");

        if (count) {
            count.innerText = productCount;
        }
    }
}

// =====================
// CART
// =====================

async function addToCart() {

    const product =
        document.querySelector(".product-details");

    const name =
        product.dataset.productName;

    const price =
        Number(product.dataset.productPrice);

    const image =
        product.dataset.productImage;

    const cartItem = {

        id: Date.now(),
        name,
        price,
        quantity: productCount,
        image
    };

    try {

        const response =
            await fetch(`${API_URL}/cart`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cartItem)
        });

        const data =
            await response.json();

        alert(data.message);

    } catch(error) {

        console.log(error);

        alert("Failed to add cart");
    }
}

async function displayCartItems() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    try {

        const response =
            await fetch(`${API_URL}/cart`);

        const carts =
            await response.json();

        cartItems.innerHTML = "";

        let total = 0;

        if (carts.length === 0) {

            cartItems.innerHTML =
                "<p>Your cart is empty</p>";

            cartTotal.innerText = "₱0.00";

            return;
        }

        carts.forEach(item => {

            const subtotal =
                item.price * item.quantity;

            total += subtotal;

            const div =
                document.createElement("div");

            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: ₱${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Subtotal: ₱${subtotal}</p>

                <button onclick="removeCartItem(${item.id})">
                    Remove
                </button>

                <hr>
            `;

            cartItems.appendChild(div);
        });

        cartTotal.innerText =
            `₱${total.toFixed(2)}`;

    } catch(error) {

        console.log(error);
    }
}

async function removeCartItem(id) {

    try {

        const response =
            await fetch(`${API_URL}/cart/${id}`, {

            method: "DELETE"
        });

        const data =
            await response.json();

        alert(data.message);

        displayCartItems();

    } catch(error) {

        console.log(error);
    }
}

// =====================
// CHECKOUT
// =====================

function goToCheckout() {

    window.location.href =
        "checkout.html";
}

async function displayCheckoutItems() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    if (!checkoutItems || !checkoutTotal) return;

    try {

        const response =
            await fetch(`${API_URL}/cart`);

        const cart =
            await response.json();

        checkoutItems.innerHTML = "";

        let total = 0;

        if (cart.length === 0) {

            checkoutItems.innerHTML =
                "<p>Your cart is empty</p>";

            checkoutTotal.innerText = "₱0.00";

            return;
        }

        cart.forEach(item => {

            const subtotal =
                item.price * item.quantity;

            total += subtotal;

            const div =
                document.createElement("div");

            div.innerHTML = `
                <h4>${item.name}</h4>
                <p>₱${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Subtotal: ₱${subtotal}</p>
                <hr>
            `;

            checkoutItems.appendChild(div);
        });

        checkoutTotal.innerText =
            `₱${total.toFixed(2)}`;

    } catch(error) {

        console.log(error);
    }
}

// =====================
// PLACE ORDER
// =====================

async function placeOrder() {

    const name =
        document.getElementById("fullName").value;

    const email =
        document.getElementById("emailAddress").value;

    const phone =
        document.getElementById("phoneNumber").value;

    const address =
        document.getElementById("deliveryAddress").value;

    try {

        const cartResponse =
            await fetch(`${API_URL}/cart`);

        const cart =
            await cartResponse.json();

        let total = 0;

        cart.forEach(item => {

            total +=
                item.price * item.quantity;
        });

        const orderData = {

            name,
            email,
            phone,
            address,
            items: cart,
            total
        };

        const response =
            await fetch(`${API_URL}/orders`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(orderData)
        });

        const data =
            await response.json();

        localStorage.setItem(
            "currentOrder",
            JSON.stringify(data.order)
        );

        window.location.href =
            "order-confirmation.html";

    } catch(error) {

        console.log(error);

        alert("Order failed");
    }
}

// =====================
// ORDER CONFIRMATION
// =====================

function displayOrderConfirmation() {

    const order =
        JSON.parse(
            localStorage.getItem("currentOrder")
        );

    if (!order) return;

    document.getElementById("orderNumber").innerText =
        order.orderNumber;

    document.getElementById("customerName").innerText =
        order.name;

    document.getElementById("customerEmail").innerText =
        order.email;

    document.getElementById("customerPhone").innerText =
        order.phone;

    document.getElementById("customerAddress").innerText =
        order.address;

    document.getElementById("totalAmount").innerText =
        `₱${order.total}`;

    const today = new Date();

    document.getElementById("orderDate").innerText =
        today.toLocaleDateString();

    const delivery = new Date();

    delivery.setDate(today.getDate() + 3);

    document.getElementById("estimatedDelivery").innerText =
        delivery.toLocaleDateString();
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
// AUTO LOAD
// =====================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        displayCartItems();

        displayCheckoutItems();

        displayOrderConfirmation();
    }
);
