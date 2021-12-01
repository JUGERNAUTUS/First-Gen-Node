const https = require('https')
//var parser = require('xml2json');
const { XMLParser, XMLBuilder, XMLValidator} = require("./node_modules/fast-xml-parser/src/fxp");

const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 

const { MongoClient } = require("mongodb");
const uri ="mongodb://localhost:27017";
const client = new MongoClient(uri);

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
	
	});


app.post("/verifyCertificate", function(request,response){

  console.log("Reached here",request.body);
        
  var sendResponseObject={};



const data = `<CERTIFICATENO>${request.body.certNo}</CERTIFICATENO>`;

const options = {
  hostname: 'tnedistrict.tn.gov.in',
  port: 443,
  path: '/eda/getEsevaiResponse',
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  
  
  
  res.on('data', d => {
    //console.log("Printing here",d.toString());
    
    let xml = d.toString();
    console.log("xml",xml);

    const parser = new XMLParser();
    let jObj = parser.parse(xml);
    console.log("jObj",jObj);

    //sendResponseObject['certificate'] = jObj;
    //console.log(sendResponseObject);

    let jsonString= jObj;
		response.send(jsonString);

/*
    var json = parser.toJson(xml);

    console.log("json",json);
    
    sendResponseObject['certificate'] = json;

    console.log(sendResponseObject);
    console.log("sendResponseObject");

    let jsonString= JSON.stringify(sendResponseObject)
		response.send(jsonString);
    */
    req.end();
  })
})


req.on('error', error => {
  console.error(error)
  sendResponseObject['error'] = error;


  console.log(sendResponseObject);
  console.log("sendResponseObject");

  let jsonString= JSON.stringify(sendResponseObject)
	response.send(jsonString);
  req.end();
})

req.write(data);


//req.end();

});
