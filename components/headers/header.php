<nav class="navbar">
    <div class="container">
        <div class="logo">Whakapapa</div>

        <ul class="nav-links animated-tabs">
            <li><a href="index.php" class="<?= ($page === 'home') ? 'active' : '' ?>"><span>Home</span></a></li>
            <li><a href="rider.php" class="<?= ($page === 'rider') ? 'active' : '' ?>"><span>Rider</span></a></li>

            <li><a href="stocks.php" class="<?= ($page === 'stocks') ? 'active' : '' ?>"><span>Stocks</span></a></li>
            <li><button class="signin-btn"><span> Sign in</span></button></li>
            <li><i class="fa-solid fa-cart-shopping cart-icon" id="cart-btn"></i></li>
        </ul>

    </div>
</nav>