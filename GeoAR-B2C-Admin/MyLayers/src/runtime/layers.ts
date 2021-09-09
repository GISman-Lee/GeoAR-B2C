import createlayer = require('./createlayer');

var index = 0
export const Sources = {

    Events_Layer: [
        {
            name: "PRODUCTS",
            url: "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Events/FeatureServer/0",
            layerId: (index++).toString()
        }
        
        /*
        {
            name: "COVID ALERTS",
            url: "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Alerts/FeatureServer/0",
            layerId: (index++).toString()
        },
        */        
    ],

    Normal_Layers: [
        {
            name: "Cameras",
            url: "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Region/FeatureServer/0",
            layerId: (index++).toString()
        },

        {
            name: "Roads",
            url: "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Region/FeatureServer/1",
            layerId: (index++).toString()
        },

        {
            name: "Suburbs",
            url: "https://services8.arcgis.com/RvlAuFejCI3bb9jt/arcgis/rest/services/Region/FeatureServer/2",
            layerId: (index++).toString()
        }
    ]
}