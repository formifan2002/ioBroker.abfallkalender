import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditColumn from './settingEditColumn';
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid';

const styles = () => ({
	input: {
		marginTop: 0,
		minWidth: 400,
	},
});

function SettingsWasteTypes(props) {
	const {
		i18n,
		native,
		setShowWasteTypes,
		showWasteTypes,
		updateNativeValue,
		showWasteCalendar,
		setShowWasteCalendar,
		state,
		sendMessage,
	} = props;
	const [wasteCalendar, setWasteCalendar] = useState([]);
	const apiRef = useGridApiRef();
	const [openColumnDialog, setOpenColumnDialog] = useState(false);
	const [rowid, setRowId] = useState();
	const [fieldname, setFieldName] = useState();
	const [fieldtext, setFieldText] = useState();


	useEffect(() => {
		if (native.wasteCalendar.length > 0) {
			handleChangeWasteCalendar();
		}else{
			handleChangeWasteTypes(false);
		}
	}, []);

	useEffect(() => {
		//		if (tabChange == false && initializing == false && typeof native.wasteTypes != 'undefined') {
		if (typeof native.wasteTypes != 'undefined') {
			if (native.wasteTypes.length > 0) {
				console.log(
					'handleChangeWasteTypes (update of wasteCalendars) will be called from useEffect wasteTypes',
				);
				handleChangeWasteTypes(false);
			} else {
				if (native.wasteCalendar.length > 0) {
					console.log('setting wasteCalendar to [] (from useEffect - wasteTypes)');
					setShowWasteTypes(false);
					updateNativeValue('wasteCalendar:', []);
				}
			}
		}
	}, [native.wasteTypes]);

	useEffect(() => {
		//		if (tabChange == false && initializing == false) {
		setShowWasteCalendar(showWasteTypes && wasteCalendar.length > 0);
		//		}
	}, [wasteCalendar]);

	const handleChangeWasteTypes = async (update) => {
		//console.log('handleChangeWasteTypes');
		// update waste calendar objects in the database
		if (update == false && native.wasteTypes.filter((element) => element.used == true).length > 0) {
			await sendMessage('getWasteCalendar', {
				key: native.key,
				street: native.street,
				houseNumber: native.houseNumber,
				wasteTypes: native.wasteTypes,
			}).then((newWasteCalendar) => {
				updateNativeValue('wasteCalendar', newWasteCalendar);
			});
		} else {
			if (update == false && native.wasteCalendar.length > 0) {
				updateNativeValue('wasteCalendar', []);
			} else {
				handleChangeWasteCalendar();
			}
		}
		setShowWasteTypes(native.wasteTypes.length > 0);
	};

	useEffect(() => {
		//		if (state.changed && initializing == false && typeof native.wasteCalendar != 'undefined') {
		if (typeof native.wasteCalendar != 'undefined') {
			if (native.wasteTypes.filter((element) => element.used == true).length > 0 && native.wasteCalendar.length == 0){
				handleChangeWasteTypes(false);
			}else{
				handleChangeWasteCalendar();
			}	
		}
	}, [native.wasteCalendar]);

	const handleChangeWasteCalendar = async () => {
		let monatsName = '';
		let tag = '';
		const calendar = [];
		for (let i = 0; i < native.wasteCalendar.length; i++) {
			if (monatsName != native.wasteCalendar[i].Monatsname) {
				calendar.push({
					col1span: 3,
					col2span: 0,
					col3span: 0,
					col1: native.wasteCalendar[i].Monatsname + ' ' + native.wasteCalendar[i].Jahr,
					col2: '',
					col3: '',
				});
				monatsName = native.wasteCalendar[i].Monatsname;
			}
			if (tag != native.wasteCalendar[i].Abfuhrdatum) {
				calendar.push({
					col1span: 1,
					col2span: 1,
					col3span: 1,
					col1: native.wasteCalendar[i].AbfuhrTagKurz + '.',
					col2: native.wasteCalendar[i].Tag + '.',
					col3: native.wasteCalendar[i].Abfuhrart,
				});
				tag = native.wasteCalendar[i].Abfuhrdatum;
			} else {
				calendar.push({
					col1span: 2,
					col2span: 0,
					col3span: 1,
					col1: '',
					col2: '',
					col3: native.wasteCalendar[i].Abfuhrart,
				});
			}
		}
		setWasteCalendar([...calendar]);
		setShowWasteCalendar(calendar.length > 0);
	};

	const renderTooltipWhatsapp = (params) => (
		<Tooltip
			title={
				i18n.t('WhatsApp') +
				' ' +
				(params.value < 0
					? i18n.t('deactivated for this waste type')
					: i18n.t('dayCollection', { count: params.value }))
			}
		>
			{params.value >= 0 ? (
				<span className="table-cell-trucate">
					<CheckIcon /> ({params.value})
				</span>
			) : (
				<span className="table-cell-trucate">
					<DeleteForeverTwoToneIcon />
				</span>
			)}
		</Tooltip>
	);

	const renderTooltipBlink = (params) => (
		<Tooltip
			title={
				i18n.t('Blink') +
				' ' +
				(params.value < 0
					? i18n.t('deactivated for this waste type')
					: i18n.t('dayCollection', { count: params.value }))
			}
		>
			{params.value >= 0 ? (
				<span className="table-cell-trucate">
					<CheckIcon /> ({params.value})
				</span>
			) : (
				<span className="table-cell-trucate">
					<DeleteForeverTwoToneIcon />
				</span>
			)}
		</Tooltip>
	);

	const renderTooltipUse = (params) => (
		<Tooltip title={params.value == true ? i18n.t('yes') : i18n.t('no')}>
			<span className="table-cell-trucate">
				{params.value == true ? <CheckIcon /> : <DeleteForeverTwoToneIcon />}
			</span>
		</Tooltip>
	);

	const tableColumns = [
		{
			field: 'title',
			headerName: i18n.t('Waste type'),
			width: 150,
			editable: false,
			sortable: false,
			hideable: false,
			cellClassName: 'wasteTypeCell',
			headerClassName: 'wasteTypeColumnHeader',
			disableColumnMenu: true,
		},
		{
			field: 'used',
			headerName: i18n.t('Use'),
			description: i18n.t('Use this waste type in the calender'),
			width: 80,
			type: 'boolean',
			editable: true,
			cellClassName: 'checkboxCell',
			headerClassName: 'checkboxColumnHeader',
			renderCell: renderTooltipUse,
		},
		{
			field: 'whatsapp',
			headerName: i18n.t('WhatsApp'),
			description: i18n.t('Warning x days before pickup via WhatsApp'),
			width: 80,
			type: 'number',
			editable: true,
			cellClassName: 'checkboxCell',
			headerClassName: 'checkboxColumnHeader',
			renderCell: renderTooltipWhatsapp,
		},
		{
			field: 'blink',
			headerName: i18n.t('Blink'),
			description: i18n.t('Blinking x days before pickup'),
			width: 80,
			type: 'number',
			editable: true,
			cellClassName: 'checkboxCell',
			headerClassName: 'checkboxColumnHeader',
			renderCell: renderTooltipBlink,
		},
		{ field: 'value', headerName: 'Value', width: 130 },
	];

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			color: theme.palette.common.blue,
			fontSize: 12,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 10,
		},
	}));

	const RenderWasteCalendar = () => (
		<TableContainer sx={{ maxHeight: 350 }}>
			<Table stickyHeader size="small" sx={{ height: 'max-content' }}>
				<TableHead>
					<TableRow>
						<StyledTableCell colSpan={3} align="left">
							<b>{i18n.t('Waste calendar')}</b>
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{wasteCalendar.map((item, index) => (
						<TableRow key={index}>
							{item.col1span > 0 && (
								<StyledTableCell colSpan={item.col1span} align="left">
									{item.col1}
								</StyledTableCell>
							)}
							{item.col2span > 0 && (
								<StyledTableCell colSpan={item.col2span} align="left">
									{item.col2}
								</StyledTableCell>
							)}
							{item.col3span > 0 && (
								<StyledTableCell colSpan={item.col3span} align="left">
									{item.col3}
								</StyledTableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);

	const handleSelectDeselectColumn = (field, select) => {
		const copyWasteTypes = native.wasteTypes;
		for (let i = 0; i < native.wasteTypes.length; i++) {
			switch (field) {
				case 'whatsapp': {
					if (native.wasteTypes[i].whatsapp != (select == true ? 1 : -1)) {
						copyWasteTypes[i].whatsapp = select == true ? 1 : -1;
						copyWasteTypes[i].whatsappCollectionDateSend = '';
						updateNativeValue(`wasteTypes.${i}.whatsapp`, select == true ? 1 : -1);
						updateNativeValue(`wasteTypes.${i}.whatsappCollectionDateSend`, '');
					}
					break;
				}
				case 'blink': {
					if (native.wasteTypes[i].blink != (select == true ? 1 : -1)) {
						copyWasteTypes[i].blink = select == true ? 1 : -1;
						updateNativeValue(`wasteTypes.${i}.blink`, select == true ? 1 : -1);
					}
					break;
				}
				case 'used': {
					if (native.wasteTypes[i].used != select) {
						copyWasteTypes[i].used = select;
						console.log(`update used ${i}`);
						updateNativeValue(`wasteTypes.${i}.used`, select);
					}
					break;
				}
			}
		}
		handleChangeWasteTypes(false);
		new Promise((resolve) => setTimeout(resolve, 100));
	};

	function CustomUserItemSelectAll(props) {
		const { myCustomHandler, myCustomValue } = props;
		return (
			<MenuItem onClick={() => myCustomHandler(props)}>
				<ListItemIcon>
					<CheckBoxIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>{myCustomValue}</ListItemText>
			</MenuItem>
		);
	}

	function CustomUserItemDeselectAll(props) {
		const { myCustomHandler, myCustomValue } = props;
		return (
			<MenuItem onClick={() => myCustomHandler(props)}>
				<ListItemIcon>
					<CheckBoxOutlineBlankIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>{myCustomValue}</ListItemText>
			</MenuItem>
		);
	}

	function CustomColumnMenu(params) {
		return (
			<GridColumnMenu
				{...params}
				components={{
					// Add new items
					ColumnMenuUserItemSelectAll: CustomUserItemSelectAll,
					ColumnMenuUserItemDeselectAll: CustomUserItemDeselectAll,
				}}
				componentsProps={{
					columnMenuUserItemSelectAll: {
						displayOrder: 15,
						myCustomValue: i18n.t('activate all'),
						myCustomHandler: (params) => handleSelectDeselectColumn(params.colDef.field, true),
					},
					columnMenuUserItemDeselectAll: {
						displayOrder: 15,
						myCustomValue: i18n.t('deactivate all'),
						myCustomHandler: (params) => handleSelectDeselectColumn(params.colDef.field, false),
					},
				}}
			/>
		);
	}

	const handleCellClickEvent = (params) => {
		if (params.field === 'whatsapp' || params.field === 'blink') {
			setRowId(params.row.id - 1);
			setFieldName(params.field);
			setFieldText(i18n.t(params.field == 'whatsapp' ? 'Whatsapp' : 'Blink'));
			setOpenColumnDialog(true);
		}
		if (params.field == 'used') {
			updateNativeValue(`wasteTypes.${params.row.id - 1}.used`, !params.row.used);
		}
	};

	const handleClose = (newValue) => {
		if (typeof newValue != 'undefined') {
			updateNativeValue(`wasteTypes.${rowid}.${fieldname}`, newValue);
		}
		setOpenColumnDialog(false);
	};

	const RenderTableWasteTypes = () => (
		<Box
			sx={{
				height: 350,
				width: '100%',
				'& .checkboxColumnHeader': {
					textAlign: 'center',
					fontSize: 10,
					fontWeight: 'bold',
				},
				'& .wasteTypeColumnHeader': {
					textAlign: 'left',
					fontSize: 11,
					fontWeight: 'bold',
				},
				'& .wasteTypeCell': {
					fontSize: 10,
				},
				'& .checkboxCell': {
					textAlign: 'center',
				},
			}}
		>
			<DataGrid
				rows={native.wasteTypes}
				columns={tableColumns}
				pageSize={8}
				hideFooter={true}
				rowsPerPageOptions={[8]}
				density="compact"
				disableColumnSelector
				disableColumnFilter
				apiRef={apiRef}
				components={{ ColumnMenu: CustomColumnMenu }}
				columnVisibilityModel={{
					// Hide column value - the other columns will remain visible
					value: false,
					whatsapp: native.whatsapp.used,
				}}
				onCellClick={handleCellClickEvent}
				experimentalFeatures={{ newEditingApi: true }}
				localeText={{
					columnMenuUnsort: i18n.t('columnMenuUnsort'),
					columnMenuSortAsc: i18n.t('columnMenuSortAsc'),
					columnMenuSortDesc: i18n.t('columnMenuSortDesc'),
					columnMenuLabel: i18n.t('columnMenuLabel'),
					columnHeaderSortIconLabel: i18n.t('columnHeaderSortIconLabel'),
					booleanCellTrueLabel: i18n.t('yes'),
					booleanCellFalseLabel: i18n.t('no'),
				}}
			/>
		</Box>
	);

	return (
		<>
			<Grid item xs={12} md={5}>
				{showWasteTypes && native.wasteTypes.length > 0 && <RenderTableWasteTypes />}
			</Grid>
			<Grid item xs={12} md={6}>
				{showWasteCalendar && native.wasteCalendar != [] && <RenderWasteCalendar />}
			</Grid>
			<Grid item xs={12} md={1}>
				{openColumnDialog && (
					<EditColumn
						open={openColumnDialog}
						fieldtext={fieldtext}
						valueWastetype={native.wasteTypes[rowid][fieldname]}
						handleClose={handleClose}
						i18n={i18n}
					/>
				)}
			</Grid>
		</>
	);
}

export default withStyles(styles)(SettingsWasteTypes);
