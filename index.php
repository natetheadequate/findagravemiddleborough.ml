<?php include 'db.php'; ?>

<head>
    <title>Search Middleborough Cemeteries</title>
    <script>
        function search(){
            let xhr=new XMLHttpRequest();
            xhr.onload()
            xhr.open('post','./query.php');
            xhr.send(new FormData(document.getElementById('queryform')));
        }
    </script>
</head>

<body>
    <h1>Search the database of Friends of Middleborough Cemeteries</h1>
    <?php
    if (!isset($db)) {
        $db = new mysqli('sdf', 'adsf', 'sdaf', 'asdf');
    }
    $columns = $db->query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS')->fetch_all();
    $cemeteries=array_merge(...($db->query('SELECT DISTINCT cemetery FROM grave_data')->fetch_all()));
    function isspecialcolumn($v){
        if(array_search($v,['cemetery,deathmonth']))
    }
    $normalcolumns=array_filter()
    ?>
    <form id='queryform'>
        <fieldset>
            <legend>Data to Retrieve</legend>
            <?php
                foreach($columns as $column){
                    if($column!='index'){echo '<label><input type="checkbox" checked name="select[]" value="'.$column.'"/>'.$column.'</label>';} 
                }
            ?>
        </fieldset>
        <fieldset>
            <legend>Cemeteries</legend>
            <?php
                foreach($cemeteries as $cemetery){
                    echo '<label><input type="checkbox" checked name="cemeteries[]" value="'.$cemetery.'"/>'.$cemetery.'</label>';
                }
            ?>
        </fieldset>

        <button type="submit" onclick="search()"/>Go!<button>
    </form>
    <hr />
    <table id="results">
        <?php
        ?>
    </table>
</body>