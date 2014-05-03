var markers = [];

function addMarker(ev){
  var title = ev["title"];
  var lat = ev["latitude"];
  var lng = ev["longitude"];
  var picture = "http://graph.facebook.com/"+ev["id"]+"/picture?type=normal";

  /* address */
  var location = ev["location"];
  var street = ev["street"];
  var state = ev["state"];
  var city = ev["city"];
  var zip = ev["zip"];
  var address;

  /* format address */
  if(street != null){
    address = location+"<br />"+
    street;
    // if(city != null && state != null)
    //   address += "<br />"+city+", "+state;
  } else {
    address = location+"<br />";
    if(city != null && state != null)
      address += city+", "+state;
  }

  var date = ev["startTime"].substring(0,10);
  date = date.substring(5,7)+"/"+date.substring(8)+"/"+date.substring(0,4);

  var featuredEvent = {
    path: 'M 88.9,34.4 58.4,29.7 44.4,0 30.5,29.7 0,34.4 22,57 16.8,89.3 44.4,74 72.1,89.3 66.9,57 z',
    fillColor: '#E94151',
    fillOpacity: 1,
    scale: .35,
    strokeColor: '#E94151',
    strokeWeight: 1
  };

  var color = '#' + (function co(lor){   return (lor +=
    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');

  var image = {
    url: 'http://see-fb-webserv-env-rswnhycqhp.elasticbeanstalk.com/convert.php?fid='+ev["id"]+'&type=circle',
    // This marker is 30 pixels wide by 30 pixels tall.
    size: new google.maps.Size(30,30),
    scaledSize: new google.maps.Size(30,30),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // anchor point
    anchor: new google.maps.Point(0,0)
  };

  var normalEvent = {
    path: 'M 28,0C12.6,0,0,12.6,0,28s12.6,28,28,28s28-12.6,28-28S43.4,0,28,0 z',
    fillColor: color,
    fillOpacity: 1,
    scale: .35,
    strokeColor: color,
    strokeWeight: 1
  }

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: image,//normalEvent,
    title: 'New York'
  });

  google.maps.event.addListener(map, 'click', function(event) {
    hideFilterButton();
    hidePopup();
  });

  google.maps.event.addListener(map, 'drag', function(event) {
    hideFilterButton();
    hidePopup();
  });

  google.maps.event.addListener(marker, 'click', function() {
    // hide filter
    hideFilterButton();
    // hide previous popup
    hidePopup();
    // bring current marker to front
    marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
    // pan to icon
    map.panTo(marker.getPosition());

    // turn overlay on
    showOverlay();

    $('.overlay').click(function(){
      hideOverlay();
      hidePopup();
    });

    $('body').prepend('<div class="popup z-absolute-top" style="margin-top:-120px;">'+
      '<div style="float:left;padding:10px 0 0 10px;"><img src="'+picture+'" width="80" height="80" /></div>'+
      '<div class="content">'+
      '<div class="title">'+title+'</div>'+
      '<div class="date">'+date+'</div>'+
      '<div class="location">'+address+'</div>'+
      '</div></div>'+
      '<div class="popup-tail z-absolute-top" style="left:50%;margin:-20px 0 0 -3px;"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="36px" height="18px" viewBox="0 0 36 18" enable-background="new 0 0 36 18" xml:space="preserve"><defs></defs><polygon fill="#057AFB" points="0,0 18,18 36,0 "/></svg></div>'+
      '<img src="http://graph.facebook.com/'+ev["id"]+'/picture?type=small" width="30" height="30" style="position:absolute;top:50%;left:50%;margin:.7px 0 0 -.9px;" class="highlighted-icon z-absolute-top" />');
    //infowindow.open(map,marker);
  });

markers.push(marker);
}

function getEvents(ne,sw){
  $.ajax({
    type: "GET",
    url: "http://fbeventserver.elasticbeanstalk.com/?query=viewport&swlng="+sw.lng()+"&swlat="+sw.lat()+"&nelng="+ne.lng()+"&nelat="+ne.lat()+"&limit=100",
    success: function(response){
      var events = response["events"];
      var count = events.length;

      for (var i = 0; i < count; i++) {
        addMarker(events[i]);
      }
    },
    dataType: "JSON"
  });
}

/* testing purposes; remove */
stop = false;

function initialize() {
  var columbia = new google.maps.LatLng(40.807536, -73.962573);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);

  /* remove parks, businesses
     and other default markers */
  var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }];

  var mapOptions = {
    center: newyork,
    zoom: 8,
    styles: myStyles,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
}

// only after device ready and FB init
function registerBoundsChanged(){
  debugger;
  google.maps.event.addListener(map, 'bounds_changed', function(ev){
    /* testing purposes; remove */
      var bounds = map.getBounds();

      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();

      deleteMarkers();

      getEvents(ne,sw);
  });
}

function hidePopup(){
  $('.popup').remove();
  $('.popup-tail').remove();
  // remove previously highlighted icons
  $('.highlighted-icon').remove();
}

  // Sets the map on all markers in the array.
  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setAllMap(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setAllMap(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

document.addEventListener('deviceready', function() {
  initialize();
}, false);
  