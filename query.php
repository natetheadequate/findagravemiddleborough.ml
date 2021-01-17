<?php
    include 'DB.php';
    $DB=new mysqli();
    if(count($_POST['select'])<1){
        echo json_encode(["Nothing selected"]);
        exit;
    }
    $columnsfile=$DB->query('DESCRIBE grave_data');
    $columns=[];
    while($data=$columnsfile->fetch_array){
        array_push($columns,$data["Field"]);
    }
    $selectvaluearr=[];
    foreach($_POST['select'] as $prospectiveselect){
        if(array_search($prospectiveselect,$columns)){
            array_push($prospectiveselect,$selectvaluearr);
        }
    }
    $selectstring=join(array_fill(0,count($selectarr),'?'),',');
    $wherearr=[];
    $wherevaluearr=[];
    $sortby='i';
    $sortorder="ASC";
    foreach($_POST as $key=>$value){
        if(array_search($key,$columns)){
            $v='`'.$key.'` LIKE "%?%"';
            array_push($v,$wherearr);
            array_push($value,$wherevaluearr);
        }elseif($key=='sortby' && array_search($value,$columns)){
            $sortby=$value;
        }elseif($key='sortorder'){
            if($value=="ASC"){
                $sortorder="ASC";
            }elseif($value=="DESC"){
                $sortorder="DESC";
            }
        }
    }
    $wherestring=implode(' AND ',$wherearr);
    $querystring='SELECT '.$selectstring.' FROM `grave_data` WHERE '.$wherestring.' ORDER BY `'.$sortby.'` '.$sortorder; 
    $query=$DB->prepare($querystring);
    $query->bind_param(str_repeat('s',count($selectvaluearr)+count($wherevaluearr)+2),implode(',',array_merge($selectvaluearr,$wherevaluearr,[$sortby],[$sortorder])));
    $query->execute();
    echo json_encode(($query->get_result())->fetch_all());
?>