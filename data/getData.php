<?php
// its probably better to generate the sql to make the database from a master json list of columns and just make a new database every time
include '../DB.php';
$df=$DB->query('SHOW TABLES');
    $tables=[];
    while($datum=$df->fetch()){
        array_push($tables,$datum[0]);
    }
    $dictionaries=[];
    foreach($tables as $table){
        switch($table){
            case "names":
            case "prefixes":
        case "suffixes":
        case "places":
        case "ranks":
        case "branches":
        case "wars":
        case "medallions":
        case "cemeteries":array_push($dictionaries,$table);break;
        case "id_join_last_name":
        case "id_join_maiden_name":
        case "id_join_first_name":
        case "id_join_middle_name","names"],
        ["id_join_prefix","prefixes"],
        ["id_join_suffix","suffixes"],
        ["id_join_birth_place","places"],
        ["id_join_death_place","places"],
        ["id_join_rank","ranks"],
        ["id_join_branch","branches"],
        ["id_join_war","wars"],
        ["id_join_medallion","medallions"],
        ["id_join_cemetery","cemeteries"]
        }

    }
    $fields=[]
    handlePossibleField($field){
        if(in_array($field,$tables)){
                    array_push($fields,$afield);
                }else{
                    switch($field){
                        case "all":$fields=$tables;
                    }
                    echo $afield." is not a valid field/table.";
                    exit 1;
                }
    }
foreach($_GET as $key=>$value){
    switch($key){
        case "get":switch(gettype($_GET[$key]){
            case 'array':foreach($_GET[$key] as $afield){
                handlePossibleField($afield);
            }break;
            case 'string':handlePossibleField($_GET[$key]);break;
        }
        break;
        default:
        echo $key." is not a valid parameter.";

    }
}
}
if(isset($_GET['headersonly']) && $_GET['headersonly']){
    echo $fields;
    exit 0;
}
foreach($fields as $field){
$data=$DB->query('select * from `'.$field.'`')->fetch_all();
    $assocdata=[];
    foreach($data as $datum){
        $assocdata[$datum[0]]=$datum[1];
    }
    array_push($returnarr,$field=>$assocdata);
}
/* if(isset)
if(isset($_GET['table']) && preg_match('/[a-z_]+/',$_GET['table'],$matches)){
    
} */


