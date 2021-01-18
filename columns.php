<?php
$columnsfile=$DB->query('DESCRIBE `grave_data`');
$columns=[];
while($data=$columnsfile->fetch_array()){
    if(str_replace('notags','',$data['Field'])==$data["Field"]){
        if($data["Field"]!='i'){
            array_push($columns,$data["Field"]);
        }
    }
}
