// Setting map coordination
var map = L.map('map', {
    center: [40, -110],
    zoom: 5
});

// Drawing the picture
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function color(magSize) {
    switch (Math.floor(magSize)) {
        case 0:
            return "green"; 
            break;
        case 1: 
            return "lawnGreen";
            break;
        case 2:
            return "yellow";
            break;
        case 3: 
            return "orange";
            break;
        case 4:
            return "darkorange";
            break;
        default:
            return "red"
    }
}

var info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
        categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    categories.map((d, i) => {
        div.innerHTML += '<i class ="circle" style="background:' + color(i) + '"></i>' + d + '<br>'
    })

    return div;
};

info.addTo(map);


d3.json(link).then(response => {
    response.features.map(data => {
        var magnitude = data.properties.mag
        // console.log(magnitude)
        var location = data.geometry.coordinates;
        // console.log(location)

        L.circle([location[1],location[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 0,
            fillColor: color(magnitude),
            radius: 20000 * magnitude
        }).bindPopup(`<h1>${data.properties.place}<\h1><hr><h3>${data.properties.time}</h3>`)
            .addTo(map)
    });
});
