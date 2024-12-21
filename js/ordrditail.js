// Initialize chart when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Updated sample order data with shipped products
    const orders = [
        { 
            id: 1,
            orderId: "ORD-2024-001",
            orderDate: "2024-03-20",
            customer: {
                name: "John Smith",
                email: "john@example.com",
                phone: "1234567890",
                address: "123 Main Street, Apt 4B",
                pincode: "400001"
            },
            product: "Classic T-Shirt",
            size: "XL",
            quantity: 2,
            status: "processing", 
            price: "₹5,999",
            image: "https://via.placeholder.com/150",
            paymentMethod: "COD"
        },
        { 
            id: 2, 
            customer: "Sarah Johnson", 
            product: "Denim Jeans",
            size: "M",
            quantity: 1,
            status: "shipped", 
            price: "₹8,999",
            image: "https://via.placeholder.com/150",
            paymentMethod: "Online"
        },
        { 
            id: 3, 
            customer: "Mike Brown", 
            product: "Hoodie",
            size: "L",
            quantity: 3,
            status: "processing", 
            price: "₹7,999",
            image: "https://via.placeholder.com/150",
            paymentMethod: "COD"
        },
        // Added shipped products
        { 
            id: 4, 
            customer: "Emma Wilson", 
            product: "Running Shoes",
            size: "38",
            quantity: 1,
            status: "shipped", 
            price: "₹1,29,999",
            image: "https://via.placeholder.com/150",
            paymentMethod: "Online"
        },
        { 
            id: 5, 
            customer: "David Lee", 
            product: "Sports Watch",
            size: "One Size",
            quantity: 1,
            status: "shipped", 
            price: "₹1,99,999",
            image: "https://via.placeholder.com/150",
            paymentMethod: "Online"
        }
    ];

    // Updated card creation function
    function createOrdersCards(ordersToShow = orders) {
        const chartSection = document.querySelector('.chart-section');
        const existingCardsSection = document.querySelector('.orders-cards-section');
        
        if (existingCardsSection) {
            existingCardsSection.remove();
        }
        
        const cardsSection = document.createElement('div');
        cardsSection.className = 'orders-cards-section';
        
        if (ordersToShow.length === 0) {
            cardsSection.innerHTML = `
                <div class="no-orders-message">
                    No orders found with this status
                </div>
            `;
        } else {
            const cardsHTML = ordersToShow.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-id">
                            <i class="fas fa-hashtag"></i>
                            <span>${order.orderId}</span>
                        </div>
                        <div class="order-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                    <div class="customer-details">
                        <h3>Customer Information</h3>
                        <div class="customer-info-grid">
                            <div class="info-item">
                                <i class="fas fa-user"></i>
                                <span>${order.customer.name}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-envelope"></i>
                                <span>${order.customer.email}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-phone"></i>
                                <span>${order.customer.phone}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${order.customer.address}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map-pin"></i>
                                <span>${order.customer.pincode}</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-details">
                        <div class="product-image">
                            <img src="${order.image}" alt="${order.product}">
                            <div class="confirm-status-container" id="confirmStatus-${order.id}" style="display: none;">
                                <button class="btn-confirm-status" onclick="confirmStatusChange(${order.id})">
                                    Confirm Status Change
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${order.product}</div>
                            <div class="price-status">
                                <span class="price">${order.price}</span>
                                <div class="payment-method ${order.paymentMethod.toLowerCase()}">
                                    <i class="fas ${order.paymentMethod === 'COD' ? 'fa-money-bill-wave' : 'fa-credit-card'}"></i>
                                    ${order.paymentMethod}
                                </div>
                                <div class="status-container">
                                    <span class="status ${order.status}">${order.status}</span>
                                    <button class="btn-status-edit" onclick="editStatus(${order.id}, this)">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <div class="status-edit-overlay" id="statusOverlay-${order.id}">
                                        <div class="status-options">
                                            ${order.status === 'shipped' ? `
                                                <div class="status-option" data-status="shipped">
                                                    <span class="status-dot shipped"></span>
                                                    Shipped
                                                </div>
                                                <div class="status-option" data-status="delivered">
                                                    <span class="status-dot delivered"></span>
                                                    Delivered
                                                </div>
                                            ` : `
                                                <div class="status-option" data-status="processing">
                                                    <span class="status-dot processing"></span>
                                                    Processing
                                                </div>
                                                <div class="status-option" data-status="shipped">
                                                    <span class="status-dot shipped"></span>
                                                    Shipped
                                                </div>
                                                <div class="status-option" data-status="canceled">
                                                    <span class="status-dot canceled"></span>
                                                    Canceled
                                                </div>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="product-specs">
                                <div class="size">
                                    Size: <span>${order.size}</span>
                                </div>
                                <div class="quantity">
                                    Quantity: <span>${order.quantity}</span>
                                </div>
                            </div>
                            <div class="card-actions">
                                <button class="btn-view" onclick="viewDetails(${order.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
            cardsSection.innerHTML = cardsHTML;
        }
        
        chartSection.parentNode.insertBefore(cardsSection, chartSection);
    }

    // Update status counts
    function updateStatusCounts() {
        const processingCount = orders.filter(order => order.status === "processing").length;
        const shippedCount = orders.filter(order => order.status === "shipped").length;
        const deliveredCount = orders.filter(order => order.status === "delivered").length;
        const canceledCount = orders.filter(order => order.status === "canceled").length;

        // Update the DOM
        document.querySelector('.status-card:nth-child(1) .status-count').textContent = processingCount;
        document.querySelector('.status-card:nth-child(2) .status-count').textContent = shippedCount;
        document.querySelector('.status-card:nth-child(3) .status-count').textContent = deliveredCount;
        document.querySelector('.status-card:nth-child(4) .status-count').textContent = canceledCount;
    }

    // New function to update cards display
    function updateOrdersCards(filteredOrders) {
        createOrdersCards(filteredOrders);
    }

    // Initialize the page with all cards
    createOrdersCards();
    updateStatusCounts();

    // Sidebar toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        mainContent.classList.toggle('shift');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
            mainContent.classList.remove('shift');
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Updated editStatus function
    window.editStatus = function(orderId, buttonElement) {
        const overlay = document.getElementById(`statusOverlay-${orderId}`);
        const currentStatus = buttonElement.previousElementSibling.textContent;
        
        if (overlay.style.display === 'block') {
            overlay.style.display = 'none';
        } else {
            document.querySelectorAll('.status-edit-overlay').forEach(el => {
                el.style.display = 'none';
            });
            overlay.style.display = 'block';
        }

        const statusOptions = overlay.querySelectorAll('.status-option');
        statusOptions.forEach(option => {
            option.onclick = function() {
                const newStatus = this.dataset.status;
                const statusElement = buttonElement.previousElementSibling;
                
                // Update status text but don't confirm yet
                statusElement.className = `status ${newStatus}`;
                statusElement.textContent = newStatus;
                
                // Show confirm button
                const confirmContainer = document.getElementById(`confirmStatus-${orderId}`);
                confirmContainer.style.display = 'block';
                
                // Hide overlay
                overlay.style.display = 'none';
            };
        });
    };

    // Add confirm status change function
    window.confirmStatusChange = function(orderId) {
        // Find the order and update its status
        const order = orders.find(o => o.id === orderId);
        const newStatus = document.querySelector(`#statusOverlay-${orderId}`).previousElementSibling.previousElementSibling.textContent;
        
        if (order) {
            // Update the order status
            order.status = newStatus;
            
            // Hide confirm button
            const confirmContainer = document.getElementById(`confirmStatus-${orderId}`);
            confirmContainer.style.display = 'none';

            // Update status counts
            updateStatusCounts();

            // If we're currently filtering by status, refresh the display
            const activeCard = document.querySelector('.status-card.active');
            if (activeCard) {
                const activeStatus = activeCard.querySelector('h3').textContent.toLowerCase();
                const filteredOrders = orders.filter(order => order.status === activeStatus);
                updateOrdersCards(filteredOrders);
            } else {
                // If no filter is active, show all orders
                updateOrdersCards(orders);
            }
        }
    };

    // Close overlay when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.status-container')) {
            document.querySelectorAll('.status-edit-overlay').forEach(overlay => {
                overlay.style.display = 'none';
            });
        }
    });

    // Add click event listeners to status cards
    const statusCards = document.querySelectorAll('.status-card');
    let activeFilter = 'all';

    statusCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            // Remove active class from all cards
            statusCards.forEach(c => c.classList.remove('active'));
            
            // Get status from the card's heading
            const status = this.querySelector('h3').textContent.toLowerCase();
            
            if (activeFilter === status) {
                // If clicking the same filter, show all orders
                activeFilter = 'all';
                updateOrdersCards(orders);
            } else {
                // Apply new filter
                activeFilter = status;
                this.classList.add('active');
                const filteredOrders = orders.filter(order => order.status === status);
                updateOrdersCards(filteredOrders);
            }
        });
    });
}); 