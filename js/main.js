var path="http://192.168.1.186:8094/services/";
var tipoCheckin = "1";

var CheckInUser = {
	    nome: "",
	    cognome: "",
	    sessionid: "",
	    mmcode: "",
	    pnr: "",
	    eticket: "",
		
	    ticket: {
	        nome: "",
	        cognome: "",
		   eticketnumber: "",
	        pnr: "",
	        tickettype: "",
	        couponnumber: "",
	        isreturncoupon: "",
	        checked: "",
		    IsChecked: "",
	        CanDoCheckIn: "",
		    fareclass: "",
	        serviceclass: "",
		    boardingairport: "",
	        landingairport: "",
	        boardingairportdescription: "",
	        landingairportdescription: "",
	        DepartureAirportCode: "",
	        ArrivalAirportCode: "",
		    carrier: "",
	        flightnumber: "",
		    seat: "",
	        DateTime: "",
			boardingpass: ""
}
	}

// JavaScript Document
$(document).bind("mobileinit", function () {
    $.mobile.allowCrossDomainPages = true;
    //$.mobile.defaultPageTransition = "slide";


});

$(document).ready(function () {
	$.support.cors = true;
	
	$.ajaxSetup({
  		complete: function(){
			hideLoading();
			}
	});

    setUpForms();
   // getAirports("departure");
    //getAirports("destination");
});


function showLoading(text){
	if(text==null){
		text="Loading..";
	}
	$.mobile.showPageLoadingMsg("d", "Loading theme a...");
		//$.mobile.showPageLoadingMsg("a", text);

	}
	
function hideLoading(){
		$.mobile.hidePageLoadingMsg();

	}
	
	
$('#infoVoli').live('pagecreate', function (event) {

 getAirports("departure");
 getAirports("destination");
});

function loadBoardingPass(im){
	showLoading("loadBoardingPass");
	
	console.log("loadBoardingPass - im = "+im);
	if(im==null){
	  im = window.localStorage.getItem("boardpass");
	}
	console.log("im = "+im);
	
	$.mobile.changePage($("#BoardingPassDialog"), {
                transition: 'pop',
                role: 'dialog'
            });
			
   $("#boardImg").attr("src","data:image/gif;base64,"+im);
	
}

$('#home').live('pagecreate', function (event) {
    console.log("HOME");
	
	
  
/*
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
    })*/
});




function flyCallback(data) {
    console.log(data);
    $('#jsonpResult').html(data);

}

function setUpForms() {

    //Radio Buttons
    $("input[type='radio']").bind("change", function (event, ui) {
        tipoCheckin = $(this).val();
        var nomeTipo = "";
        console.log(tipoCheckin);

        switch (tipoCheckin) {
        case "1":
            //eticket:
            nomeTipo = "Codice E-Ticket";
            break;

        case "2":
            //MIMMEMIGLIA
            nomeTipo = "Codice MilleMiglia";

            break;

        case "3":
            //PNR
            nomeTipo = "Codice PNR";

            break;


        }

        $("input#code").attr("placeholder", nomeTipo);
		
		if(window.localStorage.getItem("boardpass").length<=0){
			$("#btn_getBoard").hide();
			};
    });



    //
    $("form#form_getTickets").bind("submit", function (event) {
        event.preventDefault();
        //console.log($(this));
        CheckInGetTickets();

        return false;

    })
	
	  $("form#form_DoCheckIn").bind("submit", function (event) {
        event.preventDefault();
        //console.log($(this));
       CheckinDoCheckIn(CheckInUser.sessionid,$("#telephone").val(),$("#email").val());

        return false;

    })
	
	
	$("#btn_CheckInGetSeatMap").bind("click",function (event) {
		console.log("click CheckInGetSeatMap");
		CheckInGetSeatMap();
		
		});


$("#btn_CheckInGetBoardingPass").bind("click",function (event) {
		CheckInGetBoardingPass();
		
		});



}


