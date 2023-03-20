'use strict';

const utils = require('@iobroker/adapter-core');
const getApiData = require('iobroker.abfallkalender/lib/getApiData');
const i18n = require('iobroker.abfallkalender/lib/i18n');
const languages = ['en', 'de', 'ru', 'pt', 'nl', 'fr', 'it', 'es', 'pl', 'uk', 'zh-cn'];
let systemLanguage;

class Abfallkalender extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'abfallkalender',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		//this.log.info('config option1: ' + this.config.option1);
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		/*await this.setObjectNotExistsAsync('testVariable', {
			type: 'state',
			common: {
				name: 'testVariable',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});
		*/
		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		// this.subscribeStates('testVariable');
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates('lights.*');
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates('*');
		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync('testVariable', true);
		//let result = await this.checkPasswordAsync('admin', 'iobroker');
		//this.log.info('check user admin pw iobroker: ' + result);
		//result = await this.checkGroupAsync('admin', 'admin');
		//this.log.info('check group user admin group admin: ' + result);
		//
		//console.log(this.common);
		//const myInstanceName = this.common.name + '.' + this.instance;
		//const myInstanceName = 'abfallkalender.0';
		//const objPath = 'system.adapter.' + myInstanceName;
		if (this.config.key == '' || this.config.wasteTypes.filter((element) => element.used).length == 0) {
			this.log.error('Configuration of adapter not complete. Please check instance configuration.');
			return;
		}
		try {
			await this.getForeignObjectAsync('system.config').then((result) => {
				systemLanguage = result.common.language;
				if (languages.findIndex((element) => element == systemLanguage) == -1) {
					systemLanguage = 'de';
				}
			});
		} catch {
			systemLanguage = 'de';
		}
		await this.initWasteTypes();
		await this.initWhatsapp();
		return;
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack}) (whatsapp.alive=${this.config.whatsapp.alive})`);
			// the alive status is changed every 2-3 seconds. So only in case the overall
			// status of the config.alive is different to the current status of the
			// whatsapp instance an update of the config is done.
			if (state.val != this.config.whatsapp.alive) {
				this.updateWhatsappStatus(this.config.whatsapp.instances);
			}
		} else {
			// The state was deleted
			// this.log.info(`state ${id} deleted`);
			// unsubsribe from this (whatsapp alive) status
			this.unsubscribeForeignStatesAsync(id);
			// update the status for the whatsapp instances used in my adapter instance
			this.updateWhatsappStatus(this.config.whatsapp.instances);
		}
	}

	async onMessage(obj) {
		if (typeof obj === 'object') {
			switch (obj.command) {
				case 'getKey': {
					const apiDataKey = await getApiData.getKey(obj.message.url);
					if (obj.callback) this.sendTo(obj.from, obj.command, apiDataKey, obj.callback);
					break;
				}
				case 'getStreets': {
					const apiDataStreets = await getApiData.getStreets(obj.message.key);
					if (obj.callback) this.sendTo(obj.from, obj.command, apiDataStreets, obj.callback);
					break;
				}
				case 'getHouseNumbers': {
					const apiDataHouseNumbers = await getApiData.getHouseNumbers(obj.message.key, obj.message.street);
					if (obj.callback) this.sendTo(obj.from, obj.command, apiDataHouseNumbers, obj.callback);
					break;
				}
				case 'getWasteTypes': {
					await getApiData
						.getWasteTypes(obj.message.key, obj.message.street, obj.message.houseNumber)
						.then((apiDataWasteTypes) => {
							if (obj.callback) this.sendTo(obj.from, obj.command, apiDataWasteTypes, obj.callback);
						})
						.catch((err) => {
							this.log.error('Error while retreiving waste types');
							this.log.error(err);
						});
					break;
				}
				case 'initWhatsapp': {
					// used for initialization / update of Whatsapp configuration before opening
					// the settings dialog
					if (obj.callback) {
						this.initWhatsapp(obj.from, obj.command, obj.callback);
					}
					break;
				}
				case 'getWasteCalendar': {
					// used for initialization / update of waste types during change
					// in the settings dialog
					if (obj.callback) {
						await this.initWasteTypes(
							obj.message.key,
							obj.message.street,
							obj.message.houseNumber,
							obj.message.wasteTypes,
						).then((apiDataWasteCalendar) => {
							if (obj.callback) this.sendTo(obj.from, obj.command, apiDataWasteCalendar, obj.callback);
						});
					}
					break;
				}
				case 'getStateAsync': {
					const dbValue = await this.getStateAsync(obj.message.datapoint);
					if (obj.callback) this.sendTo(obj.from, obj.command, dbValue.val, obj.callback);
					break;
				}
			}
		}
	}

	async initWasteTypes(key, street, houseNumber, wasteTypes) {
		return await getApiData
			.getWasteCalendar(
				typeof key == 'undefined' ? this.config.key : key,
				typeof street == 'undefined' ? this.config.street : street,
				typeof houseNumber == 'undefined' ? this.config.houseNumber : houseNumber,
				typeof wasteTypes == 'undefined' ? this.config.wasteTypes : wasteTypes,
			)
			.then((response) => {
				if (response.error == '') {
					this.createWasteTypesDataPoints(response);
					return response.wasteCalendar;
				}
			});
	}

	async initWhatsapp(from, command, callback) {
		return await this.getWhatsappInstances().then(async (result) => {
			if (result.length == 0) {
				if (typeof from != 'undefined') {
					this.sendTo(from, command, 'NOINSTANCES', callback);
				}
				return this.config.whatsapp; // no adapter installations of whatsapp-cmb found
			}
			await this.updateWhatsappStatus(result).then((result) => {
				/*console.log(`At least one instance is alive: ${result1.alive}`);
				console.log(`Functionality is used by this instance: ${result1.used}`);
				console.log(`Phone number to use for this instance: ${result1.phoneNumber}`);
				console.log('All instances found:');
				result1.instances.map(async (instance) => {
					console.log(instance);
				});
				//*/
				if (typeof from != 'undefined') {
					this.sendTo(from, command, 'OK', callback);
				}
				return result;
			});
		});
	}

	async updateWhatsappStatus(result) {
		//console.log(`alive of whatsapp config is ${this.config.whatsapp.alive}`);
		/* // Output of the current whatsapp config for this instance
		const myInstanceName = this.common.name + '.' + this.instance;
		const objPath = 'system.adapter.' + myInstanceName;
		this.getForeignObjectAsync(objPath).then((result) => {
			// get the current whatsapp config for this instance...
			console.log('Current whatsapp config for this instance...');
			console.log(result.native['whatsapp']);
		});
		*/
		const config = this.config;
		const myThis = this;

		return new Promise(function (resolve) {
			const used = config.whatsapp.used; // get value, if the whatsapp function is used in the current instance
			const whatsapp = { alive: false, used: used, instances: result };
			for (let i = 0; i < whatsapp.instances.length; i++) {
				const aliveObj = whatsapp.instances[i].id + '.alive';
				myThis.subscribeForeignStatesAsync(aliveObj); // subsribe to state change of this instance in order to be informed, when a the instance is deleted or the live status changed
				myThis.getForeignStateAsync(aliveObj).then((alive) => {
					whatsapp.instances[i].alive = alive.val;
					if (alive.val) {
						whatsapp.alive = true;
					}
				});
			}
			setTimeout(() => resolve(whatsapp), 1000);
		}).then(function (whatsapp) {
			// Update the status of whatsapp for this instance
			myThis.updateConfig({ whatsapp: whatsapp });
			config.whatsapp.alive = whatsapp.alive;
			const isUsed = whatsapp.used ? 'uses' : 'does not use';
			const isAlive = whatsapp.alive ? '' : 'not ';
			myThis.log.info(
				`Updated Whatsapp config for this adapter instance. Overall alive status for use of Whatsapp adapter is now "${isAlive}alive". This instance ${isUsed} the functionality.`,
			);
			return whatsapp;
		});
	}

	async isVisInventwoInstalled() {
		return await this.getObjectViewAsync('system', 'instance', {
			startkey: 'system.adapter.vis-inventwo.',
			endkey: 'system.adapter.vis-inventwo.\u9999',
		}).then((instances) => {
			return instances.rows.length > 0;
		});
	}

	async createVisInventwoDatapoint() {
		const datapoint = this.common.name + '.' + this.instance + '.CalendarDoubleQuotes';
		let widgetCode =
			'[{"tpl":"i-vis-jsontable","data":{"g_fixed":false,"g_visibility":false,"g_css_font_text":false,"g_css_background":false,"g_css_shadow_padding":false,"g_css_border":false,"g_gestures":false,"g_signals":false,"g_last_change":false,"visibility-cond":"==","visibility-val":1,"visibility-groups-action":"hide","iTblRowLimit":"5","iTableRefreshRate":"0","iTblSortOrder":"asc","iColCount":"3","iColShow1":"true","iTblHeadTextAlign1":"left","iTblTextAlign1":"left","iTblCellFormat1":"normal","iTblCellImageSize1":"200","iTblCellBooleanCheckbox1":"false","iTblCellBooleanColorFalse1":"#ff0000","iTblCellBooleanColorTrue1":"#00ff00","iTblCellNumberDecimals1":"2","iTblCellNumberDecimalSeperator1":".","iTblCellNumberThousandSeperator1":",","iTblCellThresholdsDp1":"","iTblCellThresholdsText1":"","iOpacityAll":"1","iTblRowEvenColor":"#333333","iTblRowUnevenColor":"#455618","iTblHeaderColor":"#333333","iRowSpacing":"10","iTblRowEvenTextColor":"#ffffff","iTblRowUnevenTextColor":"#ffffff","iTblHeaderTextColor":"#ffffff","iBorderSize":"0","iBorderStyleLeft":"none","iBorderStyleRight":"none","iBorderStyleUp":"none","iBorderStyleDown":"none","iBorderColor":"#ffffff","signals-cond-0":"==","signals-val-0":true,"signals-icon-0":"/vis/signals/lowbattery.png","signals-icon-size-0":0,"signals-blink-0":false,"signals-horz-0":0,"signals-vert-0":0,"signals-hide-edit-0":false,"signals-cond-1":"==","signals-val-1":true,"signals-icon-1":"/vis/signals/lowbattery.png","signals-icon-size-1":0,"signals-blink-1":false,"signals-horz-1":0,"signals-vert-1":0,"signals-hide-edit-1":false,"signals-cond-2":"==","signals-val-2":true,"signals-icon-2":"/vis/signals/lowbattery.png","signals-icon-size-2":0,"signals-blink-2":false,"signals-horz-2":0,"signals-vert-2":0,"signals-hide-edit-2":false,"lc-type":"last-change","lc-is-interval":true,"lc-is-moment":false,"lc-format":"","lc-position-vert":"top","lc-position-horz":"right","lc-offset-vert":0,"lc-offset-horz":0,"lc-font-size":"12px","lc-font-family":"","lc-font-style":"","lc-bkg-color":"","lc-color":"","lc-border-width":"0","lc-border-style":"","lc-border-color":"","lc-border-radius":10,"lc-zindex":0,"oid":"##datapoint##","iTblShowHead":true,"iColShow2":"true","iTblHeadTextAlign2":"left","iTblTextAlign2":"left","iTblCellFormat2":"datetime","iTblCellImageSize2":"200","iTblCellBooleanCheckbox2":"false","iTblCellBooleanColorFalse2":"#ff0000","iTblCellBooleanColorTrue2":"#00ff00","iTblCellNumberDecimals2":"2","iTblCellNumberDecimalSeperator2":".","iTblCellNumberThousandSeperator2":",","iTblCellThresholdsDp2":"","iTblCellThresholdsText2":"","iColShow3":"true","iTblHeadTextAlign3":"left","iTblTextAlign3":"left","iTblCellFormat3":"normal","iTblCellImageSize3":"200","iTblCellBooleanCheckbox3":"false","iTblCellBooleanColorFalse3":"#ff0000","iTblCellBooleanColorTrue3":"#00ff00","iTblCellNumberDecimals3":"2","iTblCellNumberDecimalSeperator3":".","iTblCellNumberThousandSeperator3":",","iTblCellThresholdsDp3":"","iTblCellThresholdsText3":"","iColName1":"##iColName1##","iColAttr1":"AbfuhrTagLang","iColName2":"##iColName2##","iColAttr2":"AbfuhrtagJson","iTblCellDatetimeFormat2":"d.m.y","iColName3":"##iColName3##","iColAttr3":"Abfuhrart","iVertScroll":true,"iTblSortAttr":"AbfuhrtagJson"},"style":{"left":"34px","top":"77px","width":"547px","height":"224px"},"widgetSet":"vis-inventwo"}]';
		widgetCode = widgetCode.replace('##datapoint##', datapoint);
		const col1 = this.getTranslation('VisInventwoColName1', true)[systemLanguage];
		widgetCode = widgetCode.replace('##iColName1##', col1);
		const col2 = this.getTranslation('VisInventwoColName2', true)[systemLanguage];
		widgetCode = widgetCode.replace('##iColName2##', col2);
		const col3 = this.getTranslation('VisInventwoColName3', true)[systemLanguage];
		widgetCode = widgetCode.replace('##iColName3##', col3);
		await this.createDataPointAsync('', '', widgetCode, '', 'VisWidgetCode', true, false);
	}

	async getWhatsappInstances() {
		const myThis = this;
		return new Promise(function (resolve) {
			const result = [];
			myThis
				.getObjectViewAsync('system', 'instance', {
					startkey: 'system.adapter.whatsapp-cmb.',
					endkey: 'system.adapter.whatsapp-cmb.\u9999',
				})
				.then(async (instances) => {
					if (typeof instances.rows == 'object') {
						for (let i = 0; i < instances.rows.length; i++) {
							const row = instances.rows[i];
							let phoneField = '';
							const fields = Object.keys(row.value.native).filter(
								(el) => el.toUpperCase().indexOf('PHONE') != -1,
							);
							fields.forEach(function (fieldName) {
								phoneField = fieldName;
							});
							const idSplit = row.id.split('.');
							await myThis.getForeignObjectAsync(row.id).then(async (object) => {
								// get the default phone number for this instance..
								const alreadyUsed = await myThis.checkUsed(row.id, myThis.config.whatsapp.instances);
								result.push({
									id: row.id,
									instance: row.id.replace('system.adapter.', ''),
									instanceNumber: idSplit[idSplit.length - 1],
									phoneNumber:
										typeof object.native[phoneField] != 'undefined'
											? object.native[phoneField]
											: '',
									use: alreadyUsed,
									alive: false,
								});
							});
						}
					}
					return resolve(result);
				});
		});
	}

	async checkUsed(id, instances) {
		return new Promise(function (resolve) {
			for (let i = 0; i < instances.length; i++) {
				if (instances[i].id == id) {
					return resolve(instances[i].use);
				}
			}
			return resolve(false);
		});
	}

	sendWhatsapp(celement, cAbfallArt, differenceInDays, whatsappAlarmTage, whatsAppInstance, phoneNumber) {
		//console.log('TAGE!!!');
		//console.log(differenceInDays);
		//console.log(whatsappAlarmTage);
		const cMessage =
			(differenceInDays == 1 ? 'Morgen ' : differenceInDays == 2 ? 'Übermorgen ' : '') +
			'Abholung << ' +
			cAbfallArt +
			' >>' +
			(differenceInDays > 2 ? ' in ' + differenceInDays + ' Tagen' : '') +
			' (' +
			celement.AbfuhrTagLang +
			', ' +
			celement.Abfuhrdatum +
			').';
		console.log(`will send message to ${phoneNumber} with instance ${whatsAppInstance}`);
		console.log(cMessage);
		//sendTo(whatsAppInstance, 'send', {
		//		text: cMessage,
		//		phone: phoneNumber // optional, if empty the message will be sent to the default configured number
		//	});
	}

	async createWasteTypesDataPoints(wasteCalendar) {
		const datapoint = 'Abfuhrdaten';
		await this.setStateAsync('CalendarDoubleQuotes', {
			val: wasteCalendar.json,
			ack: true,
		});
		await this.setState('CalendarSingleQuotes', { val: wasteCalendar.string, ack: true });
		if (await this.isVisInventwoInstalled()) {
			// VIS widget inventwo is installed - create datapoint for JSON table
			this.log.info('VIS inventwo widget found. Will create according datapoint "VisWidgetCode".');
			/*console.log(
				new Date().toLocaleString() +
					': VIS inventwo widget found. Will create according datapoint "VisWidgetCode".',
			);*/
			await this.createVisInventwoDatapoint();
		} else {
			//console.log('No installation of VIS inventwo widget found.');
		}
		try {
			const channels = await this.getChannelsAsync('');
			// delete all channels (each waste type is a channel in the obect 'Abfallarten')
			for (let i = 0; i < channels.length; i++) {
				try {
					if (typeof channels[i].common.name != 'object') {
						// console.error('Will delete channel ' + channels[i].common.name.en);
						await this.deleteChannelAsync(datapoint, channels[i].common.name);
					}
				} catch (err) {
					console.error('Error while trying to delete the channel ' + channels[i].common.name);
					console.error(err);
				}
			}
			// create folder for all waste types
			await this.setObjectAsync(datapoint, {
				common: {
					name: this.getTranslation(datapoint, true),
					desc: this.getTranslation(datapoint, false),
				},
				native: {},
				type: 'folder',
			}).then(async () => {
				const dToday = new Date(Date.now());
				for (let i = 0; i < this.config.wasteTypes.length; i++) {
					if (!this.config.wasteTypes[i].used) {
						continue;
					}
					const channelName = datapoint + '.' + this.config.wasteTypes[i].titleDatapoint;
					// create device for specific waste type
					await this.setObjectAsync(channelName, {
						common: {
							name: this.getTranslation('Muellart', true, ' ' + this.config.wasteTypes[i].title),
							desc: this.getTranslation('Muellart', false, ' ' + this.config.wasteTypes[i].title),
						},
						native: {},
						type: 'channel',
					})
						.then(async () => {
							if (this.config.whatsapp.used == true) {
								await this.createDataPointAsync(
									channelName,
									'',
									this.config.wasteTypes[i].whatsapp,
									'',
									'WhatsappTage',
								);
							}
							return true;
						})
						.then(async () => {
							await this.createDataPointAsync(
								channelName,
								'',
								this.config.wasteTypes[i].blink,
								'',
								'BlinkenTage',
							);
							return true;
						})
						.then(async () => {
							JSON.parse(wasteCalendar.json)
								.filter((aelement) => aelement.AbfuhrartNr == this.config.wasteTypes[i].value)
								.map(async (celement, index) => {
									// create channel for specific day
									const differenceInDays = await this.differenceInDays(celement, dToday);
									if (this.config.createDatapoints) {
										// create folder for each collection day
										const deviceName = channelName + '.' + celement.Datenpunkt;
										await this.createFolderDatapoints(
											channelName,
											deviceName,
											celement,
											differenceInDays,
										);
									}
									if (index == 0) {
										//console.log('create datapoints for channel: ' + channelName);
										await this.createDetailledDataPointsAsync(
											channelName,
											'',
											celement,
											differenceInDays,
										);
										// create datapoint Blinken with true/false
										await this.createDataPointAsync(
											channelName,
											'',
											differenceInDays <= this.config.wasteTypes[i].whatsapp,
											'',
											'Blinken',
										);
										if (this.config.whatsapp.used == true) {
											await this.createDataPointAsync(
												channelName,
												'',
												differenceInDays <= this.config.wasteTypes[i].whatsapp,
												'',
												'Whatsapp',
											);
										}
										//console.log(`whatsappCollectionDateSend: ${this.config.wasteTypes[i].whatsappCollectionDateSend} Abfuhrdatum: ${celement.Abfuhrdatum}`,);
										if (
											this.config.whatsapp.used == true &&
											this.config.wasteTypes[i].whatsapp != -1 &&
											this.config.wasteTypes[i].whatsappCollectionDateSend !=
												celement.Abfuhrdatum &&
											differenceInDays <= this.config.wasteTypes[i].whatsapp
										) {
											// prevent to send again a Whatsapp for this collection date
											this.config.wasteTypes[i].whatsappCollectionDateSend = celement.Abfuhrdatum;
											//console.log(`whatsappCollectionDateSend nach Update: ${this.config.wasteTypes[i].whatsappCollectionDateSend}`,);
											//console.log('SENDE WHATSAPP MESSAGES');
											this.config.whatsapp.instances.map((element) => {
												this.sendWhatsapp(
													celement,
													this.config.wasteTypes[i].title,
													differenceInDays,
													this.config.wasteTypes[i].whatsapp,
													element.instance,
													element.phoneNumber,
												);
											});
										}
									}
								});
						});
				} // for
			});
		} catch (err) {
			console.error('Error while creating data points for waste calendar (function createAbfallartenDatenpunkte');
			console.error(err);
			return false;
		}
	}

	async createFolderDatapoints(channelName, deviceName, celement, differenceInDays) {
		await this.setObjectAsync(deviceName, {
			common: {
				name: this.getTranslation('DatumOrdner', true, ' ' + celement.Datenpunkt),
				desc: this.getTranslation('DatumOrdner', false, ' ' + celement.Datenpunkt),
			},
			native: {},
			type: 'device',
		}).then(async () => {
			await this.createDetailledDataPointsAsync(channelName, deviceName, celement, differenceInDays);
		});
	}

	async createDetailledDataPointsAsync(channelName, deviceName, celement, differenceInDays) {
		const path = deviceName == '' ? '' : celement.Datenpunkt;
		const promise1 = await this.createDataPointAsync(channelName, deviceName, celement.Abfuhrdatum, path, 'Datum');
		const promise2 = await this.createDataPointAsync(
			channelName,
			deviceName,
			celement.AbfuhrTagLang,
			path,
			'TagName',
		);
		const promise3 = await this.createDataPointAsync(
			channelName,
			deviceName,
			celement.AbfuhrTagKurz,
			path,
			'TagNameKurz',
		);
		const promise4 = await this.createDataPointAsync(
			channelName,
			deviceName,
			celement.Monatsname,
			path,
			'Monatsname',
		);
		const promise5 = await this.createDataPointAsync(channelName, deviceName, celement.Monat, path, 'Monat');
		const promise6 = await this.createDataPointAsync(channelName, deviceName, celement.Jahr, path, 'Jahr');
		const promise7 = await this.createDataPointAsync(channelName, deviceName, celement.Tag, path, 'Tag');
		const promise8 = await this.createDataPointAsync(channelName, deviceName, differenceInDays, path, 'Resttage');
		return Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]).then(
			() => {
				return true;
			},
		);
	}

	async createDataPointAsync(parentChannel, parentDevice, val, path, dataPointName, read, write) {
		try {
			const dpName =
				(parentChannel == '' ? '' : parentChannel + '.') + (path == '' ? '' : path + '.') + dataPointName;
			const ret = await this.setObjectAsync(dpName, {
				common: {
					name: this.getTranslation(dataPointName, true),
					desc: this.getTranslation(dataPointName, false),
					type: typeof val == 'string' ? 'string' : typeof val == 'boolean' ? 'boolean' : 'number',
					role: 'state',
					read: typeof read == 'undefined' ? true : read,
					write: typeof write == 'undefined' ? true : write,
				},
				native: {},
				type: 'state',
			}).then(() => {
				this.setStateAsync(dpName, val, true);
				return true;
			});
			return ret;
		} catch (err) {
			console.error(
				'Error during creation of datapoint ' +
					parentDevice +
					'.' +
					(parentChannel == '' ? '' : parentChannel + '.') +
					dataPointName +
					'.',
			);
			console.error(err);
			return false;
		}
	}

	async differenceInDays(celement, dToday) {
		const date2 = new Date(
			parseInt(celement.Jahr),
			parseInt(celement.Monat) - 1,
			parseInt(celement.Abfuhrdatum.substr(0, 2)),
		);
		date2.setHours(dToday.getHours());
		date2.setMinutes(dToday.getMinutes());
		date2.setSeconds(dToday.getSeconds());
		const difference = (date2.getTime() - dToday.getTime()) / (1000 * 3600 * 24);
		const ret =
			Math.floor(difference * 100) - Math.floor(difference) * 100 > 0
				? Math.floor(difference) + 1
				: Math.floor(difference);
		return ret;
	}

	getTranslation(dp, name, additionalText) {
		/* tranforms all language entries for this datapoint name into one object
			translation file "i18n.json" is saved in directory \lib
		*/
		const dpSearch = 'dp' + dp + (name == true ? 'Name' : 'Desc');
		const obj = {};
		for (let i = 0; i < languages.length; i++) {
			obj[languages[i]] =
				typeof i18n[languages[i]] == 'undefined' || typeof i18n[languages[i]][dpSearch] == 'undefined'
					? 'Missing (' + languages[i] + ') translation for ' + dpSearch
					: i18n[languages[i]][dpSearch] + (typeof additionalText == 'undefined' ? '' : additionalText);
		}
		return obj;
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Abfallkalender(options);
} else {
	// otherwise start the instance directly
	new Abfallkalender();
}
