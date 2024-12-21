// Function to generate random order number
function generateOrderNumber() {
    const prefix = 'HS';
    const random = Math.floor(Math.random() * 100000);
    return `#${prefix}${random.toString().padStart(5, '0')}`;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Function to get order details from localStorage
function getOrderDetails() {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (!lastOrder) {
        return {
            orderNumber: generateOrderNumber(),
            orderDate: new Date(),
            total: '₹2,499',
            paymentMethod: 'UPI',
            productName: 'Sample Product' // Default product name
        };
    }
    return lastOrder;
}

// Function to update order details in the DOM
function updateOrderDetails() {
    const details = getOrderDetails();
    document.getElementById('orderNumber').textContent = details.orderNumber;
    document.getElementById('orderDate').textContent = formatDate(details.orderDate);
    document.getElementById('orderAmount').textContent = details.total;
    document.getElementById('paymentMethod').textContent = details.paymentMethod.toUpperCase();
    document.getElementById('productName').textContent = details.productName;
}

// Function to handle order tracking
function trackOrder() {
    const orderDetails = getOrderDetails();
    if (orderDetails) {
        // Store tracking information in localStorage
        localStorage.setItem('trackingOrder', JSON.stringify(orderDetails));
        window.location.href = 'orders.html';
    }
}

// Function to continue shopping
function continueShopping() {
    window.location.href = 'index.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateOrderDetails();
}); 