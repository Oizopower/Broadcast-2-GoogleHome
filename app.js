const express    = require("express");
const Config     = require("./config.json");
const path       = require("path");
const ip         = require("ip");

const googleTTS = require('google-tts-api');
const Client                = require('castv2-client').Client;
const DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;

let ttsServer        = express();
let GoogleHomeIP     = false;
GoogleHomeIP         = Config.GoogleHomeIp;

ttsServer.set("view engine", "pug");
ttsServer.set("views", path.join(__dirname, "views"));
ttsServer.use('/files',express.static(path.join(__dirname, 'mp3')));

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

                var url = googleTTS.getAudioUrl(textToSpeech, {
                  lang: Config.Language,
                  slow: false,
                  host: 'https://translate.google.com',
                })

                for (i = 0; i < GoogleHomeIP.length; i++)
                {
                    let client = new Client();
                    client.connect(GoogleHomeIP[i], function ()
                    {
                        client.launch(DefaultMediaReceiver, function (err, player) {
                            var media = {
                              contentId:   url,
                              contentType: 'audio/mp3',
                              streamType:  'BUFFERED'
                            };

                            player.load(media, { autoplay: true }, function (err, status) {
                                player.on('status', function (status) {
                                    if(status.playerState == "IDLE")
                                    {
                                        player.stop();
                                        client.close();
                                    }
                                });
                            });
                        })
                    })
                }

            break;
            case "mp3":
            case "mp3url":
                for (i = 0; i < GoogleHomeIP.length; i++)
                {
                    let client = new Client();
                    client.connect(GoogleHomeIP[i], function ()
                    {
                        client.launch(DefaultMediaReceiver, function (err, player) {
                            var media = {
                              contentId:   textToSpeech,
                              contentType: 'audio/mp3',
                              streamType:  'BUFFERED'
                            };

                            player.load(media, { autoplay: true }, function (err, status) {
                                player.on('status', function (status) {
                                    if(status.playerState == "IDLE")
                                    {
                                        player.stop();
                                        client.close();
                                    }
                                });
                            });
                        })
                    })
                }
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
