var tipoCheckin="0";


// JavaScript Document
$(document).bind("mobileinit", function () {
    $.mobile.allowCrossDomainPages = true;
    //$.mobile.defaultPageTransition = "slide";
	
});

$(document).ready(function () {
setUpForms();
	getAirports("departure");
	getAirports("destination");
});

	 

$('#detailVolo').live('pagecreate',function(e,data){
		 console.log(data);
		 console.log(data.toiata)
		 
   
 });
 
$('#home').live('pagecreate', function (event) {
console.log("LIVE");
 
	
    $("#fly").click(function () {
        console.log("fly");


        $.ajax({
            type: "GET",
            //url: "https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z",
            url: "https://mobile.alitalia.it/services/FlightStatus.aspx",
            data: {
                iphoneid: "123456",
                key: "44bf025d27eea66336e5c1133c3827f7",
                carrier: "AZ",
                flightnr: "2130",
                date: "2011-06-12Z"
            },
            dataType: "xml",
            success: function (xml) {
                var jsonObj = $.xml2json(xml);
                console.log(jsonObj.from);
                console.log(jsonObj.to);

            }
        });
    })
});

function flyCallback(data) {
    console.log(data);
    $('#jsonpResult').html(data);

}
   
function setUpForms(){
	   
	   //Radio Buttons
   $("input[type='radio']").bind( "change", function(event, ui) {
	   var tipoCheckin=$(this).val();
	   var nomeTipo="";
	   console.log( tipoCheckin);
	   
	   switch(tipoCheckin) {
		   case "0":
		   //eticket:
		   nomeTipo="Codice E-Ticket";
		   break;
		   
		   case "1":
			//MIMMEMIGLIA
		   nomeTipo="Codice MilleMiglia";
		   
		   break;
		 
		   case "2":
			 //PNR
		   nomeTipo="Codice PNR";
		   
		   break;
		     
		   
		   }
	   
	   $("input#code").attr("placeholder",nomeTipo);
	});
 
 
 
 //
 $("form#form_getTickets").bind("submit",function(event){
	 event.preventDefault();
	 console.log($(this));
	 
	 CheckInGetTickets();
	 
	 return false;
	 
	 })
 

 
 }
 

function getAirports(aereoporto) {
	
   var url="";
	if(aereoporto=="departure"){
		console.log("AIRPORTS PARTENZE");
		url="https://mobile.alitalia.it/services/getDepartureAirportList.aspx";
	}else{
		 console.log("AIRPORTS ARRIVI");
		url="https://mobile.alitalia.it/services/getDestinationAirportList.aspx";
	}
	
    $.ajax({
        type: "GET",
        //url: "https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z",
        url: url,
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7"
        },
        dataType: "xml",
        success: function (xml) {
			console.log("SUCCESS");
			 
           
		   if(checkError(xml)==false)
		   return false;
		   
		   var jsonObj = $.xml2json(xml);
		   var airs = getObjects(jsonObj, 'iata')
           
		 
			//Filla Select 	 
		   var options = '<option >Aereoporto di Partenza</option>';
            $.each(airs, function (index, data) {
            	//console.log(data.iata)
				if(index>0){
					options += '<option value="' + data.iata + '">' + data.displayname + '</option>';
				}
			});
			
					
			$("select#"+aereoporto).html(options);
			
        }
    });

}


function CheckInGetTickets(){
	//var param:Object={iphoneid: Settings.IPHONE_ID, key: Settings.KEY, lang: Settings.LANG, devicetype: Settings.DEVICETYPE, name: name, surname: surname, codetype:checkinType, code:code,date:theDate};
				console.log("CheckInGetTickets");
 $.ajax({
        type: "GET",
        url: "http://192.168.1.186:8094/services/CheckInGetTickets.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
			devicetype: "Mobile",
			date : getTodayZ(),
			name: $("input#name").val(),
			surname: $("input#surname").val(),
			codetype: tipoCheckin,
			code: $("input#code").val()
        },
        dataType: "xml",
        success: function (xml) {
			console.log("SUCCESS");
			 
           
		   if(checkError(xml)==false)
		   return false;
		   
		   var jsonObj = $.xml2json(xml);
		   console.log(jsonObj);
		  
		 
			
        }
    });

}



/*Check XML Result for STATE == 0 */
function checkError(xml){
	 if($(xml).find("state").text()=="0"){
	   //onError($(xml));
	   console.log("ERRORE "+ $(theError).find("error").text() );
	   return false;
	}else{
		return true;
	}
}


