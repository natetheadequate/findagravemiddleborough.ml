<?php
    include 'DB.php';
    $tables=[];
    $tablesraw=($DB->query('SHOW TABLES'));
    while($tableraw=$tablesraw->fetch()){
        array_push($tables,$tableraw[0]);
    }
    $req=json_decode(file_get_contents('php://input'),true);
    if(!$req){
        echo "Malformed Request";
        exit;
    }
    if(!isset($req['select'])){
        echo "No columns selected";
        exit;
    }
    if(!isset($req['sortBy'])){
        $req['sortBy']='join_last_name';
    }
    if(!isset($req['sortOrder'])){
        $req['sortOrder']='ASC';
    }
    if(isset($req['conditions'])){
        foreach($req['conditions'] as $condition){
            var_dump($tables);
            if(array_search($condition['field'],$tables)!==false){
            if(preg_match('/join_/',$condition['field'])){
                    $dict=($DB->query('Describe'+$condition['field'])->fetch_all());
                    echo $dict;
                }else{
                    echo 'Invalid ';
                }
                
            }else{
                echo 'Invalid field selected';
                exit;
            }
        }
    }