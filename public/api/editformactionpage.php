<?php
/*this is dealt with first because in this case, I don't know where to even redirect the error message to. 
Nobody coming from edit.php should get this message, since the form ensures all these are sent*/
if (!isset($_POST['field'], $_POST['id'], $_POST['password'])) {
    echo "Error. Field, id, or password was not provided";
    exit(1);
}
if (!isset($_POST['values'])) {
    $_POST['values'] = [];
}
try {
    try {
        include '../timeout.php';
    } catch (Throwable $e) {
        throw new Exception("../timeout.php not on server");
    }
    if (!is_int($timeout)) {
        throw new Exception("timeout is not int, timeout is: " . $timeout);
    }
    if ($timeout > time()) { //check for timeout first, so that a person can't spam false passwords and know they are bad by a password error message
        throw new Exception($timeout - time(), 1);
    }
    file_put_contents('../timeout.php', '<?php $timeout=' . (time() + 3) . ';'); //before password check to ensure a wrong password attempt will set timeout too
    try {
        include '../password.php';
    } catch (Throwable $e) {
        throw new Exception("../password.php not on server");
    }
    if (!is_string($password)) {
        throw new Exception("password is not string, password is: " . $password);
    }
    if ($password !== $_POST['password']) {
        throw new Exception("password", 2);
    }
    try {
        include '../DB.php';
    } catch (Throwable $e) {
        throw new Exception("../DB.php doesn't exist on server.");
    }
    if (!isset($DB)) {
        throw new Exception("DB.php doesn't set \$DB");
    }
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
    if (!is_array($dataTables)) {
        throw new Exception("../data/info/dataTables.json doesn't return valid json");
    }
    $nonfatalerror = "";
    //the next three functions are wrappers for when im modifying the database. I use the prebuilt ones for select queries
    function sqllog($sql, $values = [])
    {
        global $nonfatalerror;
        $sqlarr = str_split($sql);
        //this for loop won't run if $values is empty
        for ($i = 0, $j = 0; $j < count($values), $i < count($sqlarr); $i++) {
            if ($sqlarr[$i] === "?") {
                $sqlarr[$i] = $values[$j];
                $j++;
            }
        }
        $sqlwithparameters = implode("", $sqlarr);
        if (file_put_contents('manualeditlog.txt', $sqlwithparameters, FILE_APPEND) === false) {
            $nonfatalerror .= "Error writing data to log while doing " . $sql;
        }
        if ($sql == "") {
            $nonfatalerror .= "A blank sql query was sent";
        }
        return $sqlwithparameters;
    }
    function query($sql, $errmsg)
    {
        global $DB;
        if ($DB->query($sql) === false) {
            throw new Exception("SQL:" . $sql . " Error message: " . $errmsg);
        }
        sqllog($sql);
    }
    function execute($mysqlistmt, $errmsg, $stmtsql, $values)
    {
        if ($mysqlistmt->execute() === false) {
            throw new Exception($errmsg . " SQL:" . $stmtsql . " -- Value:" . $values . " json_encoded: " . json_encode($values));
        } else {
            sqllog($stmtsql, $values);
        };
    }
    $found = false;
    foreach ($dataTables as $dataTable) { //lets find the information about the datatable we are inserting into
        /*one malformed dataTable isn't enough to justify throwing an error. If that datatable was one that I needed, $found still being false will throw an exception after the foreach. Thus, if the below if() is false, we just move on to the next dataTable
        */
        if (is_object($dataTable) && property_exists($dataTable, "name") && property_exists($dataTable, "type")) {
            if ($_POST['field'] === $dataTable->name || ("join_" . $_POST['field']) === $dataTable->name) {
                $found = true;
                if (!is_array($_POST['values'])) {
                    $_POST['values'] = [$_POST['values']];
                };
                $idwithonlynumerals;
                preg_match('/[0-9]+/', $_POST['id'], $idwithonlynumerals);
                if ($_POST['id'] !== $idwithonlynumerals[0]) { //$idwithonlynumerals[0] refers to the whole match
                    throw new Exception("id should be composed of only numerals 0-9.");
                }
                //no (accidental since we already through password check) injection risk, since we know dataTable['name'] is a valid field, and post id is just numerals.
                query('DELETE FROM `' . $dataTable->name . '` WHERE `id`=' . $_POST['id'] . ';', "Error deleting old records");
                switch ($dataTable->type) {
                    case "independent":
                        $stmtsql = 'INSERT INTO `' . $dataTable->name . '` VALUES(' . $_POST['id'] . ', ? );';
                        $stmt = $DB->prepare($stmtsql);
                        $mysqlitype = (($dataTable->mysqlitype) === "i" ? "i" : "s");
                        $stmt->bind_param($mysqlitype, $value); //this and the foreach loop is how php documentation says to do it, seems pretty hacky but *shrug*
                        foreach ($_POST['values'] as $value) {
                            execute($stmt, "Failed to input $value", $stmtsql, [$value]);
                        }
                        break;
                    case "join":
                        //DONT DELETE FROM THE DICTIONARY EVER--- there might be other tables using the dictionary. better safe than sorry.
                        $dictColumn = null;
                        if (!property_exists($dataTable, 'dictionary')) {
                            throw new Exception("\$dataTable doesn't have a dictionary property: " . json_encode($dataTable));
                        }
                        foreach ($dataTables as $possibleDictionary) {
                            if ($possibleDictionary->type === 'dictionary' && $possibleDictionary->name === $dataTable->dictionary) {
                                $dictColumn = $possibleDictionary->columnName;
                                break;
                            }
                        }
                        if (!is_string($dictColumn)) {
                            throw new Exception("couldn't find dictionary for $ dataTable: " . $dataTable . " as indicated by its dictionary column that had a string property columnName");
                        }
                        $stmt2sql = 'SELECT `i` FROM `' . $dataTable->dictionary . '` WHERE `' . $dictColumn . '`=?;';
                        $stmt2 = $DB->prepare($stmt2sql);
                        $stmt2->bind_param('s', $value);
                        $stmt3sql = 'INSERT INTO `' . $dataTable->dictionary . '` VALUES (?,?);';
                        $stmt3 = $DB->prepare($stmt3sql);
                        $stmt3->bind_param('is', $next, $value); //this binds the value of $value when and where execute is called, NOT its current value here
                        foreach ($_POST['values'] as $value) {
                            $stmt2->execute();
                            //since stmt2 doesnt modify the db, i dont use my wrapper functions to log changeslike i do for stmt3
                            $df = $stmt2->get_result();
                            if ($df === false) {
                                throw new Exception("Failure in getting i from dictionary");
                            }
                            $d = $df->fetch_all();
                            if (!isset($d[0][0])) {
                                $maxraw = $DB->query('SELECT MAX(`i`) FROM `' . $dataTable->dictionary . '`;');
                                if ($maxraw === false) {
                                    throw new Exception("can't get max i of \$dataTable->dictionary, \$dataTable is " . json_encode($dataTable));
                                }
                                $maxd = $maxraw->fetch_all();
                                if (!isset($maxd[0][0])) {
                                    throw new Exception("Couldn't get max value of dictionary");
                                }
                                $max = $maxd[0][0];
                                $next = $max + 1;
                                execute($stmt3, "Failed to input into dictionary $value", $stmt3sql, [$next, $value]);
                                query('INSERT INTO `' . $dataTable->name . '` VALUES(' . $_POST['id'] . ',' . $next . ');', "Error adding value to join table");
                            } else {
                                query('INSERT INTO `' . $dataTable->name . '` VALUES(' . $_POST['id'] . ',' . $d[0][0] . ');', "Error on insertion of existing i to join");
                            }
                        }
                        break;
                    default:
                        throw new Exception("type property not set for $ dataTable :" . $dataTable);
                }
            }
        }
    }
    if (!$found) {
        throw new Exception("field not found in \$dataTables");
    }
    if ($nonfatalerror !== "") {
        throw new Exception($nonfatalerror);
    }
    header('Location: edit.php?id=' . $_POST['id'] . "&field=" . $_POST['field']);
    exit();
} catch (Throwable $e) {
    header('Location: edit.php?id=' . $_POST['id'] . "&field=" . $_POST['field'] . "&error=" . ($e->getCode() === 1 ? "timeout&timeout=" . $e->getMessage() : $e->getMessage()));
    exit();
}
