<?php
header("Access-Control-Allow-Origin: *");
include 'DB.php';
$tables = []; //any valid table in the database
$tablesraw = ($DB->query("SHOW TABLES"));
while ($tableraw = ($tablesraw->fetch_array())) {
    array_push($tables, $tableraw[0]);
}
$dbname = $DB->query("select Database()")->fetch_array()[0];
$fields = []; //no dictionaries bc of the column name clause (dictionaries have i as their first column, not id)
$fieldsraw = $DB->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME='id' AND TABLE_SCHEMA='" . $dbname . "';");
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
    echo "Error: No Fields Selected";
    exit;
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
    if (!isset($condition['field'], $condition['query'], $condition['operator'])) {
        return false;
    }
    if (!in_array($condition['field'], $fields)) {
        return false;
    }
    if (!is_string($condition['query']) && !is_array($condition['query'])) {
        return false;
    }
    return true;
}
$ids = null;
if (isset($req['conditions'])) {
    if (is_iterable($req['conditions'])) {
        foreach ($req['conditions'] as $condition) {
            if (validCondition($condition, $fields) && $ids !== []) {
                $operator = '=';
                switch ($condition['operator']) {
                    case '%LIKE%':
                        $operator = ' LIKE ';
                        $condition['query'] = '%'.$condition['query'].'%';
                        break;
                    case '%LIKE':
                        $operator = ' LIKE ';
                        $condition['query'] = '%'.$condition['query'];
                        break;
                    case 'LIKE%':
                        $operator = ' LIKE ';
                        $condition['query'] = $condition['query'].'%';
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
            }
        }
    }
}
if ($ids === []) {
    echo "No matching records.";
    exit;
}
$results = [];
foreach ($req['select'] as $col) {
    $d;
    $q;
    if (preg_match('/join_/', $col) != false) {
        $dict = str_replace('fk_', '', (($DB->query('Describe `' . $col . '`'))->fetch_all())[1][0]); //the fk column is fk_[dictionary]);
        $dictColumnName = ($DB->query('DESCRIBE ' . $dict)->fetch_all())[1][0];
        $q = "SELECT * FROM " . $col . " JOIN " . $dict . " ON " . $col . ".fk_" . $dict . "=" . $dict . ".i";
        if (is_null($ids)) {
            $d = $DB->query($q . ';');
        } else {
            $d = $DB->query($q . " WHERE `id` IN (" . implode(',', $ids) . ");");
        }
        
        while ($datum = $d->fetch_array()) {
            $results[$datum['id']]['id']=$datum['id'];
            if (is_array($results[$datum['id']][$col])) {
                array_push($results[$datum['id']][$col], $datum[3]);
            } else {
                $results[$datum['id']][$col] =[$datum[3]];
            }
        }
    } else {
        $q = "SELECT * FROM " . $col;
        if (is_null($ids)) {
            $d = $DB->query($q . ';');
        } else {
            $d = $DB->query($q . " WHERE `id` IN (" . implode(',', $ids) . ");");
        }
        while ($datum = $d->fetch_array()) {
            $results[$datum['id']]['id']=$datum['id'];
            if (is_array($results[$datum['id']][$col])) {
                array_push($results[$datum['id']][$col], $datum[1]);
            } else {
                $results[$datum['id']][$col] = [$datum[1]];
            }
        }
    }
}
echo json_encode($results);