import { FormControl, Button, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import TrendingDown from "@material-ui/icons/TrendingDown";
import TrendingUp from "@material-ui/icons/TrendingUp";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useReducer, useState } from "react";

function App({ fields }) {
	/* useEffect(()=>{
		console.dir(fields);
	},[fields]) */
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
		return titleCase(str.replace('join_', '').replaceAll('_', ' '))
	}
	const fieldNames = [];
	fields.forEach((v, i) => fieldNames.push(fields[i].name));
	const [fieldsToBeRetrieved, setFieldsToBeRetrieved] = useState(fieldNames);
	const [sortBy, setSortBy] = useState('join_last_name');
	const [sortOrder, setSortOrder] = useState('ASC');
	const [conditions, dispatchConditions] = useReducer((state, action) => {
		switch (action.type) {
			case 'edit':
				return { ...state, [action.payload.i]: {...state[action.payload.i],[action.payload.field]:action.payload.newValue }}
			case 'add':
				return { ...state, [+Object.keys(state).sort((a, b) => b - a)[0]+1]: { field: '', operator: '=', query: '' } }
			default:
		}
	}, { 0: { field: '', operator: '=', query: '' } })
	const spacing = "5px";
	return (
		<>
			<form action="/api/getData.php" method="GET" style={{ margin: '10px' }}>
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
						{Object.entries(conditions).map((v) => {
							const i=v[0];
							const condition=v[1];
							return(
							<div key={i}>
								<InputLabel>Condition {i}:</InputLabel>
								<Autocomplete
									multiple
									id={'condition' + i + 'field'}
									options={fieldNames}
									getOptionLabel={clean}
									filterSelectedOptions
									value={condition['field']}
									onChange={e => dispatchConditions({ type: 'edit', payload: { i: i, key: 'field', newValue: e.target.value } })}
									renderInput={(v) =>
										<TextField
											{...v}
											variant="outlined"
											label="Field"
										/>
									}
								/>
								<Select
									id={'condition' + i + 'operator'}
									value={condition['operator']}
									onChange={e => dispatchConditions({ type: 'edit', payload: { i: i, key: 'operator', payload: e.target.value } })}
								>{() => {
									const FieldObject = Object.values(fields).find((v) => v.name === condition['field']);
									const inputType = FieldObject.hasOwnProperty('inputType') ? FieldObject.inputType : '';
									switch (inputType) {
										case 'date':
											return (<>
												<MenuItem value='='>on</MenuItem>
												<MenuItem value="<=">on or before</MenuItem>
												<MenuItem value=">=">on or after</MenuItem>
												<MenuItem value="<">before</MenuItem>
												<MenuItem value=">">after</MenuItem>
											</>)
										case 'number':
											return (<>
												<MenuItem value='='>=</MenuItem>
												<MenuItem value="<=">&lt;=</MenuItem>
												<MenuItem value=">=">&gt;=</MenuItem>
												<MenuItem value="<">&lt;</MenuItem>
												<MenuItem value=">">&gt;</MenuItem>
											</>)
										default:
											return (<>
												<MenuItem value='='>Matches Exactly</MenuItem>
												<MenuItem value="%LIKE%">Contains</MenuItem>
												<MenuItem value="LIKE%">Starts With</MenuItem>
												<MenuItem value="%LIKE">Ends With</MenuItem>
											</>)
									}


								}}
								</Select>
								<TextField id="query" onChange={e => dispatchConditions({ type: 'edit', payload: { i: i, key: 'query', newValue: e.target.value } })} value={condition.query} />
							</div>
						)})
						}
					</div>
					<div>
						{
							<Button onClick={() => dispatchConditions({ type: 'add' })}>Add Condition</Button>
						}
					</div>
				</fieldset>


			</form>
		</>
	);
}

export default App;
