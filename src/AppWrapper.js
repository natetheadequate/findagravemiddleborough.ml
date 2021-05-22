import App from './App';
import React, { useState, useEffect } from "react";

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
				case "virtual":
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
	console.dir(fields);
	return fields;
};

function AppWrapper() {
	const fields = useFields();
	return (
		<>
			{Array.isArray(fields) && <App fields={fields} />}
		</>
	);
}

export default AppWrapper;
