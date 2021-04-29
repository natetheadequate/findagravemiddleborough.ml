const data = require("./RockAtoPierce.json");
let human_names = [];
let prefixes = [];
let suffixes = [];
/* looks like this
{
   "0": {
     "last_name": "ALLEN", 
*/
/* /* function findComplicated() {// Warnings can be ignored if they are okay to be inputted into the database
    Object.keys(data).forEach(id){
        Object.keys(data[id]).forEach(field => {
            if (data[id][field])
        })
        if (data[id][given_name].match(/^[a-zA-Z][a-z]+($/).join() !== data[id][given_name]) {
            console.warn("the given name of " + id + " is weird because it has nonletters: " + data[id][given_name] + " If that's right, ignore this");

        }
        if (data[id][given_name].search
    }
} 
function splitWarnTrim(str, delimiter) {
    let arr = str.split(delimiter);
    if (arr.length > 1) { console.warn(str + 'interpreted as' + arr.toString()) }
    return arr;
} */
function titleCase(str) {
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
}
function cleanName(str) {
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
}

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

const or = "!@!@OR!!@!@!";
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
/*Initial verification of data/preparation to be inputted verbatim. 
When there is multiple possibilities (eg WW2 & Vietnam, abodi or arodi), they are separated by the or variable defined above
ntil they reach */
Object.keys(data).forEach((id) => {
	//first job: break given_name into first_name and middle_name or middle_initial, and prefix_suffix into prefix and suffix
	if ((n = data[id].given_name)) {
		/*this regex checks capitalization because Abodi orArodi should get flagged bc theres clearly a missing space. Ofc, names like McGuire might have problems
        Also it allows for periods after middle initials and leading/trailing whitespace even though in the end they'll be stripped */
		if (/^\s*[a-zA-Z][a-z]+( [A-Za-z](.|[a-z]*))*\s*$/.test(n)) {
			const namearr = n.trim().split(" "); //so namearr[0] will be the first name, and namearr[1] will be the middle name/initial or not exist, bc some records just list first name
			switch (namearr.length) {
				case 2:
					if (namearr[1].match(/[a-zA-Z]/g).length === 1) {
						//the reason for the match() is "J." should be interpreted as an initial even though it's two chars.
						//i know match wont be null because of the regex in the if statement
						data[id]["middle_initial"] = namearr[1].match(/[a-zA-Z]/)[0].toUpperCase();
					} else {
						data[id]["middle_name"] = cleanString(namearr[1]);
					}
				case 1:
					data[id]["first_name"] = namearr[0];
					break;
				default:
					console.error("This one broke the code in the prefiltering of given_name to first_name and middle: " + id + " ||| which is listed as: " + n);
			}
			//TODO: verify that the first_name+middle_name/initial=n, otherwise warn
		} else {
			console.error("Manually input this one's middle initial/middle_name and first name in the data json: [" + id + "] has a given_name [" + n + "]");
		}
	}
	//TODO: use prefix dictionary and suffix dictionary to add all prefixes and suffixes, then verify that each is in one or the other
	Object.keys(data[id]).forEach((key) => {
		//in this we console.warn for any values that seem off, and throw errors for anything that wouldn't fit the datatype of the sql column
		if (data[id][key] == "") {
			delete data[id][key];
		} else {
			switch (key) {
				case "last_name":
					return null; //TODO
			}
		}
	});
});

//generate arrays which will then be used to generate sql. By dafault, any column will be uploaded without first encoding with a dictionary, but names, wars, and branches will be encoded as integers corresponding to indexes of other tables on the database
Object.keys(data).forEach((id) => console.log(`${data[id]["given_name"]} ${id} ${data[id]["first_name"]} ${data[id]["middle_name"]} MI: ${data[id]["middle_initial"]}`));