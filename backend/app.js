const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Client = require('node-rest-client').Client;
const maps = require('@google/maps');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let client = new Client();

app.post('/getLocation', (req, res) => {
    let lo = req.body.lo;
    let la = req.body.la;
    let geocoding_api_key = 'AIzaSyC8qgYqggS3VGUdsJCd5p_foanxRsBCz3E';

    let newClient = maps.createClient({
        key: geocoding_api_key
    });

    newClient.reverseGeocode({
        latlng: [lo, la],
        // result_type: ["administrative_area_level_2"],
    }, function (err, response) {
        let data = response.json.results;
        let res_data = [];
        for (let i = 0; i < data.length; i++) {
            res_data.push({
                location: data[i].formatted_address,
                place_id: data[i].place_id,
                latlng: data[i].geometry.location
            });
        }
        res.send(res_data);
    });

});

app.post('/getWeather', (req, res) => {
    let openWeatherMap_api = '66c265481af9e9e256076aa55580923b';
    client.post('http://api.openweathermap.org/data/2.5/weather?lat=' + req.body.lat + '&lon=' + req.body.lng + '&appid=' + openWeatherMap_api, function (data, response) {
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});