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
		if (c == " " || c == "/") {
			capitalizenextletter = true;
		} else {
			capitalizenextletter = false;
		}
	});
	return newstr;
}
function cleanName(str) {
	//Meant for a single name ("Bob" not "Bob Smith"). Properly cases and flags anything with weird capitalization or spaces or length not between 2 and 20
	console.debug(str);
	str = str.trim();
	switch (
		true //Manual Exceptions
	) {
		case /^Ma?c[A-Z][a-z]+$/.test(str):
		case /^O\'[A-Z][a-z]+$/.test(str):
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
	console.warn(`"${str}" should be the properly capitalized first, last, or middle name of a person. If it is, ignore this. Otherwise, fix it where it occurs in the data. It was flagged as a possible error because of its unusual capitalization, non-letters, length, or spaces.`);
	return str;
}
const data = require("./RockAtoPierce.json");
/*this is the new data to be added. 
This json should be generated by getting a csv from the "Cemetery Staging" sheet and then selecting hash at https://csvjson.com/csv2json
result should look like this
{
   "0": {
     "last_name": "ALLEN", 
	 [...]
*/
let fatalError = false; //if theres a problem which needs to get fixed before sql, this is flipped. However, the checks continue so all fatal errors can be identified
var XMLHttpRequest = require("xhr2");
let existingDictionaries = {};
let xhrs = [];
const dictionaryNames = require("./dataStructures.json").dictionaries;
dictionaryNames.forEach((dictionaryName, i) => {
	xhrs[i] = new XMLHttpRequest();
	xhrs[i].myDictionaryName = dictionaryName;
	xhrs[i].myIteratorValue = i; //these allow me to pass parameters to the callback
	xhrs[i].onload = restofthecode;
	xhrs[i].open("GET", "mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8");
	//xhrs[i].open("GET", "https://dev.findagravemiddleborough.ml/data/dictionaries.php?dictionary=" + dictionaryName);
	xhrs[i].send();
});
function restofthecode() {
	let dictionaryName = this.myDictionaryName;
	let i = this.myIteratorValue;
	existingDictionaries[dictionaryName] = JSON.parse(this.responseText);
	if (i + 1 === dictionaryNames.length) {
		existingDictionaries = JSON.parse('{ prefixes: { 1: "Dr." }, suffixes: { 1: "Jr." }, ranks: { 1: "E2" }, names: { 1: "Allen", 2: "Eugene" }, wars: { 1: "WW II          (1939 - 1945)" }, places: { 1: "Middleborough" }, medallions: { 1: "American Legion" }, branches: { 1: "US Navy" }, cemeteries: { 1: "Rock Cemetery    Highland Street                South Middleborough" } }');
		Object.keys(data).forEach((id) => {
			if ((n = data[id].given_name)) {
				/*this regex checks capitalization because Abodi orArodi should get flagged bc theres clearly a missing space. 
		Certain first/middle names do have capitalization midway, but those are few enough that they can be manually separated for safety.
        Also it allows for periods after middle initials and leading/trailing whitespace even though in the end they'll be stripped */
				if (/^\s*[a-zA-Z][a-z]+( [A-Za-z](.|[a-z]*))*\s*$/.test(n)) {
					const namearr = n.trim().split(" "); //so namearr[0] will be the first name, and namearr[1] will be the middle name/initial or not exist, bc some records just list first name
					switch (namearr.length) {
						case 2:
							if (namearr[1].match(/[a-zA-Z]/g).length === 1) {
								//the reason for the match() is "J." should be interpreted as an initial even though it's two chars.
								//i know match wont be null because of the regex in the if statement
								data[id]["middle_name"] = namearr[1].match(/[a-zA-Z]/)[0].toUpperCase(); //i dont believe in separating middle initials and middle names anymore
							} else {
								console.log(namearr[1]);
								data[id]["middle_name"] = cleanName(namearr[1]);
							}
						case 1:
							data[id]["first_name"] = cleanName(namearr[0]);
							break;
						default:
							console.error("This one broke the code in the prefiltering of given_name to first_name and middle: " + id + " ||| which is listed as: " + n);
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
					if (true || n.trim() !== recombinated.join(" ")) {
						console.warn(`${n} was deemed to be first_name: ${data[id]["first_name"]} middle_name/initial: ${data[id]["middle_name"]}`);
					}
				} else {
					console.error("Manually input this one's middle initial/middle_name and first name in the data json: [" + id + "] has a given_name [" + n + "]");
				}
			}
			if ((n = data[id].prefix_suffix)) {
				if (prefixOrSuffix[n + "."]) {
					n = n + ".";
				}
				if (prefixOrSuffix[n]) {
					if (prefixOrSuffix[n] === "prefix") {
						data[id][prefix] = n;
					} else if (prefixOrSuffix[n] === "suffix") {
						data[id][suffix] = n;
					} else {
						console.error("prefixOrSuffix.json has " + n + " not listed as either 'suffix' or 'prefix'");
						fatalError=true;
					}
				} else {
					console.error(`the prefix or suffix ${n} must be added to the prefixOrSuffix object as a key with value "prefix" or "suffix"`);
					fatalError=true;
				}
			}

			//now that all the new fields we wanted to make have been added, lets verify ALL the fields in the data to make sure they have a corresponding column in the sql and will meet the constraints of that column
			//in this we console.warn for any values that seem off, and throw errors for anything that wouldn't fit the datatype of the sql column or are just clearly wrong (year 30005)
			const throwError = (key, id, data, reqs) => {
				throw new Error(`${key} is bad for ${id} -- it's ${data[id][key]}, and it needs to ${reqs}`);
			};
			Object.keys(data[id]).forEach((key) => {
				if (data[id][key] == "" || key === "prefix_suffix" || key === "given_name") {
					delete data[id][key];
				} else {
					if (/ or /.test(data[id][key])) {
						data[id][key] = data[id][key].split(" or ");
						console.warn(data[id][key] + " has been interpreted as " + JSON.stringify(data[id][key]));
					} else {
						data[id][key] = [data[id][key]]; //just useful to have them alll be arrays
					}
					data[id][key].forEach((v) => v.replace("!ESC!or", "or")); //!ESC!or gets replaced with or but stops it from being interpreted as an array of values.
					data[id][key].forEach((v) => {
						switch (
							key //THIS IS BAD BECAUSE OF LACK OF TYPECHECKS
						) {
							case "last_name":
							case "maiden_name":
							case "first_name":
							case "middle_name":
								data[id][key] = cleanName(data[id][key]);
								if (!/^.{1,30}$/.test(data[id][key])) {
									throwError(key, id, data, "be between 1 and 30 characters and shouldn't contain a newline");
								}
								break;
							case "middle_initial":
								data[id][key] = data[id][key].toUpperCase();
								if (!/^[A-Z]$/.test(data[id][key])) {
									throwError(key, id, data, "be one capital letter from A-Z...but the code should have made sure this was true before here");
								}
								break;
							case "birth_month":
							case "entry_month":
							case "exit_month":
							case "death_month":
								if (!Number.isInteger(data[id][key]) || data[id][key] < 1 || data[id][key] > 12) {
									throwError(key, id, data, "be between 1 and 12");
								}
								break;
							case "birth_year":
							case "death_year":
							case "entry_year":
							case "exit_year":
								if (!Number.isInteger(data[id][key]) || data[id][key] < 1) {
									throwError(key, id, data, "be positive");
								}
								break;
							case "count":
								if (!Number.isInteger(data[id][key])) {
									throwError(key, id, data, "be a number");
								}
								break;
							case "veteran_status_verified":
							case "records_checked":
								if (typeof data[id][key] !== "boolean") {
									throwError(key, id, data, "be either true or false");
								}
							case "birth_day":
							case "death_day":
							case "entry_day":
							case "exit_day":
								if (!Number.isInteger(data[id][key]) || data[id][key] < 1 || data[id][key] > 31) {
									throwError(key, id, data, "be between 1 and 31");
								}
								break;
							case "birth_place":
							case "death_place":
							case "rank":
							case "branch":
							case "unit":
							case "war":
							case "medallion":
							case "service_number":
							case "cemetery":
							case "location_in_cemetery":
							case "find_a_grave_memorial_number":
							case "cenotaphs":
							case "notes":
							case "father_name":
							case "mother_name":
							case "spouse_name":
							case "resident_id":
								if (typeof data[id][key] !== "string" || data[id][key].length > 250) {
									throwError(key, id, data, "be a string less than 250 chars");
								}
							case "given_name":
							case "prefix_suffix":
								break;
							default:
								throw new Error(`${key} is not a known datatype`);
						}
					});
				}
			});
		});
		if (fatalError) {
			throw new Error("Fix the above errors before you may proceed");
		}

		/* const [human_names, branches, medallions, places, ranks, wars, cemeteries, locations_in_cemeteries] = Array(8).fill([]);
const xhr = new XMLHttpRequest();
xhr.onload() = () => {
	xhr.responseText;
}; */
		//get all the dictionaries from database

		/*
the data is the object of all the fields, the dictionary is array of names, the field is the property of the data object being read
returns an array of arrays-with-length-2 that consist of ids (unique grave identifier from the toplevel keys of the data object) and the integer representation of a name
One id may be repeated in this because sometimes the last name isn't known and could be one of two options
Eg if human_names (a dictionary) has ["Allen","Allan"...], and grave id 0 is unclear between the two, then [[0,0],[0,1]] will be returned

TLDR; this function adds values to the dictionary as needed and returns [[id,indexInDictionaryOf "field" Value],...] each time a "field" exists on one of the objects in "data"
*/
		function manyToMany(data, dictionary, field) {
			//
			resultarr = [];
			Object.keys(data).forEach((id) => {
				if (data[id].hasOwnProperty(field))
					if (typeof data[id][field] !== undefined && data[id][field] !== null && data[id][field] !== "") {
						const name = data[id][field];
						if (dictionary.indexOf(name) === -1) {
							dictionary.push(name);
						}
						resultarr.push([id, dictionary.indexOf(name)]);
					} else {
						throw new Error();
					}
			});
			return resultarr;
		}

		const or = "!@!@OR!!@!@!"; //how to separate them...
		///prefixOrSuffix is an object rather than two arrays so that nothing can be simultaneously be listed a prefix and a suffix
		const prefixOrSuffix = require("./prefixOrSuffix.json");
		const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		/*Initial verification of data/preparation to be inputted verbatim. 
When there is multiple possibilities (eg WW2 & Vietnam, abodi or arodi), they are separated by the or variable defined above
ntil they reach */
		let maiden;

		const sql = "START TRANSACTION";

		//so now we create our dictionaries and tables from the json, which we know has only good fields with good values.
		//generate arrays which will then be used to generate sql. By dafault, any column will be uploaded without first encoding with a dictionary, but names, wars, and branches will be encoded as integers corresponding to indexes of other tables on the database
		Object.keys(data).forEach((id) => console.log(`${data[id]["given_name"]} ${id} ${data[id]["first_name"]} ${data[id]["middle_name"]} MI: ${data[id]["middle_initial"]}`));
	}
}
