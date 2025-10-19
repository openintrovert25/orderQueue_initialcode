// Sample Order Data
let orders = [
    {
        id: 'ORD-2025-001',
        customer: {
            name: 'Sarah Johnson',
            email: 'sarah.j@gmail.com',
            avatar: 'SJ'
        },
        status: 'complete',
        items: [
            { name: 'Burger Deluxe', quantity: 2, price: 12.99 },
            { name: 'French Fries', quantity: 1, price: 3.99 },
            { name: 'Coke', quantity: 2, price: 2.50 }
        ],
        total: 45.99,
        eta: '15 mins'
    },
    {
        id: 'ORD-2025-002',
        customer: {
            name: 'Mike Chen',
            email: 'mike.chen@gmail.com',
            avatar: 'MC'
        },
        status: 'ready',
        items: [
            { name: 'Pizza Margherita', quantity: 1, price: 18.50 },
            { name: 'Garlic Bread', quantity: 1, price: 4.99 }
        ],
        total: 28.50,
        eta: 'Ready now'
    },
    {
        id: 'ORD-2025-003',
        customer: {
            name: 'Emma Davis',
            email: 'emma.d@gmail.com',
            avatar: 'ED'
        },
        status: 'pending',
        items: [
            { name: 'Chicken Wings', quantity: 1, price: 12.99 }
        ],
        total: 12.99,
        eta: '25 mins'
    },
    {
        id: 'ORD-2025-004',
        customer: {
            name: 'James Wilson',
            email: 'james.w@gmail.com',
            avatar: 'JW'
        },
        status: 'preparing',
        items: [
            { name: 'Steak Medium Rare', quantity: 1, price: 28.99 },
            { name: 'Mashed Potatoes', quantity: 1, price: 5.99 },
            { name: 'Caesar Salad', quantity: 1, price: 7.99 }
        ],
        total: 42.97,
        eta: '20 mins'
    },
    {
        id: 'ORD-2025-005',
        customer: {
            name: 'Lisa Anderson',
            email: 'lisa.a@gmail.com',
            avatar: 'LA'
        },
        status: 'canceled',
        items: [
            { name: 'Pasta Carbonara', quantity: 1, price: 16.99 }
        ],
        total: 16.99,
        eta: 'Canceled'
    }
];

// State Management
let currentEditingOrder = null;
let currentDeletingOrder = null;
let filteredOrders = [...orders];

// DOM Elements
const ordersGrid = document.getElementById('ordersGrid');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Modal Elements
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const closeModalBtn = document.getElementById('closeModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Filters
    searchInput.addEventListener('input', filterOrders);
    statusFilter.addEventListener('change', filterOrders);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Modals
    closeModalBtn.addEventListener('click', closeEditModal);
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    cancelBtn.addEventListener('click', closeEditModal);
    saveBtn.addEventListener('click', saveOrderChanges);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Filter Orders
function filterOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm);

        const matchesStatus = 
            statusValue === 'all' || order.status === statusValue;

        return matchesSearch && matchesStatus;
    });

    renderOrders();
}

// Clear Filters
function clearFilters() {
    searchInput.value = '';
    statusFilter.value = 'all';
    filteredOrders = [...orders];
    renderOrders();
}

