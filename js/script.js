//select elements from html 
let nav = document.getElementById('nav');
let btns = document.querySelectorAll(".btn");
let httpRequest;
let key = "23f96c34029272a6c0bef221fad8a9fa72cbba0e"
let contract_name = "amiens"
let amiens = document.querySelector(".amiens");
let tiko = document.querySelector(".station-info")
amiens.innerHTML = contract_name;
let map;
let marker;


let app = function() {

    makeRequest()

    function makeRequest() {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Abandon :( Impossible de créer une instance de XMLHTTP');
            return false;
        }
        //send the requet to show data 
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('GET', `https://api.jcdecaux.com/vls/v1/stations?contract=${contract_name}&apiKey=${key}`);
        httpRequest.send();
    }


    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {

                let response = JSON.parse(httpRequest.responseText);
                //get all station and show them in  html 
                for (let index = 0; index < response.length; index++) {
                    let station = response[index];
                    nav.innerHTML += `<li id ="btn" class="btn btn-danger mb-2" data-list="${station.number}" >${station.name}</li>`
                    let btn = document.querySelectorAll(".btn");
                    for (let index = 0; index < btn.length; index++) {
                        let botton = btn[index];
                        botton.addEventListener("click", getinfo)
                    }
                }
            } else {
                alert('Il y a eu un problème avec la requête.');
            }
        }
    }

}
let station_number

function getinfo() {
    ///using data set option for get the station number 
    station_number = this.dataset.list;
    makeRequest()

}

function makeRequest() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance de XMLHTTP');
        return false;
    }
    //get info from server of each station
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', `https://api.jcdecaux.com/vls/v1/stations/${station_number}?contract=${contract_name}&apiKey=${key}`);
    httpRequest.send();
}

function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {

            //show all data in html 

            let result = JSON.parse(httpRequest.responseText);
            let name = document.getElementById("name").innerHTML = "Name :" + result.name
            let add = document.getElementById("add").innerHTML = "Address :" + result.address
            let bikes = document.getElementById("bikes").innerHTML = "Bikes stands :" + result.bike_stands
            let free = document.getElementById("free").innerHTML = " Available bikes :" + result.available_bikes
            let gps = result.position.lat + ',' + result.position.lng



            if (map == null) {
                // create the map
                map = L.map('map').setView([result.position.lat, result.position.lng], 15);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiZmxhdmYiLCJhIjoiY2tsODk2ZmtnMG56ZjJwcjJ3Y2I1bTA5dCJ9.4hQZ-QHrDcX_sIhLyft_jA'
                }).addTo(map);

                //to put maker in the map 
                marker = L.marker([result.position.lat, result.position.lng], { autoPan: true }).addTo(map)
                marker.bindPopup(result.address).openPopup();

            } else {
                // when the map move
                map.panTo([result.position.lat, result.position.lng]);
                marker = L.marker([result.position.lat, result.position.lng], { autoPan: true }).addTo(map)
                marker.bindPopup(result.address).openPopup();
            }
        } else {
            alert('Il y a eu un problème avec la requête.');
        }
    }
}


document.addEventListener("DOMContentLoaded", function() {

    window.addEventListener("load", () => {
        document.querySelector("body").classList.add("loaded");
    });
    app()

})