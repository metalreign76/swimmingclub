'use strict';
const fs = require('fs');

function formatTime(time) {
    var baseTime = time.trim();
    var timeArray = baseTime.split(".");
    if(timeArray.length === 3) 
        baseTime = timeArray[0] + ":" + timeArray[1] + "." + timeArray[2];

    if((timeArray.length === 2)&&(timeArray[0] > 59))
     {
        var minutes = timeArray[0] / 60;
        var seconds = timeArray[0] % 60;
        if(seconds < 10) seconds = "0" + seconds;
        baseTime = "0" + minutes.toFixed(0) + ":" + seconds + "." + timeArray[1];
    } 

    switch(baseTime.indexOf(":")) {
        case -1: baseTime = "00:" + baseTime; break;
        case 1: baseTime = "0" + baseTime; break;
        default: baseTime = baseTime;
    }
    timeArray = baseTime.split(".");
    if(timeArray.length === 1) 
        baseTime = baseTime + ".00";
    else {
        if(timeArray[1].length === 1)
           baseTime = baseTime + "0";
    }

    return baseTime;

}

const EventName = "LASC vs Armagh (PTL)";
const EventDate = "28/09/2019"
const EventCode = "332257F2-4A13-4520-88EF-46D3C4ACDF67"
const timingsCSV = "PTL_ARMGH.csv"

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

    if(reportLineArray[0].match(/^Event #/)) {
        eventArray = reportLineArray[0].split(' ');
        currDistance = eventArray[7];
        currEvent = eventArray[8];
        console.log("Event:", currEvent, "Distance:", currDistance);
    }

    if((reportLineArray[6] == 'F')||(reportLineArray[6] == 'M')) {
        SwimmerName = reportLineArray[10].slice(0,-1).trim() + " " +
                        reportLineArray[9].slice(1,999).trim();
        if(!SI_Mappings_JSON.hasOwnProperty(SwimmerName)) {
            currentSINumber = "";
            console.log("Can't map", SwimmerName)
        }
        else {
            console.log("Processing times for", SwimmerName);
            currentSINumber = SI_Mappings_JSON[SwimmerName];
            fs.writeSync(output, currentSINumber.trim());
            fs.writeSync(output, ",");

            fs.writeSync(output, EventDate); //Date
            fs.writeSync(output, ",");

            fs.writeSync(output, '25'); //Pool Size
            fs.writeSync(output, ","); 

            fs.writeSync(output, currDistance); //Distance
            fs.writeSync(output, ",");

            fs.writeSync(output, currEvent== 'IM' ? 'Medley' : currEvent); //Stroke
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
    }

})

fs.closeSync(output);

console.log("Timings file generated")