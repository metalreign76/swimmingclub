'use strict';
const fs = require('fs');

function formatTime(time) {
    var baseTime = time.trim();
    var timeArray = baseTime.split(".");
    if(timeArray.length === 3) 
        baseTime = timeArray[0] + ":" + timeArray[1] + "." + timeArray[2];

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

const EventName = "Limavady vs Templemore (Aquasprint)";
const EventLocation = "Roe Valley Leisure Centre"
const EventDate = "22/02/2020"
const EventCode = "88326148-6C10-4093-94CC-75C9C6CF25D0"
const timingsCSV = "templemore.csv"

var unmappedSwimmers = [];

var events = [];
//Create fresh import file
var output = fs.openSync('ImportSwimTimes_lisburn.csv', 'w+');
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

var Strokes = [
    "MEDLEY TEAM RELAY", 
    "FREESTYLE", 
    "FRONTCRAWL", 
    "BACKSTROKE", 
    "BREASTSTROKE", 
    "BUTTERFLY", 
    "FREESTYLE TEAM RELAY", 
    "FREESTYLE RELAY"
]
var StrokesToHytekStrokes = {
    "FREESTYLE": "Free", 
    "FRONTCRAWL": "Free", 
    "BACKSTROKE": "Back", 
    "BREASTSTROKE": "Breast", 
    "BUTTERFLY": "Fly",
    "MEDLEY TEAM RELAY": "",
    "FREESTYLE TEAM RELAY": "",
    "FREESTYLE RELAY": ""
}

var reportLineArray;
var SwimmerName;
var currentSINumber;
var currDistance = 25;
var currEvent = "";
var eventArray;
var currClub;
var eventNumber

Timings_Input.forEach(reportLine => {
    reportLineArray = reportLine.split(',');

//    console.log("Checking:", reportLineArray[0])
    if(Strokes.includes(reportLineArray[0]))
    {
        currEvent = StrokesToHytekStrokes[reportLineArray[0]]
        console.log("Detected stroke:", currEvent)
    }

    if(
        (1 <= reportLineArray[2])
        && ( reportLineArray[2] <= 8)
        &&(reportLineArray[3] != "Swimmer")
        &&(reportLineArray[3] != "Points")
        &&(currEvent.length)
    ) {
        if(reportLineArray[1]) {
            currClub = reportLineArray[1];
        }
        if(
            (reportLineArray[0]) 
            && (1 <= parseInt(reportLineArray[0])) 
            && (parseInt(reportLineArray[0]) <= 40 )
        ) {
//            console.log("No:", reportLineArray[0])
            eventNumber = reportLineArray[0];
        }
        if(currClub === "Limavady") {
            SwimmerName = reportLineArray[3].trim()
            if(SwimmerName)  {
                console.log("Limavady Swimmer detected:", SwimmerName )
                currentSINumber = SI_Mappings_JSON[SwimmerName];
                if(currentSINumber) {
                    fs.writeSync(output, currentSINumber.trim());
                    fs.writeSync(output, ",");

                    fs.writeSync(output, EventDate); //Date
                    fs.writeSync(output, ",");

                    fs.writeSync(output, '25'); //Pool Size
                    fs.writeSync(output, ","); 

                    fs.writeSync(output, 25); //Distance
                    fs.writeSync(output, ",");

                    fs.writeSync(output, currEvent); //Stroke
                    fs.writeSync(output, ",");

                    fs.writeSync(output, formatTime(reportLineArray[5])); //Time
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
                    fs.writeSync(output, ",");  //Event Number
                    fs.writeSync(output, ","); //Round Code

                    fs.writeSync(output, EventCode); //Gala
                    fs.writeSync(output, ",");
                    fs.writeSync(output, EventLocation); //Location
                    fs.writeSync(output, ","); //Location
                    fs.writeSync(output, ","); //Licensed
                    fs.writeSync(output, "\n"); //Licensed Level
                }
                else {
                    console.log("+++++++++ Can't map", SwimmerName)
                    unmappedSwimmers.push(SwimmerName);
                }
            }
        }
    }

})

fs.closeSync(output);

console.log("Timings file generated")

console.log("Unmapped Swimmers", unmappedSwimmers)