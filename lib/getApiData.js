async function getKey(url) {
	const axios = require('axios');
	const config = {
		method: 'post',
		transformResponse: (res) => {
			// Do not parse response as JSON !
			return res;
		},
		url: url,
		headers: {
			Cookie: 'PHPSESSID=64fb036c3cb461e6befea94759502931',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
		},
	};
	try {
		const newKey = await axios.request(config).then(async (response) => {
			if (response.statusText != 'OK') {
				return '';
			}
			if (response.data == '') {
				return '';
			}
			const nPos1 = response.data.indexOf('?key=');
			if (nPos1 != -1) {
				const nPos2 = response.data.substr(nPos1 + 5).indexOf('"');
				return response.data.substr(nPos1 + 5, nPos2);
			}
			return '';
		});
		return newKey;
	} catch (err) {
		if (err.response.status != 404) console.error(err.response);
		return '';
	}
}

async function getStreets(key, onlyCommune) {
	const axios = require('axios');
	const jsdom = require('jsdom');
	const ret = { commune: '', district: '', streets: [], error: '' };
	const config = {
		method: 'post',
		transformResponse: (res) => {
			// Do not parse response as JSON !
			return res;
		},
		url: 'https://api.abfall.io/?key=' + key + '&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=init',
		headers: {
			Cookie: 'PHPSESSID=64fb036c3cb461e6befea94759502931',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
		},
	};
	try {
		await axios.request(config).then(async (response) => {
			if (response.statusText != 'OK') {
				ret.error = 'Error while getting the streets. Error status: ' + response.statusText;
				console.error(ret.error);
				return ret;
			}
			if (response.data == '') {
				ret.error = 'Error while getting the streets. Empty response received.';
				console.error(ret.error);
				return ret;
			}
			//console.log(response.data);
			const { JSDOM } = jsdom;
			const dom = new JSDOM(response.data, { includeNodeLocations: true });
			const document = dom.window.document;
			const streetsHTML = document.querySelector('.awk-ui-input-select').outerHTML;
			ret.commune = document.getElementsByName('f_id_kommune')[0].value;
			ret.district =
				document.getElementsByName('f_id_bezirk').length < 1
					? ''
					: document.getElementsByName('f_id_bezirk')[0].value;
			if (typeof onlyCommune == 'undefined') {
				const frag = JSDOM.fragment(streetsHTML);
				const children = frag.firstChild.childNodes;
				for (const node of children) {
					if (node.nodeName == 'OPTION' && node.value != '0') {
						ret.streets.push({ title: node.textContent, value: node.value });
					}
				}
			}
		});
	} catch (err) {
		ret.error = 'Error while reading the streets';
		console.error(ret.error);
	}
	return ret;
}

async function getHouseNumbers(key, street) {
	const axios = require('axios');
	const jsdom = require('jsdom');
	const FormData = require('form-data');
	const data = new FormData();
	const houseNumbers = [];
	const response = await getStreets(key, true);
	if (response.commune == '' || response.error != '') {
		console.error('Error while trying to get the commune in getHouseNumbers.');
		return houseNumbers;
	}
	data.append('f_id_kommune', response.commune);
	data.append('f_id_strasse', street);
	const config = {
		method: 'post',
		url:
			'https://api.abfall.io/?key=' + key + '&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_strasse_set',
		headers: {
			Cookie: 'PHPSESSID=64fb036c3cb461e6befea94759502931',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
		},
		data: data,
	};
	try {
		//console.log(config);
		await axios.request(config).then(async (response) => {
			if (response.statusText != 'OK') {
				return houseNumbers;
			}
			if (response.data == '') {
				return houseNumbers;
			}
			//console.log(response.data);
			const { JSDOM } = jsdom;
			const dom = new JSDOM(response.data, { includeNodeLocations: true });
			const document = dom.window.document;
			//const monatHTML = document.querySelector('.awk_widget_placeholder_hnr');
			const houseNumberHTML = document.getElementById('awk_widget_placeholder_hnr');
			try {
				if (typeof houseNumberHTML.textContent == 'string') {
					// do nothing - the function wil continue to retreive the housenumbers
				}
			} catch {
				// this is not a housenumber list, but a waste calendar..
				console.log('Exit from getHousenumbers - this is a waste calendar already !');
				return houseNumbers;
			}
			const houseNumbersHTML = document.querySelector('.awk-ui-input-select').outerHTML;
			const frag = JSDOM.fragment(houseNumbersHTML);
			const children = frag.firstChild.childNodes;
			for (const node of children) {
				if (node.nodeName == 'OPTION' && node.value != '0') {
					houseNumbers.push({ title: node.textContent, value: node.value });
				}
			}
		});
	} catch (err) {
		console.log('Error while reading the house numbers');
		console.error(err);
		return houseNumbers;
	}
	console.log(houseNumbers);
	return houseNumbers;
}

