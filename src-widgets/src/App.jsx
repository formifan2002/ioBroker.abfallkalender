import React from 'react';

import WidgetDemoApp from '@iobroker/vis-2-widgets-react-dev/widgetDemoApp';
import { i18n as I18n } from '@iobroker/adapter-react-v5';
import { withStyles } from '@mui/styles';
import translations from './translations';

import Abfallkalender from './Abfallkalender';

const styles = theme => ({
    app: {
        backgroundColor: theme?.palette?.background.default,
        color: theme?.palette?.text.primary,
        height: '100%',
        width: '100%',
        overflow: 'auto',
        display: 'flex',
    },
});

class App extends WidgetDemoApp {
    constructor(props) {
        super(props);

        // init translations
        I18n.extendTranslations(translations);
        this.socket.registerConnectionHandler(this.onConnectionChanged);
    }

    renderWidget() {
        return <Abfallkalender
            socket={this.socket}
            themeType={this.state.themeType}
            style={{
                width: 600,
                height: 650,
            }}
            systemConfig={this.state.systemConfig}
            data={{
                name: 'Color gauge',
                oid: 'abfallkalender.0.CalendarDoubleQuotes',
                blink: true,
                whatsapplogo: true,
                dateformat: 'short',
            }}
        />;
    }
}

export default withStyles(styles)(App);
