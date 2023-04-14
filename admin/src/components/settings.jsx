import React, { useState, useEffect } from 'react';
import withStyles from '@mui/styles/withStyles';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import SettingsWasteTypes from './settingWasteTypes';

const styles = () => ({
	input: {
		marginTop: 0,
		minWidth: 400,
	},
});

let allStreets = [];
let allHouseNumbers = [];
function Settings(props) {
	const { native, state, thisis, updateNativeValue, sendMessage, tabChange, setTabChange } = props;
	const { i18n } = useTranslation();
	const [showLoader, setShowLoader] = useState(false);
	const [showCalendarLoader, setShowCalendarLoader] = useState(false);
	const [validKey, setValidKey] = useState(native.key != '');
	const [showStreets, setShowStreets] = useState(native.street != '');
	const [showHouseNumber, setShowHouseNumber] = useState(native.houseNumber != '');
	const [initializing, setInitializing] = useState(true);
	const [showWasteTypes, setShowWasteTypes] = useState(native.wasteTypes.length > 0);
	const [showWasteTypesLoader, setShowWasteTypesLoader] = useState(false);
	const [showWasteCalendar, setShowWasteCalendar] = useState(native.wasteCalendar.length > 0);
	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		await i18n.changeLanguage(thisis._systemConfig.language);
		if (tabChange) {
			setTabChange(false);
			setInitializing(false);
		} else {
			startSettings();
		}
	};

	const startSettings = async () => {
		if (validKey && native.street !== '') {
			if (allStreets.length === 0) {
				setShowLoader(true);
				await initStreets(native.key, false);
				// updateNativeValue('wasteCalendar', []); // will ensure, that the latest waste calendar is loaded
				setShowLoader(false);
			} else {
				setShowStreets(true);
				setShowHouseNumber(native.houseNumber !== '');
			}
			setShowWasteTypes(native.wasteTypes.length > 0);
		}
		setInitializing(false);
	};

	async function initWasteTypes() {
		setShowWasteCalendar(false)
		if (typeof native.street === 'undefined' || native.street === '') {
			if (native.wasteTypes.length > 0) {
				updateNativeValue('wasteTypes', []);
			}
		} else {
			setShowWasteTypesLoader(true);
			const allWasteTypes = await sendMessage('getWasteTypes', {
				key: native.key,
				street: native.street,
				houseNumber: native.houseNumber,
			});
			updateNativeValue('wasteTypes', allWasteTypes);
		}
	}

	useEffect(() => {
		if (tabChange === false && initializing === false && typeof native.url !== 'undefined') {
			handleChangeUrl();
		}
	}, [native.url]);

	const handleChangeUrl = async () => {
		const newKey = await isValidHttpUrl(native.url)
		.then(async validUrl => {
			if (validUrl === false) return '';
			const key = await sendMessage('getKey', { url: native.url });
			return key;
		})
		.then(key => {
			if (key != native.key) {
				updateNativeValue('key', key);
			}
			return key;
		});
		return newKey;
	};

	useEffect(() => {
		if (tabChange === false && initializing === false && typeof native.key !== 'undefined') {
			handleChangeKey();
		}
	}, [native.key]);

	const handleChangeKey = async () => {
		setValidKey(native.key !== '');
		if (native.key == '') {
			updateNativeValue('street', '');
		} else {
			const initOk = await initStreets(native.key, true);
			if (initOk === false) {
				updateNativeValue('key', '');
			} else {
				if (native.street !== '') {
					updateNativeValue('street', '');
				} else {
					handleChangeStreet(true);
				}
			}
		}
	};

	useEffect(() => {
		if (tabChange === false && initializing === false && typeof native.street !== 'undefined') {
			handleChangeStreet();
		}
	}, [native.street]);

	const handleChangeStreet = async (showStreet) => {
		setShowWasteTypes(false);
		setShowWasteCalendar(false);
		setShowCalendarLoader(false);
		allHouseNumbers = native.street === '' ? [] : await initHouseNumbers();
		if (typeof showStreet !== 'undefined') {
			setShowStreets(true);
		}
		if (native.houseNumber === '' && allHouseNumbers.length !== 1) {
			handleChangeHouseNumber();
		} else {
			updateNativeValue('houseNumber', allHouseNumbers.length === 1 ? allHouseNumbers[0].value : '');
		}
	};

	function changeField(attr, newValue) {
		updateNativeValue(attr, newValue);
	}

	async function initHouseNumbers() {
		return await sendMessage('getHouseNumbers', {
			key: native.key,
			street: native.street,
		});
	}

	useEffect(() => {
		if (tabChange === false && initializing === false && typeof native.houseNumber !== 'undefined') {
			handleChangeHouseNumber();
		}
	}, [native.houseNumber]);

	const handleChangeHouseNumber = async () => {
		if (tabChange === false) {
			if (
				typeof native.street !== 'undefined' &&
				native.street !== '' &&
				(allHouseNumbers.length < 2 || (allHouseNumbers.length > 1 && native.houseNumber !== ''))
			) {
				initWasteTypes();
			} else {
				if (native.wasteTypes.length !== 0) {
					updateNativeValue('wasteTypes', []);
				}
			}
			setShowHouseNumber(allHouseNumbers.length > 1);
		}
	};

	const RenderUrl = () => (
		<TextField
			label={i18n.t('URL')}
			className="url-class"
			value={native.url}
			type="text"
			onChange={(event) => changeField('url', event.target.value)}
			margin="normal"
			size="small"
			autoFocus="true"
			fullWidth
		/>
	);

	const RenderSelectStreet = () => (
		<FormControl
			className="street-class"
			style={{
				paddingTop: 5,
			}}
		>
			<Select
				value={native.street}
				displayEmpty
				onChange={(event) => changeField('street', event.target.value)}
				input={<Input name="Street" id="Street-id" />}
				label={i18n.t('Street')}
				renderValue={(selected) => {
					if (selected === '' || native.street === '') {
					  return <em>{i18n.t('Select street')}</em>;
					}
					return allStreets.filter(element => element.value === selected)[0].title;
				  }}
				style={{marginLeft: '15px'}}
			>
				<MenuItem disabled value="">
					<em>{i18n.t('Select street')}</em>
				</MenuItem>
				{allStreets.map((item) => (
					<MenuItem key={item.value} value={item.value}>
						{item.title}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	const RenderSelectHouseNumber = () => (
		<FormControl
			className="housenumber-class"
			style={{
				paddingTop: 5,
			}}
		>
			<Select
				value={native.houseNumber}
				displayEmpty
				onChange={(event) => changeField('houseNumber', event.target.value)}
				input={<Input name="housenumber" id="housenumber-id" />}
				label={i18n.t('HouseNumber')}
				id="housenumber-select"
				renderValue={(selected) => {
					if (selected === '' || native.houseNumber === '') {
					  return <em>{i18n.t('Select house number')}</em>;
					}
					return allHouseNumbers.filter(element => element.value === selected)[0].title;
				  }}
				style={{marginLeft: '15px'}}
			>
				<MenuItem disabled value="">
					<em>{i18n.t('Select house number')}</em>
				</MenuItem>
				{allHouseNumbers.map((item) => (
					<MenuItem key={item.value} value={item.value} id="HouseNumber-select-menuitem">
						{item.title}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	async function initStreets(key, showLoader) {
		if (showLoader === true) {
			setShowLoader(true);
		}
		const response = await sendMessage('getStreets', { key: key });
		allStreets = response.streets;
		if (showLoader === true) {
			setShowLoader(false);
		} else {
			if (native.houseNumber !== '') {
				allHouseNumbers = await initHouseNumbers();
			}
		}
		return true;
	}

	async function isValidHttpUrl(url) {
		try {
			const validUrl = new URL(url);
			return validUrl.protocol === 'http:' || validUrl.protocol === 'https:';
		} catch (err) {
			return false;
		}
	}

	return (
		<form className="form-Settings-class">
			<Grid container rowSpacing={0.5} direction="row" alignItems="baseline" spacing={1.5}>
				<Grid item xs={12} md={12}>
					<RenderUrl />
					{showLoader === true && <CircularProgress color="success" style={{ display: 'block', margin: 'auto' }} />}
				</Grid>
				<Grid container xs={12} md={3} style={{marginTop: '10px'}} rowSpacing={2.0}>
					<Grid item xs={12} md={12}>
						{showLoader == false && initializing == false && validKey && showStreets && (
							<RenderSelectStreet />
						)}
					</Grid>
					<Grid item xs={12} md={12}>
						{showLoader == false && initializing == false && validKey && showHouseNumber && (
							<RenderSelectHouseNumber />
						)}
					</Grid>
				</Grid>
				<Grid container xs={12} md={9} spacing={1.5}>
					{showLoader == false && initializing == false && validKey && (
						<SettingsWasteTypes
							showWasteTypes={showWasteTypes}
							setShowWasteTypes={setShowWasteTypes}
							showWasteTypesLoader={showWasteTypesLoader}
							setShowWasteTypesLoader={setShowWasteTypesLoader}
							showWasteCalendar={showWasteCalendar}
							setShowWasteCalendar={setShowWasteCalendar}
							showCalendarLoader={showCalendarLoader}
							setShowCalendarLoader={setShowCalendarLoader}
							updateNativeValue={updateNativeValue}
							native={native}
							state={state}
							i18n={i18n}
							sendMessage={sendMessage}
						/>
					)}
				</Grid>
			</Grid>
		</form>
	);
}

export default withStyles(styles)(Settings);
