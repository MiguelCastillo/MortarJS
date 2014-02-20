/**
 * MortarJS Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

(function(e,t){typeof require=="function"&&typeof exports=="object"&&typeof module=="object"?module.exports=t(require("Mortar"),require("ko")):typeof define=="function"&&define.amd?define(t):e.Mortar=t()})(this,function(){var e,t,n;return function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p=t&&t.split("/"),d=l.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(f=0;f<e.length;f+=1){h=e[f];if(h===".")e.splice(f,1),f-=1;else if(h===".."){if(f===1&&(e[2]===".."||e[0]===".."))break;f>0&&(e.splice(f-1,2),f-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(f=n.length;f>0;f-=1){r=n.slice(0,f).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=f;break}}}if(s)break;!u&&v&&v[r]&&(u=v[r],a=f)}!s&&u&&(s=u,o=a),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w;i=i||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),w=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n.apply(a[e],g);if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!w)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){return typeof e=="string"?u[e]?u[e](t):b(o(e,t).f):(e.splice||(l=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s)},s.config=function(e){return l=e,l.deps&&s(l.deps,l.callback),s},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("lib/js/almond",function(){}),n("src/extender",[],function(){function e(){this.extend.apply(this,arguments)}return e.prototype.extend=function(){var t=Array.prototype.slice.call(arguments),n;while(t.length)n=t.shift(),n.constructor===Function?(e.extension.prototype=n.prototype,_.extend(this,new e.extension)):_.extend(this,n);return this},e.extension=function(){},e.mixin=function(){var t=new e,n=Array.prototype.slice.call(arguments),r=n.shift();return r.constructor===Function?(t.extend.apply(r.prototype,n),r.prototype.extend=t.extend):t.extend.apply(r,n),r.extend=e.extend,r},e.extend=function(){function n(){this.constructor.apply(this,arguments)}var t=this===e?arguments[0]:this;return t&&t.constructor===Function?e.extension.prototype=t.prototype:e.extension.prototype=t,n.prototype=new e.extension,n.__super__=t.prototype,e.mixin.apply(t,[n].concat.apply(n,arguments)),n},e}),n("src/events",["src/extender"],function(e){function n(){}function r(){}var t={};return t.object=function(e,t){if(typeof arguments[0]!="object")return;var r={events:{}};for(var i in e)r.events[i]=n.normalize.apply(this,[i,e[i],e[i].context||t]);return r},t.string=function(e,t,r){if(typeof arguments[0]!="string")return;e=e.split(",");var i={events:{}},s=e.length,o=0;for(;o<s;o++)i.events[e[o]]=n.normalize.apply(this,[e[o],t,r]);return i},n.normalize=function(e,t,n){var r=e.split(" "),i=r.shift(),s=r.join(" ")||null,o=i.split(":").length!==1;return typeof t=="string"&&(t=this[t]),n&&typeof t=="function"&&(t=$.proxy(t,n)),{type:i,selector:s,cb:t,custom:o}},n.bind=function(){var e=$(this),t=r.configure.apply(this,arguments),n=t.events||{},i;for(var s in n){i=n[s];if(!i.cb)continue;e.on(i.type+"."+r.prefix,i.selector,i.cb)}return this},n.unbind=function(){var e=$(this);return arguments[0]?e.off.apply(e,arguments):e.off("."+r.prefix),this},e.mixin(r,{events:{}}),r.prefix="mortar",r.factory=n,r.converters=t,r.configure=function(){var e=r.converters[typeof arguments[0]];if(e)return e.apply(this,arguments)},r.prototype.on=function(){return r.factory.bind.apply(this,arguments)},r.prototype.off=function(){return r.factory.unbind.apply(this,arguments)},r.prototype.trigger=function(){var e=$(this);return e.trigger.apply(e,arguments),this},r.prototype.triggerHandler=function(){var e=$(this);return e.triggerHandler.apply(e,arguments),this},r}),n("src/hash.route",[],function(){function s(e){return typeof e=="string"&&(e={pattern:e}),e.pattern in i==0&&(i[e.pattern]=new s.route(e)),i[e.pattern]}function o(){t=""+window.location.hash;if(t===e)return;$(s).triggerHandler("change",[t,e]);for(var n in i)i[n].exec(t);e=t}function u(){r&&clearTimeout(r),r=setTimeout(o,s.refreshRate)}function a(e){var t=a.rules,n=(""+e).replace(t.wholeValue.regex,function(e){return e.substr(0,e.indexOf(":"))+t.wholeValue.rule}).replace(t.optionalValue.regex,function(e){return e.substr(0,e.indexOf(":"))+t.optionalValue.rule}).replace(t.nameValue.regex,function(e){return e.substr(0,e.indexOf(":"))+t.nameValue.rule}).replace(t.wildCard.regex,t.wildCard.rule),r=new RegExp("^(?:#*/*)"+n+"(?:/*)$");return function(e){return e.match(r)}}function f(e){function o(e){if(!r)return!1;var i=n(e);return i?(t.lastUrl=i.shift(),t.lastMatch=i.join("-")):t.lastMatch=undefined,i}function u(e){var n=t.lastMatch,r=o(e);r&&n!==t.lastMatch&&(t.triggerHandler("change",r),$(s).triggerHandler("route:change",[t,r]))}function f(){$(i[t.pattern]).off(),delete i[t.pattern]}function l(e){if(arguments.length===0)return r===!0;r=e}function h(){var e=arguments[1],n=arguments[2];typeof e=="function"&&(n=e,e="");var r=t.match(""+window.location.hash);return r&&(r.unshift(jQuery.Event("init")),setTimeout(function(){n.apply(t,r),$(s).triggerHandler("route:init",t)},1)),c.apply(t,arguments),t}var t=$({}),n=a(e.pattern),r=!0,c=t.on;return t.match=o,t.exec=u,t.unregister=f,t.enable=l,t.pattern=e.pattern,t.on=h,t}var e="",t="",n=!1,r=!1,i={};return s.refreshRate=10,s.enable=function(){if(n)return;n=!0,"onhashchange"in window?($(window).on("hashchange",u),r=setTimeout(o,s.refreshRate)):r=setInterval(o,100)},s.disable=function(e){if(n===!1)return;n=!1,"onhashchange"in window?($(window).off("hashchange",u),clearTimeout(r)):clearInterval(r)},s.navigate=function(e){window.location.hash=e},a.rules={wildCard:{regex:/\/\*\*/g,rule:"(?:.*)"},wholeValue:{regex:/\*\*\w*:\w+/g,rule:"(.*)"},optionalValue:{regex:/\*\w*:\w+/g,rule:"([^/]*)"},nameValue:{regex:/\w*:\w+/g,rule:"([^/]+)"}},s.patternMatch=a,s.route=f,s.enable(),s}),n("src/async",[],function(){function n(){function u(t){return function(){t.apply(s,e)}}var e=arguments,n=arguments[0],r=1,i=!0,s=this,o={};return typeof n=="boolean"&&(i=n,n=arguments[1],r=2),e=arguments[r],o.run=function(r){t(u(r||n))},i?o.run():o}var e=this,t;return e.setImmediate?t=e.setImmediate:e.process&&typeof e.process.nextTick=="function"?t=e.process.nextTick:t=function(e){setTimeout(e,0)},n}),n("src/promise",["src/async"],function(e){function i(e,r){function u(e,t){return o.then(e,t)}function a(n){return o.queue(t.resolved,n),e}function f(n){return o.queue(t.rejected,n),e}function l(t){return o.queue(n.always,t),e}function c(){return o._state}function h(){return o.transition(t.resolved,this,arguments),e}function p(){return o.transition(t.rejected,this,arguments),e}function d(t){return t.then(e.resolve,e.reject),e}e=e||{};var o=new s(e,r||{});return u.constructor=i,u.stateManager=o,e.always=l,e.done=a,e.fail=f,e.thenable=d,e.resolve=h,e.reject=p,e.then=u,e.state=c,e.promise={always:l,done:a,fail:f,then:u,state:c},e}function s(e,t){this.promise=e,t.async?(this.state=t.state,this.async=t.async):t.state&&this.transition(t.state,t.context,t.value)}function o(e){this.promise=e,this.resolved=0}var t={pending:0,resolved:1,rejected:2},n={always:0,resolved:1,rejected:2},r={resolve:"resolve",reject:"reject"};return i.defer=function(e,t){return new i(e,t)},i.thenable=function(e){var t=new i;return t.thenable(e)},i.rejected=function(){return new i({},{context:this,value:arguments,state:t.rejected})},i.resolved=function(){return new i({},{context:this,value:arguments,state:t.resolved})},s.prototype.queue=function(e,t){this.state?this.state===e&&this.async.run(t):(this.deferred||(this.deferred=[])).push({type:e,cb:t})},s.prototype.notify=function(){var e=this.deferred,t=this.state,r=0,i=e.length,s;do s=e[r++],(s.type===t||s.type===n.always)&&this.async.run(s.cb);while(r<i);this.deferred=null},s.prototype.transition=function(t,n,r){this.state||(this.state=t,this.context=n,this.value=r,this.async=e.call(n,!1,void 0,r),this.deferred&&this.notify())},s.prototype.then=function(e,n){var s,u;return e=typeof e=="function"?e:null,n=typeof n=="function"?n:null,!e&&this.state===t.resolved||!n&&this.state===t.rejected?u=new i({},this):(u=new i,s=new o(u),this.queue(t.resolved,s.chain(r.resolve,e||n)),this.queue(t.rejected,s.chain(r.reject,n||e))),u},o.prototype.chain=function(e,t,n){var r=this;return function(){if(!r.resolved){r.resolved++,r.context=this,r.then=n;try{r.resolve(e,t?[t.apply(this,arguments)]:arguments)}catch(s){r.promise.reject.call(r.context,s)}}}},o.prototype.resolve=function(e,t){var n=t[0],s=n&&n.then,u=s&&typeof s=="function",a,f;if(n===this.promise)throw new TypeError;if(u&&s.constructor===i)a=new o(this.promise),n.done(a.chain(r.resolve)).fail(a.chain(r.reject));else{f=u&&this.then!==n&&typeof n;if(f==="function"||f==="object")try{a=new o(this.promise,n),s.call(n,a.chain(r.resolve,!1,n),a.chain(r.reject,!1,n))}catch(l){a.resolved||this.promise.reject.call(this.context,l)}else this.promise[e].apply(this.context,t)}},i.states=t,i}),n("src/when",["src/promise","src/async"],function(e,t){function n(){function f(){u&&u--,u||r.resolve.apply(i,a===1?n[0]:n)}function l(e){return function(){n[e]=arguments,f()}}function c(){r.reject.apply(this,arguments)}function h(){a=u=n.length;for(s=0;s<a;s++)o=n[s],o&&typeof o.then=="function"?o.then(l(s),c):(n[s]=a===1?[o]:o,f())}var n=Array.prototype.slice.call(arguments),r=e(),i=this,s,o,u,a;return n.length?(t(h),r):r.resolve(null)}return n}),n("src/spromise",["src/promise","src/async","src/when"],function(e,t,n){return e.when=n,e.async=t,e}),n("src/resources",["src/extender"],function(e){function n(e,t){return n.load(e,t)}var t={};return n.register=function(e,r){if(r instanceof n.resource==0)throw new TypeError("Resource loader must be of type resource");t[e]=r},n.fetch=function(e,n){var r=t[n];if(_.isFunction(e))return e;if(!n||!r)return e;if(e.url&&e.url.lastIndexOf(".")===-1){var i=r.extension;e.url+=i?"."+i:""}return r.load(e)},n.load=function(e,t){var r,i,s,o,u,a,f={},l=t?t.split("/"):[];e=n.ensureResources(e),a=l.pop(),l.pop(),u=l.join("/");for(var c in e){r=e[c];if(!r&&r!==""){f[c]=!1;continue}/\w+!.*/.test(c)&&(i=c.split("!"),c=i[0],o=i[1],s={},s[o]=r||u+"/"+c+"/"+a,r=s),r.location=u+"/"+c+"/"+a,f[c]=n.fetch(r,c)}return f},n.ensureResources=function(e){var t={},n,r;if(e instanceof Array)for(n=0,r=e.length;n<r;n++)t[e[n]]="";else e&&(t=e);return t},n.resource=function(){},e.mixin(n.resource,{load:$.noop}),n}),n("src/model",["src/extender","src/events","src/spromise","src/resources"],function(e,t,n,r){function i(e,t,n){n=n||{};var r,s={context:this,type:e,url:_.result({url:n.url||this.url},"url")};switch(e.toLocaleLowerCase()){case"post":case"put":r=_.result({data:t||this.deserialize},"data"),s.data=r&&JSON.stringify(r),s.contentType="application/json; charset=utf-8";break;default:r=_.result({data:t||this.deserialize},"data"),s.data=r&&JSON.stringify(r)}_.extend(s,this.ajax,n.ajax);if(s.url)return i.transaction(s);throw"Must provide a url in order to make ajax calls.  Optionally, you can override or provide a custom data source that does not require a url."}function s(){}function o(e,t){if(this instanceof o==0)return new o(e,t);var n=o.configure.apply(this,arguments);this.on(this.events).on(n.events),_.extend(this,n.options),this.serialize(this.data),this._init(),this._create()}return i.transaction=$.ajax,s.prototype.create=function(e,t){return n.when.call(this,this.datasource("post",e,t)).then(function(e){return e})},s.prototype.read=function(e,t){return n.when.call(this,this.datasource("get",e,t)).then(function(e){return this.serialize(e),e})},s.prototype.update=function(e,t){return n.when.call(this,this.datasource("put",e,t)).then(function(e){return e})},s.prototype.remove=function(e,t){return n.when.call(this,this.datasource("delete",e,t)).then(function(e){return e})},o.datasource=i,e.mixin(o,{ajax:{dataType:"json"},bind:$.noop,unbind:$.noop,_init:$.noop,_create:$.noop},t,s),o.configure=function(e,t){var n;if(typeof e=="string"||typeof e=="function")n=e,e=null;else if(typeof t=="string"||typeof t=="function")n=t,t=null;else if(!t&&(e||this.data)){e=e||this;if(e.data||e.url||e.events||e.datasource)t=_.extend({},e),e=_.result(e,"data")}t=t||{},t.datasource=t.datasource||o.datasource,n&&(t.url=n),e&&(t.data=e);var r=t.events||{};return delete t.events,{events:r,options:t}},o.prototype.serialize=function(e){this.data?this.data instanceof Array?(this.data.splice(0,this.data.length),this.data.push.apply(this,e)):_.extend(this.data,e):this.data=e},o.prototype.deserialize=function(){return this.data},o.prototype.get=function(e){return this.data[e]},o.prototype.set=function(e,t){this.data[e]=t},function(){var e=r.resource.extend({load:o,extension:"js"});r.register("model",new e)}(),o}),n("src/fetch",[],function(){function t(t){if(!t)throw"Invalid settings";typeof t=="string"&&(t={url:t});if(t.url in e==0||t.refresh===!0){var n=_.extend({url:t.url,cache:!1},t.ajax);e[t.url]=$.ajax(n),t.cache===!1&&e[t.url].always(function(){delete e[t.url]})}return e[t.url]}var e={};return t.get=function(t){return e[t]},t.remove=function(t){t in e&&delete e[t]},t.clear=function(){for(var t in e)delete e[t]},t}),n("src/style",["src/fetch","src/spromise","src/resources"],function(e,t,n){function r(e){var t=e.lastIndexOf(".");if(t!==-1)return e.substr(t+1)}function i(t,n){return e({url:t,ajax:{dataType:n}})}function s(e){if(this instanceof s==0)return new s(e);var n=t();e=e||{};if(typeof e.url=="string"){e.type=e.type||r(e.url);var i=s.handler[e.type];i&&i.load(e,n)}else n.reject("No suitable option");return n}return s.handler={css:{dataType:"text",load:function(e,t){i(e.url,"text").done(function(e){$("<style type='text/css'>"+e+"</style>").appendTo("head"),t.resolve(e)})}},$css:{load:function(e,t){i(e.url,"json").done(function(n){e.element instanceof jQuery&&e.element.css(n),t.resolve(n)})}},less:{load:function(e,t){i(e.url,"text").done(function(e){t.resolve(e)})}}},function(){var e=n.resource.extend({load:s,extension:"css"});n.register("style",new e)}(),s}),n("src/tmpl",["src/fetch","src/spromise","src/resources"],function(e,t,n){function r(e,n){if(this instanceof r==0)return new r(e,n);e=e||{},n=n||e.selector||r.selector;var i=t(),s="["+n+"]";return typeof e.url=="string"?r.loader(e).done(i.resolve).fail(i.reject):typeof e.html=="string"||e.html instanceof jQuery==1?i.resolve(e.html):i.resolve(e),i.then(function(e){var i=$(e),o=i.filter(s).add(i.children(s)).add(i.find(s)).map(function(){var e=$(this);return r({url:e.attr(n)}).done(function(t){e.append($(t))})});return o.length?t.when.apply(r,o).then(function(){return i}):i})}return r.selector="mjs-tmpl",r.loader=e,function(){var e=n.resource.extend({load:r,extension:"html"});n.register("tmpl",new e)}(),r}),n("src/view",["src/extender","src/events","src/resources","src/spromise"],function(e,t,n,r){function i(e){var t=e.resources||(e.resources={}),n=e.fqn,i=o.resources(t,n),s;return!i.tmpl&&i.tmpl!==!1&&(i.tmpl=_.result(e,"tmpl")||n&&o.resources(["tmpl!url"],n).tmpl),!i.style&&e.style&&(i.style=_.result(e,"style")),!i.model&&e.model&&(i.model=_.result(e,"model")),s=_.map(i,function(t,n){return r.when(t).done(function(t){e[n]=t,e[n]=_.result(e,n)}),t}),r.when.apply(e,s)}function s(e){var t=e.tmpl,n=e.model,r=e.resources;t&&e.$el.append(t),n&&n.bind(e.$el);for(var i in r)r.hasOwnProperty(i)&&_.isFunction(r[i].loaded)&&r[i].loaded.call(e[i],e)}function o(e){var t=this,n=r(),u=o.configure.apply(t,arguments);t.events&&u.pevents!==!1&&(t.on(t.events),t.on.call(t.$el,t.events,t)),u.events&&(t.on(u.events),t.on.call(t.$el,u.events,t)),_.extend(t,u.options),t.$el.addClass(t.className),t.ready=n.done,r.when(i(t)).then(function(){return r.when(t._init(e))}).then(function(){return r.when(s(t))}).then(function(){return r.when(t._create(e))}).then(function(){t._create(),t.trigger("view:ready",[t,e]),n.resolve(t)})}return e.mixin(o,{tagName:"div",className:"view",_init:$.noop,_create:$.noop,_destroy:$.noop},t),o.prototype.destroy=function(){this._destroy(),this.trigger("view:destroy"),this.model&&this.model.unbind(),this.off().off.call(this.$el),this.$el.remove()},o.prototype.transition=function(e,t){var n=this._lastView;if(n===e)return;this.trigger("view:transition",[e,n]),n&&(n.trigger("view:leave",[this]),this.managed!==!1&&typeof n.destroy=="function"&&n.destroy()),this._lastView=e,t?$(t,this.$el).append(e.$el||e):this.$el.append(e.$el||e),e.trigger("view:enter",[this])},o.configure=function(e){e instanceof jQuery?e={$el:e}:e=_.extend({},e),e.settings=e.settings||{};var t=_.extend({},e.events);delete e.events;var n=e.tagName||this.tagName;e.$el=e.$el||$("<"+n+">");var r=e.fqn||this.fqn;if(r){var i=r.split("/");e.settings.name=i.pop(),e.settings.path=i.join("/"),e.settings.namespace=i.join(".")}return e.className=e.className||e.settings.name||this.className,{events:t,options:e}},o.resources=n,o}),n("src/mortar",["src/extender","src/events","src/hash.route","src/model","src/fetch","src/style","src/tmpl","src/view","src/resources","src/spromise"],function(e,t,n,r,i,s,o,u,a,f){return{extender:e,events:t,hash:n,model:r,fetch:i,style:s,tmpl:o,view:u,resources:a,promise:f}}),t("src/mortar")});