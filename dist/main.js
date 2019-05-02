!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["eos-auth"]=t():e["eos-auth"]=t()}(global,function(){return function(e){var t={}
function r(n){if(t[n])return t[n].exports
var o=t[n]={i:n,l:!1,exports:{}}
return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e
if(4&t&&"object"==typeof e&&e&&e.__esModule)return e
var n=Object.create(null)
if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o))
return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e}
return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=73)}([function(e,t,r){e.exports=r(29)},function(e,t){function r(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}e.exports=function(e){return function(){var t=this,n=arguments
return new Promise(function(o,i){var a=e.apply(t,n)
function s(e){r(a,o,i,s,c,"next",e)}function c(e){r(a,o,i,s,c,"throw",e)}s(void 0)})}}},function(e,t,r){"use strict"
var n=r(11),o=r(31),i=Object.prototype.toString
function a(e){return"[object Array]"===i.call(e)}function s(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===i.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),a(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e)
else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:a,isArrayBuffer:function(e){return"[object ArrayBuffer]"===i.call(e)},isBuffer:o,isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===i.call(e)},isFile:function(e){return"[object File]"===i.call(e)},isBlob:function(e){return"[object Blob]"===i.call(e)},isFunction:c,isStream:function(e){return s(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:u,merge:function e(){var t={}
function r(r,n){"object"==typeof t[n]&&"object"==typeof r?t[n]=e(t[n],r):t[n]=r}for(var n=0,o=arguments.length;n<o;n++)u(arguments[n],r)
return t},extend:function(e,t,r){return u(t,function(t,o){e[o]=r&&"function"==typeof t?n(t,r):t}),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})
var n=r(60)
t.Api=n.Api
var o=r(64)
t.ApiInterfaces=o
var i=r(65)
t.JsonRpc=i.JsonRpc
var a=r(9)
t.Numeric=a
var s=r(66)
t.RpcInterfaces=s
var c=r(23)
t.RpcError=c.RpcError
var u=r(22)
t.Serialize=u},function(e,t,r){var n,o
!function(i){if(void 0===(o="function"==typeof(n=i)?n.call(t,r,t,e):n)||(e.exports=o),!0,e.exports=i(),!!0){var a=window.Cookies,s=window.Cookies=i()
s.noConflict=function(){return window.Cookies=a,s}}}(function(){function e(){for(var e=0,t={};e<arguments.length;e++){var r=arguments[e]
for(var n in r)t[n]=r[n]}return t}return function t(r){function n(t,o,i){var a
if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},n.defaults,i)).expires){var s=new Date
s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}i.expires=i.expires?i.expires.toUTCString():""
try{a=JSON.stringify(o),/^[\{\[]/.test(a)&&(o=a)}catch(e){}o=r.write?r.write(o,t):encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=(t=(t=encodeURIComponent(String(t))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape)
var c=""
for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u]))
return document.cookie=t+"="+o+c}t||(a={})
for(var f=document.cookie?document.cookie.split("; "):[],l=/(%[0-9A-Z]{2})+/g,h=0;h<f.length;h++){var p=f[h].split("="),d=p.slice(1).join("=")
this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1))
try{var y=p[0].replace(l,decodeURIComponent)
if(d=r.read?r.read(d,y):r(d,y)||d.replace(l,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(t===y){a=d
break}t||(a[y]=d)}catch(e){}}return a}}return n.set=n,n.get=function(e){return n.call(n,e)},n.getJSON=function(){return n.apply({json:!0},[].slice.call(arguments))},n.defaults={},n.remove=function(t,r){n(t,"",e(r,{expires:-1}))},n.withConverter=t,n}(function(){})})},function(e,t,r){"use strict"
var n=r(2),o=r(33),i={"Content-Type":"application/x-www-form-urlencoded"}
function a(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var s,c={adapter:("undefined"!=typeof XMLHttpRequest?s=r(34):"undefined"!=typeof process&&(s=r(39)),s),transformRequest:[function(e,t){return o(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(a(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(a(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}}
c.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],function(e){c.headers[e]={}}),n.forEach(["post","put","patch"],function(e){c.headers[e]=n.merge(i)}),e.exports=c},function(e,t,r){"use strict"
var n=r(13)
e.exports=function(e,t,r,o,i){var a=new Error(e)
return n(a,t,r,o,i)}},function(e,t,r){"use strict"
var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator]
if(!r)return e
var n,o,i=r.call(e),a=[]
try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(n(arguments[t]))
return e},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],r=0
return t?t.call(e):{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}
Object.defineProperty(t,"__esModule",{value:!0})
var a=r(61).RIPEMD160.hash,s="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
var u=function(){for(var e=Array(256).fill(-1),t=0;t<s.length;++t)e[s.charCodeAt(t)]=t
return e}()
var f,l=function(){for(var e=Array(256).fill(-1),t=0;t<c.length;++t)e[c.charCodeAt(t)]=t
return e["=".charCodeAt(0)]=0,e}()
function h(e){return 0!=(128&e[e.length-1])}function p(e){for(var t=1,r=0;r<e.length;++r){var n=(255&~e[r])+t
e[r]=n,t=n>>8}}function d(e,t){for(var r=new Uint8Array(e),n=0;n<t.length;++n){var o=t.charCodeAt(n)
if(o<"0".charCodeAt(0)||o>"9".charCodeAt(0))throw new Error("invalid number")
for(var i=o-"0".charCodeAt(0),a=0;a<e;++a){var s=10*r[a]+i
r[a]=s,i=s>>8}if(i)throw new Error("number is out of range")}return r}function y(e,t){void 0===t&&(t=1)
for(var r=Array(t).fill("0".charCodeAt(0)),n=e.length-1;n>=0;--n){for(var i=e[n],a=0;a<r.length;++a){var s=(r[a]-"0".charCodeAt(0)<<8)+i
r[a]="0".charCodeAt(0)+s%10,i=s/10|0}for(;i;)r.push("0".charCodeAt(0)+i%10),i=i/10|0}return r.reverse(),String.fromCharCode.apply(String,o(r))}function v(e,t){for(var r=new Uint8Array(e),n=0;n<t.length;++n){var o=u[t.charCodeAt(n)]
if(o<0)throw new Error("invalid base-58 value")
for(var i=0;i<e;++i){var a=58*r[i]+o
r[i]=a,o=a>>8}if(o)throw new Error("base-58 value is out of range")}return r.reverse(),r}function g(e,t){var r,n,a,c
void 0===t&&(t=1)
var f=[]
try{for(var l=i(e),h=l.next();!h.done;h=l.next()){for(var p=h.value,d=0;d<f.length;++d){var y=(u[f[d]]<<8)+p
f[d]=s.charCodeAt(y%58),p=y/58|0}for(;p;)f.push(s.charCodeAt(p%58)),p=p/58|0}}catch(e){r={error:e}}finally{try{h&&!h.done&&(n=l.return)&&n.call(l)}finally{if(r)throw r.error}}try{for(var v=i(e),g=v.next();!g.done;g=v.next()){if(g.value)break
f.push("1".charCodeAt(0))}}catch(e){a={error:e}}finally{try{g&&!g.done&&(c=v.return)&&c.call(v)}finally{if(a)throw a.error}}return f.reverse(),String.fromCharCode.apply(String,o(f))}function m(e,t){for(var r=new Uint8Array(e.length+t.length),n=0;n<e.length;++n)r[n]=e[n]
for(n=0;n<t.length;++n)r[e.length+n]=t.charCodeAt(n)
return a(r)}function b(e,t,r,n){var o=v(r+4,e),i={type:t,data:new Uint8Array(o.buffer,0,r)},a=new Uint8Array(m(i.data,n))
if(a[0]!==o[r+0]||a[1]!==o[r+1]||a[2]!==o[r+2]||a[3]!==o[r+3])throw new Error("checksum doesn't match")
return i}function w(e,t,r){for(var n=new Uint8Array(m(e.data,t)),o=new Uint8Array(e.data.length+4),i=0;i<e.data.length;++i)o[i]=e.data[i]
for(i=0;i<4;++i)o[i+e.data.length]=n[i]
return r+g(o)}function _(e){if("string"!=typeof e)throw new Error("expected string containing public key")
if("EOS"===e.substr(0,3)){for(var r=v(t.publicKeyDataSize+4,e.substr(3)),n={type:f.k1,data:new Uint8Array(t.publicKeyDataSize)},o=0;o<t.publicKeyDataSize;++o)n.data[o]=r[o]
var i=new Uint8Array(a(n.data))
if(i[0]!==r[t.publicKeyDataSize]||i[1]!==r[34]||i[2]!==r[35]||i[3]!==r[36])throw new Error("checksum doesn't match")
return n}if("PUB_K1_"===e.substr(0,7))return b(e.substr(7),f.k1,t.publicKeyDataSize,"K1")
if("PUB_R1_"===e.substr(0,7))return b(e.substr(7),f.r1,t.publicKeyDataSize,"R1")
throw new Error("unrecognized public key format")}function x(e){if(e.type===f.k1&&e.data.length===t.publicKeyDataSize)return w(e,"K1","PUB_K1_")
if(e.type===f.r1&&e.data.length===t.publicKeyDataSize)return w(e,"R1","PUB_R1_")
throw new Error("unrecognized public key format")}function k(e){return"EOS"===e.substr(0,3)?x(_(e)):e}t.isNegative=h,t.negate=p,t.decimalToBinary=d,t.signedDecimalToBinary=function(e,t){var r="-"===t[0]
r&&(t=t.substr(1))
var n=d(e,t)
if(r){if(p(n),!h(n))throw new Error("number is out of range")}else if(h(n))throw new Error("number is out of range")
return n},t.binaryToDecimal=y,t.signedBinaryToDecimal=function(e,t){if(void 0===t&&(t=1),h(e)){var r=e.slice()
return p(r),"-"+y(r,t)}return y(e,t)},t.base58ToBinary=v,t.binaryToBase58=g,t.base64ToBinary=function(e){var t=e.length
if(1==(3&t)&&"="===e[t-1]&&(t-=1),0!=(3&t))throw new Error("base-64 value is not padded correctly")
var r=t>>2,n=3*r
t>0&&"="===e[t-1]&&("="===e[t-2]?n-=2:n-=1)
for(var o=new Uint8Array(n),i=0;i<r;++i){var a=l[e.charCodeAt(4*i+0)],s=l[e.charCodeAt(4*i+1)],c=l[e.charCodeAt(4*i+2)],u=l[e.charCodeAt(4*i+3)]
o[3*i+0]=a<<2|s>>4,3*i+1<n&&(o[3*i+1]=(15&s)<<4|c>>2),3*i+2<n&&(o[3*i+2]=(3&c)<<6|u)}return o},function(e){e[e.k1=0]="k1",e[e.r1=1]="r1"}(f=t.KeyType||(t.KeyType={})),t.publicKeyDataSize=33,t.privateKeyDataSize=32,t.signatureDataSize=65,t.stringToPublicKey=_,t.publicKeyToString=x,t.convertLegacyPublicKey=k,t.convertLegacyPublicKeys=function(e){return e.map(k)},t.stringToPrivateKey=function(e){if("string"!=typeof e)throw new Error("expected string containing private key")
if("PVT_R1_"===e.substr(0,7))return b(e.substr(7),f.r1,t.privateKeyDataSize,"R1")
throw new Error("unrecognized private key format")},t.privateKeyToString=function(e){if(e.type===f.r1)return w(e,"R1","PVT_R1_")
throw new Error("unrecognized private key format")},t.stringToSignature=function(e){if("string"!=typeof e)throw new Error("expected string containing signature")
if("SIG_K1_"===e.substr(0,7))return b(e.substr(7),f.k1,t.signatureDataSize,"K1")
if("SIG_R1_"===e.substr(0,7))return b(e.substr(7),f.r1,t.signatureDataSize,"R1")
throw new Error("unrecognized signature format")},t.signatureToString=function(e){if(e.type===f.k1)return w(e,"K1","SIG_K1_")
if(e.type===f.r1)return w(e,"R1","SIG_R1_")
throw new Error("unrecognized signature format")}},function(e,t,r){e.exports=r(30)},function(e,t,r){"use strict"
e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n]
return e.apply(t,r)}}},function(e,t,r){"use strict"
var n=r(8)
e.exports=function(e,t,r){var o=r.config.validateStatus
r.status&&o&&!o(r.status)?t(n("Request failed with status code "+r.status,r.config,null,r.request,r)):e(r)}},function(e,t,r){"use strict"
e.exports=function(e,t,r,n,o){return e.config=t,r&&(e.code=r),e.request=n,e.response=o,e}},function(e,t,r){"use strict"
var n=r(2)
function o(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e
var i
if(r)i=r(t)
else if(n.isURLSearchParams(t))i=t.toString()
else{var a=[]
n.forEach(t,function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),a.push(o(t)+"="+o(e))}))}),i=a.join("&")}return i&&(e+=(-1===e.indexOf("?")?"?":"&")+i),e}},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("https")},function(e,t,r){var n=r(18),o=n.URL,i=r(15),a=r(16),s=r(40),c=r(41).Writable,u=r(42)("follow-redirects"),f={GET:!0,HEAD:!0,OPTIONS:!0,TRACE:!0},l=Object.create(null)
function h(e,t){c.call(this),e.headers=e.headers||{},this._options=e,this._ended=!1,this._ending=!1,this._redirectCount=0,this._redirects=[],this._requestBodyLength=0,this._requestBodyBuffers=[],e.host&&(e.hostname||(e.hostname=e.host),delete e.host),t&&this.on("response",t)
var r=this
if(this._onNativeResponse=function(e){r._processResponse(e)},!e.pathname&&e.path){var n=e.path.indexOf("?")
n<0?e.pathname=e.path:(e.pathname=e.path.substring(0,n),e.search=e.path.substring(n))}this._performRequest()}function p(e,t){clearTimeout(e._timeout),e._timeout=setTimeout(function(){e.emit("timeout")},t)}function d(){clearTimeout(this._timeout)}function y(e){var t={maxRedirects:21,maxBodyLength:10485760},r={}
return Object.keys(e).forEach(function(i){var a=i+":",c=r[a]=e[i],f=t[i]=Object.create(c)
f.request=function(e,i,c){if("string"==typeof e){var f=e
try{e=g(new o(f))}catch(t){e=n.parse(f)}}else o&&e instanceof o?e=g(e):(c=i,i=e,e={protocol:a})
return"function"==typeof i&&(c=i,i=null),(i=Object.assign({maxRedirects:t.maxRedirects,maxBodyLength:t.maxBodyLength},e,i)).nativeProtocols=r,s.equal(i.protocol,a,"protocol mismatch"),u("options",i),new h(i,c)},f.get=function(e,t,r){var n=f.request(e,t,r)
return n.end(),n}}),t}function v(){}function g(e){var t={protocol:e.protocol,hostname:e.hostname.startsWith("[")?e.hostname.slice(1,-1):e.hostname,hash:e.hash,search:e.search,pathname:e.pathname,path:e.pathname+e.search,href:e.href}
return""!==e.port&&(t.port=Number(e.port)),t}["abort","aborted","error","socket","timeout"].forEach(function(e){l[e]=function(t){this._redirectable.emit(e,t)}}),h.prototype=Object.create(c.prototype),h.prototype.write=function(e,t,r){if(this._ending)throw new Error("write after end")
if(!("string"==typeof e||"object"==typeof e&&"length"in e))throw new Error("data should be a string, Buffer or Uint8Array")
"function"==typeof t&&(r=t,t=null),0!==e.length?this._requestBodyLength+e.length<=this._options.maxBodyLength?(this._requestBodyLength+=e.length,this._requestBodyBuffers.push({data:e,encoding:t}),this._currentRequest.write(e,t,r)):(this.emit("error",new Error("Request body larger than maxBodyLength limit")),this.abort()):r&&r()},h.prototype.end=function(e,t,r){if("function"==typeof e?(r=e,e=t=null):"function"==typeof t&&(r=t,t=null),e){var n=this,o=this._currentRequest
this.write(e,t,function(){n._ended=!0,o.end(null,null,r)}),this._ending=!0}else this._ended=this._ending=!0,this._currentRequest.end(null,null,r)},h.prototype.setHeader=function(e,t){this._options.headers[e]=t,this._currentRequest.setHeader(e,t)},h.prototype.removeHeader=function(e){delete this._options.headers[e],this._currentRequest.removeHeader(e)},h.prototype.setTimeout=function(e,t){if(t&&this.once("timeout",t),this.socket)p(this,e)
else{var r=this
this._currentRequest.once("socket",function(){p(r,e)})}return this.once("response",d),this.once("error",d),this},["abort","flushHeaders","getHeader","setNoDelay","setSocketKeepAlive"].forEach(function(e){h.prototype[e]=function(t,r){return this._currentRequest[e](t,r)}}),["aborted","connection","socket"].forEach(function(e){Object.defineProperty(h.prototype,e,{get:function(){return this._currentRequest[e]}})}),h.prototype._performRequest=function(){var e=this._options.protocol,t=this._options.nativeProtocols[e]
if(t){if(this._options.agents){var r=e.substr(0,e.length-1)
this._options.agent=this._options.agents[r]}var o=this._currentRequest=t.request(this._options,this._onNativeResponse)
for(var i in this._currentUrl=n.format(this._options),o._redirectable=this,l)i&&o.on(i,l[i])
if(this._isRedirect){var a=0,s=this,c=this._requestBodyBuffers
!function e(t){if(o===s._currentRequest)if(t)s.emit("error",t)
else if(a<c.length){var r=c[a++]
o.finished||o.write(r.data,r.encoding,e)}else s._ended&&o.end()}()}}else this.emit("error",new Error("Unsupported protocol "+e))},h.prototype._processResponse=function(e){this._options.trackRedirects&&this._redirects.push({url:this._currentUrl,headers:e.headers,statusCode:e.statusCode})
var t=e.headers.location
if(t&&!1!==this._options.followRedirects&&e.statusCode>=300&&e.statusCode<400){if(this._currentRequest.removeAllListeners(),this._currentRequest.on("error",v),this._currentRequest.abort(),++this._redirectCount>this._options.maxRedirects)return void this.emit("error",new Error("Max redirects exceeded."))
var r,o=this._options.headers
if(307!==e.statusCode&&!(this._options.method in f))for(r in this._options.method="GET",this._requestBodyBuffers=[],o)/^content-/i.test(r)&&delete o[r]
if(!this._isRedirect)for(r in o)/^host$/i.test(r)&&delete o[r]
var i=n.resolve(this._currentUrl,t)
u("redirecting to",i),Object.assign(this._options,n.parse(i)),this._isRedirect=!0,this._performRequest(),e.destroy()}else e.responseUrl=this._currentUrl,e.redirects=this._redirects,this.emit("response",e),this._requestBodyBuffers=[]},e.exports=y({http:i,https:a}),e.exports.wrap=y},function(e,t){e.exports=require("url")},function(e,t,r){"use strict"
e.exports=function(e){function t(e){for(var t=0,r=0;r<e.length;r++)t=(t<<5)-t+e.charCodeAt(r),t|=0
return n.colors[Math.abs(t)%n.colors.length]}function n(e){var r
function a(){if(a.enabled){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o]
var i=a,s=Number(new Date),c=s-(r||s)
i.diff=c,i.prev=r,i.curr=s,r=s,t[0]=n.coerce(t[0]),"string"!=typeof t[0]&&t.unshift("%O")
var u=0
t[0]=t[0].replace(/%([a-zA-Z%])/g,function(e,r){if("%%"===e)return e
u++
var o=n.formatters[r]
if("function"==typeof o){var a=t[u]
e=o.call(i,a),t.splice(u,1),u--}return e}),n.formatArgs.call(i,t),(i.log||n.log).apply(i,t)}}return a.namespace=e,a.enabled=n.enabled(e),a.useColors=n.useColors(),a.color=t(e),a.destroy=o,a.extend=i,"function"==typeof n.init&&n.init(a),n.instances.push(a),a}function o(){var e=n.instances.indexOf(this)
return-1!==e&&(n.instances.splice(e,1),!0)}function i(e,t){return n(this.namespace+(void 0===t?":":t)+e)}return n.debug=n,n.default=n,n.coerce=function(e){return e instanceof Error?e.stack||e.message:e},n.disable=function(){n.enable("")},n.enable=function(e){var t
n.save(e),n.names=[],n.skips=[]
var r=("string"==typeof e?e:"").split(/[\s,]+/),o=r.length
for(t=0;t<o;t++)r[t]&&("-"===(e=r[t].replace(/\*/g,".*?"))[0]?n.skips.push(new RegExp("^"+e.substr(1)+"$")):n.names.push(new RegExp("^"+e+"$")))
for(t=0;t<n.instances.length;t++){var i=n.instances[t]
i.enabled=n.enabled(i.namespace)}},n.enabled=function(e){if("*"===e[e.length-1])return!0
var t,r
for(t=0,r=n.skips.length;t<r;t++)if(n.skips[t].test(e))return!1
for(t=0,r=n.names.length;t<r;t++)if(n.names[t].test(e))return!0
return!1},n.humanize=r(44),Object.keys(e).forEach(function(t){n[t]=e[t]}),n.instances=[],n.names=[],n.skips=[],n.formatters={},n.selectColor=t,n.enable(n.load()),n}},function(e,t,r){"use strict"
e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,r){"use strict"
function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,r){"use strict"
var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])
return e}).apply(this,arguments)},o=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator]
if(!r)return e
var n,o,i=r.call(e),a=[]
try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a},i=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(o(arguments[t]))
return e},a=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],r=0
return t?t.call(e):{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}
Object.defineProperty(t,"__esModule",{value:!0})
var s=r(9),c=function(){return function(e){void 0===e&&(e={}),this.skippedBinaryExtension=!1,this.options=e}}()
t.SerializerState=c
var u=function(){function e(e){var t=void 0===e?{}:e,r=t.textEncoder,n=t.textDecoder,o=t.array
this.readPos=0,this.array=o||new Uint8Array(1024),this.length=o?o.length:0,this.textEncoder=r||new TextEncoder,this.textDecoder=n||new TextDecoder("utf-8",{fatal:!0})}return e.prototype.reserve=function(e){if(!(this.length+e<=this.array.length)){for(var t=this.array.length;this.length+e>t;)t=Math.ceil(1.5*t)
var r=new Uint8Array(t)
r.set(this.array),this.array=r}},e.prototype.haveReadData=function(){return this.readPos<this.length},e.prototype.restartRead=function(){this.readPos=0},e.prototype.asUint8Array=function(){return new Uint8Array(this.array.buffer,this.array.byteOffset,this.length)},e.prototype.pushArray=function(e){this.reserve(e.length),this.array.set(e,this.length),this.length+=e.length},e.prototype.push=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t]
this.pushArray(e)},e.prototype.get=function(){if(this.readPos<this.length)return this.array[this.readPos++]
throw new Error("Read past end of buffer")},e.prototype.pushUint8ArrayChecked=function(e,t){if(e.length!==t)throw new Error("Binary data has incorrect size")
this.pushArray(e)},e.prototype.getUint8Array=function(e){if(this.readPos+e>this.length)throw new Error("Read past end of buffer")
var t=new Uint8Array(this.array.buffer,this.array.byteOffset+this.readPos,e)
return this.readPos+=e,t},e.prototype.pushUint16=function(e){this.push(e>>0&255,e>>8&255)},e.prototype.getUint16=function(){var e=0
return e|=this.get()<<0,e|=this.get()<<8},e.prototype.pushUint32=function(e){this.push(e>>0&255,e>>8&255,e>>16&255,e>>24&255)},e.prototype.getUint32=function(){var e=0
return e|=this.get()<<0,e|=this.get()<<8,e|=this.get()<<16,(e|=this.get()<<24)>>>0},e.prototype.pushNumberAsUint64=function(e){this.pushUint32(e>>>0),this.pushUint32(Math.floor(e/4294967296)>>>0)},e.prototype.getUint64AsNumber=function(){var e=this.getUint32()
return 4294967296*(this.getUint32()>>>0)+(e>>>0)},e.prototype.pushVaruint32=function(e){for(;;){if(!(e>>>7)){this.push(e)
break}this.push(128|127&e),e>>>=7}},e.prototype.getVaruint32=function(){for(var e=0,t=0;;){var r=this.get()
if(e|=(127&r)<<t,t+=7,!(128&r))break}return e>>>0},e.prototype.pushVarint32=function(e){this.pushVaruint32(e<<1^e>>31)},e.prototype.getVarint32=function(){var e=this.getVaruint32()
return 1&e?~e>>1|2147483648:e>>>1},e.prototype.pushFloat32=function(e){this.pushArray(new Uint8Array(new Float32Array([e]).buffer))},e.prototype.getFloat32=function(){return new Float32Array(this.getUint8Array(4).slice().buffer)[0]},e.prototype.pushFloat64=function(e){this.pushArray(new Uint8Array(new Float64Array([e]).buffer))},e.prototype.getFloat64=function(){return new Float64Array(this.getUint8Array(8).slice().buffer)[0]},e.prototype.pushName=function(e){if("string"!=typeof e)throw new Error("Expected string containing name")
function t(e){return e>="a".charCodeAt(0)&&e<="z".charCodeAt(0)?e-"a".charCodeAt(0)+6:e>="1".charCodeAt(0)&&e<="5".charCodeAt(0)?e-"1".charCodeAt(0)+1:0}for(var r=new Uint8Array(8),n=63,o=0;o<e.length;++o){var i=t(e.charCodeAt(o))
n<5&&(i<<=1)
for(var a=4;a>=0;--a)n>=0&&(r[Math.floor(n/8)]|=(i>>a&1)<<n%8,--n)}this.pushArray(r)},e.prototype.getName=function(){for(var e=this.getUint8Array(8),t="",r=63;r>=0;){for(var n=0,o=0;o<5;++o)r>=0&&(n=n<<1|e[Math.floor(r/8)]>>r%8&1,--r)
t+=n>=6?String.fromCharCode(n+"a".charCodeAt(0)-6):n>=1?String.fromCharCode(n+"1".charCodeAt(0)-1):"."}for(;t.endsWith(".");)t=t.substr(0,t.length-1)
return t},e.prototype.pushBytes=function(e){this.pushVaruint32(e.length),this.pushArray(e)},e.prototype.getBytes=function(){return this.getUint8Array(this.getVaruint32())},e.prototype.pushString=function(e){this.pushBytes(this.textEncoder.encode(e))},e.prototype.getString=function(){return this.textDecoder.decode(this.getBytes())},e.prototype.pushSymbolCode=function(e){if("string"!=typeof e)throw new Error("Expected string containing symbol_code")
var t=[]
for(t.push.apply(t,i(this.textEncoder.encode(e)));t.length<8;)t.push(0)
this.pushArray(t.slice(0,8))},e.prototype.getSymbolCode=function(){var e,t=this.getUint8Array(8)
for(e=0;e<t.length&&t[e];++e);return this.textDecoder.decode(new Uint8Array(t.buffer,t.byteOffset,e))},e.prototype.pushSymbol=function(e){var t=e.name,r=[255&e.precision]
for(r.push.apply(r,i(this.textEncoder.encode(t)));r.length<8;)r.push(0)
this.pushArray(r.slice(0,8))},e.prototype.getSymbol=function(){var e,t=this.get(),r=this.getUint8Array(7)
for(e=0;e<r.length&&r[e];++e);return{name:this.textDecoder.decode(new Uint8Array(r.buffer,r.byteOffset,e)),precision:t}},e.prototype.pushAsset=function(e){if("string"!=typeof e)throw new Error("Expected string containing asset")
var t=0,r="",n=0
"-"===(e=e.trim())[t]&&(r+="-",++t)
for(var o=!1;t<e.length&&e.charCodeAt(t)>="0".charCodeAt(0)&&e.charCodeAt(t)<="9".charCodeAt(0);)o=!0,r+=e[t],++t
if(!o)throw new Error("Asset must begin with a number")
if("."===e[t])for(++t;t<e.length&&e.charCodeAt(t)>="0".charCodeAt(0)&&e.charCodeAt(t)<="9".charCodeAt(0);)r+=e[t],++n,++t
var i=e.substr(t).trim()
this.pushArray(s.signedDecimalToBinary(8,r)),this.pushSymbol({name:i,precision:n})},e.prototype.getAsset=function(){var e=this.getUint8Array(8),t=this.getSymbol(),r=t.name,n=t.precision,o=s.signedBinaryToDecimal(e,n+1)
return n&&(o=o.substr(0,o.length-n)+"."+o.substr(o.length-n)),o+" "+r},e.prototype.pushPublicKey=function(e){var t=s.stringToPublicKey(e)
this.push(t.type),this.pushArray(t.data)},e.prototype.getPublicKey=function(){var e=this.get(),t=this.getUint8Array(s.publicKeyDataSize)
return s.publicKeyToString({type:e,data:t})},e.prototype.pushPrivateKey=function(e){var t=s.stringToPrivateKey(e)
this.push(t.type),this.pushArray(t.data)},e.prototype.getPrivateKey=function(){var e=this.get(),t=this.getUint8Array(s.privateKeyDataSize)
return s.privateKeyToString({type:e,data:t})},e.prototype.pushSignature=function(e){var t=s.stringToSignature(e)
this.push(t.type),this.pushArray(t.data)},e.prototype.getSignature=function(){var e=this.get(),t=this.getUint8Array(s.signatureDataSize)
return s.signatureToString({type:e,data:t})},e}()
function f(e){var t=Date.parse(e)
if(Number.isNaN(t))throw new Error("Invalid time format")
return t}function l(e){return Math.round(1e3*f(e+"Z"))}function h(e){var t=new Date(e/1e3).toISOString()
return t.substr(0,t.length-1)}function p(e){return Math.round(f(e+"Z")/1e3)}function d(e){var t=new Date(1e3*e).toISOString()
return t.substr(0,t.length-1)}function y(e){return Math.round((f(e+"Z")-9466848e5)/500)}function v(e){var t=new Date(500*e+9466848e5).toISOString()
return t.substr(0,t.length-1)}function g(e){if("string"!=typeof e)throw new Error("Expected string containing symbol")
var t=e.match(/^([0-9]+),([A-Z]+)$/)
if(!t)throw new Error("Invalid symbol")
return{name:t[2],precision:+t[1]}}function m(e){var t=e.name
return e.precision+","+t}function b(e){var t,r,n=""
try{for(var o=a(e),i=o.next();!i.done;i=o.next()){n+=("00"+i.value.toString(16)).slice(-2)}}catch(e){t={error:e}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return n.toUpperCase()}function w(e){if("string"!=typeof e)throw new Error("Expected string containing hex digits")
if(e.length%2)throw new Error("Odd number of hex digits")
for(var t=e.length/2,r=new Uint8Array(t),n=0;n<t;++n){var o=parseInt(e.substr(2*n,2),16)
if(Number.isNaN(o))throw new Error("Expected hex string")
r[n]=o}return r}function _(e,t){throw new Error("Don't know how to serialize "+this.name)}function x(e){throw new Error("Don't know how to deserialize "+this.name)}function k(e,t,r,n){var o,i
if(void 0===r&&(r=new c),void 0===n&&(n=!0),"object"!=typeof t)throw new Error("expected object containing data: "+JSON.stringify(t))
this.base&&this.base.serialize(e,t,r,n)
try{for(var s=a(this.fields),u=s.next();!u.done;u=s.next()){var f=u.value
if(f.name in t){if(r.skippedBinaryExtension)throw new Error("unexpected "+this.name+"."+f.name)
f.type.serialize(e,t[f.name],r,n&&f===this.fields[this.fields.length-1])}else{if(!n||!f.type.extensionOf)throw new Error("missing "+this.name+"."+f.name+" (type="+f.type.name+")")
r.skippedBinaryExtension=!0}}}catch(e){o={error:e}}finally{try{u&&!u.done&&(i=s.return)&&i.call(s)}finally{if(o)throw o.error}}}function C(e,t,r){var n,o,i
void 0===t&&(t=new c),void 0===r&&(r=!0),i=this.base?this.base.deserialize(e,t,r):{}
try{for(var s=a(this.fields),u=s.next();!u.done;u=s.next()){var f=u.value
r&&f.type.extensionOf&&!e.haveReadData()?t.skippedBinaryExtension=!0:i[f.name]=f.type.deserialize(e,t,r)}}catch(e){n={error:e}}finally{try{u&&!u.done&&(o=s.return)&&o.call(s)}finally{if(n)throw n.error}}return i}function A(e,t,r,n){if(!Array.isArray(t)||2!==t.length||"string"!=typeof t[0])throw new Error('expected variant: ["type", value]')
var o=this.fields.findIndex(function(e){return e.name===t[0]})
if(o<0)throw new Error('type "'+t[0]+'" is not valid for variant')
e.pushVaruint32(o),this.fields[o].type.serialize(e,t[1],r,n)}function E(e,t,r){var n=e.getVaruint32()
if(n>=this.fields.length)throw new Error("type index "+n+" is not valid for variant")
var o=this.fields[n]
return[o.name,o.type.deserialize(e,t,r)]}function S(e,t,r,n){var o,i
e.pushVaruint32(t.length)
try{for(var s=a(t),c=s.next();!c.done;c=s.next()){var u=c.value
this.arrayOf.serialize(e,u,r,!1)}}catch(e){o={error:e}}finally{try{c&&!c.done&&(i=s.return)&&i.call(s)}finally{if(o)throw o.error}}}function O(e,t,r){for(var n=e.getVaruint32(),o=[],i=0;i<n;++i)o.push(this.arrayOf.deserialize(e,t,!1))
return o}function T(e,t,r,n){null==t?e.push(0):(e.push(1),this.optionalOf.serialize(e,t,r,n))}function I(e,t,r){return e.get()?this.optionalOf.deserialize(e,t,r):null}function P(e,t,r,n){this.extensionOf.serialize(e,t,r,n)}function U(e,t,r){return this.extensionOf.deserialize(e,t,r)}function z(e){return n({name:"<missing name>",aliasOfName:"",arrayOf:null,optionalOf:null,extensionOf:null,baseName:"",base:null,fields:[],serialize:_,deserialize:x},e)}function R(e,t){if(Number.isNaN(+e)||Number.isNaN(+t)||"number"!=typeof e&&"string"!=typeof e)throw new Error("Expected number")
if(+e!=+t)throw new Error("Number is out of range")
return+e}function B(e,t){var r=e.get(t)
if(r&&r.aliasOfName)return B(e,r.aliasOfName)
if(r)return r
if(t.endsWith("[]"))return z({name:t,arrayOf:B(e,t.substr(0,t.length-2)),serialize:S,deserialize:O})
if(t.endsWith("?"))return z({name:t,optionalOf:B(e,t.substr(0,t.length-1)),serialize:T,deserialize:I})
if(t.endsWith("$"))return z({name:t,extensionOf:B(e,t.substr(0,t.length-1)),serialize:P,deserialize:U})
throw new Error("Unknown type: "+t)}function F(e,t,r,n,o,i){var a=e.actions.get(r)
if(!a)throw new Error("Unknown action "+r+" in contract "+t)
var s=new u({textEncoder:o,textDecoder:i})
return a.serialize(s,n),b(s.asUint8Array())}function N(e,t,r,n,o,i){var a=e.actions.get(r)
if("string"==typeof n&&(n=w(n)),!a)throw new Error("Unknown action "+r+" in contract "+t)
var s=new u({textDecoder:i,textEncoder:o})
return s.pushArray(n),a.deserialize(s)}t.SerialBuffer=u,t.supportedAbiVersion=function(e){return e.startsWith("eosio::abi/1.")},t.dateToTimePoint=l,t.timePointToDate=h,t.dateToTimePointSec=p,t.timePointSecToDate=d,t.dateToBlockTimestamp=y,t.blockTimestampToDate=v,t.stringToSymbol=g,t.symbolToString=m,t.arrayToHex=b,t.hexToUint8Array=w,t.createInitialTypes=function(){var e=new Map(Object.entries({bool:z({name:"bool",serialize:function(e,t){if("boolean"!=typeof t)throw new Error("Expected true or false")
e.push(t?1:0)},deserialize:function(e){return!!e.get()}}),uint8:z({name:"uint8",serialize:function(e,t){e.push(R(t,255&t))},deserialize:function(e){return e.get()}}),int8:z({name:"int8",serialize:function(e,t){e.push(R(t,t<<24>>24))},deserialize:function(e){return e.get()<<24>>24}}),uint16:z({name:"uint16",serialize:function(e,t){e.pushUint16(R(t,65535&t))},deserialize:function(e){return e.getUint16()}}),int16:z({name:"int16",serialize:function(e,t){e.pushUint16(R(t,t<<16>>16))},deserialize:function(e){return e.getUint16()<<16>>16}}),uint32:z({name:"uint32",serialize:function(e,t){e.pushUint32(R(t,t>>>0))},deserialize:function(e){return e.getUint32()}}),uint64:z({name:"uint64",serialize:function(e,t){e.pushArray(s.decimalToBinary(8,""+t))},deserialize:function(e){return s.binaryToDecimal(e.getUint8Array(8))}}),int64:z({name:"int64",serialize:function(e,t){e.pushArray(s.signedDecimalToBinary(8,""+t))},deserialize:function(e){return s.signedBinaryToDecimal(e.getUint8Array(8))}}),int32:z({name:"int32",serialize:function(e,t){e.pushUint32(R(t,0|t))},deserialize:function(e){return 0|e.getUint32()}}),varuint32:z({name:"varuint32",serialize:function(e,t){e.pushVaruint32(R(t,t>>>0))},deserialize:function(e){return e.getVaruint32()}}),varint32:z({name:"varint32",serialize:function(e,t){e.pushVarint32(R(t,0|t))},deserialize:function(e){return e.getVarint32()}}),uint128:z({name:"uint128",serialize:function(e,t){e.pushArray(s.decimalToBinary(16,""+t))},deserialize:function(e){return s.binaryToDecimal(e.getUint8Array(16))}}),int128:z({name:"int128",serialize:function(e,t){e.pushArray(s.signedDecimalToBinary(16,""+t))},deserialize:function(e){return s.signedBinaryToDecimal(e.getUint8Array(16))}}),float32:z({name:"float32",serialize:function(e,t){e.pushFloat32(t)},deserialize:function(e){return e.getFloat32()}}),float64:z({name:"float64",serialize:function(e,t){e.pushFloat64(t)},deserialize:function(e){return e.getFloat64()}}),float128:z({name:"float128",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),16)},deserialize:function(e){return b(e.getUint8Array(16))}}),bytes:z({name:"bytes",serialize:function(e,t){t instanceof Uint8Array||Array.isArray(t)?e.pushBytes(t):e.pushBytes(w(t))},deserialize:function(e,t){return t&&t.options.bytesAsUint8Array?e.getBytes():b(e.getBytes())}}),string:z({name:"string",serialize:function(e,t){e.pushString(t)},deserialize:function(e){return e.getString()}}),name:z({name:"name",serialize:function(e,t){e.pushName(t)},deserialize:function(e){return e.getName()}}),time_point:z({name:"time_point",serialize:function(e,t){e.pushNumberAsUint64(l(t))},deserialize:function(e){return h(e.getUint64AsNumber())}}),time_point_sec:z({name:"time_point_sec",serialize:function(e,t){e.pushUint32(p(t))},deserialize:function(e){return d(e.getUint32())}}),block_timestamp_type:z({name:"block_timestamp_type",serialize:function(e,t){e.pushUint32(y(t))},deserialize:function(e){return v(e.getUint32())}}),symbol_code:z({name:"symbol_code",serialize:function(e,t){e.pushSymbolCode(t)},deserialize:function(e){return e.getSymbolCode()}}),symbol:z({name:"symbol",serialize:function(e,t){e.pushSymbol(g(t))},deserialize:function(e){return m(e.getSymbol())}}),asset:z({name:"asset",serialize:function(e,t){e.pushAsset(t)},deserialize:function(e){return e.getAsset()}}),checksum160:z({name:"checksum160",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),20)},deserialize:function(e){return b(e.getUint8Array(20))}}),checksum256:z({name:"checksum256",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),32)},deserialize:function(e){return b(e.getUint8Array(32))}}),checksum512:z({name:"checksum512",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),64)},deserialize:function(e){return b(e.getUint8Array(64))}}),public_key:z({name:"public_key",serialize:function(e,t){e.pushPublicKey(t)},deserialize:function(e){return e.getPublicKey()}}),private_key:z({name:"private_key",serialize:function(e,t){e.pushPrivateKey(t)},deserialize:function(e){return e.getPrivateKey()}}),signature:z({name:"signature",serialize:function(e,t){e.pushSignature(t)},deserialize:function(e){return e.getSignature()}})}))
return e.set("extended_asset",z({name:"extended_asset",baseName:"",fields:[{name:"quantity",typeName:"asset",type:e.get("asset")},{name:"contract",typeName:"name",type:e.get("name")}],serialize:k,deserialize:C})),e},t.getType=B,t.getTypesFromAbi=function(e,t){var r,n,i,s,c,u,f,l,h,p,d=new Map(e)
if(t.types)try{for(var y=a(t.types),v=y.next();!v.done;v=y.next()){var g=v.value,m=g.new_type_name,b=g.type
d.set(m,z({name:m,aliasOfName:b}))}}catch(e){r={error:e}}finally{try{v&&!v.done&&(n=y.return)&&n.call(y)}finally{if(r)throw r.error}}if(t.structs)try{for(var w=a(t.structs),_=w.next();!_.done;_=w.next()){var x=_.value,S=x.name,O=x.base,T=x.fields
d.set(S,z({name:S,baseName:O,fields:T.map(function(e){return{name:e.name,typeName:e.type,type:null}}),serialize:k,deserialize:C}))}}catch(e){i={error:e}}finally{try{_&&!_.done&&(s=w.return)&&s.call(w)}finally{if(i)throw i.error}}if(t.variants)try{for(var I=a(t.variants),P=I.next();!P.done;P=I.next()){var U=P.value,R=U.name,F=U.types
d.set(R,z({name:R,fields:F.map(function(e){return{name:e,typeName:e,type:null}}),serialize:A,deserialize:E}))}}catch(e){c={error:e}}finally{try{P&&!P.done&&(u=I.return)&&u.call(I)}finally{if(c)throw c.error}}try{for(var N=a(d),j=N.next();!j.done;j=N.next()){var D=o(j.value,2)
D[0],(b=D[1]).baseName&&(b.base=B(d,b.baseName))
try{for(var L=a(b.fields),M=L.next();!M.done;M=L.next()){var q=M.value
q.type=B(d,q.typeName)}}catch(e){h={error:e}}finally{try{M&&!M.done&&(p=L.return)&&p.call(L)}finally{if(h)throw h.error}}}}catch(e){f={error:e}}finally{try{j&&!j.done&&(l=N.return)&&l.call(N)}finally{if(f)throw f.error}}return d},t.transactionHeader=function(e,t){return{expiration:d(p(e.timestamp)+t),ref_block_num:65535&e.block_num,ref_block_prefix:e.ref_block_prefix}},t.serializeActionData=F,t.serializeAction=function(e,t,r,n,o,i,a){return{account:t,name:r,authorization:n,data:F(e,t,r,o,i,a)}},t.deserializeActionData=N,t.deserializeAction=function(e,t,r,n,o,i,a){return{account:t,name:r,authorization:n,data:N(e,t,r,o,i,a)}}},function(e,t,r){"use strict"
var n,o=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)})
Object.defineProperty(t,"__esModule",{value:!0})
var i=function(e){function t(r){var n=this
return n=r.error&&r.error.details&&r.error.details.length&&r.error.details[0].message?e.call(this,r.error.details[0].message)||this:r.processed&&r.processed.except&&r.processed.except.message?e.call(this,r.processed.except.message)||this:e.call(this,r.message)||this,Object.setPrototypeOf(n,t.prototype),n.json=r,n}return o(t,e),t}(Error)
t.RpcError=i},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__
!function(e,t){module.exports=t(e)}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,function(global){"use strict"
global=global||{}
var _Base64=global.Base64,version="2.5.1",buffer
if(module.exports)try{buffer=eval("require('buffer').Buffer")}catch(e){buffer=void 0}var b64chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b64tab=function(e){for(var t={},r=0,n=e.length;r<n;r++)t[e.charAt(r)]=r
return t}(b64chars),fromCharCode=String.fromCharCode,cb_utob=function(e){if(e.length<2)return(t=e.charCodeAt(0))<128?e:t<2048?fromCharCode(192|t>>>6)+fromCharCode(128|63&t):fromCharCode(224|t>>>12&15)+fromCharCode(128|t>>>6&63)+fromCharCode(128|63&t)
var t=65536+1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320)
return fromCharCode(240|t>>>18&7)+fromCharCode(128|t>>>12&63)+fromCharCode(128|t>>>6&63)+fromCharCode(128|63&t)},re_utob=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,utob=function(e){return e.replace(re_utob,cb_utob)},cb_encode=function(e){var t=[0,2,1][e.length%3],r=e.charCodeAt(0)<<16|(e.length>1?e.charCodeAt(1):0)<<8|(e.length>2?e.charCodeAt(2):0)
return[b64chars.charAt(r>>>18),b64chars.charAt(r>>>12&63),t>=2?"=":b64chars.charAt(r>>>6&63),t>=1?"=":b64chars.charAt(63&r)].join("")},btoa=global.btoa?function(e){return global.btoa(e)}:function(e){return e.replace(/[\s\S]{1,3}/g,cb_encode)},_encode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(e){return(e.constructor===buffer.constructor?e:buffer.from(e)).toString("base64")}:function(e){return(e.constructor===buffer.constructor?e:new buffer(e)).toString("base64")}:function(e){return btoa(utob(e))},encode=function(e,t){return t?_encode(String(e)).replace(/[+\/]/g,function(e){return"+"==e?"-":"_"}).replace(/=/g,""):_encode(String(e))},encodeURI=function(e){return encode(e,!0)},re_btou=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g"),cb_btou=function(e){switch(e.length){case 4:var t=((7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3))-65536
return fromCharCode(55296+(t>>>10))+fromCharCode(56320+(1023&t))
case 3:return fromCharCode((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2))
default:return fromCharCode((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1))}},btou=function(e){return e.replace(re_btou,cb_btou)},cb_decode=function(e){var t=e.length,r=t%4,n=(t>0?b64tab[e.charAt(0)]<<18:0)|(t>1?b64tab[e.charAt(1)]<<12:0)|(t>2?b64tab[e.charAt(2)]<<6:0)|(t>3?b64tab[e.charAt(3)]:0),o=[fromCharCode(n>>>16),fromCharCode(n>>>8&255),fromCharCode(255&n)]
return o.length-=[0,0,2,1][r],o.join("")},_atob=global.atob?function(e){return global.atob(e)}:function(e){return e.replace(/\S{1,4}/g,cb_decode)},atob=function(e){return _atob(String(e).replace(/[^A-Za-z0-9\+\/]/g,""))},_decode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(e){return(e.constructor===buffer.constructor?e:buffer.from(e,"base64")).toString()}:function(e){return(e.constructor===buffer.constructor?e:new buffer(e,"base64")).toString()}:function(e){return btou(_atob(e))},decode=function(e){return _decode(String(e).replace(/[-_]/g,function(e){return"-"==e?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))},noConflict=function(){var e=global.Base64
return global.Base64=_Base64,e}
if(global.Base64={VERSION:version,atob:atob,btoa:btoa,fromBase64:decode,toBase64:encode,utob:utob,encode:encode,encodeURI:encodeURI,btou:btou,decode:decode,noConflict:noConflict,__buffer__:buffer},"function"==typeof Object.defineProperty){var noEnum=function(e){return{value:e,enumerable:!1,writable:!0,configurable:!0}}
global.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",noEnum(function(){return decode(this)})),Object.defineProperty(String.prototype,"toBase64",noEnum(function(e){return encode(this,e)})),Object.defineProperty(String.prototype,"toBase64URI",noEnum(function(){return encode(this,!0)}))}}return global.Meteor&&(Base64=global.Base64),module.exports?module.exports.Base64=global.Base64:(__WEBPACK_AMD_DEFINE_ARRAY__=[],__WEBPACK_AMD_DEFINE_RESULT__=function(){return global.Base64}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),void 0===__WEBPACK_AMD_DEFINE_RESULT__||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)),{Base64:global.Base64}})},function(e,t,r){var n=r(67),o=r(69)
e.exports=function(e,t,r){var i=t&&r||0
"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null)
var a=(e=e||{}).random||(e.rng||n)()
if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t)for(var s=0;s<16;++s)t[i+s]=a[s]
return t||o(a)}},function(e,t){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(t){return"function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?e.exports=n=function(e){return r(e)}:e.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":r(e)},n(t)}e.exports=n},function(e,t,r){"use strict"
var n=r(70)
function o(e){this.message=e}o.prototype=new Error,o.prototype.name="InvalidTokenError",e.exports=function(e,t){if("string"!=typeof e)throw new o("Invalid token specified")
var r=!0===(t=t||{}).header?0:1
try{return JSON.parse(n(e.split(".")[r]))}catch(e){throw new o("Invalid token specified: "+e.message)}},e.exports.InvalidTokenError=o},function(e,t,r){var n=r(72)
e.exports=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},o=Object.keys(r)
"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),o.forEach(function(t){n(e,t,r[t])})}return e}},function(e,t,r){var n=function(e){"use strict"
var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag"
function c(e,t,r,n){var o=t&&t.prototype instanceof y?t:y,i=Object.create(o.prototype),a=new S(n||[])
return i._invoke=function(e,t,r){var n=f
return function(o,i){if(n===h)throw new Error("Generator is already running")
if(n===p){if("throw"===o)throw i
return T()}for(r.method=o,r.arg=i;;){var a=r.delegate
if(a){var s=C(a,r)
if(s){if(s===d)continue
return s}}if("next"===r.method)r.sent=r._sent=r.arg
else if("throw"===r.method){if(n===f)throw n=p,r.arg
r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg)
n=h
var c=u(e,t,r)
if("normal"===c.type){if(n=r.done?p:l,c.arg===d)continue
return{value:c.arg,done:r.done}}"throw"===c.type&&(n=p,r.method="throw",r.arg=c.arg)}}}(e,r,a),i}function u(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c
var f="suspendedStart",l="suspendedYield",h="executing",p="completed",d={}
function y(){}function v(){}function g(){}var m={}
m[i]=function(){return this}
var b=Object.getPrototypeOf,w=b&&b(b(O([])))
w&&w!==r&&n.call(w,i)&&(m=w)
var _=g.prototype=y.prototype=Object.create(m)
function x(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function k(e){var t
this._invoke=function(r,o){function i(){return new Promise(function(t,i){!function t(r,o,i,a){var s=u(e[r],e,o)
if("throw"!==s.type){var c=s.arg,f=c.value
return f&&"object"==typeof f&&n.call(f,"__await")?Promise.resolve(f.__await).then(function(e){t("next",e,i,a)},function(e){t("throw",e,i,a)}):Promise.resolve(f).then(function(e){c.value=e,i(c)},function(e){return t("throw",e,i,a)})}a(s.arg)}(r,o,t,i)})}return t=t?t.then(i,i):i()}}function C(e,r){var n=e.iterator[r.method]
if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,C(e,r),"throw"===r.method))return d
r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=u(n,e.iterator,r.arg)
if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d
var i=o.arg
return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function A(e){var t={tryLoc:e[0]}
1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function E(e){var t=e.completion||{}
t.type="normal",delete t.arg,e.completion=t}function S(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(A,this),this.reset(!0)}function O(e){if(e){var r=e[i]
if(r)return r.call(e)
if("function"==typeof e.next)return e
if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r
return r.value=t,r.done=!0,r}
return a.next=a}}return{next:T}}function T(){return{value:t,done:!0}}return v.prototype=_.constructor=g,g.constructor=v,g[s]=v.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor
return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,g):(e.__proto__=g,s in e||(e[s]="GeneratorFunction")),e.prototype=Object.create(_),e},e.awrap=function(e){return{__await:e}},x(k.prototype),k.prototype[a]=function(){return this},e.AsyncIterator=k,e.async=function(t,r,n,o){var i=new k(c(t,r,n,o))
return e.isGeneratorFunction(r)?i:i.next().then(function(e){return e.done?e.value:i.next()})},x(_),_[s]="Generator",_[i]=function(){return this},_.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[]
for(var r in e)t.push(r)
return t.reverse(),function r(){for(;t.length;){var n=t.pop()
if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=O,S.prototype={constructor:S,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(E),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0
var e=this.tryEntries[0].completion
if("throw"===e.type)throw e.arg
return this.rval},dispatchException:function(e){if(this.done)throw e
var r=this
function o(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion
if("root"===a.tryLoc)return o("end")
if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc")
if(c&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)
if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally")
if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r]
if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o
break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null)
var a=i?i.completion:{}
return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg
return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),d},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t]
if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),E(r),d}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t]
if(r.tryLoc===e){var n=r.completion
if("throw"===n.type){var o=n.arg
E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),d}},e}(e.exports)
try{regeneratorRuntime=n}catch(e){Function("r","regeneratorRuntime = r")(n)}},function(e,t,r){"use strict"
var n=r(2),o=r(11),i=r(32),a=r(7)
function s(e){var t=new i(e),r=o(i.prototype.request,t)
return n.extend(r,i.prototype,t),n.extend(r,t),r}var c=s(a)
c.Axios=i,c.create=function(e){return s(n.merge(a,e))},c.Cancel=r(21),c.CancelToken=r(58),c.isCancel=r(20),c.all=function(e){return Promise.all(e)},c.spread=r(59),e.exports=c,e.exports.default=c},function(e,t){function r(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(r(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&r(e.slice(0,0))}(e)||!!e._isBuffer)}},function(e,t,r){"use strict"
var n=r(7),o=r(2),i=r(53),a=r(54)
function s(e){this.defaults=e,this.interceptors={request:new i,response:new i}}s.prototype.request=function(e){"string"==typeof e&&(e=o.merge({url:arguments[0]},arguments[1])),(e=o.merge(n,{method:"get"},this.defaults,e)).method=e.method.toLowerCase()
var t=[a,void 0],r=Promise.resolve(e)
for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)r=r.then(t.shift(),t.shift())
return r},o.forEach(["delete","get","head","options"],function(e){s.prototype[e]=function(t,r){return this.request(o.merge(r||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){s.prototype[e]=function(t,r,n){return this.request(o.merge(n||{},{method:e,url:t,data:r}))}}),e.exports=s},function(e,t,r){"use strict"
var n=r(2)
e.exports=function(e,t){n.forEach(e,function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])})}},function(e,t,r){"use strict"
var n=r(2),o=r(12),i=r(14),a=r(35),s=r(36),c=r(8),u="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||r(37)
e.exports=function(e){return new Promise(function(t,f){var l=e.data,h=e.headers
n.isFormData(l)&&delete h["Content-Type"]
var p=new XMLHttpRequest,d="onreadystatechange",y=!1
if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in p||s(e.url)||(p=new window.XDomainRequest,d="onload",y=!0,p.onprogress=function(){},p.ontimeout=function(){}),e.auth){var v=e.auth.username||"",g=e.auth.password||""
h.Authorization="Basic "+u(v+":"+g)}if(p.open(e.method.toUpperCase(),i(e.url,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p[d]=function(){if(p&&(4===p.readyState||y)&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in p?a(p.getAllResponseHeaders()):null,n={data:e.responseType&&"text"!==e.responseType?p.response:p.responseText,status:1223===p.status?204:p.status,statusText:1223===p.status?"No Content":p.statusText,headers:r,config:e,request:p}
o(t,f,n),p=null}},p.onerror=function(){f(c("Network Error",e,null,p)),p=null},p.ontimeout=function(){f(c("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",p)),p=null},n.isStandardBrowserEnv()){var m=r(38),b=(e.withCredentials||s(e.url))&&e.xsrfCookieName?m.read(e.xsrfCookieName):void 0
b&&(h[e.xsrfHeaderName]=b)}if("setRequestHeader"in p&&n.forEach(h,function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete h[t]:p.setRequestHeader(t,e)}),e.withCredentials&&(p.withCredentials=!0),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){p&&(p.abort(),f(e),p=null)}),void 0===l&&(l=null),p.send(l)})}},function(e,t,r){"use strict"
var n=r(2),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]
e.exports=function(e){var t,r,i,a={}
return e?(n.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=n.trim(e.substr(0,i)).toLowerCase(),r=n.trim(e.substr(i+1)),t){if(a[t]&&o.indexOf(t)>=0)return
a[t]="set-cookie"===t?(a[t]?a[t]:[]).concat([r]):a[t]?a[t]+", "+r:r}}),a):a}},function(e,t,r){"use strict"
var n=r(2)
e.exports=n.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a")
function o(e){var n=e
return t&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return e=o(window.location.href),function(t){var r=n.isString(t)?o(t):t
return r.protocol===e.protocol&&r.host===e.host}}():function(){return!0}},function(e,t,r){"use strict"
var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
function o(){this.message="String contains an invalid character"}o.prototype=new Error,o.prototype.code=5,o.prototype.name="InvalidCharacterError",e.exports=function(e){for(var t,r,i=String(e),a="",s=0,c=n;i.charAt(0|s)||(c="=",s%1);a+=c.charAt(63&t>>8-s%1*8)){if((r=i.charCodeAt(s+=.75))>255)throw new o
t=t<<8|r}return a}},function(e,t,r){"use strict"
var n=r(2)
e.exports=n.isStandardBrowserEnv()?{write:function(e,t,r,o,i,a){var s=[]
s.push(e+"="+encodeURIComponent(t)),n.isNumber(r)&&s.push("expires="+new Date(r).toGMTString()),n.isString(o)&&s.push("path="+o),n.isString(i)&&s.push("domain="+i),!0===a&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"))
return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,t,r){"use strict"
var n=r(2),o=r(12),i=r(14),a=r(15),s=r(16),c=r(17).http,u=r(17).https,f=r(18),l=r(51),h=r(52),p=r(8),d=r(13)
e.exports=function(e){return new Promise(function(t,r){var y,v=e.data,g=e.headers
if(g["User-Agent"]||g["user-agent"]||(g["User-Agent"]="axios/"+h.version),v&&!n.isStream(v)){if(Buffer.isBuffer(v));else if(n.isArrayBuffer(v))v=new Buffer(new Uint8Array(v))
else{if(!n.isString(v))return r(p("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",e))
v=new Buffer(v,"utf-8")}g["Content-Length"]=v.length}var m=void 0
e.auth&&(m=(e.auth.username||"")+":"+(e.auth.password||""))
var b=f.parse(e.url),w=b.protocol||"http:"
if(!m&&b.auth){var _=b.auth.split(":")
m=(_[0]||"")+":"+(_[1]||"")}m&&delete g.Authorization
var x="https:"===w,k=x?e.httpsAgent:e.httpAgent,C={path:i(b.path,e.params,e.paramsSerializer).replace(/^\?/,""),method:e.method,headers:g,agent:k,auth:m}
e.socketPath?C.socketPath=e.socketPath:(C.hostname=b.hostname,C.port=b.port)
var A,E=e.proxy
if(!E&&!1!==E){var S=w.slice(0,-1)+"_proxy",O=process.env[S]||process.env[S.toUpperCase()]
if(O){var T=f.parse(O)
if(E={host:T.hostname,port:T.port},T.auth){var I=T.auth.split(":")
E.auth={username:I[0],password:I[1]}}}}if(E&&(C.hostname=E.host,C.host=E.host,C.headers.host=b.hostname+(b.port?":"+b.port:""),C.port=E.port,C.path=w+"//"+b.hostname+(b.port?":"+b.port:"")+C.path,E.auth)){var P=new Buffer(E.auth.username+":"+E.auth.password,"utf8").toString("base64")
C.headers["Proxy-Authorization"]="Basic "+P}e.transport?A=e.transport:0===e.maxRedirects?A=x?s:a:(e.maxRedirects&&(C.maxRedirects=e.maxRedirects),A=x?u:c),e.maxContentLength&&e.maxContentLength>-1&&(C.maxBodyLength=e.maxContentLength)
var U=A.request(C,function(n){if(!U.aborted){clearTimeout(y),y=null
var i=n
switch(n.headers["content-encoding"]){case"gzip":case"compress":case"deflate":i=i.pipe(l.createUnzip()),delete n.headers["content-encoding"]}var a=n.req||U,s={status:n.statusCode,statusText:n.statusMessage,headers:n.headers,config:e,request:a}
if("stream"===e.responseType)s.data=i,o(t,r,s)
else{var c=[]
i.on("data",function(t){c.push(t),e.maxContentLength>-1&&Buffer.concat(c).length>e.maxContentLength&&r(p("maxContentLength size of "+e.maxContentLength+" exceeded",e,null,a))}),i.on("error",function(t){U.aborted||r(d(t,e,null,a))}),i.on("end",function(){var n=Buffer.concat(c)
"arraybuffer"!==e.responseType&&(n=n.toString("utf8")),s.data=n,o(t,r,s)})}}})
U.on("error",function(t){U.aborted||r(d(t,e,null,U))}),e.timeout&&!y&&(y=setTimeout(function(){U.abort(),r(p("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",U))},e.timeout)),e.cancelToken&&e.cancelToken.promise.then(function(e){U.aborted||(U.abort(),r(e))}),n.isStream(v)?v.pipe(U):U.end(v)})}},function(e,t){e.exports=require("assert")},function(e,t){e.exports=require("stream")},function(e,t,r){"use strict"
"undefined"==typeof process||"renderer"===process.type||!0===process.browser||process.__nwjs?e.exports=r(43):e.exports=r(45)},function(e,t,r){"use strict"
function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}t.log=function(){var e
return"object"===("undefined"==typeof console?"undefined":n(console))&&console.log&&(e=console).log.apply(e,arguments)},t.formatArgs=function(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return
var r="color: "+this.color
t.splice(1,0,r,"color: inherit")
var n=0,o=0
t[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&(n++,"%c"===e&&(o=n))}),t.splice(o,0,r)},t.save=function(e){try{e?t.storage.setItem("debug",e):t.storage.removeItem("debug")}catch(e){}},t.load=function(){var e
try{e=t.storage.getItem("debug")}catch(e){}!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG)
return e},t.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0
if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1
return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},t.storage=function(){try{return localStorage}catch(e){}}(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],e.exports=r(19)(t),e.exports.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}},function(e,t){var r=1e3,n=60*r,o=60*n,i=24*o,a=7*i,s=365.25*i
function c(e,t,r,n){var o=t>=1.5*r
return Math.round(e/r)+" "+n+(o?"s":"")}e.exports=function(e,t){t=t||{}
var u=typeof e
if("string"===u&&e.length>0)return function(e){if((e=String(e)).length>100)return
var t=/^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e)
if(!t)return
var c=parseFloat(t[1])
switch((t[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return c*s
case"weeks":case"week":case"w":return c*a
case"days":case"day":case"d":return c*i
case"hours":case"hour":case"hrs":case"hr":case"h":return c*o
case"minutes":case"minute":case"mins":case"min":case"m":return c*n
case"seconds":case"second":case"secs":case"sec":case"s":return c*r
case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return c
default:return}}(e)
if("number"===u&&!1===isNaN(e))return t.long?function(e){var t=Math.abs(e)
if(t>=i)return c(e,t,i,"day")
if(t>=o)return c(e,t,o,"hour")
if(t>=n)return c(e,t,n,"minute")
if(t>=r)return c(e,t,r,"second")
return e+" ms"}(e):function(e){var t=Math.abs(e)
if(t>=i)return Math.round(e/i)+"d"
if(t>=o)return Math.round(e/o)+"h"
if(t>=n)return Math.round(e/n)+"m"
if(t>=r)return Math.round(e/r)+"s"
return e+"ms"}(e)
throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},function(e,t,r){"use strict"
var n=r(46),o=r(47)
t.init=function(e){e.inspectOpts={}
for(var r=Object.keys(t.inspectOpts),n=0;n<r.length;n++)e.inspectOpts[r[n]]=t.inspectOpts[r[n]]},t.log=function(){return process.stderr.write(o.format.apply(o,arguments)+"\n")},t.formatArgs=function(r){var n=this.namespace
if(this.useColors){var o=this.color,i="[3"+(o<8?o:"8;5;"+o),a="  ".concat(i,";1m").concat(n," [0m")
r[0]=a+r[0].split("\n").join("\n"+a),r.push(i+"m+"+e.exports.humanize(this.diff)+"[0m")}else r[0]=function(){if(t.inspectOpts.hideDate)return""
return(new Date).toISOString()+" "}()+n+" "+r[0]},t.save=function(e){e?process.env.DEBUG=e:delete process.env.DEBUG},t.load=function(){return process.env.DEBUG},t.useColors=function(){return"colors"in t.inspectOpts?Boolean(t.inspectOpts.colors):n.isatty(process.stderr.fd)},t.colors=[6,2,3,4,5,1]
try{var i=r(48)
i&&(i.stderr||i).level>=2&&(t.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch(e){}t.inspectOpts=Object.keys(process.env).filter(function(e){return/^debug_/i.test(e)}).reduce(function(e,t){var r=t.substring(6).toLowerCase().replace(/_([a-z])/g,function(e,t){return t.toUpperCase()}),n=process.env[t]
return n=!!/^(yes|on|true|enabled)$/i.test(n)||!/^(no|off|false|disabled)$/i.test(n)&&("null"===n?null:Number(n)),e[r]=n,e},{}),e.exports=r(19)(t)
var a=e.exports.formatters
a.o=function(e){return this.inspectOpts.colors=this.useColors,o.inspect(e,this.inspectOpts).replace(/\s*\n\s*/g," ")},a.O=function(e){return this.inspectOpts.colors=this.useColors,o.inspect(e,this.inspectOpts)}},function(e,t){e.exports=require("tty")},function(e,t){e.exports=require("util")},function(e,t,r){"use strict"
const n=r(49),o=r(50),i=process.env
let a
function s(e){return function(e){return 0!==e&&{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}(function(e){if(!1===a)return 0
if(o("color=16m")||o("color=full")||o("color=truecolor"))return 3
if(o("color=256"))return 2
if(e&&!e.isTTY&&!0!==a)return 0
const t=a?1:0
if("win32"===process.platform){const e=n.release().split(".")
return Number(process.versions.node.split(".")[0])>=8&&Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}if("CI"in i)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some(e=>e in i)||"codeship"===i.CI_NAME?1:t
if("TEAMCITY_VERSION"in i)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION)?1:0
if("truecolor"===i.COLORTERM)return 3
if("TERM_PROGRAM"in i){const e=parseInt((i.TERM_PROGRAM_VERSION||"").split(".")[0],10)
switch(i.TERM_PROGRAM){case"iTerm.app":return e>=3?3:2
case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(i.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM)?1:"COLORTERM"in i?1:(i.TERM,t)}(e))}o("no-color")||o("no-colors")||o("color=false")?a=!1:(o("color")||o("colors")||o("color=true")||o("color=always"))&&(a=!0),"FORCE_COLOR"in i&&(a=0===i.FORCE_COLOR.length||0!==parseInt(i.FORCE_COLOR,10)),e.exports={supportsColor:s,stdout:s(process.stdout),stderr:s(process.stderr)}},function(e,t){e.exports=require("os")},function(e,t,r){"use strict"
e.exports=((e,t)=>{t=t||process.argv
const r=e.startsWith("-")?"":1===e.length?"-":"--",n=t.indexOf(r+e),o=t.indexOf("--")
return-1!==n&&(-1===o||n<o)})},function(e,t){e.exports=require("zlib")},function(e){e.exports={_from:"axios@^0.18.0",_id:"axios@0.18.0",_inBundle:!1,_integrity:"sha1-MtU+SFHv3AoRmTts0AB4nXDAUQI=",_location:"/axios",_phantomChildren:{},_requested:{type:"range",registry:!0,raw:"axios@^0.18.0",name:"axios",escapedName:"axios",rawSpec:"^0.18.0",saveSpec:null,fetchSpec:"^0.18.0"},_requiredBy:["/"],_resolved:"https://registry.npmjs.org/axios/-/axios-0.18.0.tgz",_shasum:"32d53e4851efdc0a11993b6cd000789d70c05102",_spec:"axios@^0.18.0",_where:"/home/sgehrman/Documents/GitHub/aikon/oreid-js",author:{name:"Matt Zabriskie"},browser:{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},bugs:{url:"https://github.com/axios/axios/issues"},bundleDependencies:!1,bundlesize:[{path:"./dist/axios.min.js",threshold:"5kB"}],dependencies:{"follow-redirects":"^1.3.0","is-buffer":"^1.1.5"},deprecated:!1,description:"Promise based HTTP client for the browser and node.js",devDependencies:{bundlesize:"^0.5.7",coveralls:"^2.11.9","es6-promise":"^4.0.5",grunt:"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1",karma:"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2",minimist:"^1.2.0",sinon:"^1.17.4",typescript:"^2.0.3","url-search-params":"^0.6.1",webpack:"^1.13.1","webpack-dev-server":"^1.14.1"},homepage:"https://github.com/axios/axios",keywords:["xhr","http","ajax","promise","node"],license:"MIT",main:"index.js",name:"axios",repository:{type:"git",url:"git+https://github.com/axios/axios.git"},scripts:{build:"NODE_ENV=production grunt build",coveralls:"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",examples:"node ./examples/server.js",postversion:"git push && git push --tags",preversion:"npm test",start:"node ./sandbox/server.js",test:"grunt test && bundlesize",version:"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},typings:"./index.d.ts",version:"0.18.0"}},function(e,t,r){"use strict"
var n=r(2)
function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){n.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=o},function(e,t,r){"use strict"
var n=r(2),o=r(55),i=r(20),a=r(7),s=r(56),c=r(57)
function u(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return u(e),e.baseURL&&!s(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),n.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]}),(e.adapter||a.adapter)(e).then(function(t){return u(e),t.data=o(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(u(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,r){"use strict"
var n=r(2)
e.exports=function(e,t,r){return n.forEach(r,function(r){e=r(e,t)}),e}},function(e,t,r){"use strict"
e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,r){"use strict"
e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,r){"use strict"
var n=r(21)
function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.")
var t
this.promise=new Promise(function(e){t=e})
var r=this
e(function(e){r.reason||(r.reason=new n(e),t(r.reason))})}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e
return{token:new o(function(t){e=t}),cancel:e}},e.exports=o},function(e,t,r){"use strict"
e.exports=function(e){return function(t){return e.apply(null,t)}}},function(e,t,r){"use strict"
var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])
return e}).apply(this,arguments)},o=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(a,s)}c((n=n.apply(e,t||[])).next())})},i=this&&this.__generator||function(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1]
return o[1]},trys:[],ops:[]}
return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i
function s(i){return function(s){return function(i){if(r)throw new TypeError("Generator is already executing.")
for(;a;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o
switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i
break
case 4:return a.label++,{value:i[1],done:!1}
case 5:a.label++,n=i[1],i=[0]
continue
case 7:i=a.ops.pop(),a.trys.pop()
continue
default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0
continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1]
break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i
break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i)
break}o[2]&&a.ops.pop(),a.trys.pop()
continue}i=t.call(e,a)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1]
return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},a=this&&this.__rest||function(e,t){var r={}
for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n])
if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0
for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&(r[n[o]]=e[n[o]])}return r},s=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator]
if(!r)return e
var n,o,i=r.call(e),a=[]
try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a},c=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(s(arguments[t]))
return e},u=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],r=0
return t?t.call(e):{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}
Object.defineProperty(t,"__esModule",{value:!0})
var f=r(22),l=r(62),h=r(63),p=function(){function e(e){this.contracts=new Map,this.cachedAbis=new Map,this.rpc=e.rpc,this.authorityProvider=e.authorityProvider||e.rpc,this.abiProvider=e.abiProvider||e.rpc,this.signatureProvider=e.signatureProvider,this.chainId=e.chainId,this.textEncoder=e.textEncoder,this.textDecoder=e.textDecoder,this.abiTypes=f.getTypesFromAbi(f.createInitialTypes(),l),this.transactionTypes=f.getTypesFromAbi(f.createInitialTypes(),h)}return e.prototype.rawAbiToJson=function(e){var t=new f.SerialBuffer({textEncoder:this.textEncoder,textDecoder:this.textDecoder,array:e})
if(!f.supportedAbiVersion(t.getString()))throw new Error("Unsupported abi version")
return t.restartRead(),this.abiTypes.get("abi_def").deserialize(t)},e.prototype.getCachedAbi=function(e,t){return void 0===t&&(t=!1),o(this,void 0,void 0,function(){var r,n,o,a
return i(this,function(i){switch(i.label){case 0:if(!t&&this.cachedAbis.get(e))return[2,this.cachedAbis.get(e)]
i.label=1
case 1:return i.trys.push([1,3,,4]),[4,this.abiProvider.getRawAbi(e)]
case 2:return n=i.sent().abi,o=this.rawAbiToJson(n),r={rawAbi:n,abi:o},[3,4]
case 3:throw(a=i.sent()).message="fetching abi for "+e+": "+a.message,a
case 4:if(!r)throw new Error("Missing abi for "+e)
return this.cachedAbis.set(e,r),[2,r]}})})},e.prototype.getAbi=function(e,t){return void 0===t&&(t=!1),o(this,void 0,void 0,function(){return i(this,function(r){switch(r.label){case 0:return[4,this.getCachedAbi(e,t)]
case 1:return[2,r.sent().abi]}})})},e.prototype.getTransactionAbis=function(e,t){return void 0===t&&(t=!1),o(this,void 0,void 0,function(){var r,n,a,s=this
return i(this,function(u){return r=e.actions.map(function(e){return e.account}),n=new Set(r),a=c(n).map(function(e){return o(s,void 0,void 0,function(){var r
return i(this,function(n){switch(n.label){case 0:return r={accountName:e},[4,this.getCachedAbi(e,t)]
case 1:return[2,(r.abi=n.sent().rawAbi,r)]}})})}),[2,Promise.all(a)]})})},e.prototype.getContract=function(e,t){return void 0===t&&(t=!1),o(this,void 0,void 0,function(){var r,n,o,a,s,c,l,h,p,d,y
return i(this,function(i){switch(i.label){case 0:return!t&&this.contracts.get(e)?[2,this.contracts.get(e)]:[4,this.getAbi(e,t)]
case 1:o=i.sent(),a=f.getTypesFromAbi(f.createInitialTypes(),o),s=new Map
try{for(c=u(o.actions),l=c.next();!l.done;l=c.next())h=l.value,p=h.name,d=h.type,s.set(p,f.getType(a,d))}catch(e){r={error:e}}finally{try{l&&!l.done&&(n=c.return)&&n.call(c)}finally{if(r)throw r.error}}return y={types:a,actions:s},this.contracts.set(e,y),[2,y]}})})},e.prototype.serialize=function(e,t,r){this.transactionTypes.get(t).serialize(e,r)},e.prototype.deserialize=function(e,t){return this.transactionTypes.get(t).deserialize(e)},e.prototype.serializeTransaction=function(e){var t=new f.SerialBuffer({textEncoder:this.textEncoder,textDecoder:this.textDecoder})
return this.serialize(t,"transaction",n({max_net_usage_words:0,max_cpu_usage_ms:0,delay_sec:0,context_free_actions:[],actions:[],transaction_extensions:[]},e)),t.asUint8Array()},e.prototype.deserializeTransaction=function(e){var t=new f.SerialBuffer({textEncoder:this.textEncoder,textDecoder:this.textDecoder})
return t.pushArray(e),this.deserialize(t,"transaction")},e.prototype.serializeActions=function(e){return o(this,void 0,void 0,function(){var t=this
return i(this,function(r){switch(r.label){case 0:return[4,Promise.all(e.map(function(e){var r=e.account,n=e.name,a=e.authorization,s=e.data
return o(t,void 0,void 0,function(){var e
return i(this,function(t){switch(t.label){case 0:return[4,this.getContract(r)]
case 1:return e=t.sent(),[2,f.serializeAction(e,r,n,a,s,this.textEncoder,this.textDecoder)]}})})}))]
case 1:return[2,r.sent()]}})})},e.prototype.deserializeActions=function(e){return o(this,void 0,void 0,function(){var t=this
return i(this,function(r){switch(r.label){case 0:return[4,Promise.all(e.map(function(e){var r=e.account,n=e.name,a=e.authorization,s=e.data
return o(t,void 0,void 0,function(){var e
return i(this,function(t){switch(t.label){case 0:return[4,this.getContract(r)]
case 1:return e=t.sent(),[2,f.deserializeAction(e,r,n,a,s,this.textEncoder,this.textDecoder)]}})})}))]
case 1:return[2,r.sent()]}})})},e.prototype.deserializeTransactionWithActions=function(e){return o(this,void 0,void 0,function(){var t,r
return i(this,function(o){switch(o.label){case 0:return"string"==typeof e&&(e=f.hexToUint8Array(e)),t=this.deserializeTransaction(e),[4,this.deserializeActions(t.actions)]
case 1:return r=o.sent(),[2,n({},t,{actions:r})]}})})},e.prototype.transact=function(e,t){var r=void 0===t?{}:t,a=r.broadcast,s=void 0===a||a,c=r.sign,u=void 0===c||c,l=r.blocksBehind,h=r.expireSeconds
return o(this,void 0,void 0,function(){var t,r,o,a,c,p,d,y,v
return i(this,function(i){switch(i.label){case 0:return this.chainId?[3,2]:[4,this.rpc.get_info()]
case 1:t=i.sent(),this.chainId=t.chain_id,i.label=2
case 2:return"number"==typeof l&&h?t?[3,4]:[4,this.rpc.get_info()]:[3,6]
case 3:t=i.sent(),i.label=4
case 4:return[4,this.rpc.get_block(t.head_block_num-l)]
case 5:r=i.sent(),e=n({},f.transactionHeader(r,h),e),i.label=6
case 6:if(!this.hasRequiredTaposFields(e))throw new Error("Required configuration or TAPOS fields are not present")
return[4,this.getTransactionAbis(e)]
case 7:return o=i.sent(),a=[{},e],c={},[4,this.serializeActions(e.actions)]
case 8:return e=n.apply(void 0,a.concat([(c.actions=i.sent(),c)])),p=this.serializeTransaction(e),d={serializedTransaction:p,signatures:[]},u?[4,this.signatureProvider.getAvailableKeys()]:[3,12]
case 9:return y=i.sent(),[4,this.authorityProvider.getRequiredKeys({transaction:e,availableKeys:y})]
case 10:return v=i.sent(),[4,this.signatureProvider.sign({chainId:this.chainId,requiredKeys:v,serializedTransaction:p,abis:o})]
case 11:d=i.sent(),i.label=12
case 12:return s?[2,this.pushSignedTransaction(d)]:[2,d]}})})},e.prototype.pushSignedTransaction=function(e){var t=e.signatures,r=e.serializedTransaction
return o(this,void 0,void 0,function(){return i(this,function(e){return[2,this.rpc.push_transaction({signatures:t,serializedTransaction:r})]})})},e.prototype.hasRequiredTaposFields=function(e){var t=e.expiration,r=e.ref_block_num,n=e.ref_block_prefix
a(e,["expiration","ref_block_num","ref_block_prefix"])
return!!(t&&r&&n)},e}()
t.Api=p},function(e,t,r){"use strict"
var n=function(){return function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,i=void 0
try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return o(e,null,[{key:"get_n_pad_bytes",value:function(e){return 64-(e+8&63)}},{key:"pad",value:function(t){var r,o,i=t.byteLength,a=e.get_n_pad_bytes(i),s=(r=i,o=536870912,[Math.floor(r/o),r%o]).map(function(e,t){return t?8*e:e}),c=n(s,2),u=c[0],f=c[1],l=new Uint8Array(i+a+8)
l.set(new Uint8Array(t),0)
var h=new DataView(l.buffer)
return h.setUint8(i,128),h.setUint32(i+a,f,!0),h.setUint32(i+a+4,u,!0),l.buffer}},{key:"f",value:function(e,t,r,n){return 0<=e&&e<=15?t^r^n:16<=e&&e<=31?t&r|~t&n:32<=e&&e<=47?(t|~r)^n:48<=e&&e<=63?t&n|r&~n:64<=e&&e<=79?t^(r|~n):void 0}},{key:"K",value:function(e){return 0<=e&&e<=15?0:16<=e&&e<=31?1518500249:32<=e&&e<=47?1859775393:48<=e&&e<=63?2400959708:64<=e&&e<=79?2840853838:void 0}},{key:"KP",value:function(e){return 0<=e&&e<=15?1352829926:16<=e&&e<=31?1548603684:32<=e&&e<=47?1836072691:48<=e&&e<=63?2053994217:64<=e&&e<=79?0:void 0}},{key:"add_modulo32",value:function(){return 0|Array.from(arguments).reduce(function(e,t){return e+t},0)}},{key:"rol32",value:function(e,t){return e<<t|e>>>32-t}},{key:"hash",value:function(t){for(var r=e.pad(t),n=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],o=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],i=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],a=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],s=r.byteLength/64,c=new Array(s).fill(void 0).map(function(e,t){return function(e){return new DataView(r,64*t,64).getUint32(4*e,!0)}}),u=[1732584193,4023233417,2562383102,271733878,3285377520],f=0;f<s;++f){for(var l=u[0],h=u[1],p=u[2],d=u[3],y=u[4],v=l,g=h,m=p,b=d,w=y,_=0;_<80;++_){var x=e.add_modulo32(e.rol32(e.add_modulo32(l,e.f(_,h,p,d),c[f](n[_]),e.K(_)),i[_]),y)
l=y,y=d,d=e.rol32(p,10),p=h,h=x,x=e.add_modulo32(e.rol32(e.add_modulo32(v,e.f(79-_,g,m,b),c[f](o[_]),e.KP(_)),a[_]),w),v=w,w=b,b=e.rol32(m,10),m=g,g=x}var k=e.add_modulo32(u[1],p,b)
u[1]=e.add_modulo32(u[2],d,w),u[2]=e.add_modulo32(u[3],y,v),u[3]=e.add_modulo32(u[4],l,g),u[4]=e.add_modulo32(u[0],h,m),u[0]=k}var C=new ArrayBuffer(20),A=new DataView(C)
return u.forEach(function(e,t){return A.setUint32(4*t,e,!0)}),C}}]),e}()
e.exports={RIPEMD160:i}},function(e){e.exports={version:"eosio::abi/1.1",structs:[{name:"extensions_entry",base:"",fields:[{name:"tag",type:"uint16"},{name:"value",type:"bytes"}]},{name:"type_def",base:"",fields:[{name:"new_type_name",type:"string"},{name:"type",type:"string"}]},{name:"field_def",base:"",fields:[{name:"name",type:"string"},{name:"type",type:"string"}]},{name:"struct_def",base:"",fields:[{name:"name",type:"string"},{name:"base",type:"string"},{name:"fields",type:"field_def[]"}]},{name:"action_def",base:"",fields:[{name:"name",type:"name"},{name:"type",type:"string"},{name:"ricardian_contract",type:"string"}]},{name:"table_def",base:"",fields:[{name:"name",type:"name"},{name:"index_type",type:"string"},{name:"key_names",type:"string[]"},{name:"key_types",type:"string[]"},{name:"type",type:"string"}]},{name:"clause_pair",base:"",fields:[{name:"id",type:"string"},{name:"body",type:"string"}]},{name:"error_message",base:"",fields:[{name:"error_code",type:"uint64"},{name:"error_msg",type:"string"}]},{name:"variant_def",base:"",fields:[{name:"name",type:"string"},{name:"types",type:"string[]"}]},{name:"abi_def",base:"",fields:[{name:"version",type:"string"},{name:"types",type:"type_def[]"},{name:"structs",type:"struct_def[]"},{name:"actions",type:"action_def[]"},{name:"tables",type:"table_def[]"},{name:"ricardian_clauses",type:"clause_pair[]"},{name:"error_messages",type:"error_message[]"},{name:"abi_extensions",type:"extensions_entry[]"},{name:"variants",type:"variant_def[]$"}]}]}},function(e){e.exports={version:"eosio::abi/1.0",types:[{new_type_name:"account_name",type:"name"},{new_type_name:"action_name",type:"name"},{new_type_name:"permission_name",type:"name"}],structs:[{name:"permission_level",base:"",fields:[{name:"actor",type:"account_name"},{name:"permission",type:"permission_name"}]},{name:"action",base:"",fields:[{name:"account",type:"account_name"},{name:"name",type:"action_name"},{name:"authorization",type:"permission_level[]"},{name:"data",type:"bytes"}]},{name:"extension",base:"",fields:[{name:"type",type:"uint16"},{name:"data",type:"bytes"}]},{name:"transaction_header",base:"",fields:[{name:"expiration",type:"time_point_sec"},{name:"ref_block_num",type:"uint16"},{name:"ref_block_prefix",type:"uint32"},{name:"max_net_usage_words",type:"varuint32"},{name:"max_cpu_usage_ms",type:"uint8"},{name:"delay_sec",type:"varuint32"}]},{name:"transaction",base:"transaction_header",fields:[{name:"context_free_actions",type:"action[]"},{name:"actions",type:"action[]"},{name:"transaction_extensions",type:"extension[]"}]}]}},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})},function(e,t,r){"use strict"
var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(a,s)}c((n=n.apply(e,t||[])).next())})},o=this&&this.__generator||function(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1]
return o[1]},trys:[],ops:[]}
return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i
function s(i){return function(s){return function(i){if(r)throw new TypeError("Generator is already executing.")
for(;a;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o
switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i
break
case 4:return a.label++,{value:i[1],done:!1}
case 5:a.label++,n=i[1],i=[0]
continue
case 7:i=a.ops.pop(),a.trys.pop()
continue
default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0
continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1]
break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i
break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i)
break}o[2]&&a.ops.pop(),a.trys.pop()
continue}i=t.call(e,a)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1]
return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],r=0
return t?t.call(e):{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}
Object.defineProperty(t,"__esModule",{value:!0})
var a=r(9),s=r(23)
function c(e){var t,r,n=""
try{for(var o=i(e),a=o.next();!a.done;a=o.next()){n+=("00"+a.value.toString(16)).slice(-2)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return n}var u=function(){function e(e,t){void 0===t&&(t={}),this.endpoint=e,t.fetch?this.fetchBuiltin=t.fetch:this.fetchBuiltin=global.fetch}return e.prototype.fetch=function(e,t){return n(this,void 0,void 0,function(){var r,n,i
return o(this,function(o){switch(o.label){case 0:return o.trys.push([0,3,,4]),[4,(0,this.fetchBuiltin)(this.endpoint+e,{body:JSON.stringify(t),method:"POST"})]
case 1:return[4,(r=o.sent()).json()]
case 2:if((n=o.sent()).processed&&n.processed.except)throw new s.RpcError(n)
return[3,4]
case 3:throw(i=o.sent()).isFetchError=!0,i
case 4:if(!r.ok)throw new s.RpcError(n)
return[2,n]}})})},e.prototype.get_abi=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_abi",{account_name:e})]
case 1:return[2,t.sent()]}})})},e.prototype.get_account=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_account",{account_name:e})]
case 1:return[2,t.sent()]}})})},e.prototype.get_block_header_state=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_block_header_state",{block_num_or_id:e})]
case 1:return[2,t.sent()]}})})},e.prototype.get_block=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_block",{block_num_or_id:e})]
case 1:return[2,t.sent()]}})})},e.prototype.get_code=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_code",{account_name:e})]
case 1:return[2,t.sent()]}})})},e.prototype.get_currency_balance=function(e,t,r){return void 0===r&&(r=null),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/chain/get_currency_balance",{code:e,account:t,symbol:r})]
case 1:return[2,n.sent()]}})})},e.prototype.get_currency_stats=function(e,t){return n(this,void 0,void 0,function(){return o(this,function(r){switch(r.label){case 0:return[4,this.fetch("/v1/chain/get_currency_stats",{code:e,symbol:t})]
case 1:return[2,r.sent()]}})})},e.prototype.get_info=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_info",{})]
case 1:return[2,e.sent()]}})})},e.prototype.get_producer_schedule=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_producer_schedule",{})]
case 1:return[2,e.sent()]}})})},e.prototype.get_producers=function(e,t,r){return void 0===e&&(e=!0),void 0===t&&(t=""),void 0===r&&(r=50),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/chain/get_producers",{json:e,lower_bound:t,limit:r})]
case 1:return[2,n.sent()]}})})},e.prototype.get_raw_code_and_abi=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_raw_code_and_abi",{account_name:e})]
case 1:return[2,t.sent()]}})})},e.prototype.getRawAbi=function(e){return n(this,void 0,void 0,function(){var t,r
return o(this,function(n){switch(n.label){case 0:return[4,this.get_raw_code_and_abi(e)]
case 1:return t=n.sent(),r=a.base64ToBinary(t.abi),[2,{accountName:t.account_name,abi:r}]}})})},e.prototype.get_table_rows=function(e){var t=e.json,r=void 0===t||t,i=e.code,a=e.scope,s=e.table,c=e.table_key,u=void 0===c?"":c,f=e.lower_bound,l=void 0===f?"":f,h=e.upper_bound,p=void 0===h?"":h,d=e.index_position,y=void 0===d?1:d,v=e.key_type,g=void 0===v?"":v,m=e.limit,b=void 0===m?10:m,w=e.reverse,_=void 0!==w&&w,x=e.show_payer,k=void 0!==x&&x
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_table_rows",{json:r,code:i,scope:a,table:s,table_key:u,lower_bound:l,upper_bound:p,index_position:y,key_type:g,limit:b,reverse:_,show_payer:k})]
case 1:return[2,e.sent()]}})})},e.prototype.get_table_by_scope=function(e){var t=e.code,r=e.table,i=e.lower_bound,a=void 0===i?"":i,s=e.upper_bound,c=void 0===s?"":s,u=e.limit,f=void 0===u?10:u
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_table_by_scope",{code:t,table:r,lower_bound:a,upper_bound:c,limit:f})]
case 1:return[2,e.sent()]}})})},e.prototype.getRequiredKeys=function(e){return n(this,void 0,void 0,function(){var t
return o(this,function(r){switch(r.label){case 0:return t=a.convertLegacyPublicKeys,[4,this.fetch("/v1/chain/get_required_keys",{transaction:e.transaction,available_keys:e.availableKeys})]
case 1:return[2,t.apply(void 0,[r.sent().required_keys])]}})})},e.prototype.push_transaction=function(e){var t=e.signatures,r=e.serializedTransaction
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/push_transaction",{signatures:t,compression:0,packed_context_free_data:"",packed_trx:c(r)})]
case 1:return[2,e.sent()]}})})},e.prototype.db_size_get=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/db_size/get",{})]
case 1:return[2,e.sent()]}})})},e.prototype.history_get_actions=function(e,t,r){return void 0===t&&(t=null),void 0===r&&(r=null),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/history/get_actions",{account_name:e,pos:t,offset:r})]
case 1:return[2,n.sent()]}})})},e.prototype.history_get_transaction=function(e,t){return void 0===t&&(t=null),n(this,void 0,void 0,function(){return o(this,function(r){switch(r.label){case 0:return[4,this.fetch("/v1/history/get_transaction",{id:e,block_num_hint:t})]
case 1:return[2,r.sent()]}})})},e.prototype.history_get_key_accounts=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/history/get_key_accounts",{public_key:e})]
case 1:return[2,t.sent()]}})})},e.prototype.history_get_controlled_accounts=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/history/get_controlled_accounts",{controlling_account:e})]
case 1:return[2,t.sent()]}})})},e}()
t.JsonRpc=u},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})},function(e,t,r){var n=r(68)
e.exports=function(){return n.randomBytes(16)}},function(e,t){e.exports=require("crypto")},function(e,t){for(var r=[],n=0;n<256;++n)r[n]=(n+256).toString(16).substr(1)
e.exports=function(e,t){var n=t||0,o=r
return[o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]]].join("")}},function(e,t,r){var n=r(71)
e.exports=function(e){var t=e.replace(/-/g,"+").replace(/_/g,"/")
switch(t.length%4){case 0:break
case 2:t+="=="
break
case 3:t+="="
break
default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(n(e).replace(/(.)/g,function(e,t){var r=t.charCodeAt(0).toString(16).toUpperCase()
return r.length<2&&(r="0"+r),"%"+r}))}(t)}catch(e){return n(t)}}},function(e,t){var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
function n(e){this.message=e}n.prototype=new Error,n.prototype.name="InvalidCharacterError",e.exports="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(e){var t=String(e).replace(/=+$/,"")
if(t.length%4==1)throw new n("'atob' failed: The string to be decoded is not correctly encoded.")
for(var o,i,a=0,s=0,c="";i=t.charAt(s++);~i&&(o=a%4?64*o+i:i,a++%4)?c+=String.fromCharCode(255&o>>(-2*a&6)):0)i=r.indexOf(i)
return c}},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t,r){"use strict"
r.r(t)
var n=r(0),o=r.n(n),i=r(1),a=r.n(i),s=r(3),c=r.n(s),u=r(4),f=r.n(u),l=r(10),h=r.n(l),p=r(5)
function d(e){var t=e,r=[]
return{getState:function(){return t},updateState:function(e){t="function"==typeof e?e(t):e
for(var n=0,o=r;n<o.length;n++){(0,o[n])(t)}},subscribe:function(e){return r.push(e),function(){r=r.filter(function(t){return t!==e})}}}}var y=r(25),v=r.n(y)
function g(e,t){return void 0===t&&(t="Error"),e?"string"==typeof e?e:e.message||t:t}var m=function(){return(m=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])
return e}).apply(this,arguments)},b=function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(a,s)}c((n=n.apply(e,t||[])).next())})},w=function(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1]
return o[1]},trys:[],ops:[]}
return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i
function s(i){return function(s){return function(i){if(r)throw new TypeError("Generator is already executing.")
for(;a;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o
switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i
break
case 4:return a.label++,{value:i[1],done:!1}
case 5:a.label++,n=i[1],i=[0]
continue
case 7:i=a.ops.pop(),a.trys.pop()
continue
default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0
continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1]
break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i
break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i)
break}o[2]&&a.ops.pop(),a.trys.pop()
continue}i=t.call(e,a)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1]
return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},_={connecting:!1,connected:!1,connectionError:!1,connectionErrorMessage:void 0,auth:void 0,authenticating:!1,authenticated:!1,authenticationConfirmed:!1,authenticationError:!1,authenticationErrorMessage:void 0,accountInfo:void 0,accountFetching:!1,accountFetchError:!1,accountFetchErrorMessage:void 0}
function x(e,t){var r=v()(),n=d(m({},_)),o={keyToAccountMap:[]},i=n.getState,a=new p.Api({rpc:t.eosRpc,chainId:t.network.chainId,signatureProvider:e.signatureProvider})
function s(e){return e?(n.updateState(function(e){return m({},e,{accountFetching:!0,accountFetchError:!1,accountFetchErrorMessage:void 0})}),t.eosRpc.get_account(e).then(function(e){var t=m({},e)
return n.updateState(function(e){return m({},e,{accountFetching:!1,accountInfo:t})}),t}).catch(function(e){return n.updateState(function(t){return m({},t,{accountFetching:!1,accountInfo:void 0,accountFetchError:!0,accountFetchErrorMessage:g(e)})}),Promise.reject(e)})):Promise.reject("No `accountName` was passed in order to fetch the account info")}function c(){return e.disconnect().then(function(){return n.updateState(function(e){return m({},e,{connecting:!1,connected:!1,connectionError:!1,connectionErrorMessage:void 0})}),!0})}function u(){return e.logout().then(function(){return n.updateState(function(e){return m({},e,{accountInfo:void 0,authenticating:!1,authenticated:!1,authenticationError:!1,authenticationErrorMessage:void 0})}),!0})}var f={_instanceId:r,ctx:t,provider:e,eosApi:a,get state(){return i()||m({},_)},get auth(){var e=i()
return e&&e.auth||void 0},get accountInfo(){var e=i()
return e&&e.accountInfo||void 0},get connected(){var e=i()
return e&&e.connected||!1},get authenticated(){var e=i()
return e&&e.authenticated||!1},get inProgress(){var e=i()
if(!e)return!1
var t=e.connecting,r=e.authenticating,n=e.accountFetching
return!!(t||r||n)},get active(){var e=i()
if(!e)return!1
var t=e.connected,r=e.authenticated,n=e.accountInfo
return!!(t&&r&&n)},get hasError(){var e=i()
if(!e)return!1
var t=e.connectionError,r=e.authenticationError,n=e.accountFetchError
return!!(t||r||n)},get errorMessage(){var e=i()
if(e&&f.hasError){var t=e.connectionErrorMessage,r=e.authenticationErrorMessage,n=e.accountFetchErrorMessage
return t||r||n||"Wallet connection error"}},connect:function(){return n.updateState(function(e){return m({},e,{connected:!1,connecting:!0,connectionError:!1,connectionErrorMessage:void 0})}),e.connect(t.appName).then(function(){return n.updateState(function(e){return m({},e,{connecting:!1,connected:!0})}),!0}).catch(function(e){return n.updateState(function(t){return m({},t,{connecting:!1,connectionError:!0,connectionErrorMessage:g(e)})}),Promise.reject(e)})},discover:function(r){return b(this,void 0,void 0,function(){var n,i=this
return w(this,function(a){switch(a.label){case 0:return n={keyToAccountMap:[]},[4,e.discover(r).then(function(e){return b(i,void 0,void 0,function(){var r,i,a,s,c,u=this
return w(this,function(f){switch(f.label){case 0:for(delete(n=m({},n,e)).keys,r=[],i=function(e){var n=e.key,i=e.index,a=!1
if(o.keyToAccountMap&&o.keyToAccountMap.findIndex(function(e){return e.index==i})>-1&&(a=!0),n&&!a){var s=t.eosRpc.history_get_key_accounts(n).then(function(e){return b(u,void 0,void 0,function(){var r,o,a,s,c,u=this
return w(this,function(f){switch(f.label){case 0:if(r={index:i,key:n,accounts:[]},!(e.account_names.length>0))return[3,4]
o=function(e){return w(this,function(o){switch(o.label){case 0:return[4,t.eosRpc.get_account(e).then(function(t){return b(u,void 0,void 0,function(){var o,i,a,s,c
return w(this,function(u){for(o=0,i=t.permissions;o<i.length;o++)for(a=i[o],s=0,c=a.required_auth.keys;s<c.length;s++)c[s].key==n&&r.accounts.push({account:e,authorization:a.perm_name})
return[2]})})})]
case 1:return o.sent(),[2]}})},a=0,s=e.account_names,f.label=1
case 1:return a<s.length?(c=s[a],[5,o(c)]):[3,4]
case 2:f.sent(),f.label=3
case 3:return a++,[3,1]
case 4:return[2,r]}})})})
r.push(s)}},a=0,s=e.keys;a<s.length;a++)c=s[a],i(c)
return[4,Promise.all(r).then(function(e){return n.keyToAccountMap=e,Promise.resolve({accountsDataObjToMerge:n})})]
case 1:return f.sent(),[2]}})})})]
case 1:return a.sent(),0,0==o.keyToAccountMap.length?o=m({},o,n):n.keyToAccountMap.forEach(function(e){o.keyToAccountMap.push(e)}),[2,Promise.resolve(o)]}})})},disconnect:c,login:function(t,r){n.updateState(function(e){return m({},e,{accountInfo:void 0,authenticated:!1,authenticationConfirmed:!1,authenticating:!0,authenticationError:!1,authenticationErrorMessage:void 0})})
var i=-1,a=void 0
if(o.keyToAccountMap.length>0&&(t&&r&&o.keyToAccountMap.forEach(function(e){e.accounts.find(function(e){return e.account==t&&e.authorization==r})&&(i=e.index,a=e.key)}),!a))throw"Loging was not able to determine the Key and Index for "+r+"@"+t
return e.login(t,r,i,a).then(function(e){return n.updateState(function(t){return m({},t,{auth:e,authenticated:!0,authenticating:!1})}),s(e.accountName)}).then(function(e){return n.updateState(function(t){return m({},t,{accountInfo:e})}),e}).catch(function(e){return n.updateState(function(t){return m({},t,{authenticating:!1,authenticationError:!0,authenticationErrorMessage:g(e)})}),Promise.reject(e)})},logout:u,fetchAccountInfo:s,terminate:function(){return u().then(c).then(function(){return t.detachWallet(f),!0})},subscribe:function(e){return n.subscribe(e)},signArbitrary:function(t,r){return e.signArbitrary(t,r)}}
return f}var k={wallets:[]}
function C(e){var t=e.appName,r=e.network,n=e.walletProviders.map(function(e){return e(r)}),o=d(k),i=[]
function a(){for(var e=0,t=i;e<t.length;e++){(0,t[e])(v)}}var s,c,u,f,l=new Map,h=o.subscribe(a),y=(c=(s=r).protocol,u=s.host,f=s.port,(c||"http")+"://"+u+(f?":"+f:"")),v={appName:t,eosRpc:new p.JsonRpc(y,{fetch:fetch}),network:r,initWallet:function(e){var t="string"==typeof e?function(e,t){if(e.length)return e.find(function(e){return e.id===t})}(n,e):e
if(!t)throw new Error("\n          Cannot initiate a session, invalid wallet provider\n          or wallet provider ID was passed\n        ")
var r=x(t,v)
return o.updateState(function(e){return{wallets:(e&&e.wallets||[]).concat([r])}}),l.set(r._instanceId,r.subscribe(a)),r},addWalletProvider:function(e){n.push(e(r))},getWalletProviders:function(){return n},getWallets:function(){var e=o.getState()
return e&&e.wallets||[]},getActiveWallets:function(){return v.getWallets().filter(function(e){return e.connected&&e.authenticated})},detachWallet:function(e){o.updateState(function(t){return{wallets:(t&&t.wallets||[]).filter(function(t){return t!==e})}})
var t=e._instanceId
if(l.has(t)){var r=l.get(t)
"function"==typeof r&&r()}},logoutAll:function(){return Promise.all(v.getWallets().map(function(e){return e.logout()})).then(function(){return!0})},disconnectAll:function(){return Promise.all(v.getWallets().map(function(e){return e.disconnect()})).then(function(){return!0})},terminateAll:function(){return Promise.all(v.getWallets().map(function(e){return e.terminate()})).then(function(){return!0})},destroy:function(){return v.terminateAll().then(function(){h(),l.forEach(function(e){"function"==typeof e&&e()}),i=[]})},subscribe:function(e){return i=i.concat([e]),function(){i=i.filter(function(t){return t!==e})}}}
return v}var A=r(26),E=r.n(A),S=r(27),O=r.n(S),T=r(24).Base64,I=function(e,t,r){return e.replace(new RegExp(t,"g"),r)},P=function(){function e(){c()(this,e)}return f()(e,null,[{key:"isNullOrEmpty",value:function(e){return!e||(null===e||(!(!Array.isArray(e)||0!==e.length)||0===Object.keys(e).length&&e.constructor===Object))}},{key:"log",value:function(e,t){0}},{key:"jwtDecodeSafe",value:function(e){var t={}
if(this.isNullOrEmpty(e))return{}
try{t=O()(e)}catch(e){}return t}},{key:"tokenHasExpired",value:function(e){var t=null
try{t=this.jwtDecodeSafe(e)}catch(e){return!0}var r=Date.now().valueOf()/1e3
return void 0!==t.exp&&t.exp<r||void 0!==t.nbf&&t.nbf>r}},{key:"urlParamsToArray",value:function(e){var t=e
if(this.isNullOrEmpty(t))return[]
t.includes("?")&&(t=t.split("?")[1])
var r=t.split(/[\/?\/$&]/),n=[]
r.length>0&&(n=r.slice(0))
var o=n.map(function(e){return(t=e.search(/[=]/),r=1,function(e){return[e.slice(0,t),e.slice(t+r)]})(e)
var t,r}),i={}
return o.forEach(function(e){i[e[0]]=decodeURIComponent(e[1])||!0}),i}},{key:"tryParseJSON",value:function(e,t){var r=e
if(!r)return null
var n=""
try{t&&(r=decodeURI(r)),n=I(r,"'",'"'),n=I(n,"`",'"')
var o=JSON.parse(n)
if(o&&"object"===E()(o))return o}catch(e){console.log(e)}return null}},{key:"base64DecodeSafe",value:function(e){var t={}
if(this.isNullOrEmpty(e))return null
try{t=T.decode(e)}catch(e){return null}return t}},{key:"sleep",value:function(e){return new Promise(function(t){return setTimeout(t,e)})}}]),e}(),U=r(28),z=r.n(U),R=r(6),B=r.n(R),F=function(){function e(){c()(this,e)}return f()(e,[{key:"getItem",value:function(e){return B.a.get(e)}},{key:"removeItem",value:function(e){B.a.remove(e)}},{key:"setItem",value:function(e,t,r){var n=z()({expires:1},r)
B.a.set(e,t,n)}}]),e}(),N=function(){function e(){c()(this,e),window?this.storage=window.localStorage:P.log("Not running in Browser. Using CookieStorage instead.")}return f()(e,[{key:"getItem",value:function(e){if(this.storage)return this.storage.getItem(e)}},{key:"removeItem",value:function(e){if(this.storage)return this.storage.removeItem(e)}},{key:"setItem",value:function(e,t,r){if(this.storage)return this.storage.setItem(e,t,r)}}]),e}(),j=function(){function e(){c()(this,e)}return f()(e,[{key:"getItem",value:function(e){return null}},{key:"removeItem",value:function(e){}},{key:"setItem",value:function(e,t,r){}}]),e}(),D=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{tryLocalStorageFirst:!0}
if(c()(this,e),this.triedLocalStorage=!1,this.triedCookieStorage=!1,!0===t.tryLocalStorageFirst){this.triedLocalStorage=!0
try{var r=new N
r&&r.storage&&(this.storage=r)}catch(e){P.log("Can't use localStorage. Using CookieStorage instead.",t)}}this.storage||(this.storage=new F,this.triedCookieStorage=!0)}return f()(e,[{key:"failover",value:function(){if(!(this.storage instanceof j)){var e=!1
this.storage instanceof N?this.triedCookieStorage||(this.storage=new F,this.triedCookieStorage=!0,e=!0):this.storage instanceof F&&(this.triedLocalStorage||(this.storage=new N,this.triedLocalStorage=!0,e=!0)),e||(this.storage=new j)}}},{key:"getItem",value:function(e){try{return this.storage.getItem(e)}catch(t){return P.log("Can't getItem in storage.",t),this.failover(),this.storage.getItem(e)}}},{key:"removeItem",value:function(e){try{return this.storage.removeItem(e)}catch(t){return P.log("Can't removeItem in storage.",t),this.failover(),this.storage.removeItem(e)}}},{key:"setItem",value:function(e,t,r){try{return this.storage.setItem(e,t,r)}catch(n){return P.log("Can't setItem in storage.",n),this.failover(),this.storage.setItem(e,t,r)}}}]),e}(),L=r(24).Base64,M={ledger:{providerId:"ledger",requiresLogin:!1,supportsDiscovery:!0},lynx:{providerId:"EOS Lynx",requiresLogin:!1,supportsDiscovery:!1},meetone:{providerId:"meetone_provider",requiresLogin:!1,supportsDiscovery:!1},metro:{providerId:"metro",requiresLogin:!1,supportsDiscovery:!1},scatter:{providerId:"scatter",requiresLogin:!0,supportsDiscovery:!1},tokenpocket:{providerId:"TokenPocket",requiresLogin:!1,supportsDiscovery:!1}},q=function(){function e(t){c()(this,e),this.options=null,this.appAccessToken=null,this.user=null,this.storage=new D,this.validateOptions(t),this.chainContexts={},this.chainNetworks=[],this.init()}return f()(e,[{key:"init",value:function(){var e=a()(o.a.mark(function e(){var t
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getConfigFromApi("chains")
case 2:t=e.sent,this.chainNetworks=t.chains
case 4:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()},{key:"getOrCreateChainContext",value:function(e){var t=this.options,r=t.appName,n=t.eosTransitWalletProviders,o=void 0===n?[]:n
if(this.chainContexts[e])return this.chainContexts[e]
var i=this.chainNetworks.find(function(t){return t.network===e})
if(!i)throw new Error("Invalid chain network: ".concat(e,"."))
var a=i.hosts[0],s=a.chainId,c=C({appName:r||"missing appName",network:{host:a.host,port:a.port,protocol:a.protocol,chainId:s},walletProviders:o})
return this.chainContexts[e]=c,c}},{key:"callPasswordlessApi",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,p,d,y=arguments
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=y.length>1&&void 0!==y[1]&&y[1],n=t.provider,i=t.phone,a=t.email,s=t.code,c=this.options,u=c.apiKey,f=c.oreIdUrl,n&&(i||a)&&(!r||s)){e.next=5
break}throw new Error("Missing a required parameter")
case 5:return l="send",r&&(l="verify"),p="".concat(f,"/api/account/login-passwordless-").concat(l,"-code?login-type=").concat(n),a&&(p+="&email=".concat(a)),i&&(p+="&phone=".concat(i)),r&&(p+="&code=".concat(s)),d=null,e.prev=12,e.next=15,h.a.get(p,{headers:{"api-key":u}})
case 15:d=e.sent,e.next=21
break
case 18:e.prev=18,e.t0=e.catch(12),d=e.t0.response
case 21:return e.abrupt("return",d.data)
case 22:case"end":return e.stop()}},e,this,[[12,18]])}))
return function(t){return e.apply(this,arguments)}}()},{key:"passwordlessSendCodeApi",value:function(){var e=a()(o.a.mark(function e(t){var r
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r={},e.prev=1,e.next=4,this.callPasswordlessApi(t)
case 4:r=e.sent,e.next=10
break
case 7:return e.prev=7,e.t0=e.catch(1),e.abrupt("return",{error:e.t0})
case 10:return e.abrupt("return",r)
case 11:case"end":return e.stop()}},e,this,[[1,7]])}))
return function(t){return e.apply(this,arguments)}}()},{key:"passwordlessVerifyCodeApi",value:function(){var e=a()(o.a.mark(function e(t){var r
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r={},e.prev=1,e.next=4,this.callPasswordlessApi(t,!0)
case 4:r=e.sent,e.next=10
break
case 7:return e.prev=7,e.t0=e.catch(1),e.abrupt("return",{error:e.t0})
case 10:return e.abrupt("return",r)
case 11:case"end":return e.stop()}},e,this,[[1,7]])}))
return function(t){return e.apply(this,arguments)}}()},{key:"login",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=t.provider,n=t.chainNetwork,i=void 0===n?"eos_main":n,e.t0=r,e.next="ledger"===e.t0?4:"lynx"===e.t0?5:"meetone"===e.t0?6:"metro"===e.t0?7:"scatter"===e.t0?8:"tokenpocket"===e.t0?9:10
break
case 4:case 5:case 6:return e.abrupt("return",this.connectToTransitProvider(r,i))
case 7:throw new Error("Not Implemented")
case 8:case 9:return e.abrupt("return",this.connectToTransitProvider(r,i))
case 10:return e.abrupt("return",this.loginWithOreId(t))
case 11:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"sign",value:function(){var e=a()(o.a.mark(function e(t){var r
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=t.provider,e.t0=r,e.next="lynx"===e.t0?4:"ledger"===e.t0?5:"meetone"===e.t0?6:"metro"===e.t0?7:"scatter"===e.t0?8:"tokenpocket"===e.t0?9:10
break
case 4:case 5:case 6:return e.abrupt("return",this.signWithTransitProvider(t))
case 7:return e.abrupt("break",11)
case 8:case 9:return e.abrupt("return",this.signWithTransitProvider(t))
case 10:return e.abrupt("return",this.signWithOreId(t))
case 11:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"discover",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.provider,n=t.chainNetwork,i=void 0===n?"eos_main":n,a=t.discoveryPathIndexList,this.assertValidProvider(r),!this.canDiscover(r)){e.next=4
break}return e.abrupt("return",this.discoverCredentialsInWallet(i,r,a))
case 4:throw new Error("Discover not support for provider: ".concat(r))
case 5:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"assertValidProvider",value:function(e){if(M[e])return!0
throw new Error("Provider ".concat(e," is not a valid option"))}},{key:"canDiscover",value:function(e){return!0===M[e].supportsDiscovery}},{key:"loginWithOreId",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.code,n=t.email,i=t.phone,a=t.provider,s=t.state,c=this.options,u=c.authCallbackUrl,f=c.backgroundColor,l={code:r,email:n,phone:i,provider:a,backgroundColor:f,callbackUrl:u,state:s},e.next=5,this.getOreIdAuthUrl(l)
case 5:return h=e.sent,e.abrupt("return",{loginUrl:h,errors:null})
case 7:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"signWithOreId",value:function(){var e=a()(o.a.mark(function e(t){var r,n
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=this.options.signCallbackUrl,t.callbackUrl=r,e.next=4,this.getOreIdSignUrl(t)
case 4:return n=e.sent,e.abrupt("return",{signUrl:n,errors:null})
case 6:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"signWithTransitProvider",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.broadcast,n=t.chainNetwork,i=t.transaction,a=t.provider,e.next=3,this.connectToTransitProvider(a,n)
case 3:return s=e.sent,c=s.transitWallet,e.prev=5,this.setIsBusy(!0),e.next=9,c.eosApi.transact({actions:[i]},{broadcast:r,blocksBehind:3,expireSeconds:60})
case 9:s=e.sent,e.next=15
break
case 12:throw e.prev=12,e.t0=e.catch(5),e.t0
case 15:return e.prev=15,this.setIsBusy(!1),e.finish(15)
case 18:return e.abrupt("return",{signedTransaction:s})
case 19:case"end":return e.stop()}},e,this,[[5,12,15,18]])}))
return function(t){return e.apply(this,arguments)}}()},{key:"connectToTransitProvider",value:function(){var e=a()(o.a.mark(function e(t,r){var n,i,a,s,c,u,f,l,h,p,d,y,v,g,m,b
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={},i=M[t].providerId,a=this.getOrCreateChainContext(r),s=a.getWalletProviders().find(function(e){return e.id===i}),c=a.initWallet(s),e.prev=5,e.next=8,c.connect()
case 8:return e.next=10,this.waitWhileWalletIsBusy(c,t)
case 10:if(!0!==M[t].requiresLogin){e.next=18
break}if(!c||!0===c.authenticated){e.next=16
break}return e.next=14,c.login()
case 14:return e.next=16,this.waitWhileWalletIsBusy(c,t)
case 16:if(c&&!0===c.authenticated){e.next=18
break}throw new Error("Couldn't connect to ".concat(t))
case 18:if(n.transitWallet=c,!c.connected){e.next=23
break}c.authenticated&&(u=c.auth,f=u.accountName,l=u.permission,h=u.publicKey,n={isLoggedIn:c.authenticated,account:f,permissions:[{name:l,publicKey:h}],provider:t,transitWallet:c}),e.next=25
break
case 23:throw p=c.hasError,d=c.errorMessage,new Error("".concat(t," not connected!").concat(p)?" Error: ".concat(d):"")
case 25:if(!(y=(this.user||{}).accountName)){e.next=31
break}return g=(v=n).account,m=v.permissions,b=this.getChainNetworkFromTransitWallet(c),e.next=31,this.addWalletPermissionstoOreIdAccount(g,b,m,y,t)
case 31:e.next=37
break
case 33:throw e.prev=33,e.t0=e.catch(5),console.log("Failed to connect to ".concat(t," wallet:"),e.t0),e.t0
case 37:return e.prev=37,this.setIsBusy(!1),e.finish(37)
case 40:return e.abrupt("return",n)
case 41:case"end":return e.stop()}},e,this,[[5,33,37,40]])}))
return function(t,r){return e.apply(this,arguments)}}()},{key:"waitWhileWalletIsBusy",value:function(){var e=a()(o.a.mark(function e(t,r){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.inProgress){e.next=7
break}return this.setIsBusy(!0),e.next=4,P.sleep(250)
case 4:console.log("connecting to ".concat(r," via eos-transit wallet in progress:"),t.inProgress),e.next=0
break
case 7:this.setIsBusy(!1)
case 8:case"end":return e.stop()}},e,this)}))
return function(t,r){return e.apply(this,arguments)}}()},{key:"getChainNetworkFromTransitWallet",value:function(e){var t
if(e&&e.eosApi){var r=e.eosApi.chainId,n=this.chainNetworks.find(function(e){return e.hosts.find(function(e){return e.chainId===r})})
P.isNullOrEmpty(n)||(t=n.network)}return t}},{key:"discoverCredentialsInWallet",value:function(){var e=a()(o.a.mark(function e(t,r){var n,i,s,c,u,f,l,h,p=this,d=arguments
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=d.length>2&&void 0!==d[2]?d[2]:[0,1,2,3,4,5,6,7,8,9],i=[],e.prev=2,e.next=5,this.connectToTransitProvider(r,t)
case 5:if(c=e.sent,u=c.transitWallet){e.next=9
break}return e.abrupt("return",i)
case 9:return this.setIsBusy(!0),e.next=12,u.discover({pathIndexList:n})
case 12:return f=e.sent,l=(this.user||{}).accountName,h=f.keyToAccountMap,e.next=17,h.forEach(function(){var e=a()(o.a.mark(function e(t){var n,a,c,f,h,d
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.accounts,!((a=void 0===n?[]:n).length>0)){e.next=8
break}return c=a[0],f=c.account,h=c.authorization,s=[{account:f,publicKey:t.key,name:h,parent:null}],d=p.getChainNetworkFromTransitWallet(u),e.next=7,p.addWalletPermissionstoOreIdAccount(f,d,s,l,r)
case 7:i=i.concat(s)
case 8:case"end":return e.stop()}},e)}))
return function(t){return e.apply(this,arguments)}}())
case 17:e.next=22
break
case 19:throw e.prev=19,e.t0=e.catch(2),e.t0
case 22:return e.prev=22,this.setIsBusy(!1),e.finish(22)
case 25:return e.abrupt("return",i)
case 26:case"end":return e.stop()}},e,this,[[2,19,22,25]])}))
return function(t,r){return e.apply(this,arguments)}}()},{key:"setIsBusy",value:function(e){this.isBusy!==e&&(this.isBusy=e,this.options.setBusyCallback&&this.options.setBusyCallback(e))}},{key:"addWalletPermissionstoOreIdAccount",value:function(){var e=a()(o.a.mark(function e(t,r,n,i,s){var c=this
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(P.isNullOrEmpty(i)||P.isNullOrEmpty(n)||P.isNullOrEmpty(r))){e.next=2
break}return e.abrupt("return")
case 2:return e.next=4,n.map(function(){var e=a()(o.a.mark(function e(n){var a,u,f
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=n.name,(u=n.parent)||(u="active","owner"===a?u="":"active"===a&&(u="owner")),!0===c.user.permissions.some(function(e){return e.chainAccount===t&&e.chainNetwork===r&&e.permission===a||"owner"===a})){e.next=8
break}return f=n.publicKey,e.next=8,c.addPermission(i,t,r,f,u,a,s)
case 8:case"end":return e.stop()}},e)}))
return function(t){return e.apply(this,arguments)}}())
case 4:return e.next=6,this.getUserInfoFromApi(i)
case 6:case"end":return e.stop()}},e,this)}))
return function(t,r,n,o,i){return e.apply(this,arguments)}}()},{key:"validateOptions",value:function(e){var t=""
if(e.appId||(t+="\n --\x3e Missing required parameter - appId. You can get an appId when you register your app with ORE ID."),e.apiKey||(t+="\n --\x3e Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID."),e.oreIdUrl||(t+="\n --\x3e Missing required parameter - oreIdUrl. Refer to the docs to get this value."),""!==t)throw new Error("Options are missing or invalid. ".concat(t))
this.options=e}},{key:"getUser",value:function(){var e=a()(o.a.mark(function e(t){var r,n
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=5
break}return e.next=3,this.getUserInfoFromApi(t)
case 3:return r=e.sent,e.abrupt("return",r)
case 5:if(!this.user){e.next=7
break}return e.abrupt("return",this.user)
case 7:return n=this.loadUserLocally(),e.abrupt("return",n)
case 9:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getConfig",value:function(){var e=a()(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.getConfigFromApi(t))
case 1:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getAccessToken",value:function(){var e=a()(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.appAccessToken&&!P.tokenHasExpired(this.appAccessToken)){e.next=3
break}return e.next=3,this.getNewAppAccessToken()
case 3:return e.abrupt("return",this.appAccessToken)
case 4:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()},{key:"getOreIdAuthUrl",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h,p,d,y
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.code,n=t.email,i=t.phone,a=t.provider,s=t.callbackUrl,c=t.backgroundColor,u=t.state,f=this.options.oreIdUrl,a&&s){e.next=4
break}throw new Error("Missing a required parameter")
case 4:return e.next=6,this.getAccessToken()
case 6:return l=e.sent,h=u?"&state=".concat(L.encode(JSON.stringify(u))):"",p=r?"&code=".concat(r):"",d=n?"&email=".concat(n):"",y=i?"&phone=".concat(i):"",e.abrupt("return","".concat(f,"/auth#app_access_token=").concat(l,"&provider=").concat(a)+"".concat(p).concat(d).concat(y)+"&callback_url=".concat(encodeURIComponent(s),"&background_color=").concat(c).concat(h))
case 12:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getOreIdSignUrl",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h,p,d
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.account,n=t.broadcast,i=t.callbackUrl,a=t.chainNetwork,s=t.state,c=t.transaction,u=t.accountIsTransactionPermission,f=t.chainAccount,l=this.options.oreIdUrl,r&&i&&c){e.next=5
break}throw new Error("Missing a required parameter")
case 5:return f||(f=r),e.next=8,this.getAccessToken()
case 8:return h=e.sent,p=L.encode(JSON.stringify(c)),d=s?"&state=".concat(L.encode(JSON.stringify(s))):"",d+=u?"&account_is_transaction_permission=".concat(u):"",e.abrupt("return","".concat(l,"/sign#app_access_token=").concat(h,"&account=").concat(r,"&broadcast=").concat(n,"&callback_url=").concat(encodeURIComponent(i),"&chain_account=").concat(f,"&chain_network=").concat(a,"&transaction=").concat(p).concat(d))
case 13:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"handleAuthResponse",value:function(e){var t=P.urlParamsToArray(e),r=t.account,n=t.state,o=this.getErrorCodesFromParams(t)
return this.setIsBusy(!1),{account:r,state:n,errors:o}}},{key:"handleSignResponse",value:function(e){var t,r=P.urlParamsToArray(e),n=r.signed_transaction,o=r.state,i=this.getErrorCodesFromParams(r)
return i||(t=P.tryParseJSON(P.base64DecodeSafe(n))),this.setIsBusy(!1),{signedTransaction:t,state:o,errors:i}}},{key:"getNewAppAccessToken",value:function(){var e=a()(o.a.mark(function e(){var t,r
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.callOreIdApi("app-token")
case 2:t=e.sent,r=t.appAccessToken,this.appAccessToken=r
case 5:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()},{key:"getUserInfoFromApi",value:function(){var e=a()(o.a.mark(function e(t){var r,n
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.callOreIdApi("account/user?account=".concat(t))
case 2:return r=e.sent,n=r,this.saveUserLocally(n),e.next=7,this.loadUserLocally()
case 7:return e.abrupt("return",n)
case 8:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getConfigFromApi",value:function(){var e=a()(o.a.mark(function e(t){var r,n
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2
break}throw new Error("Missing a required parameter: configType")
case 2:return e.next=4,this.callOreIdApi("services/config?type=".concat(t))
case 4:if(r=e.sent,n=(r||{}).values){e.next=9
break}throw new Error("Not able to retrieve config values for ".concat(t))
case 9:return e.abrupt("return",n)
case 10:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"addPermission",value:function(){var e=a()(o.a.mark(function e(t,r,n,i,a,s,c){var u
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return u=c?"&wallet-type=".concat(c):"",u+=a?"&parent-permission=".concat(a):"",e.next=4,this.callOreIdApi("account/add-permission?account=".concat(t,"&chain-account=").concat(r,"&chain-network=").concat(n,"&permission=").concat(s,"&public-key=").concat(i).concat(u))
case 4:case"end":return e.stop()}},e,this)}))
return function(t,r,n,o,i,a,s){return e.apply(this,arguments)}}()},{key:"getUserWalletInfo",value:function(){var e=a()(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:throw Error("Not Implemented")
case 1:case"end":return e.stop()}},e)}))
return function(t){return e.apply(this,arguments)}}()},{key:"callOreIdApi",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=this.options,n=r.apiKey,i=r.oreIdUrl,a="".concat(i,"/api/").concat(t),e.next=4,h.a.get(a,{headers:{"api-key":n}})
case 4:if(s=e.sent,!(c=s.error)){e.next=8
break}throw new Error(c)
case 8:return e.abrupt("return",s.data)
case 9:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getErrorCodesFromParams",value:function(e){var t,r=e.error_code,n=e.error_message
return r&&(t=r.split(/[\/?\/$&]/)),(t||n)&&(t=t||[]).push(n),t}},{key:"logout",value:function(){this.clearLocalState()}},{key:"userKey",value:function(){return"oreid.".concat(this.options.appId,".user")}},{key:"saveUserLocally",value:function(e){if(!P.isNullOrEmpty(e)){this.user=e
var t=JSON.stringify(this.user)
this.storage.setItem(this.userKey(),t)}}},{key:"loadUserLocally",value:function(){var e=this.storage.getItem(this.userKey())
return P.isNullOrEmpty(e)?(this.user=null,null):(this.user=JSON.parse(e),this.user)}},{key:"clearLocalState",value:function(){var e=a()(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.storage.removeItem(this.userKey())
case 1:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()}]),e}(),K=function(e){return function(t,r,n){Promise.resolve(e(t,r,n)).catch(n)}}
function W(e){return K(function(){var t=a()(o.a.mark(function t(r,n,i){var a,s,c,u,f
return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(r.query){t.next=3
break}return t.abrupt("return",{})
case 3:if(e.errors=null,a=e.handleAuthResponse(r.originalUrl),s=a.account,!(c=a.errors)){t.next=10
break}return e.errors=c,u=new Error("Errors Processing auth callback: ".concat(c.join(", "))),t.abrupt("return",i(u))
case 10:if(!s){t.next=16
break}return t.next=13,e.getUserInfoFromApi(s)
case 13:f=t.sent,r.user=f,r.appId=e.appId
case 16:return t.abrupt("return",i())
case 17:case"end":return t.stop()}},t)}))
return function(e,r,n){return t.apply(this,arguments)}}())}function V(e){return K(function(){var t=a()(o.a.mark(function t(r,n,i){var a,s,c,u,f
return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(a=r.body){t.next=3
break}return t.abrupt("return",{})
case 3:if(e.errors=null,s=e.handleSignResponse(a),c=s.signedTransaction,!(u=s.errors)){t.next=9
break}return e.errors=u,f=new Error("Errors Processing sign callback: ".concat(u.join(", "))),t.abrupt("return",i(f))
case 9:return c&&(r.signedTransaction=c,r.appId=e.appId),t.abrupt("return",i())
case 11:case"end":return t.stop()}},t)}))
return function(e,r,n){return t.apply(this,arguments)}}())}r.d(t,"asyncHandler",function(){return K}),r.d(t,"authCallbackHandler",function(){return W}),r.d(t,"OreId",function(){return q}),r.d(t,"signCallbackHandler",function(){return V})}])})
