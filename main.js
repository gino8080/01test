// JavaScript Document
 $(document).bind("mobileinit", function () {
           		//$.mobile.allowCrossDomainPages = true;
				$.mobile.defaultPageTransition = "slide";
        	});
		
            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value 
            
            // Wait for Cordova to connect with the device
            //
            //document.addEventListener("deviceready",onDeviceReady,false);
            
			function loadPage(){
				$("header").load("http://192.168.1.213:8888/bulgari_responsive/header.php",function(data){
					
					console.log(data);
					})
				
			  $.getJSON("http://192.168.1.213:8888/bulgari_responsive/api/get_recent_posts/ ",function(data) {
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
			
			function getGeo() {
      			  navigator.geolocation.getCurrentPosition(onSuccess, onError);
   			 }	
			
			// onSuccess Geolocation
			//
			function onSuccess(position) {
				var element = document.getElementById('geolocation');
				element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
									'Longitude: '          + position.coords.longitude             + '<br />' +
									'Altitude: '           + position.coords.altitude              + '<br />' +
									'Accuracy: '           + position.coords.accuracy              + '<br />' +
									'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
									'Heading: '            + position.coords.heading               + '<br />' +
									'Speed: '              + position.coords.speed                 + '<br />' +
									'Timestamp: '          + new Date(position.timestamp)          + '<br />';
			}
		
			// onError Callback receives a PositionError object
			//
			function onError(error) {
				alert('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}
