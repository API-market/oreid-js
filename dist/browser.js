!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["eos-auth"]=t():e["eos-auth"]=t()}(window,function(){return function(e){var t={}
function r(n){if(t[n])return t[n].exports
var o=t[n]={i:n,l:!1,exports:{}}
return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e
if(4&t&&"object"==typeof e&&e&&e.__esModule)return e
var n=Object.create(null)
if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o))
return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e}
return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=55)}([function(e,t,r){e.exports=r(22)},function(e,t){function r(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}e.exports=function(e){return function(){var t=this,n=arguments
return new Promise(function(o,i){var a=e.apply(t,n)
function s(e){r(a,o,i,s,c,"next",e)}function c(e){r(a,o,i,s,c,"throw",e)}s(void 0)})}}},function(e,t,r){"use strict"
var n=r(11),o=r(24),i=Object.prototype.toString
function a(e){return"[object Array]"===i.call(e)}function s(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===i.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),a(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e)
else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:a,isArrayBuffer:function(e){return"[object ArrayBuffer]"===i.call(e)},isBuffer:o,isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===i.call(e)},isFile:function(e){return"[object File]"===i.call(e)},isBlob:function(e){return"[object Blob]"===i.call(e)},isFunction:c,isStream:function(e){return s(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:u,merge:function e(){var t={}
function r(r,n){"object"==typeof t[n]&&"object"==typeof r?t[n]=e(t[n],r):t[n]=r}for(var n=0,o=arguments.length;n<o;n++)u(arguments[n],r)
return t},extend:function(e,t,r){return u(t,function(t,o){e[o]=r&&"function"==typeof t?n(t,r):t}),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}},function(e,t,r){e.exports=r(23)},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})
var n=r(42)
t.Api=n.Api
var o=r(46)
t.ApiInterfaces=o
var i=r(47)
t.JsonRpc=i.JsonRpc
var a=r(9)
t.Numeric=a
var s=r(48)
t.RpcInterfaces=s
var c=r(18)
t.RpcError=c.RpcError
var u=r(16)
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
break}t||(a[y]=d)}catch(e){}}return a}}return n.set=n,n.get=function(e){return n.call(n,e)},n.getJSON=function(){return n.apply({json:!0},[].slice.call(arguments))},n.defaults={},n.remove=function(t,r){n(t,"",e(r,{expires:-1}))},n.withConverter=t,n}(function(){})})},function(e,t,r){"use strict";(function(t){var n=r(2),o=r(27),i={"Content-Type":"application/x-www-form-urlencoded"}
function a(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var s,c={adapter:("undefined"!=typeof XMLHttpRequest?s=r(12):void 0!==t&&(s=r(12)),s),transformRequest:[function(e,t){return o(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(a(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(a(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}}
c.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],function(e){c.headers[e]={}}),n.forEach(["post","put","patch"],function(e){c.headers[e]=n.merge(i)}),e.exports=c}).call(this,r(26))},function(e,t,r){"use strict"
var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator]
if(!r)return e
var n,o,i=r.call(e),a=[]
try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(n(arguments[t]))
return e},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],r=0
return t?t.call(e):{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}}}
Object.defineProperty(t,"__esModule",{value:!0})
var a=r(43).RIPEMD160.hash,s="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
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
throw new Error("unrecognized signature format")}},function(e,t){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(t){return"function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?e.exports=n=function(e){return r(e)}:e.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":r(e)},n(t)}e.exports=n},function(e,t,r){"use strict"
e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n]
return e.apply(t,r)}}},function(e,t,r){"use strict"
var n=r(2),o=r(28),i=r(30),a=r(31),s=r(32),c=r(13),u="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||r(33)
e.exports=function(e){return new Promise(function(t,f){var l=e.data,h=e.headers
n.isFormData(l)&&delete h["Content-Type"]
var p=new XMLHttpRequest,d="onreadystatechange",y=!1
if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in p||s(e.url)||(p=new window.XDomainRequest,d="onload",y=!0,p.onprogress=function(){},p.ontimeout=function(){}),e.auth){var v=e.auth.username||"",g=e.auth.password||""
h.Authorization="Basic "+u(v+":"+g)}if(p.open(e.method.toUpperCase(),i(e.url,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p[d]=function(){if(p&&(4===p.readyState||y)&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in p?a(p.getAllResponseHeaders()):null,n={data:e.responseType&&"text"!==e.responseType?p.response:p.responseText,status:1223===p.status?204:p.status,statusText:1223===p.status?"No Content":p.statusText,headers:r,config:e,request:p}
o(t,f,n),p=null}},p.onerror=function(){f(c("Network Error",e,null,p)),p=null},p.ontimeout=function(){f(c("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",p)),p=null},n.isStandardBrowserEnv()){var m=r(34),b=(e.withCredentials||s(e.url))&&e.xsrfCookieName?m.read(e.xsrfCookieName):void 0
b&&(h[e.xsrfHeaderName]=b)}if("setRequestHeader"in p&&n.forEach(h,function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete h[t]:p.setRequestHeader(t,e)}),e.withCredentials&&(p.withCredentials=!0),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){p&&(p.abort(),f(e),p=null)}),void 0===l&&(l=null),p.send(l)})}},function(e,t,r){"use strict"
var n=r(29)
e.exports=function(e,t,r,o,i){var a=new Error(e)
return n(a,t,r,o,i)}},function(e,t,r){"use strict"
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
r.skippedBinaryExtension=!0}}}catch(e){o={error:e}}finally{try{u&&!u.done&&(i=s.return)&&i.call(s)}finally{if(o)throw o.error}}}function A(e,t,r){var n,o,i
void 0===t&&(t=new c),void 0===r&&(r=!0),i=this.base?this.base.deserialize(e,t,r):{}
try{for(var s=a(this.fields),u=s.next();!u.done;u=s.next()){var f=u.value
r&&f.type.extensionOf&&!e.haveReadData()?t.skippedBinaryExtension=!0:i[f.name]=f.type.deserialize(e,t,r)}}catch(e){n={error:e}}finally{try{u&&!u.done&&(o=s.return)&&o.call(s)}finally{if(n)throw n.error}}return i}function E(e,t,r,n){if(!Array.isArray(t)||2!==t.length||"string"!=typeof t[0])throw new Error('expected variant: ["type", value]')
var o=this.fields.findIndex(function(e){return e.name===t[0]})
if(o<0)throw new Error('type "'+t[0]+'" is not valid for variant')
e.pushVaruint32(o),this.fields[o].type.serialize(e,t[1],r,n)}function S(e,t,r){var n=e.getVaruint32()
if(n>=this.fields.length)throw new Error("type index "+n+" is not valid for variant")
var o=this.fields[n]
return[o.name,o.type.deserialize(e,t,r)]}function C(e,t,r,n){var o,i
e.pushVaruint32(t.length)
try{for(var s=a(t),c=s.next();!c.done;c=s.next()){var u=c.value
this.arrayOf.serialize(e,u,r,!1)}}catch(e){o={error:e}}finally{try{c&&!c.done&&(i=s.return)&&i.call(s)}finally{if(o)throw o.error}}}function T(e,t,r){for(var n=e.getVaruint32(),o=[],i=0;i<n;++i)o.push(this.arrayOf.deserialize(e,t,!1))
return o}function I(e,t,r,n){null==t?e.push(0):(e.push(1),this.optionalOf.serialize(e,t,r,n))}function U(e,t,r){return e.get()?this.optionalOf.deserialize(e,t,r):null}function O(e,t,r,n){this.extensionOf.serialize(e,t,r,n)}function P(e,t,r){return this.extensionOf.deserialize(e,t,r)}function z(e){return n({name:"<missing name>",aliasOfName:"",arrayOf:null,optionalOf:null,extensionOf:null,baseName:"",base:null,fields:[],serialize:_,deserialize:x},e)}function N(e,t){if(Number.isNaN(+e)||Number.isNaN(+t)||"number"!=typeof e&&"string"!=typeof e)throw new Error("Expected number")
if(+e!=+t)throw new Error("Number is out of range")
return+e}function D(e,t){var r=e.get(t)
if(r&&r.aliasOfName)return D(e,r.aliasOfName)
if(r)return r
if(t.endsWith("[]"))return z({name:t,arrayOf:D(e,t.substr(0,t.length-2)),serialize:C,deserialize:T})
if(t.endsWith("?"))return z({name:t,optionalOf:D(e,t.substr(0,t.length-1)),serialize:I,deserialize:U})
if(t.endsWith("$"))return z({name:t,extensionOf:D(e,t.substr(0,t.length-1)),serialize:O,deserialize:P})
throw new Error("Unknown type: "+t)}function R(e,t,r,n,o,i){var a=e.actions.get(r)
if(!a)throw new Error("Unknown action "+r+" in contract "+t)
var s=new u({textEncoder:o,textDecoder:i})
return a.serialize(s,n),b(s.asUint8Array())}function B(e,t,r,n,o,i){var a=e.actions.get(r)
if("string"==typeof n&&(n=w(n)),!a)throw new Error("Unknown action "+r+" in contract "+t)
var s=new u({textDecoder:i,textEncoder:o})
return s.pushArray(n),a.deserialize(s)}t.SerialBuffer=u,t.supportedAbiVersion=function(e){return e.startsWith("eosio::abi/1.")},t.dateToTimePoint=l,t.timePointToDate=h,t.dateToTimePointSec=p,t.timePointSecToDate=d,t.dateToBlockTimestamp=y,t.blockTimestampToDate=v,t.stringToSymbol=g,t.symbolToString=m,t.arrayToHex=b,t.hexToUint8Array=w,t.createInitialTypes=function(){var e=new Map(Object.entries({bool:z({name:"bool",serialize:function(e,t){if("boolean"!=typeof t)throw new Error("Expected true or false")
e.push(t?1:0)},deserialize:function(e){return!!e.get()}}),uint8:z({name:"uint8",serialize:function(e,t){e.push(N(t,255&t))},deserialize:function(e){return e.get()}}),int8:z({name:"int8",serialize:function(e,t){e.push(N(t,t<<24>>24))},deserialize:function(e){return e.get()<<24>>24}}),uint16:z({name:"uint16",serialize:function(e,t){e.pushUint16(N(t,65535&t))},deserialize:function(e){return e.getUint16()}}),int16:z({name:"int16",serialize:function(e,t){e.pushUint16(N(t,t<<16>>16))},deserialize:function(e){return e.getUint16()<<16>>16}}),uint32:z({name:"uint32",serialize:function(e,t){e.pushUint32(N(t,t>>>0))},deserialize:function(e){return e.getUint32()}}),uint64:z({name:"uint64",serialize:function(e,t){e.pushArray(s.decimalToBinary(8,""+t))},deserialize:function(e){return s.binaryToDecimal(e.getUint8Array(8))}}),int64:z({name:"int64",serialize:function(e,t){e.pushArray(s.signedDecimalToBinary(8,""+t))},deserialize:function(e){return s.signedBinaryToDecimal(e.getUint8Array(8))}}),int32:z({name:"int32",serialize:function(e,t){e.pushUint32(N(t,0|t))},deserialize:function(e){return 0|e.getUint32()}}),varuint32:z({name:"varuint32",serialize:function(e,t){e.pushVaruint32(N(t,t>>>0))},deserialize:function(e){return e.getVaruint32()}}),varint32:z({name:"varint32",serialize:function(e,t){e.pushVarint32(N(t,0|t))},deserialize:function(e){return e.getVarint32()}}),uint128:z({name:"uint128",serialize:function(e,t){e.pushArray(s.decimalToBinary(16,""+t))},deserialize:function(e){return s.binaryToDecimal(e.getUint8Array(16))}}),int128:z({name:"int128",serialize:function(e,t){e.pushArray(s.signedDecimalToBinary(16,""+t))},deserialize:function(e){return s.signedBinaryToDecimal(e.getUint8Array(16))}}),float32:z({name:"float32",serialize:function(e,t){e.pushFloat32(t)},deserialize:function(e){return e.getFloat32()}}),float64:z({name:"float64",serialize:function(e,t){e.pushFloat64(t)},deserialize:function(e){return e.getFloat64()}}),float128:z({name:"float128",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),16)},deserialize:function(e){return b(e.getUint8Array(16))}}),bytes:z({name:"bytes",serialize:function(e,t){t instanceof Uint8Array||Array.isArray(t)?e.pushBytes(t):e.pushBytes(w(t))},deserialize:function(e,t){return t&&t.options.bytesAsUint8Array?e.getBytes():b(e.getBytes())}}),string:z({name:"string",serialize:function(e,t){e.pushString(t)},deserialize:function(e){return e.getString()}}),name:z({name:"name",serialize:function(e,t){e.pushName(t)},deserialize:function(e){return e.getName()}}),time_point:z({name:"time_point",serialize:function(e,t){e.pushNumberAsUint64(l(t))},deserialize:function(e){return h(e.getUint64AsNumber())}}),time_point_sec:z({name:"time_point_sec",serialize:function(e,t){e.pushUint32(p(t))},deserialize:function(e){return d(e.getUint32())}}),block_timestamp_type:z({name:"block_timestamp_type",serialize:function(e,t){e.pushUint32(y(t))},deserialize:function(e){return v(e.getUint32())}}),symbol_code:z({name:"symbol_code",serialize:function(e,t){e.pushSymbolCode(t)},deserialize:function(e){return e.getSymbolCode()}}),symbol:z({name:"symbol",serialize:function(e,t){e.pushSymbol(g(t))},deserialize:function(e){return m(e.getSymbol())}}),asset:z({name:"asset",serialize:function(e,t){e.pushAsset(t)},deserialize:function(e){return e.getAsset()}}),checksum160:z({name:"checksum160",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),20)},deserialize:function(e){return b(e.getUint8Array(20))}}),checksum256:z({name:"checksum256",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),32)},deserialize:function(e){return b(e.getUint8Array(32))}}),checksum512:z({name:"checksum512",serialize:function(e,t){e.pushUint8ArrayChecked(w(t),64)},deserialize:function(e){return b(e.getUint8Array(64))}}),public_key:z({name:"public_key",serialize:function(e,t){e.pushPublicKey(t)},deserialize:function(e){return e.getPublicKey()}}),private_key:z({name:"private_key",serialize:function(e,t){e.pushPrivateKey(t)},deserialize:function(e){return e.getPrivateKey()}}),signature:z({name:"signature",serialize:function(e,t){e.pushSignature(t)},deserialize:function(e){return e.getSignature()}})}))
return e.set("extended_asset",z({name:"extended_asset",baseName:"",fields:[{name:"quantity",typeName:"asset",type:e.get("asset")},{name:"contract",typeName:"name",type:e.get("name")}],serialize:k,deserialize:A})),e},t.getType=D,t.getTypesFromAbi=function(e,t){var r,n,i,s,c,u,f,l,h,p,d=new Map(e)
if(t.types)try{for(var y=a(t.types),v=y.next();!v.done;v=y.next()){var g=v.value,m=g.new_type_name,b=g.type
d.set(m,z({name:m,aliasOfName:b}))}}catch(e){r={error:e}}finally{try{v&&!v.done&&(n=y.return)&&n.call(y)}finally{if(r)throw r.error}}if(t.structs)try{for(var w=a(t.structs),_=w.next();!_.done;_=w.next()){var x=_.value,C=x.name,T=x.base,I=x.fields
d.set(C,z({name:C,baseName:T,fields:I.map(function(e){return{name:e.name,typeName:e.type,type:null}}),serialize:k,deserialize:A}))}}catch(e){i={error:e}}finally{try{_&&!_.done&&(s=w.return)&&s.call(w)}finally{if(i)throw i.error}}if(t.variants)try{for(var U=a(t.variants),O=U.next();!O.done;O=U.next()){var P=O.value,N=P.name,R=P.types
d.set(N,z({name:N,fields:R.map(function(e){return{name:e,typeName:e,type:null}}),serialize:E,deserialize:S}))}}catch(e){c={error:e}}finally{try{O&&!O.done&&(u=U.return)&&u.call(U)}finally{if(c)throw c.error}}try{for(var B=a(d),j=B.next();!j.done;j=B.next()){var L=o(j.value,2)
L[0],(b=L[1]).baseName&&(b.base=D(d,b.baseName))
try{for(var F=a(b.fields),K=F.next();!K.done;K=F.next()){var M=K.value
M.type=D(d,M.typeName)}}catch(e){h={error:e}}finally{try{K&&!K.done&&(p=F.return)&&p.call(F)}finally{if(h)throw h.error}}}}catch(e){f={error:e}}finally{try{j&&!j.done&&(l=B.return)&&l.call(B)}finally{if(f)throw f.error}}return d},t.transactionHeader=function(e,t){return{expiration:d(p(e.timestamp)+t),ref_block_num:65535&e.block_num,ref_block_prefix:e.ref_block_prefix}},t.serializeActionData=R,t.serializeAction=function(e,t,r,n,o,i,a){return{account:t,name:r,authorization:n,data:R(e,t,r,o,i,a)}},t.deserializeActionData=B,t.deserializeAction=function(e,t,r,n,o,i,a){return{account:t,name:r,authorization:n,data:B(e,t,r,o,i,a)}}},function(e,t){var r
r=function(){return this}()
try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict"
var n,o=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)})
Object.defineProperty(t,"__esModule",{value:!0})
var i=function(e){function t(r){var n=this
return n=r.error&&r.error.details&&r.error.details.length&&r.error.details[0].message?e.call(this,r.error.details[0].message)||this:r.processed&&r.processed.except&&r.processed.except.message?e.call(this,r.processed.except.message)||this:e.call(this,r.message)||this,Object.setPrototypeOf(n,t.prototype),n.json=r,n}return o(t,e),t}(Error)
t.RpcError=i},function(e,t,r){var n=r(49),o=r(50)
e.exports=function(e,t,r){var i=t&&r||0
"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null)
var a=(e=e||{}).random||(e.rng||n)()
if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t)for(var s=0;s<16;++s)t[i+s]=a[s]
return t||o(a)}},function(e,t,r){"use strict"
var n=r(51)
function o(e){this.message=e}o.prototype=new Error,o.prototype.name="InvalidTokenError",e.exports=function(e,t){if("string"!=typeof e)throw new o("Invalid token specified")
var r=!0===(t=t||{}).header?0:1
try{return JSON.parse(n(e.split(".")[r]))}catch(e){throw new o("Invalid token specified: "+e.message)}},e.exports.InvalidTokenError=o},function(e,t,r){var n=r(54)
e.exports=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},o=Object.keys(r)
"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),o.forEach(function(t){n(e,t,r[t])})}return e}},function(e,t,r){var n=function(e){"use strict"
var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag"
function c(e,t,r,n){var o=t&&t.prototype instanceof y?t:y,i=Object.create(o.prototype),a=new C(n||[])
return i._invoke=function(e,t,r){var n=f
return function(o,i){if(n===h)throw new Error("Generator is already running")
if(n===p){if("throw"===o)throw i
return I()}for(r.method=o,r.arg=i;;){var a=r.delegate
if(a){var s=A(a,r)
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
var b=Object.getPrototypeOf,w=b&&b(b(T([])))
w&&w!==r&&n.call(w,i)&&(m=w)
var _=g.prototype=y.prototype=Object.create(m)
function x(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function k(e){var t
this._invoke=function(r,o){function i(){return new Promise(function(t,i){!function t(r,o,i,a){var s=u(e[r],e,o)
if("throw"!==s.type){var c=s.arg,f=c.value
return f&&"object"==typeof f&&n.call(f,"__await")?Promise.resolve(f.__await).then(function(e){t("next",e,i,a)},function(e){t("throw",e,i,a)}):Promise.resolve(f).then(function(e){c.value=e,i(c)},function(e){return t("throw",e,i,a)})}a(s.arg)}(r,o,t,i)})}return t=t?t.then(i,i):i()}}function A(e,r){var n=e.iterator[r.method]
if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method))return d
r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=u(n,e.iterator,r.arg)
if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d
var i=o.arg
return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function E(e){var t={tryLoc:e[0]}
1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{}
t.type="normal",delete t.arg,e.completion=t}function C(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function T(e){if(e){var r=e[i]
if(r)return r.call(e)
if("function"==typeof e.next)return e
if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r
return r.value=t,r.done=!0,r}
return a.next=a}}return{next:I}}function I(){return{value:t,done:!0}}return v.prototype=_.constructor=g,g.constructor=v,g[s]=v.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor
return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,g):(e.__proto__=g,s in e||(e[s]="GeneratorFunction")),e.prototype=Object.create(_),e},e.awrap=function(e){return{__await:e}},x(k.prototype),k.prototype[a]=function(){return this},e.AsyncIterator=k,e.async=function(t,r,n,o){var i=new k(c(t,r,n,o))
return e.isGeneratorFunction(r)?i:i.next().then(function(e){return e.done?e.value:i.next()})},x(_),_[s]="Generator",_[i]=function(){return this},_.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[]
for(var r in e)t.push(r)
return t.reverse(),function r(){for(;t.length;){var n=t.pop()
if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=T,C.prototype={constructor:C,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(S),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0
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
if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),d}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t]
if(r.tryLoc===e){var n=r.completion
if("throw"===n.type){var o=n.arg
S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),d}},e}(e.exports)
try{regeneratorRuntime=n}catch(e){Function("r","regeneratorRuntime = r")(n)}},function(e,t,r){"use strict"
var n=r(2),o=r(11),i=r(25),a=r(8)
function s(e){var t=new i(e),r=o(i.prototype.request,t)
return n.extend(r,i.prototype,t),n.extend(r,t),r}var c=s(a)
c.Axios=i,c.create=function(e){return s(n.merge(a,e))},c.Cancel=r(15),c.CancelToken=r(40),c.isCancel=r(14),c.all=function(e){return Promise.all(e)},c.spread=r(41),e.exports=c,e.exports.default=c},function(e,t){function r(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(r(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&r(e.slice(0,0))}(e)||!!e._isBuffer)}},function(e,t,r){"use strict"
var n=r(8),o=r(2),i=r(35),a=r(36)
function s(e){this.defaults=e,this.interceptors={request:new i,response:new i}}s.prototype.request=function(e){"string"==typeof e&&(e=o.merge({url:arguments[0]},arguments[1])),(e=o.merge(n,{method:"get"},this.defaults,e)).method=e.method.toLowerCase()
var t=[a,void 0],r=Promise.resolve(e)
for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)r=r.then(t.shift(),t.shift())
return r},o.forEach(["delete","get","head","options"],function(e){s.prototype[e]=function(t,r){return this.request(o.merge(r||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){s.prototype[e]=function(t,r,n){return this.request(o.merge(n||{},{method:e,url:t,data:r}))}}),e.exports=s},function(e,t){var r,n,o=e.exports={}
function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(r===setTimeout)return setTimeout(e,0)
if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0)
try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i}catch(e){r=i}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}()
var c,u=[],f=!1,l=-1
function h(){f&&c&&(f=!1,c.length?u=c.concat(u):l=-1,u.length&&p())}function p(){if(!f){var e=s(h)
f=!0
for(var t=u.length;t;){for(c=u,u=[];++l<t;)c&&c[l].run()
l=-1,t=u.length}c=null,f=!1,function(e){if(n===clearTimeout)return clearTimeout(e)
if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e)
try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function y(){}o.nextTick=function(e){var t=new Array(arguments.length-1)
if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r]
u.push(new d(e,t)),1!==u.length||f||s(p)},d.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=y,o.addListener=y,o.once=y,o.off=y,o.removeListener=y,o.removeAllListeners=y,o.emit=y,o.prependListener=y,o.prependOnceListener=y,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,r){"use strict"
var n=r(2)
e.exports=function(e,t){n.forEach(e,function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])})}},function(e,t,r){"use strict"
var n=r(13)
e.exports=function(e,t,r){var o=r.config.validateStatus
r.status&&o&&!o(r.status)?t(n("Request failed with status code "+r.status,r.config,null,r.request,r)):e(r)}},function(e,t,r){"use strict"
e.exports=function(e,t,r,n,o){return e.config=t,r&&(e.code=r),e.request=n,e.response=o,e}},function(e,t,r){"use strict"
var n=r(2)
function o(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e
var i
if(r)i=r(t)
else if(n.isURLSearchParams(t))i=t.toString()
else{var a=[]
n.forEach(t,function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),a.push(o(t)+"="+o(e))}))}),i=a.join("&")}return i&&(e+=(-1===e.indexOf("?")?"?":"&")+i),e}},function(e,t,r){"use strict"
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
var n=r(2)
function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){n.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=o},function(e,t,r){"use strict"
var n=r(2),o=r(37),i=r(14),a=r(8),s=r(38),c=r(39)
function u(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return u(e),e.baseURL&&!s(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),n.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]}),(e.adapter||a.adapter)(e).then(function(t){return u(e),t.data=o(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(u(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,r){"use strict"
var n=r(2)
e.exports=function(e,t,r){return n.forEach(r,function(r){e=r(e,t)}),e}},function(e,t,r){"use strict"
e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,r){"use strict"
e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,r){"use strict"
var n=r(15)
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
var f=r(16),l=r(44),h=r(45),p=function(){function e(e){this.contracts=new Map,this.cachedAbis=new Map,this.rpc=e.rpc,this.authorityProvider=e.authorityProvider||e.rpc,this.abiProvider=e.abiProvider||e.rpc,this.signatureProvider=e.signatureProvider,this.chainId=e.chainId,this.textEncoder=e.textEncoder,this.textDecoder=e.textDecoder,this.abiTypes=f.getTypesFromAbi(f.createInitialTypes(),l),this.transactionTypes=f.getTypesFromAbi(f.createInitialTypes(),h)}return e.prototype.rawAbiToJson=function(e){var t=new f.SerialBuffer({textEncoder:this.textEncoder,textDecoder:this.textDecoder,array:e})
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
u[1]=e.add_modulo32(u[2],d,w),u[2]=e.add_modulo32(u[3],y,v),u[3]=e.add_modulo32(u[4],l,g),u[4]=e.add_modulo32(u[0],h,m),u[0]=k}var A=new ArrayBuffer(20),E=new DataView(A)
return u.forEach(function(e,t){return E.setUint32(4*t,e,!0)}),A}}]),e}()
e.exports={RIPEMD160:i}},function(e){e.exports={version:"eosio::abi/1.1",structs:[{name:"extensions_entry",base:"",fields:[{name:"tag",type:"uint16"},{name:"value",type:"bytes"}]},{name:"type_def",base:"",fields:[{name:"new_type_name",type:"string"},{name:"type",type:"string"}]},{name:"field_def",base:"",fields:[{name:"name",type:"string"},{name:"type",type:"string"}]},{name:"struct_def",base:"",fields:[{name:"name",type:"string"},{name:"base",type:"string"},{name:"fields",type:"field_def[]"}]},{name:"action_def",base:"",fields:[{name:"name",type:"name"},{name:"type",type:"string"},{name:"ricardian_contract",type:"string"}]},{name:"table_def",base:"",fields:[{name:"name",type:"name"},{name:"index_type",type:"string"},{name:"key_names",type:"string[]"},{name:"key_types",type:"string[]"},{name:"type",type:"string"}]},{name:"clause_pair",base:"",fields:[{name:"id",type:"string"},{name:"body",type:"string"}]},{name:"error_message",base:"",fields:[{name:"error_code",type:"uint64"},{name:"error_msg",type:"string"}]},{name:"variant_def",base:"",fields:[{name:"name",type:"string"},{name:"types",type:"string[]"}]},{name:"abi_def",base:"",fields:[{name:"version",type:"string"},{name:"types",type:"type_def[]"},{name:"structs",type:"struct_def[]"},{name:"actions",type:"action_def[]"},{name:"tables",type:"table_def[]"},{name:"ricardian_clauses",type:"clause_pair[]"},{name:"error_messages",type:"error_message[]"},{name:"abi_extensions",type:"extensions_entry[]"},{name:"variants",type:"variant_def[]$"}]}]}},function(e){e.exports={version:"eosio::abi/1.0",types:[{new_type_name:"account_name",type:"name"},{new_type_name:"action_name",type:"name"},{new_type_name:"permission_name",type:"name"}],structs:[{name:"permission_level",base:"",fields:[{name:"actor",type:"account_name"},{name:"permission",type:"permission_name"}]},{name:"action",base:"",fields:[{name:"account",type:"account_name"},{name:"name",type:"action_name"},{name:"authorization",type:"permission_level[]"},{name:"data",type:"bytes"}]},{name:"extension",base:"",fields:[{name:"type",type:"uint16"},{name:"data",type:"bytes"}]},{name:"transaction_header",base:"",fields:[{name:"expiration",type:"time_point_sec"},{name:"ref_block_num",type:"uint16"},{name:"ref_block_prefix",type:"uint32"},{name:"max_net_usage_words",type:"varuint32"},{name:"max_cpu_usage_ms",type:"uint8"},{name:"delay_sec",type:"varuint32"}]},{name:"transaction",base:"transaction_header",fields:[{name:"context_free_actions",type:"action[]"},{name:"actions",type:"action[]"},{name:"transaction_extensions",type:"extension[]"}]}]}},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})},function(e,t,r){"use strict";(function(e){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(a,s)}c((n=n.apply(e,t||[])).next())})},o=this&&this.__generator||function(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1]
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
var a=r(9),s=r(18)
function c(e){var t,r,n=""
try{for(var o=i(e),a=o.next();!a.done;a=o.next()){n+=("00"+a.value.toString(16)).slice(-2)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return n}var u=function(){function t(t,r){void 0===r&&(r={}),this.endpoint=t,r.fetch?this.fetchBuiltin=r.fetch:this.fetchBuiltin=e.fetch}return t.prototype.fetch=function(e,t){return n(this,void 0,void 0,function(){var r,n,i
return o(this,function(o){switch(o.label){case 0:return o.trys.push([0,3,,4]),[4,(0,this.fetchBuiltin)(this.endpoint+e,{body:JSON.stringify(t),method:"POST"})]
case 1:return[4,(r=o.sent()).json()]
case 2:if((n=o.sent()).processed&&n.processed.except)throw new s.RpcError(n)
return[3,4]
case 3:throw(i=o.sent()).isFetchError=!0,i
case 4:if(!r.ok)throw new s.RpcError(n)
return[2,n]}})})},t.prototype.get_abi=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_abi",{account_name:e})]
case 1:return[2,t.sent()]}})})},t.prototype.get_account=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_account",{account_name:e})]
case 1:return[2,t.sent()]}})})},t.prototype.get_block_header_state=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_block_header_state",{block_num_or_id:e})]
case 1:return[2,t.sent()]}})})},t.prototype.get_block=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_block",{block_num_or_id:e})]
case 1:return[2,t.sent()]}})})},t.prototype.get_code=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_code",{account_name:e})]
case 1:return[2,t.sent()]}})})},t.prototype.get_currency_balance=function(e,t,r){return void 0===r&&(r=null),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/chain/get_currency_balance",{code:e,account:t,symbol:r})]
case 1:return[2,n.sent()]}})})},t.prototype.get_currency_stats=function(e,t){return n(this,void 0,void 0,function(){return o(this,function(r){switch(r.label){case 0:return[4,this.fetch("/v1/chain/get_currency_stats",{code:e,symbol:t})]
case 1:return[2,r.sent()]}})})},t.prototype.get_info=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_info",{})]
case 1:return[2,e.sent()]}})})},t.prototype.get_producer_schedule=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_producer_schedule",{})]
case 1:return[2,e.sent()]}})})},t.prototype.get_producers=function(e,t,r){return void 0===e&&(e=!0),void 0===t&&(t=""),void 0===r&&(r=50),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/chain/get_producers",{json:e,lower_bound:t,limit:r})]
case 1:return[2,n.sent()]}})})},t.prototype.get_raw_code_and_abi=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/chain/get_raw_code_and_abi",{account_name:e})]
case 1:return[2,t.sent()]}})})},t.prototype.getRawAbi=function(e){return n(this,void 0,void 0,function(){var t,r
return o(this,function(n){switch(n.label){case 0:return[4,this.get_raw_code_and_abi(e)]
case 1:return t=n.sent(),r=a.base64ToBinary(t.abi),[2,{accountName:t.account_name,abi:r}]}})})},t.prototype.get_table_rows=function(e){var t=e.json,r=void 0===t||t,i=e.code,a=e.scope,s=e.table,c=e.table_key,u=void 0===c?"":c,f=e.lower_bound,l=void 0===f?"":f,h=e.upper_bound,p=void 0===h?"":h,d=e.index_position,y=void 0===d?1:d,v=e.key_type,g=void 0===v?"":v,m=e.limit,b=void 0===m?10:m,w=e.reverse,_=void 0!==w&&w,x=e.show_payer,k=void 0!==x&&x
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_table_rows",{json:r,code:i,scope:a,table:s,table_key:u,lower_bound:l,upper_bound:p,index_position:y,key_type:g,limit:b,reverse:_,show_payer:k})]
case 1:return[2,e.sent()]}})})},t.prototype.get_table_by_scope=function(e){var t=e.code,r=e.table,i=e.lower_bound,a=void 0===i?"":i,s=e.upper_bound,c=void 0===s?"":s,u=e.limit,f=void 0===u?10:u
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/get_table_by_scope",{code:t,table:r,lower_bound:a,upper_bound:c,limit:f})]
case 1:return[2,e.sent()]}})})},t.prototype.getRequiredKeys=function(e){return n(this,void 0,void 0,function(){var t
return o(this,function(r){switch(r.label){case 0:return t=a.convertLegacyPublicKeys,[4,this.fetch("/v1/chain/get_required_keys",{transaction:e.transaction,available_keys:e.availableKeys})]
case 1:return[2,t.apply(void 0,[r.sent().required_keys])]}})})},t.prototype.push_transaction=function(e){var t=e.signatures,r=e.serializedTransaction
return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/chain/push_transaction",{signatures:t,compression:0,packed_context_free_data:"",packed_trx:c(r)})]
case 1:return[2,e.sent()]}})})},t.prototype.db_size_get=function(){return n(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return[4,this.fetch("/v1/db_size/get",{})]
case 1:return[2,e.sent()]}})})},t.prototype.history_get_actions=function(e,t,r){return void 0===t&&(t=null),void 0===r&&(r=null),n(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return[4,this.fetch("/v1/history/get_actions",{account_name:e,pos:t,offset:r})]
case 1:return[2,n.sent()]}})})},t.prototype.history_get_transaction=function(e,t){return void 0===t&&(t=null),n(this,void 0,void 0,function(){return o(this,function(r){switch(r.label){case 0:return[4,this.fetch("/v1/history/get_transaction",{id:e,block_num_hint:t})]
case 1:return[2,r.sent()]}})})},t.prototype.history_get_key_accounts=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/history/get_key_accounts",{public_key:e})]
case 1:return[2,t.sent()]}})})},t.prototype.history_get_controlled_accounts=function(e){return n(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,this.fetch("/v1/history/get_controlled_accounts",{controlling_account:e})]
case 1:return[2,t.sent()]}})})},t}()
t.JsonRpc=u}).call(this,r(17))},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})},function(e,t){var r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)
if(r){var n=new Uint8Array(16)
e.exports=function(){return r(n),n}}else{var o=new Array(16)
e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),o[t]=e>>>((3&t)<<3)&255
return o}}},function(e,t){for(var r=[],n=0;n<256;++n)r[n]=(n+256).toString(16).substr(1)
e.exports=function(e,t){var n=t||0,o=r
return[o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],"-",o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]],o[e[n++]]].join("")}},function(e,t,r){var n=r(52)
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
return c}},function(module,exports,__webpack_require__){(function(global){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__
!function(e,t){module.exports=t(e)}("undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==global?global:this,function(global){"use strict"
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
global.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",noEnum(function(){return decode(this)})),Object.defineProperty(String.prototype,"toBase64",noEnum(function(e){return encode(this,e)})),Object.defineProperty(String.prototype,"toBase64URI",noEnum(function(){return encode(this,!0)}))}}return global.Meteor&&(Base64=global.Base64),module.exports?module.exports.Base64=global.Base64:(__WEBPACK_AMD_DEFINE_ARRAY__=[],__WEBPACK_AMD_DEFINE_RESULT__=function(){return global.Base64}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),void 0===__WEBPACK_AMD_DEFINE_RESULT__||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)),{Base64:global.Base64}})}).call(this,__webpack_require__(17))},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t,r){"use strict"
r.r(t)
var n=r(0),o=r.n(n),i=r(1),a=r.n(i),s=r(3),c=r.n(s),u=r(4),f=r.n(u),l=r(5),h=r.n(l),p=r(6)
function d(e){var t=e,r=[]
return{getState:function(){return t},updateState:function(e){t="function"==typeof e?e(t):e
for(var n=0,o=r;n<o.length;n++){(0,o[n])(t)}},subscribe:function(e){return r.push(e),function(){r=r.filter(function(t){return t!==e})}}}}var y=r(19),v=r.n(y)
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
function A(e){var t=e.appName,r=e.network,n=e.walletProviders.map(function(e){return e(r)}),o=d(k),i=[]
function a(){for(var e=0,t=i;e<t.length;e++){(0,t[e])(v)}}var s,c,u,f,l=new Map,h=o.subscribe(a),y=(c=(s=r).protocol,u=s.host,f=s.port,(c||"http")+"://"+u+(f?":"+f:"")),v={appName:t,eosRpc:new p.JsonRpc(y,{fetch:fetch}),network:r,initWallet:function(e){var t="string"==typeof e?function(e,t){if(e.length)return e.find(function(e){return e.id===t})}(n,e):e
if(!t)throw new Error("\n          Cannot initiate a session, invalid wallet provider\n          or wallet provider ID was passed\n        ")
var r=x(t,v)
return o.updateState(function(e){return{wallets:(e&&e.wallets||[]).concat([r])}}),l.set(r._instanceId,r.subscribe(a)),r},addWalletProvider:function(e){n.push(e(r))},getWalletProviders:function(){return n},getWallets:function(){var e=o.getState()
return e&&e.wallets||[]},getActiveWallets:function(){return v.getWallets().filter(function(e){return e.connected&&e.authenticated})},detachWallet:function(e){o.updateState(function(t){return{wallets:(t&&t.wallets||[]).filter(function(t){return t!==e})}})
var t=e._instanceId
if(l.has(t)){var r=l.get(t)
"function"==typeof r&&r()}},logoutAll:function(){return Promise.all(v.getWallets().map(function(e){return e.logout()})).then(function(){return!0})},disconnectAll:function(){return Promise.all(v.getWallets().map(function(e){return e.disconnect()})).then(function(){return!0})},terminateAll:function(){return Promise.all(v.getWallets().map(function(e){return e.terminate()})).then(function(){return!0})},destroy:function(){return v.terminateAll().then(function(){h(),l.forEach(function(e){"function"==typeof e&&e()}),i=[]})},subscribe:function(e){return i=i.concat([e]),function(){i=i.filter(function(t){return t!==e})}}}
return v}var E=r(10),S=r.n(E),C=r(20),T=r.n(C),I=r(53).Base64,U=function(e,t,r){return e.replace(new RegExp(t,"g"),r)},O=function(){function e(){c()(this,e)}return f()(e,null,[{key:"isNullOrEmpty",value:function(e){return void 0===e||(null===e||(!(!Array.isArray(e)||0!==e.length)||0===Object.keys(e).length&&e.constructor===Object))}},{key:"log",value:function(e,t){0}},{key:"jwtDecodeSafe",value:function(e){var t={}
if(this.isNullOrEmpty(e))return{}
try{t=T()(e)}catch(e){}return t}},{key:"tokenHasExpired",value:function(e){var t=null
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
try{t&&(r=decodeURI(r)),n=U(r,"'",'"'),n=U(n,"`",'"')
var o=JSON.parse(n)
if(o&&"object"===S()(o))return o}catch(e){console.log(e)}return null}},{key:"isAnObject",value:function(e){return null!==e&&"object"===S()(e)}},{key:"base64DecodeSafe",value:function(t){var r={}
if(this.isNullOrEmpty(t))return null
try{r=I.decode(t),e.tryParseJSON(r)&&(r=JSON.parse(r))}catch(e){return null}return r}},{key:"base64Encode",value:function(t){return e.isAnObject(t)&&(t=JSON.stringify(t)),I.encode(t)}},{key:"sleep",value:function(e){return new Promise(function(t){return setTimeout(t,e)})}}]),e}(),P=r(21),z=r.n(P),N=r(7),D=r.n(N),R=function(){function e(){c()(this,e)}return f()(e,[{key:"getItem",value:function(e){return D.a.get(e)}},{key:"removeItem",value:function(e){D.a.remove(e)}},{key:"setItem",value:function(e,t,r){var n=z()({expires:1},r)
D.a.set(e,t,n)}}]),e}(),B=function(){function e(){c()(this,e),window?this.storage=window.localStorage:O.log("Not running in Browser. Using CookieStorage instead.")}return f()(e,[{key:"getItem",value:function(e){if(this.storage)return this.storage.getItem(e)}},{key:"removeItem",value:function(e){if(this.storage)return this.storage.removeItem(e)}},{key:"setItem",value:function(e,t,r){if(this.storage)return this.storage.setItem(e,t,r)}}]),e}(),j=function(){function e(){c()(this,e)}return f()(e,[{key:"getItem",value:function(e){return null}},{key:"removeItem",value:function(e){}},{key:"setItem",value:function(e,t,r){}}]),e}(),L=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{tryLocalStorageFirst:!0}
if(c()(this,e),this.triedLocalStorage=!1,this.triedCookieStorage=!1,!0===t.tryLocalStorageFirst){this.triedLocalStorage=!0
try{var r=new B
r&&r.storage&&(this.storage=r)}catch(e){O.log("Can't use localStorage. Using CookieStorage instead.",t)}}this.storage||(this.storage=new R,this.triedCookieStorage=!0)}return f()(e,[{key:"failover",value:function(){if(!(this.storage instanceof j)){var e=!1
this.storage instanceof B?this.triedCookieStorage||(this.storage=new R,this.triedCookieStorage=!0,e=!0):this.storage instanceof R&&(this.triedLocalStorage||(this.storage=new B,this.triedLocalStorage=!0,e=!0)),e||(this.storage=new j)}}},{key:"getItem",value:function(e){try{return this.storage.getItem(e)}catch(t){return O.log("Can't getItem in storage.",t),this.failover(),this.storage.getItem(e)}}},{key:"removeItem",value:function(e){try{return this.storage.removeItem(e)}catch(t){return O.log("Can't removeItem in storage.",t),this.failover(),this.storage.removeItem(e)}}},{key:"setItem",value:function(e,t,r){try{return this.storage.setItem(e,t,r)}catch(n){return O.log("Can't setItem in storage.",n),this.failover(),this.storage.setItem(e,t,r)}}}]),e}(),F={ledger:{providerId:"ledger",requiresLogin:!1,supportsDiscovery:!0},lynx:{providerId:"EOS Lynx",requiresLogin:!1,supportsDiscovery:!1},meetone:{providerId:"meetone_provider",requiresLogin:!1,supportsDiscovery:!1},metro:{providerId:"metro",requiresLogin:!1,supportsDiscovery:!1},scatter:{providerId:"scatter",requiresLogin:!0,supportsDiscovery:!1},tokenpocket:{providerId:"TokenPocket",requiresLogin:!1,supportsDiscovery:!1}},K=function(){function e(t){c()(this,e),this.options=null,this.appAccessToken=null,this.user=null,this.storage=new L,this.validateOptions(t),this.chainContexts={},this.chainNetworks=[],this.init()}return f()(e,[{key:"init",value:function(){var e=a()(o.a.mark(function e(){var t
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getConfigFromApi("chains")
case 2:t=e.sent,this.chainNetworks=t.chains
case 4:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()},{key:"getOrCreateChainContext",value:function(e){var t=this.options,r=t.appName,n=t.eosTransitWalletProviders,o=void 0===n?[]:n
if(this.chainContexts[e])return this.chainContexts[e]
var i=this.chainNetworks.find(function(t){return t.network===e})
if(!i)throw new Error("Invalid chain network: ".concat(e,"."))
var a=i.hosts[0],s=a.chainId,c=A({appName:r||"missing appName",network:{host:a.host,port:a.port,protocol:a.protocol,chainId:s},walletProviders:o})
return this.chainContexts[e]=c,c}},{key:"callPasswordlessApi",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,p,d,y,v=arguments
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=v.length>1&&void 0!==v[1]&&v[1],n=t.provider,i=t.phone,a=t.email,s=t.code,c=this.options,u=c.apiKey,f=c.oreIdUrl,n&&(i||a)&&(!r||s)){e.next=5
break}throw new Error("Missing a required parameter")
case 5:return l="send",r&&(l="verify"),p="".concat(f,"/api/account/login-passwordless-").concat(l,"-code?provider=").concat(n),a&&(p+="&email=".concat(a)),i&&(d=encodeURIComponent(i),p+="&phone=".concat(d)),r&&(p+="&code=".concat(s)),y={},e.prev=12,e.next=15,h.a.get(p,{headers:{"api-key":u}})
case 15:y=e.sent,e.next=21
break
case 18:e.prev=18,e.t0=e.catch(12),y=e.t0.response
case 21:return e.abrupt("return",y.data)
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
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=t.provider,e.t0=r,e.next="custodial"===e.t0?4:"lynx"===e.t0?5:"ledger"===e.t0?6:"meetone"===e.t0?7:"metro"===e.t0?8:"scatter"===e.t0?9:"tokenpocket"===e.t0?10:11
break
case 4:return e.abrupt("return",this.custodialSignWithOreId(t))
case 5:case 6:case 7:return e.abrupt("return",this.signWithTransitProvider(t))
case 8:return e.abrupt("break",12)
case 9:case 10:return e.abrupt("return",this.signWithTransitProvider(t))
case 11:return e.abrupt("return",this.signWithOreId(t))
case 12:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"discover",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.provider,n=t.chainNetwork,i=void 0===n?"eos_main":n,a=t.discoveryPathIndexList,this.assertValidProvider(r),!this.canDiscover(r)){e.next=4
break}return e.abrupt("return",this.discoverCredentialsInWallet(i,r,a))
case 4:throw new Error("Discover not support for provider: ".concat(r))
case 5:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"assertValidProvider",value:function(e){if(F[e])return!0
throw new Error("Provider ".concat(e," is not a valid option"))}},{key:"canDiscover",value:function(e){return!0===F[e].supportsDiscovery}},{key:"loginWithOreId",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.code,n=t.email,i=t.phone,a=t.provider,s=t.state,c=this.options,u=c.authCallbackUrl,f=c.backgroundColor,l={code:r,email:n,phone:i,provider:a,backgroundColor:f,callbackUrl:u,state:s},e.next=5,this.getOreIdAuthUrl(l)
case 5:return h=e.sent,e.abrupt("return",{loginUrl:h,errors:null})
case 7:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"signWithOreId",value:function(){var e=a()(o.a.mark(function e(t){var r,n
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=this.options.signCallbackUrl,t.callbackUrl=r,e.next=4,this.getOreIdSignUrl(t)
case 4:return n=e.sent,e.abrupt("return",{signUrl:n,errors:null})
case 6:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"custodialSignWithOreId",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=this.options,n=r.signCallbackUrl,i=r.apiKey,a=r.serviceKey){e.next=3
break}throw new Error("Missing serviceKey in oreId config options - required to call api/custodial/new-user.")
case 3:return t.callbackUrl=n,t.isCustodialAccount=!0,e.next=7,this.getOreIdSignUrl(t)
case 7:return s=e.sent,e.next=10,h.a.get(s,{headers:{"api-key":i,"service-key":a}})
case 10:if(c=e.sent,!(u=c.error)){e.next=14
break}throw new Error(u)
case 14:return e.abrupt("return",c.data)
case 15:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"signWithTransitProvider",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.broadcast,n=t.chainNetwork,i=t.transaction,a=t.provider,e.next=3,this.connectToTransitProvider(a,n)
case 3:return s=e.sent,c=s.transitWallet,e.prev=5,this.setIsBusy(!0),e.next=9,c.eosApi.transact({actions:[i]},{broadcast:r,blocksBehind:3,expireSeconds:60})
case 9:s=e.sent,e.next=15
break
case 12:throw e.prev=12,e.t0=e.catch(5),e.t0
case 15:return e.prev=15,this.setIsBusy(!1),e.finish(15)
case 18:return e.abrupt("return",{signedTransaction:s})
case 19:case"end":return e.stop()}},e,this,[[5,12,15,18]])}))
return function(t){return e.apply(this,arguments)}}()},{key:"custodialNewAccount",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,p,d,y,v,g,m
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=this.options,n=r.apiKey,i=r.oreIdUrl,a=r.serviceKey,s=t.accountType,c=t.email,u=t.name,f=t.picture,l=t.phone,p=t.userName,d=t.userPassword,y={account_type:s,email:c,name:u,picture:f,phone:l,user_name:p,user_password:d},a){e.next=5
break}throw new Error("Missing serviceKey in oreId config options - required to call api/custodial/new-user.")
case 5:return v="".concat(i,"/api/custodial/new-user"),e.next=8,h.a.post(v,JSON.stringify(y),{headers:{"Content-Type":"application/json","api-key":n,"service-key":a},body:y})
case 8:if(g=e.sent,!(m=g.error)){e.next=12
break}throw new Error(m)
case 12:return e.abrupt("return",g.data)
case 13:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"connectToTransitProvider",value:function(){var e=a()(o.a.mark(function e(t,r){var n,i,a,s,c,u,f,l,h,p,d,y,v,g,m,b
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={},i=F[t].providerId,a=this.getOrCreateChainContext(r),s=a.getWalletProviders().find(function(e){return e.id===i}),c=a.initWallet(s),e.prev=5,e.next=8,c.connect()
case 8:return e.next=10,this.waitWhileWalletIsBusy(c,t)
case 10:if(!0!==F[t].requiresLogin){e.next=29
break}if(!c||!0===c.authenticated){e.next=27
break}return e.prev=12,e.next=15,c.login()
case 15:e.next=25
break
case 17:if(e.prev=17,e.t0=e.catch(12),u=e.t0.message,!(void 0===u?"":u).includes("unknown key (boost::tuples::tuple")){e.next=24
break}throw new Error("The account selected by the wallet for login isn't on the ".concat(r," chain"))
case 24:throw e.t0
case 25:return e.next=27,this.waitWhileWalletIsBusy(c,t)
case 27:if(c&&!0===c.authenticated){e.next=29
break}throw new Error("Couldn't connect to ".concat(t))
case 29:if(n.transitWallet=c,!c.connected){e.next=34
break}c.authenticated&&(f=c.auth,l=f.accountName,h=f.permission,p=f.publicKey,n={isLoggedIn:c.authenticated,account:l,permissions:[{name:h,publicKey:p}],provider:t,transitWallet:c}),e.next=36
break
case 34:throw d=c.hasError,y=c.errorMessage,new Error("".concat(t," not connected!").concat(d)?" Error: ".concat(y):"")
case 36:if(!(v=(this.user||{}).accountName)){e.next=42
break}return m=(g=n).account,b=g.permissions,w=this.getChainNetworkFromTransitWallet(c),e.next=42,this.addWalletPermissionstoOreIdAccount(m,w,b,v,t)
case 42:e.next=48
break
case 44:throw e.prev=44,e.t1=e.catch(5),console.log("Failed to connect to ".concat(t," wallet:"),e.t1),e.t1
case 48:return e.prev=48,this.setIsBusy(!1),e.finish(48)
case 51:return e.abrupt("return",n)
case 52:case"end":return e.stop()}},e,this,[[5,44,48,51],[12,17]])}))
return function(t,r){return e.apply(this,arguments)}}()},{key:"waitWhileWalletIsBusy",value:function(){var e=a()(o.a.mark(function e(t,r){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.inProgress){e.next=7
break}return this.setIsBusy(!0),e.next=4,O.sleep(250)
case 4:console.log("connecting to ".concat(r," via eos-transit wallet in progress:"),t.inProgress),e.next=0
break
case 7:this.setIsBusy(!1)
case 8:case"end":return e.stop()}},e,this)}))
return function(t,r){return e.apply(this,arguments)}}()},{key:"getChainNetworkFromTransitWallet",value:function(e){var t
if(e&&e.eosApi){var r=e.eosApi.chainId,n=this.chainNetworks.find(function(e){return e.hosts.find(function(e){return e.chainId===r})})
O.isNullOrEmpty(n)||(t=n.network)}return t}},{key:"discoverCredentialsInWallet",value:function(){var e=a()(o.a.mark(function e(t,r){var n,i,s,c,u,f,l,h,p=this,d=arguments
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
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(O.isNullOrEmpty(i)||O.isNullOrEmpty(n)||O.isNullOrEmpty(r))){e.next=2
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
return function(t){return e.apply(this,arguments)}}()},{key:"getAccessToken",value:function(){var e=a()(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getNewAppAccessToken()
case 2:return e.abrupt("return",this.appAccessToken)
case 3:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()},{key:"getOreIdAuthUrl",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h,p,d,y,v
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.code,n=t.email,i=t.phone,a=t.provider,s=t.callbackUrl,c=t.backgroundColor,u=t.state,f=this.options.oreIdUrl,a&&s){e.next=4
break}throw new Error("Missing a required parameter")
case 4:return e.next=6,this.getAccessToken()
case 6:return l=e.sent,h=u?"&state=".concat(u):"",p=r?"&code=".concat(r):"",d=n?"&email=".concat(n):"",y="",i&&(v=encodeURIComponent(i),y="&phone=".concat(v)),e.abrupt("return","".concat(f,"/auth#app_access_token=").concat(l,"&provider=").concat(a)+"".concat(p).concat(d).concat(y)+"&callback_url=".concat(encodeURIComponent(s),"&background_color=").concat(encodeURIComponent(c)).concat(h))
case 13:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"getOreIdSignUrl",value:function(){var e=a()(o.a.mark(function e(t){var r,n,i,a,s,c,u,f,l,h,p,d,y,v,g,m,b
return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.account,n=t.accountIsTransactionPermission,i=t.broadcast,a=t.callbackUrl,s=t.chainNetwork,c=t.isCustodialAccount,u=void 0!==c&&c,t.provider,f=t.returnSignedTransaction,l=t.state,h=t.transaction,p=t.userPassword,d=t.chainAccount,y=this.options.oreIdUrl,r&&a&&h){e.next=5
break}throw new Error("Missing a required parameter")
case 5:return d||(d=r),v=u?"api/custodial/sign":"sign",e.next=9,this.getAccessToken()
case 9:return g=e.sent,m=O.base64Encode(h),b=l?"&state=".concat(l):"",b+=n?"&account_is_transaction_permission=".concat(n):"",b+=O.isNullOrEmpty(f)?"":"&return_signed_transaction=".concat(f),b+=O.isNullOrEmpty(p)?"":"&user_password=".concat(p),e.abrupt("return","".concat(y,"/").concat(v,"#app_access_token=").concat(g,"&account=").concat(r,"&broadcast=").concat(i,"&callback_url=").concat(encodeURIComponent(a),"&chain_account=").concat(d,"&chain_network=").concat(encodeURIComponent(s),"&transaction=").concat(m).concat(b))
case 16:case"end":return e.stop()}},e,this)}))
return function(t){return e.apply(this,arguments)}}()},{key:"handleAuthResponse",value:function(e){var t=O.urlParamsToArray(e),r=t.accessToken,n=t.account,o=t.idToken,i=t.state,a=this.getErrorCodesFromParams(t),s={account:n}
return r&&(s.accessToken=r),o&&(s.idToken=o),a&&(s.errors=a),i&&(s.state=i),this.setIsBusy(!1),s}},{key:"handleSignResponse",value:function(e){var t,r=O.urlParamsToArray(e),n=r.signed_transaction,o=r.state,i=r.transaction_id,a=this.getErrorCodesFromParams(r)
return a||(t=O.base64DecodeSafe(n)),this.setIsBusy(!1),{signedTransaction:t,state:o,transactionId:i,errors:a}}},{key:"getNewAppAccessToken",value:function(){var e=a()(o.a.mark(function e(){var t,r
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
return r&&(t=r.split(/[\/?\/$&]/)),(t||n)&&(t=t||[]).push(n),t}},{key:"logout",value:function(){this.clearLocalState()}},{key:"userKey",value:function(){return"oreid.".concat(this.options.appId,".user")}},{key:"saveUserLocally",value:function(e){if(!O.isNullOrEmpty(e)){this.user=e
var t=JSON.stringify(this.user)
this.storage.setItem(this.userKey(),t)}}},{key:"loadUserLocally",value:function(){var e=this.storage.getItem(this.userKey())
return O.isNullOrEmpty(e)?(this.user=null,null):(this.user=JSON.parse(e),this.user)}},{key:"clearLocalState",value:function(){var e=a()(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.storage.removeItem(this.userKey())
case 1:case"end":return e.stop()}},e,this)}))
return function(){return e.apply(this,arguments)}}()}]),e}(),M=function(e){return function(t,r,n){Promise.resolve(e(t,r,n)).catch(n)}}
function W(e){return M(function(){var t=a()(o.a.mark(function t(r,n,i){var a,s,c,u,f,l,h,p
return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(r.query){t.next=3
break}return t.abrupt("return",{})
case 3:if(e.errors=null,a=e.handleAuthResponse(r.originalUrl),s=a.accessToken,c=a.account,u=a.errors,f=a.idToken,l=a.state,!u){t.next=10
break}return e.errors=u,h=new Error("Errors Processing auth callback: ".concat(u.join(", "))),t.abrupt("return",i(h))
case 10:if(r.appId=e.appId,s&&(r.accessToken=s),f&&(r.idToken=f),l&&(r.state=l),!c){t.next=19
break}return t.next=17,e.getUserInfoFromApi(c)
case 17:p=t.sent,r.user=p
case 19:return t.abrupt("return",i())
case 20:case"end":return t.stop()}},t)}))
return function(e,r,n){return t.apply(this,arguments)}}())}function q(e){return M(function(){var t=a()(o.a.mark(function t(r,n,i){var a,s,c,u,f,l,h
return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(a=r.body){t.next=3
break}return t.abrupt("return",{})
case 3:if(e.errors=null,s=e.handleSignResponse(a),c=s.signedTransaction,u=s.state,f=s.transactionId,!(l=s.errors)){t.next=9
break}return e.errors=l,h=new Error("Errors Processing sign callback: ".concat(l.join(", "))),t.abrupt("return",i(h))
case 9:return c&&(r.signedTransaction=c,r.appId=e.appId),f&&(r.transactionId=f),u&&(r.state=u),t.abrupt("return",i())
case 13:case"end":return t.stop()}},t)}))
return function(e,r,n){return t.apply(this,arguments)}}())}r.d(t,"asyncHandler",function(){return M}),r.d(t,"authCallbackHandler",function(){return W}),r.d(t,"OreId",function(){return K}),r.d(t,"signCallbackHandler",function(){return q})}])})
