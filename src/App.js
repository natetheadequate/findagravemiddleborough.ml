import { FormControl, Button, InputLabel, DataGrid, MenuItem, Select, TextField, FormGroup, Typography, ButtonGroup } from "@material-ui/core";
import { FormatColorReset } from "@material-ui/icons";
import TrendingDown from "@material-ui/icons/TrendingDown";
import TrendingUp from "@material-ui/icons/TrendingUp";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useReducer, useState } from "react";
import OperatorSelect from "./OperatorSelect";

const titleCase = (str) => {
	//Cases Strings Like This
	let capitalizenextletter = true;
	let strarr = str.split("");
	let newstr = "";
	strarr.forEach((c, i) => {
		if (capitalizenextletter) {
			newstr += c.toUpperCase();
		} else {
			newstr += c.toLowerCase();
		}
		if (c === " " || c === "/") {
			capitalizenextletter = true;
		} else {
			capitalizenextletter = false;
		}
	});
	return newstr;
};
const clean = (str) => {
	return titleCase((' ' + str).replace('join_', '').replaceAll('_', ' '))
}

function App({ fields }) {
	const fieldNames = fields.map(v => v.name);
	const [fieldsToBeRetrieved, setFieldsToBeRetrieved] = useState(fieldNames);
	const [sortBy, setSortBy] = useState('join_last_name');
	const [sortOrder, setSortOrder] = useState('ASC');
	const [conditions, dispatchConditions] = useReducer((state, action) => {
		switch (action.type) {
			case 'edit':
				return { ...state, [action.payload.i]: { ...state[action.payload.i], [action.payload.key]: action.payload.newValue } }
			case 'add':
				return { ...state, [+Object.keys(state).sort((a, b) => b - a)[0] + 1]: { field: 'join_last_name', operator: '=', query: '' } }
			default:
		}
	}, { 0: { field: 'join_last_name', operator: '=', query: '' } })
	const spacing = "5px";
	const [response, setResponse] = useState(null);
	let noresponse = true;
	let nodata = false;
	let rows;
	let columns;
	if (response !== null) {
		noresponse=false;
		if (response === []) {
			nodata = true;
		} else {
			rows = response;
			let rawcols = [];
			response.forEach(obj => {
				Object.keys(obj).forEach(key => {
					if (!rawcols.includes(key)) {
						rawcols.push(key);
					}
				})
			});
			columns = [];
			rawcols.forEach(rawcol => {
				columns.push({ field: rawcol, headerName: clean(rawcol) });
			})
		}
	}
	async function submitForm() {
		const body = {
			select: fieldsToBeRetrieved,
			sortBy,
			sortOrder,
			conditions
		}
		let x = await fetch('/api/getData.php', { method: 'POST', body: JSON.stringify(body) });
		setResponse(x.json());
	}
	return (
		<>
			<Typography variant="h2" align="center" component="h1">Search the Database of Friends of Middleborough Cemeteries</Typography>
			<form onSubmit={(e) => e.preventDefault()} style={{ margin: '10px' }}>
				<FormControl>
					<Autocomplete
						multiple
						id="fields-to-be-retrieved"
						options={fieldNames}
						getOptionLabel={clean}
						filterSelectedOptions
						value={fieldsToBeRetrieved}
						onChange={(e, v) => setFieldsToBeRetrieved(v)}
						renderInput={(v) =>
							<TextField
								{...v}
								variant="outlined"
								label="Fields to Be Retrieved"
							/>
						}
					/>
				</FormControl>
				<br />
				<br />
				<fieldset style={{ marginTop: spacing }}>
					<legend>Filter</legend>
					<div>
						{Object.entries(conditions).map(([i]) => {
							return (
								<FormGroup row={true} style={{ margin: "10px 0px" }}>
									<InputLabel style={{ margin: 'auto 5px' }}>Condition {+i + 1}:</InputLabel>
									<FormControl>
										<Autocomplete
											style={{ width: '300px' }}
											id={'condition' + i + 'field'}
											onKeyDown={'condition' + i + 'field'}
											options={fieldNames}
											getOptionLabel={clean}
											value={conditions[i]['field']}
											onChange={(e, v) => dispatchConditions({ type: 'edit', payload: { i, key: 'field', newValue: v } })}
											renderInput={(v) =>
												<TextField
													{...v}
													variant="outlined"
													label="Field"
												/>
											}
										/>
									</FormControl>
									<FormControl>
										<OperatorSelect
											i={i}
											value={conditions[i].operator}
											fieldObject={Object.values(fields).find((v) => v.name === conditions[i]['field'])}
											setOperator={(newValue) =>
												dispatchConditions({ type: 'edit', payload: { i, key: 'operator', newValue } })
											} />
									</FormControl>
									<FormControl>
										<TextField style={{ margin: 'auto 5px' }} placeholder="Enter search term here..." id="query" onChange={e => dispatchConditions({ type: 'edit', payload: { i, key: 'query', newValue: e.target.value } })} value={conditions[i].query} />
									</FormControl>
								</FormGroup>
							)
						})
						}
					</div>
					<div>
						{
							<Button variant="outlined" onClick={() => dispatchConditions({ type: 'add' })}>Add Condition</Button>
						}
					</div>
				</fieldset>
				<Button type="submit" variant="contained" style={{ margin: "10px 0" }} onClick={() => { submitForm() }}>Go!</Button>
			</form>
			{(noresponse && <br />) || (nodata && "No matching records found") || (<DataGrid rows={rows} columns={columns} />)}
			<footer style={{ position: 'absolute', bottom: '30px', display: "flex", float: 'bottom', alignItems: 'center', width: "100%" }}>
				<ButtonGroup style={{ maxWidth: 'max-content', margin: "auto" }} >
					<Button href='http://www.friendsofmiddleboroughcemeteries.org/contact-us.html'>Contact Friends of Middleborough Cemeteries</Button>
					<Button href='http://www.friendsofmiddleboroughcemeteries.org'>Friends of Middleborough Cemeteries</Button>
					<Button href='mailto:natewhite345+fomc@gmail.com'>Contact Developer/Report Bug</Button>
				</ButtonGroup>
			</footer>
		</>
	);
}

export default App;
