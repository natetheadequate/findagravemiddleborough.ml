<?php
/* 
Pass via GET:
  select[]:  (optional) fields that you want to select (first_name,last_name, etc). Defaults to all.
  conditions[]: (optional) JSON stringified and encodeURIcomponent'ed objects to filter results. Defaults to none
    field: the field you are searching
    operator: (optional) defaults to "=". Can also be <,>,>=,<=,%LIKE%,LIKE%, and %LIKE
    query: the search value
  If you are including this from another php file, set the variable $returndontecho=true
  if the variable $returndontecho isn't set to true, returns stringified json object which contains keys corresponding to the internal id of the record and values which are objects with keys corresponding to fields (join_last_name,birth_day,...) and value of an array of all the entries for that internal id and field tuple
  If the variable $keepraw is set (meant for when this is included by another php file on the server), nothing is echoed, and I can use $results, an associative array
*/
header("Access-Control-Allow-Origin: *");
include '../DB.php';
$tables = []; //any valid table in the database
$tablesraw = ($DB->query("SHOW TABLES"));
while ($tableraw = ($tablesraw->fetch_array())) {
    array_push($tables, $tableraw[0]);
}
$dbname = $DB->query("select Database()")->fetch_array()[0];
$fields = [];
$fieldsraw = $DB->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME='id' AND TABLE_SCHEMA='" . $dbname . "';"); //column name clause excludes dictionaries, who have i as their first column, not id)
while ($fieldraw = ($fieldsraw->fetch_array())) {
    array_push($fields, $fieldraw[0]);
}
if (!isset($_GET['select'])) {
    $_GET['select'] = $fields;
} else
if (!is_array($_GET['select'])) {
    if (!is_string(($_GET['select']))) {
        echo "Error: Malformed Fields-To-Be-Retrieved: is not array nor string";
        exit;
    }
    $_GET['select'] = [$_GET['select']];
}
$_GET['select'] = array_intersect($_GET['select'], $fields);
if (!isset($_GET['select'][0])) {
    echo "Error: No valid fields provided to be retrieved";
    exit;
}
/* if (!isset($_GET['sortBy'])) {
    $_GET['sortBy'] = 'join_last_name';
} else {
    if (is_string($_GET['sortBy'])) {
        $_GET['sortBy'] = [$_GET['sortBy']];
    }
    if (is_array($_GET['sortBy'])) {
        $_GET['sortBy'] = array_intersect($fields, $_GET['sortBy']);
    } else {
        echo "Error: Invalid sortBy value";
        exit;
    }
    if (!isset($_GET['sortBy'][0])) {
        echo "Error: Invalid sortBy value";
        exit;
    }
    $_GET['sortBy'] = $_GET['sortBy'][0];
}
if (!isset($_GET['sortOrder'])) {
    $_GET['sortOrder'] = 'ASC';
} else {
    if ($_GET['sortOrder'] !== 'ASC' && $_GET['sortOrder'] !== 'DESC') {
        echo "Error: invalid sortOrder. Must be ASC or DESC";
        exit;
    }
} */
function validCondition($condition, $fields)
{
    //a field of id returns false, but thats okay, because ids are handled after the big condition loop
    if (!isset($condition['field'], $condition['query'], $condition['operator'])) {
        return false;
    }
    if (!in_array($condition['field'], $fields)) {
        return false;
    }
    if (!is_string($condition['query'])) {
        return false;
    }
    return true;
}
$ids = null;
$idfilters = [];
if (isset($_GET['conditions'])) {
    if (!is_array($_GET['conditions'])) {
        $_GET['conditions'] = [$_GET['conditions']];
    }
    $conditions = [];
    foreach ($_GET['conditions'] as $rawcondition) {
        array_push($conditions, json_decode($rawcondition, true));
    }
    foreach ($conditions as $condition) {
        if (validCondition($condition, $fields) && $ids !== []) {
            $operator = '=';
            switch ($condition['operator']) {
                case '%LIKE%':
                    $operator = ' LIKE ';
                    $condition['query'] = '%' . $condition['query'] . '%';
                    break;
                case '%LIKE':
                    $operator = ' LIKE ';
                    $condition['query'] = '%' . $condition['query'];
                    break;
                case 'LIKE%':
                    $operator = ' LIKE ';
                    $condition['query'] = $condition['query'] . '%';
                    break;
                case '>':
                case '<':
                case '>=':
                case '<=':
                    $operator = $condition['operator'];
            }
            $q;
            if (preg_match('/join_/', $condition['field']) != false) {
                $dict = str_replace('fk_', '', (($DB->query('Describe `' . $condition['field'] . '`'))->fetch_all())[1][0]); //the fk column is fk_[dictionary]);
                $dictColumnName = ($DB->query('DESCRIBE ' . $dict)->fetch_all())[1][0];
                $q = $DB->prepare("SELECT " . $condition['field'] . ".id FROM " . $condition['field'] . " JOIN " . $dict . " ON " . $condition['field'] . ".fk_" . $dict . "=" . $dict . ".i WHERE " . $dict . "." . $dictColumnName . $operator . "?" . ";");
            } else {
                $q = $DB->prepare("SELECT id FROM " . $condition['field'] . " WHERE " . $condition['field'] . $operator . "?" . ";");
            }
            $q->bind_param('s', $condition['query']);
            $q->execute();
            $newids = [];
            $d = $q->get_result();
            while ($datum = $d->fetch_array()) {
                array_push($newids, $datum['id']);
            }
            if (is_null($ids)) {
                $ids = $newids;
            } else {
                $ids = array_intersect($ids, $newids);
            }
        } else if ($condition['field'] == 'id') {
            if (isset($condition['query']) && is_int($condition['query'] + 0)) {
                array_push($idfilters, $condition);
            } else {
                echo "Error with id filter: <hr />" . json_encode($condition);
            }
        } else {
            echo "Error with condition:<hr />" . json_encode($condition);
            exit(1);
        }
    }
}
if ($ids === []) {
    echo "No matching records.";
    exit;
}
$wherestring = "";
if (!is_null($ids) || $idfilters !== []) {
    $wherestring .= " WHERE ";
    $wherearr = [];
    if (!is_null($ids)) {
        array_push($wherearr, "`id` IN (" . implode(',', $ids) . ")");
    }
    foreach ($idfilters as $idfilter) {
        switch ($idfilter['operator']) { //if not set, warns and does default ("=")
            case '>':
            case '<':
            case '>=':
            case '<=':
                $operator = $condition['operator'];
                break;
            default:
                $operator = "=";
        }
        array_push($wherearr, '`id`' . $operator . ($idfilter['query'] + 0));
    }
    $wherestring .= implode(" AND ", $wherearr);
};
$results = [];
foreach ($_GET['select'] as $col) {
    $joinadjuster = 0;
    if (preg_match('/join_/', $col)) {
        $dict = str_replace('fk_', '', (($DB->query('Describe `' . $col . '`'))->fetch_all())[1][0]); //the fk column is fk_[dictionary]);
        $dictColumnName = ($DB->query('DESCRIBE ' . $dict)->fetch_all())[1][0];
        $q = "SELECT * FROM " . $col . " JOIN " . $dict . " ON " . $col . ".fk_" . $dict . "=" . $dict . ".i";
        $joinadjuster = 2; //the result column we want is 3 instead of 1 with a join query
    } else {
        $q = "SELECT * FROM " . $col; //the table is named after the column for type:independent
    }
    $d = $DB->query($q . $wherestring . ';');
    while ($datum = $d->fetch_array()) {
        //im concatening a blank string to coerce the key into a string so an associative array is formed, and thus an object will be returned with keys being ids instead of an array of objects
        if (is_array($results["" . $datum['id']][$col])) { //subsequent times, there are already at least one value for this id and field/col
            array_push($results["" . $datum['id']][$col], $datum[1 + $joinadjuster]);
        } else { //first time adding a value for this id and field/col
            $results["" . $datum['id']][$col] = [$datum[1 + $joinadjuster]];
        }
    }
}
if (!isset($keepraw)){
    echo json_encode((object) $results);
}
