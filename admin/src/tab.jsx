import React from 'react';
import { createRoot } from 'react-dom/client';
import { MuiThemeProvider } from '@mui/styles/';
import theme from '@iobroker/adapter-react-v5/Theme';
//import Utils from '@iobroker/adapter-react-v5/Components/Utils';
import TabApp from './tab-app';

//Utils.setThemeName('dark');
//let themeName = Utils.getThemeName();
let themeName = window.localStorage ? window.localStorage.getItem('App.theme') || 'light' : 'light';

function build() {
	const container = document.getElementById('root');
	const root = createRoot(container);
	return root.render(
		<MuiThemeProvider theme={theme(themeName)}>
			<TabApp
				adapterName="abfallkalender"
				onThemeChange={(_theme) => {
					themeName = _theme;
					build();
				}}
			/>
		</MuiThemeProvider>,
		document.getElementById('root'),
	);
}

build();