function getAirports(aereoporto) {
showLoading("Caricando Aereoporti...");
    var url = "";
    if (aereoporto == "departure") {
        console.log("AIRPORTS PARTENZE");
        url = "https://mobile.alitalia.it/services/getDepartureAirportList.aspx";
    } else {
        console.log("AIRPORTS ARRIVI");
        url = "https://mobile.alitalia.it/services/getDestinationAirportList.aspx";
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


            if (checkError(xml) == false) return false;

            var jsonObj = $.xml2json(xml);
            var airs = getObjects(jsonObj, 'iata')

            var options = "";
            if (aereoporto == "departure") {
                options += '<option >Aereoporto di Partenza</option>';
            } else {
                options += '<option >Aereoporto di Arrivo</option>';
            }

            //Filla Select 	 
            $.each(airs, function (index, data) {
                //console.log(data.iata)
                if (index > 0) {
                    options += '<option value="' + data.iata + '">' + data.displayname + '</option>';
                }
            });


            $("select#" + aereoporto).html(options);
hideLoading();
        }
    });

}


function FlightSearch() {
	console.log($("#dataVoli").val())
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
            date: getTodayZ()
        },
        dataType: "xml",
        success: function (xml) {

            if (checkError(xml) == false) return false;

            console.log("SUCCESS FlightSearch");

            var resulto = '';


            $(xml).find("flight").each(function (index, element) {
                // console.log(index);
                resulto += '<li data-role="list-divider">Tratta ' + index + '</li>';


                $(this).find("subflight").each(function (index, element) {

                    var flight = $.xml2json(element);

                    resulto += '<li><a href="#" data-carrier="' + flight.carrier + '" data-number="' + flight.number + '">' + flight.from + ' - ' + flight.to + '</a></li>';
                    // console.log(element);
                });
            });



            //console.log(resulto);
            $("ul#FlyResult").html(resulto).listview('refresh');


            $("ul#FlyResult li a").live("click", function () {

                //alert($(this).data("carrier")+" - "+$(this).data("number"));
                FlightStatus($(this).data("carrier"), $(this).data("number"));
            })
        }
    });
}

function FlightStatus(carrier, number) {
    //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z
    showLoading("Cercando Voli...");

    console.log("FlightStatus");
    $.ajax({
        type: "GET",
        url: "https://mobile.alitalia.it/services/FlightStatus.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",

            carrier: carrier,
            flightnr: number,
            date: getTodayZ()
        },
        dataType: "xml",
        success: function (xml) {

            if (checkError(xml) == false) return false;




            var flight = $.xml2json(xml);
            console.log(flight.toiata);

            var cont = "";
            cont += flight.dateof + "<br/>";
            cont += flight.fcarrier + flight.fnumber + "<br/><br/>";
            cont += flight.fromiata + " " + flight.from + "<br/>";
            cont += flight.expectedboardingtime + "<br/><br/>";
            cont += flight.toiata + " " + flight.to + "<br/>";
            cont += flight.expectedlandingtime + "<br/>";

            //$.mobile.changePage( $("#detailVolo"), { data:{iata:"io",toiata:"me" }} );
            $("#detailVolo #flightDetail").html(cont)


            $.mobile.changePage($("#detailVolo"), {
                transition: 'pop',
                role: 'dialog'
            });
			
			hideLoading();
            //$("#detailVolo #flightDetail").html(flight.toiata);
        }
    })

}



