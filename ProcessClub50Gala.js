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

const EventName = "50m Club Gala";
const EventDate = "09/12/2019"
const EventCode = "2F99178F-BF8A-4EC2-BC6E-162B4DF5898A"
const timingsCSV = "50mGalaDec2019.csv"

const EventLocation = "Roe Valley leisure Centre"
const EventPoolSize = "25";

var unmappedSwimmers = [];

var events = [];
//Create fresh import file
var output = fs.openSync('ImportSwimTimes.csv', 'w+');
fs.writeSync(output, "SE Number,Date,Pool Size,Swim Distance,Stroke,Time,Split Time 1,Split Distance 1,Split Time 2,Split Distance 2,Split Time 3,Split Distance 3,Split Time 4,Split Distance 4,Split Time 5,Split Distance 5,Position,Relay,Event Number,Round Code,Gala (event ID),Location,Licenced,Licence Level\n")


// First import Swim Ireland Mappings into program
console.log("Loading in Swim Ireland mapping file")
const SI_Mappings_Input = fs.readFileSync('LASC_SI.txt').toString().split("\n");

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

const strokes = ["Back", "Breast", "Fly", "Free", "IM"]

const strokes_to_column = {
//    "IM1": 1,
    "Back": 1,
    "Breast": 4,
    "Fly": 7,
    "Free": 10
    ,"IM": 13
}

strokes.forEach(stroke => {
    console.log("Processing", stroke, "times")
    Timings_Input.forEach(reportLine => {

        //console.log("++", reportLine);
        reportLineArray = reportLine.split(',');    

        if(reportLineArray[strokes_to_column[stroke]].includes(" metre " + stroke)) {
            console.log("Detected group of times for", reportLineArray[strokes_to_column[stroke]])
            currEvent = (stroke == ("IM")) ? "Medley" : stroke;
            currDistance = reportLineArray[strokes_to_column[stroke]].split(" ")[0];
            return;
        }

        if(reportLineArray[0].match(/Fastest Time/)) return;
        if(reportLineArray[0].match(/Club Record/)) return;

        if(reportLineArray[strokes_to_column[stroke]].match(/[0-9]{2}.[0-9]{2}/)) {
            //console.log("Time", formatTime(reportLineArray[strokes_to_column[stroke]]))
            SwimmerName = reportLineArray[0].trim();
            if(!SI_Mappings_JSON.hasOwnProperty(SwimmerName)) {
                currentSINumber = "";
                console.log("+++++++++ Can't map", SwimmerName)
                unmappedSwimmers.push(SwimmerName);
                return;
            }
            else {
                console.log("Processing times for", SwimmerName);
                currentSINumber = SI_Mappings_JSON[SwimmerName];
            }
            fs.writeSync(output, currentSINumber.trim());
            fs.writeSync(output, ",");

            fs.writeSync(output, EventDate); //Date
            fs.writeSync(output, ",");

            fs.writeSync(output, EventPoolSize); //Pool Size
            fs.writeSync(output, ","); 

            fs.writeSync(output, currDistance); //Distance
            fs.writeSync(output, ",");

            fs.writeSync(output, currEvent); //Stroke
            fs.writeSync(output, ",");

            fs.writeSync(output, formatTime(reportLineArray[strokes_to_column[stroke]])); //Time
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
            fs.writeSync(output, EventLocation); //Location
            fs.writeSync(output, ","); 
            fs.writeSync(output, ","); //Licensed
            fs.writeSync(output, "\n"); //Licensed Level
        }
    
    })    
})


fs.closeSync(output);

console.log("Timings file generated")

console.log("Unmapped Swimmers", unmappedSwimmers)