// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

  // Define the colors of the circle depending on magnitude
  function pointColors(mag) {
    switch(true) {
      case mag > 5:
        return "red";
      
      case mag > 4:
        return "coral";
      
      case mag > 3:
        return "orange";
      
      case mag > 2:
        return "gold";
      
      case mag > 1:
        return "yellowgreen";
      
      case mag > 0:
        return "green";
      
      default: "white";
    }
  }

    // Define the radius size dependent on the mag value
    function circleRadius(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 15000;
    }

     // Defince the style of the circle markers
  function pointStyle(feature) {
    return {
      fillOpacity: 0.75,
      color: "white",
      // Adjust fillcolor 
      fillColor: pointColors(feature.properties.mag),
      // Adjust radius
      radius: circleRadius(feature.properties.mag)
    }
  }

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Location: " + feature.properties.place +
      "</h3><hr><p> Date/Time: " + new Date(feature.properties.time) + "</p><p> Magnitude: " + feature.properties.mag + "</p><p> Alerts: " + feature.properties.alert + "</p>");
  }
  // var geoJsonFeature = {
  //   "type": "Feature",
  //}
  



 

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    //style: pointStyle(feature),
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlong){
      var markersFormat = {
        radius: circleRadius(feature.properties.mag),
        fillColor: pointColors(feature.properties.mag),
        stroke: false,
        color: "white",
        fillOpacity: 0.75,
      }

      return L.circle(latlong, markersFormat)
    }
  });
  
  
  // var magCircle = L.circle(earthquakeData,{
  //   onEachFeature: onEachFeature
  // });

  
  // for (var i = 0; i < earthquakes.length; i++) {

  //   // Conditionals for countries points
  //   var color = "";
  //   if (earthquakes[i].points > 5) {
  //     color = "red";
  //   }
  //   else if (earthquakes[i].points > 4) {
  //     color = "coral";
  //   }
  //   else if (earthquakes[i].points > 3) {
  //     color = "orange";
  //   }
  //   else if (earthquakes[i].points > 2) {
  //     color = "gold";
  //   }
  //   else if (earthquakes[i].points > 1) {
  //     color = "yellowgreen";
  //   }
  //   else {
  //     color = "green";
  //   }
  
  //   // Add circles to map
  //   L.circle(earthquakes[i].location, {
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: color,
  //     // Adjust radius
  //     radius: earthquakes[i].points * 1500
  //   });
  // }




  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.8283, -98.5795
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //  Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5];
    var colors = ["green", "yellowgreen", "gold", "coral", "orange", "red"];
    //var labels = [];
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + 
       limits[i] + (limits[i+1] ? "&ndash;" + limits[i+1] + "<br>" : "+");
      }

    return div;

    };

    legend.addTo(myMap);
}

//   //  Add min & max
//     var legendInfo =
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + 1 + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     colors.forEach(function(color, index) {
//       labels.push("<li style=\"background-color: " + color + 
//       "\">" + limits[index] + "</li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);
// }

