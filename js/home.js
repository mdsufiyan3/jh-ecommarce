import { auth, db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail) {
        // User is logged in, show user-specific elements
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = userEmail;
        }
    } else {
        // User is not logged in, hide user-specific elements
        // Optional: Update UI to show "Login" instead of user info
        const userElements = document.querySelectorAll('.user-specific');
        userElements.forEach(el => el.style.display = 'none');
    }

    updateCartCount();
});

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartItems.length > 0) {
        cartCount.style.display = 'flex';
        cartCount.textContent = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    } else {
        cartCount.style.display = 'none';
    }
}

function requireLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Only redirect to login when trying to access protected features
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = 'Added to Cart!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Add background to header when scrolling
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(107, 127, 215, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
        ${message}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 2000);
}
 