<?php
    include 'DB.php';
    if(count($_POST['select'])<1){
        echo json_encode(["Nothing selected"]);
        exit;
    }
    include 'columns.php';// this imports Last_Name but not notagsLast_Name. The notags is used in where, the raw is used for select
    $selectvaluearr=[];
    foreach($_POST['select'] as $prospectiveselect){
        if(array_search($prospectiveselect,$columns)!==false){
            array_push($selectvaluearr,$prospectiveselect);
        }
    }
    $selectstring=join(',',array_fill(0,count($selectvaluearr),'?'));
    $wherearr=[];
    $wherevaluearr=[];
    $sortby='i';
    $sortorder="ASC";
    foreach($_POST as $key=>$value){
        if(array_search($key,$columns) && strlen($value)>0){
            $v='`notags'.$key.'` LIKE ?';
            array_push($wherearr,$v);
            array_push($wherevaluearr,'%'.$value.'%');
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
    $querystring='SELECT '.$selectstring.' FROM `grave_data` WHERE '.$wherestring.' ORDER BY ?'; 
    $query=$DB->prepare($querystring);
    $params=array_merge($selectvaluearr,$wherevaluearr,[$sortby." ".$sortorder]);
    $query->bind_param(str_repeat('s',count($selectvaluearr)+count($wherevaluearr)+1),...$params);
    $query->execute();
    echo json_encode(($query->get_result())->fetch_all());
