window.onload = () => {
    let method = 'dynamic';

    // if you want to static load places for test, de-comment following line
    //method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }

    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // then use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

/* Test Only not used if method is set to be 'dynamic' */
function staticLoadPlaces() {
    return [

        {
            name: 'Transport NSW',
            location: {
                lat: -33.78303054961202,
                lng: 151.12836069414755
            },
            handlerName: "h3"

        },

        {
            name: 'Optus',
            location: {
                lat: -33.784317,
                lng: 151.122608
            },
            handlerName: "h4"
        }
    ];
}

// getting places from REST APIs
var dynamicLoadPlaces = function(position) {

    //let endpoint = "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Alerts/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";
    let endpoint = "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Events/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    console.log(resp.features);
                    return resp.features;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

var renderPlaces = function (places) {

    let scene = document.querySelector('a-scene');
    let title = window.parent.document.getElementById('title');
    let gps = window.parent.document.getElementById('sign');
    let plus = window.parent.document.getElementById('plus');
    let minus = window.parent.document.getElementById('minus');
    let recycle = window.parent.document.getElementById('recycle');
    let info_board = window.parent.document.getElementById('infob');
    title.innerHTML = `<h4>GeoAR-B2C</h4>`;

    places.forEach((place) => {
        const objectID = place.attributes.OBJECTID;
        const description = place.attributes.DESCRIPTION;
        const TYPE = place.attributes.TYPE;
        const longitude = place.attributes.X;
        const latitude = place.attributes.Y;
        const address = place.attributes.ADDRESS;
        const TypeMode = getTypeModel(TYPE);

        console.log(latitude);
        console.log(longitude);

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('gltf-model', TypeMode.modelFile);
        model.setAttribute('rotation', '4 0 0');
        model.setAttribute('animation', "property: rotation; to: 4 360 0; loop: true; dur: 13000");
        model.setAttribute('name', description);
        model.setAttribute('scale', TypeMode.initialScale);
        model.setAttribute('position', '0 0 0');

        /* get GPS - test only */
        var getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                title.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        /** call-back function, test only */
        var showPosition = function (position_) {
            model.setAttribute('gps-entity-place', `latitude: ${position_.coords.latitude}; longitude: ${position_.coords.longitude};`);
        }

        var scale_ = TypeMode.modelscale_;

        var makeLarger = function () {
            scale_ = scale_ * 1.6;
            scale_string = scale_.toString() + ' ' + scale_.toString() + ' ' + scale_.toString();
            model.setAttribute('scale', scale_string);
        };

        var makeSmaller = function () {
            scale_ = scale_ / 1.6;
            scale_string = scale_.toString() + ' ' + scale_.toString() + ' ' + scale_.toString();
            model.setAttribute('scale', scale_string);
        }

        plus.addEventListener("click", function () {
            makeLarger();
        });

        minus.addEventListener("click", function () {
            makeSmaller();
        });

        /** This function will not be used as button is disabled, test only */
        gps.addEventListener("click", function () {
            getLocation();
        });


        let icons = getType(TYPE);

        var iconNum = TypeMode.index; //original it's equal to 0
        let maxIcon = Object.keys(icons).length;

        /** Test only for recycle button, can help check each 3D model's texture */
        recycle.addEventListener("click", function () {

            iconNum += 1;
            if (iconNum < maxIcon) {
                model.setAttribute('gltf-model', icons[iconNum.toString()].modelFile);
                scale_ = icons[iconNum.toString()].modelscale_;
                scale_string = scale_.toString() + ' ' + scale_.toString() + ' ' + scale_.toString();
                model.setAttribute('scale', scale_string);
            } else {
                iconNum = 0;
                model.setAttribute('gltf-model', icons[iconNum.toString()].modelFile);
                scale_ = icons[iconNum.toString()].modelscale_;
                scale_string = scale_.toString() + ' ' + scale_.toString() + ' ' + scale_.toString();
                model.setAttribute('scale', scale_string);
            }

        });

        AFRAME.registerComponent('func-' + objectID.toString(), {
            init: function () {
                this.el.addEventListener("click", function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    console.log("Check Point");
                    console.log(description);

                    info_board.innerHTML = `<style>
                                                table, th, td {
                                                    border: 1px solid black;
                                                    text-align:center;
                                                }
                                            </style>
                                            <table>
                                            <tr>
                                              <th>Events</th>
                                              <th>Details</th>
                                              <th>Location</th>
                                            </tr>
                                            <tr>
                                              <td> ${TYPE} </td>
                                              <td> ${description} </td>
                                              <td> ${address} </td>
                                            </tr>
                                          </table>`;

                });

            }
        });

        model.setAttribute('func-' + objectID.toString(), '');
        model.setAttribute('class', 'cm' + objectID.toString());
        model.setAttribute('cursor', 'rayOrigin: mouse; fuse: true; fuseTimeout: 0');
        model.setAttribute('raycaster', 'objects: ' + '.cm' + objectID.toString());

        scene.appendChild(model);
    });
}

