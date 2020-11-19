<?php 
include "db_conn.php";
$datafile=$DB->query("SELECT * FROM `grave_data`");
var_dump($datafile);