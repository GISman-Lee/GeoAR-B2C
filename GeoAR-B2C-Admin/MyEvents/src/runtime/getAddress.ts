import { reject } from "esri/core/promiseUtils";

export function reverseGeocode(x, y) {

    /* Reverse Geocoding Service */
    const base_url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=PointAddress&location="

    var request_url = base_url + x + ',' + y;

    let didTimeOut = false;
    const timeout = setTimeout(() => {
        didTimeOut = true;
        reject(new Error('Request timed out'));
    }, 5000);



    return fetch(request_url)
        .then((res) => {
            clearTimeout(timeout);
            if (!didTimeOut) {
                return res.json()
                    .then((resp) => {
                        return resp.address.LongLabel;
                    })
            } else {
                return "Request Geocoder Timeout";
            }
        })
        .catch((err) => {
            console.error('Error with places API', err);
            if (didTimeOut) return "TimeOut";
        })

}