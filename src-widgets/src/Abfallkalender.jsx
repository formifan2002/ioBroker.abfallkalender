import React from 'react';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { withStyles, withTheme } from '@mui/styles';
import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import { ReactComponent as TrashIcon } from './img/AbfalltonneMitText.svg';

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
    constructor(props) {
        super(props);
        this.refTrashIcon = React.createRef();
    }

    static getWidgetInfo() {
        return {
            id: 'tplAbfallkalender',
            visSet: 'abfallkalender',
            visSetLabel: 'vis_2_widgets_abfallkalender', // Widget set translated label (should be defined only in one widget of set)
            visSetColor: '#63C149',                // Color of widget set. it is enough to set color only in one widget of set
            visName: I18n.t('vis_2_widgets_abfallkalender'), // Name of widget
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
                        {
                            name: 'trashcolor',
                            label: 'vis_2_widgets_abfallkalender_trashcolor',
                            type: 'color',
                        },
                        {
                            name: 'trashcolorfactor',
                            label: 'vis_2_widgets_abfallkalender_trashcolor_factor',
                            type: 'slider',
                            min: -1,
                            max: 1,
                            step: 0.1,
                        },
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
                        {
                            name: 'whatsapplogo',
                            label: 'vis_2_widgets_abfallkalender_whatsapplogo',
                            type: 'checkbox',
                        },
                        {
                            name: 'blink',
                            label: 'vis_2_widgets_abfallkalender_blink',
                            type: 'checkbox',
                        },
                    ],
                    onchange:  async (field, data, changeData, socket) => {
                        const object = await socket.getObject(data.oid);
                        console.log('onchange in oid field');
                        if (object && object.common) {
                            data.whatsapplogo = object.common.whatsapplogo !== undefined ? object.common.whatsapplogo : true;
                            data.blink = object.common.blink !== undefined ? object.common.blink : true;
                            data.dateformat = object.common.dateformat !== undefined ? object.common.dateformat : 'short';
                            data.trashcolor = object.common.trashcolor !== undefined ? object.common.trashcolor : '';
                            data.trashcolorfactor = object.common.trashcolorfactor !== undefined ? object.common.trashcolorfactor : -0.3;
                            changeData(data);
                        }
                    },
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev: 'widgets/abfallkalender/img/abfallkalender.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    async propertiesUpdate() {
        // Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
        if (this.state.rxData.oid &&
            this.state.rxData.oid !== 'nothing_selected' &&
            (!this.state.object || this.state.rxData.oid !== this.state.object._id)
        ) {
            const object = await this.props.socket.getObject(this.state.rxData.oid);
            this.setState({ object });
        }
        this.renderTrash();
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
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {

    }

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {
    }

    renderTrash() {
        const {
            blink, whatsapplogo, dateformat, trashcolor, trashcolorfactor,
        } = this.state.data;
        this.refTrashIcon.current.childNodes.forEach(element => {
            if (element.id === 'tonne') {
                // color of the dustbin
                if (trashcolor === '') {
                    this.state.data.trashcolor = element.attributes.fill.nodeValue;
                } else {
                    element.attributes.fill.nodeValue = this.state.data.trashcolor;
                }
                console.log(`Farbe der Tonne ist: ${element.attributes.fill.nodeValue}`);
            }
            if (element.id === 'tonne-innen') {
                // inner color of the dustbin
                const colors = trashcolor.replace('rgba(', '').replace(')', '').split(',');
                const color0 = parseInt(colors[0]);
                const color1 = parseInt(colors[1]);
                const color2 = parseInt(colors[2]);
                const factor = 1 + trashcolorfactor;
                const newColor = `rgba(${color0 * factor},${color1 * factor},${color2 * factor},1)`;
                element.attributes.fill.nodeValue = newColor;
                console.log(`Farbe der Tonne innen ist: ${element.attributes.fill.nodeValue}`);
            }
            if (element.id === 'whatsapp') {
                // show or hide the Whatsapp logo
                element.attributes.style.value = `visibility: ${whatsapplogo === true ? 'visible' : 'hidden'};`;
            }
            if (element.id.substr(0, 'Abfuhrdatum'.length - 1) === 'Abfuhrdatum') {
                console.log(`Abfuhrdatum: ${element.innerHTML}`);
            }
            if (element.id.substr(0, 'AnzahlTage'.length - 1) === 'AnzahlTage') {
                console.log(`in Tagen: ${element.innerHTML}`);
            }
        });
        return true;
    }

    renderWidgetBody(props) {
        // eslint-disable-next-line prefer-template
        super.renderWidgetBody(props);
        return <Card class={`"card-trash${props.id}"`} style={{ width: '100%', height: '100%'}}>
            <CardContent style={{ width: '100%', height: '100%', display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                <TrashIcon class={`"trashicon${props.id}"`} ref={this.refTrashIcon} />
            </CardContent>
        </Card>;
    }
}

export default withStyles(styles)(withTheme(Abfallkalender));
