'use strict';

var nameArr = [];
var addrArr = [];
var map;
var locationNum = 0;
var bounds;
var infoWindow;
var infoWindows = []; // Store all the infoWindows
var marker;
var markers = []; // Store all the markers
var windowContent;
var redPin = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Red marker
var greenPin = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'; // Green marker
var foursquareUrl;
var CLIENT_ID = '1F2Y4LOHT4DF35X3EAECXIU1T1IQY0S3YM4ZSX1K1MGE0ERT'; // CLIENT_ID for connecting Foursquare API
var CLIENT_SECRET = 'H0OESG2T2T5DIMFSABJKJIMVWLV5I3RPIKG0EIVCVFKLA1MZ'; // CLIENT_SECRET for connecting Foursquare API
var foursquareBaseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + // Base url for connecting Foursquare API
												CLIENT_ID + '&client_secret=' + CLIENT_SECRET +
												'&v=20140806&query=';

/**
 * Initialize Google Map
 */
function initialize() {

  var geocoder = new google.maps.Geocoder();
  bounds = new google.maps.LatLngBounds();

 var mapOptions = {
    center: new google.maps.LatLng(48.85, 2.3),
    zoom: 11
  };

  map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

  // Store all the marker information to markers array and all the infoWindow to infoWindows array
  for (var i = 0; i < iniLocs.length; i++) {
    var address = iniLocs[i].address;
    geocoder.geocode({'address': address}, addMarker(i));
  }
}

/**
 * Add a marker and an infoWindow for a location,
 * store data to markers and infoWindows array respectively
 * @param {number} index - the index of a location or marker
 * @return {function} geocodeCallBack - a callback function
 */
function addMarker(index) {
  var geocodeCallBack = function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      // Push each marker to markers array
      marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
        icon: redPin,
        animation: google.maps.Animation.DROP
      });
      markers.push(marker);

			infoWindow = new google.maps.InfoWindow();
      // Push each inforwindow to inforwindows array
      infoWindowContent(index, function(windowContent){
        infoWindow.setContent(windowContent);
				infoWindows.push(infoWindow);
      });

      autoCenter(results[0].geometry.location);

      // Click a marker, show its animation and inforwindow
      google.maps.event.addListener(marker, 'click', function() {
          var self = this;

          // Open corresponding infowindow
          infoWindowContent(index, function(windowContent){
            infoWindow.setContent(windowContent);
            infoWindow.open(map, self);
          });

          toggleBounce(self);
          // Let a marker stop bounce after 1.4 second
          setTimeout(stopBounce, 1400);
          // console.log(marker.getAnimation()); //check animation state
          function stopBounce(){
            self.setAnimation(null);
            self.setIcon(redPin);
          }
      });
    } else {
      alert('Location fail to geocode: ' + status);
    }
  };
  return geocodeCallBack;
}

/**
 * Get Json data from foursquare API, show data in infowindow
 * @param {number} index - the index of a location or marker
 * @param {function} infoWindowCallback - a callback function
 */
function infoWindowContent(index, infoWindowCallback) {
  foursquareUrl = foursquareBaseUrl + iniLocs[index].name + '&ll=' + iniLocs[index].lan + ','+ iniLocs[index].lng;

  $.getJSON(foursquareUrl)
	.done(function(data){
    var curVenue = data.response.venues[0];
    var curMarkerName = curVenue.name;
    var curMarkerAddress = curVenue.location.formattedAddress;
    var curMarkerPhone = (curVenue.contact.formattedPhone === undefined)? 'None': curVenue.contact.formattedPhone;
    windowContent = '<div class="info-window"><p><strong>Name: </strong>' + curMarkerName+ '</p>' +
										'<p><strong>Address: </strong>  ' + curMarkerAddress + '</p>' +
                  	'<p><strong>Phone: </strong>' + curMarkerPhone + '</p></div>';
    infoWindowCallback(windowContent);
  })
	.fail(function(jqxhr, textStatus, error){
      alert('Fail to connect to Foursquare: ' + textStatus + ' ' + jqxhr.status + ' ' + error);
    }
  );
}

/**
 * Set or cancel an animation to a marker
 * @param {object} marker - current marker
 */
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.setIcon(greenPin);
  }
}

/**
 * Fit map to markers
 * @param {object} location - a location includes latitude and longitude
 */
function autoCenter(location) {
  ++locationNum;
  bounds.extend(location);
  if (locationNum == iniLocs.length) {
    map.fitBounds(bounds);
  }
}

