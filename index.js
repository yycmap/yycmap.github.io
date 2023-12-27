

//map
let map;

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 51.0447, lng: -114.0719 },
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "SS_20231227.geojson",
  );
  let infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function (event) {
    //alert(subjects.workclassmapped);

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
}
window.initMap = initMap;




