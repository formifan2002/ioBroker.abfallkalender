"use strict";(self.webpackChunkiobroker_vis_widgets_abfallkalender=self.webpackChunkiobroker_vis_widgets_abfallkalender||[]).push([["src_Abfallkalender_jsx"],{31984:function(p,f,e){e.r(f);var c=e(4819),m=e.n(c),d=e(94427),P=e.n(d),n=e(58503),k=e.n(n),g=e(75606),M=e.n(g),h=e(88411),O=e.n(h),E=(u,l,t)=>new Promise((o,s)=>{var i=a=>{try{r(t.next(a))}catch(v){s(v)}},D=a=>{try{r(t.throw(a))}catch(v){s(v)}},r=a=>a.done?o(a.value):Promise.resolve(a.value).then(i,D);r((t=t.apply(u,l)).next())});const b=()=>({root:{flex:1,display:"flex",justifyContent:"center",alignItems:"center",width:"100%",overflow:"hidden"}});class _ extends(window.visRxWidget||h.VisRxWidget){static getWidgetInfo(){return{id:"tplAbfallkalender",visSet:"vis-2-widgets-abfallkalender",visSetLabel:"vis_2_widgets_abfallkalender",visSetColor:"#cf00ff",visName:"Abfallkalender",visAttrs:[{name:"common",label:"vis_2_widgets_abfallkalender_common",fields:[{name:"oid",type:"id",label:"vis_2_widgets_abfallkalender_oid"}],onchange:(l,t,o,s)=>E(this,null,function*(){const i=yield s.getObject(t.oid);console.log("onchange in oid field"),i&&i.common&&o(t)})},{name:"common",fields:[{name:"dateformat",label:"vis_2_widgets_abfallkalender_dateformat",type:"select",options:[{value:"short",label:"vis_2_widgets_abfallkalender_dateformat_short"},{value:"long",label:"vis_2_widgets_abfallkalender_dateformat_short"}],default:"short"}]},{name:"common",fields:[{name:"whatsapplogo",label:"vis_2_widgets_abfallkalender_whatsapplogo",type:"checkbox"}]},{name:"common",fields:[{name:"blink",label:"vis_2_widgets_abfallkalender_blink",type:"checkbox"}]}],visPrev:"widgets/vis-2-widgets-abfallkalender/img/abfallkalender.png"}}propertiesUpdate(){}componentDidMount(){super.componentDidMount(),this.propertiesUpdate()}getWidgetInfo(){return _.getWidgetInfo()}onRxDataChanged(){console.log("onRxDataChanged"),this.propertiesUpdate()}onRxStyleChanged(){}onStateUpdated(l,t){console.log("onStateUpdated")}renderWidgetBody(l){return super.renderWidgetBody(l),m().createElement(d.Card,{style:{width:"100%",height:"100%"}},m().createElement(d.CardContent,null,g.I18n.t("vis_2_widgets_abfallkalender"),this.state.values[`${this.state.rxData.oid}.val`],this.state.values[`${this.state.rxData.dateformat}.val`],this.state.values[`${this.state.rxData.whatsapplogo}.val`],this.state.values[`${this.state.rxData.blink}.val`]))}}f.default=(0,n.withStyles)(b)((0,n.withTheme)(_))}}]);

//# sourceMappingURL=src_Abfallkalender_jsx.b46f4726.chunk.js.map