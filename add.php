<?php
include 'password.php'
if ($POST['password']!=$password){include 'getpass.php'}
else{include 'authdadd.php'}
