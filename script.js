let currentSlide = 0;
let slides = document.querySelectorAll(".slide");
let slideInterval;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("next").addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
  });

  document.getElementById("prev").addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
  });

  showSlide(currentSlide);
  startAutoSlide();

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  const form = document.getElementById("registrationform");
  form.addEventListener("submit", function (e) {
    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const ticket = document.getElementById("ticket").value;
    const visitors = document.getElementById("no-of-visitors").value;
    const visitDate = document.getElementById("date-of-visit").value;

    if (name === "") {
      document.getElementById("nameError").textContent = "name is required";
      valid = false;
    } else {
      document.getElementById("nameError").textContent = "";
    }

    if (email === "") {
      document.getElementById("emailError").textContent = "enter a valid email";
      valid = false;
    } else {
      document.getElementById("emailError").textContent = "";
    }

    if (dob === "") {
      document.getElementById("dobError").textContent = "select your birth date";
      valid = false;
    } else {
      document.getElementById("dobError").textContent = "";
    }

    if (!gender) {
      document.getElementById("genderError").textContent = "select your gender";
      valid = false;
    } else {
      document.getElementById("genderError").textContent = "";
    }

    if (ticket === "") {
      document.getElementById("ticketError").textContent = "choose a ticket type";
      valid = false;
    } else {
      document.getElementById("ticketError").textContent = "";
    }

    if (visitors === "") {
      document.getElementById("visitorsError").textContent = "select the number of visitors";
      valid = false;
    } else {
      document.getElementById("visitorsError").textContent = "";
    }

    if (visitDate === "") {
      document.getElementById("visitDateError").textContent = "select your visit date";
      valid = false;
    } else {
      document.getElementById("visitDateError").textContent = "";
    }

    if (!valid) e.preventDefault();
  });

  // 🛒 Shopping Section Logic
  const searchInput = document.getElementById("searchInput");
  const productList = document.getElementById("productList");
  const checkoutBtn = document.getElementById("checkoutBtn");
  let products = [];
  let cart = [];

  fetch("ghibli_merchandise.json")
    .then(response => response.json())
    .then(data => {
      products = data;
      displayProducts(products);
    });

  function displayProducts(productArray) {
    productList.innerHTML = "";
    productArray.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="assets/${product.id}.jpg" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button data-id="${product.id}">Add to Cart</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        if (!cart.find(item => item.id === product.id)) {
          cart.push(product);
        }
        checkoutBtn.classList.remove("hidden");
      });

      productList.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
    displayProducts(filtered);
  });

  // ✅ Checkout section
  const checkoutSection = document.createElement("section");
  checkoutSection.id = "checkout";
  checkoutSection.classList.add("hidden");
  checkoutSection.innerHTML = `
    <h2>Checkout</h2>
    <div id="cartItems"></div>
    <p>Total: $<span id="totalPrice">0</span></p>
    <button id="proceedToPaymentBtn">Proceed to Payment</button>
  `;
  document.body.insertBefore(checkoutSection, document.getElementById("registration"));

  const paymentSection = document.createElement("section");
  paymentSection.id = "payment";
  paymentSection.classList.add("hidden");
  paymentSection.innerHTML = `
    <h2>Payment</h2>
    <form id="paymentForm">
      <label>Name on Card:<input type="text" id="cardName" required></label><br>
      <label>Card Number:<input type="text" id="cardNumber" required></label><br>
      <label>Expiry Date:<input type="month" id="expiry" required></label><br>
      <label>CVV:<input type="text" id="cvv" required></label><br>
      <button type="submit">Confirm</button>
    </form>
  `;
  document.body.insertBefore(paymentSection, document.getElementById("registration"));

  const confirmationSection = document.createElement("section");
  confirmationSection.id = "confirmation";
  confirmationSection.classList.add("hidden");
  confirmationSection.innerHTML = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order. It will be delivered in the next 3-4 working days.</p>
    <p>Your total: $<span id="finalTotal"></span></p>
    <button id="backToShopBtn">Back to Shopping</button>
  `;
  document.body.insertBefore(confirmationSection, document.getElementById("registration"));

  checkoutBtn.addEventListener("click", () => {
    document.getElementById("shopping").classList.add("hidden");
    checkoutSection.classList.remove("hidden");
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = cart.map(p => `<p>${p.name} - $${p.price}</p>`).join(" ");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("totalPrice").textContent = total;
  });

  document.getElementById("proceedToPaymentBtn").addEventListener("click", () => {
    checkoutSection.classList.add("hidden");
    paymentSection.classList.remove("hidden");
  });

  document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    paymentSection.classList.add("hidden");
    confirmationSection.classList.remove("hidden");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("finalTotal").textContent = total;
  });

  document.getElementById("backToShopBtn").addEventListener("click", () => {
    confirmationSection.classList.add("hidden");
    document.getElementById("shopping").classList.remove("hidden");
  });
});