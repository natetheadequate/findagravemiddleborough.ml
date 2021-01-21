<?php include 'DB.php';
function clean($str)
{
    return (str_replace('_', ' ', $str));
}
include 'columns.php';
$formquestions = []; //array of: arrays (echos select),string (echos text input),and integers (echos that element of $specialformquestions)
for ($i = 0; $i < count($columns); $i++) {
    $possibleoptions = [];
    $datafile=$DB->query("SELECT DISTINCT `notags" . $columns[$i] . "` FROM grave_data WHERE `notags".$columns[$i]."` IS NOT NULL AND NOT `notags".$columns[$i]."`=\"\"");
    for($j = 0;$j < 6; $j++) {
        $v=($datafile->fetch_array()[0]);
        if(null!==$v){
        $possibleoptions[$j] = $v;
        }else{break;}
    }
    if (count($possibleoptions) < 5) {
        array_push($formquestions, [$columns[$i], ...$possibleoptions]);
    } else {
        array_push($formquestions, $columns[$i]);
    }
}
$specialformquestions = [
    [array_search('Birthyear', $formquestions) + 1, '
        <label>Born After: <input type="date" name="bornafter"></label><br>
        <label>Born Before: <input type="date" name="bornbefore"></label>
    '],
    [array_search('Deathyear', $formquestions) + 1, '
        <label>Died After: <input type="date" name="diedafter"></label><br>
        <label>Died Before: <input type="date" name="diedbefore"></label>
    '],
    [array_search('Entry_Year', $formquestions) + 1, '
        <label>Entered After: <input type="date" name="enteredafter"></label><br>
        <label>Entered Before: <input type="date" name="enteredbefore"></label>
    '],
    [array_search('Exit_Year', $formquestions) + 1, '
        <label>Exited After: <input type="date" name="exitedafter"></label><br>
        <label>Exited Before: <input type="date" name="exitedbefore"></label>
    ']
];
for ($i = 0; $i < count($specialformquestions); $i++) {
    array_splice($formquestions, $specialformquestions[$i][0], 0, $i);
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>Search Middleborough Cemeteries</title>
    <script>
        function search() {
            const xhr = new XMLHttpRequest();
            xhr.onload = (e) => {
                document.getElementById('results').innerHTML = JSON.parse(xhr.responseText).map(v => ('<tr>' + v.map(v => ('<td>' + v + '</td>')).join('') + '</tr>')).join('');
            }
            xhr.open("POST", "query.php");
            xhr.send(new FormData(document.getElementById('queryform')));
        }
        function toggle(bool){
            if(bool){
                document.querySelectorAll('[name="select\[\]"]').forEach(node=>node.checked=true);
            }else{
                document.querySelectorAll('[name="select\[\]"]').forEach(node=>node.checked=false);
            }
        }
    </script>
</head>

<body>
    <h1>Search the database of Friends of Middleborough Cemeteries</h1>

    <form id='queryform' onsubmit="e=>e.preventDefault()">
        <fieldset style="column-width:300px">
            <legend style="column-span:all">Search and Filter</legend>
            <?php
            foreach ($formquestions as $formquestion) {
                if (is_array($formquestion)) {
                    echo '<label>' . clean($formquestion[0]) . '<select style="max-width:100px" name="' . $formquestion[0] . '"><option value=""></option>';
                    for ($i = 1; $i < count($formquestion); $i++) {
                        echo '<option value=' . strip_tags($formquestion[$i]) . '>' . clean($formquestion[$i]) . '</option>';
                    }
                    echo '</select></label>';
                } elseif (is_numeric($formquestion)) {
                    echo $specialformquestions[$formquestion][1];
                } else {
                    echo '<label>' . clean($formquestion) . ': <input type="text" name="' . strip_tags($formquestion) . '"></label>';
                }
                echo '<br>';
            }
            ?>
        </fieldset>
        <fieldset>
            <legend>Sort</legend>
            <select name="sortby">
                <?php
                foreach ($columns as $column) {
                    echo '<option value="' . strip_tags($column) . '">' . clean($column) . '</option>';
                }
                ?>
            </select>
            <label><input type="radio" name="sortorder" checked value="ASC">Ascending</label>
            <label><input type="radio" name="sortorder" value="DESC">Descending</label>
        </fieldset>
        <fieldset style="column-width:140px">
            <legend style="column-span:all">Data to Retrieve</legend>
            <label>Toggle All<input type="checkbox" checked id="toggler" onclick="toggle(document.getElementById('toggler').checked)"></label>
            <?php
            foreach ($columns as $column) {
                echo '<label>' . clean($column) . '<input type="checkbox" checked name="select[]" value="' . strip_tags($column) . '"/></label><br>';
            }
            ?>
        </fieldset>
        <button aria-type="submit" type="button" onclick="search()">Go!</button>
    </form>
    <hr />
    <table id="results">
    </table>
</body>

</html>