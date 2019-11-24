const GoogleHome = require('node-googlehome');
const express    = require("express");
const Config     = require("./config.json");

let ttsServer        = express();
let GoogleHomeIP     = false;
let GoogleHomeDevice = false;
GoogleHomeIP         = Config.ip;

if(GoogleHomeIP !== undefined)
{
    GoogleHomeDevice = new GoogleHome.Connecter(GoogleHomeIP);
    GoogleHomeDevice.config({ lang: Config.GoogleHomelang });
    console.log('Google Home device detected as: ' + GoogleHomeIP);
}

ttsServer.get('/', function (req, res) {
    let bodyContent = (GoogleHomeIP ? "Google Home found at " + GoogleHomeIP : "Cannot find Google Home IP");
    bodyContent += "<br>Use the webserver as /tts/example";

    res.send(bodyContent);
});

ttsServer.get('/tts/*', function (req, res) {

    if(GoogleHomeFound)
    {
        let textToSpeech = req.params[ 0 ];
        res.send('Text to speech: ' + textToSpeech);

        GoogleHomeDevice.speak(textToSpeech)
            .then(console.log('Done playing ' + textToSpeech))
            .catch(console.log)
    }
    else
    {
        res.send('Google Home device not found.');
        console.log('Google Home device not found.');
    }
});

ttsServer.get('/media/*', function (req, res) {

    if(GoogleHomeFound)
    {
        let mediaUrl = req.params[ 0 ];
        res.send('Text to speech: ' + mediaUrl);

        GoogleHomeDevice.playMedia(mediaUrl)
            .then(console.log('Done playing ' + mediaUrl))
            .catch(console.log)
    }
    else
    {
        res.send('Google Home device not found.');
        console.log('Google Home device not found.');
    }

});

ttsServer.listen(Config.WebserverPort, function () {
    console.log('Webserver ready to go at port: ' + Config.WebserverPort);
});
