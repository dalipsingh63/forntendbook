
// add to cart
document.addEventListener("DOMContentLoaded", function () {
  let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  updateCartNotification();

  document.querySelectorAll(".buy-btn").forEach((button) => {
      button.addEventListener("click", function () {
          let bookCard = this.closest(".cards");
          let bookTitle = bookCard.querySelector(".book-title").textContent;
          let bookPrice = bookCard.querySelector("p").innerHTML;
          let bookImage = bookCard.querySelector("img").src;

          let book = {
              title: bookTitle,
              price: bookPrice,
              image: bookImage,
          };

          cartItems.push(book);
          cartCount++;

          localStorage.setItem("cart", JSON.stringify(cartItems));
          localStorage.setItem("cartCount", cartCount);

          updateCartNotification();
          alert("Book added to cart!");
      });
  });

  function updateCartNotification() {
      const cartBadge = document.getElementById("cart-count");
      if (cartBadge) {
          cartBadge.textContent = cartItems.length;
      }
  }
});


// learn more div
function openPopup(popupId, overlayId) {
  document.getElementById(popupId).style.display = "block";
  document.getElementById(overlayId).style.display = "block"; 
}

function closePopup(popupId, overlayId) {
  document.getElementById(popupId).style.display = "none";
  document.getElementById(overlayId).style.display = "none"; 
}

document.addEventListener("DOMContentLoaded", function () {
    let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    updateCartNotification();

    document.querySelectorAll(".buy-btn").forEach((button) => {
        button.addEventListener("click", function () {
            let bookCard = this.closest(".card");
            let bookTitle = bookCard.querySelector(".book-title").textContent;
            let bookPrice = bookCard.querySelector("p").innerHTML;
            let bookImage = bookCard.querySelector("img").src;

            let book = {
                title: bookTitle,
                price: bookPrice,
                image: bookImage,
            };

            cartItems.push(book);
            cartCount++;

            localStorage.setItem("cart", JSON.stringify(cartItems));
            localStorage.setItem("cartCount", cartCount);

            updateCartNotification();
            alert("Book added to cart!");
        });
    });

    function updateCartNotification() {
        const cartBadge = document.getElementById("cart-count");
        if (cartBadge) {
            cartBadge.textContent = cartItems.length;
        }
    }
});





// Search bar functionality (Home Page)
document.getElementById("searchicon").addEventListener("click", function () {
    let searchQuery = document.querySelector(".searchbar").value.trim().toLowerCase();
    if (searchQuery) {
        window.location.href = `top seller.html?search=${encodeURIComponent(searchQuery)}`;
    }
});

document.querySelector(".searchbar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchicon").click();
    }
});


// baner
// fatch banner
let currentIndex = 0;
let intervalId;

async function fetchBanners() {
    try {
        const response = await fetch("/api/banners");
        const result = await response.json();
        if (result.success && result.banners.length > 0) {
            const container = document.getElementById("bannerContainer");
            container.innerHTML = ""; // Purane banners remove karein
            
            result.banners.forEach(img => {
                const div = document.createElement("div");
                div.classList.add("slide");

                const imgEl = document.createElement("img");
                imgEl.src = img.url;
                imgEl.alt = "Banner Image";

                div.appendChild(imgEl);
                container.appendChild(div);
            });

            startSlider();
        } else {
            console.error("No banners found");
        }
    } catch (error) {
        console.error("Error fetching banners:", error);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    if (totalSlides === 0) return; // Agar slides nahi hain to kuch mat karo

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    document.getElementById("bannerContainer").style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function startSlider() {
    if (intervalId) clearInterval(intervalId); // Pehle se chal raha ho to stop karein
    intervalId = setInterval(nextSlide, 3000);
}

fetchBanners();





// new book 
async function fetchBooks() {
    try {
        const response = await fetch('/api/newbook');
        const data = await response.json();

        if (!data.books || data.books.length === 0) {
            alert("No new books found.");
            return;
        }

        const booksContainer = document.getElementById("booksContainer");
        booksContainer.innerHTML = "";

        data.books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.bookImage}" alt="${book.title}">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-price">₹${book.price} <span class="offer-price">₹${book.offerPrice}</span></div>
                <button class="add-cart">Add to Cart</button>
            `;

            const addToCartBtn = bookCard.querySelector(".add-cart");

            addToCartBtn.addEventListener("click", function(event) {
                event.stopPropagation(); // Taaki pehle cart me add ho

                addToCart(book._id, book.title, book.bookImage, book.price);

                // **Delay ke sath details page open karo**
                setTimeout(() => {
                    window.location.href = `/newbookDetelies.html?id=${book._id}`;
                }, 300); // 300ms ka delay taaki cart me add ho jaye
            });

            booksContainer.appendChild(bookCard);
        });

    } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to load new books.");
    }
}

function addToCart(id, title, image, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, image, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

window.onload = fetchBooks;



// silder book btn
document.getElementById("prevBtn").addEventListener("click", function() {
    console.log("Previous Button Clicked");
    scrollBooks("prev");
});

document.getElementById("nextBtn").addEventListener("click", function() {
    console.log("Next Button Clicked");
    scrollBooks("next");
});

function scrollBooks(direction) {
    let container = document.getElementById("booksContainer");
    let scrollAmount = 300; // Scroll distance

    if (direction === "next") {
        container.scrollLeft += scrollAmount;
    } else {
        container.scrollLeft -= scrollAmount;
    }
}

// old book

    





