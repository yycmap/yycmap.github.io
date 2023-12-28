

//map
let map;

function initMap() {

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 51.0447, lng: -114.0719 },
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  // Add geoJson as markers

  map.data.loadGeoJson('https://data.calgary.ca/resource/c2es-76ed.geojson?$limit=50000&$where=permitclassgroup=%27Secondary%20Suites%27&statuscurrent=Completed');


 // add style to markers
  map.data.setStyle(function (feature) {
    // Access feature properties
    var workclassmapped = feature.getProperty('workclassmapped');
    let icon = "";
    // Customize marker icon based on data
    if (workclassmapped === 'New') {
      icon = 'http://maps.gstatic.com/mapfiles/ms2/micons/green.png';
    } else {
      icon = 'http://maps.gstatic.com/mapfiles/ms2/micons/red.png';
    }

    // Return the style object with the chosen icon
    return {
      icon: icon
    };
  });
  


  //Click on a marker
  let infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function (event) {
    // info box
    if (infowindow) {
      infowindow.close();
    }
    let listgroup = 'list-group-item-danger';
    let suiteemoji = '';
    if (event.feature.getProperty('workclassmapped') == "New") {
      listgroup = 'list-group-item-success';
      suiteemoji = '&#128522; ';
    }
    let contentString =
      '<div class="card">' +
      '<h5 class="card-header text-center">' + event.feature.getProperty('permitnum') + '</h5>' +
      '<ul class="list-group list-group-flush p-0">' +
      '<li class="list-group-item ' + listgroup + '"><span class="font-weight-bold">' + suiteemoji + event.feature.getProperty('workclassmapped').toUpperCase() + ' SUITE</span></li>' +
      '<li class="list-group-item">' + event.feature.getProperty('originaladdress') + '</li>' +
      //'<li class="list-group-item">Sticker: ' + '' + '</li>' + //Will need an api call to get this maybe not worth it
      '<li class="list-group-item">Applied: ' + event.feature.getProperty('applieddate').slice(0, 10) + '</li>' +
      '<li class="list-group-item">Issued: ' + event.feature.getProperty('issueddate').slice(0, 10) + '</li>' +
      '<li class="list-group-item">Completed: ' + event.feature.getProperty('completeddate').slice(0, 10) + '</li>' +
      '</ul>' +
      '</div>';

    infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 225,
      position: event.latLng,
    });
    infowindow.open(map);
    //end infobox
  });

  //Search Bar
  let searchMarkers = [];
  const calgaryBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(49.8426, -113.0719), // Southwest corner of Calgary
    new google.maps.LatLng(50.2080, -112.8116)  // Northeast corner of Calgary
  );
  const searchBox = new google.maps.places.SearchBox(document.getElementById('search-bar'), {
    bounds: calgaryBounds,
    componentRestrictions: { country: 'CA' } // Restrict to Canada
  });
  map.addListener('bounds_changed', function () { //honestly not sure what this does
    searchBox.setBounds(map.getBounds());
  });
  searchBox.addListener('places_changed', function () {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      // Add a marker to highlight the selected place
      const marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // URL to the blue pin image
        }
      });
      searchMarkers.push(marker);
    });


    map.fitBounds(bounds);
    map.setZoom(19);
  });
  map.addListener('click', function () {
    searchMarkers.forEach(function (marker) {
      marker.setMap(null);
    });
    searchMarkers = [];
  });
}


window.initMap = initMap;