function CheckInGetTickets() {
	showLoading("CheckIn in corso...");
 
	CheckInUser.nome=$("input#name").val();
	CheckInUser.cognome=$("input#surname").val();

    //var param:Object={iphoneid: Settings.IPHONE_ID, key: Settings.KEY, lang: Settings.LANG, devicetype: Settings.DEVICETYPE, name: name, surname: surname, codetype:checkinType, code:code,date:theDate};
    console.log("CheckInGetTickets");
    $.ajax({
        type: "GET",
        url: path+"CheckInGetTickets.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
            //devicetype: "Mobile",
            date: getTodayZ(),
            name: CheckInUser.nome,
            surname: CheckInUser.cognome,
            codetype: tipoCheckin,
            code: $("input#code").val()
        },
        dataType: "xml",
        success: function (xml) {
            console.log("SUCCESS");
			

            if (checkError(xml) == false) return false;

            //console.log($(xml).find("sessionid").text());
            var tickets = $.xml2json(xml).searchtickets;


			CheckInUser.sessionid=tickets.sessionid;
			
            //console.log(tickets);
            var checkRes = "";
            //Cicla tra i Paxs
            $(tickets.Paxs.Pax).each(function (index, Pax) {
                /*console.log("Pax" + index);
                console.log(Pax);*/
				checkRes += '<li data-role="list-divider" data-pnr="' + Pax.PNR + '" data-eticket="' + Pax.ETicket.toString() + '">' + Pax.PNR + '</li>';
				console.log(checkRes);
				
                //Cicle tra i Voli
                $(Pax.Fly).each(function (index, fly) {
					var ticket=Pax.ETicket+"";
					console.log("ETicket="+ticket+":"+typeof(ticket));
                
                   /* console.log("fly =");
                    console.log(fly);*/
                    checkRes += '<li ><a href="#" data-couponnumber="'+fly.CouponNumber+'" data-pnr="'+Pax.PNR+'" data-flycarrier="'+fly.FlyCarrier+'-'+fly.FlyNumber+'" data-landingairport="'+fly.landingairport+'" data-boardingairport="'+fly.boardingairport+'" eticket="'+ticket+'">' + fly.FlyCarrier + " - " + fly.FlyNumber + '</a></li>';
					console.log(checkRes);

                });
            });
			
			 $.mobile.changePage($("#CheckinList"), {
                transition: 'slide'
            });
			
			 //Fill Avaiable Fly list for Checkin
            $("ul#CheckinResult",$("#CheckinList")).html(checkRes).listview('refresh');
			
			
            //Click Event for List Item
            $("ul#CheckinResult a",$("#CheckinList")).bind("click", function () {
				CheckInUser.eticket=$(this).attr("eticket").toString();
				CheckInUser.ticket.couponnumber=$(this).data("couponnumber");
				CheckInUser.ticket.boardingairport = $(this).data("boardingairport");
				CheckInUser.ticket.landingairport = $(this).data("landingairport");
				CheckInUser.ticket.flycarrier = $(this).data("flycarrier");
				CheckInSelectTicket(CheckInUser.sessionid, CheckInUser.eticket ,CheckInUser.ticket.couponnumber);
				
            })
       	
        }
    });

}



function CheckInSelectTicket(sessionid, eticketnumber, couponnumber) {
	showLoading("CheckIn biglietto " +eticketnumber +" in corso...");
 
    //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z
   console.log("CheckInSelectTicket = "+sessionid +" - " + eticketnumber.toString()+" - " + parseInt(couponnumber));
				
    $.ajax({
        type: "GET",
        url: path+"CheckInSelectTicket.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
		 	sessionid: sessionid,
            eticketnumber: eticketnumber,
            couponnumber:parseInt(couponnumber)
        },
        dataType: "xml",
        success: function (xml) {

   
            if (checkError(xml) == false) return false;
			
			 var selectticket = $.xml2json(xml);
			 
			  CheckInUser.ticket=selectticket
			  CheckInUser.ticket.couponnumber=parseInt(couponnumber);
			
			 var template = $('#tpl-ticket').html();
			 $('#tpl-ticket').hide();
			 var  html = Mustache.to_html(template, CheckInUser);
			$('#selectedTicket').html(html);
			   
			   $.mobile.hidePageLoadingMsg();
				
				
				 $.mobile.changePage($("#SelectedTicketPage"), {
                transition: 'slide'
            });
			hideLoading();
				//CheckInGetSeatMap()
        }

    })

}




function CheckinDoCheckIn(sessionid, phonenumber, email) {
    //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z
    showLoading("Conferma CheckIn in corso...");
 
    console.log("CheckinDoCheckIn = "+sessionid +" - " + phonenumber +" - " + email);
	console.log(typeof(phonenumber));
    $.ajax({
        type: "POST",
        url: path+"CheckinDoCheckIn.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
		 	sessionid: sessionid,
            phonenumber: phonenumber,
            email:email
        },
        dataType: "xml",
        success: function (xml) {
			
			  if (checkError(xml) == false) return false;
			
			 var checkin = $.xml2json(xml);
			
			 console.log(checkin);
			 hideLoading();
			
		}
	})
}


