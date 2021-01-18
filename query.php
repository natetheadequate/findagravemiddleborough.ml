<?php
    include 'DB.php';
    if(count($_POST['select'])<1){
        echo json_encode(["Nothing selected"]);
        exit;
    }
    $columnsfile=$DB->query('DESCRIBE `grave_data`');
    $columns=[];
    while($data=$columnsfile->fetch_array()){
        array_push($columns,$data["Field"]);
    }
    $selectvaluearr=[];
    foreach($_POST['select'] as $prospectiveselect){
        if(array_search($prospectiveselect,$columns)){
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
            $v='`'.$key.'` LIKE ?';
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
?>