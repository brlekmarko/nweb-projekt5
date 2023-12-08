const express = require("express");
const app = express(); // create express app
const path = require("path");
const webpush = require('web-push');
const fs = require('fs');
const bodyParser = require('body-parser');

let numOfPictures = 0;
let subscriptions = [];
const SUBS_FILENAME = 'subscriptions.json';


const vapidKeys = webpush.generateVAPIDKeys();

async function sendPushNotifications(numOfPictures) {

  webpush.setVapidDetails('mailto:ime.prezime@fer.hr',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  subscriptions.forEach(async sub => {
    try
    {
      await webpush.sendNotification(sub, JSON.stringify({
        title: 'Picture count incremented!',
        body: 'There is now a total of ' + numOfPictures + ' pictures on the server!',
        redirectUrl: '/'
      }));
    } catch (error) {
      console.error(error);
    }
  });
}

//cors
const cors = require("cors");
app.use(cors());

app.get("/numberOfPictures", function(req, res) {
  res.json({
    numOfPictures: numOfPictures
  });
});

app.post("/incrementNumberOfPictures", function(req, res) {
  numOfPictures++;
  sendPushNotifications(numOfPictures);
  console.log("Number of pictures incremented to " + numOfPictures);
  res.json({
    success: true
  });
});

app.get("/publicVapidKey", function(req, res) {
  res.json({
    publicKey: vapidKeys.publicKey
  });
}
);

app.post("/saveSubscription", bodyParser.json(),
function(req, res) {
  let sub = req.body.subscription;
  subscriptions.push(sub);
  fs.writeFileSync(SUBS_FILENAME, JSON.stringify(subscriptions));
  res.sendStatus(200);
});





app.use(express.static(path.join(__dirname, "..", "build")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
  sendPushNotifications(numOfPictures);
});

