import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';

export async function initWhatsapp(props) {
	// update the configuration of the whatsapp instances, because they might have changed
	// since the settings dialog was opened the last time
	const response = await props.sendMessage('initWhatsapp', { notneeded: 'notneeded' });
	if (response != 'OK') {
		props.updateNativeValue(`whatsapp.used`, false);
	}
}

export default function SettingsDetails(props) {
	const { i18n } = useTranslation();
	const [phoneNumbersUsed, setPhoneNumbersUsed] = useState([]);
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};

	function changeCheckboxField(oldValue, newValue, attr) {
		props.updateNativeValue(attr, newValue);
	}

	useEffect(() => {
		init(props);
	}, []);

	useEffect(() => {
		if (props.state.changed && typeof props.native.whatsapp.used != 'undefined') {
			handleChangeWhatsapp();
		}
	}, [props.native.whatsapp.used]);

	async function init(props) {
		await i18n.changeLanguage(props.this._systemConfig.language);
		if (props.native.whatsapp.used) {
			await initWhatsapp(props);
		}
		initWhatsappPhoneNumbers();
	}
	async function initWhatsappPhoneNumbers() {
		const selectedNumbers = [];
		for (let i = 0; i < props.native.whatsapp.instances.length; i++) {
			if (props.native.whatsapp.instances[i].use) {
				selectedNumbers.push(i.toString());
			}
		}
		setPhoneNumbersUsed(selectedNumbers);
		return true;
	}

	const handleChangeWhatsapp = async () => {
		if (!props.native.whatsapp.used) {
			for (let i = 0; i < props.native.whatsapp.instances.length; i++) {
				if (props.native.whatsapp.instances[i].use) {
					updateWhatsappInstances(i, 'use', false);
				}
			}
			setPhoneNumbersUsed([]);
		} else {
			if (props.native.whatsapp.instances.length == 1) {
				updateWhatsappInstances(0, 'use', true);
				setPhoneNumbersUsed(['0']);
			}
		}
	};

	const handleChangeWhatsappPhoneNumbers = (event) => {
		const newValue = event.target.value;
		setPhoneNumbersUsed(newValue);
		for (let i = 0; i < props.native.whatsapp.instances.length; i++) {
			const isSelected = newValue.indexOf(i.toString()) > -1;
			if (isSelected != props.native.whatsapp.instances[i].use) {
				updateWhatsappInstances(i, 'use', isSelected);
			}
		}
		try {
			window.parent.postMessage('change', '*');
		} catch (e) {
			// ignore
		}
		props.this.setState({ changed: true });
	};

	const RenderWhatsappUsed = () => (
		<FormControlLabel
			key="whatsappUsed"
			style={{
				paddingTop: 5,
			}}
			className="whatsappUsedClass"
			control={
				<Checkbox
					checked={props.native.whatsapp.used}
					onChange={() =>
						changeCheckboxField(props.native.whatsapp.used, !props.native.whatsapp.used, 'whatsapp.used')
					}
					color="primary"
				/>
			}
			label={i18n.t('Whatsapp Notification')}
		/>
	);

	const RenderCreateDatapoints = () => (
		<FormControlLabel
			key="createDatapoints"
			style={{
				paddingTop: 5,
			}}
			className="createDatapointsClass"
			control={
				<Checkbox
					checked={props.native.createDatapoints}
					onChange={() =>
						changeCheckboxField(
							props.native.createDatapoints,
							!props.native.createDatapoints,
							'createDatapoints',
						)
					}
					color="primary"
				/>
			}
			label={i18n.t('Create datapoints')}
		/>
	);

	const RenderWhatsappPhoneNumbers = () => (
		<Grid item xs={12} md={9}>
			<FormControl
				className="whatsappPhoneNumbers-class"
				style={{
					paddingTop: 5,
				}}
			>
				<InputLabel id="whatsappPhoneNumber-select-label">{i18n.t('Use phone number')}</InputLabel>
				<Select
					labelId="whatsappPhonenumber-label"
					id="whatsappPhoneNumber"
					multiple
					value={phoneNumbersUsed}
					onChange={handleChangeWhatsappPhoneNumbers}
					input={<OutlinedInput label={i18n.t('Use phone number')} />}
					renderValue={(selected) => selectedToString(selected)}
					MenuProps={MenuProps}
				>
					{props.native.whatsapp.instances.map((item, index) => (
						<MenuItem
							key={index.toString()}
							value={index.toString()}
							id={'whatsappPhoneNumber-select-menuitem'}
						>
							<Checkbox checked={phoneNumbersUsed.indexOf(index.toString()) > -1} />
							<ListItemText
								primary={
									item.phoneNumber + ' (' + i18n.t('Instance') + ': ' + item.instanceNumber + ')'
								}
							/>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Grid>
	);

	function selectedToString(selected) {
		let label = '';
		for (let i = 0; i < props.native.whatsapp.instances.length; i++) {
			const isSelected = selected.indexOf(i.toString()) > -1;
			if (isSelected) label = label + (label != '' ? ', ' : '') + props.native.whatsapp.instances[i].phoneNumber;
		}
		return label;
	}

	function updateWhatsappInstances(index, attr, value) {
		const instanceCopy = props.native.whatsapp.instances;
		instanceCopy[index][attr] = value;
		props.updateNativeValue(`whatsapp.instances`, instanceCopy);
		return true;
	}

	return (
		<>
			<Grid container rowSpacing={0.5} direction="row" alignItems="baseline" spacing={1}>
				<Grid container xs={12} md={12}>
					<Grid item xs={12} md={3}>
						<RenderWhatsappUsed />
					</Grid>
					{props.native.whatsapp.used && props.native.whatsapp.instances.length > 1 && (
						<RenderWhatsappPhoneNumbers />
					)}
				</Grid>
				<Grid container xs={12} md={12}>
					<Grid item xs={12} md={12}>
						<RenderCreateDatapoints />
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
