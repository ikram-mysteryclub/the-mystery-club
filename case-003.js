if(new URLSearchParams(location.search).get('reset')==='1'){
  Object.keys(localStorage).filter(key=>key.startsWith('mc-')).forEach(key=>localStorage.removeItem(key));
  location.replace('index.html?fresh=1');
}const previousSolved=localStorage.getItem('mc-case-002-solved-v1')==='true';
const alreadyOpen=localStorage.getItem('mc-case-003-access-v1')==='true';
const fromCase2=new URLSearchParams(location.search).get('unlocked')==='1';
const allowed=previousSolved||alreadyOpen||fromCase2;
document.querySelector('#finalPage').hidden=!allowed;
document.querySelector('#finalLock').hidden=allowed;
if(allowed)localStorage.setItem('mc-case-003-access-v1','true');const keys={leads:'mc-case-003-leads-v1',timeline:'mc-case-003-timeline-v1',links:'mc-case-003-links-v1',solved:'mc-case-003-solved-v1'};
let leads=new Set(JSON.parse(localStorage.getItem(keys.leads)||'[]'));
let timelineDone=localStorage.getItem(keys.timeline)==='true';
let links=new Set(JSON.parse(localStorage.getItem(keys.links)||'[]'));
let solved=localStorage.getItem(keys.solved)==='true';let events=[];let selected=[];
const texts={
 tape:'The tape was recorded on 14 October 1996. A clean splice appears at exactly nine seconds—the length of the signal burst.',
 wave:'The waveform matches the burst from Case 001 exactly. The little clicks and gaps repeat in the same places.',
 tide:'The harbor reaches its lowest point at 12:07. A handwritten mark circles this time on every October chart.',
 auto:'The relay switch was left on AUTO. A wet contact wire closes when the tide reaches its lowest point.',
 bell:'The bell wire runs below the harbor floor to the old relay room. Two rings can be heard through the relay casing.',
 note:'The margin says: “If the first voice returns, don’t answer. Listen for what follows.” A second line reads: “Two rings.”'
};
const pairs=[['tape','wave'],['tide','auto'],['bell','note']];
function refresh(){
 document.querySelector('#thirdProgress').textContent=leads.size+' / 6 FRAGMENTS RECOVERED';document.querySelector('#thirdProgressFill').style.width=(leads.size/6*100)+'%';
 document.querySelector('#thirdTimeline').hidden=leads.size<6||timelineDone;
 document.querySelector('#thirdBoard').hidden=!timelineDone;
 document.querySelector('#archiveFinale').hidden=!solved;
 document.querySelectorAll('[data-third-lead]').forEach(b=>{const id=b.dataset.thirdLead;if(leads.has(id)){const p=document.querySelector('#third-'+id);p.textContent=texts[id];p.hidden=false;b.innerHTML='FRAGMENT RECOVERED <b>✓</b>';}});
 document.querySelectorAll('[data-third-link]').forEach(b=>{b.disabled=leads.size<6;b.classList.toggle('selected',selected.includes(b.dataset.thirdLink));b.classList.toggle('linked',links.has(String(pairs.findIndex(pair=>pair.includes(b.dataset.thirdLink)))));});
 document.querySelector('#thirdBoardStatus').textContent=links.size+' / 3 CONNECTIONS MADE · '+(leads.size<6?'RECOVER ALL FRAGMENTS FIRST':'CONNECT THE RECORDS THAT EXPLAIN EACH OTHER');
 document.querySelector('#thirdLinks').innerHTML=[...links].map(i=>'<span>CONNECTION '+(Number(i)+1)+' COMPLETE</span>').join('');document.querySelector('#solveFinalCase').disabled=links.size<3;
}
document.querySelectorAll('[data-third-lead]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.thirdLead;leads.add(id);localStorage.setItem(keys.leads,JSON.stringify([...leads]));const p=document.querySelector('#third-'+id);p.textContent=texts[id];p.hidden=false;button.innerHTML='FRAGMENT RECOVERED <b>✓</b>';refresh();}));
document.querySelectorAll('[data-third-event]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.thirdEvent;if(events.includes(id)||events.length>=4)return;events.push(id);button.classList.add('selected');const names={tape:'Cassette recorded · 1996',switch:'Relay set to auto · 11:58',tide:'Low tide · 12:07',playback:'Voice plays · 12:07'};document.querySelector('#thirdOrder').textContent=events.map((x,i)=>(i+1)+'. '+names[x]).join('   /   ');document.querySelector('#thirdTimelineSubmit').disabled=events.length<4;}));
document.querySelector('#thirdTimelineSubmit').addEventListener('click',()=>{const feedback=document.querySelector('#thirdTimelineFeedback');feedback.hidden=false;if(events.join(',')==='tape,switch,tide,playback'){timelineDone=true;localStorage.setItem(keys.timeline,'true');feedback.innerHTML='<strong>The relay completed the chain.</strong> An old recording was armed before the tide fell. When the water closed the contact at 12:07, the same voice played again. Now connect the tape, the tide, and the bell note.';refresh();document.querySelector('#thirdBoard').scrollIntoView({behavior:'smooth',block:'start'});}else{feedback.textContent='The chain is out of order. The recording came first; the tide triggered what happened next.';events=[];document.querySelectorAll('[data-third-event]').forEach(x=>x.classList.remove('selected'));document.querySelector('#thirdOrder').textContent='TAP EVENTS TO BUILD THE SEQUENCE';document.querySelector('#thirdTimelineSubmit').disabled=true;}});
document.querySelectorAll('[data-third-link]').forEach(button=>button.addEventListener('click',()=>{if(leads.size<6)return;const id=button.dataset.thirdLink;if(selected.includes(id)){selected=selected.filter(x=>x!==id);button.classList.remove('selected');return;}selected.push(id);button.classList.add('selected');if(selected.length<2){document.querySelector('#thirdBoardStatus').textContent='Which fragment explains “'+id+'”?';return;}const key=[...selected].sort().join('|');const index=pairs.findIndex(pair=>[...pair].sort().join('|')===key);if(index>=0){links.add(String(index));localStorage.setItem(keys.links,JSON.stringify([...links]));document.querySelector('#thirdBoardStatus').textContent='Those fragments form a solid connection.';}else{document.querySelector('#thirdBoardStatus').textContent='That connection does not fit the records. Recheck the timing and the source.';}selected.forEach(x=>document.querySelector('[data-third-link="'+x+'"]').classList.remove('selected'));selected=[];refresh();}));
document.querySelector('#solveFinalCase').addEventListener('click',()=>{if(links.size<3)return;solved=true;localStorage.setItem(keys.solved,'true');refresh();document.querySelector('#archiveFinale').scrollIntoView({behavior:'smooth',block:'start'});});
const hints=['Compare the tiny clicks and gaps in the current burst with the old tape.','The relay is not a person. Check what changes when the tide drops.','The note tells you the bell is part of the circuit, not a signal from the tower.'];let hintIndex=Number(localStorage.getItem('mc-case-003-hints-v1')||0);
document.querySelector('#thirdHintButton').textContent=hintIndex>=3?'ALL HINTS OPEN ✓':'OPEN HINT · '+[3,5,7][hintIndex]+' ◈';document.querySelector('#thirdHintButton').addEventListener('click',event=>{hintIndex=window.MysteryCredits.reveal(event.currentTarget,document.querySelector('#thirdHintMessage'),hints,hintIndex,'mc-case-003-hints-v1');});
refresh();





