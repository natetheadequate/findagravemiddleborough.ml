/* eslint-disable no-multi-str */
//all dictionaries are presumed to have a string as the value, otherwise, the sql generated will convert everything to a string in makeJoinTable()
const data = require("./input/RockAtoPierce.json");
const dataTables=require('./info/dataTables.json');
const prefixOrSuffix=require("./info/prefixOrSuffix.json");
let sql='';
let dictionaries=[];
const writeFileSync = require("fs").writeFileSync;
dataTables.forEach(dataTable=>{
    sql+='CREATE TABLE `'+dataTable.name+'` (';
    switch(dataTable.type){
        case "dictionary": //the primary key is the columnName because that is what will be searched. Then the i will be used to find the id, then the ID to find all other data
            sql+="`i` smallint UNSIGNED NOT NULL UNIQUE,\n\
            `"+dataTable.columnName+"` varchar(250) NOT NULL UNIQUE,\n\
            PRIMARY KEY(`"+dataTable.columnName+"`));\n";
            dictionaries.push([dataTable.name,dataTable.columnName]);
            break;
        case "join":
            sql+="`id` smallint UNSIGNED NOT NULL,\n\
            `fk_"+dataTable.dictionary+"` smallint UNSIGNED NOT NULL,\n\
            PRIMARY KEY(`id`,`fk_"+dataTable.dictionary+"`),\n\
            FOREIGN KEY(`fk_"+dataTable.dictionary+"`) REFERENCES "+dataTable.dictionary+"(`i`));\n";
            break;
        case "independent":
            sql+="`id` smallint UNSIGNED NOT NULL,\n\
            `"+dataTable.name+"` "+dataTable.datatype+" NOT NULL,\n\
            PRIMARY KEY(`id`,`"+dataTable.name+"`));\n";
            break;
        default: throw new Error(dataTable.type+" is an invalid value for the 'type' key.");
    }
})
sql+=(require('./json2sql.js'))(data, dataTables, prefixOrSuffix);
writeFileSync("./output/freshsql.sql", sql); //this runs when the last dictionary has been added