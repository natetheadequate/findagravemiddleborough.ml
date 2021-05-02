<?php
include '../DB.php';
if(isset($_GET['dictionary']) && preg_match('/[a-z_]+/',$_GET['dictionary'],$matches)){
    $data=$DB->query('select * from `'.$matches[0].'`')->fetch_all();
    $assocdata=[];
    foreach($data as $datum){
        $assocdata[$datum[0]]=$datum[1];
    }
    echo json_encode($assocdata);
}

