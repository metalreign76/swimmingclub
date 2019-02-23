'use strict';

const fs = require('fs');

//Create fresh import file
var output = fs.openSync('updateSI_Numbers.csv', 'w+');

console.log("Loading in Swim Ireland mapping file")
const SI_Mappings_Input = fs.readFileSync('LASC_SI.csv').toString().split("\n");

SI_Mappings_Input.forEach(record => {
    fs.writeSync(output, record.split(',')[0].split(' '[0]));
    fs.writeSync(output, ',');
    fs.writeSync(output, record.split(',')[0].split(' '[1]));
    fs.writeSync(output, ',');
    fs.writeSync(output, record.split(',')[1]);
    fs.writeSync(output, '\n');
})

fs.closeSync(output);
