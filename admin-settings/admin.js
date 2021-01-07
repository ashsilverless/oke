window.onload = function (){
// Find element in DOM that new DOM element is to attach to
var mainContent = document.getElementById('postbox-container-2');
//Create new DOM element, set it an ID and add an image as content
var mapInsert = document.createElement("div");
mapInsert.setAttribute("id", "loc-map");
mapInsert.innerHTML = '<img src="http://' + window.location.hostname + '/wp-content/themes/oke/inc/img/master-mapv1.jpg" style="width:100%; height:auto"/>';
//Attach new DOM element to DOM
mainContent.insertBefore(mapInsert, mainContent.firstChild);
// Give DOM element a CSS property
mapInsert.style.setProperty('position', 'relative');
//Establish the target DOM elements for the output of the click event
var positionVert = document.getElementById("camp-vert").getElementsByClassName('acf-is-appended')[0];
var positionHoriz = document.getElementById("camp-horiz").getElementsByClassName('acf-is-appended')[0];

//Create marker
var mapMarker = document.createElement("div");
mapMarker.setAttribute("class", "mapMarker");
//Append to parent div
mapInsert.insertBefore(mapMarker, mapInsert.firstChild);
mapMarker.style.cssText = "display: block; position: absolute; width:1em; height:1em; border-radius:50%; margin-top:-.5em; margin-left:-.5em;border:2px solid red;box-sizing:border-box;";
mapMarker.style.left = positionHoriz.value + '%';
mapMarker.style.top = positionVert.value + '%';

//Invoke the click event on the new DOM element
mapInsert.addEventListener("click", mapCoords, true);
//Set events required on click event
function mapCoords (event){
    //Set boundary of click location to DOM element, rather than window
    var rect = event.target.getBoundingClientRect();
    //Get width
    var clientWidth = mapInsert.clientWidth;
    var clientHeight = mapInsert.clientHeight;
    //From Top
    var pixelY = event.clientY - rect.top;
    var absPosnY = ( 100 / clientHeight ) * pixelY;
    positionVert.value = absPosnY.toFixed(0);
    //From Left
    var pixelX = event.clientX - rect.left;
    var absPosnX = ( 100 / clientWidth ) * pixelX;
    positionHoriz.value = absPosnX.toFixed(0);
}

mapInsert.addEventListener("click", updateMarker, true);

function updateMarker(e) {
    mapMarker.style.left = positionHoriz.value + '%';
    mapMarker.style.top = positionVert.value + '%';
}
}
