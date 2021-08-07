<?php
if (!isset($_POST['field'], $_POST['id'], $_POST['values'], $_POST['password'])) {
    echo "Error. Password, field or record was not provided";
    exit(1);
}
include '../password.php';
include '../timeout.php';
$timeouturlstring = "";
if (!is_int($timeout) || !is_string($password)) {
    $successful = "false";
} else {
    if (time() > $timeout) {
        fwrite('../timeout.php', '<?php $timeout=' . (time() + 15));
        if ($password === $_POST['password']) {
            include '../DB.php';
            if (isset($DB)) {
                $dataTables = json_decode(file_get_contents('../data/info/dataTables.json'));
                /*
                    dataTables is an array of json objects representing the metadata about a table in the database.
                    These tables fall into three "types": dictionary, independent, and join. 
                    Independent tables have "id" and *same name as table* columns. 
                    Independent table names are singular.
                    The join tables have id and i columns, where i is an index to a dictionary, specified in $dataTable['dictionary']. 
                    The dictionaries have i and *singular of table name* columns, specified in the json object as the value of the columnName key
                    Dictionaries names are plural.
                    Multiple join table may reference a singular dictionary, for example, the "names" dictionary services first_name, last_name, and middle_name. 
                    
                */
                if (isset($dataTables) && $dataTables !== false) {
                    foreach ($dataTables as $dataTable) {
                        if ($_POST['field'] === $dataTable['name'] || ("join_" . $_POST['field']) === $dataTable['name']) {
                            if (!is_array($_POST['values'])) {
                                $_POST['values'] = [$_POST['values']];
                            };
                            switch ($dataTable['type']) {
                                case "independent":
                                    $sql = 'DELETE FROM ' . $dataTable['name'] . ' WHERE `id`=' . $_POST['id'] . ';';
                                    foreach ($_POST['values'] as $value) {
                                        $sql += 'INSERT INTO ' . $dataTable['name'] . ' VALUES(' . $_POST['id'] . ',' . $value . ');';
                                    }
                                    if ($DB->query($sql) !== false) {
                                        file_put_contents('../manualeditlog.txt', $sql, FILE_APPEND);
                                        $successful = "true";
                                    } else {
                                        $successful = "false";
                                    };
                                    break 2;
                                case "join":
                                    $sql = 'DELETE FROM ' . $dataTable['name'] . ' WHERE `id`=' . $_POST['id'] . ';';
                                    //DONT DELETE FROM THE DICTIONARY EVER--- there might be other tables using the dictionary. better safe than sorry.
                                    $dictColumn = null;
                                    foreach ($dataTables as $possibleDictionary) {
                                        if ($possibleDictionary['type'] === 'dictionary' && $possibleDictionary['name'] === $dataTable['dictionary']) {
                                            $dictColumn = $possibleDictionary['columnName'];
                                        }
                                    }
                                    foreach ($_POST['values'] as $value) {
                                        $df = $DB->query('SELECT `i` FROM ' . $dataTable['dictionary'] . ' WHERE ' . $dictColumn . '=' . $value);
                                        if ($df !== false) {
                                            $i = null;
                                            $d = $df->fetch_array();
                                            if (!isset($d[0][1])) {
                                                try {
                                                    $max = $DB->query('SELECT MAX(`i`) FROM ' . $dataTable['dictionary'])->fetch_array()[0][1];
                                                    $sql += 'INSERT INTO ' . $dataTable['dictionary'] . ' VALUES (' . ($max + 1) . ',' . $value . ');';
                                                    $sql += 'INSERT INTO ' . $dataTable['name'] . ' VALUES(' . $_POST['id'] . ',' . ($max + 1) . ');';
                                                } catch (Exception $e) {
                                                    $successful = "false";
                                                }
                                            }
                                            if (isset($d[0][1])) {
                                                $sql += 'INSERT INTO ' . $dataTable['name'] . ' VALUES(' . $_POST['id'] . ',' . $d[0][1] . ');';
                                            }
                                        } else {
                                            $successful = "false";
                                            break 3;
                                        }
                                    } 
                                    break 2;
                                case "dictionary":
                                    //this shouldn't ever match; I made the names of dictionaries plural and all the fields singular but jic
                                    break;
                            }
                        }
                    }
                } else {
                    $successful = "false";
                }
            } else {
                $successful = "false";
            }
        } else {
            $successful = "password";
        }
    } else {
        $successful = "timeout";
        $timeouturlstring = "&timeout=" . ($timeout - time());
    }
}
header('Location: edit.php?i=' . $_POST['id'] . "&field=" . $_POST['field'] . "&successful=" . $successful . $timeouturlstring);
