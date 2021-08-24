import { FormControl, MenuItem, Select, Button, TextField, FormGroup, Typography, ButtonGroup, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useReducer, useState } from "react";

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
	const [distinctValues, setDistinctValues] = useState({});
	const selectDistinct = field => {
		fetch('/api/selectDistinct.php?field=' + field)
			.then(res => res.json())
			.then(json => {
				if (Array.isArray(json)) {
					return json;
				} else {
					throw new Error("selectDistinct.php didn't return an array");
				}
			})
			.then(json => setDistinctValues({ ...distinctValues, [field]: json }))
			.catch(e => setDistinctValues({ ...distinctValues, [field]: ["Error"] }))
	}
	/* const [sortBy, setSortBy] = useState('join_last_name');
	const [sortOrder, setSortOrder] = useState('ASC'); */
	//conditions is an array of objects with keys field (eg join_last_name), operator (eg =), and query (eg Allen)
	const [conditions, dispatchConditions] = useReducer((state, action) => {
		switch (action.type) {
			case 'delete':
				document.activeElement.blur();
				/* that line causes a ForwardRef error, but its necessary to keep the next autocomplete from getting focus.
				If I didn't have it, the next autocomplete would be cleared and focused when you delete the one before it.
				I don't give the autocompletes any permanance, they rerender every time one is deleted and have no id or key.
				*/
				return state.filter(v => v.key !== action.payload.keyInArr);
			case 'edit':
				const x = [...state];
				const i = state.findIndex(v => v.key === action.payload.keyInArr);
				x.splice(i, 1, { ...state[i], [action.payload.editedKey]: action.payload.newValue });
				return x;
			case 'add':
				let highestKey = -1;
				state.forEach(v => { if (v.key > highestKey) highestKey = v.key });
				const nextKey = highestKey + 1;
				return [...state, { key: nextKey, field: 'join_last_name', operator: '=', query: '' }]
			default://okay FINE! if it makes you happy eslint 
		}
	}, [])
	const [response, setResponse] = useState(null);
	const [resultFormat, setResultFormat] = useState("table");
	const operators = {
		date: [
			{ value: "=", displayValue: "on" },
			{ value: "<=", displayValue: "on or before" },
			{ value: ">=", displayValue: "on or after" },
			{ value: "<", displayValue: "before" },
			{ value: ">", displayValue: "after" },
		],
		number: [
			{ value: "=", displayValue: "=" },
			{ value: "<=", displayValue: "<=" },
			{ value: ">=", displayValue: ">=" },
			{ value: "<", displayValue: "<" },
			{ value: ">", displayValue: ">" },
		],
		default: [
			{ value: "=", displayValue: "Matches Exactly" },
			{ value: "%LIKE%", displayValue: "Contains" },
			{ value: "LIKE%", displayValue: "Starts With" },
			{ value: "%LIKE", displayValue: "Ends With" }
		]
	}
	conditions.forEach(condition => {
		if (!(condition.field in distinctValues)) {
			selectDistinct(condition.field);
			distinctValues[condition.field] = ["Loading..."];
		}
	})
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
		let selectstr = fieldsToBeRetrieved.map(v => 'select[]=' + encodeURIComponent(v)).join('&');
		let conditionsstr = conditions.map(v => 'conditions[]=' + encodeURIComponent(JSON.stringify(v))).join('&');
		await fetch('/api/getData.php?' + [selectstr, conditionsstr].join('&'))
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
				<fieldset>
					<legend>Filter</legend>
					<div>
						{conditions.map(condition => {
							return (
								<FormGroup key={condition.key} row={true} style={{ margin: "15px" }}>
									<FormControl>
										<Autocomplete
											style={{ width: '300px' }}
											options={fieldNames}
											getOptionLabel={clean}
											value={condition.field}
											onChange={(_, v, eventType) => {
												switch (eventType) {
													case "clear": dispatchConditions({ type: 'delete', payload: { keyInArr: condition.key } }); break;
													default: dispatchConditions({ type: 'edit', payload: { keyInArr: condition.key, editedKey: 'field', newValue: v } })
												}
											}
											}
											renderInput={(v) =>
												<TextField
													{...v}
												/>
											}
										/>
									</FormControl>
									<FormControl>
										<Select
											id={'condition' + condition.key + 'operator'}
											value={condition.operator}
											style={{ width: "300px", margin: "auto 5px 0 5px" }}
											onChange={(_, newValue) => dispatchConditions({ type: 'edit', payload: { keyInArr: condition.key, editedKey: 'operator', newValue } })}>
											{(() => {
												const fieldObject = fields.find(fieldobj => fieldobj.name === condition.field);
												const inputType = (fieldObject.hasOwnProperty('inputType') && operators.hasOwnProperty(fieldObject.inputType) && fieldObject.inputType) || 'default';
												return operators[inputType].map(v => (<MenuItem value={v.value}>{v.displayValue}</MenuItem>))
											})()}
										</Select>
									</FormControl>
									<FormControl>
										<Autocomplete
											id={"query_autocomplete_" + condition.key}
											freeSolo
											autoSelect
											style={{ width: '300px', marginTop: "auto" }}
											options={distinctValues[condition.field]}
											onChange={(_, newValue) => dispatchConditions(
												{
													type: 'edit',
													payload: { keyInArr: condition.key, editedKey: 'query', newValue }
												}
											)}
											renderInput={params => (<TextField
												{...params}
												placeholder="Enter search term here..."
												id="query"
												value={condition.query}
											/>)
											}
										/>
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
						{Object.entries(responseobj).map(([id, record]) => (
							<TableRow>
								{fieldsToBeRetrieved.map(field => {
									if (field in record) {
										return (<TableCell>
											{edit && <a href={'/api/edit.php?id=' + id + '&field=' + field}>{record[field].join('; ')}</a>}
											{!edit && record[field].join('; ')}
										</TableCell>);
									} else {
										return <TableCell>{edit && <a href={'/api/edit.php?id=' + id + '&field=' + field}>[<i>Blank</i>]</a>}</TableCell>
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
