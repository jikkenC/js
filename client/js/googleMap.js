var marker_list;
var map;
var currentWindow = null;

function initGoogleMap() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map_canvas");

	var ido = 35.70602892754558;
	var keido =  139.70755577087402;
	var latlng = new google.maps.LatLng(ido,keido);
	var opts = {
		zoom: 14,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(mapdiv, opts);

	var m_latlng = new google.maps.LatLng(ido, keido);
	// var mopts = {
	//   position: m_latlng,
	// };
	marker_list = new google.maps.MVCArray();
	var marker = createMarker(map, m_latlng);
	marker_list.push(marker);

	// クリックした場所にマーカーを追加 
	google.maps.event.addListener(map, 'click', function(e){ 
		removeMarkers();
		var marker_center = createMarker(map, e.latLng);
		marker_list.push(marker_center);
	});
}

function markOnMap(ido, keido, name, content, imgsrc) {
	var m_latlng = new google.maps.LatLng(ido, keido);
	var marker = createMarker(map, m_latlng);
	marker_list.push(marker);
	// var mopts = {
	//   position: m_latlng,
	// };
	// var marker = new google.maps.Marker(mopts);
	// marker.setMap(map);
	console.log(name);
	console.log(content);

	// var infoWindow = new google.maps.InfoWindow({
	// 	content:name + '\n' + content
	// });
	google.maps.event.addListener(marker, "click", function() {
		if (currentWindow) {
			currentWindow.close();
		}
		var infoWindow = new google.maps.InfoWindow({
			content:'<h4><img id="name" src="'+imgsrc+'"/>  ' 
				+ name + '</h4>' + ' <p> ' 
				+ content + ' </p> ',
			maxWidth: 200
		});
		infoWindow.open(map, marker);
		currentWindow = infoWindow;
	});
	return marker;
	// 吹き出しが閉じられたら、マーカークリックで再び開くようにしておく
	// google.maps.event.addListener(infoWindow, "closeclick", function() {
	// 	google.maps.event.addListenerOnce(marker, "click", function(event) {
	// 		infoWindow.open(map, marker);
	// 	});
	// });
}

function createMarker(map, latlng) {
	var marker = new google.maps.Marker();
	marker.setPosition(latlng);
	marker.setMap(map);
	return marker;
}

function removeMarkers() {
	 //ボタンが押されたら、マーカーの配列に対して
	 //setMap(null)を実行し、地図から削除
	marker_list.forEach(function(marker, idx) {
		marker.setMap(null);
	});
	marker_list = new google.maps.MVCArray();
}
// google.maps.event.addDomListener( window, 'load', initGoogleMap );
