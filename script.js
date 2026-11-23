if(new URLSearchParams(location.search).get('reset')==='1'){
  Object.keys(localStorage).filter(key=>key.startsWith('mc-')).forEach(key=>localStorage.removeItem(key));
  location.replace('case-002.html?reset=1');
}const clueDialog = document.querySelector('#clueDialog');
const clueText = document.querySelector('#clueText');
const result = document.querySelector('#result');
const select = document.querySelector('#suspectChoice');

document.querySelectorAll('.clue-button').forEach(button => {
  button.addEventListener('click', () => {
    clueText.textContent = button.dataset.clue;
    clueDialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => clueDialog.close());
document.querySelector('.dialog-done').addEventListener('click', () => clueDialog.close());
clueDialog.addEventListener('click', event => {
  if (event.target === clueDialog) clueDialog.close();
});

document.querySelectorAll('.suspect-select').forEach(button=>button.addEventListener('click',()=>{
  const target={"Arthur Moss":"arthur","Inez Rook":"inez","Leo Wren":"leo"}[button.dataset.suspect];
  const contact=document.querySelector('.contact[data-chat="'+target+'"]');if(contact)contact.click();
  document.querySelector('#phone').scrollIntoView({behavior:'smooth',block:'start'});
}));
const keys={solved:'mc-case-001-solved-v2',audio:'mc-case-001-audio-v2',found:'mc-case-001-found-v2',links:'mc-case-001-links-v2',hints:'mc-case-001-hints-v2',case2:'mc-case-002-open-v2'};
let solved=localStorage.getItem(keys.solved)==='true';let decoded=localStorage.getItem(keys.audio)==='true';
let found=new Set(JSON.parse(localStorage.getItem(keys.found)||'[]'));let links=new Set(JSON.parse(localStorage.getItem(keys.links)||'[]'));let hintIndex=Number(localStorage.getItem(keys.hints)||0);let selected=[];
const required=[['rope','alibi'],['pulse','operator'],['battery','window']];
const clueNames={pulse:'9-second signal burst',operator:'Marine operator license',battery:'Backup battery removed',window:'Light below the lantern',rope:'Boat never left the dock',alibi:'Inez’s story changed'};
const hints=['Compare what Inez said about leaving with what the boat tells you.','A radio operator knows what a signal burst should sound like. Connect her license to the recording.','The light was below the lantern. Which missing object could power something in that room?'];
const cipherResult=document.querySelector('#cipherResult'),caseTwoButton=document.querySelector('#caseTwoButton'),nextCase=document.querySelector('#nextCase'),boardStatus=document.querySelector('#boardStatus'),solveButton=document.querySelector('#solveButton');
function persist(){localStorage.setItem(keys.found,JSON.stringify([...found]));localStorage.setItem(keys.links,JSON.stringify([...links]));}
function refreshProgress(){
  document.querySelector('#fieldProgress').textContent=found.size+' / 6 DETAILS RECOVERED';document.querySelector('#fieldProgressFill').style.width=(found.size/6*100)+'%';
  document.querySelectorAll('.board-clue').forEach(b=>{b.disabled=!found.has(b.dataset.boardclue);b.classList.toggle('found',found.has(b.dataset.boardclue));b.classList.toggle('linked',links.has(required.findIndex(pair=>pair.includes(b.dataset.boardclue)).toString()));});
  if(decoded){cipherResult.hidden=false;cipherResult.innerHTML='<strong>VOICE NOTE RESTORED</strong><br>Static, then Arthur’s voice: “Inez, you have to leave before he sees you.” The recording ends with three knocks.';document.querySelector('#cipherAnswer').disabled=true;document.querySelector('#decodeButton').textContent='AUDIO RESTORED ✓';}
  document.querySelector('#linksMade').innerHTML=[...links].map(id=>'<span class="link-chip">LINK '+(Number(id)+1)+' COMPLETE</span>').join('');
  boardStatus.textContent=links.size+' / 3 CONNECTIONS FOUND'+(decoded?' · AUDIO RESTORED':' · RESTORE THE LOCKED AUDIO TO FILE');solveButton.disabled=links.size<3||!decoded;
  if(solved){nextCase.classList.add('unlocked');document.querySelector('#caseLock').textContent='✓';document.querySelector('.next-case-no').textContent='CASE 002 · UNLOCKED';caseTwoButton.disabled=false;caseTwoButton.innerHTML='OPEN CASE 002 <span>↗</span>';}

}
function addLead(button){const id=button.dataset.lead;if(found.has(id))return;found.add(id);persist();const messages={pulse:'The dead receiver logged one clean nine-second burst at 12:07. The signal originated inside the lighthouse.',operator:'A marine-radio operator license is tucked into Inez’s coat. Her certification covers this exact frequency.',battery:'The backup battery is missing. A clean rectangle in the dust shows it was removed recently.',window:'The photograph’s light comes from the east room below the lantern—not from the lighthouse beacon.',rope:'Inez’s boat is still tied to the dock. Salt crust over the knot means it has not been untied since the storm began.',alibi:'Inez told the coast guard she left before midnight. Her later message says the storm kept her on the island.'};document.querySelector('#lead-'+id).textContent=messages[id];document.querySelector('#lead-'+id).hidden=false;button.classList.add('inspected');button.innerHTML='DETAIL RECOVERED <span>✓</span>';refreshProgress();}
document.querySelectorAll('.inspect-lead').forEach(b=>b.addEventListener('click',()=>addLead(b)));
document.querySelectorAll('.board-clue').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.boardclue;if(button.classList.contains('selected')){button.classList.remove('selected');selected=selected.filter(x=>x!==id);return;}button.classList.add('selected');selected.push(id);if(selected.length<2){boardStatus.textContent='Now find the detail that explains “'+clueNames[id]+'”.';return;}const pair=[...selected].sort().join('|');const idx=required.findIndex(x=>[...x].sort().join('|')===pair);if(idx>=0){links.add(String(idx));boardStatus.textContent='The details fit together: '+clueNames[selected[0]]+' ↔ '+clueNames[selected[1]]+'.';}else{boardStatus.textContent='These details do not explain each other yet. Re-read them and try a different connection.';}selected.forEach(x=>document.querySelector('.board-clue[data-boardclue="'+x+'"]').classList.remove('selected'));selected=[];persist();refreshProgress();}));
document.querySelector('#decodeButton').addEventListener('click',()=>{const answer=document.querySelector('#cipherAnswer').value.trim();cipherResult.hidden=false;if(answer==='17'){decoded=true;localStorage.setItem(keys.audio,'true');cipherResult.innerHTML='<strong>LOCK OPEN.</strong> The restored note is added to your board.';refreshProgress();}else{cipherResult.textContent='That code does not work. Count the minutes between 11:50 and 12:07.';}});
solveButton.addEventListener('click',()=>{if(solveButton.disabled)return;solved=true;localStorage.setItem(keys.solved,'true');document.querySelector('#result').hidden=false;document.querySelector('#result').innerHTML='<strong>Case 001 solved.</strong> Inez sent the signal. Her boat never left; her operator’s license explains the clean burst; and the missing battery powered a transmitter in the east room. Arthur’s voice note shows he knew she was there—and feared what she had come back to find. Your deductions are submitted. Case 002 is now unlocked.';refreshProgress();document.querySelector('#result').scrollIntoView({behavior:'smooth',block:'nearest'});});
caseTwoButton.addEventListener('click',()=>{if(!solved)return;localStorage.setItem(keys.case2,'true');window.location.href='case-002.html?unlocked=1';});document.querySelector('#hintButton').addEventListener('click',event=>{const button=event.currentTarget,message=document.querySelector('#hintMessage');if(hintIndex>=hints.length){message.hidden=false;message.textContent='You have opened all three hints.';return;}button.disabled=true;let seconds=5;button.textContent='PREVIEW SPONSOR BREAK · '+seconds+'s';const timer=setInterval(()=>{seconds--;if(seconds>0){button.textContent='PREVIEW SPONSOR BREAK · '+seconds+'s';return;}clearInterval(timer);message.hidden=false;message.textContent='HINT '+(hintIndex+1)+' / '+hints.length+' · '+hints[hintIndex];hintIndex++;localStorage.setItem(keys.hints,String(hintIndex));button.disabled=false;button.innerHTML=hintIndex>=hints.length?'ALL HINTS REVEALED <span>✓</span>':'WATCH PREVIEW SPONSOR BREAK <span>↗</span>';},1000);});
refreshProgress();const menuButton = document.querySelector('#menuButton');
const nav = document.querySelector('#mainNav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
(function(){
const conversations={
 arthur:{name:'Arthur Moss',initial:'A',messages:[['them','You found the backup?'],['me','It was in the keeper’s quarters. Why hide it?'],['them','I didn’t send that signal. I heard it first.'],['them','It came through the radio thirty years ago too.'],['time','11:42 PM · MEMORY FRAGMENT AVAILABLE'],['them','If you go into the east room, don’t turn on the light.']]},
 inez:{name:'Inez Rook',initial:'I',messages:[['them','I told the police I left before midnight.'],['me','But your boat was still tied at the island.'],['them','The storm pinned me there. I didn’t want Arthur to know.'],['them','At 12:07 I heard a voice come through the dead channel.'],['them','It said my name.']]},
 leo:{name:'Leo Wren',initial:'L',messages:[['them','I was at the lighthouse, okay?'],['me','Why did you say you never came ashore?'],['them','Because I saw someone in the east window.'],['them','They were holding a light and looking straight at the sea.'],['them','Then the radio answered them.']]}
};
const messages=document.querySelector('#chatMessages');
function renderChat(key){const c=conversations[key];document.querySelector('#chatName').textContent=c.name;document.querySelector('#chatAvatar').textContent=c.initial;document.querySelector('#chatAvatar').className='avatar avatar-'+key[0];messages.innerHTML='';c.messages.forEach((m,i)=>{const el=document.createElement('div');if(m[0]==='time'){el.className='chat-timestamp';const b=document.createElement('button');b.textContent=m[1]+'  ↗';b.addEventListener('click',()=>{document.querySelector('#phone').scrollIntoView({behavior:'smooth'});document.querySelector('.flashback-card').classList.add('flash-active');setTimeout(()=>document.querySelector('.flashback-card').classList.remove('flash-active'),1300)});el.append(b)}else{el.className='bubble '+(m[0]==='me'?'mine':'theirs');el.textContent=m[1];const time=document.createElement('small');time.textContent='12:'+String(2+i*2).padStart(2,'0')+' AM';el.append(time)}messages.append(el)});messages.scrollTop=messages.scrollHeight;document.querySelectorAll('.contact').forEach(b=>b.classList.toggle('active',b.dataset.chat===key))}
document.querySelectorAll('.contact').forEach(b=>b.addEventListener('click',()=>renderChat(b.dataset.chat)));renderChat('arthur');
document.querySelectorAll('.flash-choices button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#flashText').textContent=b.dataset.next;document.querySelectorAll('.flash-choices button').forEach(x=>x.disabled=true);const again=document.createElement('button');again.className='memory-again';again.textContent='REVISIT THIS MEMORY ↻';again.addEventListener('click',()=>{document.querySelector('#flashText').textContent='Arthur remembers a sound from the radio room. The storm hasn’t arrived yet. The light is still on.';document.querySelectorAll('.flash-choices button').forEach(x=>x.disabled=false);again.remove()});document.querySelector('#flashChoices').append(again)}));
})();










