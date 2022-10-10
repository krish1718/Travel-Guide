
var waypts = google.maps.DirectionsWaypoint = [];

let url;

var dest = [];
let start;
const max = 8;
var curr = -1;
let link = document.getElementById('link');

let add = document.getElementsByClassName('add');
let remove = document.getElementsByClassName('remove');

Array.from(add).forEach((elem) => {
    elem.addEventListener("click", () => {
        console.log(elem)
        ariaadd = elem.getAttribute("aria-add")
        waypts.push({ location: `${ariaadd}`, stopover: true })
        url += `${ariaadd}/`
        calcRoute();
    })
}) 

Array.from(remove).forEach((elem) => {
    elem.addEventListener("click", () => {
        console.log(elem)
        ariaremove = elem.getAttribute("aria-remove")
        waypts = waypts.filter(item => item.location !== ariaremove )
        url = url.replace(`${ariaremove}/`,'')
        calcRoute();
    })
}) 

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

let getLocationPromise = () => {

    return new Promise(function (resolve, reject) {
        // Automatically passes the position
        // to the callback
        navigator.geolocation
            .getCurrentPosition(resolve, reject);
    });
};

function getLocation() {
    getLocationPromise()
        .then((res) => {
            // If promise get resolved
            const { coords } = res;

            let oriurl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyCm-b8quns5Xjw-wlDmSnUAEwyMJTlcZvI`

            fetch(oriurl)
                .then((response) => response.json())
                .then((data) => myFunc(data))

            function myFunc(data) {
                start = (data.results[0].formatted_address)
                url = `https://www.google.com/maps/dir/${start}/`
            }

            var myLatLng = { lat: coords.latitude, lng: coords.longitude };
            var mapOptions = {
                center: myLatLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //create map
            var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

            //bind the DirectionsRenderer to the map
            directionsDisplay.setMap(map);

        })
        .catch((error) => {
            // If promise get rejected
            console.error(error);
        })
}

getLocation()



function calcRoute() {
    //create request
    curr++;
    const len = waypts.length
    if (len <= 9) {
        var request = {
            origin: start,
            destination: waypts[(len - 1)].location,
            waypoints: waypts.slice(0, (len - 1)),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }

        //pass the request to the route method
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                //Get distance and time
                // const output = document.querySelector('#output');
                // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

                //display route
                directionsDisplay.setDirections(result);
            } else {
                //delete route from map
                directionsDisplay.setDirections({ routes: [] });
                //center map in London
                map.setCenter(myLatLng);

                //show error message
                // output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
            }
        });

        link.innerHTML = `<button class="mapbtn"><a class="alink" href="${url}" target="blank">Redirect to Maps</a></button>`
    }
    else {
        console.log('limit reached');
    }
}
