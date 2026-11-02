// Season calendar. Rides retire themselves the day after they end, so past dates never linger as bookable.
// Earlier 2026 dates follow the season poster; upcoming dates follow Audax Malaysia's current listings (checked 2 Nov 2026).
const AudaxCalendar=(()=>{
 const base='/preview/bespoke/audax-malaysia',official='https://www.audaxmalaysia.com',upcomingUrl=official+'/upcoming-rides';
 const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const today=(()=>{const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();})();
 const earlier=[
 {month:0,dates:'18',name:'Pink Ride 9.0',format:'BRM200',url:official+'/audax-kiarabay-pinkride-9'},
 {month:3,dates:'11–12',name:'Easter Day Team Ride',format:'Flèche 360 km',url:official+'/past-rides'},
 {month:4,dates:'10',name:'LRM1300 training ride',format:'200 km',url:official+'/past-rides'},
 {month:4,dates:'23–27',name:'The Great Loop',format:'LRM1300',url:official+'/past-rides'},
 {month:5,dates:'27–28',name:'Audax Peaks Challenge',format:'BRM300',url:official+'/past-rides'},
 {month:6,dates:'25–26',name:'The Big Hills 8',format:'BRM200 · BRM600',url:official+'/past-rides'},
 {month:7,dates:'15–16',name:'Audax Merdeka Ride',format:'BRM400',url:official+'/past-rides'},
 {month:8,dates:'12–15',name:'Road to Paris',format:'BRM1000',url:official+'/road-to-paris-1000'},
 {month:9,dates:'17–18',name:'The Ice Cream Ride 3.0',format:'Permanent 130 · BRM300',url:official+'/audax-ice-cream-ride-3'},
 {month:10,dates:'1',name:'A Ride with the Super Randonneurs',format:'55 km',url:official+'/superrandonneurs2025'}
 ];
 // Announced on the official calendar; registration not yet open.
 const announced=[
 ['Ramadhan Night Ride','BRM200 · 9:00 pm start','2027',1,'27','20270227','20270228'],
 ['Audax Post-Raya 300','BRM300','2027',2,'27','20270327','20270328'],
 ['Flèches Nationales','360 km in 24 h · BRM400','2027',3,'17','20270417','20270419'],
 ['Audax Big Hills 9','BRM200 · BRM600','2027',4,'22','20270522','20270525'],
 ['Audax Peaks Challenge','BRM300','2027',5,'19','20270619','20270620'],
 ['Audax 11th Anniversary 200','BRM200','2027',6,'11','20270711','20270712'],
 ['Audax Merdeka Ride 2027','BRM400','2027',7,'21','20270821','20270823'],
 ['Audax BRM1000','BRM1000','2027',8,'11–14','20270911','20270915'],
 ['Audax Santai 600','BRM600','2027',9,'16','20271016','20271018'],
 ['Audax New Season BRM300','BRM300','2027',10,'13','20271113','20271114'],
 ['The Last Light','BRM400','2027',11,'18','20271218','20271220'],
 ['Audax Pink 11','BRM200','2028',0,'TBA','20280101','20280131']
 ].map(([name,format,year,month,dates,start,end])=>({name,format,year,month,dates,start,end,url:upcomingUrl,external:true,announced:true}));
 let current=[];
 function setRides(rides){current=rides.filter(r=>r.cal).map(r=>({month:r.cal[0],year:r.year,dates:r.cal[1],name:r.name,format:r.calFormat||r.distanceLabels.join(' · '),url:base+'/rides/'+r.id+'/',book:r.open?r.id:null,start:r.cal[2],end:r.cal[3],venue:r.venue}));current=[...current,...announced].filter(e=>Number(e.end)>today).sort((a,b)=>a.start.localeCompare(b.start));}
 const iso=s=>s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8);
 const event=e=>`<li class="season-event"><div class="season-event-date"><time ${e.start&&e.dates!=='TBA'?`datetime="${iso(e.start)}"`:''}>${e.dates}</time><span>${e.format}</span></div><h4><a href="${e.url}" ${e.url.startsWith(official)?'target="_blank" rel="noopener noreferrer"':''}>${e.name}</a></h4>${e.current?`<div class="season-event-actions">${e.book?`<button type="button" class="season-book" data-book="${e.book}">Book ride</button>`:e.announced?'<span class="season-pending">Announced</span>':`<a class="text-link" href="${e.url}">Ride details</a><span class="season-pending">Registration to follow</span>`}</div>`:''}</li>`;
 function monthCard(month,year,events,annual=false){return `<article class="season-month ${!events.length?'season-rest':''} ${annual&&events.length&&!events.some(e=>e.current)?'season-earlier':''}"><div class="season-month-heading"><h3>${months[month]}</h3><span>${year}</span></div>${events.length?`<ul>${events.map(event).join('')}</ul>`:'<p class="season-rest-copy">Rest month.</p>'}</article>`;}
 let mode='upcoming',expanded=false;
 function grid(){if(mode==='year')return months.map((m,i)=>monthCard(i,'2026',[...earlier.filter(e=>e.month===i),...current.filter(e=>e.year==='2026'&&e.month===i).map(e=>({...e,current:true}))],true)).join('');let groups=[];for(const e of current){let g=groups.find(g=>g.month===e.month&&g.year===e.year);if(!g){g={month:e.month,year:e.year,events:[]};groups.push(g);}g.events.push({...e,current:true});}const shown=expanded?groups:groups.slice(0,matchMedia('(max-width:760px)').matches?4:8);return shown.map(g=>monthCard(g.month,g.year,g.events)).join('')+(groups.length>shown.length?`<div class="season-more"><button type="button" class="button outline" data-season-more>See all ${groups.length} months ahead</button></div>`:'');}
 const section=()=>`<section class="section season-section" id="ride-calendar" aria-labelledby="season-heading"><div class="season-heading"><h2 id="season-heading">Your riding year.</h2><div class="season-tabs" role="group" aria-label="Calendar view"><button type="button" data-season="upcoming" aria-pressed="true">Upcoming</button><button type="button" data-season="year" aria-pressed="false">2026 season</button></div></div><div class="season-grid" id="season-grid">${grid()}</div><div class="season-footer"><p id="season-note">Rides drop off the calendar once they finish. Announced dates may change; check each ride before booking.</p><a class="text-link" href="${base}/audax-upcoming-rides.ics" download>Save upcoming dates</a></div><p class="season-live" id="season-live" aria-live="polite"></p></section>`;
 function init(){document.addEventListener('click',e=>{if(e.target.closest('[data-season-more]')){expanded=true;document.getElementById('season-grid').innerHTML=grid();document.getElementById('season-live').textContent='All announced months shown.';}});document.querySelectorAll('[data-season]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.season;document.getElementById('season-grid').innerHTML=grid();document.getElementById('season-grid').classList.toggle('season-year',mode==='year');document.querySelectorAll('[data-season]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.season===mode)));document.getElementById('season-note').textContent=mode==='year'?'Earlier 2026 dates follow Audax’s season plan. Finished rides are kept for the record.':'Rides drop off the calendar once they finish. Announced dates may change; check each ride before booking.';document.getElementById('season-live').textContent=mode==='year'?'2026 season calendar shown.':'Upcoming rides shown.';}));}
 return {setRides,section,init,today};
})();
