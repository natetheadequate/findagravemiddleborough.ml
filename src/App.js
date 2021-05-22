import { FormControl, Button, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
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
	/* useEffect(()=>{
		console.dir(fields);
	},[fields]) */
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
	const [response,setResponse]=useState(null);
	const submitForm=()=>{
		const body={
			select:fieldsToBeRetrieved,
			sortBy,
			sortOrder,
			conditions
		}
		console.dir(body)
		fetch('/api/echo.php',{method:'POST',body})
	}
	return (
		<>
			<form onSubmit={(e)=>e.preventDefault()} style={{ margin: '10px' }}>
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
				<FormControl style={{ marginTop: spacing }}>
					<InputLabel id='sort-by-label'>Sort By</InputLabel>
					<Select
						id="sort-by"
						value={sortBy}
						onChange={e => setSortBy(e.target.value)}
						labelId="sort-by-label"
					>
						{fieldNames.map(field => (
							<MenuItem value={field}>{clean(field)}</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl style={{ verticalAlign: 'bottom' }}>
					<Button
						variant='text'
						onClick={() => {
							if (sortOrder === 'ASC') {
								setSortOrder('DESC');
							} else {
								setSortOrder('ASC');
							}
						}}
					>
						{sortOrder === 'DESC' ? <TrendingDown /> : <TrendingUp />}
					</Button>
				</FormControl>
				<br />
				<fieldset style={{ marginTop: spacing }}>
					<legend>Filter</legend>
					<div>
						{Object.entries(conditions).map(([i]) => {
							return (
								<>
									<InputLabel>Condition {+i + 1}:</InputLabel>
									<Autocomplete
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
									<OperatorSelect
										i={i}
										value={conditions[i].operator}
										fieldObject={Object.values(fields).find((v) => v.name === conditions[i]['field'])}
										setOperator={(newValue) =>
											dispatchConditions({ type: 'edit', payload: { i, key: 'operator', newValue } })
										} />
									<TextField id="query" onChange={e => dispatchConditions({ type: 'edit', payload: { i, key: 'query', newValue: e.target.value } })} value={conditions[i].query} />
								</>
							)
						})
						}
					</div>
					<div>
						{
							<Button onClick={() => dispatchConditions({ type: 'add' })}>Add Condition</Button>
						}
					</div>
				</fieldset>
				<Button type="submit" onClick={()=>{submitForm()}}>Go!</Button>
			</form>
		</>
	);
}

export default App;
