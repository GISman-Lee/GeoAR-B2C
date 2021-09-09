/** @jsx */
import { Checkbox } from 'jimu-ui';
import { AllWidgetProps, BaseWidget, React } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer = require('esri/layers/FeatureLayer');
import '../css/style.css';
import { ListGroupItem, Collapse, Row, Col } from 'reactstrap';

import { Icon } from 'jimu-ui';
const addIcon = require('jimu-ui/lib/icons/add.svg');
const minusIcon = require('jimu-ui/lib/icons/minus-8.svg');

import Sources = require('./layers');
import createlayer = require('./createlayer');


export default class Widget extends BaseWidget<AllWidgetProps<any>, any> {

    layers = Sources;

    constructor(props) {
        super(props);
        this.state = {
            JimuMapView: null,
            //other state attributes are dynamically loaded when componentDidMount()
        };

    }

    activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            this.setState({
                JimuMapView: jmv
            });

        }
    };

    componentDidMount() {
        Object.keys(this.layers.Sources).map((key, index) => {
            this.setState({ [key]: false });

            this.layers.Sources[key].map((layer, index2) => {
                this.setState({ [layer.layerId]: false });
            });
        });

        console.log("Component Did Mounted");
    }

    componentDidUpdate() {
        console.log("Component Did updated");
    }

    layersOnChange1st = (layerGroup, checked) => {
        this.layers.Sources[layerGroup].map((layerInfo, index) => {
            this.setState({ [layerInfo.layerId]: !this.state[layerInfo.layerId] });

            this.layersOnChange2nd(layerInfo, checked);
        })
    }

    layersOnChange2nd = (layerInfo, checked) => {
        if (checked === true) {
            if (this.state[layerInfo.layerId] === false) {
                const layer = createlayer.createFeatureLayerByURL(layerInfo.url, layerInfo.layerId);
                this.state.JimuMapView.view.map.layers.add(layer, 0);
            }

            this.setState({ [layerInfo.layerId]: true });
        } else {
            const layer_remove: FeatureLayer = this.state.JimuMapView.view.map.findLayerById(layerInfo.layerId);
            this.state.JimuMapView.view.map.remove(layer_remove);
            this.setState({ [layerInfo.layerId]: false });
        }
    }

    toggle = (key) => {
        this.setState({ [key]: !this.state[key] });
    }

    getIcon = (layerGroup) => {
        if (this.state[layerGroup]) {
            return minusIcon;
        } else {
            return addIcon;
        }
    }

    render() {

        const layerSourcesKeys = Object.keys(this.layers.Sources);

        return (
            <div className="widget-starter jimu-widget" id="widget-frame" >
                {this.props.hasOwnProperty("useMapWidgetIds") &&
                    this.props.useMapWidgetIds &&
                    this.props.useMapWidgetIds.length === 1 && (
                        <JimuMapViewComponent
                            useMapWidgetIds={this.props.useMapWidgetIds}
                            onActiveViewChange={this.activeViewChangeHandler}
                        />
                    )
                }

                {/* <p className='p-3 mb-2 bg-info text-white'>My Layers </p> */}
                <p className="text-primary mb-2 p-2">
                    This is MyLayers-1 Widget.
                    Please select an Event Layer before using MyEvents-1 Widget
                </p>
                

                {
                    layerSourcesKeys.map((key, index) => {
                        var layerGroup = key;
                        return (
                            <div id='list-1st-layer'>
                                <ListGroupItem>
                                    <Row>
                                        <Col sm='auto'>
                                            <div onClick={() => this.toggle(key)}>
                                                <Icon className='expandIcon' icon={(() => this.getIcon(layerGroup))()} size='10' color='blue' />
                                            </div>
                                        </Col>
                                        <Col sm={{ offset: -20 }}>
                                            <Checkbox onChange={(e, checked) => this.layersOnChange1st(layerGroup, checked)} /> {key}
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={this.state[key]}>
                                        {
                                            this.layers.Sources[key].map((layer, index2) => {
                                                var layerInfo = layer;
                                                return (
                                                    <div id='list-2nd-layer'>
                                                        <Checkbox checked={this.state[layerInfo.layerId]} onChange={(e, checked) => this.layersOnChange2nd(layerInfo, checked)} /> {layerInfo.name}
                                                    </div>
                                                )
                                            })
                                        }
                                    </Collapse>
                                </ListGroupItem>
                            </div>
                        )
                    })
                }


            </div>
        );

    }

}
