var express = require('express');
var router = express.Router();
const meetingService = require('../service/meeting.service');
var moment = require('moment-timezone')

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

router.post('/create_meeting', async function (req, res, next) {
    //     meetingService.createMeeting()
    // res.json({akhil:"response"})
    console.log(req.body)
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token.json';

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), listEvents);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            console.log(code)
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        var event = {
            'summary': req.body.topic,
            'location': req.body.location,
            'description': req.body.description,
            'start': {
                'dateTime': req.body.startDateTime,
                'timeZone': req.body.startTimeZone,
            },
            'end': {
                'dateTime': req.body.endDateTime,
                'timeZone': req.body.endTimeZone,
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
            ],
            'attendees': [
                { 'email': req.body.sendToEmail },
                //   {'email': 'akhil.bp@enfintechnologies.com'},
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };
        console.log(event, "event")
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            } else {

                console.log('Event created: %s', event.summary);
                let meeting = {
                    UserID: req.body.userID,
                    topic: req.body.topic,
                    agenda: req.body.description,
                    meeting_date: req.body.startDateTime,
                    meeting_start_time: req.body.startDateTime,
                    meeting_duration: "02:30",
                    time_zone: req.body.startTimeZone
                }
                let saveMeeting = meetingService.createMeeting(meeting);
                res.json({ success: 1, saveMeeting: saveMeeting })
            }
        });
        //   calendar.events.list({
        //     calendarId: 'primary',
        //     timeMin: (new Date()).toISOString(),
        //     maxResults: 10,
        //     singleEvents: true,
        //     orderBy: 'startTime',
        //   }, (err, res) => {
        //     if (err) return console.log('The API returned an error: ' + err);
        //     const events = res.data.items;
        //     if (events.length) {
        //       console.log('Upcoming 10 events:');
        //       events.map((event, i) => {
        //         const start = event.start.dateTime || event.start.date;
        //         console.log(`${start} - ${event.summary}`);
        //       });
        //     } else {
        //       console.log('No upcoming events found.');
        //     }
        //   });

    }

    //   function insertEvent(){


    //   }
})
router.post('/get_meeting', async function (req, res, next) {
    let meetings = await meetingService.getAllMeeting({ UserID: req.body.id })
    res.json({ response: meetings })
})

router.get('/temp', async function (req, res, next) {
    // let today = Date.now()
    // const utc = moment('27 Jan 2019').utc().format();
    // let local = moment.utc(utc).local()
    // console.log(local)
  
    
    var a = moment.tz("2019-02-26 04:17", "Asia/Taipei");
    var b = moment.tz("2019-02-26 04:17", "America/Toronto");
    
    var c = a.format(); // 2013-11-18T19:55:00+08:00
    var d = b.format(); // 2013-11-18T06:55:00-05:00
    
    var e = a.utc().format(); // 2013-11-18T11:55Z
    var f = b.utc().format(); // 2013-11-18T11:55Z
            let result = {
                a: a,
                b: b,
                c:c,
                d:d,
                e:e,
                f:f
            }
    res.json({ res: result })
})

module.exports = router;