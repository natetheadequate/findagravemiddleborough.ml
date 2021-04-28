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
	}); //this code was because i was worried about prefixes and middle initials having a period after them, thus messing things up. Ill deal with it elsewhere
	/* if((finalstr=newstr.match(/[a-zA-z\-0-9 é]/g).join('').trim())!==newstr.trim()){
        console.warn(newstr+" was turned into "+finalstr);
    } */ return newstr.trim();
}

/*
the data is the object of all the fields, the dictionary is array of names, the field is the property of the data object being read
returns an array of arrays-with-length-2 that consist of ids (unique grave identifier from the toplevel keys of the data object) and the integer representation of a name
One id may be repeated in this because sometimes the last name isn't known and could be one of two options
Eg if human_names (a dictionary) has ["Allen","Allan"...], and grave id 0 is unclear between the two, then [[0,0],[0,1]] will be returned
*/
function manyToMany(data, dictionary, field, simpleEnoughForAutomation = (x) => true) {
	//DO NOT USE IF THE FIELD VALUE COULD BE FALSY
	resultarr = [];
	Object.keys(data).forEach((id) => {
		if (data[id][field]) {
			if (simpleEnoughForAutomation(data[id][field])) {
				const name = titleCase(data[id][field]);
				if (dictionary.indexOf(name) === -1) {
					dictionary.push(name);
				}
				resultarr.push([id, dictionary.indexOf(name)]);
			} else {
				console.error("Manually input " + id + "'s " + field + " because it is " + data[id][field]);
			}
		}
	});
}

Object.keys(data).forEach((id) => {
	if ((n = data[id].given_name)) {
		/*this regex checks capitalization because Abodi orArodi should get flagged bc theres clearly a missing space. 
        Also it allows for periods after middle initials and leading/trailing whitespace even though in the end they'll be stripped */
		if (/^\s*[a-zA-Z][a-z]+( [A-Za-z](.|[a-z]*))*\s*$/.test(n)) {
			const namearr = n.trim().split(" "); //so namearr[0] will be the first name, and namearr[1] will be the middle name/initial or not exist, bc some records just list first name
			switch (namearr.length) {
				case 2:
					if (namearr[1].match(/[a-zA-Z]/g).length === 1) {
						//the reason for the match() is "J." should be interpreted as an initial even though it's two chars.
                        //i know match wont be null because of the regex in the if statement
						data[id]['middle_initial'] = namearr[1].match(/[a-zA-Z]/)[0].toUpperCase();
					} else {
						data[id]['middle_name'] = titleCase(namearr[1]);
					}
				case 1:
					data[id]['first_name'] = namearr[0];
					break;
				default:
					console.error("This one broke the system in the prefiltering of given_name to first_name and middle: " + id + " ||| which is listed as: " + n);
			}
		} else {
            console.error("Manually input this one's middle initial/middle_name and first name in the data json: [" + id + "] has a given_name [" + n + "]");
		}
	}
});

const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const last_names = manyToMany(data, human_names, "last_names", (str) => str.trim().match(/[a-z]/gi).join() === str);
console.log({human_names,last_names,data});