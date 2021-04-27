const data = require("./RockAtoPierce.json");
 /* looks like this
 {
    "0": {
      "last_name": "ALLEN", 
*/
function splitWarnTrim(str,delimiter){
    let arr=str.split(delimiter);
    if(arr.length>1){console.warn(str+'interpreted as'+arr.toString())}
    return arr;
}
function sanitize(str) {
    let capitalizenextletter = true;
    let strarr = str.split('');
    let newstr = '';
    strarr.forEach((c, i) => {
        if (capitalizenextletter) {
            newstr += c.toUpperCase();
        } else {
            newstr += c.toLowerCase();
        }
        if (c == ' ' || c == '/') {
            capitalizenextletter = true;
        } else {
            capitalizenextletter = false;
        }
    })
    /* if((finalstr=newstr.match(/[a-zA-z\-0-9 é]/g).join('').trim())!==newstr.trim()){
        console.warn(newstr+" was turned into "+finalstr);
    } */ //this code was because i was worried about prefixes and middle initials having a period after them, thus messing things up. Ill deal with it elsewhere
    return newstr.trim();
}

/*
the data is the object of all the fields, the dictionary is array of names, the field is the property of the data object being read
returns an array of arrays-with-length-2 that consist of ids (unique grave identifier from the toplevel keys of the data object) and the integer representation of a name
One id may be repeated in this because sometimes the last name isn't known and could be one of two options
Eg if human_names (a dictionary) has ["Allen","Allan"...], and grave id 0 is unclear between the two, then [[0,0],[0,1]] will be returned
*/
function manytomany(data,dictionary,field){//DO NOT USE IF THE FIELD VALUE COULD BE FALSY
    resultarr=[];
    Object.keys(data).forEach(id=>{
        if(data[id][field]){
            const names=splitWarnTrim(data[id][field]);
            names.forEach(n=>{
                const name=sanitize(n);
                if(dictionary.indexOf(name)===-1){
                    dictionary.push(name);
                }
                resultarr.push([id,dictionary.indexOf(name)]);
            })
            
        }
    })
}


let human_names = [];
let prefixes=[];
let suffixes=[];

Object.keys(data).forEach(id=>{
    if(n=data[id].given_name){
        const namearr=n.split(' ');
        switch(namearr.length){
            case 2:if(namearr[1].match.length>1){

            }
            case 1:data[id].first_name=namearr[0];break;
            console.error("Manually input this one's given name: "+id+" ||| which is listed as: "+n);
        }else{
            if(namearr==1){

            }
        }
    }
})




const last_names=manytomany(data,human_names,last_names);
console.log(last_names);