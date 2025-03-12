document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function displayCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            if (!item.quantity) {
                item.quantity = 1;  
            }

            let price = parseFloat(item.price.replace("₹", ""));
            let itemTotal = price * item.quantity;
            total += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" width="50"> ${item.title}</td>
                <td>₹${price.toFixed(2)}</td>
                <td>
                    <button class="decrease" data-index="${index}">-</button>
                    ${item.quantity}
                    <button class="increase" data-index="${index}">+</button>
                </td>
                <td>₹${itemTotal.toFixed(2)}</td>
                <td><button class="remove" data-index="${index}"><img  class="delete" src="./images/garbage_335949.png" alt=""></button>
                 <button id="clear-cart">Buy Now</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });

        cartTotal.textContent = total.toFixed(2);

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
                updateCartCount(); 
            });
        });

        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
                updateCartCount(); 
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
                updateCartCount(); 
            });
        });
    }

    clearCartBtn.addEventListener("click", function () {
        localStorage.removeItem("cart");
        cart = [];
        displayCart();
        updateCartCount(); 
    });

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Set default quantity = 1 if undefined
        cart.forEach(item => {
            if (!item.quantity) {
                item.quantity = 1;
            }
        });

        localStorage.setItem("cart", JSON.stringify(cart)); 
        localStorage.setItem("cartCount", cart.length);

        if (document.getElementById("cart-count")) {
            document.getElementById("cart-count").textContent = cart.length;
        }
    }

    displayCart();
    updateCartCount();
});




