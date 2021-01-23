<?php
    include '../DB.php';
    $datafile=$DB->query('SELECT `Last_Name`,`Given_Name`,`Prefix`,`Suffix`,`i` from `grave_data`');
    $names=[];
    while($data=$datafile->fetch_array()){
        array_push($names,[$data['i'],$data['Prefix'].' '.$data['Given_Name'].' '.$data['Last_Name'].' '.$data['Suffix']]);
    }
    $DB->query('ALTER TABLE `grave_data` ADD Name varchar(255)');
    foreach($names as $name){
        $q=$DB->prepare('UPDATE `grave_data` SET `Name`=? WHERE i='.$name[0].';');
        $q->bind_param('s',$name[1]);
        $q->execute();
    }
?>