<?php 
include "db_conn.php";
echo $DB->query("SELECT * FROM `Grave_Data`");