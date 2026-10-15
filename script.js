const dishes=[
{id:1,name:'Combinado Japan',category:'combos',label:'COMBINADOS',image:'selection',tag:'Para dividir',price:109.90,description:'Sugestão de combinação com sashimi de salmão, uramakis, niguiris e gunkans. Uma seleção para explorar diferentes texturas em uma só escolha.'},
{id:2,name:'Combinado Hot & Salmão',category:'combos',label:'COMBINADOS',image:'combo',tag:'Do seu jeito',price:94.90,description:'Sugestão com hot rolls, sashimi de salmão e peças com finalizações cremosas. O encontro entre a crocância e a delicadeza do salmão.'},
{id:3,name:'Trio de Gunkans',category:'especiais',label:'ESPECIAIS',image:'gunkan',tag:'Para experimentar',price:39.90,description:'Sugestão de gunkans envoltos em salmão, com finalizações variadas. Uma escolha para quem gosta de descobrir novas combinações.'},
{id:4,name:'Seleção de Salmão',category:'classicos',label:'CLÁSSICOS',image:'selection',tag:'Salmão em destaque',price:59.90,description:'Sugestão de seleção com cortes de sashimi e peças de salmão. Sabores delicados para apreciar sem pressa.'},
{id:5,name:'Hot Roll Cremoso',category:'classicos',label:'CLÁSSICOS',image:'combo',tag:'Crocância à mesa',price:32.90,description:'Sugestão de hot rolls com recheio de salmão e cream cheese. Casquinha crocante e interior cremoso.'},
{id:6,name:'Gunkan Maçaricado',category:'especiais',label:'ESPECIAIS',image:'gunkan',tag:'Um toque especial',price:34.90,description:'Sugestão de gunkan de salmão com finalização maçaricada. Textura macia e um toque tostado.'}
];
const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
// Set the restaurant number with country and area code when supplied.
const restaurantWhatsApp='';
function whatsappOrderUrl(dish){
 const text=`Olá, Japan! Gostaria de pedir: ${dish.name}.\n\nPodem confirmar a disponibilidade e me ajudar a finalizar o pedido?`;
 return `https://wa.me/${restaurantWhatsApp}?text=${encodeURIComponent(text)}`;
}
const products=document.querySelector('#products');
products.innerHTML=dishes.map(d=>`<article class="product" data-cat="${d.category}"><div class="product-photo"><img src="assets/${d.image}.webp" loading="lazy" width="1195" height="896" alt="${d.name} — fotografia ilustrativa"><span class="product-tag">${d.tag}</span></div><div class="product-copy"><span class="label">${d.label}</span><h3>${d.name}</h3><p>${d.description.split('. ')[0]}.</p><div class="price-row"><strong>${money(d.price)}</strong><a class="order-link" href="${whatsappOrderUrl(d)}" target="_blank" rel="noopener noreferrer" aria-label="Pedir ${d.name} pelo WhatsApp">Pedir <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
function filter(category){document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});let count=0;document.querySelectorAll('.product').forEach(p=>{p.hidden=category!=='todos'&&p.dataset.cat!==category;if(!p.hidden)count++;});document.querySelector('#filter-status').textContent=`${count} pratos exibidos.`;}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
document.querySelector('#year').textContent=new Date().getFullYear();

// Play the venue film once it enters view, unless reduced motion is requested.
const venueVideo=document.querySelector('#venue-video');
const venueMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!venueMotion.matches){
 if('IntersectionObserver' in window){
  const venueObserver=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){
    if(!venueMotion.matches)venueVideo.play().catch(()=>{});
    venueObserver.disconnect();
   }
  },{threshold:.25});
  venueObserver.observe(venueVideo);
 }else{venueVideo.play().catch(()=>{});}
}
venueMotion.addEventListener('change',event=>{if(event.matches)venueVideo.pause();});

// Start the sushi presentation when visible; retain native playback controls.
const sushiVideo=document.querySelector('#sushi-video');
const sushiMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!sushiMotion.matches){
 if('IntersectionObserver' in window){
  const sushiObserver=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){
    if(!sushiMotion.matches)sushiVideo.play().catch(()=>{});
    sushiObserver.disconnect();
   }
  },{threshold:.25});
  sushiObserver.observe(sushiVideo);
 }else{sushiVideo.play().catch(()=>{});}
}
sushiMotion.addEventListener('change',event=>{if(event.matches)sushiVideo.pause();});



// Touch feedback is visual only; scrolling and WhatsApp links remain native.
document.querySelectorAll('.product-photo').forEach(photo=>{
 let resetZoom;
 photo.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'){clearTimeout(resetZoom);photo.classList.add('is-zoomed');}},{passive:true});
 const releaseZoom=()=>{clearTimeout(resetZoom);resetZoom=setTimeout(()=>photo.classList.remove('is-zoomed'),140);};
 ['pointerup','pointercancel','pointerleave'].forEach(type=>photo.addEventListener(type,releaseZoom,{passive:true}));
});

const storyOrderMessage='Olá, Japan! Gostaria de fazer um pedido. Podem me ajudar a escolher e finalizar?';
document.querySelector('.story-whatsapp').href=`https://wa.me/${restaurantWhatsApp}?text=${encodeURIComponent(storyOrderMessage)}`;

// Size the texture against the complete menu, independently of the active filter.
const menuSurface=document.querySelector('#cardapio');
function syncMenuBackground(){
 const hiddenCards=[...menuSurface.querySelectorAll('.product')].filter(card=>card.hidden);
 hiddenCards.forEach(card=>{card.hidden=false;});
 const fullHeight=Math.ceil(menuSurface.getBoundingClientRect().height);
 hiddenCards.forEach(card=>{card.hidden=true;});
 menuSurface.style.setProperty('--menu-background-height',`${fullHeight}px`);
}
syncMenuBackground();
if(document.fonts)document.fonts.ready.then(syncMenuBackground);
let menuResizeFrame;
window.addEventListener('resize',()=>{cancelAnimationFrame(menuResizeFrame);menuResizeFrame=requestAnimationFrame(syncMenuBackground);});

// One-time reveals with a lateral entrance reserved for the restaurant film.
const revealMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!revealMotion.matches){
 const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}});
 },{threshold:.1,rootMargin:'0px 0px -24px 0px'});
 const revealGroups=[
  '.hero .eyebrow,.hero h1,.hero .intro,.hero .button',
  '.venue-heading','.venue-video-frame','.menu-heading','.category-bar',
  '.product','.story-copy','.journey .section-heading','.journey article',
  '.final-cta .wrap','.footer-main > *','.footer-bottom'
 ];
 revealGroups.forEach(selector=>{
  document.querySelectorAll(selector).forEach((element,index)=>{
   element.classList.add('reveal');
   if(element.classList.contains('venue-video-frame'))element.classList.add('reveal-side');
   element.style.setProperty('--reveal-delay',`${(index%3)*80}ms`);
   if(document.documentElement.classList.contains('intro-active'))window.addEventListener('japan:intro-finished',()=>revealObserver.observe(element),{once:true});else revealObserver.observe(element);
  });
 });
 revealMotion.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.reveal').forEach(element=>element.classList.add('in-view'));revealObserver.disconnect();}});
}

// Let the brief brand introduction complete, then release the page and reveals.
if(window.finishJapanIntro){
 const introDuration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?350:1050;
 setTimeout(window.finishJapanIntro,Math.max(0,introDuration-(performance.now()-window.japanIntroStarted)));
}
