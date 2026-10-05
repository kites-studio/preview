export const products = [
 {id:'charizard',name:'Charizard ex',set:'Scarlet & Violet 151',number:'199/165',game:'Pokémon',kind:'singles',price:48000,image:'charizard.webp',condition:'Near Mint',stock:3,tag:'The chase',colour:'#f6e5d7'},
 {id:'151',name:'151 Booster Bundle',set:'Scarlet & Violet 151',number:'6 booster packs',game:'Pokémon',kind:'sealed',price:18900,image:'pokemon-151.webp',condition:'Factory sealed',stock:12,tag:'Kanto calling',colour:'#efe8f6'},
 {id:'luffy',name:'Monkey D. Luffy',set:'Awakening of the New Era',number:'OP05-119',game:'One Piece',kind:'singles',price:8500,image:'luffy.webp',condition:'Near Mint',stock:5,tag:'Deck upgrade',colour:'#e5edff'},
 {id:'op09',name:'Emperors in the New World',set:'OP-09 Booster Box',number:'24 booster packs',game:'One Piece',kind:'sealed',price:54900,image:'onepiece-box.webp',condition:'Factory sealed',stock:6,tag:'Sealed & ready',colour:'#e7e8ee'},
 {id:'umbreon',name:'Umbreon VMAX',set:'Evolving Skies',number:'215/203',game:'Pokémon',kind:'singles',price:145000,image:'umbreon.webp',condition:'Near Mint',stock:2,tag:'After dark',colour:'#e7e9f2'},
 {id:'erika',name:'Erika’s Invitation',set:'Scarlet & Violet 151',number:'203/165',game:'Pokémon',kind:'singles',price:14500,image:'erika.webp',condition:'Near Mint',stock:4,tag:'Illustration rare',colour:'#e6eee3'},
 {id:'shanks',name:'Shanks',set:'Emperors in the New World',number:'OP09-004',game:'One Piece',kind:'singles',price:4500,image:'shanks.webp',condition:'Near Mint',stock:8,tag:'Build your deck',colour:'#f4e8df'},
 {id:'rayquaza',name:'Rayquaza VMAX',set:'Evolving Skies',number:'218/203',game:'Pokémon',kind:'singles',price:98000,image:'rayquaza.webp',condition:'Near Mint',stock:0,tag:'On the wishlist',colour:'#e8eee4'},
];
export const policy = {threshold:20000,delivery:800,launchCode:'DISCOVER10',discountPercent:10};
export const findProduct = id => products.find(product => product.id === id);
export const money = cents => new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR'}).format(cents/100);
