import React from 'react';
import i18next from 'i18next';
import { i18n as I18n } from '@iobroker/adapter-react-v5';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { withStyles,withTheme } from '@mui/styles';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import { ReactComponent as TrashIcon } from './img/AbfallIconMitText.svg';
import translations from './translations-i18next';

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
        this.initial = true;
        this.instancenameLocal = '';
        this.wastetypeLocal = '';
        this.JsonObject = {};
        this.oidChange = false;
    }

    static getWidgetInfo() {
        // more details for custom filters in file:
        // vis-2-beta/static/js/Attributes/Widget/WidgetField.jsx (line 424ff)
        //
        // new fields are not added to existing widgets !!!
        return {
            id: 'tplAbfallkalender',
            visSet: 'abfallkalender',
            visSetLabel: 'vis_2_widgets_abfallkalender', // Widget set translated label (should be defined only in one widget of set)
            visSetColor: '#63C149',                // Color of widget set. it is enough to set color only in one widget of set
            visName: I18n.t('vis_2_widgets_abfallkalender_widgetname_icon'), // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    label: 'vis_2_widgets_abfallkalender_common', // translated group label
                    fields: [
                        {
                            name: 'instancename',
                            label: 'vis_2_widgets_abfallkalender_instance',
                            type: 'custom',
                            hidden: 'data.instancenamehidden === "true"',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showInstances(field,data,onDataChange),
                        },
                        {
                            name: 'instancenamehidden',  // hide instance selection if only one instance exists
                            type: 'text',
                            hidden: true,
                            default: 'false',
                        },
                        {
                            name: 'selectinstances',     // hidden value of the select entries for instances
                            label: 'selectinstances',
                            type: 'text',
                            hidden: true,
                            default: '',
                        },
                        {
                            name: 'wastetype',
                            label: 'vis_2_widgets_abfallkalender_wastetype',
                            type: 'custom',
                            disabled: 'data.wastetypedisabled === "true"',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showWasteTypes(field,data,onDataChange),
                        },
                        {
                            name: 'wastetypedisabled',     // hide waste type selection if only one waste type is activated
                            type: 'text',
                            hidden: true,
                            default: 'false',
                        },
                        {
                            name: 'selectwastetypes',     // hidden value of the select entries for waste types
                            label: 'selectwastetypes',
                            type: 'text',
                            hidden: true,
                            default: '',
                        },
                        {
                            name: 'icon',
                            default: 'trash',
                            label: 'vis_2_widgets_abfallkalender_icon',
                            type: 'select',
                            options: [
                                {
                                    value: 'trash',
                                    label: 'vis_2_widgets_abfallkalender_icontrash',
                                },
                                {
                                    value: 'yellowbag',
                                    label: 'vis_2_widgets_abfallkalender_iconyellowbag',
                                },
                                {
                                    value: 'christmastree',
                                    label: 'vis_2_widgets_abfallkalender_iconchristmastree',
                                },
                                {
                                    value: 'leaf',
                                    label: 'vis_2_widgets_abfallkalender_iconleaf',
                                },
                            ],
                        },
                        {
                            name: 'trashcolor',
                            default: 'rgba(40,30,88,1)',
                            label: 'vis_2_widgets_abfallkalender_trashcolor',
                            type: 'color',
                            hidden: 'data.icon !== "trash"',
                        },
                        {
                            name: 'trashcolorfactor',
                            hidden: 'data.icon !== "trash"',
                            default: -0.3,
                            label: 'vis_2_widgets_abfallkalender_trashcolor_factor',
                            type: 'slider',
                            min: -1,
                            max: 1,
                            step: 0.1,
                        },
                        {
                            name: 'whatsapplogo',
                            default: true,
                            label: 'vis_2_widgets_abfallkalender_whatsapplogo',
                            type: 'custom',
                            hidden: 'data.whatsapplogohidden === "true"',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showCheckbox(field,data,onDataChange),
                        },
                        {
                            name: 'whatsapplogohidden',     // hide whatsapp selection if whatsapp is not activated for the selected waste
                            type: 'text',
                            hidden: true,
                            default: 'false',
                        },
                        {
                            name: 'blink',
                            default: true,
                            label: 'vis_2_widgets_abfallkalender_blink',
                            type: 'custom',
                            hidden: 'data.blinkhidden === "true"',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showCheckbox(field,data,onDataChange),
                        },
                        {
                            name: 'blinkhidden',     // hide blink checkbox if blink is not activated for the selected waste
                            type: 'text',
                            hidden: true,
                            default: 'false',
                        },
                        {
                            name: 'blinkinterval',
                            default: 3,
                            label: 'vis_2_widgets_abfallkalender_blinkinterval',
                            type: 'slider',
                            hidden: 'data.blink === false || data.blinkhidden === "true"',
                            min: 1,
                            max: 15,
                            step: 1,
                        },
                        {
                            name: 'showdate',
                            default: true,
                            label: 'vis_2_widgets_abfallkalender_showdate',
                            type: 'custom',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showCheckbox(field,data,onDataChange),
                        },
                        {
                            name: 'dateformat',
                            default: 'short',
                            label: 'vis_2_widgets_abfallkalender_dateformat',
                            type: 'select',
                            hidden: 'data.showdate === false',
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
                        },
                        {
                            name: 'showdays',
                            default: true,
                            label: 'vis_2_widgets_abfallkalender_showdays',
                            type: 'custom',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showCheckbox(field,data,onDataChange),
                        },
                        {
                            name: 'fontfamily',
                            label: 'vis_2_widgets_abfallkalender_fontfamily',
                            default: 'Arial',
                            type: 'custom',
                            hidden: 'data.showdate === false && data.showdays === false',
                            component: (
                                field,
                                data,
                                onDataChange,
                            ) => this.showFontfamily(field,data,onDataChange),
                        },
                        {
                            name: 'fontsize',
                            default: 20,
                            label: 'vis_2_widgets_abfallkalender_fontsize',
                            type: 'slider',
                            hidden: 'data.showdate === false && data.showdays === false',
                            min: 6,
                            max: 45,
                            step: 1,
                        },
                        {
                            name: 'oid',     // name in data structure
                            label: 'vis_2_widgets_abfallkalender_oid',
                            type: 'id',
                            noInit: true,
                            hidden: true,
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev: 'widgets/abfallkalender/img/abfallkalender.png',
        };
    }

    changeData(newData) {
        const { id,view,views,selectedWidgets } = this.props;
        const changeWidgets = selectedWidgets !== null ? selectedWidgets : [id];
        changeWidgets.forEach(widgetId => {
            Object.keys(newData)
                .forEach(attr => {
                    views[view].widgets[widgetId].data[attr] = newData[attr];
                    this.state.data[attr] = newData[attr];
                    this.state.rxData[attr] = newData[attr];
                });
        });
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
        if (this.initial === true && this.oidChange !== true) {
            return;
        }
        const { wastetype,instancename } = this.state.data;
        let renderIcon = true;
        if (typeof instancename !== 'undefined' && this.instancenameLocal !== instancename) {
            this.instancenameLocal = instancename;
            await this.getWasteTypes(instancename);
            renderIcon = false;
        }
        if (this.oidChange === true || (
            typeof wastetype !== 'undefined' && this.wastetypeLocal !== wastetype)) {
            this.wastetypeLocal = wastetype;
            await this.getJsonObject(wastetype,this.instancenameLocal);
            await this.updateWhatsappAndBlink();
            renderIcon = true;
            if (this.oidChange === true) { this.oidChange = false; }
        }
        if (renderIcon === true) {
            await this.renderIcon();
        }
    }

    componentDidMount() {
        super.componentDidMount();
        // Update data
        i18next.init(translations)
            .then(() => {
                i18next.changeLanguage(this.props.systemConfig.common.language);
            });
        this.getInstances()
            .then(instance => {
                this.getWasteTypes(instance)
                    .then(retwastetype => {
                        this.getJsonObject(retwastetype,instance)
                            .then(() => {
                                this.updateWhatsappAndBlink()
                                    .then(() => {
                                        this.renderIcon()
                                            .then(() => {
                                                this.initial = false;
                                            });
                                    });
                            });
                    });
            });
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
    onStateUpdated(id,state) {
        // state of the object 'CalenderDoubleQuotes' has changed
        this.oidChange = true;
        this.propertiesUpdate();
    }

    async renderIcon() {
        const { trashcolor,trashcolorfactor,fontfamily,fontsize,whatsapplogo,dateformat,blink,blinkinterval,showdate,showdays } = this.state.data;
        this.refTrashIcon.current.childNodes.forEach(element => {
            if (element.id === 'Abfalltonne') {
                // show or hide the dustbin
                element.attributes.style.value = `visibility: ${this.state.data.icon === 'trash' ? 'visible' : 'hidden'};`;
                let trashColorOuter = '';
                element.childNodes.forEach(child => {
                    if (child.id === 'tonne') {
                        // color of the dustbin
                        if (trashcolor === '') {
                            this.state.data.trashcolor = child.attributes.fill.nodeValue;
                            trashColorOuter = child.attributes.fill.nodeValue;
                        } else {
                            child.attributes.fill.nodeValue = this.state.data.trashcolor;
                            trashColorOuter = this.state.data.trashcolor;
                        }
                    }
                    if (child.id === 'tonne-innen' && typeof trashColorOuter !== 'undefined') {
                        // inner color of the dustbin
                        const colors = trashColorOuter.replace('rgba(','').replace(')','').split(',');
                        const factor = 1 + trashcolorfactor;
                        const color0 = Math.round(parseInt(colors[0]) * factor);
                        const color1 = Math.round(parseInt(colors[1]) * factor);
                        const color2 = Math.round(parseInt(colors[2]) * factor);
                        const newColor = `rgba(${color0},${color1},${color2},1)`;
                        child.attributes.fill.nodeValue = newColor;
                    }
                });
            }
            if (element.id === 'GelberSack') {
                // show or hide the yellow bag
                element.attributes.style.value = `visibility: ${this.state.data.icon === 'yellowbag' ? 'visible' : 'hidden'};`;
            }
            if (element.id === 'Blatt') {
                // show or hide the yellow bag
                element.attributes.style.value = `visibility: ${this.state.data.icon === 'leaf' ? 'visible' : 'hidden'};`;
            }
            if (element.id === 'Weihnachtsbaum') {
                // show or hide the yellow bag
                element.attributes.style.value = `visibility: ${this.state.data.icon === 'christmastree' ? 'visible' : 'hidden'};`;
            }
            if (element.id === 'whatsapp') {
                // show or hide the Whatsapp logo
                element.attributes.style.value = `visibility: ${whatsapplogo === true ? 'visible' : 'hidden'};`;
            }
            if (element.id.indexOf('Abfuhrdatum') !== -1) {
                const options = { year: '2-digit',month: '2-digit',day: '2-digit' };
                if (dateformat === 'long') {
                    options.weekday = 'long';
                }
                element.innerHTML = new Date(this.JsonObject.AbfuhrtagJson).toLocaleDateString(this.props.lang,options);
                element.style.fontSize = `${fontsize}px`;
                element.style.fontFamily = fontfamily;
                element.style.visibility = showdate === true ? 'visible' : 'hidden';
                /* "Abfuhrdatum": "08.04.2023",
                    "AbfuhrTagLang": "Samstag",
                    "AbfuhrTagKurz": "Sa",
                    "Abfuhrart": "Restmüll wöchentlich"
                    "Resttage": 3
                */
            }
            if (element.id.indexOf('AnzahlTage') !== -1) {
                element.innerHTML = i18next.t('vis_2_widgets_abfallkalender_dayCollection',{ count: this.JsonObject.Resttage });
                element.style.fontSize = fontsize;
                element.style.fontFamily = fontfamily;
                element.style.visibility = showdays === true ? 'visible' : 'hidden';
            }
        });
        if (blink === true && this.JsonObject.Blinken === true) {
            const blinking = [
                { opacity: 0 },
                { opacity: 1 },
            ];
            const timing = {
                duration: blinkinterval * 1000,
                iterations: Infinity,
            };
            this.refTrashIcon.current.animate(
                blinking,
                timing,
            );
        } else {
            this.refTrashIcon.current.getAnimations().map(animation => animation.cancel());
        }
    }

    async getJsonObject(selwastetype,instance) {
        const id = `abfallkalender.${instance}.CalendarDoubleQuotes`;
        if (selwastetype === '') { return; }
        await this.props.socket.getForeignStates(id)
            .then(status => {
                if (!(id in status)) { return; }
                const getJsonObject  = JSON.parse(status[id].val).filter(element => element.AbfuhrartNr === selwastetype);
                this.JsonObject =  typeof getJsonObject[0] !== 'undefined' ? getJsonObject[0] : {};
                // this.changeData({ oid: `"${id}"` });
                this.changeData({ oid: id });
            });
    }

    async updateWhatsappAndBlink() {
        const wastetypes = (('selectwastetypes' in this.state.data) && this.state.data.selectwastetypes !== '') ? this.state.data.selectwastetypes.replaceAll('[','{').replaceAll(']','}').replaceAll('#','"').split('}')
            .slice(0,-1) : [];
        for (let i = 0; i < wastetypes.length; i++) {
            wastetypes[i] += '}';
            wastetypes[i] = JSON.parse(wastetypes[i].replaceAll(/'/g,'"'));
        }
        const filtered = wastetypes.filter(wastetype => wastetype.value === this.state.data.wastetype);
        const whatsappUsed = filtered.length > 0 ? parseInt(filtered[0].whatsapp) > -1 : false;
        if (this.state.editMode === true) {
            this.changeData({ whatsapplogohidden: whatsappUsed === true ? 'false' : 'true' });
        }
        if (whatsappUsed === false) {
            this.changeData({ whatsapplogo: false });
        }
        const blinkUsed = filtered.length > 0 ? parseInt(filtered[0].blink) > -1 : false;
        if (this.state.editMode === true) {
            this.changeData({ blinkhidden: blinkUsed === true ? 'false' : 'true' });
        }
        if (blinkUsed === false) {
            this.changeData({ blink: false });
        }
    }

    async getInstances() {
        let ret = this.state.data.instancename;
        const instances = await this.props.socket.getObjectViewSystem('instance','system.adapter.abfallkalender.','system.adapter.abfallkalender.\u9999')
            .then(rows => {
                const newinstances = [];
                Object.keys(rows).forEach((key,i) => {
                    newinstances.push({ value: i,title: rows[key]._id.replace('system.adapter.','') });
                });
                return newinstances;
            })
            .catch(error => {
                console.log('ERROR !!!:');
                console.log(error);
                return [];
            });
        if (this.state.editMode === true) {
            await this.arr2string(instances)
                .then(strinstances => {
                    this.changeData({ selectinstances: strinstances });
                });
            this.changeData({ instancenamehidden: instances.length < 2 ? 'true' : 'false' });
        }
        if (this.initial === true && (!('instancename' in this.state.data) || this.state.data.instancename === '')) {
            ret = instances.length > 0  ? instances[0].value : '';
            this.changeData({ instancename: ret });
        }
        this.instancenameLocal = ret;
        return ret;
    }

    static showInstances(field,data,onDataChange) {
        const menuitems = (('selectinstances' in data) && data.selectinstances !== '') ? data.selectinstances.replaceAll('[','{').replaceAll(']','}').replaceAll('#','"').split('}')
            .slice(0,-1) : [];
        for (let i = 0; i < menuitems.length; i++) {
            menuitems[i] += '}';
            menuitems[i] = JSON.parse(menuitems[i].replaceAll(/'/g,'"'));
        }
        return data.selectinstances === '' ? <div></div> : <FormControl>
            <Select
                value={data[field.name]}
                onChange={event => {
                    onDataChange({ [field.name]: event.target.value });
                }}
                input={<Input name="instances" />}
                label={i18next.t('vis_2_widgets_abfallkalender_instance')}
                style={{ fontSize: '12.8px' }}
            >
                {menuitems.map(item => (
                    <MenuItem key={item.value} value={item.value} style={{ fontSize: '16px' }}>
                        {item.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>;
    }

    static showFontfamily(field,data,onDataChange) {
        const fontCheck = new Set([
            // Windows 10
            'Arial','Arial Black','Bahnschrift','Calibri','Cambria','Cambria Math','Candara','Comic Sans MS','Consolas','Constantia','Corbel','Courier New','Ebrima','Franklin Gothic Medium','Gabriola','Gadugi','Georgia','HoloLens MDL2 Assets','Impact','Ink Free','Javanese Text','Leelawadee UI','Lucida Console','Lucida Sans Unicode','Malgun Gothic','Marlett','Microsoft Himalaya','Microsoft JhengHei','Microsoft New Tai Lue','Microsoft PhagsPa','Microsoft Sans Serif','Microsoft Tai Le','Microsoft YaHei','Microsoft Yi Baiti','MingLiU-ExtB','Mongolian Baiti','MS Gothic','MV Boli','Myanmar Text','Nirmala UI','Palatino Linotype','Segoe MDL2 Assets','Segoe Print','Segoe Script','Segoe UI','Segoe UI Historic','Segoe UI Emoji','Segoe UI Symbol','SimSun','Sitka','Sylfaen','Symbol','Tahoma','Times New Roman','Trebuchet MS','Verdana','Webdings','Wingdings','Yu Gothic',
            // macOS
            'American Typewriter','Andale Mono','Arial','Arial Black','Arial Narrow','Arial Rounded MT Bold','Arial Unicode MS','Avenir','Avenir Next','Avenir Next Condensed','Baskerville','Big Caslon','Bodoni 72','Bodoni 72 Oldstyle','Bodoni 72 Smallcaps','Bradley Hand','Brush Script MT','Chalkboard','Chalkboard SE','Chalkduster','Charter','Cochin','Comic Sans MS','Copperplate','Courier','Courier New','Didot','DIN Alternate','DIN Condensed','Futura','Geneva','Georgia','Gill Sans','Helvetica','Helvetica Neue','Herculanum','Hoefler Text','Impact','Lucida Grande','Luminari','Marker Felt','Menlo','Microsoft Sans Serif','Monaco','Noteworthy','Optima','Palatino','Papyrus','Phosphate','Rockwell','Savoye LET','SignPainter','Skia','Snell Roundhand','Tahoma','Times','Times New Roman','Trattatello','Trebuchet MS','Verdana','Zapfino',
        ].sort());
        document.fonts.ready;
        const fontAvailable = new Set();
        for (const font of fontCheck.values()) {
            if (document.fonts.check(`${data.fontsize}px "${font}"`)) {
                fontAvailable.add(font);
            }
        }
        const menuitems = [];
        for (const font of fontAvailable) {
            menuitems.push({ title: font,value: font });
        }
        return <FormControl>
            <Select
                value={data[field.name]}
                onChange={event => {
                    onDataChange({ [field.name]: event.target.value });
                }}
                input={<Input name="fontfamily" />}
                label={i18next.t('vis_2_widgets_abfallkalender_fontfamily')}
                style={{ fontSize: '12.8px' }}
            >
                {menuitems.map(item => (
                    <MenuItem key={item.value} value={item.value} style={{ fontSize: '16px' }}>
                        {item.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>;
    }

    static showWasteTypes(field,data,onDataChange) {
        const menuitems = (('selectwastetypes' in data) && data.selectwastetypes !== '') ? data.selectwastetypes.replaceAll('[','{').replaceAll(']','}').replaceAll('#','"').split('}')
            .slice(0,-1) : [];
        for (let i = 0; i < menuitems.length; i++) {
            menuitems[i] += '}';
            menuitems[i] = JSON.parse(menuitems[i].replaceAll(/'/g,'"'));
        }
        return data.selectwastetypes === '' ? <div></div> : <FormControl>
            <Select
                value={data[field.name]}
                onChange={event => {
                    onDataChange({ [field.name]: event.target.value });
                }}
                input={<Input name="wastetypes" />}
                label={i18next.t('vis_2_widgets_abfallkalender_wastetype')}
                style={{ fontSize: '12.8px' }}
            >
                {menuitems.map(item => (
                    <MenuItem key={item.value} value={item.value} style={{ fontSize: '16px' }}>
                        {item.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>;
    }

    static showCheckbox(field,data,onDataChange) {
        return <FormControl>
            <Checkbox
                checked={data[field.name]}
                onChange={event => {
                    onDataChange({ [field.name]: event.target.checked });
                }}
                color="primary"
            />
        </FormControl>;
    }

    async getWasteTypes(instance) {
        if (instance === '') { return ''; }
        let ret = this.state.data.wastetype;
        const wasteTypes = await this.props.socket.getObjectViewSystem('instance','system.adapter.abfallkalender.','system.adapter.abfallkalender.\u9999')
            .then(rows => {
                const allWasteTypes = [];
                Object.keys(rows).forEach(key => {
                    if (Object.keys(rows).length === 1 || rows[key]._id === `system.adapter.${instance}`) {
                        for (let k = 0; k < rows[key].native.wasteTypes.length; k++) {
                            if (rows[key].native.wasteTypes[k].used === true) {
                                allWasteTypes.push({ value: rows[key].native.wasteTypes[k].value,title: rows[key].native.wasteTypes[k].title,whatsapp: rows[key].native.wasteTypes[k].whatsapp,blink: rows[key].native.wasteTypes[k].blink });
                            }
                        }
                    }
                });
                return allWasteTypes;
            })
            .catch(error => {
                console.log('ERROR !!!:');
                console.log(error);
                return [];
            });
        if (this.state.editMode) {
            await this.arr2string(wasteTypes)
                .then(strwastetypes => {
                    this.changeData({ selectwastetypes: strwastetypes });
                });
            this.changeData({ wastetypedisabled: wasteTypes.length < 2 ? 'true' : 'false' });
        }
        if (this.initial === true && (!('wastetype' in this.state.data) || this.state.data.wastetype === '')) {
            ret = wasteTypes.length > 0 ? wasteTypes[0].value : '';
            this.changeData({ wastetype: ret });
        }
        this.wastetypeLocal = ret;
        return ret;
    }

    // eslint-disable-next-line class-methods-use-this
    async arr2string(arr) {
        let str = '';
        // eslint-disable-next-line array-callback-return
        arr.map(arrelement => {
            str += '[';
            Object.keys(arrelement)
                .forEach((attr,index) => {
                    if (index > 0) str += ',';
                    str += `#${attr}#: #${arrelement[attr].toString()}#`;
                });
            str += ']';
        });
        return str;
    }

    renderWidgetBody(props) {
        // eslint-disable-next-line prefer-template
        super.renderWidgetBody(props);
        return <Card class={`"card-trash${props.id}"`} style={{ width: '100%',height: '100%' }}>
            <CardContent style={{ width: '100%',height: '100%',display: 'flex',justifyContent:'center',alignItems: 'center' }}>
                <TrashIcon class={`"trashicon${props.id}"`} ref={this.refTrashIcon} />
            </CardContent>
        </Card>;
    }
}
export default withStyles(styles)(withTheme(Abfallkalender));
