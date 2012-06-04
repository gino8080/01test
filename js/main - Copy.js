// JavaScript Document
$(document).bind("mobileinit", function () {
    $.mobile.allowCrossDomainPages = true;
    //$.mobile.defaultPageTransition = "slide";
	
});

$(document).ready(function () {
   
	getAirports("departure");
	getAirports("destination");
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

                /*$(xml).find('flightstatus').each(function(){
				
				var from = $(this).find('from').text();
				console.log(from);
				 $('#jsonpResult').text(from);
			});*/
            }
        });

        //getDestinationAirportList
        /* $.ajax({
            url: ' https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z',
            //data: {name: 'Chad'},
            //dataType: 'xml',
            success: function (data) {
               console.log(data);
			   $('#jsonpResult').html(data);
            }
        });*/

    })
});

function flyCallback(data) {
    console.log(data);
    $('#jsonpResult').html(data);

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
		   var options = '';
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
$('#news').live('pagecreate', function (event) {

    $('#reset').click(function () {
        dao.dropTable(function () {
            dao.createTable();
        });
    });


    $('#sync').click(function () {
        console.log("SYNC");
        dao.sync(renderList);
    });

    $('#render').click(function () {
        renderList();
    });

    $('#clearLog').click(function () {
        console.log("INIT DB");

        dao.initialize(function () {
            console.log('database initialized');
        });

        $('#log').val('');
    });
});

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