<?php
include 'password.php';
if((isset($_POST['password'])) && ($_POST['password']==$password)){include 'authdadd.php';}
else{include 'getpass.html';}
?>
