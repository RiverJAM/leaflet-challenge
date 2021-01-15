//used the bike stations excercise as boiler plate

// Create the tile layer that will be the background of our map
function createMap(EarthQuakeMarkers) {
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
   accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };
  
  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": EarthQuakeMarkers
  };

  // Create the map with our layers
  var map = L.map("map-id", {
    center: [35.73, -111],
    zoom: 5,
    layers:[lightmap, EarthQuakeMarkers]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  function getColor(d) {
    return d > 20   ? "#2e0b01" :
           d > 0    ? '#7a1c02' :
                      '#ff3700' ;
           
  }

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-50, 0, 20],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


  // var info = L.control({
  //   position: "bottomright"
  // });

  // info.onAdd = function() {
  //   var div = L.DomUtil.create("div", "legend");
  //   return div;
  // };
  // info.addTo(map);
  // //inner html for legend

  // document.querySelector(".legend").innerHTML = [
  //   "<p> Not_deep: Orange Red </p>",
  //   "<p> Not_deep: Dark Maroon Red </p>",
  //   "<p> Not_deep: Black with some Red  </p>",

  // ]
  

}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var features = response.features;
  // console.log(features)
  
  // Initialize an array for Earthquake markers
  var EarthQuakeMarkers = [];

  

  // Loop through the features array
  for (var index = 0; index < features.length; index++) {
    var feature = features[index];
    var long = feature.geometry.coordinates[0];
    var lat = feature.geometry.coordinates[1];
    var depth = feature.geometry.coordinates[2];
    var magnitude = feature.properties.mag;
    console.log(depth)
    //picked colors here https://www.google.com/search?q=%23ff0000&oq=%23FF0000&aqs=chrome.0.0i433i457j0i20i263j0l2j0i395l6.246j1j7&sourceid=chrome&ie=UTF-8
    // got this function here https://codepen.io/BangEqual/pen/VLNowO
    function getType(magnitude) {
      if (magnitude < 0) return "#ff3700";
      if (magnitude > 0 & magnitude<20) return "#7a1c02";
      else return "#2e0b01";
    }
    // console.log(magnitude)
    // console.log(lat, long)
    //put in new bc of this https://gis.stackexchange.com/questions/314946/leaflet-extension-this-callinithooks-is-not-a-function
    //also founf CircleMarker in google search
    var newMarker = new L.CircleMarker([lat, long], {radius: (magnitude*5), color: getType(depth)});
    newMarker.bindPopup("<h3>" + "Lat and Long " + lat + "," + long + "<br>" + "Magnitude: " + magnitude + "<br>"+ "Depth: " +feature.geometry.coordinates[2] + "</h3>");

    

    // Add the new marker to the appropriate layer
    // newMarker.addTo(layers.markerstop);
  
    EarthQuakeMarkers.push(newMarker);
  }
  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(EarthQuakeMarkers));
  
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);