async function getWasteTypes(key, street, houseNumber) {
	const axios = require('axios');
	const jsdom = require('jsdom');
	const FormData = require('form-data');
	const data = new FormData();
	const wasteTypes = [];
	if (typeof street == 'undefined') {
		console.error('Error while trying to get the waste types - empty/undefined street in getWasteTypes.');
		return wasteTypes;
	}
	const response = await getStreets(key, true);
	if (response.commune == '' || response.error != '') {
		console.error('Error while trying to get the commune in getWasteTypes.');
		return wasteTypes;
	}
	console.log(
		`getWasteTypes mit key: ${key} f_id_kommune: ${response.commune} f_id_bezirk: ${response.district} f_id_strasse: ${street} f_id_strasse_hnr: ${houseNumber}`,
	);
	let url = 'https://api.abfall.io/?key=' + key + '&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=';
	data.append('f_id_kommune', response.commune);
	//data.append('f_id_kommune', street.substr(0, 4));
	if (response.district != '') data.append('f_id_bezirk', response.district);
	data.append('f_id_strasse', street);
	if (houseNumber != '') {
		data.append('f_id_strasse_hnr', houseNumber);
		url = url + 'auswahl_hnr_set';
	} else {
		url = url + 'auswahl_strasse_set';
	}
	console.log('URL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	//console.log(url);
	const config = {
		method: 'post',
		url: url,
		headers: {
			Cookie: 'PHPSESSID=64fb036c3cb461e6befea94759502931',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
		},
		data: data,
	};
	try {
		await axios.request(config).then(async (response) => {
			if (response.statusText != 'OK') {
				console.error('Error while receiving waste calendar: ' + response.statusText);
				return wasteTypes;
			}
			if (response.data == '') {
				return wasteTypes;
			}
			//console.log('RESPONSE WASTETYPE ---------------------------');
			//console.log(response.data);
			//console.log('RESPONSE WASTETYPE ---------------------------');
			const { JSDOM } = jsdom;
			const dom = new JSDOM(response.data, { includeNodeLocations: true });
			const document = dom.window.document;
			const inner = document.querySelectorAll('.awk-ui-input-tr');
			let wasteType;
			for (const target of inner) {
				if (target.innerHTML.indexOf('f_id_abfalltyp_') != -1) {
					const childs = target.children;
					for (const node of childs) {
						if (node.nodeName == 'LABEL') {
							wasteType = node.textContent;
							for (const child of node.children) {
								wasteType = wasteType.replace(child.textContent, '');
							}
						}
						if (node.nodeName == 'SPAN') {
							const nPos1 = node.innerHTML.indexOf('f_id_abfalltyp_');
							const nPos2 = node.innerHTML.substring(nPos1 + 15).indexOf('_');
							wasteTypes.push({
								id: wasteTypes.length + 1,
								title: wasteType,
								titleDatapoint: dataPointNameCompatibility(wasteType),
								used: false,
								whatsapp: -1,
								whatsappCollectionDateSend: '',
								blink: -1,
								value: node.innerHTML.substring(nPos1 + 15, nPos1 + 15 + nPos2),
							});
						}
					}
				}
			}
		});
	} catch (err) {
		console.log('Error while reading the house numbers');
		console.error(err);
		return wasteTypes;
	}
	console.log('Received ' + wasteTypes.length + ' waste types.');
	return wasteTypes;
}

function differenceInDays(Abfuhrdatum, dToday) {
	const date2 = new Date(
		parseInt(Abfuhrdatum.substr(6,4)),
		parseInt(Abfuhrdatum.substr(3, 2)) - 1,
		parseInt(Abfuhrdatum.substr(0, 2)),
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

function dataPointNameCompatibility(str) {
	const umlautMap = {
		'\u00dc': 'UE',
		'\u00c4': 'AE',
		'\u00d6': 'OE',
		'\u00fc': 'ue',
		'\u00e4': 'ae',
		'\u00f6': 'oe',
		'\u00df': 'ss',
		' ': '',
		'/': '',
		'-': '',
	};
	return str
		.replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
			const big = umlautMap[a.slice(0, 1)];
			return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
		})
		.replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', 'g'), (a) => umlautMap[a]);
}

async function getWasteCalendar(key, street, houseNumber, wasteTypes) {
	const axios = require('axios');
	const jsdom = require('jsdom');
	let ret = { json: '', string: '', wasteCalendar: [], error: '' }; // return values (calender as JSON, calendar as String, errormessage in case error occured)
	const response = await getStreets(key, true);
	if (response.commune == '' || response.error != '') {
		ret.error = 'Error while trying to get the commune in getWasteTypes.';
		console.error(ret.error);
		return ret;
	}
	const dToday = new Date(Date.now());
	const lastDayOfMonth = (
		'0' + new Date(dToday.getFullYear() + 1, dToday.getMonth() + 1, 0).getDate().toString()
	).slice(-2);
	const fullMonth = ('0' + dToday.getMonth()).slice(-2);
	const f_zeitraum =
		dToday.getFullYear() + fullMonth + '01-' + (dToday.getFullYear() + 1).toString() + fullMonth + lastDayOfMonth;
	const FormData = require('form-data');
	const data = new FormData();
	const aAbfallKalender = [];
	data.append('f6620c9873c01c89d750ded1c4aa0f5c', '7b16d45287a65ab22197df450f4e9a85\n');
	data.append('f_id_kommune', response.commune);
	if (response.district != '') {
		data.append('f_id_bezirk', response.district);
	}
	data.append('f_id_strasse', street);
	if (houseNumber != '') {
		data.append('f_id_strasse_hnr', houseNumber);
	}
	let f_abfallarten = '';
	let maxAbfallarten = 0;
	for (let i = 0; i < wasteTypes.length; i++) {
		if (wasteTypes[i].used) {
			maxAbfallarten++;
			data.append('f_id_abfalltyp_' + i, wasteTypes[i].value);
			//console.log('f_id_abfalltyp_' + i);
			//console.log(wasteTypes[i].value);
			f_abfallarten = f_abfallarten + (f_abfallarten != '' ? ',' : '') + wasteTypes[i].value;
		}
	}
	if (maxAbfallarten == 0) {
		ret.error = `No waste types selected to retreive from abfall.io - check adapater settings.`;
		console.error(ret.error);
		return ret;
	}
	data.append('f_abfallarten_index_max', 10);
	// maxAbfallarten.toString()
	data.append('f_zeitraum', f_zeitraum);
	const config = {
		method: 'post',
		url:
			'https://api.abfallplus.de/?key=' +
			key +
			'&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_fraktionen_set',
		headers: {
			method: 'POST',
			authority: 'api.abfall.io',
			accept: '*/*',
			'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			pragma: 'no-cache',
			'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
			...data.getHeaders(),
		},
		data: data,
	};
	try {
		//console.log(config);
		ret = await axios.request(config).then(async (response) => {
			if (response.statusText != 'OK') {
				ret.error = `Error while receiving data for waste calendar (status: ${response.statusText})`;
				console.error(ret.error);
				return ret;
			}
			if (response.data == '') {
				ret.error = 'No data for waste calendar received from abfall.io.';
				console.error(ret.error);
				return ret;
			}
			//console.log(response.data);
			const { JSDOM } = jsdom;
			const dom = new JSDOM(response.data, { includeNodeLocations: true });
			const document = dom.window.document;
			if (document.querySelector('.awk-ui-widget-html')?.outerHTML != undefined) {
				const cKalender = document.querySelector('.awk-ui-widget-html')?.outerHTML;
				const frag = JSDOM.fragment(cKalender);
				const children = frag.firstChild?.childNodes;
				const monat = [
					'Januar',
					'Februar',
					'März',
					'April',
					'Mai',
					'Juni',
					'Juli',
					'August',
					'September',
					'Oktober',
					'November',
					'Dezember',
				];
				const wochentag = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
				let cJSON = '[';
				let cDatum, cMonatLang, cJahr, cMonatKurz;
				for (const node of children) {
					const cInner = node.innerHTML;
					let cOuter = node.outerHTML;
					if (cInner !== undefined) {
						if (cOuter.substr(0, 38) == '<div class="awk-ui-widget-html-monat">') {
							cMonatLang = cInner.substr(0, cInner.indexOf(' '));
							cJahr = cInner.substr(cInner.indexOf(' ') + 1);
							cMonatKurz = (
								'0' + (monat.findIndex((element) => element == cMonatLang) + 1).toString()
							).slice(-2);
							cDatum = '.' + cMonatKurz + '.' + cJahr;
						} else {
							let cAbfuhrArtNr = cOuter.substr(
								cOuter.indexOf(
									'<div class="awk-ui-widget-html-termin-farbe awk-ui-widget-html-termin-farbe-',
								) + 76,
							);
							cAbfuhrArtNr = cAbfuhrArtNr.substr(0, cAbfuhrArtNr.indexOf('"'));
							cOuter = cOuter.substr(cOuter.indexOf('<div class="awk-ui-widget-html-termin-wtag">') + 44);
							const cAbfuhrTagKurz = cOuter.substr(0, 2);
							cOuter = cOuter
								.substr(cOuter.indexOf('<div class="awk-ui-widget-html-termin-tag">') + 43)
								.substr(0, 2);
							const cTag = ('0' + cOuter.substr(0, 2)).slice(-2);
							const cAbfuhrDatum = cTag + cDatum;
							cOuter = node.outerHTML.substr(
								node.outerHTML.indexOf('<div class="awk-ui-widget-html-termin-bez">') + 43,
							);
							const cAbfuhrArt = cOuter.substr(0, cOuter.indexOf('</div>')).replace('&nbsp;', ' ');
							const cAbfuhrTagLang =
								wochentag[new Date(parseInt(cJahr), parseInt(cMonatKurz) - 1, parseInt(cTag)).getDay()];
							const dAbfuhrdatum = new Date(parseInt(cJahr), parseInt(cMonatKurz) - 1, parseInt(cTag));
							const AbfuhrtagJson = cJahr + '-' + cMonatKurz + '-' + cTag;
							const Datenpunkt = cJahr + cMonatKurz + cTag;
							dAbfuhrdatum.setHours(23);
							dAbfuhrdatum.setMinutes(59);
							dAbfuhrdatum.setSeconds(59);
							const restTage=differenceInDays(cAbfuhrDatum,dToday)
							if (dAbfuhrdatum >= dToday) {
								// nur Daten, die heute bzw. in der Zukunft liegen, werden betrachtet
								cJSON =
									cJSON +
									(cJSON != '[' ? ',' : '') +
									"{'Abfuhrdatum':'" +
									cAbfuhrDatum +
									"','AbfuhrdatumJson':'" +
									AbfuhrtagJson +
									"','AbfuhrTagLang':'" +
									cAbfuhrTagLang +
									"','AbfuhrTagKurz':'" +
									cAbfuhrTagKurz +
									"','Abfuhrart':'" +
									cAbfuhrArt +
									"','AbfuhrartNr':'" +
									cAbfuhrArtNr +
									"','Tag':'" +
									cTag +
									"','Monat':'" +
									cMonatLang +
									"','Monat':'" +
									cMonatKurz +
									"','Jahr':'" +
									cJahr +
									"','Resttage':" +
									restTage.toString() +									
									",'Datenpunkt':'" +
									Datenpunkt +
									"'}";
								aAbfallKalender.push({
									Abfuhrdatum: cAbfuhrDatum,
									AbfuhrtagJson: AbfuhrtagJson,
									AbfuhrTagLang: cAbfuhrTagLang,
									AbfuhrTagKurz: cAbfuhrTagKurz,
									Abfuhrart: cAbfuhrArt,
									AbfuhrartNr: cAbfuhrArtNr,
									Monatsname: cMonatLang,
									Monat: cMonatKurz,
									Jahr: cJahr,
									Tag: cTag,
									Resttage: restTage,
									Datenpunkt: Datenpunkt,
								});
							}
						}
					}
				}
				cJSON = cJSON + ']';
				ret.json = JSON.stringify(aAbfallKalender);
				ret.wasteCalendar = aAbfallKalender;
				ret.string = cJSON;
				return ret;
			} else {
				ret.error = 'Error while retreiving waste calendar data from abfall.io.';
				console.error(ret.error);
				return ret;
			}
		});
		return ret;
	} catch (err) {
		ret.error = 'Error while trying to get waste calendar data from abfall.io';
		console.error(ret.error);
		console.error(err);
		return ret;
	}
}

module.exports = {
	getKey,
	getStreets,
	getHouseNumbers,
	getWasteTypes,
	getWasteCalendar,
};
