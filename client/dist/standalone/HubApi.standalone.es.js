class e{static byteLength(t){const[r,s]=e._getLengths(t);return e._byteLength(r,s)}static decode(t){e._initRevLookup();const[r,s]=e._getLengths(t),i=new Uint8Array(e._byteLength(r,s));let n=0;const o=s>0?r-4:r;let a=0;for(;a<o;a+=4){const r=e._revLookup[t.charCodeAt(a)]<<18|e._revLookup[t.charCodeAt(a+1)]<<12|e._revLookup[t.charCodeAt(a+2)]<<6|e._revLookup[t.charCodeAt(a+3)];i[n++]=r>>16&255,i[n++]=r>>8&255,i[n++]=255&r}if(2===s){const r=e._revLookup[t.charCodeAt(a)]<<2|e._revLookup[t.charCodeAt(a+1)]>>4;i[n++]=255&r}if(1===s){const r=e._revLookup[t.charCodeAt(a)]<<10|e._revLookup[t.charCodeAt(a+1)]<<4|e._revLookup[t.charCodeAt(a+2)]>>2;i[n++]=r>>8&255,i[n]=255&r}return i}static encode(t){const r=t.length,s=r%3,i=[];for(let n=0,o=r-s;n<o;n+=16383)i.push(e._encodeChunk(t,n,n+16383>o?o:n+16383));if(1===s){const s=t[r-1];i.push(e._lookup[s>>2]+e._lookup[s<<4&63]+"==")}else if(2===s){const s=(t[r-2]<<8)+t[r-1];i.push(e._lookup[s>>10]+e._lookup[s>>4&63]+e._lookup[s<<2&63]+"=")}return i.join("")}static encodeUrl(t){return e.encode(t).replace(/\//g,"_").replace(/\+/g,"-").replace(/=/g,".")}static decodeUrl(t){return e.decode(t.replace(/_/g,"/").replace(/-/g,"+").replace(/\./g,"="))}static _initRevLookup(){if(0===e._revLookup.length){e._revLookup=[];for(let t=0,r=e._lookup.length;t<r;t++)e._revLookup[e._lookup.charCodeAt(t)]=t;e._revLookup["-".charCodeAt(0)]=62,e._revLookup["_".charCodeAt(0)]=63}}static _getLengths(e){const t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");let r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}static _byteLength(e,t){return 3*(e+t)/4-t}static _tripletToBase64(t){return e._lookup[t>>18&63]+e._lookup[t>>12&63]+e._lookup[t>>6&63]+e._lookup[63&t]}static _encodeChunk(t,r,s){const i=[];for(let n=r;n<s;n+=3){const r=(t[n]<<16&16711680)+(t[n+1]<<8&65280)+(255&t[n+2]);i.push(e._tripletToBase64(r))}return i.join("")}}var t,r,s;e._lookup="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e._revLookup=[],function(e){e[e.UINT8_ARRAY=0]="UINT8_ARRAY"}(t||(t={}));class i{static stringify(e){return JSON.stringify(e,i._jsonifyType)}static parse(e){return JSON.parse(e,i._parseType)}static _parseType(r,s){if(s&&s.hasOwnProperty&&s.hasOwnProperty(i.TYPE_SYMBOL)&&s.hasOwnProperty(i.VALUE_SYMBOL))switch(s[i.TYPE_SYMBOL]){case t.UINT8_ARRAY:return e.decode(s[i.VALUE_SYMBOL])}return s}static _jsonifyType(r,s){return s instanceof Uint8Array?i._typedObject(t.UINT8_ARRAY,e.encode(s)):s}static _typedObject(e,t){const r={};return r[i.TYPE_SYMBOL]=e,r[i.VALUE_SYMBOL]=t,r}}i.TYPE_SYMBOL="__",i.VALUE_SYMBOL="v";class n{static generateRandomId(){const e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}}!function(e){e.HTTP_POST="http-post",e.HTTP_GET="http-get",e.POST_MESSAGE="post-message"}(r||(r={})),function(e){e.OK="ok",e.ERROR="error"}(s||(s={}));class o{constructor(e=!0){this._store=e?window.sessionStorage:null,this._validIds=new Map,e&&this._restoreIds()}static _decodeIds(e){const t=i.parse(e),r=new Map;for(const e of Object.keys(t)){const s=parseInt(e,10);r.set(isNaN(s)?e:s,t[e])}return r}has(e){return this._validIds.has(e)}getCommand(e){const t=this._validIds.get(e);return t?t[0]:null}getState(e){const t=this._validIds.get(e);return t?t[1]:null}add(e,t,r=null){this._validIds.set(e,[t,r]),this._storeIds()}remove(e){this._validIds.delete(e),this._storeIds()}clear(){this._validIds.clear(),this._store&&this._store.removeItem(o.KEY)}_encodeIds(){const e=Object.create(null);for(const[t,r]of this._validIds)e[t]=r;return i.stringify(e)}_restoreIds(){const e=this._store.getItem(o.KEY);e&&(this._validIds=o._decodeIds(e))}_storeIds(){this._store&&this._store.setItem(o.KEY,this._encodeIds())}}o.KEY="rpcRequests";class a{static receiveRedirectCommand(e){const t=new URL(e.href);if(!document.referrer)return null;const s=new URL(document.referrer),n=new URLSearchParams(t.search),o=new URLSearchParams(t.hash.substring(1));if(!o.has("id"))return null;const c=parseInt(o.get("id"),10);if(o.delete("id"),n.set(a.URL_SEARCHPARAM_NAME,c.toString()),!o.has("command"))return null;const l=o.get("command");if(o.delete("command"),!o.has("returnURL"))return null;const h=o.get("returnURL");o.delete("returnURL");let d=r.HTTP_GET;if(o.has("responseMethod")&&(d=o.get("responseMethod"),o.delete("responseMethod"),!Object.values(r).includes(d)))throw new Error("Invalid ResponseMethod");if(!(d===r.POST_MESSAGE&&(window.opener||window.parent))&&new URL(h).origin!==s.origin)return null;let u=[];if(o.has("args"))try{u=i.parse(o.get("args"))}catch(e){}return u=Array.isArray(u)?u:[],o.delete("args"),t.search=n.toString(),this._setUrlFragment(t,o),history.replaceState(history.state,"",t.href),{origin:s.origin,data:{id:c,command:l,args:u},returnURL:h,responseMethod:d,source:d===r.POST_MESSAGE?window.opener||window.parent:null}}static receiveRedirectResponse(e){const t=new URL(e.href);if(!document.referrer)return null;const r=new URL(document.referrer),n=new URLSearchParams(t.search),o=new URLSearchParams(t.hash.substring(1));if(!o.has("id"))return null;const c=parseInt(o.get("id"),10);if(o.delete("id"),n.set(a.URL_SEARCHPARAM_NAME,c.toString()),!o.has("status"))return null;const l=o.get("status")===s.OK?s.OK:s.ERROR;if(o.delete("status"),!o.has("result"))return null;const h=i.parse(o.get("result"));return o.delete("result"),t.search=n.toString(),this._setUrlFragment(t,o),history.replaceState(history.state,"",t.href),{origin:r.origin,data:{id:c,status:l,result:h}}}static prepareRedirectReply(e,t,r){const s=new URL(e.returnURL),n=new URLSearchParams(s.hash.substring(1));return n.set("id",e.id.toString()),n.set("status",t),n.set("result",i.stringify(r)),s.hash=n.toString(),s.href}static prepareRedirectInvocation(e,t,r,s,n,o){const a=new URL(e),c=new URLSearchParams(a.hash.substring(1));return c.set("id",t.toString()),c.set("returnURL",r),c.set("command",s),c.set("responseMethod",o),Array.isArray(n)&&c.set("args",i.stringify(n)),a.hash=c.toString(),a.href}static _setUrlFragment(e,t){t.toString().endsWith("=")?e.hash=t.toString().slice(0,-1):e.hash=t.toString()}}a.URL_SEARCHPARAM_NAME="rpcId";class c{constructor(e,t=!1){this._allowedOrigin=e,this._waitingRequests=new o(t),this._responseHandlers=new Map,this._preserveRequests=!1}onResponse(e,t,r){this._responseHandlers.set(e,{resolve:t,reject:r})}_receive(e){if(!e.data||!e.data.status||!e.data.id||"*"!==this._allowedOrigin&&e.origin!==this._allowedOrigin)return!1;const t=e.data,r=this._getCallback(t.id),i=this._waitingRequests.getState(t.id);if(r){if(this._preserveRequests||(this._waitingRequests.remove(t.id),this._responseHandlers.delete(t.id)),console.debug("RpcClient RECEIVE",t),t.status===s.OK)r.resolve(t.result,t.id,i);else if(t.status===s.ERROR){const e=new Error(t.result.message);t.result.stack&&(e.stack=t.result.stack),t.result.name&&(e.name=t.result.name),r.reject(e,t.id,i)}return!0}return console.warn("Unknown RPC response:",t),!1}_getCallback(e){if(this._responseHandlers.has(e))return this._responseHandlers.get(e);{const t=this._waitingRequests.getCommand(e);if(t)return this._responseHandlers.get(t)}}}class l extends c{constructor(e,t){super(t),this._serverCloseCheckInterval=-1,this._target=e,this._connectionState=0,this._receiveListener=this._receive.bind(this)}async init(){2!==this._connectionState&&(await this._connect(),window.addEventListener("message",this._receiveListener),-1===this._serverCloseCheckInterval&&(this._serverCloseCheckInterval=window.setInterval(()=>this._checkIfServerClosed(),300)))}async call(e,...t){return this._call({command:e,args:t,id:n.generateRandomId()})}close(){this._connectionState=0,window.removeEventListener("message",this._receiveListener),window.clearInterval(this._serverCloseCheckInterval),this._serverCloseCheckInterval=-1;for(const[e,{reject:t}]of this._responseHandlers){const r=this._waitingRequests.getState(e);t("Connection was closed","number"==typeof e?e:void 0,r)}this._waitingRequests.clear(),this._responseHandlers.clear(),this._target&&this._target.closed&&(this._target=null)}_receive(e){return e.source===this._target&&super._receive(e)}async _call(e){if(!this._target||this._target.closed)throw new Error("Connection was closed.");if(2!==this._connectionState)throw new Error("Client is not connected, call init first");return new Promise((t,r)=>{this._responseHandlers.set(e.id,{resolve:t,reject:r}),this._waitingRequests.add(e.id,e.command),console.debug("RpcClient REQUEST",e.command,e.args),this._target.postMessage(e,this._allowedOrigin)})}_connect(){if(2!==this._connectionState)return this._connectionState=1,new Promise((e,t)=>{const r=t=>{const{source:i,origin:n,data:o}=t;if(i===this._target&&o.status===s.OK&&"pong"===o.result&&1===o.id&&("*"===this._allowedOrigin||n===this._allowedOrigin)){if(o.result.stack){const e=new Error(o.result.message);e.stack=o.result.stack,o.result.name&&(e.name=o.result.name),console.error(e)}window.removeEventListener("message",r),this._connectionState=2,console.log("RpcClient: Connection established"),e(!0)}};window.addEventListener("message",r);const i=()=>{if(2!==this._connectionState){if(0===this._connectionState||this._checkIfServerClosed())return window.removeEventListener("message",r),void t(new Error("Connection was closed"));try{this._target.postMessage({command:"ping",id:1},this._allowedOrigin)}catch(e){console.error(`postMessage failed: ${e}`)}window.setTimeout(i,100)}};window.setTimeout(i,100)})}_checkIfServerClosed(){return!(this._target&&!this._target.closed)&&(this.close(),!0)}}class h extends c{constructor(e,t,r=!0){super(t,!0),this._target=e,this._preserveRequests=r}async init(){const e=a.receiveRedirectResponse(window.location);if(e)return void this._receive(e);if(this._rejectOnBack())return;const t=new URLSearchParams(window.location.search);if(t.has(a.URL_SEARCHPARAM_NAME)){const e=window.sessionStorage.getItem(`response-${t.get(a.URL_SEARCHPARAM_NAME)}`);if(e)return void this._receive(i.parse(e),!1)}}close(){}call(e,t,s,...i){if(s&&"boolean"!=typeof s){if("object"==typeof s){if(s.responseMethod===r.POST_MESSAGE){if(!window.opener&&!window.parent)throw new Error("Window has no opener or parent, responseMethod: ResponseMethod.POST_MESSAGE would fail.");console.warn("Response will skip at least one rpc call, which will result in an unknown response.")}this._call(e,t,s,...i)}}else"boolean"==typeof s&&console.warn("RedirectRpcClient.call(string, string, boolean, any[]) is deprecated. Use RedirectRpcClient.call(string, string, CallOptions, any[]) with an appropriate CallOptions object instead."),this._call(e,t,{responseMethod:r.HTTP_GET,handleHistoryBack:!!s},...i)}callAndSaveLocalState(e,t,s,i=!1,...n){console.warn("RedirectRpcClient.callAndSaveLocalState() is deprecated. Use RedirectRpcClient.call() with an apropriate CallOptions object instead."),this._call(e,s,{responseMethod:r.HTTP_GET,state:t||void 0,handleHistoryBack:i},...n)}_receive(e,t=!0){const r=super._receive(e);return r&&t&&window.sessionStorage.setItem(`response-${e.data.id}`,i.stringify(e)),r}_call(e,t,s,...i){const o=n.generateRandomId(),c=s.responseMethod||r.HTTP_GET,l=a.prepareRedirectInvocation(this._target,o,e,t,i,c);this._waitingRequests.add(o,t,s.state||null),s.handleHistoryBack&&history.replaceState(Object.assign({},history.state,{rpcBackRejectionId:o}),""),console.debug("RpcClient REQUEST",t,i),window.location.href=l}_rejectOnBack(){if(!history.state||!history.state.rpcBackRejectionId)return!1;const e=history.state.rpcBackRejectionId;history.replaceState(Object.assign({},history.state,{rpcBackRejectionId:null}),"");const t=this._getCallback(e),r=this._waitingRequests.getState(e);if(t){this._preserveRequests||(this._waitingRequests.remove(e),this._responseHandlers.delete(e)),console.debug("RpcClient BACK");const s=new Error("Request aborted");return t.reject(s,e,r),!0}return!1}}class d{static getBrowserInfo(){return{browser:d.detectBrowser(),version:d.detectVersion(),isMobile:d.isMobile()}}static isMobile(){return/i?Phone|iP(ad|od)|Android|BlackBerry|Opera Mini|WPDesktop|Mobi(le)?|Silk/i.test(navigator.userAgent)}static detectBrowser(){if(d._detectedBrowser)return d._detectedBrowser;const e=navigator.userAgent;return/Edge\//i.test(e)?d._detectedBrowser=d.Browser.EDGE:/(Opera|OPR)\//i.test(e)?d._detectedBrowser=d.Browser.OPERA:/Firefox\//i.test(e)?d._detectedBrowser=d.Browser.FIREFOX:/Chrome\//i.test(e)?d._detectedBrowser=0!==navigator.plugins.length||0!==navigator.mimeTypes.length||d.isMobile()?d.Browser.CHROME:d.Browser.BRAVE:/^((?!chrome|android).)*safari/i.test(e)?d._detectedBrowser=d.Browser.SAFARI:d._detectedBrowser=d.Browser.UNKNOWN,d._detectedBrowser}static detectVersion(){if(void 0!==d._detectedVersion)return d._detectedVersion;let e;switch(d.detectBrowser()){case d.Browser.EDGE:e=/Edge\/(\S+)/i;break;case d.Browser.OPERA:e=/(Opera|OPR)\/(\S+)/i;break;case d.Browser.FIREFOX:e=/Firefox\/(\S+)/i;break;case d.Browser.CHROME:e=/Chrome\/(\S+)/i;break;case d.Browser.SAFARI:e=/(iP(hone|ad|od).*?OS |Version\/)(\S+)/i;break;case d.Browser.BRAVE:default:return d._detectedVersion=null,null}const t=navigator.userAgent.match(e);if(!t)return d._detectedVersion=null,null;const r=t[t.length-1].replace(/_/g,"."),s=r.split("."),i=[];for(let e=0;e<4;++e)i.push(parseInt(s[e],10)||0);const[n,o,a,c]=i;return d._detectedVersion={versionString:r,major:n,minor:o,build:a,patch:c},d._detectedVersion}static isChrome(){return d.detectBrowser()===d.Browser.CHROME}static isFirefox(){return d.detectBrowser()===d.Browser.FIREFOX}static isOpera(){return d.detectBrowser()===d.Browser.OPERA}static isEdge(){return d.detectBrowser()===d.Browser.EDGE}static isSafari(){return d.detectBrowser()===d.Browser.SAFARI}static isBrave(){return d.detectBrowser()===d.Browser.BRAVE}static isIOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}static isBadIOS(){const e=d.getBrowserInfo();return e.browser===d.Browser.SAFARI&&e.isMobile&&e.version&&(e.version.major<11||11===e.version.major&&2===e.version.minor)}static isPrivateMode(){return new Promise(e=>{const t=()=>e(!0),r=()=>e(!1);if(window.webkitRequestFileSystem)window.webkitRequestFileSystem(0,0,r,t);else{if(document.documentElement&&"MozAppearance"in document.documentElement.style){const e=indexedDB.open(null);return e.onerror=t,void(e.onsuccess=r)}if((()=>/Constructor/.test(window.HTMLElement)||window.safari&&window.safari.pushNotification&&"[object SafariRemoteNotification]"===window.safari.pushNotification.toString())())try{window.openDatabase(null,null,null,null)}catch(e){return void t()}window.indexedDB||!window.PointerEvent&&!window.MSPointerEvent?r():t()}})}}!function(e){let t;!function(e){e.CHROME="chrome",e.FIREFOX="firefox",e.OPERA="opera",e.EDGE="edge",e.SAFARI="safari",e.BRAVE="brave",e.UNKNOWN="unknown"}(t=e.Browser||(e.Browser={}))}(d||(d={}));var u=d,p={"popup-overlay":"A popup has been opened,\nclick anywhere to bring it back to the front."};const _={de:{"popup-overlay":"Ein Popup hat sich geöffnet,\nklicke hier, um zurück zum Popup zu kommen."},en:p,es:{"popup-overlay":"Se ha abierto una ventana emergente.\nHaga click en cualquier lugar para traer la ventana al primer plano."},fil:{"popup-overlay":"Nag-bukas ang isang pop-up.\nMaaring pindutin kahit saan para ibalik ito sa harap."},fr:{"popup-overlay":"Une popup a été ouverte,\ncliquez n'importe où pour la ramener au premier plan."},nl:{"popup-overlay":"Er is een pop-up geopend,\nklik op het scherm om het weer naar voren te brengen."},pl:{"popup-overlay":"Pojawiło się wyskakujące okno.\nAby je zobaczyć, kliknij w dowolnym miejscu."},pt:{"popup-overlay":"Um popup foi aberto,\nclique em qualquer lado para o trazer para a frente."},ru:{"popup-overlay":"Открыто всплывающее окно.\nНажмите где-нибудь, чтобы вернуть его на передний план."},tr:{"popup-overlay":"Bir popup penceresi açıldı,\nöne çekmek için herhangi bir yere tıkla. "},uk:{"popup-overlay":"Відкрито випадаюче вікно.\nклацніть будь-де щоб перейти до ньго."},zh:{"popup-overlay":"弹出窗口已打开，\n单击任意位置即可回到上一页"}};class w{constructor(e){this._type=e}static getAllowedOrigin(e){return new URL(e).origin}async request(e,t,r){throw new Error("Not implemented")}}var g,R,A,m,E,S,v,f;!function(e){e[e.REDIRECT=0]="REDIRECT",e[e.POPUP=1]="POPUP",e[e.IFRAME=2]="IFRAME"}(g||(g={}));class I extends w{constructor(e,t){super(g.REDIRECT);const r=window.location;if(this._returnUrl=e||`${r.origin}${r.pathname}`,this._localState=t||{},void 0!==this._localState.__command)throw new Error("Invalid localState: Property '__command' is reserved")}static withLocalState(e){return new I(void 0,e)}async request(e,t,r){const s=w.getAllowedOrigin(e),i=new h(e,s);await i.init();const n=Object.assign({},this._localState,{__command:t});i.callAndSaveLocalState(this._returnUrl,n,t,!0,...await Promise.all(r))}}class y extends w{constructor(e=y.DEFAULT_FEATURES,t){super(g.POPUP),this.shouldRetryRequest=!1,this._popupFeatures=e,this._options={...y.DEFAULT_OPTIONS,...t}}async request(e,t,r){const s=w.getAllowedOrigin(e),i=this.appendOverlay();do{this.shouldRetryRequest=!1;try{return this.popup=this.createPopup(e),this.client=new l(this.popup,s),await this.client.init(),await this.client.call(t,...await Promise.all(r))}catch(e){if(!this.shouldRetryRequest)throw e}finally{this.shouldRetryRequest||(this.removeOverlay(i),this.client&&this.client.close(),this.popup&&this.popup.close())}}while(this.shouldRetryRequest);throw this.popup&&this.popup.close(),this.client&&this.client.close(),i&&this.removeOverlay(i),new Error("Unexpected error occurred")}createPopup(e){const t=window.open(e,"NimiqAccounts",this._popupFeatures);if(!t)throw new Error("Failed to open popup");return t}appendOverlay(){if(!this._options.overlay)return null;const e=document.createElement.bind(document),t=(e,t)=>e.appendChild(t),r=e("div");r.id="nimiq-hub-overlay";const s=r.style;s.position="fixed",s.top="0",s.right="0",s.bottom="0",s.left="0",s.background="rgba(31, 35, 72, 0.8)",s.display="flex",s.flexDirection="column",s.alignItems="center",s.justifyContent="space-between",s.cursor="pointer",s.color="white",s.textAlign="center",s.opacity="0",s.transition="opacity 0.6s ease",s.zIndex="99999",r.addEventListener("click",()=>{u.isIOS()?(this.shouldRetryRequest=!0,this.popup&&this.popup.close(),this.client&&this.client.close()):this.popup&&this.popup.focus()}),t(r,e("div"));const i=e("div");i.textContent=function(e,t){if(!t){const e=document.cookie.match(/(^| )lang=([^;]+)/);t=e&&e[2]||navigator.language.split("-")[0]}return(_[t]||p)[e]||p[e]}("popup-overlay");const n=i.style;n.padding="20px",n.fontFamily='Muli, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',n.fontSize="24px",n.fontWeight="600",n.lineHeight="40px",n.whiteSpace="pre-line",t(r,i);const o=e("img");o.src='data:image/svg+xml,<svg width="135" height="32" viewBox="0 0 135 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.6 14.5l-7.5-13A3 3 0 0025.5 0h-15a3 3 0 00-2.6 1.5l-7.5 13a3 3 0 000 3l7.5 13a3 3 0 002.6 1.5h15a3 3 0 002.6-1.5l7.5-13a3 3 0 000-3z" fill="url(%23hub-overlay-nimiq-logo)"/><path d="M62.25 6.5h3.26v19H63L52.75 12.25V25.5H49.5v-19H52l10.25 13.25V6.5zM72 25.5v-19h3.5v19H72zM97.75 6.5h2.75v19h-3V13.75L92.37 25.5h-2.25L85 13.75V25.5h-3v-19h2.75l6.5 14.88 6.5-14.88zM107 25.5v-19h3.5v19H107zM133.88 21.17a7.91 7.91 0 01-4.01 3.8c.16.38.94 1.44 1.52 2.05.59.6 1.2 1.23 1.98 1.86L131 30.75a15.91 15.91 0 01-4.45-5.02l-.8.02c-1.94 0-3.55-.4-4.95-1.18a7.79 7.79 0 01-3.2-3.4 11.68 11.68 0 01-1.1-5.17c0-2.03.37-3.69 1.12-5.17a7.9 7.9 0 013.2-3.4 9.8 9.8 0 014.93-1.18c1.9 0 3.55.4 4.94 1.18a7.79 7.79 0 013.2 3.4 11.23 11.23 0 011.1 5.17c0 2.03-.44 3.83-1.11 5.17zm-12.37.01a5.21 5.21 0 004.24 1.82 5.2 5.2 0 004.23-1.82c1.01-1.21 1.52-2.92 1.52-5.18 0-2.24-.5-4-1.52-5.2a5.23 5.23 0 00-4.23-1.8c-1.82 0-3.23.6-4.24 1.79-1 1.2-1.51 2.95-1.51 5.21s.5 3.97 1.51 5.18z" fill="white"/><defs><radialGradient id="hub-overlay-nimiq-logo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-35.9969 0 0 -32 36 32)"><stop stop-color="%23EC991C"/><stop offset="1" stop-color="%23E9B213"/></radialGradient></defs></svg>',o.style.marginBottom="56px",t(r,o);const a=e("div"),c=a.style;return a.innerHTML="&times;",c.position="absolute",c.top="8px",c.right="8px",c.fontSize="24px",c.lineHeight="32px",c.fontWeight="600",c.width="32px",c.height="32px",c.opacity="0.8",a.addEventListener("click",e=>{this.popup&&this.popup.close(),e.stopPropagation()}),t(r,a),setTimeout(()=>r.style.opacity="1",100),t(document.body,r)}removeOverlay(e){e&&(e.style.opacity="0",setTimeout(()=>document.body.removeChild(e),400))}}y.DEFAULT_FEATURES="",y.DEFAULT_OPTIONS={overlay:!0};class C extends w{constructor(){super(g.IFRAME),this._iframe=null,this._client=null}async request(e,t,r){if(this._iframe&&this._iframe.src!==`${e}${C.IFRAME_PATH_SUFFIX}`)throw new Error("Hub iframe is already opened with another endpoint");const s=w.getAllowedOrigin(e);if(this._iframe||(this._iframe=await this.createIFrame(e)),!this._iframe.contentWindow)throw new Error(`IFrame contentWindow is ${typeof this._iframe.contentWindow}`);return this._client||(this._client=new l(this._iframe.contentWindow,s),await this._client.init()),await this._client.call(t,...await Promise.all(r))}async createIFrame(e){return new Promise((t,r)=>{const s=document.createElement("iframe");s.name="NimiqAccountsIFrame",s.style.display="none",document.body.appendChild(s),s.src=`${e}${C.IFRAME_PATH_SUFFIX}`,s.onload=(()=>t(s)),s.onerror=r})}}C.IFRAME_PATH_SUFFIX="/iframe.html",function(e){e.LIST="list",e.LIST_CASHLINKS="list-cashlinks",e.MIGRATE="migrate",e.CHECKOUT="checkout",e.SIGN_MESSAGE="sign-message",e.SIGN_TRANSACTION="sign-transaction",e.SIGN_STAKING="sign-staking",e.ONBOARD="onboard",e.SIGNUP="signup",e.LOGIN="login",e.EXPORT="export",e.CHANGE_PASSWORD="change-password",e.LOGOUT="logout",e.ADD_ADDRESS="add-address",e.RENAME="rename",e.ADD_VESTING_CONTRACT="add-vesting-contract",e.CHOOSE_ADDRESS="choose-address",e.CREATE_CASHLINK="create-cashlink",e.MANAGE_CASHLINK="manage-cashlink",e.SIGN_BTC_TRANSACTION="sign-btc-transaction",e.ADD_BTC_ADDRESSES="add-btc-addresses",e.SIGN_POLYGON_TRANSACTION="sign-polygon-transaction",e.ACTIVATE_BITCOIN="activate-bitcoin",e.ACTIVATE_POLYGON="activate-polygon",e.SETUP_SWAP="setup-swap",e.REFUND_SWAP="refund-swap"}(R||(R={})),function(e){e[e.LEGACY=1]="LEGACY",e[e.BIP39=2]="BIP39",e[e.LEDGER=3]="LEDGER"}(A||(A={})),function(e){e[e.DIRECT=0]="DIRECT",e[e.OASIS=1]="OASIS"}(m||(m={})),function(e){e.NIM="nim",e.BTC="btc",e.ETH="eth"}(E||(E={})),function(e){e.NOT_FOUND="NOT_FOUND",e.PAID="PAID",e.UNDERPAID="UNDERPAID",e.OVERPAID="OVERPAID"}(S||(S={})),function(e){e[e.UNKNOWN=-1]="UNKNOWN",e[e.UNCHARGED=0]="UNCHARGED",e[e.CHARGING=1]="CHARGING",e[e.UNCLAIMED=2]="UNCLAIMED",e[e.CLAIMING=3]="CLAIMING",e[e.CLAIMED=4]="CLAIMED"}(v||(v={})),function(e){e[e.UNSPECIFIED=0]="UNSPECIFIED",e[e.STANDARD=1]="STANDARD",e[e.CHRISTMAS=2]="CHRISTMAS",e[e.LUNAR_NEW_YEAR=3]="LUNAR_NEW_YEAR",e[e.EASTER=4]="EASTER",e[e.GENERIC=5]="GENERIC",e[e.BIRTHDAY=6]="BIRTHDAY"}(f||(f={}));class O{constructor(e=O.DEFAULT_ENDPOINT,t){this._endpoint=e,this._defaultBehavior=t||new y(`left=${window.innerWidth/2-400},top=75,width=800,height=850,location=yes,dependent=yes`),this._checkoutDefaultBehavior=t||new y(`left=${window.innerWidth/2-400},top=50,width=800,height=895,location=yes,dependent=yes`),this._iframeBehavior=new C,this._redirectClient=new h("",w.getAllowedOrigin(this._endpoint))}static get PaymentMethod(){return console.warn("PaymentMethod has been renamed to PaymentType. Access via HubApi.PaymentMethod will soon get disabled. Use HubApi.PaymentType instead."),m}static get DEFAULT_ENDPOINT(){const e=location.hostname.match(/(?:[^.]+\.[^.]+|localhost)$/),t=e?e[0]:location.hostname;switch(t){case"nimiq.com":case"nimiq-testnet.com":return`https://hub.${t}`;case"bs-local.com":return`${window.location.protocol}//bs-local.com:8080`;default:return"http://localhost:8080"}}checkRedirectResponse(){return this._redirectClient.init()}on(e,t,r){this._redirectClient.onResponse(e,(e,r,s)=>t(e,s),(e,t,s)=>{r&&r(e,s)})}createCashlink(e,t=this._defaultBehavior){return this._request(t,R.CREATE_CASHLINK,[e])}manageCashlink(e,t=this._defaultBehavior){return this._request(t,R.MANAGE_CASHLINK,[e])}checkout(e,t=this._checkoutDefaultBehavior){return this._request(t,R.CHECKOUT,[e])}chooseAddress(e,t=this._defaultBehavior){return this._request(t,R.CHOOSE_ADDRESS,[e])}signTransaction(e,t=this._defaultBehavior){return this._request(t,R.SIGN_TRANSACTION,[e])}signStaking(e,t=this._defaultBehavior){return this._request(t,R.SIGN_STAKING,[e])}signMessage(e,t=this._defaultBehavior){return this._request(t,R.SIGN_MESSAGE,[e])}signBtcTransaction(e,t=this._defaultBehavior){return this._request(t,R.SIGN_BTC_TRANSACTION,[e])}signPolygonTransaction(e,t=this._defaultBehavior){return this._request(t,R.SIGN_POLYGON_TRANSACTION,[e])}setupSwap(e,t=this._defaultBehavior){return this._request(t,R.SETUP_SWAP,[e])}refundSwap(e,t=this._defaultBehavior){return this._request(t,R.REFUND_SWAP,[e])}onboard(e,t=this._defaultBehavior){return this._request(t,R.ONBOARD,[e])}signup(e,t=this._defaultBehavior){return this._request(t,R.SIGNUP,[e])}login(e,t=this._defaultBehavior){return this._request(t,R.LOGIN,[e])}logout(e,t=this._defaultBehavior){return this._request(t,R.LOGOUT,[e])}export(e,t=this._defaultBehavior){return this._request(t,R.EXPORT,[e])}changePassword(e,t=this._defaultBehavior){return this._request(t,R.CHANGE_PASSWORD,[e])}addAddress(e,t=this._defaultBehavior){return this._request(t,R.ADD_ADDRESS,[e])}rename(e,t=this._defaultBehavior){return this._request(t,R.RENAME,[e])}addVestingContract(e,t=this._defaultBehavior){return this._request(t,R.ADD_VESTING_CONTRACT,[e])}migrate(e=this._defaultBehavior){return this._request(e,R.MIGRATE,[{appName:"Account list"}])}activateBitcoin(e,t=this._defaultBehavior){return this._request(t,R.ACTIVATE_BITCOIN,[e])}activatePolygon(e,t=this._defaultBehavior){return this._request(t,R.ACTIVATE_POLYGON,[e])}list(e=this._iframeBehavior){return this._request(e,R.LIST,[])}cashlinks(e=this._iframeBehavior){return this._request(e,R.LIST_CASHLINKS,[])}addBtcAddresses(e,t=this._iframeBehavior){return this._request(t,R.ADD_BTC_ADDRESSES,[e])}_request(e,t,r){return e.request(this._endpoint,t,r)}}O.BehaviorType=g,O.RequestType=R,O.RedirectRequestBehavior=I,O.PopupRequestBehavior=y,O.AccountType=A,O.CashlinkState=v,O.CashlinkTheme=f,O.Currency=E,O.PaymentType=m,O.PaymentState=S,O.MSG_PREFIX="Nimiq Signed Message:\n";export default O;
