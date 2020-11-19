<?php
include 'password.php';
if((isset($_POST['password'])) && ($_POST['password']==$password)){include 'getpass.html';}
else{include 'authdadd.php';}
?>
