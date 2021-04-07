<?php 
include '../DB.php';
$datafile=$DB->query('Select Given_Name from `grave_data` where `Given_Name` Like "%oR%"');
while($data=$datafile->fetch_array()){
    echo $data[0];
}

