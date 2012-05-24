// JavaScript Document

 $(document).bind("mobileinit", function () {
           		$.mobile.allowCrossDomainPages = true;
				//$.mobile.defaultPageTransition = "slide";
		});
	
	$(document).ready(function(){
 
        $("#useJSONP").click(function(){
            $.ajax({
                url: 'http://beta.01tribe.com/responsive/wordpress/api/get_recent_posts/ ',
                //data: {name: 'Chad'},
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'jsonpCallback',
                success: function(){
                    alert("success");
                }
            });
        });
 
    });
 
    function jsonpCallback(data){
		console.log(data);
        $('#jsonpResult').text(data.message);
    }
	
	
		
            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value 
            
            // Wait for Cordova to connect with the device
            //
            //document.addEventListener("deviceready",onDeviceReady,false);
            
			function loadPage(){
				/*$("header").load("http://192.168.1.213:8888/bulgari_responsive/header.php",function(data){
					
					console.log(data);
					})*/
				
			  $.getJSON("http://beta.01tribe.com/responsive/wordpress/api/get_recent_posts/ ",function(data) {
				  console.log("SUCCESS");
				  console.log(data.posts);
				  $(data.posts).each(function(index, element) {
                   console.log(data.posts[index].attachments[0].url);
				    $('#result').append('<a href="'+data.posts[index].url+'"><div id="homeblog">'+data.posts[index].title+'</div><img src='+data.posts[index].attachments[0].url+' width="150"/></a>');
					
                });
       			 
  			  });
				
				};
            // Cordova is ready to be used!
            //
            function getPhoto() {
                pictureSource=navigator.camera.PictureSourceType;
                destinationType=navigator.camera.DestinationType;
            }
            
            // Called when a photo is successfully retrieved
            //
            function onPhotoDataSuccess(imageData) {
                // Uncomment to view the base64 encoded image data
                // console.log(imageData);
                
                // Get image handle
                //
                var smallImage = document.getElementById('smallImage');
                
                // Unhide image elements
                //
                smallImage.style.display = 'block';
                
                // Show the captured photo
                // The inline CSS rules are used to resize the image
                //
                smallImage.src = "data:image/jpeg;base64," + imageData;
            }
            
            // Called when a photo is successfully retrieved
            //
            function onPhotoURISuccess(imageURI) {
                // Uncomment to view the image file URI 
                // console.log(imageURI);
                
                // Get image handle
                //
                var largeImage = document.getElementById('largeImage');
                
                // Unhide image elements
                //
                largeImage.style.display = 'block';
                
                // Show the captured photo
                // The inline CSS rules are used to resize the image
                //
                largeImage.src = imageURI;
            }
            
            // A button will call this function
            //
            function capturePhoto() {
                // Take picture using device camera and retrieve image as base64-encoded string
                navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
                                            destinationType: destinationType.DATA_URL });
            }
            
            // A button will call this function
            //
            function capturePhotoEdit() {
                // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
                navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
                                            destinationType: destinationType.DATA_URL });
            }
            
            // A button will call this function
            //
            function getPhoto(source) {
                // Retrieve image file location from specified source
                navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
                                            destinationType: destinationType.FILE_URI,
                                            sourceType: source });
            }
            
            // Called if something bad happens.
            // 
            function onFail(message) {
                alert('Failed because: ' + message);
            }
			
			
	
	function refreshFeed()
	{
		
            $.ajax({
                url: 'http://beta.01tribe.com/responsive/wordpress/api/get_recent_posts/ ',
                //data: {name: 'Chad'},
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'jsonpCallback',
                success: function(data){
                     $(data.posts).each(function(index, element) {
					  	$("#newslist ul").append('<li ><a href="#detail">'+data.posts[index].title+'</a></li>').data("article",data.posts[index]);
					});
				  $('#newslist ul').listview('refresh');
				//$.mobile.pageLoading( true );
                }
            });
	
	}



function saveLogin(){
	window.localStorage.setItem("login", $('#login').val());
	}
	
	function readLogin(){
		  var login = window.localStorage.getItem("login");

    if (login != null) {
        $('#login').val(login);
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
    console.log("Error processing SQL: "+err.code);
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

