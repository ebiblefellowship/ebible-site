/* http://keith-wood.name/countdown.html
   Countdown for jQuery v1.5.4.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it.
	 *** 10-17-2009 Changed for EBible so it calculates the days remaining differently for the 
	 days after the 21st of the month. */
(function(g){function b(){this.regional=[];this.regional[""]={labels:["Years","Months","Weeks","Days","Hours","Minutes","Seconds"],labels1:["Year","Month","Week","Day","Hour","Minute","Second"],compactLabels:["y","m","w","d"],timeSeparator:":",isRTL:false};this._defaults={until:null,since:null,timezone:null,serverSync:null,format:"dHMS",layout:"",compact:false,description:"",expiryUrl:"",expiryText:"",alwaysExpire:false,onExpiry:null,onTick:null};g.extend(this._defaults,this.regional[""])}var j="countdown";var c=0;var h=1;var d=2;var a=3;var k=4;var i=5;var f=6;g.extend(b.prototype,{markerClassName:"hasCountdown",_timer:setInterval(function(){g.countdown._updateTargets()},980),_timerTargets:[],setDefaults:function(l){this._resetExtraLabels(this._defaults,l);e(this._defaults,l||{})},UTCDate:function(n,r,p,s,t,m,o,l){if(typeof r=="object"&&r.constructor==Date){l=r.getMilliseconds();o=r.getSeconds();m=r.getMinutes();t=r.getHours();s=r.getDate();p=r.getMonth();r=r.getFullYear()}var q=new Date();q.setUTCFullYear(r);q.setUTCDate(1);q.setUTCMonth(p||0);q.setUTCDate(s||1);q.setUTCHours(t||0);q.setUTCMinutes((m||0)-(Math.abs(n)<30?n*60:n));q.setUTCSeconds(o||0);q.setUTCMilliseconds(l||0);return q},_attachCountdown:function(o,m){var l=g(o);if(l.hasClass(this.markerClassName)){return}l.addClass(this.markerClassName);var n={options:g.extend({},m),_periods:[0,0,0,0,0,0,0]};g.data(o,j,n);this._changeCountdown(o)},_addTarget:function(l){if(!this._hasTarget(l)){this._timerTargets.push(l)}},_hasTarget:function(l){return(g.inArray(l,this._timerTargets)>-1)},_removeTarget:function(l){this._timerTargets=g.map(this._timerTargets,function(m){return(m==l?null:m)})},_updateTargets:function(){for(var l=0;l<this._timerTargets.length;l++){this._updateCountdown(this._timerTargets[l])}},_updateCountdown:function(q,o){var m=g(q);o=o||g.data(q,j);if(!o){return}m.html(this._generateHTML(o));m[(this._get(o,"isRTL")?"add":"remove")+"Class"]("countdown_rtl");var n=this._get(o,"onTick");if(n){n.apply(q,[o._hold!="lap"?o._periods:this._calculatePeriods(o,o._show,new Date())])}var r=o._hold!="pause"&&(o._since?o._now.getTime()<=o._since.getTime():o._now.getTime()>=o._until.getTime());if(r&&!o._expiring){o._expiring=true;if(this._hasTarget(q)||this._get(o,"alwaysExpire")){this._removeTarget(q);var l=this._get(o,"onExpiry");if(l){l.apply(q,[])}var t=this._get(o,"expiryText");if(t){var p=this._get(o,"layout");o.options.layout=t;this._updateCountdown(q,o);o.options.layout=p}var s=this._get(o,"expiryUrl");if(s){window.location=s}}o._expiring=false}else{if(o._hold=="pause"){this._removeTarget(q)}}g.data(q,j,o)},_changeCountdown:function(q,n,p){n=n||{};if(typeof n=="string"){var m=n;n={};n[m]=p}var o=g.data(q,j);if(o){this._resetExtraLabels(o.options,n);e(o.options,n);this._adjustSettings(q,o);g.data(q,j,o);var l=new Date();if((o._since&&o._since<l)||(o._until&&o._until>l)){this._addTarget(q)}this._updateCountdown(q,o)}},_resetExtraLabels:function(o,l){var m=false;for(var p in l){if(p.match(/[Ll]abels/)){m=true;break}}if(m){for(var p in o){if(p.match(/[Ll]abels[0-9]/)){o[p]=null}}}},_adjustSettings:function(p,o){var l=this._get(o,"serverSync");l=(l?l.apply(p,[]):null);var m=new Date();var n=this._get(o,"timezone");n=(n==null?-m.getTimezoneOffset():n);o._since=this._get(o,"since");if(o._since){o._since=this.UTCDate(n,this._determineTime(o._since,null));if(o._since&&l){o._since.setMilliseconds(o._since.getMilliseconds()+m.getTime()-l.getTime())}}o._until=this.UTCDate(n,this._determineTime(this._get(o,"until"),m));if(l){o._until.setMilliseconds(o._until.getMilliseconds()+m.getTime()-l.getTime())}o._show=this._determineShow(o)},_destroyCountdown:function(m){var l=g(m);if(!l.hasClass(this.markerClassName)){return}this._removeTarget(m);l.removeClass(this.markerClassName).empty();g.removeData(m,j)},_pauseCountdown:function(l){this._hold(l,"pause")},_lapCountdown:function(l){this._hold(l,"lap")},_resumeCountdown:function(l){this._hold(l,null)},_hold:function(o,n){var m=g.data(o,j);if(m){if(m._hold=="pause"&&!n){m._periods=m._savePeriods;var l=(m._since?"-":"+");m[m._since?"_since":"_until"]=this._determineTime(l+m._periods[0]+"y"+l+m._periods[1]+"o"+l+m._periods[2]+"w"+l+m._periods[3]+"d"+l+m._periods[4]+"h"+l+m._periods[5]+"m"+l+m._periods[6]+"s");this._addTarget(o)}m._hold=n;m._savePeriods=(n=="pause"?m._periods:null);g.data(o,j,m);this._updateCountdown(o,m)}},_getTimesCountdown:function(m){var l=g.data(m,j);return(!l?null:(!l._hold?l._periods:this._calculatePeriods(l,l._show,new Date())))},_get:function(m,l){return(m.options[l]!=null?m.options[l]:g.countdown._defaults[l])},_determineTime:function(o,l){var n=function(r){var q=new Date();q.setTime(q.getTime()+r*1000);return q};var m=function(u){u=u.toLowerCase();var r=new Date();var y=r.getFullYear();var w=r.getMonth();var z=r.getDate();var t=r.getHours();var s=r.getMinutes();var q=r.getSeconds();var x=/([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;var v=x.exec(u);while(v){switch(v[2]||"s"){case"s":q+=parseInt(v[1],10);break;case"m":s+=parseInt(v[1],10);break;case"h":t+=parseInt(v[1],10);break;case"d":z+=parseInt(v[1],10);break;case"w":z+=parseInt(v[1],10)*7;break;case"o":w+=parseInt(v[1],10);z=Math.min(z,g.countdown._getDaysInMonth(y,w));break;case"y":y+=parseInt(v[1],10);z=Math.min(z,g.countdown._getDaysInMonth(y,w));break}v=x.exec(u)}return new Date(y,w,z,t,s,q,0)};var p=(o==null?l:(typeof o=="string"?m(o):(typeof o=="number"?n(o):o)));if(p){p.setMilliseconds(0)}return p},_getDaysInMonth:function(l,m){return 32-new Date(l,m,32).getDate()},_generateHTML:function(n){n._periods=periods=(n._hold?n._periods:this._calculatePeriods(n,n._show,new Date()));var t=false;var l=0;for(var r=0;r<n._show.length;r++){t|=(n._show[r]=="?"&&periods[r]>0);n._show[r]=(n._show[r]=="?"&&!t?null:n._show[r]);l+=(n._show[r]?1:0)}var s=this._get(n,"compact");var p=this._get(n,"layout");var o=(s?this._get(n,"compactLabels"):this._get(n,"labels"));var v=this._get(n,"timeSeparator");var u=this._get(n,"description")||"";var q=function(x){var w=g.countdown._get(n,"compactLabels"+periods[x]);return(n._show[x]?periods[x]+(w?w[x]:o[x])+" ":"")};var m=function(x){var w=g.countdown._get(n,"labels"+periods[x]);return(n._show[x]?'<span class="countdown_section"><span class="countdown_amount">'+periods[x]+"</span><br/>"+(w?w[x]:o[x])+"</span>":"")};return(p?this._buildLayout(n,p,s):((s?'<span class="countdown_row countdown_amount'+(n._hold?" countdown_holding":"")+'">'+q(c)+q(h)+q(d)+q(a)+(n._show[k]?this._minDigits(periods[k],2):"")+(n._show[i]?(n._show[k]?v:"")+this._minDigits(periods[i],2):"")+(n._show[f]?(n._show[k]||n._show[i]?v:"")+this._minDigits(periods[f],2):""):'<span class="countdown_row countdown_show'+l+(n._hold?" countdown_holding":"")+'">'+m(c)+m(h)+m(d)+m(a)+m(k)+m(i)+m(f))+"</span>"+(u?'<span class="countdown_row countdown_descr">'+u+"</span>":"")))},_buildLayout:function(o,r,t){var q=this._get(o,(t?"compactLabels":"labels"));var l=function(w){return(g.countdown._get(o,(t?"compactLabels":"labels")+o._periods[w])||q)[w]};var u=function(x,w){return Math.floor(x/w)%10};var m={desc:this._get(o,"description"),sep:this._get(o,"timeSeparator"),yl:l(c),yn:o._periods[c],ynn:this._minDigits(o._periods[c],2),ynnn:this._minDigits(o._periods[c],3),y1:u(o._periods[c],1),y10:u(o._periods[c],10),y100:u(o._periods[c],100),ol:l(h),on:o._periods[h],onn:this._minDigits(o._periods[h],2),onnn:this._minDigits(o._periods[h],3),o1:u(o._periods[h],1),o10:u(o._periods[h],10),o100:u(o._periods[h],100),wl:l(d),wn:o._periods[d],wnn:this._minDigits(o._periods[d],2),wnnn:this._minDigits(o._periods[d],3),w1:u(o._periods[d],1),w10:u(o._periods[d],10),w100:u(o._periods[d],100),dl:l(a),dn:o._periods[a],dnn:this._minDigits(o._periods[a],2),dnnn:this._minDigits(o._periods[a],3),d1:u(o._periods[a],1),d10:u(o._periods[a],10),d100:u(o._periods[a],100),hl:l(k),hn:o._periods[k],hnn:this._minDigits(o._periods[k],2),hnnn:this._minDigits(o._periods[k],3),h1:u(o._periods[k],1),h10:u(o._periods[k],10),h100:u(o._periods[k],100),ml:l(i),mn:o._periods[i],mnn:this._minDigits(o._periods[i],2),mnnn:this._minDigits(o._periods[i],3),m1:u(o._periods[i],1),m10:u(o._periods[i],10),m100:u(o._periods[i],100),sl:l(f),sn:o._periods[f],snn:this._minDigits(o._periods[f],2),snnn:this._minDigits(o._periods[f],3),s1:u(o._periods[f],1),s10:u(o._periods[f],10),s100:u(o._periods[f],100)};var p=r;for(var n=0;n<7;n++){var s="yowdhms".charAt(n);var v=new RegExp("\\{"+s+"<\\}(.*)\\{"+s+">\\}","g");p=p.replace(v,(o._show[n]?"$1":""))}g.each(m,function(y,w){var x=new RegExp("\\{"+y+"\\}","g");p=p.replace(x,w)});return p},_minDigits:function(m,l){m="0000000000"+m;return m.substr(m.length-l)},_determineShow:function(m){var n=this._get(m,"format");var l=[];l[c]=(n.match("y")?"?":(n.match("Y")?"!":null));l[h]=(n.match("o")?"?":(n.match("O")?"!":null));l[d]=(n.match("w")?"?":(n.match("W")?"!":null));l[a]=(n.match("d")?"?":(n.match("D")?"!":null));l[k]=(n.match("h")?"?":(n.match("H")?"!":null));l[i]=(n.match("m")?"?":(n.match("M")?"!":null));l[f]=(n.match("s")?"?":(n.match("S")?"!":null));return l},_calculatePeriods:function(s,w,o){s._now=o;s._now.setMilliseconds(0);var n=new Date(s._now.getTime());if(s._since&&o.getTime()<s._since.getTime()){s._now=o=n}else{if(s._since){o=s._since}else{n.setTime(s._until.getTime());if(o.getTime()>s._until.getTime()){s._now=o=n}}}var u=[0,0,0,0,0,0,0];if(w[c]||w[h]){var p=g.countdown._getDaysInMonth(o.getFullYear(),o.getMonth());var l=g.countdown._getDaysInMonth(n.getFullYear(),n.getMonth());var x=(n.getDate()==o.getDate()||(n.getDate()>=Math.min(p,l)&&o.getDate()>=Math.min(p,l)));var t=function(y){return(y.getHours()*60+y.getMinutes())*60+y.getSeconds()};var m=Math.max(0,(n.getFullYear()-o.getFullYear())*12+n.getMonth()-o.getMonth()+((n.getDate()<o.getDate()&&!x)||(x&&t(n)<t(o))?-1:0));u[c]=(w[c]?Math.floor(m/12):0);u[h]=(w[h]?m-u[c]*12:0);var q=function(y,B,A){var C=y.getDate();var z=A-30;if(C>21&&z>0){y.setDate(C-z)}y.setFullYear(y.getFullYear()+B*u[c]);y.setMonth(y.getMonth()+B*u[h]);if(C>21&&z<0){y.setDate(C-z)}return y};if(s._since){n=q(n,-1,l)}else{o=q(new Date(o.getTime()),+1,p)}}var v=Math.floor((n.getTime()-o.getTime())/1000);var r=function(z,y){u[z]=(w[z]?Math.floor(v/y):0);v-=u[z]*y};r(d,604800);r(a,86400);r(k,3600);r(i,60);r(f,1);return u}});function e(n,m){g.extend(n,m);for(var l in m){if(m[l]==null){n[l]=null}}return n}g.fn.countdown=function(m){var l=Array.prototype.slice.call(arguments,1);if(m=="getTimes"){return g.countdown["_"+m+"Countdown"].apply(g.countdown,[this[0]].concat(l))}return this.each(function(){if(typeof m=="string"){g.countdown["_"+m+"Countdown"].apply(g.countdown,[this].concat(l))}else{g.countdown._attachCountdown(this,m)}})};g.countdown=new b()})(jQuery);