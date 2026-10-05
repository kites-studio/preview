// Adapted from KitesPrints Mark II src/utilities/bag.ts, read 2026-10-05.
// Retains validated storage snapshots, explicit updates, and change subscriptions.
// Garment sizes/colours/printing are replaced by TCG SKU quantities.
import {products, findProduct, policy} from './catalogue.js';
export const storageKey='discover-collectibles-preview-v1';
export const changeEvent='dc-bag-change';
export function cleanItems(value){
 if(!Array.isArray(value)) return [];
 const merged=new Map();
 for(const item of value){
  const product=item&&findProduct(item.id);
  if(!product || !Number.isInteger(item.quantity) || item.quantity<=0 || product.stock===0) continue;
  merged.set(item.id,Math.min(product.stock,(merged.get(item.id)||0)+item.quantity));
 }
 return [...merged].map(([id,quantity])=>({id,quantity}));
}
export function parseSnapshot(raw){
 try{
  const value=JSON.parse(raw);
  return {items:cleanItems(value.items),favourites:Array.isArray(value.favourites)?[...new Set(value.favourites.filter(id=>findProduct(id)))]:[],code:value.code===policy.launchCode?value.code:''};
 }catch{return {items:[],favourites:[],code:''};}
}
export function shippingFor(net,fulfilment='delivery'){return net===0||fulfilment==='pickup'||net>=policy.threshold?0:policy.delivery;}
export function totals(items,code='',fulfilment='delivery'){
 const lines=cleanItems(items).map(item=>({...item,product:findProduct(item.id)}));
 const subtotal=lines.reduce((sum,line)=>sum+line.product.price*line.quantity,0);
 const discount=code===policy.launchCode?Math.round(subtotal*policy.discountPercent/100):0;
 const net=subtotal-discount;
 const shipping=shippingFor(net,fulfilment);
 return {lines,subtotal,discount,net,shipping,total:net+shipping,count:lines.reduce((sum,line)=>sum+line.quantity,0),remaining:Math.max(0,policy.threshold-net),progress:Math.min(100,net/policy.threshold*100)};
}
let memory={items:[],favourites:[],code:''};
export function readBag(){
 try{const raw=localStorage.getItem(storageKey); if(raw) memory=parseSnapshot(raw);}catch{}
 return structuredClone(memory);
}
export function writeBag(value){
 memory=parseSnapshot(JSON.stringify(value));
 try{localStorage.setItem(storageKey,JSON.stringify(memory));}catch{}
 window.dispatchEvent(new Event(changeEvent));
 return readBag();
}
export function addToBag(id,quantity=1){
 const product=findProduct(id),state=readBag();
 if(!product||!Number.isInteger(quantity)||quantity<1) throw Error('Choose a valid quantity.');
 const existing=state.items.find(item=>item.id===id);
 if(quantity+(existing?.quantity||0)>product.stock) throw Error('That is the available quantity in this demo.');
 if(existing) existing.quantity+=quantity; else state.items.push({id,quantity});
 return writeBag(state);
}
export function updateBagItem(id,quantity){
 const state=readBag(),product=findProduct(id);
 if(!product||!Number.isInteger(quantity)||quantity<0||quantity>product.stock) throw Error('Choose a quantity within demo availability.');
 state.items=quantity===0?state.items.filter(item=>item.id!==id):state.items.map(item=>item.id===id?{id,quantity}:item);
 return writeBag(state);
}
export function toggleFavourite(id){
 if(!findProduct(id)) return;
 const state=readBag();
 state.favourites=state.favourites.includes(id)?state.favourites.filter(value=>value!==id):[...state.favourites,id];
 return writeBag(state);
}
export function applyCode(raw){
 const code=raw.trim().toUpperCase();
 if(code!==policy.launchCode) throw Error('Try DISCOVER10 for the demo launch offer.');
 const state=readBag();state.code=code;return writeBag(state);
}
export function removeCode(){const state=readBag();state.code='';return writeBag(state);}
export function clearBag(){const state=readBag();state.items=[];state.code='';return writeBag(state);}
export function subscribe(callback){
 window.addEventListener('storage',callback);window.addEventListener(changeEvent,callback);
 return ()=>{window.removeEventListener('storage',callback);window.removeEventListener(changeEvent,callback);};
}
