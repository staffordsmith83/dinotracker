// mpStyle is used to style geojson files with mulipolygons. Not used in this version. Geojson layers replaced with WMS.
var mpStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
});

var projection = new ol.proj.Projection({
          code: 'EPSG:3857',
          units: 'm',
          axisOrientation: 'neu',
          global: true
      });

var source1 = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({source: source1});


var source2 = new ol.source.TileWMS({
               	url: 'http://localhost:8080/geoserver/dinotracker/wms',
		 		params: {'LAYERS':
						'dinotracker:Broome_SS'},
				serverType: 'geoserver',
								});
      });
var new ol.layer.Tile({source: source2});


var source3 = new ol.source.TileWMS({	
						url:'http://localhost:8080/geoserver/dinotracker/wms',
						params: {'LAYERS':
						'dinotracker:tracks'},
//	To style with an external SLD add in the next line. Also will have to remove closing curly bracket in line above this one.
//								'SLD': 'http://localhost:8080/dinotracker/style/tracks.sld'},
						serverType: 'geoserver',
								});
var tracksLayer = new ol.layer.Tile({source: source3});


var source4 = new ol.source.TileWMS({	
						url:
'http://localhost:8080/geoserver/dinotracker/wms',
						params: {'LAYERS':
						'dinotracker:hunting_areas'},
//	To style with an external SLD add in the next line. Also will have to remove closing curly bracket in line above this one.
//								'SLD': 'http://localhost:8080/dinotracker/style/tracks.sld'},
						serverType: 'geoserver',
								});
var hAreasLayer = new ol.layer.Tile({source: source4});



function init(){
	var view = new ol.View({
					center: ol.proj.fromLonLat([122.215, -17.98]),
					zoom: 13.5,
// The next line could be used to set the projection of the map, but to use projection other than EPSG:4326
// you need to make it known to openlayers, using the proj library.
//					projection: 'EPSG:3577'
					
				});

	var map = new ol.Map({
		target: 'map',
		controls: ol.control.defaults().extend([
						new ol.control.ScaleLine({
								units: 'metric'})
					]),
		view: view
	});

		
// now use this GetFeatureInfo into Popup code instead
var popup = new Popup();
map.addOverlay(popup);

map.on('singleclick', function(evt) {

    // Hide existing popup and reset it's offset	  
	popup.hide();
    popup.setOffset([0, 0]);

    // Attempt to find a marker from the planningAppsLayer
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
    });

    if (feature) {

        var coord = feature.getGeometry().getCoordinates();
        var props = feature.getProperties();
        var info = "<h2><a href='" + props.caseurl + "'>" + props.casereference + "</a></h2>";
            info += "<p>" + props.locationtext + "</p>";
            info += "<p>Status: " + props.status + " " + props.statusdesc + "</p>";
        // Offset the popup so it points at the middle of the marker not the tip
        popup.setOffset([0, -22]);
        popup.show(coord, info);

    } else {

        var url = source3
                    .getGetFeatureInfoUrl(
                        evt.coordinate,
                        map.getView().getResolution(),
                        map.getView().getProjection(),
                        {
                            'INFO_FORMAT': 'application/json',
                            'PROPERTYNAME': 'number,type'
                        }
                    );

        reqwest({
            url: url,
            type: 'json',
        }).then(function (data) {
            var feature = data.features[0];
            var props = feature.properties;
			var info = '<h5> Congratulations You Found A Dinosaur Track! It was made by a ' + props.type + '</h5><p style="color:black;"><a href="http://localhost:8080/dinotracker_NEW/' + props.type + '.html" target="_blank">Click to See Information</a></p>';
            popup.show(evt.coordinate, info);
        });

    }
});

	
	
	
	
	
	map.addLayer(osmLayer);
	map.addLayer(hAreasLayer);
	map.addLayer(geoLayer);
	map.addLayer(tracksLayer);

}

function layerVis (value) { // function invoking the initial status of the layer's visibility
	if (value == "osmLayer") {
		osmLayer.setVisible(document.getElementById("1").checked);
		}
	else if (value == "geoLayer") {
		geoLayer.setVisible(document.getElementById("2").checked);
		}
	else if (value == "tracksLayer") {
		tracksLayer.setVisible(document.getElementById("3").checked);
		}
	else if (value == "hAreasLayer") {
		hAreasLayer.setVisible(document.getElementById("4").checked);
		}
}
	
	
	