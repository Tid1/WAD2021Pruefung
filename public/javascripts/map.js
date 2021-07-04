let iconStyle = new ol.style.Style({
    image: new ol.style.Icon ({
        anchor: [0.5, 46],
        scale: 0.1,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'images/marker.png'
    })
});

let iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([13.412207792429454, 52.56459085467104], 'EPSG:4326',
        'EPSG:3857')),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});



 let vektorLayer = new ol.layer.Vector({
     source: new ol.source.Vector({
         features: [iconFeature]
     }),
     style: iconStyle
 })

let tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});


const map = new ol.Map({
    target: 'map',
    layers: [tileLayer, vektorLayer],
    view: new ol.View({
        center: ol.proj.transform([13.404954, 52.520008], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
    })
});

function createNewMarker(lon, lat){
    if(lon != null && lat != null) {
        let newlyCreatedFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326',
                'EPSG:3857'))
        });

        vektorLayer.getSource().addFeature(newlyCreatedFeature);
    }
}

function clearMarkers() {
   vektorLayer.getSource().clear();
}



