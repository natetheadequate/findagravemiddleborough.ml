<?php
/*this is the page that admin is brought to when they click on a data point from the /edit page.
It comes with GETS with the i and field of the data that was clicked on. 
Also, when the form with the changes is submitted, it goes to an action page that then redirects back here with gets successful=true|timeout|password|false with a possible timeout get of the amount of seconds until another attempt should be tried (only if successful is timeout or password(because a failed password attempt locks password attempts for an increasing amount of time)) as well as an i and field */
if (isset($_GET['id'])) {
	if (is_integer($_GET['id']+0)) {
		if (is_string($_GET['field'])) {
		} else {
			echo "field is not a string";
			exit(1);
		}
	} else {
		echo "id is not an integer";
		exit(1);
	}
}
?>

<head>
	<script>
		function addValue() {
			document.getElementById('form').append('<input type="text name="values" />');
		}

		function displayData(data) {
			const el = document.getElementById('form');
			data.forEach(v => el.append('<input type="text name="values" />').value = v);
			el.append('<button onclick="addValue()">Add Value</button>');
		}
		async function getData() {
			const body = {
				select: <?php echo '"' . $_GET['field'] . '"' ?>,
				conditions: {
					field: "id",
					query: <?php echo '"' . $_GET['i'] . '"' ?>
				}
			}
			await fetch('/api/getData.php', {
					method: 'POST',
					body: JSON.stringify(body)
				})
				.then(res => res.text())
				.then(data => displayData(data));
		}
		getData()
	</script>
</head>

<body>
	<?php if (isset($_GET['successful'])) {
		switch ($_GET['successful']) {
			case "true":
				echo "Data modified to values shown below. ";
				break;
			case "password":
				echo "Password was wrong. ";
				break;
			case "timeout":
				echo "Timeout error. ";
				break;
			case "false":
				echo "Error. Values in database are as shown below.";
				break;
		}
	} 
	if(isset($_GET['timeout'])){
		echo "Try again in ".$_GET['timeout']." seconds";
	}?>
	<form method="post" action="/editformactionpage.php">
		Clear an input to be blank to have it be deleted
		<label>Password: <input type="password" required/></label>
		<textarea name="field" hidden><?php echo $_GET['field'] ?></textarea>
		<textarea name="id" hidden><?php echo $_GET['id'] ?></textarea>
		<fieldset id="form"></fieldset>
		<button type="submit">Submit</button>
	</form>
</body>