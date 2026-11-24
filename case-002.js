if(new URLSearchParams(location.search).get('reset')==='1'){
  Object.keys(localStorage).filter(key=>key.startsWith('mc-')).forEach(key=>localStorage.removeItem(key));
  location.replace('case-003.html?reset=1');
}const case1Solved=localStorage.getItem('mc-case-001-solved-v2')==='true';
const case2AlreadyOpen=localStorage.getItem('mc-case-002-access-v1')==='true';
const cameFromCase1=new URLSearchParams(location.search).get('unlocked')==='1';
const case2Allowed=case1Solved||case2AlreadyOpen||cameFromCase1;
document.querySelector('#casePage').hidden=!case2Allowed;
document.querySelector('#lockedScreen').hidden=case2Allowed;
if(case2Allowed)localStorage.setItem('mc-case-002-access-v1','true');const keys={files:'mc-case-002-files-v1',timeline:'mc-case-002-timeline-v1',leads:'mc-case-002-leads-v1',links:'mc-case-002-links-v1',solved:'mc-case-002-solved-v1'};
let found=new Set(JSON.parse(localStorage.getItem(keys.files)||'[]'));
let stageOne=localStorage.getItem(keys.timeline)==='true';
let leads=new Set(JSON.parse(localStorage.getItem(keys.leads)||'[]'));
let links=new Set(JSON.parse(localStorage.getItem(keys.links)||'[]'));
let solved=localStorage.getItem(keys.solved)==='true';
let timeline=[];let selected=[];
const firstTexts={photo:'The back is marked “two prints made.” At the edge of the negative, someone pencilled B-17.',door:'The booth was sealed at 1:48. A second key was signed out at 1:31 and returned at 1:54. The name beside it has been torn away.',upload:'The camera captured the image at 1:46. It queued the photo while offline, then uploaded it when the cinema Wi-Fi returned at 2:13.'};
const secondTexts={archive:'B—17 is a shelf code, not a camera label. The contact sheet is dated 1986. The girl in the last photograph is part of an older print.',key:'The paper is pressed deep enough to read the missing checkout: “S. Vale.” The spare key was signed out by someone with those initials.',signature:'Samira’s archive intake form is signed “S. Vale.” The letter shapes and pressure marks match the missing name in the key register.'};
const validPairs=[['upload','door'],['photo','archive'],['key','signature']];
function refreshFirst(){
 document.querySelector('#caseTwoProgress').textContent=found.size+' / 3 FILES EXAMINED';document.querySelector('#caseTwoProgressFill').style.width=(found.size/3*100)+'%';
 document.querySelector('#timelinePanel').hidden=found.size<3||stageOne;
 document.querySelector('#actTwo').hidden=!stageOne;
 document.querySelector('#caseTwoSolved').hidden=!solved;
 document.querySelectorAll('[data-case2-clue]').forEach(b=>{const id=b.dataset.case2Clue;if(found.has(id)){const p=document.querySelector('#case2-'+id);p.textContent=firstTexts[id];p.hidden=false;b.innerHTML='FILE EXAMINED <b>✓</b>';}});
 refreshSecond();
}
function refreshSecond(){
 document.querySelector('#actTwoProgress').textContent=leads.size+' / 3 NEW LEADS EXAMINED';document.querySelector('#caseTwoBoard').hidden=leads.size<3;
 document.querySelectorAll('[data-act2-clue]').forEach(b=>{const id=b.dataset.act2Clue;if(leads.has(id)){const p=document.querySelector('#act2-'+id);p.textContent=secondTexts[id];p.hidden=false;b.innerHTML='LEAD RECOVERED <b>✓</b>';}});
 document.querySelectorAll('[data-linkclue]').forEach(b=>{b.disabled=leads.size<3;b.classList.toggle('selected',selected.includes(b.dataset.linkclue));b.classList.toggle('linked',links.has(String(validPairs.findIndex(pair=>pair.includes(b.dataset.linkclue)))));});
 const fileButton=document.querySelector('#fileCaseTwo');fileButton.disabled=links.size<3;
 document.querySelector('#caseTwoBoardStatus').textContent=links.size+' / 3 CONNECTIONS MADE · '+(leads.size<3?'EXAMINE ALL THREE NEW LEADS':'CONNECT THE DETAILS THAT EXPLAIN EACH OTHER');
 document.querySelector('#caseTwoLinks').innerHTML=[...links].map(i=>'<span>CONNECTION '+(Number(i)+1)+' COMPLETE</span>').join('');
}
function refresh(){refreshFirst();}
document.querySelectorAll('[data-case2-clue]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.case2Clue;found.add(id);localStorage.setItem(keys.files,JSON.stringify([...found]));const p=document.querySelector('#case2-'+id);p.textContent=firstTexts[id];p.hidden=false;b.innerHTML='FILE EXAMINED <b>✓</b>';refresh();}));
document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.event;if(timeline.includes(id)||timeline.length>=3)return;timeline.push(id);b.classList.add('selected');const names={photo:'Photo taken · 1:46',door:'Booth sealed · 1:48',upload:'Photo uploaded · 2:13'};document.querySelector('#timelineOrder').textContent=timeline.map((x,i)=>(i+1)+'. '+names[x]).join('   /   ');document.querySelector('#timelineSubmit').disabled=timeline.length<3;}));
document.querySelector('#timelineSubmit').addEventListener('click',()=>{const out=document.querySelector('#caseTwoResult');out.hidden=false;if(timeline.join(',')==='photo,door,upload'){stageOne=true;localStorage.setItem(keys.timeline,'true');out.innerHTML='<strong>The 2:13 time is a false lead.</strong> The image was taken before the booth was sealed. It uploaded when the connection returned. The photograph does not prove someone was inside at 2:13. Now compare the torn key record with the older print.';refresh();document.querySelector('#actTwo').scrollIntoView({behavior:'smooth',block:'start'});}else{out.textContent='That order does not fit the camera record. Try again using the capture time, the sealed door, and the later upload.';timeline=[];document.querySelectorAll('[data-event]').forEach(x=>x.classList.remove('selected'));document.querySelector('#timelineOrder').textContent='TAP EVENTS TO BUILD THE SEQUENCE';document.querySelector('#timelineSubmit').disabled=true;}});
document.querySelectorAll('[data-act2-clue]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.act2Clue;leads.add(id);localStorage.setItem(keys.leads,JSON.stringify([...leads]));const p=document.querySelector('#act2-'+id);p.textContent=secondTexts[id];p.hidden=false;b.innerHTML='LEAD RECOVERED <b>✓</b>';refreshSecond();}));
document.querySelectorAll('[data-linkclue]').forEach(b=>b.addEventListener('click',()=>{if(leads.size<3)return;const id=b.dataset.linkclue;if(selected.includes(id)){selected=selected.filter(x=>x!==id);b.classList.remove('selected');return;}selected.push(id);b.classList.add('selected');if(selected.length<2){document.querySelector('#caseTwoBoardStatus').textContent='Find the detail that explains “'+id+'”.';return;}const pair=[...selected].sort().join('|');const index=validPairs.findIndex(x=>[...x].sort().join('|')===pair);if(index>=0){links.add(String(index));localStorage.setItem(keys.links,JSON.stringify([...links]));document.querySelector('#caseTwoBoardStatus').textContent='Those details support the same conclusion.';}else{document.querySelector('#caseTwoBoardStatus').textContent='Those clues do not connect yet. Recheck the dates and names.';}selected.forEach(x=>document.querySelector('[data-linkclue="'+x+'"]').classList.remove('selected'));selected=[];refreshSecond();}));
document.querySelector('#fileCaseTwo').addEventListener('click',()=>{if(links.size<3)return;solved=true;localStorage.setItem(keys.solved,'true');refreshFirst();});
const case2Hints=['Compare the time the camera took the photo with the time it uploaded.','A name can still be read even when the paper strip is torn away.','B—17 is the archive shelf code. Ask whether the girl is in the room or in an older print.'];let case2HintIndex=Number(localStorage.getItem('mc-case-002-hints-v1')||0);
document.querySelector('#case2HintButton').textContent=case2HintIndex>=3?'ALL HINTS OPEN ✓':'OPEN HINT · '+[3,5,7][case2HintIndex]+' ◈';document.querySelector('#case2HintButton').addEventListener('click',event=>{case2HintIndex=window.MysteryCredits.reveal(event.currentTarget,document.querySelector('#case2HintMessage'),case2Hints,case2HintIndex,'mc-case-002-hints-v1');});refresh();








