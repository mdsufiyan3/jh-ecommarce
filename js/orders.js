import { loadOrders } from './firebase-utils.js';

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userEmail');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    // Show loading spinner
    const ordersContainer = document.querySelector('.orders-container');
    const loadingSpinner = document.getElementById('loadingSpinner');
    ordersContainer.classList.add('loading');
    loadingSpinner.classList.add('active');

    // Load orders from Firebase
    let orders = [];
    try {
        orders = await loadOrders(userId);
        console.log('Loaded orders:', orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    } finally {
        // Hide loading spinner
        ordersContainer.classList.remove('loading');
        loadingSpinner.classList.remove('active');
    }

    // Function to display orders
    function displayOrders(status = 'all') {
        const ordersList = document.getElementById('ordersList');
        
        // Add validation to filter out invalid orders
        const validOrders = orders.filter(order => {
            return order.orderId && 
                   order.createdAt && 
                   order.items && 
                   Array.isArray(order.items) &&
                   order.total &&
                   order.status;
        });

        const filteredOrders = status === 'all' 
            ? validOrders 
            : validOrders.filter(order => order.status === status);

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">No orders found</div>';
            return;
        }

        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-card">
                <div class="order-id-section">
                    <div class="order-id-label">
                        <i class="fas fa-hashtag"></i>
                        <span class="order-id">${order.orderId}</span>
                    </div>
                    <div class="order-date">
                        <i class="far fa-calendar-alt"></i>
                        <span>${formatDate(order.createdAt)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image || ''}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-specs">
                                    <span class="item-size">${item.size || 'M'}</span>
                                </div>
                                <div class="item-quantity">Qty: ${item.quantity}</div>
                                <div class="item-price">${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ${order.total}</div>
                    <div class="status-controls">
                        <span class="status-indicator status-${order.status}">
                            <i class="fas fa-circle"></i>
                            ${order.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Update order count
        document.querySelector('.order-count span').textContent = filteredOrders.length;
    }

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Track current tab
    let currentTab = 'all';

    // Add tab functionality
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.status;
            displayOrders(currentTab);
        });
    });

    // Initialize display
    displayOrders();
}); 