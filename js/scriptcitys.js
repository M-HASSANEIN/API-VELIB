//select all div html
let list = document.getElementById("list")
let key = "23f96c34029272a6c0bef221fad8a9fa72cbba0e"
let div = document.getElementById("php");
let myForm = document.getElementById('form');
let contract_name;
let map;
let marker;


//function form 
function valide(event) {

    event.preventDefault()
        //collect data from from
    formData = new FormData(myForm);
    contract_name = formData.get("city");

    /* console.log(formData.get("city")) */
    //shox city name 
    let amiens = document.querySelector(".amiens");
    amiens.innerHTML = contract_name + " Stations";
    let li = document.querySelectorAll("li")
    for (let index = 0; index < li.length; index++) {
        const list = li[index];
        list.remove();
        div.innerHTML = "chargement...."

    }




    fetch(`https://api.jcdecaux.com/vls/v1/stations?contract=${contract_name}&apiKey=${key}`)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {

                    for (let index = 0; index < data.length; index++) {
                        let station = data[index];
                        /*  let li = document.createElement("li");
                         list.appendChild(li) */
                        list.innerHTML += `<li id ="btn" class="btn btn-danger mb-2" data-list="${station.number}" >${station.name}</li>`
                        div.innerHTML = "";
                        let btn = document.querySelectorAll(".btn");
                        for (let index = 0; index < btn.length; index++) {
                            let botton = btn[index];
                            botton.addEventListener("click", getinfo)
                        }
                    }
                })
            } else {
                console.log("error")
            }
        })



}

function getinfo() {

    ///using data set option for get the station number 
    let station_number = this.dataset.list;
    /*  console.log(station_number) */
    fetch(`https://api.jcdecaux.com/vls/v1/stations/${station_number}?contract=${contract_name}&apiKey=${key}`)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    /*    console.log(data) */
                    let name = document.getElementById("name").innerHTML = "Name :" + data.name
                    let add = document.getElementById("add").innerHTML = "Address :" + data.address
                    let bikes = document.getElementById("bikes").innerHTML = "Bikes stands :" + data.bike_stands
                    let free = document.getElementById("free").innerHTML = " Available bikes :" + data.available_bikes
                    let gps = data.position.lat + ',' + data.position.lng
                    if (map == null) {
                        // create the map
                        map = L.map('map').setView([data.position.lat, data.position.lng], 20);
                        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                            maxZoom: 18,
                            id: 'mapbox/streets-v11',
                            tileSize: 512,
                            zoomOffset: -1,
                            accessToken: 'pk.eyJ1IjoiZmxhdmYiLCJhIjoiY2tsODk2ZmtnMG56ZjJwcjJ3Y2I1bTA5dCJ9.4hQZ-QHrDcX_sIhLyft_jA'
                        }).addTo(map);

                        //to put maker in the map 
                        marker = L.marker([data.position.lat, data.position.lng], { autoPan: true }).addTo(map)
                        marker.bindPopup(data.address).openPopup();

                    } else {
                        // when the map move
                        map.panTo([data.position.lat, data.position.lng]);
                        marker = L.marker([data.position.lat, data.position.lng], { autoPan: true }).addTo(map)
                        marker.bindPopup(data.address).openPopup();
                    }
                })
            } else {
                console.log("error")
            }
        })

}


document.addEventListener("DOMContentLoaded", function() {

    window.addEventListener("load", () => {
        document.querySelector("body").classList.add("loaded");
    });

    form.addEventListener("submit", valide)

})