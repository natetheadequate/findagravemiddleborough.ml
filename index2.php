<?php 
include "DB.php";
$datafile=$DB->query("SELECT first_name FROM grave_data");
var_dump($datafile);
