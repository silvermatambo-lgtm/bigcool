/* Bigcool UltraMax 7 Pro Premium · browser animation upgrade */
(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const pick='.bc-service,.bc-value-grid>article,.bc-faq,.bc-rounded-photo,.bc-contact-card,.bc-effect-flip,.bc-gallery-preview .bc-photo-tile,.bc-copy';
const targets=[...document.querySelectorAll(pick)].filter(el=>!el.classList.contains('reveal'));
if(!reduce && 'IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(item=>{
    if(item.isIntersecting){item.target.classList.add('bc-motion-visible');io.unobserve(item.target)}
  }),{threshold:0.08,rootMargin:'0px 0px 20px 0px'});
  targets.forEach((el,i)=>{el.classList.add('bc-motion');
    el.classList.add(['bc-left','bc-right','bc-zoom','bc-rotate'][i%4]);
    el.style.setProperty('--bc-delay',String(i%3*110)+'ms');io.observe(el)});
  document.documentElement.classList.add('bc-motion-ready');
}
document.querySelectorAll('.bc-effect-flip').forEach(card=>{
  card.addEventListener('click',()=>{
    const on=!card.classList.contains('flipped');card.classList.toggle('flipped',on);
    card.setAttribute('aria-pressed',String(on));
  });
});
// Fail-safe for slow rendering: never leave a heading or card hidden when navigating back.
addEventListener('pageshow',event=>{
  if(event.persisted)document.querySelectorAll('.bc-motion').forEach(node=>node.classList.add('bc-motion-visible'));
});
})();