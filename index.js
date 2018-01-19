var express = require('express')
var app = express()
var http = require('http')
var soap = require('soap')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/api/:subId/:startDate/:endDate', function(req, res) {

    var subId = req.params.subId;
    var startDate = req.params.startDate.split("_")[0] + "/" + req.params.startDate.split("_")[1] + "/" + req.params.startDate.split("_")[2];
    var endDate = req.params.endDate.split("_")[0] + "/" + req.params.endDate.split("_")[1] + "/" + req.params.endDate.split("_")[2];
    console.log("Start Date: " + startDate);
    console.log("End Date: " + endDate);
    var url = 'http://www.maxbounty.com/api.cfc?wsdl';
    var args = {
        user: "CHANGE_USERNAME",
        password: "CHANGE_PASSOWRD"
    };

    var dataStats = {};
    soap.createClient(url, function(err, client) {
        client.getKey(args, function(err, result) {
            if (err) {
                console.log("Error: " + err);
            }
            args = {
                keyStr: result.return,
                subId: subId,
                startDate: startDate,
                endDate: endDate
            }
            console.log("Key: " + result.return);

            client.getDateRangeSubIDDetails(args, function(err, result) {
                if (err || result == null) {
                    console.log("Error: " + err);
                    res.send({
                        error: err
                    });
                } else {
                    dataStats.entries = [];

                    result.return.forEach(function(data) {
                        var entry = {};
                        entry.offer_name = data.entries[6].value.$value;
                        entry.clicks = data.entries[5].value.$value;
                        entry.leads = data.entries[1].value.$value;

                        dataStats.entries.push(entry);
                    });

                    console.log("Data Stats: " + JSON.stringify(dataStats, null, 2));
                    res.send(dataStats);
                }
            });
        });
    });


});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});