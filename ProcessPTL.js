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

const EventName = "Limavady vs Templemore (Aquasprint)";
const EventDate = "22/02/2020"
const EventCode = "88326148-6C10-4093-94CC-75C9C6CF25D0"
const timingsCSV = "templemore.csv"

const EventLocation = "Roe Valley Leisure Centre"

var columnPlus = 0  // Home
//var columnPlus = 4 //Away

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

var Strokes = [
    "MEDLEY TEAM RELAY", 
    "MEDLEY RELAY", 
    "FREESTYLE", 
    "FRONTCRAWL", 
    "FRONT CRAWL", 
    "BACKSTROKE", 
    "BREASTSTROKE", 
    "BUTTERFLY", 
    "FREESTYLE TEAM RELAY", 
    "FREESTYLE RELAY",
    "INDIVIDUAL MEDLEY"
]
var StrokesToHytekStrokes = {
    "FREESTYLE": "Free", 
    "FRONTCRAWL": "Free", 
    "FRONT CRAWL": "Free", 
    "BACKSTROKE": "Back", 
    "BREASTSTROKE": "Breast", 
    "BUTTERFLY": "Fly",
    "MEDLEY TEAM RELAY": "",
    "MEDLEY RELAY": "",
    "FREESTYLE TEAM RELAY": "",
    "FREESTYLE RELAY": "",
    "INDIVIDUAL MEDLEY": "Medley"
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

   //console.log("Checking:", reportLineArray[3])
    if(reportLineArray[3] && Strokes.includes(reportLineArray[3].toUpperCase()))
    {
        currEvent = StrokesToHytekStrokes[reportLineArray[3].toUpperCase()]
        console.log("Detected stroke:", currEvent)
    }

    if(
          (reportLineArray[2+columnPlus])
        &&(reportLineArray[4+columnPlus])
        &&(currEvent.length)
    ) {
        console.log("Processing time for", reportLineArray[2+columnPlus])
        SwimmerName = reportLineArray[2+columnPlus].trim()
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

                fs.writeSync(output, (currEvent == "Medley" ? "100" : "50")); //Distance
                fs.writeSync(output, ",");

                fs.writeSync(output, currEvent); //Stroke
                fs.writeSync(output, ",");

                fs.writeSync(output, formatTime(reportLineArray[4+columnPlus])); //Time
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


    if(
        (reportLineArray[12+columnPlus])
      &&(reportLineArray[14+columnPlus])
      &&(currEvent.length)
  ) {
      console.log("Processing time for", reportLineArray[12+columnPlus])
      SwimmerName = reportLineArray[12+columnPlus].trim()
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

              fs.writeSync(output, (currEvent == "Medley" ? "100" : "50")); //Distance
              fs.writeSync(output, ",");

              fs.writeSync(output, currEvent); //Stroke
              fs.writeSync(output, ",");

              fs.writeSync(output, formatTime(reportLineArray[14+columnPlus])); //Time
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

})

fs.closeSync(output);

console.log("Timings file generated")

console.log("Unmapped Swimmers", unmappedSwimmers)