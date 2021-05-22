<?php
include 'DB.php';
$tables = [];
$tablesraw = ($DB->query('SHOW TABLES'));
while ($tableraw = ($tablesraw->fetch_array())) {
    array_push($tables, $tableraw[0]);
}
$req = json_decode(file_get_contents('php://input'), true);
if (!$req) {
    echo "Malformed Request";
    exit;
}
if (!isset($req['select'])) {
    echo "No columns selected";
    exit;
}
if (!isset($req['sortBy'])) {
    $req['sortBy'] = 'join_last_name';
}
if (!isset($req['sortOrder'])) {
    $req['sortOrder'] = 'ASC';
}
function getWhere($table,$col,$operator,$query,$goodids=null,$iOrId){
        //null for goodids means check all ids. If we have already filtered some ids, then we only need to check
        //those ones. For getWhere run on dictionaries, then we can do select distinct but cant check ids. 
        $operator='=';
        $terminator='';
        switch($condition['operator']){
            case '%LIKE%':$operator=' LIKE %';$terminator='%';break;
            case '%LIKE':$operator=' LIKE %';break;
            case 'LIKE%':$operator=' LIKE ';$terminator='%';break;
            case '>':
            case '<':
            case '>=':
            case '<=':
                $operator=$condition['operator'];
        }
        var_dump($operator,$terminator,$dictcolumn);
        $q=$DB->prepare("SELECT `".$iOrId."` FROM ".$table." WHERE `".$col.'`'.$operator.'?'.$terminator.';');
        $q->bind_param('s',$query);
        $q->execute();
        $iVals=($q->get_result()->fetch_all())[0];//need error handling here
        var_dump($iVals);
        return $iVals;//false if no such string in dictionary
}
function iValsFromWhereClause($condition){
    $dict=str_replace('fk_',' ',(($DB->query('Describe `'.$condtion['field'].'`'))->fetch_all())[1][0]);//the fk column is fk_[dictionary]);
    $field=($DB->query('DESCRIBE '.$dict)->fetch_all())[1][0];
    $x=getWhere($dict,$field,$operator,$query);
    if($x===false){
        echo json_encode([]);
        exit;
    }
}
function idsFromColVals($table,$vals){
    if($vals===false){
        return false;
    }else{
        if($ids===null){
            $DB->query('SELECT `id` FROM '.$table.' WHERE '.)
        }
    }
}
$ids=null;
if (isset($req['conditions'])) {
    foreach ($req['conditions'] as $condition) {
        if(ids!==[] && ids!==false && is_string($condition['query']) && $condition['query']!=='' && array_search($condition['field'], $tables) !== false){
            if (preg_match('/join_/', $condition['field'])!==false) {
                
            }else{
            $dict=$field;
        }
        getWhere()
            if (preg_match('/join_/', $condition['field'])!==false) {
                $newids=idswithcolvals($condition['field'],iValsFromWhereClause($condition));
                if($newids==false){
                    echo json_encode([]);
                    exit;
                }
                if($ids===null){
                    $ids=$newids;//might set ids to false, thats ok
                }else{
                    array_push($ids,$newids);
                }
                }else{

            }  
