import App from './App';
import React, { useState, useEffect } from "react";
import { BrowserRouter,Route, Switch } from 'react-router-dom';

const useFields = () => {
	const [fields, setFields] = useState(null);
	async function retrieve() {
		const res = await fetch(process.env.PUBLIC_URL + "data/info/dataTables.json");
		const json = await res.json();
		let temp = [];
		json.forEach((v) => {
			switch (v.type) {
				case "dictionary":
				case "virtual":
					break;
				case "join":
				case "independent":
					temp.push(v);
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
	return fields;
};

function AppWrapper() {
	const fields = useFields();
	return (
		<BrowserRouter>
			<Switch>
				{/* it is necessary to check that fields is an array because in the first paint it isn't, and throws an error. */}
				<Route exact path="/edit">
					{Array.isArray(fields) && <App fields={fields} edit/>}
				</Route>
				<Route exact path='/'>
					{Array.isArray(fields) && <App fields={fields} />}
				</Route>
			</Switch> 
		</BrowserRouter>
	);
}

export default AppWrapper;
