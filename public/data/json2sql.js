module.exports = (data, dataTables, prefixOrSuffix, existingDictionaries = {}) => {
	/*
		prefixOrSuffix is an object rather than two arrays so that nothing can be simultaneously be listed a prefix and a suffix.
	*/
	//this script generates the sql to make the meat of the database. generatesql calls this function after making the sql for the skeleton.
	const logger = require("node-color-log");
	function titleCase(str) {
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
	}
	function cleanName(str) {
		//Meant for a single name ("Bob" not "Bob Smith"). Properly cases and flags anything with weird capitalization or spaces or length not between 2 and 20
		str = str.trim();
		switch (
			true //Manual Exceptions
		) {
			case /^Ma?c[A-Z][a-z]+$/.test(str):
			case /^O'[A-Z][a-z]+$/.test(str):
			case /^Le[A-Z][a-z]+$/.test(str):
				return str;
		}
		const newstr = titleCase(str);
		if (/[A-Za-z]{2,20}/.test(str)) {
			//a normal name, but maybe with funny capitalization
			switch (true) {
				case str.toLowerCase() === str:
				case str.toUpperCase() === str:
				case titleCase(str) === newstr:
					return newstr;
			}
		}
		//reason why something is flagged for capitalization is because of the possibility of soemthing like "Arodi orAbodi" [sic]
		//mostly working with standard american names, so any accents could be indication of encoding failure
		//spaces could mean that a name wasn't properly parsed
		logger.warn(`"${str}" should be the properly capitalized first, last, or middle name of a person. If it is, ignore this. Otherwise, fix it where it occurs in the data. It was flagged as a possible error because of its unusual capitalization, non-letters, length, or spaces.`);
		return str;
	}
	let fatalError = false; //if theres a problem which needs to get fixed before sql, this is flipped. However, the checks continue so all fatal errors can be identified at once.
	let fields = [];
	dataTables.forEach((v) => {
		if (v.type === "independent") fields.push(v.name);
		else if (v.type === "join") fields.push(v.name.replaceAll("join_", ""));
	});
	Object.keys(data).forEach((id) => {
		let n;
		if ((n = data[id].given_name)) {
			//separate into first_name and middle_name or middle_initial.
			/*this regex checks for anything abnormal, and doesn't attempt to separate them if there is anything abnormal. 
				The "Abodi orArodi"=>["Abodi","Arodi"] problem will be resolved in the verification switch, where cleanName() is called
        */
			if (/^\s*[a-z]+( [a-z](.|[a-z]*))?\s*$/i.test(n)) {
				//above regex allows for periods after middle initials and leading/trailing whitespace even though in the end they'll be stripped.
				const namearr = n.trim().split(" "); //so namearr[0] will be the first name, and namearr[1] will be the middle name/initial or not exist, bc some records just list first name
				switch (namearr.length) {
					case 2:
						if (namearr[1].match(/[a-z]/gi).length === 1) {
							//the reason for the match() is "J." should be interpreted as an initial even though it's two chars.
							//i know match wont be null because of the regex in the if statement
							//middle name and middle initial will probably be merged into one column but im keeping them separate so middlename can go through cleanName() without generating warnings from the initials being only one character.
							data[id]["middle_initial"] = namearr[1].match(/[a-zA-Z]/)[0].toUpperCase();
						} else {
							data[id]["middle_name"] = namearr[1];
						}
					// eslint-disable-next-line no-fallthrough
					case 1:
						data[id]["first_name"] = namearr[0];
						break;
					default:
						fatalError = true;
						logger.error("FATAL: This one broke the code in the prefiltering of given_name to first_name and middle: " + id + " ||| which is listed as: " + n);
				}
				//check for irregularities
				let recombinated = [];
				if (data[id].hasOwnProperty("first_name")) {
					recombinated.push(data[id]["first_name"]);
				}
				if (data[id].hasOwnProperty("middle_name")) {
					recombinated.push(data[id]["middle_name"]);
				}
				if (data[id].hasOwnProperty("middle_initial")) {
					recombinated.push(data[id]["middle_initial"]);
				}
				if (n.trim() !== recombinated.join(" ")) {
					logger.warn([n, data[id]["first_name"], data[id]["middle_name"], data[id]["middle_initial"]]);
				}
			} else {
				fatalError = true;
				logger.error("FATAL: Manually separate given_name into middle initial/middle_name and first name in the data json: [" + id + "] has a given_name [" + n + "]");
			}
		}
		if ((n = data[id].prefix_suffix)) {
			if (prefixOrSuffix[n + "."]) {
				n = n + ".";
			}
			if (prefixOrSuffix[n]) {
				if (prefixOrSuffix[n] === "prefix") {
					data[id].prefix = n;
				} else if (prefixOrSuffix[n] === "suffix") {
					data[id].suffix = n;
				} else {
					logger.error("Fatal Error: prefixOrSuffix.json has " + n + " not listed as either 'suffix' or 'prefix'");
					fatalError = true;
				}
			} else {
				logger.error(`Fatal Error: the prefix or suffix ${n} must be added to the prefixOrSuffix object as a key with value "prefix" or "suffix"`);
				fatalError = true;
			}
		}

		//now that all the new fields we wanted to make have been added, lets verify ALL the fields in the data to make sure they have a corresponding column in the sql and will meet the constraints of that column
		//in this we logger.warn for any values that seem off, and throwError() for anything that wouldn't fit the datatype of the sql column or are just clearly wrong (year 30005)
		const throwError = (key, id, i, data, reqs) => {
			fatalError = true;
			logger.error(`Fatal Error: ID ${id}'s ${key} (alternative #${i}) is bad -- it's ${data[id][key][i]} as a ${typeof data[id][key][i]} and it needs to ${reqs}.`);
		};
		const verifyInteger = (data, id, key, i, spthrowError, max) => {
			switch (typeof data[id][key][i]) {
				case "string":
					if (/^\s*[0-9]+\s*$/.test(data[id][key][i])) {
						data[id][key][i] = +data[id][key][i];
						return verifyInteger(data, id, key, i, spthrowError, max);
					} else {
						spthrowError("be a number not a string");
					}
					break;
				case "number":
					if (Number.isInteger(data[id][key][i])) {
						if (data[id][key][i] > -1) {
							if (data[id][key][i] < max + 1) {
								return true;
							} else {
								spthrowError("be less than " + (max + 1));
							}
						} else {
							spthrowError("be positive or zero");
						}
					} else {
						spthrowError("be a whole number");
					}
					break;
				default:
					throwError("be a number");
			}
		};
		Object.keys(data[id]).forEach((key) => {
			if (data[id][key] === "" || key === "prefix_suffix" || key === "given_name") {
				delete data[id][key];
			} else {
				if (typeof data[id][key] === "string") {
					data[id][key] = data[id][key].replace(/\s+/g, " ");
					data[id][key] = data[id][key].replace(/\t|\n/g, ": ");
					if (/(?<!ESC)\/| or | and |\s*(?<!ESC)&\s*/i.test(data[id][key]) && key !== "notes" && key !=='location_in_cemetery' && key !== 'cemetery') {
						//this regex is broader than the regex used to split to highlight any cases where it may false-negative
						const split = data[id][key].split(/\s*(?<!ESC)\/\s*|\s+or\s+|\s+and\s+|\s*(?<!ESC)&\s*/g);
						logger.info(data[id][key] + " has been split into " + JSON.stringify(split));
						data[id][key] = split;
					} else {
						data[id][key] = [data[id][key]]; //easier to have them all be arrays
					}
				} else {
					data[id][key]=[data[id][key]];
				}
				data[id][key].forEach((dontusethisbecauseanychangesmadealreadywontbereflectedinitnorchangesmadetoitpreserved, i) => {
					const spthrowError = (reqs) => throwError(key, id, i, data, reqs);
					if (typeof data[id][key][i] === "string") {
						data[id][key][i] = data[id][key][i].replaceAll('ESCor', "or");
						data[id][key][i] = data[id][key][i].replaceAll('ESCand', "and");
						data[id][key][i] = data[id][key][i].replaceAll('ESC/', "/");
						data[id][key][i] = data[id][key][i].replaceAll('ESC&', "&");
					}
					switch (key) {
						case "first_name":
						case "middle_name":
						case "last_name":
						case "maiden_name":
							data[id][key][i] = cleanName(data[id][key][i]);
							break;
						case "middle_initial":
							data[id]["middle_name"] = data[id]["middle_initial"];
							delete data[id]["middle_initial"];
							key = "middle_name"; //continue loop as if it was a middle_name since thats the column its going to.
					}
					if (!fields.includes(key)) {
						logger.error(`FATAL ERROR: ${key} is not a known datatype`);
						fatalError = true;
					}
					let datatype;
					dataTables.some((v) => {
						let found = false;
						switch (v.type) {
							case "dictionary":
								break;
							case "join":
								if (v.name.replace("join_", "") === key) {
									datatype = "varchar(255)";
									found = true;
								}
								break;
							case "independent":
								if (v.name === key) {
									datatype = v.datatype;
									found = true;
								}
								break;
							default:
								spthrowError("not have a strange type in dataTables. What is " + v.type + "?");
						}
						return found;
					});

					switch (datatype) {
						case "tinyint(1)":
							switch (data[id][key][i]) {
								case "No":
								case "no":
								case "0":
								case 0:
								case false:
								case "false":
									data[id][key][i] = 0;
									break;
								case "Yes":
								case "yes":
								case 1:
								case "1":
								case true:
								case "true":
									data[id][key][i] = 1;
									break;
								default:
									spthrowError("be yes or no or 0 or 1 or true or false");
							}
							break;
						case "tinyint UNSIGNED":
							verifyInteger(data, id, key, i, spthrowError, 255);
							break;
						case "smallint UNSIGNED":
							verifyInteger(data, id, key, i, spthrowError, 65535);
							break;
						case "int UNSIGNED":
							verifyInteger(data, id, key, i, spthrowError, 4294967295);
							break;
						case "varchar(255)":
							if (typeof data[id][key][i] !== "string") {
								data[id][key][i] = data[id][key][i].toString();
								logger.warn(data[id][key][i] + " was converted to a string at id:" + id + " and key:" + key);
							}
							if (data[id][key][i].length > 255) {
								spthrowError("be 255 characters or less");
							}
							break;
						case "varchar(MAX)":
							if (typeof data[id][key][i] !== "string") {
								data[id][key][i] = data[id][key][i].toString();
								logger.warn(data[id][key][i] + " was converted to a string at id:" + id + " and key:" + key);
							}
							if (data[id][key][i].length > 65535) {
								spthrowError("be 65,355 characters or less.");
							}
							break;
						default:
							console.warn("Unknown datatype " + datatype);
					}
					switch (key) {
						case "birth_month":
						case "entry_month":
						case "exit_month":
						case "death_month":
							if (!Number.isInteger(data[id][key][i]) || data[id][key][i] < 1 || data[id][key][i] > 12) {
								spthrowError("be between 1 and 12");
							}
							break;
						case "birth_day":
						case "death_day":
						case "entry_day":
						case "exit_day":
							if (!Number.isInteger(data[id][key][i]) || data[id][key][i] < 1 || data[id][key][i] > 31) {
								throwError(key, id, i, data, "be between 1 and 31");
							}
							break;
					}
				});
			}
		});
	});
	if (fatalError) {
		throw new Error("Fix the above fatal errors before you may proceed");
	}

	let dictionaries = {};
	let joinTables = [];
	let independentTables = [];
	dataTables.forEach((dataTable) => {
		switch (dataTable.type) {
			case "dictionary":
				if (Object.keys(existingDictionaries).includes(dataTable.name)) {
					dictionaries[dataTable.name] = existingDictionaries[dataTable.name];
				} else {
					dictionaries[dataTable.name] = {};
				}
				break;
			case "join":
				joinTables.push([dataTable.name, dataTable.dictionary]);
				break;
			case "independent":
				independentTables.push(dataTable.name);
				break;
			case "virtual":
				break;
			default:
				throw new Error("Invalid type in dataTable json: " + dataTable.type);
		}
	});
	function makeJoinTable(field, dictionaryName="") {
		let resultstr = "";
		Object.keys(data).forEach((id) => {
			if (data[id].hasOwnProperty(field)) {
				data[id][field].forEach((dontusethisnochangeswillbereflected, i) => {
					if (typeof data[id][field][i] !== undefined && data[id][field][i] !== null && data[id][field][i] !== "") {
						const value = data[id][field][i];
						if (dictionaryName === "") {
							if (typeof data[id][field][i] === "string") {
								data[id][field][i] = '"' + data[id][field][i] + '"';
							}
							resultstr += "INSERT INTO `" + field + "` VALUES (" + id + "," + data[id][field][i] + ");";
						} else {
							const nextIndex = Object.keys(dictionaries[dictionaryName]).length ? +Array.from(Object.keys(dictionaries[dictionaryName])).sort((a, b) => +b - +a)[0] + 1:1;
							if (!Object.values(dictionaries[dictionaryName]).includes(value)) {
								dictionaries[dictionaryName][nextIndex] = value; //that way the value is there for any subsequent runs
								resultstr += "INSERT INTO `" + dictionaryName + "` VALUES (" + nextIndex + ',"' + value + '");';
							}
							resultstr += "INSERT INTO `join_" + field + "` VALUES (" + id + "," + Object.keys(dictionaries[dictionaryName]).find((v) => dictionaries[dictionaryName][v] === value) + ");";
						}
					} else {
						throw new Error("Somethings off about the " + field + " of " + id);
					}
				});
			}
		});
		return resultstr; //also the dictionary has been modified
	}
	let sql = "";
	//so now we create our tables from the json, which we know has only good fields with good values.
	joinTables.forEach((v) => (sql += makeJoinTable(v[0].replace("join_", ""), v[1])));
	independentTables.forEach((field) => (sql += makeJoinTable(field)));
	Object.keys(dictionaries).forEach(dictionaryName=>console.log(dictionaryName+":"+JSON.stringify(dictionaries[dictionaryName])+'\n'));
	return sql;
};
