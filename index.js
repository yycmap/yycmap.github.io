

//map
let map;

function initMap() {

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 51.0447, lng: -114.0719 },
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  // Add geoJson as markers
  map.data.loadGeoJson(
    "SS_20231227.geojson",
  );
  let infowindow = new google.maps.InfoWindow();

  //Click on a marker
  map.data.addListener('click', function (event) {

    //start api call
    fetch('https://data.calgary.ca/resource/c2es-76ed.json?permitnum=' + event.feature.getProperty('permitnumber')).then(function (response) {

      // The API call was successful!
      if (response.ok) {
        return response.json();
      }

      // There was an error
      return Promise.reject(response);

    }).then(function (data) {
      // info box
      if (infowindow) {
        infowindow.close();
      }
      let listgroup = 'list-group-item-danger';
      let suiteemoji = '';
      if (data[0].workclassmapped == "New") {
        listgroup = 'list-group-item-success';
        suiteemoji = '&#128522; ';
      }
      let contentString =
        '<div class="card">' +
        '<h5 class="card-header text-center">' + event.feature.getProperty('permitnumber') + '</h5>' +
        '<ul class="list-group list-group-flush p-0">' +
        '<li class="list-group-item ' + listgroup + '"><span class="font-weight-bold">' + suiteemoji + data[0].workclassmapped.toUpperCase() + ' SUITE</span></li>' +
        '<li class="list-group-item">' + event.feature.getProperty('address') + '</li>' +
        '<li class="list-group-item">Sticker: ' + event.feature.getProperty('stickernumber') + '</li>' +
        '<li class="list-group-item">Applied: ' + data[0].applieddate.slice(0, 10) + '</li>' +
        '<li class="list-group-item">Issued: ' + data[0].issueddate.slice(0, 10) + '</li>' +
        '<li class="list-group-item">Completed: ' + data[0].completeddate.slice(0, 10) + '</li>' +
        '</ul>' +
        '</div>';

      infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 225,
        position: event.latLng,
      });
      infowindow.open(map);
      //end infobox

    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    }); //end api
  });

  //Search Bar
  let searchMarkers = [];
  const calgaryBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(50.8426, -114.0719), // Southwest corner of Calgary
    new google.maps.LatLng(51.2080, -113.8116)  // Northeast corner of Calgary
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





