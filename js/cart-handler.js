// Function to add item to cart
export function addToCart(product) {
    let cart = [];
    // Get existing cart data
    if (localStorage.getItem('cartItems')) {
        cart = JSON.parse(localStorage.getItem('cartItems'));
    }
    // Add new product
    cart.push(product);
    // Save back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Function to get cart items
export function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
} 