import React from 'react';
import {
    Card, CardContent,
} from '@mui/material';
import { withStyles, withTheme } from '@mui/styles';
import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

const styles = () => ({
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
    },
});

class Abfallkalender extends (window.visRxWidget || VisRxWidget) {
    static getWidgetInfo() {
        return {
            id: 'tplAbfallkalender',
            visSet: 'abfallkalender',
            visSetLabel: 'vis_2_widgets_abfallkalender', // Widget set translated label (should be defined only in one widget of set)
            visSetColor: '#cf00ff',                // Color of widget set. it is enough to set color only in one widget of set
            visName: 'Abfallkalender',                 // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    label: 'vis_2_widgets_abfallkalender_common', // translated group label
                    fields: [
                        {
                            name: 'oid',     // name in data structure
                            type: 'id',
                            label: 'vis_2_widgets_abfallkalender_oid', // translated field label
                        },
                    ],
                    onchange:  async (field, data, changeData, socket) => {
                        const object = await socket.getObject(data.oid);
                        console.log('onchange in oid field');
                        if (object && object.common) {
                            /* data.min = object.common.min !== undefined ? object.common.min : 0;
                            data.max = object.common.max !== undefined ? object.common.max : 100;
                            data.unit = object.common.unit !== undefined ? object.common.unit : '';
                            */
                            changeData(data);
                        }
                    },
                },
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'dateformat',    // name in data structure
                            label: 'vis_2_widgets_abfallkalender_dateformat', // translated field label
                            type: 'select',
                            options: [
                                {
                                    value: 'short',
                                    label: 'vis_2_widgets_abfallkalender_dateformat_short',
                                },
                                {
                                    value: 'long',
                                    label: 'vis_2_widgets_abfallkalender_dateformat_long',
                                },
                            ],
                            default: 'short',
                        },
                    ],
                },
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'whatsapplogo',
                            label: 'vis_2_widgets_abfallkalender_whatsapplogo',
                            type: 'checkbox',
                        },
                    ],
                },
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'blink',
                            label: 'vis_2_widgets_abfallkalender_blink',
                            type: 'checkbox',
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev: 'widgets/abfallkalender/img/abfallkalender.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    propertiesUpdate() {
        // Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return Abfallkalender.getWidgetInfo();
    }

    // This function is called every time when rxData is changed
    onRxDataChanged() {
        console.log('onRxDataChanged() - no parameters for the function');
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {

    }

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {
        console.log(`onStateUpdated for id: ${id} with state: ${state}`);
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        return <Card style={{ width: '100%', height: '100%' }}>
            <CardContent>
                {I18n.t('vis_2_widgets_abfallkalender')}
                {this.state.values[`${this.state.rxData.oid}.val`]}
                {this.state.values[`${this.state.rxData.dateformat}.val`]}
                {this.state.values[`${this.state.rxData.whatsapplogo}.val`]}
                {this.state.values[`${this.state.rxData.blink}.val`]}
            </CardContent>
        </Card>;
    }
}

export default withStyles(styles)(withTheme(Abfallkalender));
