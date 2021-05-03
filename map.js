function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let mqtt;
  let host = "localhost";
  let port = 9001;

function onConnect () {
    console.log("Connected");
    mqtt.subscribe("sensor1");
    message = new Paho.MQTT.Message("Hello World", retained=true);
    message.destinationName = "sensor1";
    mqtt.send(message);
    console.log("I've arrived here");
}

function MQTTconnect() {
    console.log("connecting to " + host + " port " + port);
    mqtt = new Paho.MQTT.Client(host, port, "", "clientjs");
    let options = {
        timeout: 3,
        onSuccess: onConnect
    };
    mqtt.connect(options);
}

async function populateMap() {
    var mymap = L.map('mapid').setView([43.7696, 11.2558], 13);
    L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 17,
            minZoom: 13
        }).addTo(mymap);

    var busIcon = L.icon({
        iconUrl: 'images/bus_icon.png',
    
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
    });

    // example marker
    var marker = L.marker([43.7696, 11.2558], {icon: busIcon});

    // add a navigation link, a picture to the popup
    let popup = '<center>here we can show the numbers relative to this bus</center>'
    
    marker.bindPopup(popup).openPopup();
    marker.bindTooltip('Negozio di cacche vintage');
    marker.addTo(mymap);

    let origin = [43.7696, 11.2558];
    let dest = [43.8696, 11.3558];


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


}