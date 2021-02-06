<?php
    include '../DB.php';
    $DB->query('ALTER TABLE `grave_data` DROP COLUMN Name,notagsName');
    $datafile=$DB->query('SELECT `Last_Name`,`Given_Name`,`Maiden_Name`,`Prefix`,`Suffix`,`i` from `grave_data`');
    $names=[];
    while($data=$datafile->fetch_array()){
        //the string replace doesn't work
        array_push($names,[$data['i'],str_replace('/\s+/',' ',$data['Prefix'].' '.$data['Given_Name'].' '.$data['Maiden_Name'].' '.$data['Last_Name'].' '.$data['Suffix'])]);
    }
    $DB->query('ALTER TABLE `grave_data` ADD Name varchar(255)');
    foreach($names as $name){
        $q=$DB->prepare('UPDATE `grave_data` SET `Name`=? WHERE i='.$name[0].';');
        $q->bind_param('s',$name[1]);
        $q->execute();
    }
    $datafile=$DB->query('SELECT `notagsLast_Name`,`notagsGiven_Name`,`notagsPrefix`,`notagsMaiden_Name`,`notagsSuffix`,`i` from `grave_data`');
    $names=[];
    while($data=$datafile->fetch_array()){
        array_push($names,[$data['i'],str_replace('/\s+/',' ',$data['notagsPrefix'].' '.$data['notagsGiven_Name'].' '.$data['notagsMaiden_Name'].' '.$data['notagsLast_Name'].' '.$data['notagsSuffix'])]);
    }
    $DB->query('ALTER TABLE `grave_data` ADD notagsName varchar(255)');
    foreach($names as $name){
        $q=$DB->prepare('UPDATE `grave_data` SET `notagsName`=? WHERE i='.$name[0].';');
        $q->bind_param('s',$name[1]);
        $q->execute();
    }
?>