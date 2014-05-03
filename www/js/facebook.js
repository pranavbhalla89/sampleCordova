function checkIfConnected(){
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        console.log("connected");
        // hide the login screen
        hideHomeScreen();
        // register the bounds changed
        registerBoundsChanged()
    } else if (response.status === 'not_authorized') {
    	showHomeScreen();
        // the user is logged in to Facebook, 
        // but has not authenticated your app
        console.log("not_authorized");
    } else {
    	showHomeScreen();
        // the user isn't logged in to Facebook.
        console.log("not logged in");
    }
});

}

<!--These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory-->
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

function login() {
	FB.login(
		function(response) {
			debugger;
			console.log(response);
			if (response.status == "connected") {
				// hide the home screen
				hideHomeScreen();
				// register the bounds changed
        		registerBoundsChanged()
				// trigger a bounds change so we get events
				google.maps.event.trigger(map, 'bounds_changed');

				var url = "http://see-fb-webserv-env-rswnhycqhp.elasticbeanstalk.com/sample.php";
				var token = response.authResponse.accessToken;
				$.ajax({
					type: "POST",
					url: url,
					data: {"unique_id": "12345", "token_info": token},
					success: function(response){
						console.log(response);
					},
					dataType: "JSON"
				});
			} else {
				alert('not logged in');
			}
		},
		{ scope: "basic_info,email,user_activities,friends_activities,user_birthday,user_checkins,user_events,friends_events,user_interests,user_likes" }
		);
}

document.addEventListener('deviceready', function() {
	try {
        //alert('Device is ready! Make sure you set your app_id below this alert.');
        debugger;
        FB.init({ appId: "637450906327203", nativeInterface: CDV.FB, useCachedDialogs: false });
        checkIfConnected();
    } catch (e) {
    	alert(e);
    }
}, false);