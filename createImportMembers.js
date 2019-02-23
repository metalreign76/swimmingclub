'use strict';

const excelParser = require('convert-excel-to-json');
const fs = require('fs');

const loadedMembers = excelParser({
    sourceFile: 'C:/Users/clyde/Downloads/ClubMembers.xlsx',
    header:{
        rows: 1
    },
    columnToKey: {
        '*': '{{columnHeader}}'
    }
});

function writeOutHeader(fd) {

    var headerStr = "";
    headerStr += "Member ID,"
    headerStr += "SE Number,";
    headerStr += "SE Category,";
    headerStr += "Date Joined Club,";
    headerStr += "First Name,";
    headerStr += "Known As,";
    headerStr += "Last Name,";
    headerStr += "DOB,";
    headerStr += "Gender,";
    headerStr += "Address 1,";
    headerStr += "Address 2,";
    headerStr += "Address 3,";
    headerStr += "Address 4,";
    headerStr += "Address 5,";
    headerStr += "Postcode,";
    headerStr += "Home Phone,";
    headerStr += "Mobile Phone,";
    headerStr += "Email,";
    headerStr += "Login Username,";
    headerStr += "Login Password,";
    headerStr += "Club Role,";
    headerStr += "In Who's Who,";
    headerStr += "Job Title,";
    headerStr += "Committee Member,";
    headerStr += "Coach,";
    headerStr += "Parent,";
    headerStr += "Swimmer,";
    headerStr += "Active,";
    headerStr += "Receives Group Invoices,";
    headerStr += "Receives Session Invoices,";
    headerStr += "Custom Field Group,";
    headerStr += "Emergency Contact 1,";
    headerStr += "Emergency Phone 1,";
    headerStr += "Emergency Contact 2,";
    headerStr += "Emergency Phone 2,";
    headerStr += "Medical History,";
    headerStr += "Allergies,";
    headerStr += "Disability Details,";
    headerStr += "Notes,";
    headerStr += "Payment Method,";
    headerStr += "Doctor,";
    headerStr += "Doctor Address,";
    headerStr += "Doctor Phone,";
    headerStr += "Club Groups,";
    headerStr += "Club Sessions,";
    headerStr += "Date Left,";
    headerStr += "School Attended,";
    headerStr += "Swims For Other Club,";
    headerStr += "Consent Image Use,";
    headerStr += "Consent Video Use,";
    headerStr += "Loco Parentis Rights,";
    headerStr += "Ethnicity,";
    headerStr += "Consent To Travel,";
    headerStr += "DBS Date,";
    headerStr += "DBS Renewal Date,";
    headerStr += "DBS Certificate Number,";
    headerStr += "Competitive Diving Passed,";
    headerStr += "Details Confirmed Correct\n";

    fs.writeSync(fd, headerStr);
}

function writeOutRecord(fd, memberObject) {

    var recordStr = "";

    recordStr += "," //Member ID,
    recordStr += "," //SE Number,
    recordStr += "," //SE Category,
    recordStr += "," //Date Joined Club,
    recordStr += memberObject.firstName + "," //First Name,
    recordStr += memberObject.firstName + "," //Known As,
    recordStr += memberObject.surname + "," //Last Name,
    recordStr += "," //DOB,
    recordStr += "," //Gender,
    recordStr += "," //Address 1,
    recordStr += "," //Address 2,
    recordStr += "," //Address 3,
    recordStr += "," //Address 4,
    recordStr += "," //Address 5,
    recordStr += "," //Postcode,
    recordStr += "," //Home Phone,
    recordStr += "," //Mobile Phone,
    recordStr += memberObject.email1 + "," //Email,
    recordStr += memberObject.email1 + "," //Login Username,
    recordStr += "," //Login Password,
    recordStr += "," //Club Role,
    recordStr += "," //In Who's Who,
    recordStr += "," //Job Title,
    recordStr += "," //Committee Member,
    recordStr += "," //Coach,
    recordStr += "," //Parent,
    recordStr += "," //Swimmer,
    recordStr += "," //Active,
    recordStr += "," //Receives Group Invoices,
    recordStr += "," //Receives Session Invoices,
    recordStr += "," //Custom Field Group,
    recordStr += "," //Emergency Contact 1,
    recordStr += "," //Emergency Phone 1,
    recordStr += "," //Emergency Contact 2,
    recordStr += "," //Emergency Phone 2,
    recordStr += "," //Medical History,
    recordStr += "," //Allergies,
    recordStr += "," //Disability Details,
    recordStr += "," //Notes,
    recordStr += "," //Payment Method,
    recordStr += "," //Doctor,
    recordStr += "," //Doctor Address,
    recordStr += "," //Doctor Phone,
    recordStr += "," //Club Groups,
    recordStr += "," //Club Sessions,
    recordStr += "," //Date Left,
    recordStr += "," //School Attended,
    recordStr += "," //Swims For Other Club,
    recordStr += "," //Consent Image Use,
    recordStr += "," //Consent Video Use,
    recordStr += "," //Loco Parentis Rights,
    recordStr += "," //Ethnicity,
    recordStr += "," //Consent To Travel,
    recordStr += "," //DBS Date,
    recordStr += "," //DBS Renewal Date,
    recordStr += "," //DBS Certificate Number,
    recordStr += "," //Competitive Diving Passed,
    recordStr += "\n" //Details Confirmed Correct

    fs.writeSync(fd, recordStr);
}

const convertedFile = fs.openSync('convertedFile.csv', 'w');

var membersCount = 0;
var allMembers = [];

loadedMembers.ClubMembers.forEach(family => {
    var firstNames = family["Given Name"].split('&');
    var familyRecords = firstNames.map((firstName) => {
        return {
            firstName: firstName,
            surname: family["Family Name"],
            email1: family["E-mail 1 - Value"],
            email2: family["E-mail 2 - Value"] ? family["E-mail 2 - Value"] : null,
            category: family["Group Membership"]
        }
    })

    familyRecords.forEach((record) => {
        allMembers.push(record);
        membersCount++;
        console.log(membersCount, record);
    })
});

writeOutHeader(convertedFile);
allMembers.forEach(member => {
    writeOutRecord(convertedFile, member);
})

fs.close(convertedFile);