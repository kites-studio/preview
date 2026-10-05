import {products,findProduct,money,policy} from './lib/catalogue.js';
import {readBag,totals,addToBag,updateBagItem,toggleFavourite,applyCode,removeCode,clearBag,subscribe} from './lib/bag.js';

const $=selector=>document.querySelector(selector);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const view={filter:'all',game:'all',query:'',fulfilment:'delivery',product:null};
let toastTimer,codeError='',checkoutComplete=false;
const dialogs=[...document.querySelectorAll('dialog')];
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>{$('#toast').hidden=true;},3200);}
function openDialog(id){for(const dialog of dialogs)if(dialog.open)dialog.close();$(id).showModal();}
function progress(t,fulfilment='delivery'){
 if(fulfilment==='pickup')return '<div class="shipping-meter"><p>Store pickup is free.</p><small>Your demo order is collected at Discover Collectibles.</small></div>';
 const message=t.remaining===0?'Free delivery unlocked. Nice finds!':`You’re ${money(t.remaining)} away from free delivery.`;
 return `<div class="shipping-meter"><p>${message}</p><div class="meter-track" role="progressbar" aria-label="Progress toward RM200 free delivery" aria-valuemin="0" aria-valuemax="200" aria-valuenow="${Math.min(200,t.net/100)}"><span style="width:${fulfilment==='pickup'?100:t.progress}%"></span></div><small>*Demo West Malaysia delivery: RM8, or free from RM200 after discounts.</small></div>`;
}
function summary(t){return `<div class="summary-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>${t.discount?`<div class="summary-row discount"><span>DISCOVER10 · 10% off</span><span>−${money(t.discount)}</span></div>`:''}<div class="summary-row"><span>${view.fulfilment==='pickup'?'Store pickup':'Delivery'}</span><span>${t.shipping===0?'Free':money(t.shipping)}</span></div><div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>`;}
function renderProducts(){
 const state=readBag(),query=view.query.trim().toLowerCase();
 const list=products.filter(p=>(view.filter==='all'||view.filter===p.kind||(view.filter==='favourites'&&state.favourites.includes(p.id)))&&(view.game==='all'||p.game===view.game)&&`${p.name} ${p.set} ${p.number} ${p.game}`.toLowerCase().includes(query));
 $('#results-count').textContent=`${list.length} ${list.length===1?'find':'finds'}`;
 $('#product-grid').innerHTML=list.map(p=>`<article class="product-card" data-kind="${p.kind}" style="--product-bg:${p.colour}"><div class="product-visual"><button class="product-open" data-product="${p.id}" aria-label="View ${escape(p.name)}"><img src="assets/${p.image}" width="600" height="838" loading="lazy" alt="${escape(p.name)} ${p.kind==='singles'?p.number:'sealed product'}"></button><span class="product-badge">${p.kind==='singles'?'SINGLE':'SEALED'}</span><button class="save-button" data-favourite="${p.id}" aria-pressed="${state.favourites.includes(p.id)}" aria-label="${state.favourites.includes(p.id)?'Remove':'Save'} ${escape(p.name)} ${state.favourites.includes(p.id)?'from':'to'} favourites">${icon('heart')}</button></div><p class="product-game">${p.game} · English</p><h3 class="product-title"><button data-product="${p.id}">${escape(p.name)}</button></h3><p class="product-meta">${escape(p.set)}<br>${p.kind==='singles'?p.number+' · '+p.condition:p.number}</p><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="quick-add" data-add="${p.id}" ${p.stock===0?'disabled':''} aria-label="${p.stock===0?'Unavailable':'Add '+escape(p.name)+' to bag'}">${p.stock===0?'Sold out':icon('plus')+'Add to bag'}</button></div></article>`).join('');
 $('#empty-results').hidden=list.length>0;
 $('#empty-title').textContent=view.filter==='favourites'&&!query?'Your favourites start here.':'No finds this time.';
 $('#empty-copy').textContent=view.filter==='favourites'&&!query?'Tap the heart on a card or box to save it for later.':'Try another card, set or game—or clear your filters.';
 document.querySelectorAll('.filters [data-filter]').forEach(button=>{button.classList.toggle('active',button.dataset.filter===view.filter);button.setAttribute('aria-pressed',String(button.dataset.filter===view.filter));});
 $('#game-select').value=view.game;
}
function renderHeader(){
 const state=readBag(),t=totals(state.items,state.code);
 $('#bag-count').textContent=t.count;$('#favourite-count').textContent=state.favourites.length;$('#favourite-count').hidden=state.favourites.length===0;$('#filter-favourite-count').textContent=state.favourites.length;
 $('.bag-trigger').setAttribute('aria-label',`Open shopping bag, ${t.count} ${t.count===1?'item':'items'}`);
 $('.favourite-trigger').setAttribute('aria-label',`View favourites, ${state.favourites.length} saved`);
}
function renderBag(){
 const state=readBag(),t=totals(state.items,state.code,view.fulfilment);
 if(!t.lines.length){$('#bag-content').innerHTML=`<div class="bag-empty">${icon('bag')}<h3>A great find belongs here.</h3><p>Start with a single, a sealed box, or something you’ve been chasing.</p><button class="button primary" data-action="continue">Explore the collection ${icon('arrow')}</button>${state.code?'<p class="code-message">DISCOVER10 is ready for your next find.</p>':''}</div>`;return;}
 $('#bag-content').innerHTML=progress(t)+t.lines.map(line=>`<div class="bag-line"><button class="bag-image" data-product="${line.id}" style="--product-bg:${line.product.colour}" aria-label="View ${escape(line.product.name)}"><img src="assets/${line.product.image}" alt="${escape(line.product.name)}"></button><div><h3>${escape(line.product.name)}</h3><p>English · ${line.product.condition}</p><div class="quantity-control"><button data-quantity="${line.id}" data-delta="-1" aria-label="Decrease ${escape(line.product.name)} quantity">−</button><output aria-label="Quantity">${line.quantity}</output><button data-quantity="${line.id}" data-delta="1" ${line.quantity>=line.product.stock?'disabled':''} aria-label="Increase ${escape(line.product.name)} quantity">+</button></div><button class="remove-button" data-remove="${line.id}">Remove</button></div><strong>${money(line.product.price*line.quantity)}</strong></div>`).join('')+`<form class="code-form" id="code-form"><input name="code" aria-label="Promotion code" placeholder="Promotion code" autocomplete="off" maxlength="25" value="${state.code}"><button type="submit">Apply</button></form><p class="code-message ${codeError?'error':''}" ${codeError?'role="alert"':''}>${codeError?escape(codeError):state.code?'DISCOVER10 applied. Your collection gets 10% off.':'A little launch bonus? Try DISCOVER10.'}${state.code?'<button data-action="remove-code">Remove</button>':''}</p><div class="bag-summary">${summary(t)}</div><button class="button primary checkout-button" data-action="checkout">Checkout · ${money(t.total)} ${icon('arrow')}</button><p class="bag-footnote">Guest checkout. Choose delivery or free store pickup next.<br>Sales preview: no payment is collected and no real order is placed.</p>`;
}
function renderProduct(id){
 const p=findProduct(id);if(!p)return;view.product=id;
 const state=readBag(),saved=state.favourites.includes(id),inBag=state.items.find(item=>item.id===id)?.quantity||0,available=p.stock-inBag;
 $('#product-detail').innerHTML=`<div class="product-detail-layout"><div class="detail-visual" style="--product-bg:${p.colour}"><img src="assets/${p.image}" alt="${escape(p.name)} ${p.number}"></div><div class="detail-copy"><p class="kicker">${p.game} · ${p.kind==='singles'?'SINGLE':'SEALED'}</p><h2 id="product-title">${escape(p.name)}</h2><p>${escape(p.set)} · ${p.number}</p><div class="detail-price">${money(p.price)}</div><div class="detail-specs"><div><span>LANGUAGE</span><strong>English</strong></div><div><span>${p.kind==='singles'?'CONDITION':'FORMAT'}</span><strong>${p.condition}</strong></div><div><span>DEMO AVAILABILITY</span><strong>${p.stock===0?'Sold out':p.stock+' copies'}</strong></div><div><span>DELIVERY OFFER</span><strong>Free from RM200*</strong></div></div><label for="product-quantity">Quantity <input id="product-quantity" type="number" min="1" max="${Math.max(1,available)}" value="1" ${available===0?'disabled':''}></label><button class="button primary" data-add-detail="${id}" ${available===0?'disabled':''}>${p.stock===0?'Sold out':available===0?'All demo copies in your bag':'Add to bag'} ${icon('plus')}</button><button class="detail-favourite" data-favourite="${id}" aria-pressed="${saved}">${saved?'♥ Saved to favourites':'♡ Save to favourites'}</button><p class="detail-disclaimer">Sample price and stock for this sales preview.<br>*RM200 threshold after discounts; demo delivery zone: West Malaysia.</p></div></div>`;
}
function renderCheckout(){
 const state=readBag(),t=totals(state.items,state.code,view.fulfilment);
 if(!t.lines.length){toast('Add a find to your bag first.');return;}
 checkoutComplete=false;
 $('#checkout-content').innerHTML=`<p class="demo-notice">Demo checkout—use sample details. No payment is taken, no stock is reserved, and nothing is sent to the store.</p><div class="checkout-layout"><form id="checkout-form" class="checkout-form"><label>Full name<input name="name" autocomplete="off" required maxlength="80" placeholder="Your name"></label><label>Email<input name="email" type="email" autocomplete="off" required maxlength="120" placeholder="you@example.com"></label><fieldset><legend>How would you like your finds?</legend><div class="delivery-options"><label class="delivery-choice"><input type="radio" name="fulfilment" value="delivery" ${view.fulfilment==='delivery'?'checked':''}>Delivery</label><label class="delivery-choice"><input type="radio" name="fulfilment" value="pickup" ${view.fulfilment==='pickup'?'checked':''}>Store pickup</label></div></fieldset><div id="delivery-fields" ${view.fulfilment==='pickup'?'hidden':''}><label>Delivery address<input name="address" ${view.fulfilment==='delivery'?'required':''} maxlength="160" autocomplete="off" placeholder="Street address"></label><label>City<input name="city" ${view.fulfilment==='delivery'?'required':''} maxlength="80" autocomplete="off" placeholder="City"></label><label>Postcode<input name="postcode" ${view.fulfilment==='delivery'?'required':''} pattern="[0-9]{5}" maxlength="5" inputmode="numeric" title="Enter a five-digit postcode" autocomplete="off" placeholder="Five-digit postcode"></label><p class="bag-footnote">Demo delivery zone: West Malaysia. Choose store pickup to try a shorter checkout.</p></div><p id="checkout-error" class="form-error" role="alert" hidden></p><button class="button primary" type="submit">Place demo order ${icon('arrow')}</button><p class="bag-footnote">Sample details stay in this open form only. No card details required.</p></form><div id="checkout-summary" class="checkout-summary"></div></div>`;
 renderCheckoutSummary();
}
function renderCheckoutSummary(){
 const target=$('#checkout-summary');if(!target||checkoutComplete)return;
 const state=readBag(),t=totals(state.items,state.code,view.fulfilment);
 target.innerHTML=`<h3>Your finds.</h3>${t.lines.map(line=>`<div class="mini-line"><img src="assets/${line.product.image}" alt=""><span>${escape(line.product.name)}<br><small>Qty ${line.quantity}</small></span><strong>${money(line.product.price*line.quantity)}</strong></div>`).join('')}${progress(t,view.fulfilment)}${summary(t)}`;
 const submit=$('#checkout-form button[type="submit"]');if(submit)submit.disabled=t.count===0;
}
function eventDetail(type){
 if(type==='cardshow'){$('#event-detail').innerHTML=`<p class="kicker">THE DC COMMUNITY ARCHIVE</p><h2 id="event-title">Sports Day<br>× Cardshow.</h2><p>Cards, friendly faces and a day out with the DC community.</p><img class="archive-poster" src="assets/cardshow-recap.webp" alt="Discover Collectibles’ Sports Day and Cardshow recap"><div class="event-facts"><span><small>PAST EVENT</small>September 2026</span><span><small>COMMUNITY</small>Discover Collectibles</span></div><p>A real moment from DC’s archive. Follow the store for the next confirmed event.</p><a class="button secondary" href="https://www.facebook.com/photo.php?fbid=122310004352196857" target="_blank" rel="noopener noreferrer">See DC’s original recap ↗</a>`;}
 else if(type==='carnival'){$('#event-detail').innerHTML=`<p class="kicker">THE DC COMMUNITY ARCHIVE</p><h2 id="event-title">DC Carnival<br>& Trade Show.</h2><p>Collecting, trading, tournaments and a weekend together at Discover Collectibles.</p><img class="archive-poster" src="assets/dc-carnival.jpg" alt="DC Carnival and Trade Show 2025 poster"><div class="event-facts"><span><small>PAST EVENT</small>16–17 August 2025</span><span><small>LOCATION</small>Discover Collectibles, Kepong</span></div><p>This event has ended. The website can keep these memories alongside new store events.</p><a class="button secondary" href="https://david.my/dc-carnival-trade-show-2025/" target="_blank" rel="noopener noreferrer">Read the event feature ↗</a>`;}
 else{
 const pokemon=type==='pokemon';
 $('#event-detail').innerHTML=`<p class="kicker">SAMPLE EVENT · EXPLORE THE EXPERIENCE</p><h2 id="event-title">${pokemon?'Pokémon Weekly.':'One Piece Showdown.'}</h2><p>${pokemon?'Bring a deck, meet other players, and make Wednesday your game night.':'Bring your crew, test your deck, and make a game of your Saturday.'}</p><div class="event-facts"><span><small>SAMPLE TIME</small>${pokemon?'Wednesday · 8:30 PM':'Saturday · 2:00 PM'}</span><span><small>VENUE</small>Discover Collectibles</span></div><p>The real event page would show the confirmed format, entry fee, prizes and organiser registration link.</p><button class="button primary" data-action="event-register">Try a demo registration ${icon('arrow')}</button><p id="event-status" class="bag-footnote" role="status">Preview schedule only. No live event or place is being offered.</p>`;
 }
 openDialog('#event-dialog');
}
const videoTitles={'7690431426512162056':'Kuro’s Gengar ex pull','7686025068916362517':'The DFV 2.0 drop','7684168280164060437':'Behind the scenes at DC'};
function videoDetail(id){
 if(!Object.hasOwn(videoTitles,id))return;
 $('#video-detail').innerHTML=`<p class="kicker">DISCOVER COLLECTIBLES ON TIKTOK</p><h2 id="video-title">${videoTitles[id]}</h2><iframe src="https://www.tiktok.com/player/v1/${id}?autoplay=0" title="${videoTitles[id]} — original DC TikTok" allow="fullscreen; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><p>If the player is unavailable, watch the original on TikTok.</p><a class="button secondary" href="https://www.tiktok.com/@discovercollectibles.os/video/${id}" target="_blank" rel="noopener noreferrer">Watch on TikTok ↗</a>`;
 openDialog('#video-dialog');
}
$('#video-dialog').addEventListener('close',()=>{$('#video-detail').replaceChildren();});
function setFilter(filter){view.filter=filter;view.game='all';view.query='';$('#search').value='';renderProducts();}
document.addEventListener('click',event=>{
 const target=event.target.closest('button,a');if(!target)return;
 try{
  if(target.hasAttribute('data-close'))target.closest('dialog').close();
  if(target.dataset.filter){setFilter(target.dataset.filter);if(target.tagName==='A')for(const dialog of dialogs)if(dialog.open)dialog.close();}
  if(target.dataset.game){view.game=target.dataset.game;view.filter='all';view.query='';$('#search').value='';renderProducts();}
  if(target.dataset.product){renderProduct(target.dataset.product);openDialog('#product-dialog');}
  if(target.dataset.add){addToBag(target.dataset.add);toast(`${findProduct(target.dataset.add).name} added to your bag.`);}
  if(target.dataset.addDetail){
   const quantity=Number($('#product-quantity').value);addToBag(target.dataset.addDetail,quantity);toast(`${quantity} × ${findProduct(target.dataset.addDetail).name} added to your bag.`);renderProduct(target.dataset.addDetail);
  }
  if(target.dataset.favourite){const id=target.dataset.favourite;toggleFavourite(id);renderProducts();if($('#product-dialog').open)renderProduct(id);const focus=$($('#product-dialog').open?`#product-dialog [data-favourite="${id}"]`:`.save-button[data-favourite="${id}"]`);(focus||$('.filters .active')).focus({preventScroll:true});toast(readBag().favourites.includes(id)?'Saved for your next visit.':'Removed from favourites.');}
  if(target.dataset.quantity){const id=target.dataset.quantity,delta=target.dataset.delta,item=readBag().items.find(line=>line.id===id);if(item){updateBagItem(id,item.quantity+Number(delta));const focus=$(`#bag-dialog [data-quantity="${id}"][data-delta="${delta}"]`);(focus&&!focus.disabled?focus:$('#bag-dialog [data-close]')).focus({preventScroll:true});}}
  if(target.dataset.remove){updateBagItem(target.dataset.remove,0);$('#bag-dialog [data-close]').focus({preventScroll:true});}
  if(target.dataset.event)eventDetail(target.dataset.event);
  if(target.dataset.video)videoDetail(target.dataset.video);
  const action=target.dataset.action;
  if(action==='bag'){view.fulfilment='delivery';codeError='';renderBag();openDialog('#bag-dialog');}
  if(action==='favourites'){setFilter('favourites');$('#shop').scrollIntoView();}
  if(action==='search'){setFilter('all');$('#shop').scrollIntoView();$('#search').focus({preventScroll:true});}
  if(action==='reset')setFilter('all');
  if(action==='continue'){for(const dialog of dialogs)if(dialog.open)dialog.close();$('#shop').scrollIntoView();}
  if(action==='launch'){applyCode(policy.launchCode);codeError='';toast('DISCOVER10 applied. Enjoy 10% off your demo collection.');}
  if(action==='remove-code'){removeCode();codeError='';renderBag();}
  if(action==='checkout'){renderCheckout();if(readBag().items.length)openDialog('#checkout-dialog');}
  if(action==='event-register'){target.disabled=true;target.textContent='Demo place saved ✓';$('#event-status').textContent='Registration preview complete. Nothing was sent to the store and no real place was booked.';}
 }catch(error){toast(error.message);}
});
document.addEventListener('submit',event=>{
 if(event.target.id==='code-form'){
  event.preventDefault();try{applyCode(new FormData(event.target).get('code')||'');codeError='';}catch(error){codeError=error.message+(readBag().code?' Your existing launch discount remains applied.':'');}renderBag();$('#code-form input')?.focus({preventScroll:true});
 }
 if(event.target.id==='checkout-form'){
  event.preventDefault();const state=readBag(),t=totals(state.items,state.code,view.fulfilment);
  if(t.count===0){$('#checkout-error').hidden=false;$('#checkout-error').textContent='Your bag is empty. Add a find before checking out.';return;}
  const form=event.target;if(!form.reportValidity())return;
  const reference='DC-DEMO-'+crypto.randomUUID().slice(0,8).toUpperCase();
  checkoutComplete=true;
  $('#checkout-content').innerHTML=`<div class="receipt"><div class="receipt-check" aria-hidden="true">✓</div><h3 id="receipt-title" tabindex="-1">That’s a great collection.</h3><p>Your demo checkout is complete.</p><div class="receipt-reference">${reference}</div><p class="receipt-total">Demo total ${money(t.total)}</p><p>${t.count} ${t.count===1?'item':'items'} · ${view.fulfilment==='pickup'?'Store pickup':'Delivery'}${t.discount?' · DISCOVER10 applied':''}</p><p>No payment was taken, no real order was sent, and no stock was reserved. This reference belongs to this preview only.</p><button class="button primary" data-action="continue">Keep discovering ${icon('arrow')}</button></div>`;
  clearBag();$('#receipt-title').focus();
 }
});
$('#search').addEventListener('input',event=>{view.query=event.target.value;renderProducts();});
$('#game-select').addEventListener('change',event=>{view.game=event.target.value;renderProducts();});
document.addEventListener('change',event=>{
 if(event.target.name==='fulfilment'){
  view.fulfilment=event.target.value;const delivery=view.fulfilment==='delivery';$('#delivery-fields').hidden=!delivery;
  $('#delivery-fields').querySelectorAll('input').forEach(input=>input.required=delivery);renderCheckoutSummary();
 }
});
for(const dialog of dialogs)dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
subscribe(event=>{renderHeader();if(event.type==='storage')renderProducts();if($('#bag-dialog').open)renderBag();if($('#checkout-dialog').open&&!checkoutComplete)renderCheckoutSummary();});
renderHeader();renderProducts();
