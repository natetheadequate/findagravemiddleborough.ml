<?php
$_GET = ['select' => $_GET['field']];
$returndontecho = true;
$results = include 'getData.php';
$uniqueValues = [];
foreach ($results as $key => $row) {
    foreach ($row as $field => $valuearr) {
        foreach ($valuearr as $value) {
            if (array_search($value,$uniqueValues) === false) {
                array_push($uniqueValues, $value);
            }
        }
    }
}
echo json_encode($uniqueValues);
