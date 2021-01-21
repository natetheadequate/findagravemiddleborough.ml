<?php
    include 'DB.php';
    if(!isset($_POST['select']) || count($_POST['select'])<1){
        echo json_encode([["Nothing selected"]]);
        exit;
    }
    include 'columns.php';// this imports Last_Name but not notagsLast_Name. The notags is used in where, the raw is used for select
    $selectvaluearr=[];
    foreach($_POST['select'] as $prospectiveselect){
        if(array_search($prospectiveselect,$columns)!==false){
            array_push($selectvaluearr,'`'.$prospectiveselect.'`');
        }
    }
    $selectstring=join(',',$selectvaluearr);
    $wherearr=[];
    $wherevaluearr=[];
    $sortby='i';
    $sortorder="ASC";
    foreach($_POST as $key=>$value){
        if(false!==array_search($key,$columns) && strlen($value)>0){
            $v='`notags'.$key.'` LIKE ?';
            array_push($wherearr,$v);
            array_push($wherevaluearr,'%'.$value.'%');
        }elseif($key=='sortby' && false!==array_search($value,$columns)){
            $sortby='`'.$value.'`';
        }elseif($key=='sortorder'){
            if($value=="ASC"){
                $sortorder="ASC";
            }elseif($value=="DESC"){
                $sortorder="DESC";
            }
        }
    }
    $wherestring=(count($wherearr)>0)?(" WHERE ".implode(' AND ',$wherearr)):'';
    $querystring='SELECT '.$selectstring.' FROM `grave_data`'.$wherestring.' ORDER BY '.$sortby.' '.$sortorder; 
    $query=$DB->prepare($querystring);
    if(count($wherevaluearr)>0){$query->bind_param(str_repeat('s',count($wherevaluearr)),...$wherevaluearr);}
    $query->execute();
    $resultsarray=array_fill(0,count($selectvaluearr),"Pending");
    for($i=0;$i<count($resultsarray);$i++){
        $realresultsarray[$i]=&$resultsarray[$i];
    }
    call_user_func_array([$query,'bind_result'],$realresultsarray);
    $results=[];
    for($i=0;$query->fetch();$i++){//each time fetch is called, $resultsarray populates with a row
        for($j=0;$j<count($resultsarray);$j++){
            $results[$i][$j]=$resultsarray[$j];//this makes it a copy not ref
        }
    }
   if(count($results)>0){echo json_encode($results);}
   else{echo json_encode([['Nothing found']]);}
