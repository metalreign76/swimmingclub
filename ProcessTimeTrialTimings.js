'use strict';
const fs = require('fs');

function formatTime(time) {
    var baseTime = time.slice(0,-1).trim();
    if(baseTime.indexOf(":") == -1) {
        return "00:" + baseTime;
    }
    else
        return "0" + baseTime;
}
const EventName = "Spring Lisburn";
const EventDate = "01/02/2019"
const EventCode = "5BB536A0-7777-465F-9E4A-0C5B4BF51653"
const timingsCSV = "spring.csv"
const EventPoolSize = "50";

var events = [];
//Create fresh import file
var output = fs.openSync('ImportSwimTimes.csv', 'w+');
fs.writeSync(output, "SE Number,Date,Pool Size,Swim Distance,Stroke,Time,Split Time 1,Split Distance 1,Split Time 2,Split Distance 2,Split Time 3,Split Distance 3,Split Time 4,Split Distance 4,Split Time 5,Split Distance 5,Position,Relay,Event Number,Round Code,Gala (event ID),Location,Licenced,Licence Level\n")


// First import Swim Ireland Mappings into program
console.log("Loading in Swim Ireland mapping file")
const SI_Mappings_Input = fs.readFileSync('LASC_SI.csv').toString().split("\n");

var SI_Mappings_JSON = {};

SI_Mappings_Input.forEach(mapping => {
    if(mapping.split(',')[0].length)
        SI_Mappings_JSON[mapping.split(',')[0]] = mapping.split(',')[1];
})


console.log("Now loading in Timings file")
const Timings_Input = fs.readFileSync(timingsCSV).toString().split("\n");
console.log("Beginning to process Timings file");

var reportLineArray;
var SwimmerName;
var currentSINumber;
var currDistance;
var currEvent
var eventArray;

Timings_Input.forEach(reportLine => {
    reportLineArray = reportLine.split(',');

    if(reportLineArray[2]) {
        SwimmerName = reportLineArray[2].slice(0, reportLineArray[2].indexOf('(')).trim();
        if(!SI_Mappings_JSON.hasOwnProperty(SwimmerName)) {
            currentSINumber = "";
            console.log("Can't map", SwimmerName)
        }
        else {
            console.log("Processing times for", SwimmerName);
            currentSINumber = SI_Mappings_JSON[SwimmerName];
        }
    }

    if(((reportLineArray[8] == 'M')||(reportLineArray[8] == 'F'))&&(reportLineArray[5] != "DQ")) {
            fs.writeSync(output, currentSINumber.trim());
            fs.writeSync(output, ",");

            fs.writeSync(output, EventDate); //Date
            fs.writeSync(output, ",");

            fs.writeSync(output, EventPoolSize); //Pool Size
            fs.writeSync(output, ","); 

            fs.writeSync(output, reportLineArray[13].split(' ')[3]); //Distance
            fs.writeSync(output, ",");

            fs.writeSync(output, reportLineArray[13].split(' ')[4] == 'IM' ? 'Medley' : reportLineArray[13].split(' ')[4]); //Stroke
            fs.writeSync(output, ",");

            fs.writeSync(output, formatTime(reportLineArray[1])); //Time
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

            fs.writeSync(output, EventCode); //Gala
            fs.writeSync(output, ",");
            fs.writeSync(output, ","); //Location
            fs.writeSync(output, ","); //Licensed
            fs.writeSync(output, "\n"); //Licensed Level
    }

})

fs.closeSync(output);

console.log("Timings file generated")