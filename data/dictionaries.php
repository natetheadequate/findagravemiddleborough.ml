<?php
include '../DB.php';
$DB=new mysqli();
if(isset($_GET['dictionary'])){
    $n=$_GET['dictionary'];
    $datafile=$DB->query('select * from `'.preg_match('/^[a-z]+$/',$_GET['dictionary']).'`');
    $data=[];
    while($d=$datafile->fetch_assoc()){
        array_push($data,$d);
    }
    echo json_encode($data);
}

