const GoogleHome = require('node-googlehome');
const express    = require("express");
const Config     = require("./config.json");
const path       = require("path");
const ip = require("ip");

let ttsServer        = express();
let GoogleHomeIP     = false;
let GoogleHomeDevice = false;
GoogleHomeIP         = Config.GoogleHomeIp;

ttsServer.set("view engine", "pug");
ttsServer.set("views", path.join(__dirname, "views"));
ttsServer.use('/files',express.static(path.join(__dirname, 'mp3')));

if(GoogleHomeIP !== undefined)
{
    GoogleHomeDevice = new GoogleHome.Connecter(GoogleHomeIP);
    GoogleHomeDevice.config({ lang: Config.GoogleHomelang });
    console.log('Google Home device detected as: ' + GoogleHomeIP);
}

const middleware = (req, res, next) => {

    if(req.params.secretKey === Config.SecretKey)
    {
        next();
    }
    else
    {
        return res.send(403, 'No way Jose!');
    }
};

ttsServer.get('/', function (req, res) {
    res.render("homepage", {
        GoogleHomeIP:  GoogleHomeIP,
        WebserverPort: Config.WebserverPort,
        SecretKey:     Config.SecretKey,
        IP:            ip.address()
    });
});

ttsServer.get('/:secretKey/:announceType/*', middleware, function (req, res)
{
    if(GoogleHomeIP)
    {
        let textToSpeech = req.params[ 0 ];
        res.send('Value to play: ' + textToSpeech);

        switch (req.params.announceType)
        {
            default:
            case "tts":
                GoogleHomeDevice.readySpeaker().then(() => {
                    GoogleHomeDevice.speak(textToSpeech)
                        .then(console.log('Done playing ' + textToSpeech))
                        .catch(console.log)
                });
                break;
            case "mp3":
                GoogleHomeDevice.readySpeaker().then(() => {
                    GoogleHomeDevice.playMedia('http://' + ip.address() +':'+Config.WebserverPort+'/files/' + textToSpeech)
                        .then(console.log('Done playing ' + textToSpeech))
                        .catch(console.log)
                });
                break;
            case "mp3url":
                GoogleHomeDevice.readySpeaker().then(() => {
                    GoogleHomeDevice.playMedia(textToSpeech)
                        .then(console.log('Done playing ' + textToSpeech))
                        .catch(console.log)
                });
                break;
        }
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
