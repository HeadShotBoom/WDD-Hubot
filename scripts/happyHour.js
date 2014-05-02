// Description:
//   Get happy with hubot happy hour finder for your current time!
//
// Dependencies:
//   cheerio,ent,request
//
// Configuration:
//   none
//
// Commands:
//   Hubot happy <city name> (mostly major cities 107 total avilable)
//
// Author:
//   ndickiso


//------DEPENDANCIES----------//
var request = require('request'),
	cheerio = require('cheerio'),
	ent = require('ent');


//-----REQUEST CITY FUNCTION-----//
function getHappy(msg,city){
	
	//Call gotime.com to scrape, conatinating in filtered city variable
	request('http://www.gotime.com/'+city+'/find/places/All-Happy+Hours-now-in-'+city+'?', function (error, response, body) {
	  
	  //If response is good
	  if (!error && response.statusCode < 300){
		
		//Load html body into cheerio
		$ = cheerio.load(body);
		
		//Variables
		var list,noResults;
		
		//Find the happy hour list element
		list = $('#list_items li');
		
		//Find the class that is populated when there are no results
		noResults = $('#list_items li.noresults').length;
		
		//If city is matched in list	
		if(noResults === 0){
			
			//For each place in the happy hour list
			list.each(function() {
				
				//Set variables
				var name,time,district,rating,description;
				
				//Remove uneeded text inside time anchor tag
				$(this).find('div span.time a').empty();
				
				//Element with name of venue
				name = $(this).find('span h3 a').text();
				
				//Element with happy hour time, strip whitespace
				time = $(this).find('div span.time').text().trim();
				
				//Element with district, strip whitespace
				district = $(this).find('a.district').text().trim();
				
				//Element with rating
				rating = $(this).find('div:nth-child(2) span span:contains(%)').text();
				
				//Element for description, strip whitespace and replace semicolons 
				description = $(this).find('.textSection span.details').attr("title").split(';').join(',').trim();
				
				//Send message header with name,rating,time,district, and formatted for slack
			    msg.send('*'+name+'*'+' '+rating+' _'+time+'_ '+district);
			    
			    //Send description
			    msg.send(description);
			    
			});
		
		//If city is not matched in list
		}else{
			
			//replace '-' with ' ', to read better
			city.split('-').join(' ');
			
			//Send error message that city is NOT listed or NO current happy hours
			msg.send(city+" is not a happy city : ( Check for spaces in city names, and spelling!");
		}
		
	  //If error with api request
	  }else{
	  
		//Return error if api request goes wrong.
		msg.send("Something went wrong here.."); 
	  }
	})
}


//------FIX CITY REQUEST---------//
function fixCity(msg,city){
		
		//Conditionals to switch city name to the specifc format need for certain names, using '==' for less strict equality
		if (city == "broward" || city == "palm-beach" || city == "palm-beach-broward" || city == "broward--palm-beach"){
			city = "broward-palm-beach";
		}
		
		if (city == "dallas-fort-worth" || city == "fort-worth" || city == "fort-worth-dallas" || city == "dallas--fort-worth"){
			city = "dallas";
		}
		
		if (city == "denver-boulder" || city == "boulder" || city == "denver--boulder"){
			city = "denver";
		}
				
		if (city == "greensboro" || city == "high-point" || city == "greensboro--high-point-" || city == "high-point-greensboro"){
			city = "greensboro";
		}
		
		if (city == "st-paul-minneapolis" || city == "st-paul" || city == "minneapolis--st-paul"){	
			city = "minneapolis";
		}
		
		if (city == "las-angeles"){
			city = "la";
		}
		
		if (city == "las-vegas"){
			city = "vegas";
		}
		
		if (city == "orange-county"){
			city = "oc";
		}
		
		if (city == "new-york"){
			city = "nyc";
		}
		
		if (city == "lehigh-valley" || city == "allentown"){
			city = "allentown";
		}
		
		if (city == "raleigh" || city == "durham" || city == "raleigh--durham"){
			city = "raleigh-durham";
		}
		
		if (city == "san-francisco" || city == "bay-area" || city == "san-francisco--bay-area" || city == "bay-area-san-francisco"){
			city = "sf";
		}
		
		if (city == "tacoma" || city == "olympia" || city == "tacoma--olympia"){
			city = "tacoma-olympia";
		}
		
		if (city == "virginia-beach" || city == "norfolk" || city == "virginia-beach--norfolk"){
			city = "virginia-beach-norfolk";
		}
		
		if (city == "washington" || city == "washington-dc"){
			city = "dc";
		}
		
		//Send fixed city name to getHappy function to return happy hours
		getHappy(msg,city);	
};


//Listens for the exact match of happy and calls random fact function.
module.exports = function(robot) {
  return robot.respond(/happy(.*)/i, function(msg) {
 		
 		//Variables
 		var input,regex,city;
 		
 		//Strip whitespace and lowercase input
 		input = msg.match[1].trim().toLowerCase();
 		
 		//Regex for removing specials characters
 		regex = /[^\w\s]/gi;	 
 		city = input.replace(regex, "");

		//Use ent to decode any html entities 
		city = ent.decode(city);
		
		//Replace spaces with '-' to work with api request
		city = city.split(' ').join('-');
		
		//Check for city to not be empty
		if(city !== ""){
			
			//Call fixCity function to check for api city alterations	
			fixCity(msg,city);
			
		//Send error message if nothing is entered after hubot happy	
		}else{
			msg.send("Please enter a city.");
		}
		
  });
}
