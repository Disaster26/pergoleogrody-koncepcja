(function(){
var d=document,top=d.getElementById('top');
function sc(){top.classList.toggle('sc',scrollY>8)}
addEventListener('scroll',sc,{passive:true});

/* menu mobilne */
var bg=d.querySelector('.burger'),mn=d.getElementById('mnav');
function zamknij(){mn.hidden=true;bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu');d.body.style.overflow=''}
if(bg){bg.addEventListener('click',function(){var o=mn.hidden;mn.hidden=!o;bg.setAttribute('aria-expanded',String(o));bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');d.body.style.overflow=o?'hidden':''});
mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});
addEventListener('keydown',function(e){if(e.key==='Escape'&&!mn.hidden)zamknij()});
addEventListener('resize',function(){if(innerWidth>1240&&!mn.hidden)zamknij()})}

/* aktywna pozycja menu */
var linki=[].slice.call(d.querySelectorAll('.menu a'));
if('IntersectionObserver' in window&&linki.length){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){linki.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
  /* pasek dolny po przewinieciu za hero */
  var mob=d.getElementById('mob'),hero=d.querySelector('.hero .cta')||d.querySelector('.hero');
  if(mob&&hero){new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)}).observe(hero)}
}

/* przesuwanie torow mysza + strzalki */
d.querySelectorAll('.tor,.prod,.przes').forEach(function(t){
  var x0,s0,ruch=false,wcis=false;
  t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||t.scrollWidth<=t.clientWidth)return;wcis=true;ruch=false;x0=e.clientX;s0=t.scrollLeft});
  addEventListener('pointermove',function(e){if(!wcis)return;var dx=e.clientX-x0;if(Math.abs(dx)>5){ruch=true;t.classList.add('drag')}if(ruch){t.scrollLeft=s0-dx}});
  addEventListener('pointerup',function(){if(!wcis)return;wcis=false;if(ruch){var w=t.firstElementChild?t.firstElementChild.getBoundingClientRect().width:300;setTimeout(function(){t.classList.remove('drag');t.scrollTo({left:Math.round(t.scrollLeft/w)*w,behavior:'smooth'})},0)}});
  t.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false}},true);
  t.addEventListener('dragstart',function(e){e.preventDefault()});
});
d.querySelectorAll('.strz').forEach(function(s){
  var sek=s.closest('section'),t=sek&&sek.querySelector('.tor');if(!t)return;
  var pv=s.querySelector('.pv'),nx=s.querySelector('.nx');
  function krok(){var c=t.firstElementChild;var g=parseFloat(getComputedStyle(t).columnGap)||0;return c?c.getBoundingClientRect().width+g:300}
  function st(){pv.disabled=t.scrollLeft<4;nx.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4}
  pv.addEventListener('click',function(){t.scrollBy({left:-krok(),behavior:'smooth'})});
  nx.addEventListener('click',function(){t.scrollBy({left:krok(),behavior:'smooth'})});
  t.addEventListener('scroll',st,{passive:true});addEventListener('resize',st);requestAnimationFrame(function(){setTimeout(st,0)});pv.disabled=true;
});

/* lightbox */
var lb=d.getElementById('lb');
if(lb){
  var li=lb.querySelector('img'),lc=lb.querySelector('.lic'),lista=[],nr=0,ost;
  function pokaz(i){nr=(i+lista.length)%lista.length;var k=lista[nr],m=k.querySelector('img');li.src=m.currentSrc||m.src;li.alt=m.alt;lc.textContent=(nr+1)+' / '+lista.length+(m.alt?' - '+m.alt:'');
    var full=k.getAttribute('data-full');clearTimeout(lb._t);if(full){lb._t=setTimeout(function(){var im=new Image();im.onload=function(){if(lista[nr]===k)li.src=full};im.src=full},180)}}
  d.querySelectorAll('.fot-k').forEach(function(k){k.addEventListener('click',function(){var g=k.closest('.tor,.galeria')||d;lista=[].slice.call(g.querySelectorAll('.fot-k'));ost=k;pokaz(lista.indexOf(k));lb.hidden=false;d.body.style.overflow='hidden';lb.querySelector('.x').focus()})});
  function zam(){lb.hidden=true;d.body.style.overflow='';if(ost)ost.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){pokaz(nr-1)});
  lb.querySelector('.n').addEventListener('click',function(){pokaz(nr+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zam();if(e.key==='ArrowLeft')pokaz(nr-1);if(e.key==='ArrowRight')pokaz(nr+1)});
  var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)pokaz(nr+(dx<0?1:-1));tx=null});
}

/* wybor produktu z karty */
var sel=d.getElementById('f-prod');
d.querySelectorAll('[data-prod]').forEach(function(a){a.addEventListener('click',function(){if(sel)sel.value=a.getAttribute('data-prod')})});

/* mapa po przewinieciu */
var mapa=d.getElementById('mapa');
if(mapa&&'IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){var f=d.createElement('iframe');f.src=mapa.getAttribute('data-src');f.title='Mapa dojazdu';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';mapa.appendChild(f);mo.disconnect()}},{rootMargin:'300px'});mo.observe(mapa)}

/* formularz pokazowy */
var f=d.getElementById('form');
if(f){f.addEventListener('submit',function(e){e.preventDefault();var ok=true;f.querySelectorAll('[required]').forEach(function(el){var z=el.type==='checkbox'?el.checked:el.value.trim()!=='';if(el.type==='email'&&z)z=/.+@.+\..+/.test(el.value);el.setAttribute('aria-invalid',z?'false':'true');if(!z&&ok){ok=false;el.focus()}});
var m=d.getElementById('msg');m.hidden=false;m.textContent=ok?'To podgląd strony - formularz nie wysyła jeszcze danych. W wersji docelowej zapytanie trafi od razu na skrzynkę firmy.':'Uzupełnij zaznaczone pola.'})}
})();
