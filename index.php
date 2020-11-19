<?php 
include "db_conn.php";
echo $DB->query("SELECT * FROM `grave_data`");