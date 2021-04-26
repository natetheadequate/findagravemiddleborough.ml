let data = require("./RockAtoPierce.json");
//ok i don't really know if i should be adding the indexes after the 
function addindexes(arr){
    let newarr=[];
    arr.forEach((e,i)=>{

    }
}
function splitname(str){
    str.split(' or ')
}
function titleCase(str) {
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
    return newstr;
}
let human_names = [];//make this like {0:'Allen',1:'Atwood',...} //actually we could just json parse this as an array
Object.keys(data).forEach((key)=>{
    if (data[key].last_name !== '') {
        const name=titleCase(data[key].last_name);
        if (human_names.indexOf(name) == -1) {
            human_names.push(name);
            data[key].last_name=human_names.indexOf(name)
        }
    }
});
console.log(data);