// model: store all the Restaurant locations
var iniLocs = [
    {
      "name": "Pain Vin Fromages",
      "address": "3 Rue Geoffroy l'Angevin,75004 Paris,Francia",
      "lan": "48.860512",
      "lng": "2.354572"
    },
    {
      "name": "Benoit Paris",
      "address": "20 Rue Saint-Martin,75004 Paris,Francia",
      "lan": "48.858271",
      "lng": "2.350035"
    },
    {
      "name": "Dans le Noir?" ,
      "address": "51 Rue Quincampoix,75004 Paris,Francia",
      "lan": "48.861336",
      "lng": "2.350238"
    },
    {
      "name": "Suan Thaï",
      "address": "35 Rue du Temple,75004 Paris,Francia",
      "lan": "48.859351",
      "lng": " 2.353863"
    },
    {
      "name": "Paris Beaubourg",
      "address": "23 Rue Saint-Merri,75004 Paris,Francia",
      "lan": "48.859608",
      "lng": "2.352029"
    },
    {
      "name": "Subway",
      "address": "90 Rue Saint-Martin,75004 Paris,Francia",
      "lan": "48.859864",
      "lng": "2.350900"
    },
    {
      "name": "OZO",
      "address": "37 Rue Quincampoix,75004 Paris,Francia",
      "lan": "48.860812",
      "lng": "2.350236"
    },
    {
      "name": "L'Imprévu Café",
      "address": "9 Rue Quincampoix,75004 Paris,Francia",
      "lan": "48.859516",
      "lng": "2.349598"
    },
    {
      "name": "Café Oz Châtelet",
      "address": "18 Rue Saint-Denis,75001 Paris,Francia",
      "lan": "48.859368",
      "lng": "2.347951"
    },
    {
      "name": "La Fusée",
      "address": "168 Rue Saint-Martin,75003 Paris,Francia",
      "lan": "48.862263",
      "lng": "2.352085"
    },
    {
      "name": "Le Restaurant Des Poètes",
      "address": "12 Passage Molière,75003 Paris,Francia",
      "lan": "48.862383",
      "lng": " 2.351316"
    }
  ];

// store names to nameArr, addresses to addrArr
for(var j=0; j<iniLocs.length; j++) {
  nameArr.push(iniLocs[j].name);
  addrArr.push(iniLocs[j].address);
}

var inputDiv = $('.input-search');

/**
 * Initialize the location data
 * @param {object} data - location data
 */
var Loc = function(data) {
  this.name = ko.observable(data.name);
};

// model: store all the search filters
var iniChoices = [
  { id: 'name', name: "Search By Name" },
  { id: 'address', name: "Search By Address" }
];

/**
 * Initialize the choice data
 * @param {object} data - search filters
 */
var Choice = function(data) {
  this.id = ko.observable(data.id);
  this.name = ko.observable(data.name);
};

/**
 * viewModel of knockout
 */
var ViewModel = function() {
  var self = this;

  // Store all the choices in choiceList
  self.selectedChoice = ko.observable();
  self.choiceList = ko.observableArray([]);
  iniChoices.forEach(function(choiceItem){
    self.choiceList.push(new Choice(choiceItem));
  });

  // Store all the locations in locList
  self.locList = ko.observableArray([]);
  iniLocs.forEach(function(locItem){
    self.locList.push(new Loc(locItem));
  });

  /**
   * Click the restaurant on the view list, show corresponding marker and open infoWindow on the map
   */
  this.setLoc = function(clickedLoc) {
    var markerReference;
    for(var k=0; k<iniLocs.length; k++) {
      if(iniLocs[k].name == clickedLoc.name()) {
        markerReference = markers[k];
        toggleBounce(markerReference);
        infoWindowContent(k, function(windowContent){
          infoWindow.setContent(windowContent);
          infoWindow.open(map, markerReference);
        });
        setTimeout(
          function(){
            markerReference.setAnimation(null);
            markerReference.setIcon(redPin);
          }, 1400);
      }
    }
  };

  self.query = ko.observable('');

 /**
  * Show search results on view list and corresponding marker, search filer includes name or location
	* @param {string} inputContent - input value or seleted autocomplete value
  */
  function searchAll(inputContent) {
    self.locList.removeAll();
    for(var i=0; i<iniLocs.length; i++) {
      // Close all the infoWindows, just in case some infoWindow is still open
      infoWindows[i].close();
      markers[i].setVisible(false);
      // Show marched results in view list and marker
      if(iniLocs[i][self.selectedChoice()].toLowerCase().indexOf(inputContent.toLowerCase()) >= 0) {
          self.locList.push({name: iniLocs[i].name});
          markers[i].setVisible(true);
      }
    }
  }

	/**
   * Autocomplete name or address based on selected search filter
   */
  function searchAutoComplete() {
  if(self.selectedChoice() == 'name') {
    autoCompleteSource(nameArr);
  } else {
    autoCompleteSource(addrArr);
  }
}

/**
 * Implement autocomplete function by giving source data and
 * showing search result based on selected autocomplete value
 */
function autoCompleteSource(sourceChoose){
  var selectedValue;
  inputDiv.autocomplete({
    source: sourceChoose,
    select: function(event,ui) {
      selectedValue = ui.item.value;
      searchAll(selectedValue);
    }
  });
}

  // When input value changes, show search results
  self.search = function() {
    searchAll(self.query());
    searchAutoComplete();
  };

  // When selected filter changes, show search results
  self.selectionChanged = function() {
    searchAll(self.query());
    searchAutoComplete();
  };
};

ko.applyBindings(new ViewModel());

var menu = document.querySelector('.menu-icon');
menu.addEventListener('click', function() {
  $('.view-list').toggle("slide");
});
