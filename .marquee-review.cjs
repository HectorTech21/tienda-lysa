const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const assert = require('node:assert/strict');
const delay = ms => new Promise(r => setTimeout(r, ms));
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'lysa-marquee-'));
console.log('Temporary review folder:', folder);
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', '--disable-background-networking', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--remote-allow-origins=*', '--user-data-dir='+folder, 'about:blank'], {windowsHide:true, stdio:'ignore'});
let socket;
const pending = new Map();
const errors = [];
const keepAlive = setInterval(() => {}, 1000);
let serial = 0;
async function send(method, params={}) {
  if(process.env.CDP_DEBUG) console.log('Send:',method);
  const id = ++serial;
  return new Promise((resolve,reject) => {
    pending.set(id, {resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
    setTimeout(() => { if(pending.has(id)) { pending.delete(id); reject(new Error('Timeout: '+method)); } },20000).unref();
  });
}
async function evaluate(expression) {
  const r = await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function viewport(width, mobile=false) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:mobile?844:1000,deviceScaleFactor:1,mobile});
  await send('Emulation.setTouchEmulationEnabled',{enabled:mobile});
}
async function media(value) {
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value}]});
}
async function load() {
  await send('Page.navigate',{url:pathToFileURL(path.join(process.cwd(),'index.html')).href});
  for(let i=0;i<100;i++) {
    if(await evaluate('document.readyState === "complete" && document.querySelectorAll(".marquee-group").length >= 2')) return;
    await delay(100);
  }
  throw new Error('Page failed to load');
}
const snapshot = `(() => {
  const w=document.querySelector('.marquee-window'),t=document.querySelector('.marquee-track'),s=getComputedStyle(t);
  return { reduced:matchMedia('(prefers-reduced-motion: reduce)').matches, hover:matchMedia('(hover:hover) and (pointer:fine)').matches,
    animation:s.animation, transform:s.transform, state:s.animationPlayState, classes:w.className, scroll:w.scrollLeft,
    active:document.activeElement.outerHTML.slice(0,180), groups:[...t.children].map(g=>({width:g.getBoundingClientRect().width,x:g.getBoundingClientRect().x})),
    pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,overflow:getComputedStyle(w).overflowX };
})()`;
async function screenshot(name) {
  const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(folder,name+'.png'),Buffer.from(r.data,'base64'));
}
async function normalRun(width,mobile) {
  const name=mobile?'mobile':'desktop';
  await viewport(width,mobile);
  await media('no-preference');
  await load();
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
  await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'})");
  await delay(150);
  await evaluate(`window.motionReview = {samples:[], wraps:[], failures:[], stop:false};
    (function sample() {
      const r=window.motionReview,t=document.querySelector('.marquee-track'),a=t.getAnimations()[0],w=document.querySelector('.marquee-window');
      const duration=a.effect.getTiming().duration, time=a.currentTime, groups=[...t.children].map(g=>g.getBoundingClientRect());
      const buttons=[...t.querySelectorAll('.brand-item')].map(b=>({brand:b.dataset.brand,x:b.getBoundingClientRect().x,width:b.getBoundingClientRect().width})).filter(b=>b.x+b.width>0 && b.x<innerWidth);
      const frame={time,x:groups[0].x,width:groups[0].width,cycle:Math.floor(time/duration),buttons};
      const last=r.samples.at(-1);
      if(last && frame.cycle>last.cycle) r.wraps.push({before:last,after:frame});
      if(Math.abs(groups[0].width-groups[1].width)>.1 || groups[1].right < w.clientWidth-.1 || groups[0].left>0.1 || !buttons.length) r.failures.push(frame);
      if(last) { let dx=frame.x-last.x; if(frame.cycle>last.cycle) dx-=frame.width; if(Math.abs(dx+(time-last.time)*frame.width/duration)>1) r.failures.push({jump:true,last,frame}); }
      r.samples.push(frame);
      if(!r.stop) requestAnimationFrame(sample);
    })()`);
  const initial=await evaluate(snapshot);
  console.log(name+' initial:',initial);
  await screenshot(name+'-start');
  await delay(5000);
  const at5=await evaluate(snapshot);
  assert(at5.groups[0].x < initial.groups[0].x-100,name+' must advance after 5 seconds');
  console.log(name+' 5s:',at5.transform);
  await delay(15000);
  const at20=await evaluate(snapshot);
  assert(at20.groups[0].x < at5.groups[0].x-300,name+' must keep advancing after 20 seconds');
  console.log(name+' 20s:',at20.transform);
  await screenshot(name+'-20s');
  await delay(38000);
  console.log(name+' 58s: still running, waiting for a complete 75-second loop');
  await delay(19000);
  await evaluate('window.motionReview.stop=true');
  const report=await evaluate(`({frames:motionReview.samples.length,wraps:motionReview.wraps,failures:motionReview.failures.slice(0,3),state:getComputedStyle(document.querySelector('.marquee-track')).animationPlayState})`);
  assert.equal(report.failures.length,0,JSON.stringify(report.failures));
  assert(report.wraps.length>=1,name+' must complete an actual loop');
  for(const wrap of report.wraps) {
    for(const before of wrap.before.buttons.filter(b=>b.x>10 && b.x+b.width<width-10)) {
      assert(wrap.after.buttons.some(after=>after.brand===before.brand && Math.abs(after.x-before.x)<10),'visible logo must continue through the seam');
    }
  }
  console.log(name+' complete loop:',JSON.stringify(report));
  await screenshot(name+'-after-loop');
}
async function key(key,shift=false) {
  await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:key==='Tab'?9:13,modifiers:shift?8:0});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:key==='Tab'?9:13,modifiers:shift?8:0});
  await delay(80);
}
async function hit(selector,mobile=false) {
  const point=await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  if(mobile) {
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...point,radiusX:1,radiusY:1}]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } else {
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
    await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  }
  await delay(150);
}
async function interactions() {
  await media('no-preference'); await viewport(1440); await load();
  await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'})");
  const hoverPoint=await evaluate("(()=>{const r=document.querySelector('.marquee-window').getBoundingClientRect();return {x:500,y:r.y+r.height/2}})()");
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',...hoverPoint}); await delay(150);
  const paused=await evaluate(snapshot); await delay(800);
  assert.equal((await evaluate(snapshot)).transform,paused.transform,'hover must pause');
  const pausedTime=await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime");
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0}); await delay(500);
  const resumedTime=await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime");
  assert(resumedTime>pausedTime+300 && resumedTime<pausedTime+700,'hover resume must keep current position');
  // Enter the band with a real Tab key and visit all seven original buttons.
  await evaluate("document.querySelector('#marquee-toggle').focus()");
  const beforeKeyboard=await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime");
  const brands=[];
  for(let i=0;i<7;i++) {
    await key('Tab');
    const focused=await evaluate(`(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),w=document.querySelector('.marquee-window').getBoundingClientRect();return {brand:e.dataset.brand,visible:r.left>=w.left-1 && r.right<=w.right+1,paused:getComputedStyle(document.querySelector('.marquee-track')).animationPlayState}})()`);
    assert(focused.brand && focused.visible && focused.paused==='paused',JSON.stringify(focused)); brands.push(focused.brand);
  }
  assert.equal(new Set(brands).size,7);
  const endKeyboard=await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime");
  assert(Math.abs(endKeyboard-beforeKeyboard)<100,'keyboard navigation must preserve animation timeline');
  await key('Tab');
  assert.equal(await evaluate('document.activeElement.dataset.brand'),'all','duplicates must be skipped by Tab');
  await delay(400);
  assert((await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime"))>endKeyboard+200);
  console.log('Desktop hover and keyboard pause/resume passed; seven fully visible Tab destinations.');

  for(const mobile of [false,true]) {
    await viewport(mobile?390:1440,mobile); await load();
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    await evaluate("document.querySelector('[data-filter-category=bolsos]').click()");
    const ids=await evaluate('BRANDS.map(b=>b.id)');
    for(const id of ids) {
      await evaluate(`document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'});
        (()=>{const b=document.querySelector('.marquee-sequence:not([aria-hidden]) [data-brand="${id}"]'),t=document.querySelector('.marquee-track'),a=t.getAnimations()[0];a.currentTime=Math.max(0,b.offsetLeft-50)/t.firstElementChild.getBoundingClientRect().width*a.effect.getTiming().duration;})()`);
      await delay(80);
      await hit('.marquee-sequence:not([aria-hidden]) [data-brand="'+id+'"]',mobile);
      const state=await evaluate(`({brand:document.querySelector('#brand-select').value,category:document.querySelector('[data-filter-category=bolsos]').getAttribute('aria-pressed'),empty:!document.querySelector('.empty-state').hidden,synced:[...document.querySelectorAll('[data-brand="${id}"]')].every(b=>b.getAttribute('aria-pressed')==='true'),motion:getComputedStyle(document.querySelector('.marquee-track')).animationPlayState})`);
      assert.equal(state.brand,id); assert.equal(state.category,'true'); assert(state.empty && state.synced,JSON.stringify(state));
      if(mobile) assert.equal(state.motion,'running','tap must not stick on hover or focus');
    }
    // A visible duplicate must also filter through the existing click delegation.
    await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('.marquee-track').getAnimations()[0].currentTime=74500");
    await delay(50);
    await hit('.marquee-group[aria-hidden] [data-brand=gladiator]',mobile);
    assert.equal(await evaluate("document.querySelector('#brand-select').value"),'gladiator');
    await evaluate("document.querySelector('.brands-bottom [data-brand=all]').scrollIntoView({behavior:'instant',block:'center'})");
    await hit('.brands-bottom [data-brand=all]',mobile);
    assert.equal(await evaluate("document.querySelector('#brand-select').value"),'all');
    assert.equal(await evaluate("document.querySelector('[data-filter-category=bolsos]').getAttribute('aria-pressed')"),'true');
    await delay(700);
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    const first=await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime");
    await delay(1000);
    assert((await evaluate("document.querySelector('.marquee-track').getAnimations()[0].currentTime"))>first+700);
    console.log((mobile?'Mobile real emulated taps':'Desktop pointer clicks')+': seven brands, duplicate, combined filters, reset, and continued movement passed.');
  }
  await viewport(390,true); await media('reduce'); await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.marquee-track')).animationName"),'none');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.marquee-group[aria-hidden]')).display"),'none');
  assert.equal(await evaluate(`document.querySelectorAll('.marquee-track button:not([tabindex="-1"])').length`),7);
  await evaluate("document.querySelector('.brands-heading').scrollIntoView({behavior:'instant'});document.querySelector('.marquee-sequence button').focus()");
  await key('Tab');
  for(let i=0;i<5;i++) await key('Tab');
  assert.equal(await evaluate('document.activeElement.dataset.brand'),'gabol');
  await screenshot('mobile-reduced-motion-keyboard');
  await evaluate('document.activeElement.blur()');
  await media('no-preference'); await delay(500);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.marquee-track')).animationPlayState"),'running');
  console.log('Reduced motion: static, navigable, duplicates hidden; live preference changes passed.');
  await viewport(1440); await load();
  const dimensions=[];
  for(const width of [320,360,390,580,581,768,850,851,1024,1100,1440,1920,3840,5120]) {
    await viewport(width,width<=850); await delay(80);
    const d=await evaluate(`(()=>{const t=document.querySelector('.marquee-track'),g=[...t.children],w=document.querySelector('.marquee-window');return {width:innerWidth,client:document.documentElement.clientWidth,page:document.documentElement.scrollWidth,groups:g.map(e=>e.getBoundingClientRect().width),sequences:g[0].children.length,accessible:t.querySelectorAll('button:not([tabindex="-1"])').length,overflow:getComputedStyle(w).overflowX,scrollbar:getComputedStyle(w).scrollbarWidth}})()`);
    assert(d.page<=d.client,'page overflow at '+width); assert(Math.abs(d.groups[0]-d.groups[1])<.1); assert(d.groups[0]>=d.client); assert.equal(d.accessible,7); assert.equal(d.overflow,'hidden'); assert.equal(d.scrollbar,'none'); dimensions.push(d);
  }
  console.log('Responsive and wide-screen coverage:',JSON.stringify(dimensions));
  await viewport(1440); await load();
  await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'})");
  await screenshot('final-desktop');
  await viewport(390,true); await load();
  await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'})");
  await screenshot('final-mobile');
}
async function main() {
  let port;
  for(let i=0;i<100;i++) {
    try { port=fs.readFileSync(path.join(folder,'DevToolsActivePort'),'utf8').split('\n')[0]; break; } catch {}
    await delay(100);
  }
  if(!port) throw new Error('Edge did not start');
  console.log('Debug port:',port);
  const targets=await (await fetch('http://127.0.0.1:'+port+'/json/list', {signal:AbortSignal.timeout(10000)})).json();
  console.log('Targets:',targets.map(t=>t.type));
  socket = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>socket.addEventListener('open',r,{once:true}));
  console.log('Socket connected');
  socket.addEventListener('message',e=> {
    if(process.env.CDP_DEBUG) console.log('Message:',String(e.data).slice(0,160));
    const msg=JSON.parse(e.data);
    if(msg.id) { const p=pending.get(msg.id); if(p) {pending.delete(msg.id); msg.error?p.reject(new Error(JSON.stringify(msg.error))):p.resolve(msg.result);} }
    if(msg.method==='Runtime.exceptionThrown' || msg.method==='Log.entryAdded' && msg.params.entry.level==='error' || msg.method==='Runtime.consoleAPICalled' && msg.params.type==='error') errors.push(msg);
  });
  await send('Runtime.enable'); await send('Page.enable'); await send('Log.enable');
  await viewport(1440);
  await load();
  console.log('Default environment:', await evaluate(snapshot));
  if(process.argv.includes('--interactions')) {
    await interactions(); assert.equal(errors.length,0,JSON.stringify(errors));
    console.log('ALL INTERACTION CHECKS PASSED. No console errors.'); return;
  }
  if(process.argv.includes('--final')) {
    await normalRun(1440,false);
    await normalRun(390,true);
    await interactions();
    assert.equal(errors.length,0,JSON.stringify(errors));
    console.log('ALL CHECKS PASSED. No console errors.');
    return;
  }
  await media('no-preference');
  await delay(200);
  console.log('Normal motion:',await evaluate(snapshot));
  await evaluate("document.querySelector('.marquee-window').scrollIntoView({behavior:'instant',block:'center'})");
  await screenshot('baseline-desktop');
  const start=await evaluate(snapshot);
  await delay(5000);
  console.log('After 5 seconds:',await evaluate(snapshot));
  console.log('Errors:',errors);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{ if(socket) {try {await send('Browser.close')} catch{} socket.close();} browser.kill(); clearInterval(keepAlive); });

