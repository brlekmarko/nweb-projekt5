const express = require("express");
const app = express(); // create express app
const path = require("path");
const webpush = require('web-push');
const fs = require('fs');

let numOfPictures = 0;
let subscriptions = [];
const SUBS_FILENAME = 'subscriptions.json';


try{
  subscriptions = JSON.parse(fs.readFileSync(SUBS_FILENAME));
}
catch(e){
  console.log(e);
}

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

app.post("/saveSubscription", function(req, res) {
  let sub = req.body.sub;
  subscriptions.push(sub);
  fs.writeFileSync(SUBS_FILENAME, JSON.stringify(subscriptions));
  res.json({
    success: true
  });
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
