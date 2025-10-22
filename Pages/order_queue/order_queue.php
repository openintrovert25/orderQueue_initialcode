<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Queue Management - Whakapapa</title>
    <link rel="stylesheet" href="order_queue.css">
    <link rel="stylesheet" href="../../components/headers/header.css">
    <link rel="stylesheet" href="../../components/footers/footer.css">
</head>
<header>
    <?php 
       include '../../components/headers/header.php'; 
        ?>
</header>



<body>

    <!-- Main Content -->
    <main class="main-content">

        <h1 class="page-title">ORDER QUEUE MANAGMENT</h1>
        <!-- Filters & Search -->
        <section class="filters-section">
            <div class="filters-header">
                <h2>Filters & Search</h2>
                <button class="clear-btn" id="clearFilters">Clear All</button>
            </div>

            <div class="filters-grid">
                <div class="filter-group">
                    <label>Search Orders</label>
                    <input type="text" id="searchInput" placeholder="Order ID, customer name..." class="search-input">
                </div>

                <div class="filter-group">
                    <label>Status</label>
                    <select id="statusFilter" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="complete">Complete</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- Orders Grid -->
        <section class="orders-grid" id="ordersGrid">
            <!-- Orders will be dynamically inserted here -->
        </section>
    </main>

    <!-- Edit Order Modal -->
    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Order</h2>
                <button class="close-btn" id="closeModal">&times;</button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>Order ID</label>
                    <input type="text" id="modalOrderId" readonly>
                </div>

                <div class="form-group">
                    <label>Customer Name</label>
                    <input type="text" id="modalCustomerName" readonly>
                </div>

                <div class="form-group">
                    <label>Customer Email</label>
                    <input type="text" id="modalCustomerEmail" readonly>
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select id="modalStatus" class="modal-select">
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="complete">Complete</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Items</label>
                    <div id="modalItems" class="items-list"></div>
                </div>

                <div class="form-group">
                    <label>Total</label>
                    <input type="text" id="modalTotal" readonly>
                </div>

                <div class="form-group">
                    <label>ETA</label>
                    <input type="text" id="modalEta" readonly>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
                <button class="btn btn-primary" id="saveBtn">Save Changes</button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" id="deleteModal">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2>Confirm Delete</h2>
                <button class="close-btn" id="closeDeleteModal">&times;</button>
            </div>

            <div class="modal-body">
                <p>Are you sure you want to delete this order?</p>
                <p class="warning-text">This action cannot be undone.</p>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelDeleteBtn">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

    <script src="order_queue.js"></script>
</body>
<footer>
    <?php include '../../components/footers/footer.php';
    ?>
</footer>

</html>