function getTodayZ(){
	
	return "2012-06-04Z";
	
	}
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key || obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}
/*NEWS PAGE*/
$('#infoVoli').live('pagecreate', function (event) {

    $('#searchFlight').click(function () {
      FlightSearch();
    });


});


 function FlightSearch(){
	 				console.log("FlightSearch");
					//var param:Object={iphoneid: Settings.IPHONE_ID, key: Settings.KEY, lang: Settings.LANG, from: from, to: to, date: date};
				
 $.ajax({
        type: "GET",
        url: "https://mobile.alitalia.it/services/FlightSearch.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
			devicetype: "Mobile",
			
			from: $("select#departure").val(),
			to: $("select#destination").val(),
        	date : getTodayZ()
		},
        dataType: "xml",
        success: function (xml) {
		
		    if(checkError(xml)==false)
		   return false;
		 	
			console.log("SUCCESS FlightSearch");
			
			var resulto = '';
			
			
			 $(xml).find("flight").each(function(index, element) {
			   // console.log(index);
			   resulto += '<li data-role="list-divider">Tratta ' + index+ '</li>';

			  
				$(this).find("subflight").each(function(index, element) {
					
					var flight = $.xml2json(element);
					
					resulto += '<li><a href="#" data-carrier="'+flight.carrier+'" data-number="'+flight.number+'">' + flight.from + ' - ' + flight.to +'</a></li>';
				   // console.log(element);
				 });
			});
			
			
		
			//console.log(resulto);
			$("ul#FlyResult").html(resulto).listview('refresh');
			
			
			$("ul#FlyResult li a").live("click",function(){
				
				//alert($(this).data("carrier")+" - "+$(this).data("number"));
				FlightStatus($(this).data("carrier"),$(this).data("number"));
				})
        }
    });
}
 
 function FlightStatus(carrier,number){
	 //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z
	  $.mobile.showPageLoadingMsg("FlightStatus...");
	 console.log("FlightStatus");
	 $.ajax({
        type: "GET",
        url: "https://mobile.alitalia.it/services/FlightStatus.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
			
			carrier: carrier,
			flightnr: number,
        	date : getTodayZ()
		},
        dataType: "xml",
        success: function (xml) {
		  
		  if(checkError(xml)==false)
		   return false;
		
		 var flight=$.xml2json(xml);
			//console.log(flight.toiata);   
			
		   $.mobile.changePage( "#detailVolo", { data:flight} );
		   //$("#detailVolo #flightDetail").html(flight.toiata);
			}
	 })
			 
	 }
	 



/*STORES PAGE*/
$('#stores').live('pagecreate', function (event) {
    console.log("STORES");
    getGeo();

});


function loadJsonP() {
    console.log("JSONP");

    $.ajax({
        url: 'http://beta.01tribe.com/responsive/wordpress/api/get_recent_posts/ ',
        //data: {name: 'Chad'},
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'jsonpCallback',
        success: function (data) {
            fillGallery(data);
        }
    });
}

function loadPage() {
    console.log("LOCA RECENT POST");
    $.getJSON("http://beta.01tribe.com/responsive/wordpress/api/get_recent_posts/ ", function (data) {
        fillGallery(data)
    });
};

function jsonpCallback(data) {
    console.log(data);
    fillGallery(data);
    $('#jsonpResult').text(data.message);
}

function fillGallery(data) {

    console.log("FILLGALLERY");
    $(data.posts).each(function (index, element) {
        console.log(data.posts[index].attachments[0].url);
        $('#Gallery').append('<li><a href="' + data.posts[index].attachments[0].url + '" data-ajax="false"><img src="' + data.posts[index].attachments[0].url + '" title="' + data.posts[index].url + '" /></a></li>');
        $('#result').append('<a href="' + data.posts[index].url + '"><div id="homeblog">' + data.posts[index].attachments[0].url + '</div><img src="' + data.posts[index].attachments[0].url + '" width="150" /></a>');

    });

    var options = {};
    $("#Gallery a").photoSwipe(options);

}







/*LOCAL STORAGE*/

function saveLogin() {
    window.localStorage.setItem("login", $('#login').val());
}

function readLogin() {
    var login = window.localStorage.getItem("login");

    if (login != null) {
        $('#login').val(login);
    }
}


/*CHILDBROWSER*/


function openWin() {
    //.showWebPage("http://google.com");
    var childbrowser = window.plugins.childBrowser;
    if (childbrowser != null) {
        childbrowser.onLocationChange = function (loc) {
            alert("In index.html new loc = " + loc);
        };
        childbrowser.onClose = function () {
            alert("In index.html child browser closed");
        };
        childbrowser.onOpenExternal = function () {
            alert("In index.html onOpenExternal");
        };

        window.plugins.childBrowser.showWebPage("http://google.com");

    }
}



// Populate the database 
//
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
}

// Transaction error callback
//
function errorCB(err) {
    console.log("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    var db = window.openDatabase("test", "1.0", "PhoneGap test", 200000);
    db.transaction(queryDB, errorCB);
}

// PhoneGap is ready
//
function creatDB() {
    var db = window.openDatabase("test", "1.0", "PhoneGap test", 200000);
    db.transaction(populateDB, errorCB, successCB);
}