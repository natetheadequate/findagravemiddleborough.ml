<?php include 'DB.php';
function clean($str)
{
    return (str_replace('_', ' ', $str) . ': ');
}
$datafile=$DB->query('DESCRIBE grave_data');
$columns=[];
while($data=$datafile->fetch_array()){
    if($data['Field']!=='i'){
        array_push($columns,$data['Field']);
    }
}
$formquestions = []; //array of: arrays (echos select),string (echos text input),and integers (echos that element of $specialformquestions)
for ($i = 0; $i < count($columns); $i++) {
    $possibleoptions = [];
    for ($j = 0; $v = ($DB->query('SELECT DISTINCT ' . $columns[$i] . ' FROM grave_data'))->fetch_array(), $j < 11; $j++) {
        $possibleoptions[$j] = $v;
    }
    if ($j < 10) {
        array_push($formquestions, [$columns[$i], ...$possibleoptions]);
    } else {
        array_push($formquestions, $columns[$i]);
    }
}
$specialformquestions = [
    [array_search('Birthyear', $formquestions)+1, '
        <label>Born After: <input type="date" name="bornafter"></label>
        <label>Born Before: <input type="date" name="bornbefore"></label>
    '],
    [array_search('Deathyear', $formquestions)+1, '
        <label>Died After: <input type="date" name="diedafter"></label>
        <label>Died Before: <input type="date" name="diedbefore"></label>
    '],
    [array_search('Entry_Year', $formquestions)+1, '
        <label>Entered After: <input type="date" name="enteredafter"></label>
        <label>Entered Before: <input type="date" name="enteredbefore"></label>
    '],
    [array_search('Exit_Year', $formquestions)+1, '
        <label>Exited After: <input type="date" name="exitedafter"></label>
        <label>Exited Before: <input type="date" name="exitedbefore"></label>
    ']
];
for($i=0;$i<$specialformquestions;$i++){
    $formquestions=array_splice($formquestions,$specialformquestions[$i][0],0,$i);
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Search Middleborough Cemeteries</title>
    <script>
        function search() {
            const xhr = new XMLHttpRequest();
            xhr.onload(() => {
                let isdoublearray = (arr) => {
                    if (!arr.isArray()) {
                        return false;
                    }
                    arr.forEach(v => {
                        if (!v.isArray()) {
                            return false;
                        }
                    })

                }
                document.getElementById('results').innerHTML = isdoublearray(xhr.responseText) ? xhr.responseText.map(v => ('<tr>' + v.map(v => ('<td>' + v + '</td>')) + '</tr>')) : xhr.responseText;
            })
            xhr.open('post', './query.php');
            xhr.send(new FormData(document.getElementById('queryform')));
        }
    </script>
</head>

<body>
    <h1>Search the database of Friends of Middleborough Cemeteries</h1>

    <form id='queryform' onchange="search()">
        <fieldset>
            <legend>Search and Filter</legend>
            <?php
            foreach ($formquestions as $formquestion) {
                if (is_array($formquestion)) {
                    echo '<label>' . clean($formquestion[0]) . '<select name="' . $formquestion[0] . '"><option value="">Any/None</option>';
                    for ($i = 1; $i < count($formquestion); $i++) {
                        echo '<option value="' . $formquestion[$i] . '">' . clean($formquestion[$i]) . '</option>';
                    }
                } elseif (is_numeric($formquestion)) {
                    echo $specialformquestions[$formquestion];
                } else {
                    echo '<label>' . clean($formquestion) . '<input type="text" name="' . $formquestion . '"></label>';
                }
                echo '</select></label>';
            }
            ?>
        </fieldset>
        <fieldset>
            <legend>Sort</legend>
            <select name="sortby">
                <?php
                foreach ($columns as $column) {
                    echo '<option value="' . $column . '>' . $column . '</option>';
                }
                ?>
            </select>
            <label><input type="radio" name="sortorder" value="ASC">Ascending</label>
            <label><input type="radio" name="sortorder" value="DESC">Descending</label>
        </fieldset>
        <fieldset>
            <legend>Data to Retrieve</legend>
            <?php
            foreach ($columns as $column) {
                echo '<label><input type="checkbox" checked name="select[]" value="' . $column . '"/>' . $column . '</label>';
            }
            ?>
        </fieldset>
        <button type="submit" onclick="search()" />Go!<button>
    </form>
    <hr />
    <table id="results">
        <?php
        ?>
    </table>
</body>

</html>