'use strict';
const fs = require('fs');

var events = [];
//Create fresh import file
var output = fs.openSync('ImportSwimTimes.csv', 'w+');
fs.writeSync(output, "SE Number,Date,Pool Size,Swim Distance,Stroke,Time,Split Time 1,Split Distance 1,Split Time 2,Split Distance 2,Split Time 3,Split Distance 3,Split Time 4,Split Distance 4,Split Time 5,Split Distance 5,Position,Relay,Event Number,Round Code,Gala (event ID),Location,Licenced,Licence Level\n")

//Create fresh events file
var eventFS = fs.openSync('newEvents.csv', 'w+');


// First import Swim Ireland Mappings into program
console.log("Loading in Swim Ireland mapping file")
const SI_Mappings_Input = fs.readFileSync('LASC_SI.csv').toString().split("\n");

var SI_Mappings_JSON = {};

SI_Mappings_Input.forEach(mapping => {
    if(mapping.split(',')[0].length)
        SI_Mappings_JSON[mapping.split(',')[0]] = mapping.split(',')[1];
})

console.log("Now loading in Timings file")
const Timings_Input = fs.readFileSync('swimTimesAsOfFeb2019.csv').toString().split("\n");
console.log("Beginning to process Timings file");

var reportLineArray;
var SwimmerName;
var currentSINumber;

Timings_Input.forEach(reportLine => {
    reportLineArray = reportLine.split(',');
    if(reportLineArray[33] == 'LVADY') {
        SwimmerName = reportLineArray[1].split('(')[0].trim();
        if(!SI_Mappings_JSON.hasOwnProperty(SwimmerName)) {
            console.log("Cant map", SwimmerName)
            currentSINumber = "";
        }
        else {
            console.log("Processing times for", SwimmerName);
            currentSINumber = SI_Mappings_JSON[SwimmerName];
        }
    }

    if(reportLineArray[1] && reportLineArray[1].trim().match(/^([0-9]{0,2}.[0-9]{1,2}.[0-9]{2})$/)) {

        if(currentSINumber.length) // valid Swimmer
        {
            fs.writeSync(output, currentSINumber.trim());
            fs.writeSync(output, ",");

            fs.writeSync(output, reportLineArray[24]); //Date
            fs.writeSync(output, ",");

            fs.writeSync(output, reportLineArray[3] == 'S' ? '25' : '50'); //Pool Size
            fs.writeSync(output, ","); 

            fs.writeSync(output, reportLineArray[14]); //Distance
            fs.writeSync(output, ",");

            fs.writeSync(output, reportLineArray[18] == 'IM' ? 'Medley' : reportLineArray[18]); //Stroke
            fs.writeSync(output, ",");

            fs.writeSync(output, reportLineArray[1]); //Time
            fs.writeSync(output, ",");

            fs.writeSync(output, ","); //Split Time 1
            fs.writeSync(output, ","); //Split Distance 1
            fs.writeSync(output, ","); //Split Time 2
            fs.writeSync(output, ","); //Split Distance 2
            fs.writeSync(output, ","); //Split Time 3
            fs.writeSync(output, ","); //Split Distance 3
            fs.writeSync(output, ","); //Split Time 4
            fs.writeSync(output, ","); //Split Distance 4
            fs.writeSync(output, ","); //Split Time 5
            fs.writeSync(output, ","); //Split Distance 5
            fs.writeSync(output, ","); //Position
            fs.writeSync(output, "No,"); //Relay
            fs.writeSync(output, ","); //Event Number
            fs.writeSync(output, ","); //Round Code

            fs.writeSync(output, reportLineArray[29]); //Gala
            fs.writeSync(output, ",");
            if(!events.includes(reportLineArray[29])) {
                events.push(reportLineArray[29]);
                fs.writeSync(eventFS, reportLineArray[29])
                fs.writeSync(eventFS, ',')
                fs.writeSync(eventFS, reportLineArray[24])
                fs.writeSync(eventFS, ',')
                fs.writeSync(eventFS, reportLineArray[3] == 'S' ? '25' : '50')
                fs.writeSync(eventFS, '\n')
            }

            fs.writeSync(output, ","); //Location
            fs.writeSync(output, ","); //Licensed
            fs.writeSync(output, "\n"); //Licensed Level
        }     
    }   
})

fs.closeSync(output);
fs.closeSync(eventFS);

console.log("Timings file generated")