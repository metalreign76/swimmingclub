'use strict';

require('dotenv').config()

const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

//Create fresh import file
var output = fs.openSync('MasterEventsList.csv', 'w+');


// // First import Swim Ireland Mappings into program
// console.log("Loading in Events file")
// const eventsArray = fs.readFileSync('newEvents.csv').toString().split("\n");


axios.defaults.baseURL = process.env.SWIMCLUBMANAGERAPI;
axios.defaults.headers.common['Authorization-Token'] = process.env.SWIMCLUBMANAGERTOKEN;

// eventsArray.forEach(event => {
//     var eventDetails=event.split(',');
//     var eventDate = moment(eventDetails[1], 'DD/MM/YYYY'); 
//     axios.post('/ClubEvents', {
//         EventTitle: eventDetails[0],
//         EventStartDate: eventDate.format('YYYY-MM-DD'),
//         EventStartTime: '00:00:00',
//         EventEndDate: eventDate.format('YYYY-MM-DD'),
//         EventEndTime: '00:00:00',
//         Pool: eventDetails[2]
//     })
//     .then(result => {
//         console.log(eventDetails[0], 'created')
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

    axios.get('/ClubEvents')
    .then(result => {
        console.log('Returns', result)
        var tmpStr;
        result.data.forEach(event => {
            console.log("Event:", event)
            tmpStr = event.EventTitle + ',' + event.Guid + '\n';
            fs.writeSync(output, tmpStr)
        })
        fs.closeSync(output)
    })
    .catch(err => {
        console.log(err)
    })