// Render Orders
function renderOrders() {
    if (filteredOrders.length === 0) {
        ordersGrid.innerHTML = `
            <div class="empty-state">
                <h3>No orders found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    ordersGrid.innerHTML = filteredOrders.map(order => `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-id">#${order.id}</div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            
            <div class="customer-info">
                <div class="customer-avatar">${order.customer.avatar}</div>
                <div class="customer-details">
                    <h3>${order.customer.name}</h3>
                    <p>${order.customer.email}</p>
                </div>
            </div>
            
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Items:</span>
                    <span class="detail-value">${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">₱${order.total.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">ETA:</span>
                    <span class="detail-value">${order.eta}</span>
                </div>
            </div>
            
            <div class="order-actions">
                ${getOrderActionButtons(order)}
            </div>
        </div>
    `).join('');

    // Attach event listeners to buttons
    attachOrderEventListeners();
}

// Get Action Buttons Based on Status
function getOrderActionButtons(order) {
    const editBtn = `<button class="btn btn-icon" onclick="editOrder('${order.id}')" title="Edit Order">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    </button>`;
    const deleteBtn = `<button class="btn btn-icon btn-danger-icon" onclick="openDeleteModal('${order.id}')" title="Delete Order">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    </button>`;

    switch(order.status) {
        case 'pending':
            return `
                <button class="btn btn-warning" onclick="updateOrderStatus('${order.id}', 'preparing')">✓ Start Preparing</button>
                ${editBtn}
                ${deleteBtn}
            `;
        case 'preparing':
            return `
                <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}', 'ready')">✓ Mark as Ready</button>
                ${editBtn}
                ${deleteBtn}
            `;
        case 'ready':
            return `
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'complete')">✓ Complete</button>
                ${editBtn}
                ${deleteBtn}
            `;
        case 'complete':
            return `
                ${editBtn}
                ${deleteBtn}
            `;
        case 'canceled':
            return deleteBtn;
        default:
            return `${editBtn}${deleteBtn}`;
    }
}

// Attach Event Listeners
function attachOrderEventListeners() {
    // Event listeners are handled through onclick in the HTML
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        
        // Update ETA based on status
        switch(newStatus) {
            case 'preparing':
                orders[orderIndex].eta = '20 mins';
                break;
            case 'ready':
                orders[orderIndex].eta = 'Ready now';
                break;
            case 'complete':
                orders[orderIndex].eta = 'Completed';
                break;
            case 'canceled':
                orders[orderIndex].eta = 'Canceled';
                break;
        }
        
        filterOrders();
        showNotification(`Order ${orderId} updated to ${newStatus}`);
    }
}

// Edit Order
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentEditingOrder = orderId;

    // Populate modal fields
    document.getElementById('modalOrderId').value = order.id;
    document.getElementById('modalCustomerName').value = order.customer.name;
    document.getElementById('modalCustomerEmail').value = order.customer.email;
    document.getElementById('modalStatus').value = order.status;
    document.getElementById('modalTotal').value = `${order.total.toFixed(2)}`;
    document.getElementById('modalEta').value = order.eta;

    // Populate items
    const itemsContainer = document.getElementById('modalItems');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="item-entry">
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-details">Qty: ${item.quantity} × ${item.price.toFixed(2)}</div>
            </div>
            <div class="item-details">${(item.quantity * item.price).toFixed(2)}</div>
        </div>
    `).join('');

    openEditModal();
}

// Save Order Changes
function saveOrderChanges() {
    if (!currentEditingOrder) return;

    const orderIndex = orders.findIndex(o => o.id === currentEditingOrder);
    if (orderIndex !== -1) {
        const newStatus = document.getElementById('modalStatus').value;
        orders[orderIndex].status = newStatus;

        // Update ETA based on status
        switch(newStatus) {
            case 'pending':
                orders[orderIndex].eta = '25 mins';
                break;
            case 'preparing':
                orders[orderIndex].eta = '20 mins';
                break;
            case 'ready':
                orders[orderIndex].eta = 'Ready now';
                break;
            case 'complete':
                orders[orderIndex].eta = 'Completed';
                break;
            case 'canceled':
                orders[orderIndex].eta = 'Canceled';
                break;
        }

        filterOrders();
        closeEditModal();
        showNotification(`Order ${currentEditingOrder} has been updated`);
    }
}

// Delete Order Functions
function openDeleteModal(orderId) {
    currentDeletingOrder = orderId;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    currentDeletingOrder = null;
}

