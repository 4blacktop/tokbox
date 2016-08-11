<?php
$current_page = (isset($current_page) && trim($current_page) ? $current_page : null);

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Dapinqing</title>
    <meta name="description" content="">

    <!-- Place favicon.ico in the root directory -->
    <link rel="icon" href="favicon.png">

    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Neuton:400,700,400italic' rel='stylesheet' type='text/css'>


    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-2.2.2.min.js" 
        integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=" 
        crossorigin="anonymous"></script>
    <script src="js/all.min.js"></script>

    <!-- Style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body <?php echo ($current_page ? 'id="' .$current_page. '"' : ''); ?>>
    <header class="main-header">
        <div id="flexslider" class="flexslider">
            <ul class="slides">
                <li><img src="img/hero/1.jpg" alt="."></li>
                <li><img src="img/hero/2.jpg" alt="."></li>
                <li><img src="img/hero/3.jpg" alt="."></li>
                <li><img src="img/hero/4.jpg" alt="."></li>
                <li><img src="img/hero/5.jpg" alt="."></li>
                <li><img src="img/hero/6.jpg" alt="."></li>
            </ul>
        </div>
        <div class="container">
            <div class="center-content">
                <div class="center-content-inner">
                    <div class="logo">
                        <a href="/">
                            <img src="img/logo.png" alt="Dapinqing">
                            <h2 class="h1">Dapinqing</h2>
                            <span class="h3"><?php echo _('Holding a higher standard'); ?></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <button id="nav-btn" class="nav-btn">
        <span class="nav-lines"></span>
    </button>
    
    <div class="nav-container container">
        <nav class="main-nav">
            <a class="<?php echo ($current_page == 'home' ? ' active ' : ''); ?>" href="/">Home</a>
            <a class="<?php echo ($current_page == 'companies' ? ' active ' : ''); ?>" href="companies.php">Companies</a>
            <a class="<?php echo ($current_page == 'jobs' ? ' active ' : ''); ?>" href="jobs.php">Jobs</a>
            <a class="<?php echo ($current_page == 'how-it-works' ? ' active ' : ''); ?>" href="how-it-works.php">How it Works</a>
            <a class="<?php echo ($current_page == 'contact-us' ? ' active ' : ''); ?>" href="contact.php">Contact</a>
            <a class="<?php echo ($current_page == 'login' ? ' active ' : ''); ?>" href="login.php">Log in</a>
        </nav>
    </div>

    <div class="main-content">