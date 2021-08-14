<?php
/*this is dealt with first because in this case, I don't know where to even redirect the error message to. 
Nobody coming from edit.php should get this message */
if (!isset($_POST['field'], $_POST['id'], $_POST['values'], $_POST['password'])) {
    echo "Error. Password, field or record was not provided";
    exit(1);
}
$problem = "none";
try {
    try {
        include '../password.php';
    } catch (Throwable $e) {
        throw new Exception("../password.php not on server");
    }
    try {
        include '../timeout.php';
    } catch (Throwable $e) {
        throw new Exception("../timeout.php not on server");
    }
    if (!is_int($timeout)) {
        throw new Exception("timeout is not int, timeout is: " . $timeout);
    }
    if (!is_string($password)) {
        throw new Exception("password is not string, password is: " . $password);
    }
    if (time() > $timeout) { //check for timeout first, so that a person can't spam false passwords and know they are bad by a password error message
        file_put_contents('../timeout.php', '<?php $timeout=' . (time() + 15) . ';');
        if ($password === $_POST['password']) {
            try {
                include '../DB.php';
            } catch (Throwable $e) {
                throw new Exception("../DB.php doesn't exist on server.");
            }
            if (isset($DB)) {
                try {
                    $dataTables = json_decode(file_get_contents('../data/info/dataTables.json'));
                } catch (Throwable $e) {
                    throw new Exception("../data/info/dataTables.json doesn't exist");
                }
                /*
                    dataTables is an array of json objects representing the metadata about a table in the database.
                    These tables fall into three "types": dictionary, independent, and join. 
                    Independent tables have "id" and *same name as table* columns. 
                    Independent table names are singular.
                    The join tables have id and i columns, where i is an index to a dictionary, specified in $dataTable->dictionary. 
                    The dictionaries have i and *singular of table name* columns, specified in the json object as the value of the columnName key
                    Dictionaries names are plural.
                    Multiple join table may reference a singular dictionary, for example, the "names" dictionary services first_name, last_name, and middle_name. 
                    
                */
                if (is_array($dataTables)) {
                    $found = false;
                    foreach ($dataTables as $dataTable) {
                        if (is_object($dataTable) && property_exists($dataTable, "name") && property_exists($dataTable, "type")) {
                            if ($_POST['field'] === $dataTable->name || ("join_" . $_POST['field']) === $dataTable->name) {
                                $found = true;
                                if (!is_array($_POST['values'])) {
                                    $_POST['values'] = [$_POST['values']];
                                };
                                switch ($dataTable->type) {
                                    case "independent":
                                        $sql = 'DELETE FROM ' . $dataTable->name . ' WHERE `id`=' . $_POST['id'] . ';';
                                        foreach ($_POST['values'] as $value) {
                                            $sql += 'INSERT INTO ' . $dataTable->name . ' VALUES(' . $_POST['id'] . ',' . $value . ');';
                                        }
                                        if ($DB->query($sql) !== false) {
                                            file_put_contents('../manualeditlog.txt', $sql, FILE_APPEND);
                                        } else {
                                            throw new Exception("Failed to INSERT INTO independent datatable");
                                        }
                                        break 2;
                                    case "join":
                                        $sql = 'DELETE FROM ' . $dataTable->name . ' WHERE `id`=' . $_POST['id'] . ';';
                                        //DONT DELETE FROM THE DICTIONARY EVER--- there might be other tables using the dictionary. better safe than sorry.
                                        $dictColumn = null;
                                        foreach ($dataTables as $possibleDictionary) {
                                            if ($possibleDictionary->type === 'dictionary' && $possibleDictionary->name === $dataTable->dictionary) {
                                                $dictColumn = $possibleDictionary->columnName;
                                                break;
                                            }
                                        }
                                        if (!is_string($dictColumn)) {
                                            throw new Exception("couldn't find dictionary for $ dataTable: " . $dataTable . " as indicated by its dictionary column that had a string property columnName");
                                        }
                                        foreach ($_POST['values'] as $value) {
                                            $df = $DB->query('SELECT `i` FROM ' . $dataTable->dictionary . ' WHERE ' . $dictColumn . '=' . $value);
                                            if ($df !== false) {
                                                $i = null;
                                                $d = $df->fetch_array();
                                                if (!isset($d[0][1])) {
                                                    $max = $DB->query('SELECT MAX(`i`) FROM ' . $dataTable->dictionary)->fetch_array()[0][1];
                                                    if ($max === false) {
                                                        throw new Error("Couldn't get max value of dictionary");
                                                    }
                                                    $sql += 'INSERT INTO ' . $dataTable->dictionary . ' VALUES (' . ($max + 1) . ',' . $value . ');';
                                                    $sql += 'INSERT INTO ' . $dataTable->name . ' VALUES(' . $_POST['id'] . ',' . ($max + 1) . ');';
                                                } else {
                                                    $sql += 'INSERT INTO ' . $dataTable->name . ' VALUES(' . $_POST['id'] . ',' . $d[0][1] . ');';
                                                }
                                                if ($DB->query($sql) === false) {
                                                    throw new Exception("final sql failed");
                                                }
                                                file_put_contents('../manualeditlog.txt', $sql, FILE_APPEND);
                                            } else {
                                                throw new Exception("Failure in getting i from dictionary");
                                            }
                                        }
                                        break 2;
                                    default:
                                        throw new Exception("type property not set for $ dataTable :" . $dataTable);
                                }
                            }
                        }
                    }
                    if (!$found) {
                        throw new Exception("field not found in $ datatables");
                    }
                } else {
                    throw new Exception("../data/info/dataTables.json doesn't return valid json");
                }
            } else {
                throw new Exception("DB.php doesn't set $ DB variable");
            }
        } else {
            throw new Exception("password", 2);
        }
    } else {
        throw new Exception($timeout - time(), 1);
    }
header('Location: edit.php?id=' . $_POST['id'] . "&field=" . $_POST['field']);
exit();
} catch (Throwable $e) {
    header('Location: edit.php?id=' . $_POST['id'] . "&field=" . $_POST['field'] . "&error=" . ($e->getCode() === 1 ? "timeout&timeout=" . $e->getMessage() : $e->getMessage()));
    exit();
}

