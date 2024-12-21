import { loadCart, saveCart } from './firebase-utils.js';

// Add loading overlay functions
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('btn-loading');
    } else {
        button.classList.remove('btn-loading');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userEmail');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    showLoading();
    try {
        const cartItems = await loadCart(userId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCart();
    } catch (error) {
        console.error('Error loading cart:', error);
    } finally {
        hideLoading();
    }

    // Update checkout button handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            setButtonLoading(checkoutBtn, true);
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }

    // Add event listener for continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');

    // Show/hide appropriate containers
    if (cartItems.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartContent.style.display = 'flex';
    emptyCart.style.display = 'none';

    // Display cart items
    let total = 0;
    cartItemsContainer.innerHTML = '';

    cartItems.forEach((item, index) => {
        const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
        total += price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <div class="item-meta">
                        <p class="price">${item.price}</p>
                        <span class="size-badge">Size: ${item.size || 'N/A'}</span>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    // Update summary
    const subtotal = total;
    const shipping = total > 0 ? 25 : 0;
    const finalTotal = subtotal + shipping;

    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('shipping').textContent = `₹${shipping.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('total').textContent = `₹${finalTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

window.updateQuantity = async function(index, change) {
    const userId = localStorage.getItem('userEmail');
    if (!userId) return;

    showLoading();
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
    
    try {
        await saveCart(userId, cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCart();
    } catch (error) {
        console.error('Error updating cart:', error);
    } finally {
        hideLoading();
    }
};

window.removeItem = async function(index) {
    const userId = localStorage.getItem('userEmail');
    if (!userId) return;

    showLoading();
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    
    try {
        await saveCart(userId, cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCart();
    } catch (error) {
        console.error('Error removing item:', error);
    } finally {
        hideLoading();
    }
};
