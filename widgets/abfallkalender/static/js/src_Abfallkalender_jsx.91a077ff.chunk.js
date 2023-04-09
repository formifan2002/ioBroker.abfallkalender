"use strict";(self.webpackChunkiobroker_vis_widgets_abfallkalender=self.webpackChunkiobroker_vis_widgets_abfallkalender||[]).push([["src_Abfallkalender_jsx"],{31984:function(N,M,r){r.r(M);var S=r(4819),o=r.n(S),u=r(82490),C=r(75606),j=r.n(C),A=r(55973),T=r(36315),D=r(42577),g=r(71386),m=r(69073),y=r(41381),b=r(67304),v=r(58503),K=r.n(v),O=r(88411),$=r.n(O),I=r(10458),P=r(84543),f=(x,t,e)=>new Promise((a,i)=>{var s=c=>{try{n(e.next(c))}catch(p){i(p)}},d=c=>{try{n(e.throw(c))}catch(p){i(p)}},n=c=>c.done?a(c.value):Promise.resolve(c.value).then(s,d);n((e=e.apply(x,t)).next())});const L=()=>({root:{flex:1,display:"flex",justifyContent:"center",alignItems:"center",width:"100%",overflow:"hidden"}});class w extends(window.visRxWidget||O.VisRxWidget){constructor(t){super(t),this.refTrashIcon=o().createRef(),this.initial=!0,this.instancenameLocal="",this.wastetypeLocal="",this.JsonObject={},this.oidChange=!1}static getWidgetInfo(){return{id:"tplAbfallkalender",visSet:"abfallkalender",visSetLabel:"vis_2_widgets_abfallkalender",visSetColor:"#63C149",visName:C.i18n.t("vis_2_widgets_abfallkalender_widgetname_icon"),visAttrs:[{name:"common",label:"vis_2_widgets_abfallkalender_common",fields:[{name:"instancename",label:"vis_2_widgets_abfallkalender_instance",type:"custom",hidden:'data.instancenamehidden === "true"',component:(t,e,a)=>this.showInstances(t,e,a)},{name:"instancenamehidden",type:"text",hidden:!0,default:"false"},{name:"selectinstances",label:"selectinstances",type:"text",hidden:!0,default:""},{name:"wastetype",label:"vis_2_widgets_abfallkalender_wastetype",type:"custom",disabled:'data.wastetypedisabled === "true"',component:(t,e,a)=>this.showWasteTypes(t,e,a)},{name:"wastetypedisabled",type:"text",hidden:!0,default:"false"},{name:"selectwastetypes",label:"selectwastetypes",type:"text",hidden:!0,default:""},{name:"icon",default:"trash",label:"vis_2_widgets_abfallkalender_icon",type:"select",options:[{value:"trash",label:"vis_2_widgets_abfallkalender_icontrash"},{value:"yellowbag",label:"vis_2_widgets_abfallkalender_iconyellowbag"},{value:"christmastree",label:"vis_2_widgets_abfallkalender_iconchristmastree"},{value:"leaf",label:"vis_2_widgets_abfallkalender_iconleaf"}]},{name:"trashcolor",default:"rgba(40,30,88,1)",label:"vis_2_widgets_abfallkalender_trashcolor",type:"color",hidden:'data.icon !== "trash"'},{name:"trashcolorfactor",hidden:'data.icon !== "trash"',default:-.3,label:"vis_2_widgets_abfallkalender_trashcolor_factor",type:"slider",min:-1,max:1,step:.1},{name:"whatsapplogo",default:!0,label:"vis_2_widgets_abfallkalender_whatsapplogo",type:"custom",hidden:'data.whatsapplogohidden === "true"',component:(t,e,a)=>this.showCheckbox(t,e,a)},{name:"whatsapplogohidden",type:"text",hidden:!0,default:"false"},{name:"blink",default:!0,label:"vis_2_widgets_abfallkalender_blink",type:"custom",hidden:'data.blinkhidden === "true"',component:(t,e,a)=>this.showCheckbox(t,e,a)},{name:"blinkhidden",type:"text",hidden:!0,default:"false"},{name:"blinkinterval",default:3,label:"vis_2_widgets_abfallkalender_blinkinterval",type:"slider",hidden:'data.blink === false || data.blinkhidden === "true"',min:1,max:15,step:1},{name:"showdate",default:!0,label:"vis_2_widgets_abfallkalender_showdate",type:"custom",component:(t,e,a)=>this.showCheckbox(t,e,a)},{name:"dateformat",default:"short",label:"vis_2_widgets_abfallkalender_dateformat",type:"select",hidden:"data.showdate === false",options:[{value:"short",label:"vis_2_widgets_abfallkalender_dateformat_short"},{value:"long",label:"vis_2_widgets_abfallkalender_dateformat_long"}]},{name:"showdays",default:!0,label:"vis_2_widgets_abfallkalender_showdays",type:"custom",component:(t,e,a)=>this.showCheckbox(t,e,a)},{name:"fontfamily",label:"vis_2_widgets_abfallkalender_fontfamily",default:"Arial",type:"custom",hidden:"data.showdate === false && data.showdays === false",component:(t,e,a)=>this.showFontfamily(t,e,a)},{name:"fontsize",default:20,label:"vis_2_widgets_abfallkalender_fontsize",type:"slider",hidden:"data.showdate === false && data.showdays === false",min:6,max:45,step:1},{name:"oid",label:"vis_2_widgets_abfallkalender_oid",type:"id",noInit:!0,hidden:!0}]}],visPrev:"widgets/abfallkalender/img/abfallkalender.png"}}changeData(t){const{id:e,view:a,views:i,selectedWidgets:s}=this.props;(s!==null?s:[e]).forEach(n=>{Object.keys(t).forEach(c=>{i[a].widgets[n].data[c]=t[c],this.state.data[c]=t[c],this.state.rxData[c]=t[c]})})}propertiesUpdate(){return f(this,null,function*(){if(this.initial===!0&&this.oidChange!==!0)return;const{wastetype:t,instancename:e}=this.state.data;let a=!0;typeof e!="undefined"&&this.instancenameLocal!==e&&(this.instancenameLocal=e,yield this.getWasteTypes(e),a=!1),(this.oidChange===!0||typeof t!="undefined"&&this.wastetypeLocal!==t)&&(this.wastetypeLocal=t,yield this.getJsonObject(t,this.instancenameLocal),yield this.updateWhatsappAndBlink(),a=!0,this.oidChange===!0&&(this.oidChange=!1)),a===!0&&(yield this.renderIcon())})}componentDidMount(){super.componentDidMount(),u.ZP.init(P.Z).then(()=>{u.ZP.changeLanguage(this.props.systemConfig.common.language)}),this.getInstances().then(t=>{this.getWasteTypes(t).then(e=>{this.getJsonObject(e,t).then(()=>{this.updateWhatsappAndBlink().then(()=>{this.renderIcon().then(()=>{this.initial=!1})})})})})}getWidgetInfo(){return w.getWidgetInfo()}onRxDataChanged(){this.propertiesUpdate()}onRxStyleChanged(){}onStateUpdated(t,e){this.oidChange=!0,this.propertiesUpdate()}renderIcon(){return f(this,null,function*(){const{trashcolor:t,trashcolorfactor:e,fontfamily:a,fontsize:i,whatsapplogo:s,dateformat:d,blink:n,blinkinterval:c,showdate:p,showdays:W}=this.state.data;if(this.refTrashIcon.current.childNodes.forEach(l=>{if(l.id==="Abfalltonne"){l.attributes.style.value=`visibility: ${this.state.data.icon==="trash"?"visible":"hidden"};`;let h="";l.childNodes.forEach(_=>{if(_.id==="tonne"&&(t===""?(this.state.data.trashcolor=_.attributes.fill.nodeValue,h=_.attributes.fill.nodeValue):(_.attributes.fill.nodeValue=this.state.data.trashcolor,h=this.state.data.trashcolor)),_.id==="tonne-innen"&&typeof h!="undefined"){const E=h.replace("rgba(","").replace(")","").split(","),k=1+e,B=Math.round(parseInt(E[0])*k),R=Math.round(parseInt(E[1])*k),U=Math.round(parseInt(E[2])*k),Z=`rgba(${B},${R},${U},1)`;_.attributes.fill.nodeValue=Z}})}if(l.id==="GelberSack"&&(l.attributes.style.value=`visibility: ${this.state.data.icon==="yellowbag"?"visible":"hidden"};`),l.id==="Blatt"&&(l.attributes.style.value=`visibility: ${this.state.data.icon==="leaf"?"visible":"hidden"};`),l.id==="Weihnachtsbaum"&&(l.attributes.style.value=`visibility: ${this.state.data.icon==="christmastree"?"visible":"hidden"};`),l.id==="whatsapp"&&(l.attributes.style.value=`visibility: ${s===!0?"visible":"hidden"};`),l.id.indexOf("Abfuhrdatum")!==-1){const h={year:"2-digit",month:"2-digit",day:"2-digit"};d==="long"&&(h.weekday="long"),l.innerHTML=new Date(this.JsonObject.AbfuhrtagJson).toLocaleDateString(this.props.lang,h),l.style.fontSize=`${i}px`,l.style.fontFamily=a,l.style.visibility=p===!0?"visible":"hidden"}l.id.indexOf("AnzahlTage")!==-1&&(l.innerHTML=u.ZP.t("vis_2_widgets_abfallkalender_dayCollection",{count:this.JsonObject.Resttage}),l.style.fontSize=i,l.style.fontFamily=a,l.style.visibility=W===!0?"visible":"hidden")}),n===!0){const l=[{opacity:0},{opacity:1}],h={duration:c*1e3,iterations:1/0};this.refTrashIcon.current.animate(l,h)}else this.refTrashIcon.current.getAnimations().map(l=>l.cancel())})}getJsonObject(t,e){return f(this,null,function*(){const a=`abfallkalender.${e}.CalendarDoubleQuotes`;t!==""&&(yield this.props.socket.getForeignStates(a).then(i=>{if(!(a in i))return;const s=JSON.parse(i[a].val).filter(d=>d.AbfuhrartNr===t);this.JsonObject=typeof s[0]!="undefined"?s[0]:{},this.changeData({oid:a})}))})}updateWhatsappAndBlink(){return f(this,null,function*(){const t="selectwastetypes"in this.state.data&&this.state.data.selectwastetypes!==""?this.state.data.selectwastetypes.replaceAll("[","{").replaceAll("]","}").replaceAll("#",'"').split("}").slice(0,-1):[];for(let s=0;s<t.length;s++)t[s]+="}",t[s]=JSON.parse(t[s].replaceAll(/'/g,'"'));const e=t.filter(s=>s.value===this.state.data.wastetype),a=e.length>0?parseInt(e[0].whatsapp)>-1:!1;this.state.editMode===!0&&this.changeData({whatsapplogohidden:a===!0?"false":"true"}),a===!1&&this.changeData({whatsapplogo:!1});const i=e.length>0?parseInt(e[0].blink)>-1:!1;this.state.editMode===!0&&this.changeData({blinkhidden:i===!0?"false":"true"}),i===!1&&this.changeData({blink:!1})})}getInstances(){return f(this,null,function*(){let t=this.state.data.instancename;const e=yield this.props.socket.getObjectViewSystem("instance","system.adapter.abfallkalender.","system.adapter.abfallkalender.\u9999").then(a=>{const i=[];return Object.keys(a).forEach((s,d)=>{i.push({value:d,title:a[s]._id.replace("system.adapter.","")})}),i}).catch(a=>(console.log("ERROR !!!:"),console.log(a),[]));return this.state.editMode===!0&&(yield this.arr2string(e).then(a=>{this.changeData({selectinstances:a})}),this.changeData({instancenamehidden:e.length<2?"true":"false"})),this.initial===!0&&(!("instancename"in this.state.data)||this.state.data.instancename==="")&&(t=e.length>0?e[0].value:"",this.changeData({instancename:t})),this.instancenameLocal=t,t})}static showInstances(t,e,a){const i="selectinstances"in e&&e.selectinstances!==""?e.selectinstances.replaceAll("[","{").replaceAll("]","}").replaceAll("#",'"').split("}").slice(0,-1):[];for(let s=0;s<i.length;s++)i[s]+="}",i[s]=JSON.parse(i[s].replaceAll(/'/g,'"'));return e.selectinstances===""?o().createElement("div",null):o().createElement(g.Z,null,o().createElement(b.Z,{value:e[t.name],onChange:s=>{a({[t.name]:s.target.value})},input:o().createElement(m.Z,{name:"instances"}),label:u.ZP.t("vis_2_widgets_abfallkalender_instance"),style:{fontSize:"12.8px"}},i.map(s=>o().createElement(y.Z,{key:s.value,value:s.value,style:{fontSize:"16px"}},s.title))))}static showFontfamily(t,e,a){const i=new Set(["Arial","Arial Black","Bahnschrift","Calibri","Cambria","Cambria Math","Candara","Comic Sans MS","Consolas","Constantia","Corbel","Courier New","Ebrima","Franklin Gothic Medium","Gabriola","Gadugi","Georgia","HoloLens MDL2 Assets","Impact","Ink Free","Javanese Text","Leelawadee UI","Lucida Console","Lucida Sans Unicode","Malgun Gothic","Marlett","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Sans Serif","Microsoft Tai Le","Microsoft YaHei","Microsoft Yi Baiti","MingLiU-ExtB","Mongolian Baiti","MS Gothic","MV Boli","Myanmar Text","Nirmala UI","Palatino Linotype","Segoe MDL2 Assets","Segoe Print","Segoe Script","Segoe UI","Segoe UI Historic","Segoe UI Emoji","Segoe UI Symbol","SimSun","Sitka","Sylfaen","Symbol","Tahoma","Times New Roman","Trebuchet MS","Verdana","Webdings","Wingdings","Yu Gothic","American Typewriter","Andale Mono","Arial","Arial Black","Arial Narrow","Arial Rounded MT Bold","Arial Unicode MS","Avenir","Avenir Next","Avenir Next Condensed","Baskerville","Big Caslon","Bodoni 72","Bodoni 72 Oldstyle","Bodoni 72 Smallcaps","Bradley Hand","Brush Script MT","Chalkboard","Chalkboard SE","Chalkduster","Charter","Cochin","Comic Sans MS","Copperplate","Courier","Courier New","Didot","DIN Alternate","DIN Condensed","Futura","Geneva","Georgia","Gill Sans","Helvetica","Helvetica Neue","Herculanum","Hoefler Text","Impact","Lucida Grande","Luminari","Marker Felt","Menlo","Microsoft Sans Serif","Monaco","Noteworthy","Optima","Palatino","Papyrus","Phosphate","Rockwell","Savoye LET","SignPainter","Skia","Snell Roundhand","Tahoma","Times","Times New Roman","Trattatello","Trebuchet MS","Verdana","Zapfino"].sort());document.fonts.ready;const s=new Set;for(const n of i.values())document.fonts.check(`${e.fontsize}px "${n}"`)&&s.add(n);const d=[];for(const n of s)d.push({title:n,value:n});return o().createElement(g.Z,null,o().createElement(b.Z,{value:e[t.name],onChange:n=>{a({[t.name]:n.target.value})},input:o().createElement(m.Z,{name:"fontfamily"}),label:u.ZP.t("vis_2_widgets_abfallkalender_fontfamily"),style:{fontSize:"12.8px"}},d.map(n=>o().createElement(y.Z,{key:n.value,value:n.value,style:{fontSize:"16px"}},n.title))))}static showWasteTypes(t,e,a){const i="selectwastetypes"in e&&e.selectwastetypes!==""?e.selectwastetypes.replaceAll("[","{").replaceAll("]","}").replaceAll("#",'"').split("}").slice(0,-1):[];for(let s=0;s<i.length;s++)i[s]+="}",i[s]=JSON.parse(i[s].replaceAll(/'/g,'"'));return e.selectwastetypes===""?o().createElement("div",null):o().createElement(g.Z,null,o().createElement(b.Z,{value:e[t.name],onChange:s=>{a({[t.name]:s.target.value})},input:o().createElement(m.Z,{name:"wastetypes"}),label:u.ZP.t("vis_2_widgets_abfallkalender_wastetype"),style:{fontSize:"12.8px"}},i.map(s=>o().createElement(y.Z,{key:s.value,value:s.value,style:{fontSize:"16px"}},s.title))))}static showCheckbox(t,e,a){return o().createElement(g.Z,null,o().createElement(T.Z,{checked:e[t.name],onChange:i=>{a({[t.name]:i.target.checked})},color:"primary"}))}getWasteTypes(t){return f(this,null,function*(){if(t==="")return"";let e=this.state.data.wastetype;const a=yield this.props.socket.getObjectViewSystem("instance","system.adapter.abfallkalender.","system.adapter.abfallkalender.\u9999").then(i=>{const s=[];return Object.keys(i).forEach(d=>{if(Object.keys(i).length===1||i[d]._id===`system.adapter.${t}`)for(let n=0;n<i[d].native.wasteTypes.length;n++)i[d].native.wasteTypes[n].used===!0&&s.push({value:i[d].native.wasteTypes[n].value,title:i[d].native.wasteTypes[n].title,whatsapp:i[d].native.wasteTypes[n].whatsapp,blink:i[d].native.wasteTypes[n].blink})}),s}).catch(i=>(console.log("ERROR !!!:"),console.log(i),[]));return this.state.editMode&&(yield this.arr2string(a).then(i=>{this.changeData({selectwastetypes:i})}),this.changeData({wastetypedisabled:a.length<2?"true":"false"})),this.initial===!0&&(!("wastetype"in this.state.data)||this.state.data.wastetype==="")&&(e=a.length>0?a[0].value:"",this.changeData({wastetype:e})),this.wastetypeLocal=e,e})}arr2string(t){return f(this,null,function*(){let e="";return t.map(a=>{e+="[",Object.keys(a).forEach((i,s)=>{s>0&&(e+=","),e+=`#${i}#: #${a[i].toString()}#`}),e+="]"}),e})}renderWidgetBody(t){return super.renderWidgetBody(t),o().createElement(D.Z,{class:`"card-trash${t.id}"`,style:{width:"100%",height:"100%"}},o().createElement(A.Z,{style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}},o().createElement(I.r,{class:`"trashicon${t.id}"`,ref:this.refTrashIcon})))}}M.default=(0,v.withStyles)(L)((0,v.withTheme)(w))}}]);

//# sourceMappingURL=src_Abfallkalender_jsx.91a077ff.chunk.js.map