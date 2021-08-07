<?php
/* 
Pass via POST:
  select:  (optional) an array of fields that you want to select (first_name,last_name, etc). Defaults to all.
  conditions: (optional) an object to filter results
    field: the field you are searching
    operator: (optional) defaults to "=". Can also be <,>,>=,<=,%LIKE%,LIKE%, and %LIKE
    query: the search value
  
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
try {
    $req = json_decode(file_get_contents('php://input'), true);
} catch (Exception $e) {
    echo "Error: Malformed Request - Request should be sent via POST";
    exit;
}
if (!isset($req['select'])) {
    $req['select'] = $fields;
}
if (!is_array($req['select'])) {
    if (!is_string(($req['select']))) {
        echo "Error: Malformed Fields-To-Be-Retrieved: is not array nor string";
        exit;
    }
    $req['select'] = [$req['select']];
}
$req['select'] = array_intersect($req['select'], $fields);
if (!isset($req['select'][0])) {
    echo "Error: No valid fields provided to be retrieved";
    exit;
}
/* if (!isset($req['sortBy'])) {
    $req['sortBy'] = 'join_last_name';
} else {
    if (is_string($req['sortBy'])) {
        $req['sortBy'] = [$req['sortBy']];
    }
    if (is_array($req['sortBy'])) {
        $req['sortBy'] = array_intersect($fields, $req['sortBy']);
    } else {
        echo "Error: Invalid sortBy value";
        exit;
    }
    if (!isset($req['sortBy'][0])) {
        echo "Error: Invalid sortBy value";
        exit;
    }
    $req['sortBy'] = $req['sortBy'][0];
}
if (!isset($req['sortOrder'])) {
    $req['sortOrder'] = 'ASC';
} else {
    if ($req['sortOrder'] !== 'ASC' && $req['sortOrder'] !== 'DESC') {
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
if (isset($req['conditions'])) {
    if (is_array($req['conditions'])) {
        foreach ($req['conditions'] as $condition) {
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
    } else {
        echo "Error: conditions must be an array";
        exit(1);
    }
}
if ($ids === []) {
    echo "No matching records.";
    exit;
}
$wherestring = "";
if (!is_null($ids) || $idfilters !== []) {
    $wherestring += " WHERE ";
    $wherearr = [];
    if (!is_null($ids)) {
        array_push($wherearr, "`id` IN (" . implode(',', $ids));
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
    $wherestring += implode(" AND ", $wherearr);
};
$results = [];
foreach ($req['select'] as $col) {
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
echo json_encode((object) $results);
