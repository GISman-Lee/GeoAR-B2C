/** @jsx */
import { Button, Checkbox } from 'jimu-ui';
import { AllWidgetProps, BaseWidget, React, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import Point = require("esri/geometry/Point");
import Style = require('./style');
import Graphic = require("esri/Graphic");
import FeatureForm = require("esri/widgets/FeatureForm");
import FeatureTemplates = require("esri/widgets/FeatureTemplates");
import '../css/style.css';


import getAddress = require("./getAddress");

let featureLayer, editFeature, highlight;


export default class Widget extends BaseWidget<AllWidgetProps<any>, any> {

    constructor(props) {
        super(props);
        this.state = {
            JimuMapView: null,
            latitude: "",
            longitude: "",
            viewDivState: { cursor: "" },
            addFeatureDivState: { display: "block" },
            featureUpdateDivState: { display: "none" },
            featureForm: null
        };

    }

    activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            this.setState({
                JimuMapView: jmv
            });

            /** Get the event layer */
            featureLayer = jmv.view.map.findLayerById('0');

            const featureForm = new FeatureForm({
                container: "formDiv",
                layer: featureLayer,
                fieldConfig: [
                    {
                        name: "TYPE",
                        label: "Choose incident type"
                    },
                    {
                        name: "DESCRIPTION",
                        label: "Describe the events"
                    },
                    {
                        name: "ADDRESS",
                        label: "Manually input or by geocoding"
                    }
                ]
            });

            this.setState({featureForm: featureForm});

            featureForm.on("submit", () => {
                if (editFeature) {
                    // Grab updated attributes from the form.
                    const updated = featureForm.getValues();

                    // Loop through updated attributes and assign
                    // the updated values to feature attributes.
                    Object.keys(updated).forEach((name) => {
                        editFeature.attributes[name] = updated[name];
                        console.log(name);
                    });

                    // Setup the applyEdits parameter with updates.
                    const edits = {
                        updateFeatures: [editFeature]
                    };
                    this.applyEditsToIncidents(edits, featureForm);
                    this.setState({ viewDivState: { cursor: "auto" } })
                }
            });

            jmv.view.on("click", (event) => {
                // clear previous feature selection
                this.unselectFeature();

                if (this.state.viewDivState.cursor !== "crosshair") {
                    console.log("Check");
                    jmv.view.hitTest(event).then((response) => {
                        if (response.results[0] === undefined) {
                            this.toggleEditingDivs("block", "none");
                        } else {
                            console.log(response.results[0].graphic.layer.id + "****");
                        }
                        // If a user clicks on an incident feature, select the feature.
                        if (response.results.length === 0) {
                            this.toggleEditingDivs("block", "none");
                        } else if (response.results[0].graphic && parseInt(response.results[0].graphic.layer.id) == 0 ) {  //XX  response.results[0].graphic.layer.id == "0"
                            if (this.state.addFeatureDivState.display === "block") {
                                this.toggleEditingDivs("none", "block");
                            }
                            this.selectFeature(response.results[0].graphic.attributes[featureLayer.objectIdField], featureForm);
                        }
                    });
                }
            });

            const templates = new FeatureTemplates({
                container: "addTemplatesDiv",
                layers: [featureLayer]
            });

            templates.on("select", (evtTemplate) => {
                /* Access the template item's attributes from the event's template prototype. */
                const attributes = evtTemplate.template.prototype.attributes;
                
                this.unselectFeature();
                this.setState({ viewDivState: { cursor: "crosshair" } })

                /* With the selected template item, listen for the view's click event and create feature */
                const handler = jmv.view.on("click", async (event) => {
                    /* remove click event handler once user clicks on the view to create a new feature */
                    handler.remove();
                    event.stopPropagation();
                    featureForm.feature = null;

                    if (event.mapPoint) {
                        const point: Point = event.mapPoint.clone();
                        point.z = undefined;
                        point.hasZ = false;
                        const ADDRESS = await getAddress.reverseGeocode(point.longitude, point.latitude)
                        /* Create a new feature using one of the selected template items. */
                        editFeature = new Graphic({
                            geometry: point,
                            attributes: {
                                TYPE: attributes.TYPE,
                                X: point.longitude,
                                Y: point.latitude,
                                ADDRESS: ADDRESS
                            }
                        });

                        // Setup the applyEdits parameter with adds.
                        const edits = {
                            addFeatures: [editFeature]
                        };

                        this.applyEditsToIncidents(edits, featureForm);
                        this.setState({ viewDivState: { cursor: "auto" } })
                    } else {
                        console.error("event.mapPoint is not defined");
                    }
                });
            });





        }
    };

    applyEditsToIncidents = (params, featureForm) => {
        // unselectFeature();
        featureLayer
            .applyEdits(params)
            .then((editsResult) => {
                // Get the objectId of the newly added feature.
                // Call selectFeature function to highlight the new feature.
                if (editsResult.addFeatureResults.length > 0 || editsResult.updateFeatureResults.length > 0) {
                    this.unselectFeature();
                    let objectId;
                    if (editsResult.addFeatureResults.length > 0) {
                        objectId = editsResult.addFeatureResults[0].objectId;
                    } else {
                        featureForm.feature = null;
                        objectId = editsResult.updateFeatureResults[0].objectId;
                    }
                    this.selectFeature(objectId, featureForm);
                    if (this.state.addFeatureDivState.display === "block") {
                        this.toggleEditingDivs("none", "block");
                    }
                }
                // show FeatureTemplates if user deleted a feature
                else if (editsResult.deleteFeatureResults.length > 0) {
                    this.toggleEditingDivs("block", "none");
                }
            }).catch((error) => {
                console.log("error = ", error);
            });
    }

    toggleEditingDivs = (addDiv, attributesDiv) => {
        this.setState({ addFeatureDivState: { display: addDiv } })
        this.setState({ featureUpdateDivState: { display: attributesDiv } })

        document.getElementById("updateInstructionDiv").style.display = addDiv;
    }

    selectExistingFeature = (featureForm) => {
        this.state.JimuMapView.view.on("click", (event) => {
            // clear previous feature selection
            this.unselectFeature();

            if (this.state.viewDivState.cursor !== "crosshair") { //document.getElementById("viewDiv").style.cursor
                this.state.JimuMapView.view.hitTest(event).then((response) => {
                    // If a user clicks on an incident feature, select the feature.
                    if (response.results.length === 0) {
                        this.toggleEditingDivs("block", "none");
                    } else if (response.results[0].graphic && parseInt(response.results[0].graphic.layer.id) == 0) { //XX response.results[0].graphic.layer.id == "0"
                        if (this.state.addFeatureDivState.display === "block") {
                            this.toggleEditingDivs("none", "block");
                        }
                        this.selectFeature(response.results[0].graphic.attributes[featureLayer.objectIdField], featureForm);
                    }
                });
            }
        });
    }

    selectFeature = (objectId, featureForm) => {
        // query feature from the server
        featureLayer.queryFeatures({
            objectIds: [objectId],
            outFields: ["*"],
            returnGeometry: true
        }).then((results) => {
            if (results.features.length > 0) {
                editFeature = results.features[0];

                // display the attributes of selected feature in the form
                featureForm.feature = editFeature;

                // highlight the feature on the view
                this.state.JimuMapView.view.whenLayerView(editFeature.layer).then((layerView) => {
                    highlight = layerView.highlight(editFeature);
                });
            }
        });
    }

    unselectFeature = () => {
        if (highlight) {
            highlight.remove();
        }
    }

    viewsCreateHandler = (jmv) => { 
        console.log("views Create Successful !");
    };

    componentDidMount() {
        console.log("Component Did Mounted");
    }

    componentDidUpdate() {
        console.log("Component Did updated");
    }

    updateEvent = () => {
        this.state.featureForm.submit();
    }

    deleteEvent = () => {
        const edits = {
            deleteFeatures: [editFeature]
        };
        this.applyEditsToIncidents(edits, this.state.featureForm);
        //document.getElementById("viewDiv").style.cursor = "auto";
        this.setState({ viewDivState: { cursor: "auto" } })
    }

    render() {

        return (
            <div className="widget-starter jimu-widget">
                {this.props.hasOwnProperty("useMapWidgetIds") &&
                    this.props.useMapWidgetIds &&
                    this.props.useMapWidgetIds.length === 1 && (
                        <JimuMapViewComponent
                            useMapWidgetIds={this.props.useMapWidgetIds}
                            onViewsCreate={this.viewsCreateHandler}
                            onActiveViewChange={this.activeViewChangeHandler}
                        />
                    )
                }

                {/* <p className='p-3 mb-2 bg-info text-white'>Live Camera uses RMS Camera API   {this.state.latitude} {this.state.longitude}</p> */}
                {/* <p className="text-primary mb-2 p-2"></p> */}

                <div id="editArea" className="editArea-container">  {/* esri-widget--panel*/}
                    <div id="addFeatureDiv" style={this.state.addFeatureDivState}>
                        <div id="addTemplatesDiv" style={Style.widgetStyle.addTemplateStyle}></div>
                    </div>

                    <div id="viewDiv" style={this.state.viewDivState}></div>

                    <div id="featureUpdateDiv" style={this.state.featureUpdateDivState}>
                        <h3 className="list-heading">Events information</h3>
                        <div id="attributeArea">
                            <div id="formDiv" className="card" ></div>
                            <Button type="primary" onClick={this.updateEvent} size="lg" style={Style.widgetStyle.buttonStyle1} >Update incident</Button>
                        </div>
                        
                        <div id="deleteArea">
                            <Button type="secondary" onClick={this.deleteEvent} size="lg" style={Style.widgetStyle.buttonStyle2} >Delete incident</Button>
                        </div>

                        <div id="updateInstructionDiv" style={Style.widgetStyle.updateInstructionDivStyle}>
                            <p className="or-wrap"><span className="or-text">Or</span></p>
                            <p id="selectHeader">Select an incident to edit or delete.</p>
                        </div>
                    </div>
                </div>

            </div>
        );

    }
}
