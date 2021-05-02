<?php
include '../DB.php';
if(isset($_GET['dictionary']) && preg_match('/[a-z_]+/',$_GET['dictionary'],$matches)){
    $datafile=$DB->query('select * from `'.$matches[0].'`');
    $data=[];
    while($d=$datafile->fetch_assoc()){
        array_push($data,$d);
    }
    echo json_encode($data);
}

