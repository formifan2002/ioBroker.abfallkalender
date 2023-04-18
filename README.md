![Logo](admin/abfallkalender.png)

# ioBroker.abfallkalender

[![NPM version](https://img.shields.io/npm/v/iobroker.abfallkalender.svg)](https://www.npmjs.com/package/iobroker.abfallkalender)
[![Downloads](https://img.shields.io/npm/dm/iobroker.abfallkalender.svg)](https://www.npmjs.com/package/iobroker.abfallkalender)


[![NPM](https://nodei.co/npm/iobroker.abfallkalender.png?downloads=true)](https://nodei.co/npm/iobroker.abfallkalender/)

## Abfallkalender für den ioBroker

Der Adapter liest die Müllabfuhrtermine des Anbieters abfall.io aus, den verschiedene Städte oder Landkreise nutzen (z.B. [Hagen](https://www.heb-hagen.de/rund-um-den-muell/muellabfuhr-termine-abholservice/abfuhrkalender.html), [Ludwigshafen](https://www.ludwigshafen.de/wirtschaftsstark/wirtschaftsbetrieb-ludwigshafen-wbl/abfall-und-wertstoffe/abfall-und-wertstoffkalender-online) oder [Landkreis Tuttlingen](https://www.abfall-tuttlingen.de/Abfalltermine-APP/)). Die einzelnen Müllarten der Stadt können ausgewählt und z.B. in einem Kalender dargestellt werden. 

Wenn der [Whatsapp Adapter]( https://github.com/ioBroker/ioBroker.whatsapp-cmb) im ioBroker installiert ist, wird das automatische Versenden von Nachrichten vor der Abholung pro Abfallart unterstützt. Die Anzahl der Tage zum Versand der Nachricht vor der Abholung, kann  individuell für jede Abfallart eingestellt werden.

Der Adapter beinhaltet zwei Widgets für die [VIS 2 (!)](https://www.npmjs.com/package/iobroker.vis-2-beta?activeTab=readme). Es kann ein Kalender mit den konfigurierten Müllarten oder ein Icon mit verschiedenen Konfigurationsmöglichkeiten dargestellt werden. Das Icon kann x Tage vor der Abholung anfangen zu blinken, wenn das in den Adaptereinstellungen zur Abfallart konfiguriert ist 

 Sind [VIS](https://github.com/ioBroker/ioBroker.vis) oder [VIS 2 (!)](https://www.npmjs.com/package/iobroker.vis-2-beta?activeTab=readme) UND das Widget-Set [inventwo](https://github.com/inventwo/ioBroker.vis-inventwo) installiert, wird ein Datenpunkt erzeugt, der den Widget-Code für eine JSON-Tabelle beinhaltet.

**_Allgemeine Adaptereinstellungen:_**

![Allgemeine_Einstellungen](./docs/AbfallKalenderConfig1.jpg)

**_Detaileinstellungen:_**

![Detail_Einstellungen](./docs/AbfallKalenderConfig2.jpg)

**_Beispiele Widgets:_** 

- *Kalender*
![Beispiel_Widget_Kalender](./docs/AbfallKalenderWidgetCalendar.jpg)
<br>
- *Icon (Mülltonne)*
![Beispiel_Widget_Muelleimer](./docs/AbfallKalenderWidgetTrash1.jpg)
<br/>
- *Icon (Gelber Sack)*
![Beispiel_Widget_Gelber_Sack](./docs/AbfallKalenderWidgetTrash2.jpg)
<br/>
- *Icon (Blatt)*
![Beispiel_Widget_Blatt](./docs/AbfallKalenderWidgetTrash3.jpg)
<br/>
+ *VIS inventwo Widget (JSON Tabelle)*
>- *Datenpunkt mit Code für VIS inventwo Widget (JSON Tabelle)*
![Datenpunkt_Vis_Widget_Code](./docs/DatenpunktVisWidgetCode.jpg)
>- *VIS inventwo Widget (JSON Tabelle mit Daten aus dem Abfallkalender)*
![AbfallKalender_Widget_Json_Table.jpg](./docs/AbfallKalenderWidgetJsonTable.jpg)

**_Ist meine Stadt/mein Landkreis für den Adapter geeignet?:_**

Städte/Landkreise, die mit abfall.io. zusammenarbeiten, bieten auf ihren Internetseiten ähnliche Kalender an, wie du sie z.B. auf der Seite der [HEB Hagen](https://www.heb-hagen.de/rund-um-den-muell/) sehen kannst. Wenn die URL von deinem Entsorgungsunternehmen nicht vom Adapter akzeptiert wird, kannst du ggf. auf der Entsorgerseite mit dem Developertool deines Browsers prüfen, ob beim Auswählen der Stadt, Straße eine URL mit api.abfall.io (nicht apiv2.abfall.io !) aufgerufen wird. Hier ein Beispiel aus dem Chrome-Developertool (aufrufbar über die Funktionstaste F12 - dort dann Netzwerk auswählen und die Seite neu laden).

![AbfallKalender_Widget_Json_Table.jpg](./docs/ChromeDeveloperTool.jpg)

**_Sonstiges:_**

+  Der Adapter wird jede Nacht um 0:05 Uhr neu gestartet, liest die Daten aus der API von abfall.io und aktualisiert die entsprechenden Datenpunkte im Objektverzeichnis der Adapterinstanz. Da sich ein Abfuhrkalendar in der Regel nicht häufig ändert, sollte dieses Intervall vollkommen ausreichen. Du kannst die Einstellung aber auch jederzeit in der Instanzeinstellung vom Abfallkalender in ioBroker ändern.
<br/>
+ Bei Bedarf können mehrere Instanzen (für verschiedene Städte) installiert werden.

**_Liste einiger bekannter Städte / Landkreise:_**

+ [Breisgau-Hochschwarzwald Landkreis](https://www.breisgau-hochschwarzwald.de/pb/Breisgau-Hochschwarzwald/Start/Service+_+Verwaltung/Entsorgung+und+Recycling.html)
+ [Hagen (Stadt NRW)](https://www.heb-hagen.de/rund-um-den-muell/muellabfuhr-termine-abholservice/abfuhrkalender.html)
+ [Kaarst, Krefeld uvm. (Schönmackers)](https://www.schoenmackers.de/rund-um-service/muellalarm/)
+ [Limburg-Weilburg Landkreis](https://www.awb-lm.de/ihr-abfallkalender/)
+ [Reutlingen (Kreis)](https://www.kreis-reutlingen.de/abfalltermine)
+ [Tuttlingen (Landkreis)](https://www.abfall-tuttlingen.de/Abfalltermine-APP/)
+ [Ostallgäu (Landkreis)](https://www.buerger-ostallgaeu.de/abfallwirtschaft/abfuhrkalender.html)
+ [Rotenburg (Wümme - Landkreis)](https://www.lk-awr.de/termine/entsorgungstermine/)
+ [Vorpommern-Rügen (Landkreis)](https://www.lk-vr.de/Abfallkalender)
+ [Waldshut (Landkreis)](https://www.abfall-landkreis-waldshut.de/de/termine/)
+ [Westerwald (Kreis)](https://wab.rlp.de/nc/abfuhr-termine/regelabfuhrtermine.html)					   

## Changelog

<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### 1.0.0-alpha.0 (2023-03-20)

-   (Formifan2002) initial release

### Sentry
This adapter uses Sentry libraries to automatically report exceptions and code errors to the developers. For more details and for information how to disable the error reporting see [Sentry-Plugin Documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry). Sentry reporting is used starting with js-controller 3.0.

## License

MIT License

Copyright (c) 2023 Formifan2002 <formifan2002@web.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
