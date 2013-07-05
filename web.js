var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var html;

fs.readFile('index.html', function (err, data) {                                                                
  if (err) throw err;                                                                                             
  html = new Buffer(data, "utf-8");                                                                           
                                                                          
                                                                                                                  
});  
app.get('/', function(request, response) {
  //response.send('Hello World 2!');
    response.send(html.toString('utf-8'));


});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

