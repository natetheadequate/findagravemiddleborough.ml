import { FormControl, Button, InputLabel, TextField, FormGroup, Typography, ButtonGroup, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab } from "@material-ui/core";
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

function App({ fields, edit = false }) {
	const fieldNames = fields.map(v => v.name);
	const [fieldsToBeRetrieved, setFieldsToBeRetrieved] = useState(fieldNames);
	const [sortBy, setSortBy] = useState('join_last_name');
	const [sortOrder, setSortOrder] = useState('ASC');
	const [conditions, dispatchConditions] = useReducer((state, action) => {
		switch (action.type) {
			case 'delete':
				document.activeElement.blur(); 
				/* that line causes a ForwardRef error, but its necessary to keep the next autocomplete from getting focus.
				If I didn't have it, the next autocomplete would be cleared and focused when you delete the one before it.
				I don't give the autocompletes any permanance, they rerender every time one is deleted and have no id or key.
				*/
				return state.filter((v,i)=>i!==action.payload.i);
			case 'edit':
				let x=[...state];
				x.splice(action.payload.i,1,{ ...state[action.payload.i], [action.payload.key]: action.payload.newValue });
				return x;
			case 'add':
				return [ ...state, { field: 'join_last_name', operator: '=', query: '' } ]
			default://okay FINE! if it makes you happy eslint 
		}
	}, [])
	const spacing = "5px";
	const [response, setResponse] = useState(null);
	const [resultFormat, setResultFormat] = useState("table");
	let responseobj = {};
	let responsestr = '';
	if (response !== null) {
		try {
			responseobj = JSON.parse(response);
		} catch (e) {
			if (!(e instanceof SyntaxError)) {
				responsestr = "There was an error parsing the data.";//this should never happen
			} else {
				responsestr = response;//these are the error messsages, like no results found and invalid query
			}
		}
	}
	async function submitForm() {
		const body = {
			select: fieldsToBeRetrieved,
			sortBy,
			sortOrder,
			conditions
		}
		await fetch('/api/getData.php', { method: 'POST', body: JSON.stringify(body) })
			.then(res => res.text())
			.then(data => setResponse(data));
	}
	return (
		<>
			<Typography variant="h2" align="center" component="h1">{edit ? 'Edit' : 'Search'} the Database of Friends of Middleborough Cemeteries</Typography>
			{!edit && <Button style={{ position: 'absolute', top: 0, right: 0, color: "blue" }} href="/edit">Admin</Button>}
			{edit && <Button style={{ position: 'absolute', top: 0, right: 0, color: "blue" }} href="/">View-Only</Button>}
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
						{conditions.map((v,i) => {
							return (
								<FormGroup row={true} style={{ margin: "10px 0px" }}>
									<FormControl>
										<Autocomplete
											style={{ width: '300px' }}
											options={fieldNames}
											getOptionLabel={clean}
											value={conditions[i]['field']}
											onChange={(e, v, eventType) => {
												switch (eventType) {
													case "clear": dispatchConditions({ type: 'delete', payload: { i } }); break;
													default: dispatchConditions({ type: 'edit', payload: { i, key: 'field', newValue: v } })
												}
											}
											}
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
			<Tabs value={resultFormat} onChange={(e, n) => setResultFormat(n)}>
				<Tab label="Table" value="table" />
				<Tab label="JSON" value="json" />
			</Tabs>
			{responsestr || ((resultFormat === "table") && (<>
				{edit && <p>Click on the data to edit it.</p>}
				<Table>
					<TableHead><TableRow>{fieldsToBeRetrieved.map(v => <TableCell>{clean(v)}</TableCell>)}</TableRow></TableHead>
					<TableBody>
						{Object.values(responseobj).map(record => (
							<TableRow>
								{fieldsToBeRetrieved.map(field => {
									if (field in record) {
										return (<TableCell>
											{edit && <a href={'/api/edit.php?id=' + record['id'] + '&field=' + field}>{record[field].join('; ')}</a>}
											{!edit && record[field].join('; ')}
										</TableCell>);
									} else {
										return <TableCell></TableCell>
									}
								})}</TableRow>
						))}
					</TableBody>
				</Table>
			</>)) || ((resultFormat === "json") &&
				JSON.stringify(responseobj)
				)
			}
			<footer style={{ position: 'absolute', bottom: '30px', display: "flex", alignItems: 'center', width: "100%" }}>
				<ButtonGroup style={{ maxWidth: 'max-content', margin: "auto" }} >
					<Button href='http://www.friendsofmiddleboroughcemeteries.org/contact-us.html'>Contact Friends of Middleborough Cemeteries</Button>
					<Button href='http://www.friendsofmiddleboroughcemeteries.org'>Friends of Middleborough Cemeteries</Button>
					<Button href='mailto:natetheadequate+fomc@outlook.com'>Contact Developer/Report Bug</Button>
				</ButtonGroup>
			</footer>
		</>
	);
}

export default App;
