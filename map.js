let mqtt;
let host = "localhost";
let port = 9001;

// Bus stops and its coordinates
let stops = [
    {
        "id": 1,
        "x": 43.1696,
        "y": 11.2558
    },
    {
        "id": 2,
        "x": 43.8696,
        "y": 11.3558
    }
];

// Map variables
var marker;
var popup;
var busIcon;
var mymap;


// Returns the searched bus stop
function searchBusStop(id) {
    for (var i=0; i<stops.length; i++) {
        if (stops[i].id == id) return stops[i];
    }
    return null;
}


// on a successful connection the frontend subscribes to bus1 topic
function onConnect () {
    console.log("Connected");
    mqtt.subscribe("line1/bus1");
    // message = new Paho.MQTT.Message("Hello World", retained=true);
    // message.destinationName = "sensor1";
    // mqtt.send(message);
    // console.log("I've arrived here");
}

// callback when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
    try {
        var msg = JSON.parse(message.payloadString);
        id = msg.s;
        delta = msg.d;
        console.log("delta:"+delta);
        console.log("stop:"+id);
        var stop = searchBusStop(id);
        if (stop) {
            var dest = [stop.x, stop.y];
            popup = "<center> Passenger difference compared to the previous stop: " + delta + "</center>";
            marker.bindPopup(popup).openPopup();
            marker.bindTooltip('Bus Line 1');
            marker.slideTo(dest, {
                duration: 4000,
                keepAtCenter: true
            });
        }
        else {
            console.log("Unknown stop");
        }
    } catch(e) {
        console.log(e); // error in the above string (in this case, yes)!
    }
}

// on failure try to reconnect to mqtt after a while
function onFailure(message) {
    console.log("Connection to " + host + " failed");
    setTimeout(MQTTconnect, 6000);
}

// called when the page is opened, used to estabilish a connection to the mqtt broker
function MQTTconnect() {
    console.log("connecting to " + host + " port " + port);
    mqtt = new Paho.MQTT.Client(host, port, "", "clientjs");
    let options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure
    };
    mqtt.connect(options);
    // registering the callback
    mqtt.onMessageArrived = onMessageArrived;
}

// used to populate the map
async function populateMap() {
    mymap = L.map('mapid').setView([43.7696, 11.2558], 13);
    L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 17,
            minZoom: 13
        }).addTo(mymap);

    busIcon = L.icon({
        iconUrl: 'images/bus_icon.png',
    
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
    });


    // example marker
    marker = L.marker([43.7696, 11.2558], {icon: busIcon});

    // add some text to the popup
    popup = '<center>here we can show the numbers relative to this bus</center>'
    
    marker.bindPopup(popup).openPopup();
    marker.bindTooltip('Bus Line');
    marker.addTo(mymap);

    /*
    let origin = [43.7696, 11.2558];
    let dest = [43.8696, 11.3558];


    // just for testing purposes
    setInterval(async function() {
        marker.slideTo(dest, {
            duration: 4000,
            keepAtCenter: true
        });
    }, 6000);

    setInterval(async function() {
        marker.slideTo(origin, {
            duration: 4000,
            keepAtCenter: true
        });
    }, 12000);
    */


}