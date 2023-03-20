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
	const [validKey, setValidKey] = useState(native.key != '');
	const [showStreets, setShowStreets] = useState(native.street != '');
	const [showHouseNumber, setShowHouseNumber] = useState(native.houseNumber != '');
	const [initializing, setInitializing] = useState(true);
	const [showWasteTypes, setShowWasteTypes] = useState(native.wasteTypes.length > 0);
	const [showWasteCalendar, setShowWasteCalendar] = useState(native.wasteCalendar.length > 0);

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		await i18n.changeLanguage(thisis._systemConfig.language);
		if (tabChange) {
			setTabChange(false);
			updateNativeValue('wasteCalendar', []);
			setInitializing(false);
		} else {
			startSettings();
		}
	};

	const startSettings = async () => {
		if (validKey && native.street != '') {
			if (allStreets.length == 0) {
				setShowLoader(true);
				await initStreets(native.key, false);
				updateNativeValue('wasteCalendar', []);
				//handleChangeWasteCalendar();
				setShowLoader(false);
			} else {
				setShowStreets(true);
				setShowHouseNumber(native.houseNumber != '');
				setShowWasteCalendar(native.wasteCalendar.length > 0);
			}
			setShowWasteTypes(native.wasteTypes != []);
		}
		setInitializing(false);
	};

	async function initWasteTypes() {
		if (typeof native.street == 'undefined' || native.street == '') {
			if (native.wasteTypes != []) {
				updateNativeValue('wasteTypes', []);
			}
		} else {
			console.log(
				`Sending request to backend to receive the wasteTypes with street: ${native.street} and houseNumber ${native.houseNumber}`,
			);
			const allWasteTypes = await sendMessage('getWasteTypes', {
				key: native.key,
				street: native.street,
				houseNumber: native.houseNumber,
			});
			updateNativeValue('wasteTypes', allWasteTypes);
		}
	}

	useEffect(() => {
		if (tabChange == false && initializing == false && typeof native.url != 'undefined') {
			handleChangeUrl();
		}
	}, [native.url]);

	const handleChangeUrl = async () => {
		console.log('handleChangeUrl started');
		let newKey = '';
		const validUrl = await isValidHttpUrl(native.url);
		if (validUrl) {
			newKey = await sendMessage('getKey', { url: native.url });
		}
		console.log(`handleChangeUrl - newKey: ${newKey} native.key: ${native.key}`);
		if (newKey != native.key) {
			updateNativeValue('key', newKey);
		}
	};

	useEffect(() => {
		if (tabChange == false && initializing == false && typeof native.key != 'undefined') {
			console.log('will call handleChangeKey (from useEffet key)');
			handleChangeKey();
		}
	}, [native.key]);

	const handleChangeKey = async () => {
		console.log('handleChangeKey started - key is: ' + native.key);
		setValidKey(native.key != '');
		if (native.key == '') {
			updateNativeValue('street', '');
		} else {
			const initOk = await initStreets(native.key, true);
			console.log('result from initStreet (called from handleChangeKey) is: ' + initOk);
			if (initOk == false) {
				updateNativeValue('key', '');
			} else {
				if (native.street != '') {
					updateNativeValue('street', '');
				} else {
					handleChangeStreet(true);
				}
			}
		}
	};

	useEffect(() => {
		if (tabChange == false && initializing == false && typeof native.street != 'undefined') {
			console.log('will call handleChangeStreet (from useEffect street)');
			handleChangeStreet();
		}
	}, [native.street]);

	const handleChangeStreet = async (showStreet) => {
		//const getHouseNumber = await checkIsNumber(native.street);
		//if (getHouseNumber) {
		allHouseNumbers = native.street == '' ? [] : await initHouseNumbers();
		//}
		console.log('count of housenumbers at beginning of handleChangeStreet: ' + allHouseNumbers.length);
		if (typeof showStreet != 'undefined') {
			setShowStreets(true);
		}
		if (native.houseNumber == '' && allHouseNumbers.length != 1) {
			console.log('will call handleChangeHouseNumber (from handleChangeStreet)');
			handleChangeHouseNumber();
		} else {
			if (allHouseNumbers.length > 0) {
				console.log(allHouseNumbers);
			}
			console.log(
				`setting houseNumber to "${
					allHouseNumbers.length == 1 ? allHouseNumbers[0].value : ''
				}" (in handleChangeStreet)`,
			);
			updateNativeValue('houseNumber', allHouseNumbers.length == 1 ? allHouseNumbers[0].value : '');
		}
	};

	useEffect(() => {
		if (tabChange == false && initializing == false && typeof native.houseNumber != 'undefined') {
			console.log('will call handleChangeHouseNumber (from useEffect houseNumber)');
			handleChangeHouseNumber();
		}
	}, [native.houseNumber]);

	function changeField(attr, newValue) {
		updateNativeValue(attr, newValue);
	}

	async function initHouseNumbers() {
		return await sendMessage('getHouseNumbers', {
			key: native.key,
			street: native.street,
		});
	}

	const handleChangeHouseNumber = async () => {
		if (tabChange == false) {
			console.log(`check getHouseNumber in handleChangeHouseNumber with street: ${native.street}`);
			/*			const getHouseNumber =
				typeof native.street != 'undefined' || native.street == ''
					? false
					: await checkIsNumber(native.street);
*/
			console.log(
				`getHouseNumber is: ${allHouseNumbers.length > 1} - count of houseNumber is: ${
					allHouseNumbers.length
				} `,
			);
			if (
				typeof native.street != 'undefined' &&
				native.street != '' &&
				(allHouseNumbers.length < 2 || (allHouseNumbers.length > 1 && native.houseNumber != ''))
			) {
				console.log(
					`handleChangeHouseNumber initializing waste types with street: ${native.street} / houseNumber ${native.houseNumber} / allHouseNumbers.length ${allHouseNumbers.length}`,
				);
				initWasteTypes();
			} else {
				if (native.wasteTypes.length != 0) {
					console.log(
						`handleChangeHouseNumber - set waste types to [] with street: ${native.street} / houseNumber ${native.houseNumber} / allHouseNumbers.length ${allHouseNumbers.length}`,
					);
					updateNativeValue('wasteTypes', []);
				}
			}
			//setShowHouseNumber(getHouseNumber);
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
			<InputLabel id="street-select-label">{i18n.t('Select street')}</InputLabel>
			<Select
				value={native.street}
				onChange={(event) => changeField('street', event.target.value)}
				input={<Input name="Street" id="Street-id" />}
				label={i18n.t('Street')}
			>
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
			<InputLabel id="housenumber-select-label">{i18n.t('Select house number')}</InputLabel>
			<Select
				value={native.houseNumber}
				onChange={(event) => changeField('houseNumber', event.target.value)}
				input={<Input name="housenumber" id="housenumber-id" />}
				label={i18n.t('HouseNumber')}
				id="housenumber-select"
			>
				{allHouseNumbers.map((item) => (
					<MenuItem key={item.value} value={item.value} id="HouseNumber-select-menuitem">
						{item.title}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	async function initStreets(key, showLoader) {
		if (showLoader) {
			setShowLoader(true);
		}
		const response = await sendMessage('getStreets', { key: key });
		allStreets = response.streets;
		if (showLoader) {
			setShowLoader(false);
		} else {
			if (native.houseNumber != '') {
				allHouseNumbers = await initHouseNumbers();
			}
		}
		return true;
	}

	async function isValidHttpUrl(url) {
		let temp = '';
		try {
			temp = new URL(url);
		} catch (_) {
			return false;
		}
		const validUrl = temp.protocol === 'http:' || temp.protocol === 'https:';
		return validUrl;
	}

	return (
		<form className="form-Settings-class">
			<Grid container rowSpacing={0.5} direction="row" alignItems="baseline" spacing={1.5}>
				<Grid item xs={12} md={12}>
					<RenderUrl />
					{showLoader && <CircularProgress color="success" style={{ display: 'block', margin: 'auto' }} />}
				</Grid>
				<Grid container xs={12} md={3}>
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
				<Grid container xs={12} md={9}>
					{showLoader == false && initializing == false && validKey && (
						<SettingsWasteTypes
							showWasteTypes={showWasteTypes}
							showWasteCalendar={showWasteCalendar}
							setShowWasteTypes={setShowWasteTypes}
							setShowWasteCalendar={setShowWasteCalendar}
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
