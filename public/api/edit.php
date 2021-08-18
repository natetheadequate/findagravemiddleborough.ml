<?php
/*this is the page that admin is brought to when they click on a data point from the /edit page, as well as the final page of the submit flow.


It comes with GETS with the i and field of the data that was clicked on. 
Also, when the form with the changes is submitted, it goes to an action page that then redirects back here with gets successful=true|timeout|password|false with a possible timeout get of the amount of seconds until another attempt should be tried (only if successful is timeout or password(because a failed password attempt locks password attempts for an increasing amount of time)) as well as an i and field */
if (isset($_GET['id'])) {
	if (is_integer($_GET['id'] + 0)) {
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
		function addValue(value = "") {
			const root = document.getElementById('datafieldset');
			let el = root.insertAdjacentElement('beforeend', document.createElement('input'));
			el.type = "text";
			el.name = "values[]";
			el.setAttribute("minlength","1");
			el.value = value;
			el.setAttribute("list","options");
			let deletebutton = root.insertAdjacentElement('beforeend', document.createElement('button'));
			deletebutton.type = "button";
			deletebutton.innerHTML = "Remove";
			deletebutton.onclick = () => {deletebutton.remove();el.remove();}
			root.insertAdjacentHTML('beforeend', '<br />')

		}

		function displayData(rawdata) {
			let data;
			const root = document.getElementById('datafieldset');
			root.innerHTML = "";
			if (rawdata !== "{}") {
				try {
					data = JSON.parse(rawdata);
					const id = Object.keys(data)[0];
					const field = Object.keys(data[id])[0];
					data[id][field].forEach(v => {
						addValue(v);
					});
				} catch (e) {
					root.innerHTML = '<p>Error processing data</p><p>' + rawdata + '</p>';
					console.log(e)
					return;
				}
			} else {
				root.innerHTML = "[Blank]<br />";
			}
		}
		async function getData() {
			const condition={
					field: "id",
					query: <?php echo '"' . $_GET['id'] . '"' ?>
				}
			await fetch('/api/getData.php?select=<?php echo $_GET['field'] ?>&conditions='+JSON.stringify(condition))
				.then(res => res.text())
				.then(data => displayData(data));
		}
		function setSelectOptions(rawdata) {
			try {
				let selectOptions=[];
				data = JSON.parse(rawdata);
				Object.values(data).forEach(row => {
					Object.values(row).forEach(cell => {
						cell.forEach(option => {
							if (selectOptions.indexOf(option) === -1) {
								selectOptions.push(option);
							}
						})
					})

				})
				document.getElementById('options').innerHTML=selectOptions.map(v=>'<option>'+v+'</option>');
			} catch (e) {
				console.error(e);
			}
		}
		async function getExistingFieldValues() {
			await fetch('/api/getData.php?select=<?php echo $_GET['field'] ?>')
				.then(res => res.text())
				.then(data => setSelectOptions(data));
		}
	</script>
</head>

<body>
	<?php if (isset($_GET['error'])) {
		switch ($_GET['error']) {
			case "password":
				echo "Password was wrong. ";
				break;
			case "timeout":
				echo "Timeout error. ";
				break;
			default:
				echo "Error. Values in database are as shown below.";
				break;
		}
	} else if(isset($_GET['successful'])){
		echo "Data modified to values shown below";
	}
	if (isset($_GET['timeout'])) {
		echo "Try again in " . $_GET['timeout'] . " seconds";
	} ?>
	<form method="post" action="editformactionpage.php">
		<label>Password: <input name="password" type="password" required /></label>
		<textarea name="field" hidden><?php echo $_GET['field'] ?></textarea>
		<textarea name="id" hidden><?php echo $_GET['id'] ?></textarea>
		<fieldset id="datafieldset">Loading</fieldset>
		<button type="button" onclick="addValue()">Add Value</button>
		<button type="submit">Submit</button>
	</form>
	<datalist id="options"></datalist>
	<script>
		getData();
		getExistingFieldValues();
	</script>
</body>