function CheckInGetBoardingPass() {
    //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z

	console.log("CheckInGetBoardingPass");
      $.ajax({
        type: "GET",
        url: path+"CheckInGetBoardingPass.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
		 	sessionid: CheckInUser.sessionid
        },
        dataType: "xml",
        success: function (xml) {
			
			  if (checkError(xml) == false) return false;
			
			 var boardPass = $.xml2json(xml);
			
			 console.log(boardPass);
			// console.log(xml.find("image").text())
			
			 CheckInUser.ticket.boardingpass=boardPass.image;
			  loadBoardingPass(CheckInUser.ticket.boardingpass);
			
			  
		
			
		}
	})
}



function saveBoardingPass(){
		  window.localStorage.setItem("boardpass", CheckInUser.ticket.boardingpass);
		  alert("boarding Pass Savlata!");
	}
function CheckInGetSeatMap() {
    //* https://mobile.alitalia.it/services/FlightStatus.aspx?iphoneid=123456&key=44bf025d27eea66336e5c1133c3827f7&carrier=AZ&flightnr=2130&date=2011-06-12Z

	console.log("CheckInGetSeatMap");
      $.ajax({
        type: "GET",
        url: path+"CheckInGetSeatMap.aspx",
        data: {
            iphoneid: "123456",
            key: "44bf025d27eea66336e5c1133c3827f7",
		 	sessionid: CheckInUser.sessionid
        },
        dataType: "xml",
        success: function (xml) {
			
			  if (checkError(xml) == false) return false;
			
			 var getseatmap = $.xml2json(xml);
			
			 console.log(getseatmap);
			
			
		}
	})
}





$('#detailVolo').live('pagebeforeshow', function (e, data) {
    console.log(data.toiata);
    $("#detailVolo #flightDetail").text(data.toiata);

});


/*STORES PAGE*/
$('#stores').live('pagecreate', function (event) {
    console.log("STORES");
    getGeo();

});


$('#offerte').live('pagecreate', function (event) {
	loadOfferte();
	 var templateOfferte = $('#tpl-offerte').html();
	
	 $('#list_offerte li').live("click",function(e){
	
		 var url=$(this).data("url");
		 console.log(url);
		 
		  $.getJSON(url+"&json=1", function (data) {
			  console.log(data.post);
			
				$('#tpl-offerte').hide();
				var  html = Mustache.to_html(templateOfferte, data.post);
				
				$('#offerteContent').html(html);
				 
					 $.mobile.changePage($("#offerteDetail"), {	transition: 'slide'	});
			});
			
		
		 })
		 
})


function loadOfferte() {
    console.log("JSONP");
	showLoading("Caricando Ultime Offerte..");
    $.ajax({
        url: 'http://beta.01tribe.com/alitalia_panel/feed-offerte-alitalia/',
        //data: {name: 'Chad'},
        dataType: 'json',
        success: function (data) {
            fillOfferte(data);
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

function fillOfferte(data) {

    console.log("fillOfferte");
	$('#list_offerte').html("");
	console.log(data);
    $(data).each(function (index, offerta) {
        //console.log(offerta);
       // $('#Gallery').append('<li><a href="' + data.posts[index].attachments[0].url + '" data-ajax="false"><img src="' + data.posts[index].attachments[0].url + '" title="' + data.posts[index].url + '" /></a></li>');
        $('#list_offerte').append('<li  data-icon="info"  data-split-theme="a" data-split-icon="info" data-url='+offerta.url+' ><div><img src="'+offerta.thumb_url+'" class="ui-li-thumb ui-corner-tl" style="max-width:100%;height:auto" /><div style="padding-left:80px;"><h3 class="ui-li-heading">' + offerta.title +'</h3><p class="ui-li-desc">'+offerta.price+'</p></div></div></li>');

    });

 	$('#list_offerte').listview('refresh');
	
	
			
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



//HELPER FUNCTIONS



/*Check XML Result for STATE == 0 */
function checkError(xml) {
    console.log("STATE = " + $(xml).find("state").text());
    if ($(xml).find("state").text() == "0") {
        //onError($(xml));
		var err=$(xml).find("error").text();
		showError(err)
        console.log("ERRORE " + err);
        return false;
    } else {
        return true;
    }
}

function showError(text){
	if(text==null){
		text="Errore generico";
		}
		
		$.mobile.changePage($("#ErrorDialog"), {
                transition: 'pop',
				role: 'dialog'
            });
			
		$("#logMsg").html(text);
		
		
	
	
	}

function getTodayZ() {

    return "2012-06-26Z";

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