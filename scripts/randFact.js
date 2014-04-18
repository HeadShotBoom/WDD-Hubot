// Description:
// Random Fact Generator
//
// Dependencies:
// request
//
// Configuration:
// none
//
// Commands:
// Hubot random fact
//
// Author:
// ndickiso


var request = require('request');

var fact = 'Hubot is 59% Human';

//Requests random fact from mentalfloss.com api
function getFact(){
	request('http://mentalfloss.com/api/1.0/views/amazing_facts.json?limit=1&display_id=xhr&cb=0.7231947963021575', function (error, response, body) {
	  
	  if (!error && response.statusCode == 200) {
		
		//Parse respsponse, find the fact, remove any html elements, stringify.
		var jdata = JSON.parse(response.body);
		var data = jdata[0].fact_body;
		var regex = /(<([^>]+)>)/ig;
		var result = data.replace(regex, "");
		  fact = result;
		  
	  
	  }else{
		  //Return error if api request goes wrong.
		  fact = "Something went long here.." 
	  }
	})
}


getFact();

//Listens for the exact match of random fact and calls random fact function.
module.exports = function(robot) {
  return robot.respond(/random fact/i, function(msg) {
 		msg.send(fact); 
 		getFact();
  });
}