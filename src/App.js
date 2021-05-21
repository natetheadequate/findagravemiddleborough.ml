import { Field, Form, Formik } from "formik";
import { MenuItem, Chip } from "@material-ui/core";
import {Select} from 'formik-material-ui'
import Readct from "react";

import React, { useState, useEffect } from "react";
const useFetch = () => {
	const [data, setData] = useState(null);

	// empty array as second argument equivalent to componentDidMount
	useEffect(() => {
		async function fetchData() {
			const medata = [];
			const response = await fetch(process.env.PUBLIC_URL + "data/info/dataTables.json");
			const json = await response.json();
			json.forEach((v) => {
				switch (v.type) {
					case "dictionary":
						break;
					case "join":
						medata.push(v.name.replace("join_", "")); //,...data]);
						break;
					case "independent":
						medata.push(v.name); //,...data]);
						break;
					default:
						console.error(v.type + " is not a valid value for the type key in dataTables.json");
				}
			});
			setData(medata);
		}
		fetchData();
	}, []);

	return data;
};
const useFields = () => {
	const [fields, setFields] = useState(null);
	async function retrieve() {
		const res = await fetch(process.env.PUBLIC_URL + "data/info/dataTables.json");
		console.log(res);
		const json = await res.json();
		let temp = [];
		json.forEach((v) => {
			switch (v.type) {
				case "dictionary":
					break;
				case "join":
					temp.push(v.name.replace("join_", ""));
					break;
				case "independent":
					temp.push(v.name);
					break;
				default:
					console.error(v.type + " is not a valid value for the type key in dataTables.json");
			}
		});
		setFields(temp);
	}
	useEffect(() => {
		retrieve();
	}, []);
	console.dir(fields);
	return fields;
};

function App() {
	const fields = useFields();
	/* useEffect(()=>{
		console.dir(fields);
	},[fields]) */
	const [results, setResults] = React.useState([]);
	let databaseAccessible;
	return (
		<>{Array.isArray(fields) && (
			<Formik
				initialValues={{
					select: [],
				}}
				onSubmit={(formikBag) => {
					console.dir(formikBag.values);
					setResults(formikBag);
				}}>
				{(props) => (
					<Form>
						<label>
							Data to be Retreived
							<Field name="select" component={Select} multiple>
								{fields.map((field) => (
									<MenuItem value={field}>{field}</MenuItem>
								))}
							</Field>
						</label>
					</Form>
				)}
			</Formik>
		)}</>
	);
}

export default App;
