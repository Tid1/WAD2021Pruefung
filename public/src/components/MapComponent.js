import {Map, View, Feature} from "ol";
import "ol/ol.css";
import {Vector as LayerVector, Tile} from "ol/layer";
import {transform} from "ol/proj";
import {Point} from "ol/geom";
import {Style, Icon, Text, Fill} from "ol/style";
import {Vector, OSM} from "ol/source";
import {useContext, useEffect} from "react"
import {MyContext} from "../App";

let mapVektorLayer;
function MapComponent() {
    let [context, setContext] = useContext(MyContext);

    useEffect(() => {
        let iconStyle = new Style({
            image: new Icon ({
                anchor: [0.5, 1.0],
                scale: 0.1,
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.75,
                src: 'images/marker.png'
            })
        });

        /*let iconFeature = new Feature({
            geometry: new Point(transform([13.412207792429454, 52.56459085467104], 'EPSG:4326',
                'EPSG:3857')),
            name: 'Null Island',
            population: 4000,
            rainfall: 500
        });*/

        let vektorLayer = new LayerVector({
            source: new Vector({
              //  features: [iconFeature]
            }),
            style: iconStyle
        })

        mapVektorLayer = vektorLayer;

        let tileLayer = new Tile({
            source: new OSM()
        });


        const map = new Map({
            target: 'map',
            layers: [tileLayer, vektorLayer],
            view: new View({
                center: transform([13.404954, 52.520008], 'EPSG:4326', 'EPSG:3857'),
                zoom: 10
            })
        });
    }, []);

    useEffect(() => {
        mapVektorLayer.getSource().clear();
        function createNewMarker(contact){
            if(contact != null && contact.lon != null && contact.lat != null) {
                let newlyCreatedFeature = new Feature({
                    geometry: new Point(transform([contact.lon, contact.lat], 'EPSG:4326',
                        'EPSG:3857'))
                });
                let iconStyle = new Style({
                    text: new Text({
                        text: contact.firstname,
                        fill: new Fill({
                            color: "#FFF"
                        }),
                        textBaseline: "top",
                        backgroundFill: new Fill({
                            color: "#888"
                        })
                    }),
                    image: new Icon ({
                        anchor: [0.5, 1.0],
                        scale: 0.1,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 0.75,
                        color: "#" + ((1<<24)*Math.random() | 0).toString(16).padStart(6, "0"),
                        src: 'images/marker.png'
                    })});
                newlyCreatedFeature.setStyle(iconStyle);
                mapVektorLayer.getSource().addFeature(newlyCreatedFeature);
            }
        }
        console.log("Contact List: " , context.contactList);
        for (let contact of context.contactList){
            createNewMarker(contact);
        }
    });

    return (
        <div className="mapBox">
            <div className="mapWrapper">
                <div id="map"/>
            </div>
        </div>
    );
}

export default MapComponent;