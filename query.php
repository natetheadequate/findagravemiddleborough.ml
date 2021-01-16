<?php
    include 'DB.php';
    $DB=new mysqli();
    if(count($_POST['select'])<1){
        echo "Nothing selected";
        exit;
    }
    $columnsfile=$DB->query('DESCRIBE grave_data');
    $columns=[];
    while($data=$columnsfile->fetch_array){
        array_push($columns,$data["Field"]);
    }
    foreach($_POST as key=>value){
        if(array_search(key,$columns)){

        }
    }
    if()
    $querystring='SELECT '.join(array_fill(0,count($_POST['select']),'?'),',').' FROM `grave_data` WHERE '.$wherestring.' ORDER BY '.; 
    $query=$DB->prepare($querystring);
    $query->bind_param(str_repeat('s',),implode($_POST['select'])
    $selectstring='';
    foreach($_POST['select'] as $select){
        $selectstring+='`'.$select.`
    }
?>