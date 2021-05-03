var XMLHttpRequest = require("xhr2");
let existingDictionaries={};
let xhrs=[];
const dictionaryNames=require('./dataStructures.json').dictionaries;
dictionaryNames.forEach((dictionaryName,i)=>{
	xhrs[i]=new XMLHttpRequest();
    xhrs[i].myDictionaryName=dictionaryName;
    xhrs[i].myIteratorValue=i;//these allow me to pass parameters to the callback
	xhrs[i].onload=restofthecode;
	xhrs[i].open('GET',"https://dev.findagravemiddleborough.ml/data/dictionaries.php?dictionary="+dictionaryName);//mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8
	xhrs[i].send();
})
function restofthecode () {
    let dictionaryName=this.myDictionaryName;
    let i=this.myIteratorValue;
    existingDictionaries[dictionaryName]=JSON.parse(this.responseText);
    if((i+1)===dictionaryNames.length){
        existingDictionaries={"prefixes":{"1":"Dr."},"suffixes":{"1":"Jr."},"ranks":{"1":"E2"},"names":{"1":"Allen","2":"Eugene"},"wars":{"1":"WW II          (1939 - 1945)"},"places":{"1":"Middleborough"},"medallions":{"1":"American Legion"},"branches":{"1":"US Navy"},"cemeteries":{"1":"Rock Cemetery    Highland Street                South Middleborough"}};
        
    }
}