function confirmDelete() {
    if (!currentDeletingOrder) return;

    const orderIndex = orders.findIndex(o => o.id === currentDeletingOrder);
    if (orderIndex !== -1) {
        const deletedOrderId = orders[orderIndex].id;
        orders.splice(orderIndex, 1);
        filterOrders();
        closeDeleteModal();
        showNotification(`Order ${deletedOrderId} has been deleted`);
    }
}

// Modal Functions
function openEditModal() {
    editModal.classList.add('active');
}

function closeEditModal() {
    editModal.classList.remove('active');
    currentEditingOrder = null;
}

// Notification Function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// API Functions (Future Implementation)
// These functions can be used to integrate with a backend API

/**
 * Fetch orders from server
 * @returns {Promise<Array>} Array of orders
 */
async function fetchOrdersFromAPI() {
    try {
        // Example API call
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // return data;
        
        // For now, return local data
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Error loading orders');
        return [];
    }
}

/**
 * Update order status on server
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
async function updateOrderStatusAPI(orderId, status) {
    try {
        // Example API call
        // const response = await fetch(`/api/orders/${orderId}`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ status })
        // });
        // const data = await response.json();
        // return data;
        
        console.log(`API: Update order ${orderId} to ${status}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating order:', error);
        showNotification('Error updating order');
        return { success: false };
    }
}

/**
 * Delete order from server
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Deletion result
 */
async function deleteOrderAPI(orderId) {
    try {
        // Example API call
        // const response = await fetch(`/api/orders/${orderId}`, {
        //     method: 'DELETE'
        // });
        // const data = await response.json();
        // return data;
        
        console.log(`API: Delete order ${orderId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting order:', error);
        showNotification('Error deleting order');
        return { success: false };
    }
}

/**
 * Get order details from server
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
async function getOrderDetailsAPI(orderId) {
    try {
        // Example API call
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();
        // return data;
        
        const order = orders.find(o => o.id === orderId);
        return order;
    } catch (error) {
        console.error('Error fetching order details:', error);
        showNotification('Error loading order details');
        return null;
    }
}

/**
 * Search orders on server
 * @param {string} query - Search query
 * @param {string} status - Filter by status
 * @returns {Promise<Array>} Filtered orders
 */
async function searchOrdersAPI(query, status) {
    try {
        // Example API call
        // const params = new URLSearchParams({ query, status });
        // const response = await fetch(`/api/orders/search?${params}`);
        // const data = await response.json();
        // return data;
        
        console.log(`API: Search orders with query "${query}" and status "${status}"`);
        return filteredOrders;
    } catch (error) {
        console.error('Error searching orders:', error);
        showNotification('Error searching orders');
        return [];
    }
}

/**
 * Get customer profile information
 * @param {string} email - Customer email
 * @returns {Promise<Object>} Customer profile
 */
async function getCustomerProfileAPI(email) {
    try {
        // Example API call
        // const response = await fetch(`/api/customers/${email}`);
        // const data = await response.json();
        // return data;
        
        console.log(`API: Get customer profile for ${email}`);
        return null;
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        return null;
    }
}

// Utility Functions

/**
 * Calculate order total
 * @param {Array} items - Order items
 * @returns {number} Total price
 */
function calculateOrderTotal(items) {
    return items.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return `${amount.toFixed(2)}`;
}

/**
 * Get status color class
 * @param {string} status - Order status
 * @returns {string} CSS class name
 */
function getStatusClass(status) {
    return `status-${status}`;
}

/**
 * Export orders to CSV
 */
function exportOrdersToCSV() {
    const headers = ['Order ID', 'Customer', 'Email', 'Status', 'Items', 'Total', 'ETA'];
    const rows = orders.map(order => [
        order.id,
        order.customer.name,
        order.customer.email,
        order.status,
        order.items.length,
        order.total.toFixed(2),
        order.eta
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Make functions globally accessible
window.editOrder = editOrder;
window.updateOrderStatus = updateOrderStatus;
window.openDeleteModal = openDeleteModal;