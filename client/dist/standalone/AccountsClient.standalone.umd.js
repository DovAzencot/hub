!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.AccountsClient=t()}(this,function(){"use strict";class e{static generateRandomId(){const e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}}var t,s,r,n;!function(e){e.OK="ok",e.ERROR="error"}(t||(t={}));class i{static byteLength(e){const[t,s]=i._getLengths(e);return i._byteLength(t,s)}static decode(e){i._initRevLookup();const[t,s]=i._getLengths(e),r=new Uint8Array(i._byteLength(t,s));let n=0;const o=s>0?t-4:t;let a=0;for(;a<o;a+=4){const t=i._revLookup[e.charCodeAt(a)]<<18|i._revLookup[e.charCodeAt(a+1)]<<12|i._revLookup[e.charCodeAt(a+2)]<<6|i._revLookup[e.charCodeAt(a+3)];r[n++]=t>>16&255,r[n++]=t>>8&255,r[n++]=255&t}if(2===s){const t=i._revLookup[e.charCodeAt(a)]<<2|i._revLookup[e.charCodeAt(a+1)]>>4;r[n++]=255&t}if(1===s){const t=i._revLookup[e.charCodeAt(a)]<<10|i._revLookup[e.charCodeAt(a+1)]<<4|i._revLookup[e.charCodeAt(a+2)]>>2;r[n++]=t>>8&255,r[n]=255&t}return r}static encode(e){const t=e.length,s=t%3,r=[];for(let n=0,o=t-s;n<o;n+=16383)r.push(i._encodeChunk(e,n,n+16383>o?o:n+16383));if(1===s){const s=e[t-1];r.push(i._lookup[s>>2]+i._lookup[s<<4&63]+"==")}else if(2===s){const s=(e[t-2]<<8)+e[t-1];r.push(i._lookup[s>>10]+i._lookup[s>>4&63]+i._lookup[s<<2&63]+"=")}return r.join("")}static encodeUrl(e){return i.encode(e).replace(/\//g,"_").replace(/\+/g,"-").replace(/=/g,".")}static decodeUrl(e){return i.decode(e.replace(/_/g,"/").replace(/-/g,"+").replace(/\./g,"="))}static _initRevLookup(){if(0===i._revLookup.length){i._revLookup=[];for(let e=0,t=i._lookup.length;e<t;e++)i._revLookup[i._lookup.charCodeAt(e)]=e;i._revLookup["-".charCodeAt(0)]=62,i._revLookup["_".charCodeAt(0)]=63}}static _getLengths(e){const t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");let s=e.indexOf("=");return-1===s&&(s=t),[s,s===t?0:4-s%4]}static _byteLength(e,t){return 3*(e+t)/4-t}static _tripletToBase64(e){return i._lookup[e>>18&63]+i._lookup[e>>12&63]+i._lookup[e>>6&63]+i._lookup[63&e]}static _encodeChunk(e,t,s){const r=[];for(let n=t;n<s;n+=3){const t=(e[n]<<16&16711680)+(e[n+1]<<8&65280)+(255&e[n+2]);r.push(i._tripletToBase64(t))}return r.join("")}}i._lookup="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i._revLookup=[],function(e){e[e.UINT8_ARRAY=0]="UINT8_ARRAY"}(s||(s={}));class o{static stringify(e){return JSON.stringify(e,o._jsonifyType)}static parse(e){return JSON.parse(e,o._parseType)}static _parseType(e,t){if(t&&t.hasOwnProperty&&t.hasOwnProperty(o.TYPE_SYMBOL)&&t.hasOwnProperty(o.VALUE_SYMBOL))switch(t[o.TYPE_SYMBOL]){case s.UINT8_ARRAY:return i.decode(t[o.VALUE_SYMBOL])}return t}static _jsonifyType(e,t){return t instanceof Uint8Array?o._typedObject(s.UINT8_ARRAY,i.encode(t)):t}static _typedObject(e,t){const s={};return s[o.TYPE_SYMBOL]=e,s[o.VALUE_SYMBOL]=t,s}}o.TYPE_SYMBOL="__",o.VALUE_SYMBOL="v";class a{constructor(e=!0){this._store=e?window.sessionStorage:null,this._validIds=new Map,e&&this._restoreIds()}static _decodeIds(e){const t=o.parse(e),s=new Map;for(const e of Object.keys(t)){const r=parseInt(e,10);s.set(isNaN(r)?e:r,t[e])}return s}has(e){return this._validIds.has(e)}getCommand(e){const t=this._validIds.get(e);return t?t[0]:null}getState(e){const t=this._validIds.get(e);return t?t[1]:null}add(e,t,s=null){this._validIds.set(e,[t,s]),this._storeIds()}remove(e){this._validIds.delete(e),this._storeIds()}clear(){this._validIds.clear(),this._store&&this._store.removeItem(a.KEY)}_encodeIds(){const e=Object.create(null);for(const[t,s]of this._validIds)e[t]=s;return o.stringify(e)}_restoreIds(){const e=this._store.getItem(a.KEY);e&&(this._validIds=a._decodeIds(e))}_storeIds(){this._store&&this._store.setItem(a.KEY,this._encodeIds())}}a.KEY="rpcRequests";class c{static receiveRedirectCommand(e){if(!document.referrer)return null;const t=new URLSearchParams(e.search),s=new URL(document.referrer);if(!t.has("command"))return null;if(!t.has("id"))return null;if(!t.has("returnURL"))return null;if(new URL(t.get("returnURL")).origin!==s.origin)return null;let r=[];if(t.has("args"))try{r=o.parse(t.get("args"))}catch(e){}return r=Array.isArray(r)?r:[],{origin:s.origin,data:{id:parseInt(t.get("id"),10),command:t.get("command"),args:r},returnURL:t.get("returnURL")}}static receiveRedirectResponse(e){if(!document.referrer)return null;const s=new URLSearchParams(e.search),r=new URL(document.referrer);if(!s.has("status"))return null;if(!s.has("id"))return null;if(!s.has("result"))return null;const n=o.parse(s.get("result")),i=s.get("status")===t.OK?t.OK:t.ERROR;return{origin:r.origin,data:{id:parseInt(s.get("id"),10),status:i,result:n}}}static prepareRedirectReply(e,t,s){const r=new URLSearchParams;return r.set("status",t),r.set("result",o.stringify(s)),r.set("id",e.id.toString()),`${e.returnURL}?${r.toString()}`}static prepareRedirectInvocation(e,t,s,r,n){const i=new URLSearchParams;return i.set("id",t.toString()),i.set("returnURL",s),i.set("command",r),Array.isArray(n)&&i.set("args",o.stringify(n)),`${e}?${i.toString()}`}}class l{constructor(e,t=!1){this._allowedOrigin=e,this._waitingRequests=new a(t),this._responseHandlers=new Map}onResponse(e,t,s){this._responseHandlers.set(e,{resolve:t,reject:s})}_receive(e){if(!e.data||!e.data.status||!e.data.id||"*"!==this._allowedOrigin&&e.origin!==this._allowedOrigin)return;const s=e.data,r=this._getCallback(s.id),n=this._waitingRequests.getState(s.id);if(r){if(this._waitingRequests.remove(s.id),console.debug("RpcClient RECEIVE",s),s.status===t.OK)r.resolve(s.result,s.id,n);else if(s.status===t.ERROR){const e=new Error(s.result.message);s.result.stack&&(e.stack=s.result.stack),r.reject(e,s.id,n)}}else console.warn("Unknown RPC response:",s)}_getCallback(e){if(this._responseHandlers.has(e))return this._responseHandlers.get(e);{const t=this._waitingRequests.getCommand(e);if(t)return this._responseHandlers.get(t)}}}class d extends l{constructor(e,t){super(t),this._target=e,this._connected=!1,this._receiveListener=this._receive.bind(this)}async init(){await this._connect(),window.addEventListener("message",this._receiveListener)}async call(t,...s){if(!this._connected)throw new Error("Client is not connected, call init first");return new Promise((r,n)=>{const i={command:t,args:s,id:e.generateRandomId()};this._responseHandlers.set(i.id,{resolve:r,reject:n}),this._waitingRequests.add(i.id,t);const o=()=>{this._target.closed&&n(new Error("Window was closed")),setTimeout(o,500)};setTimeout(o,500),console.debug("RpcClient REQUEST",t,s),this._target.postMessage(i,this._allowedOrigin)})}close(){window.removeEventListener("message",this._receiveListener)}_connect(){return new Promise((e,s)=>{const r=s=>{const{source:n,origin:i,data:o}=s;if(n===this._target&&o.status===t.OK&&"pong"===o.result&&1===o.id&&("*"===this._allowedOrigin||i===this._allowedOrigin)){if(o.result.stack){const e=new Error(o.result.message);e.stack=o.result.stack,console.error(e)}window.removeEventListener("message",r),this._connected=!0,console.log("RpcClient: Connection established"),window.addEventListener("message",this._receiveListener),e(!0)}};window.addEventListener("message",r);let n=0;const i=setTimeout(()=>{window.removeEventListener("message",r),clearTimeout(n),s(new Error("Connection timeout"))},1e4),o=()=>{if(this._connected)clearTimeout(i);else{try{this._target.postMessage({command:"ping",id:1},this._allowedOrigin)}catch(e){console.error(`postMessage failed: ${e}`)}n=setTimeout(o,1e3)}};n=setTimeout(o,100)})}}class u extends l{constructor(e,t){super(t,!0),this._target=e}async init(){const e=c.receiveRedirectResponse(window.location);e?this._receive(e):this._rejectOnBack()}close(){}call(e,t,...s){this.callAndSaveLocalState(e,null,t,...s)}callAndSaveLocalState(t,s,r,...n){const i=e.generateRandomId(),o=c.prepareRedirectInvocation(this._target,i,t,r,n);this._waitingRequests.add(i,r,s),history.replaceState({rpcRequestId:i},document.title),console.debug("RpcClient REQUEST",r,n),window.location.href=o}_rejectOnBack(){if(history.state&&history.state.rpcRequestId){const e=history.state.rpcRequestId,t=this._getCallback(e),s=this._waitingRequests.getState(e);if(t){this._waitingRequests.remove(e),console.debug("RpcClient BACK");const r=new Error("Request aborted");t.reject(r,e,s)}}}}class h{static getAllowedOrigin(e){return new URL(e).origin}constructor(e){this._type=e}async request(e,t,s){throw new Error("Not implemented")}get type(){return this._type}}!function(e){e[e.REDIRECT=0]="REDIRECT",e[e.POPUP=1]="POPUP",e[e.IFRAME=2]="IFRAME"}(r||(r={}));class _ extends h{static withLocalState(e){return new _(void 0,e)}constructor(e,t){super(r.REDIRECT);const s=window.location;if(this._returnUrl=e||`${s.origin}${s.pathname}`,this._localState=t||{},void 0!==this._localState.__command)throw new Error("Invalid localState: Property '__command' is reserved")}async request(e,t,s){const r=h.getAllowedOrigin(e),n=new u(e,r);await n.init();const i=Object.assign({},this._localState,{__command:t});console.log("state",i),n.callAndSaveLocalState(this._returnUrl,JSON.stringify(i),t,...s)}}class p extends h{constructor(e=p.DEFAULT_OPTIONS){super(r.POPUP),this._options=e}async request(e,t,s){const r=h.getAllowedOrigin(e),n=this.createPopup(e),i=new d(n,r);await i.init();try{const e=await i.call(t,...s);return i.close(),n.close(),e}catch(e){throw i.close(),n.close(),e}}createPopup(e){const t=window.open(e,"NimiqAccounts",this._options);if(!t)throw new Error("Failed to open popup");return t}}p.DEFAULT_OPTIONS="";class g extends h{constructor(){super(r.IFRAME),this._iframe=null,this._client=null}async request(e,t,s){if(this._iframe&&this._iframe.src!==`${e}${g.IFRAME_PATH_SUFFIX}`)throw new Error("Accounts Manager iframe is already opened with another endpoint");const r=h.getAllowedOrigin(e);if(this._iframe||(this._iframe=await this.createIFrame(e)),!this._iframe.contentWindow)throw new Error(`IFrame contentWindow is ${typeof this._iframe.contentWindow}`);return this._client||(this._client=new d(this._iframe.contentWindow,r),await this._client.init()),await this._client.call(t,...s)}async createIFrame(e){return new Promise((t,s)=>{const r=document.createElement("iframe");r.name="NimiqAccountsIFrame",r.style.display="none",document.body.appendChild(r),r.src=`${e}${g.IFRAME_PATH_SUFFIX}`,r.onload=(()=>t(r)),r.onerror=s})}}g.IFRAME_PATH_SUFFIX="/iframe.html",function(e){e.LIST="list",e.CHECKOUT="checkout",e.SIGN_TRANSACTION="sign-transaction",e.SIGNUP="signup",e.LOGIN="login",e.EXPORT_WORDS="export-words",e.EXPORT_FILE="export-file",e.LOGOUT="logout"}(n||(n={}));class w{constructor(e=w.DEFAULT_ENDPOINT,t){this._endpoint=e,this._defaultBehavior=t||new p(`left=${window.innerWidth/2-500},top=50,width=1000,height=900,location=yes,dependent=yes`),this._iframeBehavior=new g,this._redirectClient=new u("",h.getAllowedOrigin(this._endpoint))}checkRedirectResponse(){return this._redirectClient.init()}on(e,t,s){this._redirectClient.onResponse(e,(e,s,r)=>t(e,JSON.parse(r)),(e,t,r)=>s&&s(e,JSON.parse(r)))}signup(e,t=this._defaultBehavior){return this._request(t,n.SIGNUP,[e])}signTransaction(e,t=this._defaultBehavior){return this._request(t,n.SIGN_TRANSACTION,[e])}checkout(e,t=this._defaultBehavior){return this._request(t,n.CHECKOUT,[e])}login(e,t=this._defaultBehavior){return this._request(t,n.LOGIN,[e])}logout(e,t=this._defaultBehavior){return this._request(t,n.LOGOUT,[e])}exportFile(e,t=this._defaultBehavior){return this._request(t,n.EXPORT_FILE,[e])}exportWords(e,t=this._defaultBehavior){return this._request(t,n.EXPORT_WORDS,[e])}list(e=this._iframeBehavior){return this._request(e,n.LIST,[])}_request(e,t,s){return e.request(this._endpoint,t,s)}}return w.RequestType=n,w.RedirectRequestBehavior=_,w.DEFAULT_ENDPOINT="https://safe-next.nimiq.com"===window.location.origin?"https://accounts.nimiq.com":"https://safe-next.nimiq-testnet.com"===window.location.origin?"https://accounts.nimiq-testnet.com":"http://localhost:8080",w});
