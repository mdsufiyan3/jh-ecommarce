// Function to update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartIcon = document.querySelector('.fa-shopping-cart');
    
    if (!cartIcon) return;

    // Remove existing cart count if any
    const existingCount = document.querySelector('.cart-count');
    if (existingCount) {
        existingCount.remove();
    }

    // Only show count if there are items
    if (cartItems.length > 0) {
        const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        const cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        cartCount.textContent = totalItems;
        cartIcon.parentElement.appendChild(cartCount);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Hide cart icon if not logged in
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            cartIcon.parentElement.style.display = 'none';
        }
    } else {
        // Update cart count if logged in
        updateCartCount();
    }
});

// Add styles for cart count
const style = document.createElement('style');
style.textContent = `
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #6B7FD7;
        color: white;
        font-size: 12px;
        min-width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
    }

    .nav-icon {
        position: relative;
    }
`;
document.head.appendChild(style); 