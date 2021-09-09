import FeatureLayer = require('esri/layers/FeatureLayer');

export function createFeatureLayerByURL(url, layerId) {
    var layer = new FeatureLayer({
        url: url,
        id: layerId,
        visible: true,
        outFields: ["*"]
    });

    return layer;
}