/* Bigcool Refri & Air · UltraMax 7 Pro Premium build restoration v8.
   Vercel extracts the original user-photo archive first; this script
   layers current motion modules on top without modifying the original media. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'dist');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const write=(name,data)=>fs.writeFileSync(path.join(root,name),data);
const oldOrigin='https://bigcool.vercel.app';
const realOrigin='https://bigcool-xi.vercel.app';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cards={
 index:[
  ['FRIDGE & FREEZER REPAIRS','Cooling appliances','Domestic and commercial fridge and freezer repair and maintenance.','refrigeration-compressors.webp'],
  ['COLD ROOM SPECIALISTS','Cold and freezer rooms','Building cold rooms, servicing freezer rooms and refrigeration systems.','cold-room-interior.webp'],
  ['AIRCON & HVAC','Air conditioning services','Installation, servicing and maintenance of air-conditioning systems.','aircon-installation-team.webp']],
 about:[
  ['REPAIRS & SERVICING','Practical repairs','Support for household and business refrigeration equipment.','refrigeration-maintenance.webp'],
  ['AIRCON INSTALLATIONS','On-site installation','Air-conditioning installation and service for homes and businesses.','ac-technician-service.webp'],
  ['COMMERCIAL COOLING','Cooling solutions','Commercial refrigeration, cold rooms and freezer-room support.','commercial-cooling-units.webp']],
 services:[
  ['FRIDGE REPAIRS','Domestic and commercial','Domestic fridges, commercial fridges, display fridges and freezers.','aircon-components.webp'],
  ['COLD & FREEZER ROOMS','Construction and servicing','Building cold rooms, freezer rooms and servicing refrigeration equipment.','commercial-cold-room-work.webp'],
  ['AIR CONDITIONING','HVAC and aircon','Air-conditioning installation, servicing and HVAC-related work.','aircon-diagnostics.webp']],
 gallery:[
  ['FIELD IMAGES','Aircon installations','Photographs of air-conditioning installations supplied by Bigcool.','aircon-installations.webp'],
  ['TECHNICAL WORK','Refrigeration equipment','Genuine supplied photographs of refrigeration and repair work.','refrigeration-compressors.webp'],
  ['COLD ROOM IMAGES','Cold rooms','Cold-room and freezer-room equipment shown in the supplied gallery.','cold-room-interior.webp']]
};
const headings={
 index:['OUR SERVICES IN MOTION','Discover what Bigcool can do'],
 about:['WORK WITH BIGCOOL','Cooling expertise up close'],
 services:['EXPERIENCE THE SERVICES','Flip a card to explore'],
 gallery:['REAL PHOTOS FROM THE FIELD','Behind the refrigeration work']
};
function effectSection(page){
 const list=cards[page];if(!list)return '';
 const [eyebrow,heading]=headings[page];
 const blocks=list.map(([tag,title,body,img])=>'<button type="button" class="bc-effect-flip" aria-pressed="false" aria-label="Flip '+esc(title)+' card">'+
 '<span class="bc-effect-flip-inner"><span class="bc-effect-face front"><img src="assets/'+esc(img)+'" alt="'+esc(title)+'" loading="lazy" decoding="async">'+
 '<span class="bc-effect-copy"><small>'+esc(tag)+'</small><strong>'+esc(title)+'</strong><em>HOVER OR TAP TO FLIP ↗</em></span></span>'+
 '<span class="bc-effect-face back"><strong>'+esc(title)+'</strong><p>'+esc(body)+'</p><span>Call / WhatsApp: +27 63 627 0816</span></span></span></button>').join('');
 return '<section class="section bc-effect-area" aria-label="Interactive Bigcool service cards">'+
 '<div class="bc-effect-head reveal slide-up"><span class="kicker">'+esc(eyebrow)+'</span>'+
 '<h2 class="typewriter reveal-title" data-text="'+esc(heading)+'">'+esc(heading)+'</h2>'+
 '<p>Hover with a mouse or tap a card to flip it over and see more details.</p></div>'+
 '<div class="bc-effect-grid">'+blocks+'</div></section>\n';
}
for(const name of fs.readdirSync(root)){
 if(!/\.(?:html|xml|txt|js)$/.test(name))continue;
 const file=path.join(root,name);if(!fs.statSync(file).isFile())continue;
 let txt=read(name).split(oldOrigin).join(realOrigin);
 if(name==='script.js'){
   const needle="if (entry.target.classList.contains('reveal-title')) typeHeading(entry.target);";
   if(!txt.includes(needle))throw Error('Typewriter reveal observer unexpectedly changed');
   txt=txt.replace(needle,needle+
    "\n      // Fix: the headings are nested INSIDE observed .section-head elements.\n"+
    "      entry.target.querySelectorAll('.reveal-title.typewriter').forEach(typeHeading);");
 }
 if(name==='sw.js'){
   txt=txt.replace(/ultramax7pro-bigcool-brand-v[0-9]+/g,'ultramax7pro-bigcool-motion-v8');
   txt=txt.replace("'./premium.js', './bigcool.css'","'./premium.js', './bigcool.css', './bigcool-motion.css', './bigcool-motion.js'");
 }
 if(/\.html$/.test(name)){
   txt=txt.replace('<link rel="stylesheet" href="bigcool.css">',
     '<link rel="stylesheet" href="bigcool.css?v=8"><link rel="stylesheet" href="bigcool-motion.css?v=8">');
   txt=txt.replace('<script src="script.js" defer></script>','<script src="script.js?v=8" defer></script>');
   txt=txt.replace('<script src="premium.js" defer></script>',
     '<script src="premium.js?v=8" defer></script><script src="bigcool-motion.js?v=8" defer></script>');
   const page=name.slice(0,-5);
   if(cards[page]){
     if(!txt.includes('<section class="section bc-cta">'))throw Error('Missing CTA insertion for '+page);
     txt=txt.replace('<section class="section bc-cta">',effectSection(page)+'<section class="section bc-cta">');
   }
   if(page==='index'){
     const words=['Domestic & Commercial Fridges','Cold Room Construction','Freezer Room Repairs','Aircon Installation & Servicing','HVAC Services'];
     const strip='<div class="bc-scroll-ticker" aria-label="Bigcool cooling services"><div class="bc-scroll-ticker-track" aria-hidden="true">'+
       words.concat(words).map(word=>'<span>'+esc(word)+'</span>').join('')+'</div></div>';
     txt=txt.replace('<section class="bc-trust-strip">',strip+'<section class="bc-trust-strip">');
   }
 }
 write(name,txt);
}
for(const asset of ['bigcool-motion.css','bigcool-motion.js']){
 const from=path.join(__dirname,asset);if(!fs.existsSync(from))throw Error('Missing '+asset);
 fs.copyFileSync(from,path.join(root,asset));
}
console.log('UltraMax 7 Pro Premium v8 restored: animated headings, photo-backed flip cards, motion CSS/JS, refreshed PWA and original Bigcool photos.');
