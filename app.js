
const CURRENT_WELCOME_VERSION='1.0-RC1';

function initializeBrandSplash(){
 const splash=document.querySelector('#brandSplash');
 if(!splash)return;

 const mode=state.preferences?.welcomeMode||'updates';
 const lastSeen=localStorage.getItem('uvpc-last-welcome-version')||state.preferences.lastWelcomeVersion||'';
 const shouldShow=mode==='always'||(mode==='updates'&&lastSeen!==CURRENT_WELCOME_VERSION);

 if(!shouldShow){
  splash.remove();
  return;
 }

 if(typeof window.UVPCDismissWelcome==='function'){
  // The standalone page controller already owns click and keyboard dismissal.
  splash.focus();
 }
}


function initializeSupportMilestone(){
 const key='uvpc-support-reminder-dismissed';
 const usageCount=state.projects?.length||0;
 const reminder=$('#milestoneSupport');
 if(!reminder||localStorage.getItem(key)==='true'||usageCount<10)return;

 $('#milestoneTitle').textContent=`You have ${usageCount} saved projects.`;
 $('#milestoneText').textContent='If UV Project Calculator Pro has helped your work, consider supporting continued development.';
 reminder.hidden=false;

 $('#closeMilestoneBtn').addEventListener('click',()=>{
  reminder.hidden=true;
  localStorage.setItem(key,'true');
 });
 $('#milestoneSupportBtn').addEventListener('click',()=>{
  reminder.hidden=true;
  navigate('support');
 });
}




function initializeSupportPage(){
 if($('#supportPayPalStatus'))$('#supportPayPalStatus').textContent='Opens PayPal securely';
 if($('#supportCoffeeStatus'))$('#supportCoffeeStatus').textContent='Opens Buy Me a Coffee securely';
 initializeSupportMilestone();
}


const SUPPORT_CONFIG={
 paypalUrl:'https://www.paypal.com/ncp/payment/QDN4D4CWH7Y7C',
 buyMeACoffeeUrl:'https://buymeacoffee.com/wetthefsce'
};


function renderSetupProfile(){
 if($('#setupProfileName'))$('#setupProfileName').textContent=state.profile.name;
 if($('#setupProfileBusiness'))$('#setupProfileBusiness').textContent=state.profile.business;
 if($('#setupProfileCountry'))$('#setupProfileCountry').textContent=state.profile.country;
 if($('#setupProfileCurrency'))$('#setupProfileCurrency').textContent=state.profile.currency;
}


function runTerminologyAudit(){
 const forbidden=['What-If Pricing','Quote Summary','Recommended Order Total'];
 const text=document.body.innerText;
 forbidden.forEach(term=>{
  if(text.includes(term))console.warn(`Terminology audit: legacy label still present: ${term}`);
 });
}

window.addEventListener('error',event=>{
 console.error('UV Project Calculator Pro startup error:',event.error||event.message);
 const toast=document.querySelector('#toast');
 if(toast){
  toast.textContent='An application error occurred. Open the browser console for details.';
  toast.classList.add('show');
 }
});
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function initializePricingWorkspaceRecalculation(){
 const quantityField=document.getElementById('quantity');
 if(quantityField){
  const recalculate=()=>{
   calculate();
   if(typeof renderDashboard==='function')renderDashboard();
  };
  quantityField.addEventListener('input',recalculate);
  quantityField.addEventListener('change',recalculate);
 }
 document.querySelectorAll('#view-calculator input, #view-calculator select').forEach(control=>{
  if(control===quantityField)return;
  if(control.dataset.pricingRecalcBound==='true')return;
  control.dataset.pricingRecalcBound='true';
  control.addEventListener('input',()=>calculate());
  control.addEventListener('change',()=>calculate());
 });
}


const UVPC_APP_VERSION='1.0 RC1';
const UVPC_BUILD_NUMBER='1023';
const UVPC_SUPPORT_EMAIL='MrDon123@gmail.com';

function getCurrentScreenName(){
 const active=document.querySelector('.view.active');
 if(!active)return 'Unknown';
 const key=active.id.replace('view-','');
 return titles[key]?.[0]||key;
}

function detectOperatingSystem(){
 const ua=navigator.userAgent||'';
 const platform=navigator.userAgentData?.platform||navigator.platform||'Unknown';
 if(/Windows/i.test(ua)||/Win/i.test(platform))return 'Windows';
 if(/Macintosh|Mac OS X/i.test(ua)||/Mac/i.test(platform))return 'macOS';
 if(/iPad|iPhone|iPod/i.test(ua))return 'iOS/iPadOS';
 if(/Android/i.test(ua))return 'Android';
 if(/Linux/i.test(ua)||/Linux/i.test(platform))return 'Linux';
 return platform;
}

function detectBrowser(){
 const ua=navigator.userAgent||'';
 if(/Edg\//.test(ua))return 'Microsoft Edge';
 if(/OPR\//.test(ua))return 'Opera';
 if(/Chrome\//.test(ua)&&!/Edg\//.test(ua))return 'Google Chrome';
 if(/Firefox\//.test(ua))return 'Mozilla Firefox';
 if(/Safari\//.test(ua)&&!/Chrome\//.test(ua))return 'Apple Safari';
 return ua||'Unknown browser';
}

function buildFeedbackDiagnostics(){
 let printer='Unknown';
 try{printer=activePrinterLabel()}catch(error){printer=state?.printer?.model||'Unknown'}
 return [
  'Automatic Diagnostic Information',
  '----------------------------------------',
  `Application: UV Project Calculator Pro Community Edition`,
  `Version: ${UVPC_APP_VERSION}`,
  `Build: ${UVPC_BUILD_NUMBER}`,
  `Browser: ${detectBrowser()}`,
  `Operating System: ${detectOperatingSystem()}`,
  `Current Screen: ${getCurrentScreenName()}`,
  `Active Printer: ${printer}`,
  `Date and Time: ${new Date().toLocaleString()}`,
  `Storage Status: ${document.querySelector('#storageStatusLabel')?.textContent||'Unknown'}`,
  '----------------------------------------'
 ].join('\n');
}

function openEmailDraft(subject,body){
 const uri=`mailto:${UVPC_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 window.location.href=uri;
}

function openFeedbackModal(id){
 const modal=document.getElementById(id);
 if(modal)modal.hidden=false;
}

function closeFeedbackModal(id){
 const modal=document.getElementById(id);
 if(modal)modal.hidden=true;
}

function initializeFeedbackCenter(){
 const preview=document.getElementById('feedbackDiagnosticsPreview');
 if(preview)preview.textContent=buildFeedbackDiagnostics();

 const bugButton=document.getElementById('openBugReportBtn');
 const featureButton=document.getElementById('openFeatureRequestBtn');
 const contactButton=document.getElementById('contactSupportBtn');

 if(bugButton)bugButton.addEventListener('click',()=>openFeedbackModal('bugReportModal'));
 if(featureButton)featureButton.addEventListener('click',()=>openFeedbackModal('featureRequestModal'));
 if(contactButton)contactButton.addEventListener('click',()=>{
  const body=[
   'Hello Don,',
   '',
   'I need help with UV Project Calculator Pro.',
   '',
   'My question:',
   '',
   '',
   buildFeedbackDiagnostics()
  ].join('\n');
  openEmailDraft('UV Project Calculator Pro Support Request',body);
 });

 document.querySelectorAll('[data-close-feedback-modal]').forEach(button=>{
  button.addEventListener('click',()=>closeFeedbackModal(button.dataset.closeFeedbackModal));
 });

 const bugSend=document.getElementById('sendBugReportBtn');
 if(bugSend)bugSend.addEventListener('click',()=>{
  const doing=document.getElementById('bugDoing').value.trim();
  const happened=document.getElementById('bugHappened').value.trim();
  const expected=document.getElementById('bugExpected').value.trim();
  if(!doing||!happened||!expected){
   showToast('Please complete all three bug-report fields.');
   return;
  }
  const include=document.getElementById('bugIncludeDiagnostics').checked;
  const body=[
   'UV Project Calculator Pro Bug Report',
   '',
   'What I was doing:',
   doing,
   '',
   'What happened:',
   happened,
   '',
   'What I expected:',
   expected,
   '',
   include?buildFeedbackDiagnostics():'Diagnostic information was not included.'
  ].join('\n');
  openEmailDraft(`UV Project Calculator Pro Bug Report — Build ${UVPC_BUILD_NUMBER}`,body);
 });

 const featureSend=document.getElementById('sendFeatureRequestBtn');
 if(featureSend)featureSend.addEventListener('click',()=>{
  const title=document.getElementById('featureTitle').value.trim();
  const description=document.getElementById('featureDescription').value.trim();
  const benefit=document.getElementById('featureBenefit').value.trim();
  const priority=document.getElementById('featurePriority').value;
  if(!title||!description||!benefit){
   showToast('Please complete the feature title, description, and workflow benefit.');
   return;
  }
  const include=document.getElementById('featureIncludeDiagnostics').checked;
  const body=[
   'UV Project Calculator Pro Feature Request',
   '',
   `Feature: ${title}`,
   `Priority: ${priority}`,
   '',
   'Description:',
   description,
   '',
   'How it would improve my workflow:',
   benefit,
   '',
   include?buildFeedbackDiagnostics():'Diagnostic information was not included.'
  ].join('\n');
  openEmailDraft(`UV Project Calculator Pro Feature Request — ${title}`,body);
 });

 const copyButton=document.getElementById('copyDiagnosticsBtn');
 if(copyButton)copyButton.addEventListener('click',async()=>{
  const text=buildFeedbackDiagnostics();
  if(preview)preview.textContent=text;
  try{
   await navigator.clipboard.writeText(text);
   showToast('Diagnostics copied.');
  }catch(error){
   window.prompt('Copy diagnostic information:',text);
  }
 });
}


function applyAppearanceState(){
 const isLight=document.body.classList.contains('light');
 const darkToggle=$('#darkToggleSettings');
 const compactToggle=$('#compactToggleSettings');
 if(darkToggle)darkToggle.checked=!isLight;
 if(compactToggle)compactToggle.checked=document.body.classList.contains('compact');
}
function initializeConsolidatedSettings(){
 const themeButton=$('#themeBtn');
 const darkToggle=$('#darkToggleSettings');
 const compactToggle=$('#compactToggleSettings');
 const setupButton=$('#runGuidedSetupBtn');

 if(themeButton)themeButton.addEventListener('click',()=>{
  document.body.classList.toggle('light');
  applyAppearanceState();
 });
 if(darkToggle)darkToggle.addEventListener('change',event=>{
  document.body.classList.toggle('light',!event.target.checked);
  applyAppearanceState();
 });
 if(compactToggle)compactToggle.addEventListener('change',event=>{
  document.body.classList.toggle('compact',event.target.checked);
  applyAppearanceState();
 });
 if(setupButton)setupButton.addEventListener('click',()=>showWizard(true));
}

const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n)||0);
const defaults={
 profile:{name:'UV Printer Owner',business:'UV Project Calculator Pro',country:'United States',currency:'USD',setupComplete:false},
 business:{owner:'Donald Youngner',email:'',phone:'',website:'',overhead:0,tax:0,shipping:0,quoteValidity:'14 days',deposit:0,terms:'Thank you for the opportunity to provide this estimate.'},
 printer:{model:'EufyMake E1',profileName:'Main E1 Printer',inkCartridgePrice:29.99,inkCartridgeCapacity:100,cleaningCartridgePrice:29.99,cleaningCartridgeCapacity:380,cleaning:.25,primerDefault:.35,serviceReserve:.50},
 printerProfiles:{'eufymake-e1':{family:'EufyMake E1',editions:{standard:{name:'EufyMake E1',edition:'Standard UV Profile',workflows:['Direct UV','UV DTF','Rotary','3D Texture'],inkFields:['cyan','magenta','yellow','black','white','gloss'],rates:{ink:.2999,cyan:.2999,magenta:.2999,yellow:.2999,black:.2999,white:.2999,gloss:.2999,fluorescent:0,flexWhite:0,dtColor:0,dtWhite:0,machine:5,electric:.30,maintenance:.50,cleaning:.25,primer:.35,serviceReserve:.50},cartridges:{inkPrice:29.99,inkCapacity:100,cleaningPrice:29.99,cleaningCapacity:380},note:'Official US EufyMake pricing effective July 2026: CMYKWG ink cartridges are $29.99 per 100 mL and the cleaning cartridge is $29.99 per 380 mL. Review regional pricing before quoting.'}}},'xtool-o1':{family:'xTool O1 Omni Printer',editions:{'single-uv':{name:'xTool O1 Omni Printer',edition:'Single UV Edition',workflows:['Direct UV','UV DTF'],inkFields:['cyan','magenta','yellow','black','white','gloss'],rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,gloss:.56,fluorescent:0,flexWhite:0,dtColor:0,dtWhite:0,machine:7.5,electric:.40,maintenance:.75,cleaning:.35,primer:.35,serviceReserve:.75},note:'Starter rates are editable placeholders until actual xTool cartridge costs are entered.'},'dual-uv':{name:'xTool O1 Omni Printer',edition:'Dual-Head UV Edition',workflows:['Direct UV','UV DTF','Fluorescent Effects','Flexible White'],inkFields:['cyan','magenta','yellow','black','white','gloss','fluorescent','flexWhite'],rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,gloss:.56,fluorescent:.65,flexWhite:.65,dtColor:0,dtWhite:0,machine:10,electric:.50,maintenance:1,cleaning:.45,primer:.35,serviceReserve:1},note:'Adds fluorescent and flexible-white channels. Review all starter rates.'},'uv-dt-fabric':{name:'xTool O1 Omni Printer',edition:'UV + DT Fabric Edition',workflows:['Direct UV','UV DTF','DTG','DTF'],inkFields:['cyan','magenta','yellow','black','white','gloss','dtColor','dtWhite'],rates:{cyan:.50,magenta:.50,yellow:.50,black:.50,white:.57,gloss:.56,fluorescent:0,flexWhite:0,dtColor:.55,dtWhite:.60,machine:10,electric:.55,maintenance:1.1,cleaning:.50,primer:.35,serviceReserve:1.1},note:'Adds DT color and white channels for fabric work. Review all starter rates.'}}}},
 activePrinter:{family:'eufymake-e1',edition:'standard',workflow:'Direct UV'},
 preferences:{numberFormat:'us',autosave:true,lastCustomer:false,showCosts:true,confirmDelete:true,defaultStatus:'Draft',rounding:'1',welcomeMode:'updates',lastWelcomeVersion:''},
 activities:[
  {icon:'✓',text:'Community Edition loaded',time:'Today'},
  {icon:'▤',text:'Sample project data prepared',time:'Today'},
  {icon:'⚙',text:'Default shop rates applied',time:'Today'}
 ],
 rates:{ink:0.2999,color:0.2999,white:0.2999,varnish:0.2999,labor:27,machine:5,electric:0.30,maintenance:0.50,waste:5,margin:45},
 templates:[
  {name:'4-Inch Ceramic Coaster',icon:'◉',category:'Ceramic',blank:.77,packaging:.70},
  {name:'3-Inch Ceramic Coaster',icon:'●',category:'Ceramic',blank:.54,packaging:.55},
  {name:'Leather Patch',icon:'▱',category:'Leather',blank:1.15,packaging:.25},
  {name:'Acrylic Sign',icon:'▭',category:'Acrylic',blank:3.40,packaging:1.10}
 ],
 customers:[
  {name:'Walk-in Customer',type:'Retail',discount:0,email:'—'},
  {name:'James Walker',type:'Repeat Customer',discount:5,email:'james@example.com'},
  {name:'Sarah Johnson',type:'Retail',discount:0,email:'sarah@example.com'}
 ],
 materials:[
  {name:'4-Inch Ceramic Round',category:'Ceramic',cost:.77,supplier:'Primary Supplier',sku:'CER-4',note:'Standard coaster blank'},
  {name:'3-Inch Ceramic Round',category:'Ceramic',cost:.54,supplier:'Primary Supplier',sku:'CER-3',note:'Small coaster blank'},
  {name:'Faux Leather Patch',category:'Leather',cost:1.15,supplier:'Patch Vendor',sku:'LP-BRN',note:'Brown adhesive-back'},
  {name:'Clear Acrylic Plate',category:'Acrylic',cost:3.40,supplier:'Acrylic Vendor',sku:'ACR-CLR',note:'Small sign blank'}
 ],
 projects:[
  {id:1,status:'Approved',notes:'',name:'Custom Leather Patch',customer:'James Walker',qty:10,cost:73.25,price:125,margin:41.4,date:'Jul 10, 2026'},
  {id:2,status:'Quoted',notes:'',name:'Coasters - Eagle Design',customer:'Walk-in Customer',qty:4,cost:47.45,price:86.75,margin:45.3,date:'Jul 9, 2026'},
  {id:3,status:'In Production',notes:'',name:'Tumbler UV Print',customer:'Sarah Johnson',qty:1,cost:20.02,price:32.40,margin:38.2,date:'Jul 8, 2026'},
  {id:4,status:'Completed',notes:'',name:'Nameplate - Aluminum',customer:'Walk-in Customer',qty:2,cost:34.80,price:58.10,margin:40.1,date:'Jul 7, 2026'},
  {id:5,status:'Estimate',notes:'',name:'4-Inch Ceramic Coaster',customer:'Walk-in Customer',qty:1,cost:9.42,price:31,margin:69.6,date:'Jul 12, 2026'}
 ]
};
let state=window.__UVPC_INITIAL_STATE__||structuredClone(defaults);
state.profile={...defaults.profile,...(state.profile||{})};
state.activities=state.activities||structuredClone(defaults.activities);
state.business={...defaults.business,...(state.business||{})};
state.printer={...defaults.printer,...(state.printer||{})};
state.printerProfiles=state.printerProfiles||structuredClone(defaults.printerProfiles);
state.activePrinter={...defaults.activePrinter,...(state.activePrinter||{})};
state.preferences={...defaults.preferences,...(state.preferences||{})};

state.rates={...defaults.rates,...(state.rates||{})};
if(!Number.isFinite(Number(state.rates.ink))){
 const legacy=[state.rates.color,state.rates.white,state.rates.varnish].map(Number).filter(Number.isFinite);
 state.rates.ink=legacy.length?legacy.reduce((a,b)=>a+b,0)/legacy.length:defaults.rates.ink;
}
state.printer={
 ...defaults.printer,
 ...(state.printer||{}),
 inkCartridgePrice:Number(state.printer?.inkCartridgePrice)||defaults.printer.inkCartridgePrice,
 inkCartridgeCapacity:Number(state.printer?.inkCartridgeCapacity)||defaults.printer.inkCartridgeCapacity,
 cleaningCartridgePrice:Number(state.printer?.cleaningCartridgePrice)||defaults.printer.cleaningCartridgePrice,
 cleaningCartridgeCapacity:Number(state.printer?.cleaningCartridgeCapacity)||defaults.printer.cleaningCartridgeCapacity
};

state.materials=(state.materials||[]).map(m=>({supplier:'',sku:'',...m}));
state.projects=(state.projects||[]).map(p=>({status:'Draft',notes:'',printer:'EufyMake E1 — Standard UV Profile',printerFamily:'eufymake-e1',printerEdition:'standard',...p}));
let editingId=null;
let scenarioOriginal=null;
let scenarioSourceId=null;
function save(activityText){
 if(activityText){state.activities.unshift({icon:'✓',text:activityText,time:'Just now'});state.activities=state.activities.slice(0,8)}
 window.UVPCStorage.saveState(state).then(()=>{
  const label=$('#storageStatusLabel');if(label)label.textContent='Saved locally';
  const last=$('#lastAutoSave');if(last)last.textContent=new Date().toLocaleString();
  showToast('Saved locally');
 }).catch(error=>{console.error(error);showToast('Local save failed')});
}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
const titles={
 dashboard:['Business Dashboard','See the price, profit, margin, and health of your current UV project at a glance.'],
 projects:['Projects','Manage estimates, quotes, and production jobs.'],
 calculator:['Pricing Workspace','Build accurate quotes using your real production costs.'],
 templates:['Templates Library','Create and manage reusable project presets.'],
 customers:['Customers Library','Manage customer details, discounts, and contact information.'],
 materials:['Materials Library','Maintain blanks, supplies, suppliers, SKUs, and unit costs.'],
 global:['Application Settings','Manage cost rates, printer, business, backup, preferences, appearance, setup, readiness, and reset options.'],
 whatif:['Scenario Builder','Experiment freely without changing the original project.'],
 reports:['Reports','Review selling prices, production costs, profit, and project performance.'],
 help:['Help & Feedback','Report bugs, request features, and contact support.'],
 support:['Support the Project','Optional ways to support continued development.'],
 about:['About','Application information, version details, and edition status.']
};
function navigate(view){
 $$('.view').forEach(v=>v.classList.remove('active')); $('#view-'+view).classList.add('active');
 $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
 $('#pageTitle').textContent=titles[view][0];$('#pageSubtitle').textContent=titles[view][1];
 $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
 if(view==='calculator') calculate(); if(view==='reports') renderReports(); if(view==='help'){const p=$('#feedbackDiagnosticsPreview');if(p)p.textContent=buildFeedbackDiagnostics();}
}
$$('.nav-item[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
$$('[data-view-target]').forEach(b=>b.onclick=()=>navigate(b.dataset.viewTarget));
$$('[data-open-calculator]').forEach(b=>b.onclick=()=>{editingId=null;resetForm();navigate('calculator')});
$('#newProjectBtn').onclick=()=>{editingId=null;resetForm();navigate('calculator')}; $('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');

function totals(){
 const revenue=state.projects.reduce((s,p)=>s+p.price,0),cost=state.projects.reduce((s,p)=>s+p.cost,0),profit=revenue-cost;
 return {revenue,cost,profit,margin:revenue?profit/revenue*100:0};
}
function getDashboardProject(){
 const select=$('#dashboardProjectSelect');
 const selectedId=select?Number(select.value):dashboardSelectedProjectId;
 return state.projects.find(p=>Number(p.id)===selectedId)||state.projects[state.projects.length-1]||null;
}
function getBusinessHealth(project){
 if(!project)return {level:'neutral',label:'No Project',title:'No Project Selected',message:'Select a project to review pricing and profitability.',recommendation:'Create or select a project to begin.'};
 const target=Number(state.rates.margin)||45;
 const margin=Number(project.margin)||0;
 const profit=Number(project.price)-Number(project.cost);
 if(profit<=0||margin<target-15)return {level:'danger',label:'Action Required',title:'Below Target',message:`This project is producing ${money(profit)} profit at a ${margin.toFixed(1)}% margin.`,recommendation:`Increase the selling price to approximately ${money(project.cost/(1-target/100))} to reach the ${target.toFixed(1)}% target margin.`};
 if(margin<target)return {level:'warning',label:'Review Pricing',title:'Review Pricing',message:`The project is profitable, but its ${margin.toFixed(1)}% margin is below your ${target.toFixed(1)}% target.`,recommendation:`Consider increasing the quote by ${money(Math.max(0,project.cost/(1-target/100)-project.price))}.`};
 return {level:'good',label:'Healthy',title:'Healthy Project',message:`The project meets or exceeds your ${target.toFixed(1)}% target margin.`,recommendation:'The current customer quote supports your pricing goal. No increase is required.'};
}
function renderDashboard(){
 const t=totals();
 const hour=new Date().getHours(),greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
 if($('#dashboardGreeting'))$('#dashboardGreeting').textContent=`${greeting}, ${state.profile.name}.`;
 $('#accountName').textContent=state.profile.name;$('#menuAccountName').textContent=state.profile.name;$('#menuBusinessName').textContent=state.profile.business;
 $('#accountAvatar').textContent=state.profile.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'UV';
 $('#setupProgressBar').style.width=state.profile.setupComplete?'100%':'35%';
 $('#setupSummary').textContent=state.profile.setupComplete?`Configured for ${state.profile.business}. You can rerun setup at any time.`:'Complete Guided Setup to personalize printer costs, business rates, and pricing goals.';

 populateDashboardProjectSelect();
 const p=getDashboardProject();
 const health=getBusinessHealth(p);
 const target=Number(state.rates.margin)||45;

 $('#metricProjects').textContent=state.projects.length;
 $('#sumRevenue').textContent=money(t.revenue);
 $('#metricProfit').textContent=money(t.profit);
 $('#metricMargin').textContent=t.margin.toFixed(1)+'%';

 if(p){
  const profit=p.price-p.cost;
  const unitPrice=p.price/Math.max(1,p.qty);
  $('#dashboardHeroPrice').textContent=money(p.price);
  $('#dashboardHeroUnit').textContent=`${money(unitPrice)} per unit`;
  $('#dashboardHeroProject').textContent=p.name;
  $('#dashboardHeroStatus').textContent=p.status||'Draft';
  $('#dashboardProductionCost').textContent=money(p.cost);
  $('#dashboardExpectedProfit').textContent=money(profit);
  $('#dashboardProfitPerUnit').textContent=`${money(profit/Math.max(1,p.qty))} profit per item`;
  $('#dashboardProfitMargin').textContent=(p.margin||0).toFixed(1)+'%';
  $('#dashboardMarginTarget').textContent=`Target ${target.toFixed(1)}%`;
  $('#dashboardHeroMessage').textContent=health.message;
  $('#currentProjectName').textContent=p.name;
  $('#currentProjectCustomer').textContent=p.customer;
  $('#currentProjectPrinter').textContent=p.printer||activePrinterLabel();
  $('#currentProjectStatus').textContent=p.status||'Draft';
  $('#currentProjectStatus').className=`dashboard-status ${getProjectStatusClass(p.status)}`;
  $('#dashboardHeroStatus').className=`dashboard-status ${getProjectStatusClass(p.status)}`;
  $('#currentProjectQuantity').textContent=p.qty;
  $('#currentProjectDate').textContent=p.date||'—';
 }else{
  ['dashboardHeroPrice','dashboardProductionCost','dashboardExpectedProfit'].forEach(id=>$('#'+id).textContent='$0.00');
  $('#dashboardHeroUnit').textContent='$0.00 per unit';$('#dashboardProfitMargin').textContent='0.0%';$('#dashboardMarginTarget').textContent=`Target ${target.toFixed(1)}%`;
  $('#dashboardHeroProject').textContent='No project selected';$('#dashboardHeroStatus').textContent='—';$('#dashboardHeroMessage').textContent=health.message;
  ['currentProjectName','currentProjectCustomer','currentProjectPrinter','currentProjectStatus','currentProjectQuantity','currentProjectDate'].forEach(id=>$('#'+id).textContent='—');
  $('#currentProjectStatus').className='';$('#dashboardHeroStatus').className='';
 }

 const card=$('#businessHealthCard');
 card.classList.remove('warning','danger-state');
 if(health.level==='warning')card.classList.add('warning');
 if(health.level==='danger')card.classList.add('danger-state');
 $('#businessHealthTitle').textContent=health.title;
 $('#businessHealthMessage').textContent=health.message;
 $('#businessHealthRecommendation').textContent=health.recommendation;
 $('#dashboardHealthPill').textContent=health.label;
 $('#businessHealthIndicator').textContent='●';

 const profile=getActivePrinterProfile();
 const printerCard=$('#activePrinterDashboardCard');
 if(printerCard){
  printerCard.classList.remove('eufymake','xtool');
  printerCard.classList.add(state.activePrinter.family==='xtool-o1'?'xtool':'eufymake');
 }
 $('#dashboardPrinterName').textContent=profile.name;
 $('#dashboardPrinterEdition').textContent=profile.edition;
 $('#dashboardPrinterWorkflow').textContent=state.activePrinter.workflow||profile.workflows[0];
 $('#dashboardMachineRate').textContent=`${money(state.rates.machine)}/hr`;
 $('#dashboardPrinterMark').textContent=state.activePrinter.family==='xtool-o1'?'xT':'E1';
 if($('#dashboardHeroPrinter'))$('#dashboardHeroPrinter').textContent=`${profile.name} — ${profile.edition}`;

 renderDashboardBackupStatus();
 $('#recentProjectsBody').innerHTML=state.projects.slice(-5).reverse().map(project=>`<tr data-project-id="${project.id}"><td><strong>${esc(project.name)}</strong><br><small>${esc(project.date||'')}</small></td><td>${esc(project.customer)}</td><td><strong>${money(project.price)}</strong></td><td class="positive">${money(project.price-project.cost)}</td><td class="${project.margin>=target?'positive':''}">${project.margin.toFixed(1)}%</td><td><span class="status-pill">${esc(project.status||'Draft')}</span></td></tr>`).join('')||'<tr><td colspan="6">No projects yet. Create your first quote to activate Dashboard 2.0.</td></tr>';
 document.querySelectorAll('#recentProjectsBody tr[data-project-id]').forEach(row=>row.onclick=()=>{dashboardSelectedProjectId=Number(row.dataset.projectId);$('#dashboardProjectSelect').value=String(dashboardSelectedProjectId);renderDashboard()});
}
function renderDashboardBackupStatus(){
 const raw=localStorage.getItem('uvpc-last-backup-at');
 const dot=$('#dashboardBackupDot'),health=$('#dashboardBackupHealth'),last=$('#dashboardBackupLast');
 if(!raw){
  dot.classList.remove('good');health.textContent='Backup Needed';last.textContent='No backup recorded';
 }else{
  const date=new Date(raw),days=(Date.now()-date.getTime())/86400000;
  last.textContent=`Last backup: ${date.toLocaleString()}`;
  if(days<=14){dot.classList.add('good');health.textContent='Protected'}
  else{dot.classList.remove('good');health.textContent='Backup Overdue'}
 }
 const storageLabel=$('#storageStatusLabel')?.textContent||'IndexedDB local storage active';
 $('#dashboardStorageHealth').textContent=storageLabel.includes('fail')?'Local storage needs attention.':'IndexedDB local storage is active.';
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

let dashboardSelectedProjectId=null;
function populateDashboardProjectSelect(){
 const select=$('#dashboardProjectSelect');
 if(!select)return;
 const current=dashboardSelectedProjectId!==null?String(dashboardSelectedProjectId):select.value;
 select.innerHTML=state.projects.map(p=>`<option value="${p.id}">${esc(p.name)} — ${esc(p.customer)}</option>`).join('');
 if(state.projects.some(p=>String(p.id)===String(current))){
  select.value=String(current);
  dashboardSelectedProjectId=Number(current);
 }else if(state.projects.length){
  const latest=state.projects[state.projects.length-1];
  select.value=String(latest.id);
  dashboardSelectedProjectId=Number(latest.id);
 }
}
function updateDashboardProjectSnapshot(){
 dashboardSelectedProjectId=Number($('#dashboardProjectSelect').value);
 renderDashboard();
}
function renderDashboardProjectSnapshot(){populateDashboardProjectSelect();}
let activeProjectTypeFilter='all';
function getProjectVisualType(project){
 if(project.projectType==='scenario')return 'scenario';
 if(project.projectType==='production')return 'production';
 const name=String(project.name||'').toLowerCase();
 const notes=String(project.notes||'').toLowerCase();
 return name.includes('scenario')||notes.includes('created in scenario builder')?'scenario':'production';
}
function getProjectStatusClass(status){
 const value=String(status||'Draft').toLowerCase().replace(/\s+/g,'-');
 const allowed=['draft','estimate','quoted','approved','in-production','completed','cancelled'];
 return allowed.includes(value)?value:'draft';
}
function renderProjects(){
 const q=$('#projectSearch').value.toLowerCase(),f=$('#projectFilter').value;
 const rows=state.projects.filter(p=>{
  const type=getProjectVisualType(p);
  return (p.name+' '+p.customer).toLowerCase().includes(q)
   &&(f==='all'||(f==='high'?p.margin>=40:p.margin<40))
   &&(activeProjectTypeFilter==='all'||type===activeProjectTypeFilter);
 });
 $('#projectCards').innerHTML=rows.map(p=>{
  const type=getProjectVisualType(p);
  const statusClass=getProjectStatusClass(p.status);
  return `<article class="project-card project-${type}">
   
   <div class="project-card-header">
    <div><h3>${esc(p.name)}</h3><p>${esc(p.customer)} · ${p.date}</p></div>
    <span class="project-type-badge ${type}">${type==='scenario'?'Scenario':'Production'}</span>
   </div>
   <span class="project-status-badge ${statusClass}">${esc(p.status||'Draft')}</span>
   <div class="financial-snapshot">
    <div><span>Selling Price</span><strong>${money(p.price)}</strong></div>
    <div><span>Profit</span><strong class="${p.price-p.cost<0?'profit-status-negative':'positive'}">${money(p.price-p.cost)}</strong></div>
    <div><span>Margin</span><strong>${p.margin.toFixed(1)}%</strong></div>
    <div><span>Quantity</span><strong>${p.qty}</strong></div>
   </div>
   <div class="card-actions">
    <button class="secondary small" onclick="editProject(${p.id})">Open</button>
    <button class="secondary small" onclick="duplicateProject(${p.id})">Duplicate</button>
    <button class="danger small" onclick="deleteProject(${p.id})">Delete</button>
   </div>
  </article>`;
 }).join('')||'<p>No matching projects.</p>';
}
$('#projectSearch').oninput=renderProjects;$('#projectFilter').onchange=renderProjects;
document.querySelectorAll('[data-project-type-filter]').forEach(button=>{
 button.addEventListener('click',()=>{
  activeProjectTypeFilter=button.dataset.projectTypeFilter;
  document.querySelectorAll('[data-project-type-filter]').forEach(x=>x.classList.toggle('active',x===button));
  renderProjects();
 });
});
window.deleteProject=id=>{state.projects=state.projects.filter(p=>p.id!==id);save('Project deleted');renderAll()};
window.duplicateProject=id=>{
 const p=state.projects.find(x=>x.id===id);
 if(!p)return;
 const copy={
  ...p,
  id:Date.now(),
  name:p.name+' Copy',
  inputs:p.inputs?{...p.inputs}:undefined,
  createdAt:new Date().toISOString(),
  updatedAt:new Date().toISOString(),
  date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
 };
 state.projects.push(copy);
 save('Project duplicated');
 renderAll();
};

function capturePricingInputs(){
 return {
  template:$('#templateSelect')?.value||'',
  blankCost:val('blankCost'),
  totalInk:val('totalInk'),
  printMinutes:val('printMinutes'),
  laborMinutes:val('laborMinutes'),
  packagingCost:val('packagingCost'),
  primerCost:val('primerCost'),
  otherCost:val('otherCost'),
  wastePercent:val('wastePercent'),
  profitMargin:val('profitMargin'),
  manualPrice:$('#manualPrice')?.value===''?'':val('manualPrice'),
  rounding:$('#rounding')?.value||'1'
 };
}

function restorePricingInputs(project){
 const inputs=project.inputs||{};
 if(inputs.template&&$('#templateSelect'))$('#templateSelect').value=inputs.template;
 if($('#blankCost'))$('#blankCost').value=Number.isFinite(Number(inputs.blankCost))?inputs.blankCost:$('#blankCost').value;
 if($('#totalInk'))$('#totalInk').value=Number.isFinite(Number(inputs.totalInk))?inputs.totalInk:$('#totalInk').value;
 if($('#printMinutes'))$('#printMinutes').value=Number.isFinite(Number(inputs.printMinutes))?inputs.printMinutes:$('#printMinutes').value;
 if($('#laborMinutes'))$('#laborMinutes').value=Number.isFinite(Number(inputs.laborMinutes))?inputs.laborMinutes:$('#laborMinutes').value;
 if($('#packagingCost'))$('#packagingCost').value=Number.isFinite(Number(inputs.packagingCost))?inputs.packagingCost:$('#packagingCost').value;
 if($('#primerCost'))$('#primerCost').value=Number.isFinite(Number(inputs.primerCost))?inputs.primerCost:$('#primerCost').value;
 if($('#otherCost'))$('#otherCost').value=Number.isFinite(Number(inputs.otherCost))?inputs.otherCost:$('#otherCost').value;
 if($('#wastePercent'))$('#wastePercent').value=Number.isFinite(Number(inputs.wastePercent))?inputs.wastePercent:$('#wastePercent').value;
 if($('#profitMargin'))$('#profitMargin').value=Number.isFinite(Number(inputs.profitMargin))?inputs.profitMargin:$('#profitMargin').value;
 if($('#rounding'))$('#rounding').value=inputs.rounding||$('#rounding').value;

 // Only restore a manual quote when the user explicitly entered one.
 // Older projects did not record whether the quote was manual, so they reopen in automatic pricing mode.
 if($('#manualPrice'))$('#manualPrice').value=project.inputs&&inputs.manualPrice!==''?inputs.manualPrice:'';
}

window.editProject=id=>{
 const p=state.projects.find(x=>x.id===id);
 if(!p)return;
 editingId=id;
 if(p.printerFamily&&state.printerProfiles[p.printerFamily]){
  state.activePrinter.family=p.printerFamily;
  const fam=state.printerProfiles[p.printerFamily];
  state.activePrinter.edition=fam.editions[p.printerEdition]?p.printerEdition:Object.keys(fam.editions)[0];
  const profile=getActivePrinterProfile();state.activePrinter.workflow=profile.workflows[0];applyProfileRates(profile);loadRates();renderPrinterProfile();
 }
 resetForm();
 $('#projectPrinter').value=p.printer||activePrinterLabel();
 $('#projectName').value=p.name;
 $('#customerName').value=p.customer;
 $('#quantity').value=p.qty;
 $('#projectStatus').value=p.status||'Draft';
 $('#projectNotes').value=p.notes||'';
 restorePricingInputs(p);
 calculate();
 navigate('calculator');
};

function populate(){
 $('#templateSelect').innerHTML=state.templates.map(t=>`<option>${esc(t.name)}</option>`).join('');
 $('#templateGrid').innerHTML=state.templates.map((t,i)=>`<article class="template-card"><div class="template-icon">${t.icon}</div><h3>${esc(t.name)}</h3><p>${t.category}</p><div class="card-meta"><span>Blank ${money(t.blank)}</span><span>Pack ${money(t.packaging)}</span></div><button class="secondary small" onclick="useTemplate(${i})">Use Template</button></article>`).join('');
 $('#customerGrid').innerHTML=state.customers.map(c=>`<article class="customer-card"><h3>${esc(c.name)}</h3><p>${esc(c.type)}</p><div class="card-meta"><span>${c.discount}% discount</span><span>${esc(c.email)}</span></div></article>`).join('');
 $('#materialsBody').innerHTML=state.materials.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.category)}</td><td>${money(m.cost)}</td><td>${esc(m.note)}</td></tr>`).join('');
}
window.useTemplate=i=>{const t=state.templates[i];resetForm();$('#projectName').value=t.name;$('#templateSelect').value=t.name;$('#blankCost').value=t.blank;$('#packagingCost').value=t.packaging;calculate();navigate('calculator')};
$('#templateSelect').onchange=()=>{const t=state.templates.find(x=>x.name===$('#templateSelect').value);if(t){$('#blankCost').value=t.blank;$('#packagingCost').value=t.packaging;calculate()}};

const fieldIds=['quantity','blankCost','totalInk','printMinutes','laborMinutes','packagingCost','primerCost','otherCost','wastePercent','profitMargin','manualPrice','rounding'];
fieldIds.forEach(id=>{
 const field=$('#'+id);
 if(field)field.addEventListener('input',calculate);
});
function val(id){return Number($('#'+id).value)||0}

function applyPricingProfitStatus(profit,actualMargin,targetMargin,totalCost,customerPrice){
 const status=
  profit<0?'negative':
  actualMargin<targetMargin?'warning':
  'healthy';

 const valueClass={
  healthy:'profit-status-healthy',
  warning:'profit-status-warning',
  negative:'profit-status-negative'
 }[status];

 const cardClass={
  healthy:'profit-card-healthy',
  warning:'profit-card-warning',
  negative:'profit-card-negative'
 }[status];

 ['projectProfit','quoteProfit','quoteProfitPerUnit'].forEach(id=>{
  const element=$('#'+id);
  if(!element)return;
  element.classList.remove('positive','profit-status-value','profit-status-healthy','profit-status-warning','profit-status-negative');
  element.classList.add('profit-status-value',valueClass);
 });

 ['projectProfitCard','quoteProfitCard','quoteProfitPerUnitCard'].forEach(id=>{
  const card=$('#'+id);
  if(!card)return;
  card.classList.remove('profit-card-healthy','profit-card-warning','profit-card-negative');
  card.classList.add(cardClass);
 });

 const summary=document.querySelector('.quote-summary-card');
 if(summary){
  summary.classList.remove('profit-loss','profit-review');
  if(status==='negative')summary.classList.add('profit-loss');
  if(status==='warning')summary.classList.add('profit-review');
 }

 const alert=$('#profitabilityAlert');
 const alertTitle=$('#profitabilityAlertTitle');
 const alertText=$('#profitabilityAlertText');
 if(!alert||!alertTitle||!alertText)return;

 alert.classList.remove('warning','negative');

 if(status==='negative'){
  const breakEven=Math.max(0,totalCost-customerPrice);
  alert.classList.add('negative');
  alertTitle.textContent='Action Required — This project is losing money';
  alertText.textContent=`The customer quote is ${money(Math.abs(profit))} below production cost. Increase the quote by at least ${money(breakEven)} to break even, and more to earn your target margin.`;
 }else if(status==='warning'){
  const targetPrice=totalCost/(1-Math.min(.95,targetMargin/100));
  const increase=Math.max(0,targetPrice-customerPrice);
  alert.classList.add('warning');
  alertTitle.textContent='Review Pricing — Profit is below your target';
  alertText.textContent=`This project is profitable, but the ${actualMargin.toFixed(1)}% margin is below your ${targetMargin.toFixed(1)}% target. Consider increasing the quote by about ${money(increase)}.`;
 }else{
  alertTitle.textContent='Healthy Profit';
  alertText.textContent=`This project meets or exceeds your ${targetMargin.toFixed(1)}% target margin.`;
 }
}


function populateProjectPrinterModal(){
 const family=$('#projectPrinterFamily'),edition=$('#projectPrinterEdition');
 if(!family||!edition)return;

 const profiles=state.printerProfiles&&Object.keys(state.printerProfiles).length
  ?state.printerProfiles
  :defaults.printerProfiles;

 family.innerHTML=Object.entries(profiles).map(([key,value])=>{
  const label=value.family||value.name||key;
  return `<option value="${key}">${esc(label)}</option>`;
 }).join('');

 const activeFamily=profiles[state.activePrinter.family]
  ?state.activePrinter.family
  :Object.keys(profiles)[0];

 family.value=activeFamily;

 const refreshEditions=()=>{
  const fam=profiles[family.value]||profiles[Object.keys(profiles)[0]];
  if(!fam||!fam.editions){
   edition.innerHTML='<option value="">No editions available</option>';
   edition.disabled=true;
   return;
  }

  edition.disabled=false;
  edition.innerHTML=Object.entries(fam.editions).map(([key,value])=>
   `<option value="${key}">${esc(value.edition||value.name||key)}</option>`
  ).join('');

  const savedEdition=family.value===state.activePrinter.family
   ?state.activePrinter.edition
   :'';

  edition.value=fam.editions[savedEdition]
   ?savedEdition
   :Object.keys(fam.editions)[0];
 };

 family.onchange=refreshEditions;
 refreshEditions();
}
function openProjectPrinterModal(){populateProjectPrinterModal();$('#projectPrinterModal').hidden=false}
function applyProjectPrinterChange(){
 const family=$('#projectPrinterFamily').value;
 const edition=$('#projectPrinterEdition').value;
 const fam=state.printerProfiles[family];
 if(!fam||!fam.editions||!fam.editions[edition]){
  showToast('Please choose a valid printer family and edition.');
  return;
 }
 state.activePrinter.family=family;
 state.activePrinter.edition=edition;
 const profile=getActivePrinterProfile();
 state.activePrinter.workflow=profile.workflows[0];
 applyProfileRates(profile);
 loadRates();
 renderPrinterProfile();
 $('#projectPrinter').value=activePrinterLabel();
 calculate();
 renderDashboard();
 $('#projectPrinterModal').hidden=true;
 save(`Project printer changed to ${profile.name} ${profile.edition}`);
}

function getActivePrinterProfile(){const fam=state.printerProfiles[state.activePrinter.family]||state.printerProfiles['eufymake-e1'];return fam.editions[state.activePrinter.edition]||Object.values(fam.editions)[0]}
function activePrinterLabel(){const p=getActivePrinterProfile();return `${p.name} — ${p.edition}`}
function populatePrinterEditionOptions(){const fs=$('#printerFamily'),es=$('#printerEdition');if(!fs||!es)return;fs.value=state.activePrinter.family;const fam=state.printerProfiles[fs.value];es.innerHTML=Object.entries(fam.editions).map(([k,p])=>`<option value="${k}">${esc(p.edition)}</option>`).join('');es.value=fam.editions[state.activePrinter.edition]?state.activePrinter.edition:Object.keys(fam.editions)[0]}
function applyProfileRates(p){
 const r=p.rates,cartridge=p.cartridges||{};
 const channelRates=[r.cyan,r.magenta,r.yellow,r.black,r.white,r.gloss].map(Number).filter(Number.isFinite);
 const inkRate=Number(r.ink)||(channelRates.length?channelRates.reduce((a,b)=>a+b,0)/channelRates.length:state.rates.ink);
 state.printer={...state.printer,model:p.name,inkCartridgePrice:Number(cartridge.inkPrice)||state.printer.inkCartridgePrice,inkCartridgeCapacity:Number(cartridge.inkCapacity)||state.printer.inkCartridgeCapacity,cleaningCartridgePrice:Number(cartridge.cleaningPrice)||state.printer.cleaningCartridgePrice,cleaningCartridgeCapacity:Number(cartridge.cleaningCapacity)||state.printer.cleaningCartridgeCapacity,cleaning:r.cleaning,primerDefault:r.primer,serviceReserve:r.serviceReserve};
 state.rates={...state.rates,ink:inkRate,color:inkRate,white:inkRate,varnish:inkRate,machine:r.machine,electric:r.electric,maintenance:r.maintenance};
}
function switchPrinterProfile(f,e){state.activePrinter.family=f;state.activePrinter.edition=e;const p=getActivePrinterProfile();state.activePrinter.workflow=p.workflows[0];applyProfileRates(p);save(`Active printer changed to ${p.name} ${p.edition}`);loadRates();renderAll()}
function renderPrinterProfile(){const p=getActivePrinterProfile();populatePrinterEditionOptions();if($('#printerWorkflow')){$('#printerWorkflow').innerHTML=p.workflows.map(w=>`<option>${esc(w)}</option>`).join('');$('#printerWorkflow').value=state.activePrinter.workflow}if($('#activePrinterName'))$('#activePrinterName').textContent=p.name;if($('#activePrinterEdition'))$('#activePrinterEdition').textContent=p.edition;if($('#activePrinterCapabilities'))$('#activePrinterCapabilities').innerHTML=p.workflows.map(w=>`<span class="capability-chip">${esc(w)}</span>`).join('');const topBanner=$('#activePrinterBanner');if(topBanner){topBanner.classList.remove('eufymake','xtool');topBanner.classList.add(state.activePrinter.family==='xtool-o1'?'xtool':'eufymake')}if($('#activePrinterBannerMark'))$('#activePrinterBannerMark').textContent=state.activePrinter.family==='xtool-o1'?'xT':'E1';if($('#printerProfileCapabilities'))$('#printerProfileCapabilities').innerHTML=p.workflows.map(w=>`<div><strong>${esc(w)}</strong><small>Available in this edition</small></div>`).join('');if($('#printerProfileNote'))$('#printerProfileNote').textContent=p.note;if($('#printerCostStatus'))$('#printerCostStatus').innerHTML=`<strong>${esc(p.name)} — ${esc(p.edition)}</strong><span>${esc(p.note)}</span>`;if($('#costPrinterBadge'))$('#costPrinterBadge').textContent=p.edition;if($('#projectPrinter'))$('#projectPrinter').value=activePrinterLabel();if($('#scPrinter'))$('#scPrinter').value=activePrinterLabel()}
function roundTo(n,step){return Math.ceil(n/step)*step}
function calculate(){
 const r=state.rates,q=Math.max(1,val('quantity')),blanks=val('blankCost')*q,ink=val('totalInk')*r.ink,pack=val('packagingCost')*q;
 const labor=val('laborMinutes')/60*r.labor,machine=val('printMinutes')/60*r.machine,electric=val('printMinutes')/60*r.electric,maintenance=r.maintenance,primer=val('primerCost'),other=val('otherCost');
 const base=blanks+ink+pack+labor+machine+electric+maintenance+primer+other,waste=base*val('wastePercent')/100,total=base+waste,margin=val('profitMargin')/100;
 const recommended=roundTo(total/(1-Math.min(.95,margin)),val('rounding')||.01),price=val('manualPrice')||recommended,profit=price-total,actual=price?profit/price*100:0;
 $('#costBreakdown').innerHTML=`<div class="cost-group"><h4>MATERIALS</h4>${line('Blanks',blanks)}${line('Total Job Ink',ink)}${line('Packaging',pack)}${line('Subtotal',blanks+ink+pack,true)}</div><div class="cost-group"><h4>PRODUCTION</h4>${line('Labor',labor)}${line('Machine Use',machine)}${line('Electricity',electric)}${line('Subtotal',labor+machine+electric,true)}</div><div class="cost-group"><h4>FIXED JOB COSTS</h4>${line('Maintenance',maintenance)}${line('Primer & Cleaning',primer)}${line('Other Fixed Costs',other)}${line('Waste Allowance',waste)}${line('Subtotal',maintenance+primer+other+waste,true)}</div><div class="cost-total"><span>Total Production Cost</span><strong>${money(total)}</strong></div>`;
 $('#recommendedPrice').textContent=money(price);$('#perUnitPrice').textContent=money(price/q)+' per unit';$('#projectProfit').textContent=money(profit);$('#projectMargin').textContent=actual.toFixed(1)+'%';
 $('#quoteOrderTotal').textContent=money(price);
 $('#quoteUnitPrice').textContent=money(price/q);
 $('#quoteProductionCost').textContent=money(total);
 $('#quoteProfit').textContent=money(profit);
 $('#quoteMargin').textContent=actual.toFixed(1)+'%';
 $('#quoteCustomerTotal').textContent=money(price*(1+(state.business.tax||0)/100));
 $('#quoteProfitPerUnit').textContent=money(profit/q);
 $('#quoteQuantityLine').textContent=`${q} ${q===1?'item':'items'} at ${money(price/q)} each`;
 $('#quoteGuidanceText').textContent=`Quote the customer ${money(price)} before tax, or ${money(price/q)} per item. Customer total with tax: ${money(price*(1+(state.business.tax||0)/100))}.`;
 applyPricingProfitStatus(profit,actual,val('profitMargin'),total,price);
 return {cost:total,price,profit,margin:actual,qty:q};
}
function line(name,n,subtotal=false){return `<div class="cost-line ${subtotal?'subtotal':''}"><span>${name}</span><strong>${money(n)}</strong></div>`}
function resetForm(){const t=state.templates[0];if($('#projectPrinter'))$('#projectPrinter').value=activePrinterLabel();$('#projectName').value=t.name;$('#customerName').value='Walk-in Customer';$('#templateSelect').value=t.name;$('#quantity').value=1;$('#projectStatus').value=state.preferences.defaultStatus||'Draft';$('#projectNotes').value='';$('#blankCost').value=t.blank;$('#totalInk').value=.50;$('#printMinutes').value=16;$('#laborMinutes').value=12;$('#packagingCost').value=t.packaging;$('#primerCost').value=.35;$('#otherCost').value=0;$('#wastePercent').value=state.rates.waste;$('#profitMargin').value=state.rates.margin;$('#manualPrice').value='';$('#rounding').value=state.preferences.rounding||'1';calculate()}
$('#resetFormBtn').onclick=()=>{editingId=null;resetForm()};
$('#demoImportBtn').onclick=()=>{$('#totalInk').value=4.13;$('#printMinutes').value=39.6;calculate();showToast('Sample estimate applied')};
$('#saveProjectBtn').onclick=()=>{
 const c=calculate();
 const existing=editingId?state.projects.find(p=>p.id===editingId):null;
 const project={
  id:editingId||Date.now(),
  projectType:existing?.projectType||'production',
  printer:activePrinterLabel(),
  printerFamily:state.activePrinter.family,
  printerEdition:state.activePrinter.edition,
  name:$('#projectName').value||'Untitled Project',
  customer:$('#customerName').value||'Walk-in Customer',
  status:$('#projectStatus').value,
  notes:$('#projectNotes').value,
  qty:c.qty,
  cost:c.cost,
  price:c.price,
  margin:c.margin,
  inputs:capturePricingInputs(),
  createdAt:existing?.createdAt||new Date().toISOString(),
  updatedAt:new Date().toISOString(),
  date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
 };
 if(editingId){
  state.projects=state.projects.map(p=>p.id===editingId?project:p);
 }else{
  state.projects.push(project);
 }
 save(editingId?'Project estimate updated':'New project estimate saved');
 dashboardSelectedProjectId=project.id;
 editingId=null;
 renderAll();
 navigate('projects');
};

function updateCalculatedInkRate(){
 const price=Number($('#inkCartridgePrice')?.value)||0;
 const capacity=Math.max(1,Number($('#inkCartridgeCapacity')?.value)||1);
 if($('#rateInk'))$('#rateInk').value=(price/capacity).toFixed(4);
}

function loadRates(){
 const r=state.rates,b=state.business,p=state.printer,pr=state.preferences;
 $('#inkCartridgePrice').value=p.inkCartridgePrice;$('#inkCartridgeCapacity').value=p.inkCartridgeCapacity;$('#cleaningCartridgePrice').value=p.cleaningCartridgePrice;$('#cleaningCartridgeCapacity').value=p.cleaningCartridgeCapacity;$('#rateInk').value=(Number(r.ink)||0).toFixed(4);
 $('#rateMachine').value=r.machine;$('#rateElectric').value=r.electric;
 $('#rateMaintenance').value=r.maintenance;$('#rateCleaning').value=p.cleaning;$('#ratePrimerDefault').value=p.primerDefault;$('#rateServiceReserve').value=p.serviceReserve;
 if($('#printerProfileName'))$('#printerProfileName').value=p.profileName;
 $('#businessName').value=state.profile.business;$('#businessOwner').value=b.owner;$('#businessEmail').value=b.email;$('#businessPhone').value=b.phone;$('#businessWebsite').value=b.website;
 $('#rateLabor').value=r.labor;$('#rateOverhead').value=b.overhead;$('#rateWaste').value=r.waste;$('#rateMargin').value=r.margin;$('#rateTax').value=b.tax;$('#rateShipping').value=b.shipping;
 $('#quoteValidity').value=b.quoteValidity;$('#depositPercent').value=b.deposit;$('#defaultTerms').value=b.terms;
 if($('#prefWelcomeMode'))$('#prefWelcomeMode').value=pr.welcomeMode||'updates';$('#prefCurrency').value=state.profile.currency;$('#prefNumberFormat').value=pr.numberFormat;$('#prefAutosave').checked=pr.autosave;$('#prefLastCustomer').checked=pr.lastCustomer;$('#prefShowCosts').checked=pr.showCosts;$('#prefConfirmDelete').checked=pr.confirmDelete;$('#prefDefaultStatus').value=pr.defaultStatus;$('#prefRounding').value=pr.rounding;
}
function saveGlobalWorkspace(){
 state.printer={...state.printer,model:getActivePrinterProfile().name,profileName:$('#printerProfileName').value,inkCartridgePrice:val('inkCartridgePrice'),inkCartridgeCapacity:Math.max(1,val('inkCartridgeCapacity')),cleaningCartridgePrice:val('cleaningCartridgePrice'),cleaningCartridgeCapacity:Math.max(1,val('cleaningCartridgeCapacity')),cleaning:val('rateCleaning'),primerDefault:val('ratePrimerDefault'),serviceReserve:val('rateServiceReserve')};
 const calculatedInkRate=state.printer.inkCartridgePrice/state.printer.inkCartridgeCapacity;state.rates={...state.rates,ink:calculatedInkRate,color:calculatedInkRate,white:calculatedInkRate,varnish:calculatedInkRate,labor:val('rateLabor'),machine:val('rateMachine'),electric:val('rateElectric'),maintenance:val('rateMaintenance'),waste:val('rateWaste'),margin:val('rateMargin')};
 state.profile.business=$('#businessName').value||'UV Project Calculator Pro';state.profile.currency=$('#prefCurrency').value;
 state.business={owner:$('#businessOwner').value,email:$('#businessEmail').value,phone:$('#businessPhone').value,website:$('#businessWebsite').value,overhead:val('rateOverhead'),tax:val('rateTax'),shipping:val('rateShipping'),quoteValidity:$('#quoteValidity').value,deposit:val('depositPercent'),terms:$('#defaultTerms').value};
 state.preferences={...state.preferences,welcomeMode:$('#prefWelcomeMode').value,numberFormat:$('#prefNumberFormat').value,autosave:$('#prefAutosave').checked,lastCustomer:$('#prefLastCustomer').checked,showCosts:$('#prefShowCosts').checked,confirmDelete:$('#prefConfirmDelete').checked,defaultStatus:$('#prefDefaultStatus').value,rounding:$('#prefRounding').value};
 save('Global setup updated');resetForm();renderAll();
}
$('#saveGlobalWorkspaceBtn').onclick=saveGlobalWorkspace;



function openSettingsPanel(panelName){
 navigate('global');
 const target=document.querySelector(`.settings-tab[data-settings-panel="${panelName}"]`);
 if(target)target.click();
}

$$('.settings-tab').forEach(btn=>btn.onclick=()=>{
 $$('.settings-tab').forEach(b=>b.classList.toggle('active',b===btn));
 $$('.settings-panel').forEach(p=>p.classList.toggle('active',p.id==='settings-'+btn.dataset.settingsPanel));
});
function renderGlobalLibraries(){
 const mq=($('#libraryMaterialSearch')?.value||'').toLowerCase();
 const cat=$('#libraryMaterialCategory')?.value||'all';
 if($('#libraryMaterialCategory')){
  const cats=[...new Set(state.materials.map(m=>m.category))];
  const old=$('#libraryMaterialCategory').value;
  $('#libraryMaterialCategory').innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
  $('#libraryMaterialCategory').value=cats.includes(old)?old:'all';
 }
 if($('#materialsBody')) $('#materialsBody').innerHTML=state.materials
  .filter(m=>(m.name+' '+m.category+' '+(m.supplier||'')).toLowerCase().includes(mq)&&(cat==='all'||m.category===cat))
  .map((m,i)=>`<tr><td>${esc(m.name)}</td><td>${esc(m.category)}</td><td>${esc(m.supplier||'—')}</td><td>${esc(m.sku||'—')}</td><td>${money(m.cost)}</td><td><div class="inline-actions"><button class="secondary small" onclick="editMaterial(${i})">Edit</button><button class="danger small" onclick="removeMaterial(${i})">Delete</button></div></td></tr>`).join('');
 if($('#templateGrid')) $('#templateGrid').innerHTML=state.templates.map((t,i)=>`<article class="template-card"><div class="template-icon">${t.icon}</div><h3>${esc(t.name)}</h3><p>${esc(t.category)}</p><div class="card-meta"><span>Blank ${money(t.blank)}</span><span>Pack ${money(t.packaging)}</span></div><div class="card-actions"><button class="secondary small" onclick="useTemplate(${i})">Use Template</button><button class="secondary small" onclick="editTemplate(${i})">Edit</button><button class="danger small" onclick="removeTemplate(${i})">Delete</button></div></article>`).join('');
 if($('#customerGrid')) $('#customerGrid').innerHTML=state.customers.map((c,i)=>`<article class="customer-card"><h3>${esc(c.name)}</h3><p>${esc(c.type)}</p><div class="card-meta"><span>${c.discount||0}% discount</span><span>${esc(c.email||'—')}</span></div><div class="card-actions"><button class="secondary small" onclick="editCustomer(${i})">Edit</button><button class="danger small" onclick="removeCustomer(${i})">Delete</button></div></article>`).join('');
}
if($('#libraryMaterialSearch'))$('#libraryMaterialSearch').oninput=renderGlobalLibraries;
if($('#libraryMaterialCategory'))$('#libraryMaterialCategory').onchange=renderGlobalLibraries;
const addMaterialAction=()=>{const name=prompt('Material name:','New Material');if(!name)return;const category=prompt('Category:','Custom')||'Custom';const cost=Number(prompt('Unit cost:','0'))||0;state.materials.push({name,category,cost,supplier:'',sku:'',note:''});save('Material added');renderAll()};
if($('#addLibraryMaterialBtn'))$('#addLibraryMaterialBtn').onclick=addMaterialAction;
window.editMaterial=i=>{const m=state.materials[i],name=prompt('Material name:',m.name);if(name===null)return;m.name=name;const cost=prompt('Unit cost:',m.cost);if(cost!==null)m.cost=Number(cost)||0;m.supplier=prompt('Supplier:',m.supplier||'')??m.supplier;m.sku=prompt('SKU:',m.sku||'')??m.sku;save('Material updated');renderAll()};
window.removeMaterial=i=>{if(state.preferences.confirmDelete&&!confirm('Delete this material?'))return;state.materials.splice(i,1);save('Material deleted');renderAll()};
const addTemplateAction=()=>{const name=prompt('Template name:','New Template');if(!name)return;state.templates.push({name,icon:'▣',category:prompt('Category:','Custom')||'Custom',blank:Number(prompt('Blank cost:','0'))||0,packaging:Number(prompt('Packaging cost:','0'))||0});save('Template added');renderAll()};
if($('#addLibraryTemplateBtn'))$('#addLibraryTemplateBtn').onclick=addTemplateAction;
window.editTemplate=i=>{const t=state.templates[i],name=prompt('Template name:',t.name);if(name===null)return;t.name=name;t.blank=Number(prompt('Blank cost:',t.blank))||0;t.packaging=Number(prompt('Packaging cost:',t.packaging))||0;save('Template updated');renderAll()};
window.removeTemplate=i=>{if(state.preferences.confirmDelete&&!confirm('Delete this template?'))return;state.templates.splice(i,1);save('Template deleted');renderAll()};
const addCustomerAction=()=>{const name=prompt('Customer name:','New Customer');if(!name)return;state.customers.push({name,type:prompt('Customer type:','Retail')||'Retail',discount:Number(prompt('Discount %:','0'))||0,email:prompt('Email:','')||''});save('Customer added');renderAll()};
if($('#addCustomerBtn'))$('#addCustomerBtn').onclick=addCustomerAction;
window.editCustomer=i=>{const c=state.customers[i],name=prompt('Customer name:',c.name);if(name===null)return;c.name=name;c.email=prompt('Email:',c.email||'')??c.email;c.discount=Number(prompt('Discount %:',c.discount||0))||0;save('Customer updated');renderAll()};
window.removeCustomer=i=>{if(state.preferences.confirmDelete&&!confirm('Delete this customer?'))return;state.customers.splice(i,1);save('Customer deleted');renderAll()};

function downloadJson(data,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function exportKind(kind){
 const payload={format:'UVProjectCalculatorPro',version:'3.0',exportedAt:new Date().toISOString(),kind};
 if(kind==='all')payload.data=state;
 if(kind==='materials')payload.data=state.materials;
 if(kind==='templates')payload.data=state.templates;
 if(kind==='customers')payload.data=state.customers;
 if(kind==='printer')payload.data={printer:state.printer,rates:state.rates};
 downloadJson(payload,`UV_Project_Calculator_${kind}_export.json`);
 showToast('Export created');
}
$$('[data-export-kind]').forEach(b=>b.onclick=()=>exportKind(b.dataset.exportKind));
$('#exportSettingsBtn').onclick=()=>exportKind('all');
$('#quickBackupBtn').onclick=()=>{const now=new Date();exportKind('all');localStorage.setItem('uvpc-last-backup-at',now.toISOString());$('#lastBackupLabel').textContent='Backup created '+now.toLocaleString();renderDashboardBackupStatus()};
$('#importSetupFile').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  const payload=JSON.parse(await file.text());
  if(payload.format!=='UVProjectCalculatorPro')throw new Error('Not an UV Project Calculator export.');
  if(!confirm(`Import ${payload.kind||'setup'} data? Existing matching records may be replaced.`))return;
  if(payload.kind==='all')state=payload.data;
  else if(payload.kind==='materials')state.materials=payload.data;
  else if(payload.kind==='templates')state.templates=payload.data;
  else if(payload.kind==='customers')state.customers=payload.data;
  else if(payload.kind==='printer'){state.printer=payload.data.printer;state.rates=payload.data.rates}
  window.UVPCStorage.saveState(state);location.reload();
 }catch(err){alert('Import failed: '+err.message)}
};

function performFactoryReset(){
 window.UVPCStorage.clearState();
 state=structuredClone(defaults);
 state.profile.setupComplete=false;
 window.UVPCStorage.saveState(state);
 $('#resetCompleteModal').hidden=false;
}
$('#restartAfterResetBtn').onclick=()=>{
 $('#resetCompleteModal').hidden=true;
 location.reload();
};

$$('[data-reset-kind]').forEach(b=>b.onclick=()=>{
 const kind=b.dataset.resetKind;
 const message=kind==='factory'
  ?'Factory reset the entire prototype? This removes all browser-saved projects, settings, customers, templates, and materials.'
  :`Reset ${kind}? This cannot be undone unless you exported a backup.`;
 if(state.preferences.confirmDelete&&!confirm(message))return;
 if(kind==='factory'){performFactoryReset();return}
 if(kind==='printer'){state.printer=structuredClone(defaults.printer);state.rates={...state.rates,color:defaults.rates.color,white:defaults.rates.white,varnish:defaults.rates.varnish,machine:defaults.rates.machine,electric:defaults.rates.electric,maintenance:defaults.rates.maintenance}}
 if(kind==='business'){state.business=structuredClone(defaults.business);state.rates={...state.rates,labor:defaults.rates.labor,waste:defaults.rates.waste,margin:defaults.rates.margin}}
 if(kind==='materials')state.materials=structuredClone(defaults.materials);
 if(kind==='templates')state.templates=structuredClone(defaults.templates);
 if(kind==='customers')state.customers=structuredClone(defaults.customers);
 if(kind==='projects')state.projects=[];
 save(`${kind} reset completed`);
 initializeBrandSplash();loadRates();resetForm();renderAll();initializeSupportPage();
 showToast(`${kind[0].toUpperCase()+kind.slice(1)} reset completed`);
});


const scIds=['scPricingMode','scProjectName','scCustomer','scStatus','scQuantity','scMaterial','scTemplate','scBlankCost','scPackaging','scShipping','scTotalInk','scPrintMinutes','scLaborMinutes','scSetupMinutes','scPrimer','scMaintenance','scWaste','scLaborRate','scMachineRate','scOverheadRate','scTargetMargin','scDiscount','scTax','scManualPrice','scDesiredProfit','scRounding','scBudget','scMinimumProfit'];
function populateScenarioSelectors(){
 if(!$('#scenarioProjectSelect'))return;
 const old=$('#scenarioProjectSelect').value;
 $('#scenarioProjectSelect').innerHTML=state.projects.map(p=>`<option value="${p.id}">${esc(p.name)} — ${esc(p.customer)}</option>`).join('');
 if(state.projects.some(p=>String(p.id)===old))$('#scenarioProjectSelect').value=old;
 $('#scMaterial').innerHTML=state.materials.map((m,i)=>`<option value="${i}">${esc(m.name)}</option>`).join('');
 $('#scTemplate').innerHTML=state.templates.map((t,i)=>`<option value="${i}">${esc(t.name)}</option>`).join('');
}
function projectToScenario(p){
 const template=state.templates.find(t=>t.name===p.name)||state.templates[0]||{blank:0,packaging:0};
 return {
  sourceId:p.id,printer:p.printer||activePrinterLabel(),name:p.name,customer:p.customer,status:p.status||'Draft',qty:p.qty||1,
  materialIndex:Math.max(0,state.materials.findIndex(m=>m.name.toLowerCase().includes((p.name.split(' ')[0]||'').toLowerCase()))),
  templateIndex:Math.max(0,state.templates.findIndex(t=>t.name===p.name)),
  blankCost:template.blank||0,packaging:template.packaging||0,shipping:state.business.shipping||0,
  totalInk:.50,printMinutes:16,laborMinutes:12,setupMinutes:0,
  primer:state.printer.primerDefault||.35,maintenance:state.rates.maintenance||.5,waste:state.rates.waste||5,
  laborRate:state.rates.labor||27,machineRate:state.rates.machine||5,overheadRate:state.business.overhead||0,
  pricingMode:'margin',targetMargin:state.rates.margin||45,discount:0,tax:state.business.tax||0,manualPrice:0,desiredProfit:0,
  rounding:state.preferences.rounding||'1',budget:0,minimumProfit:0
 };
}
function writeScenario(s){
 $('#scPrinter').value=s.printer||activePrinterLabel();$('#scProjectName').value=s.name;$('#scCustomer').value=s.customer;$('#scStatus').value=s.status;$('#scQuantity').value=s.qty;
 $('#scMaterial').value=s.materialIndex;$('#scTemplate').value=s.templateIndex;$('#scBlankCost').value=s.blankCost;$('#scPackaging').value=s.packaging;$('#scShipping').value=s.shipping;
 $('#scTotalInk').value=s.totalInk;$('#scPrintMinutes').value=s.printMinutes;$('#scLaborMinutes').value=s.laborMinutes;$('#scSetupMinutes').value=s.setupMinutes;
 $('#scPrimer').value=s.primer;$('#scMaintenance').value=s.maintenance;$('#scWaste').value=s.waste;$('#scLaborRate').value=s.laborRate;$('#scMachineRate').value=s.machineRate;$('#scOverheadRate').value=s.overheadRate;
 $('#scPricingMode').value=s.pricingMode||'margin';$('#scTargetMargin').value=s.targetMargin;$('#scDiscount').value=s.discount;$('#scTax').value=s.tax;$('#scManualPrice').value=s.manualPrice||'';$('#scDesiredProfit').value=s.desiredProfit||'';
 $('#scRounding').value=s.rounding;$('#scBudget').value=s.budget||'';$('#scMinimumProfit').value=s.minimumProfit||'';
}
function readScenario(){
 const n=id=>Number($('#'+id).value)||0;
 return {printer:$('#scPrinter').value||activePrinterLabel(),name:$('#scProjectName').value||'Scenario Project',customer:$('#scCustomer').value||'Walk-in Customer',status:$('#scStatus').value,qty:Math.max(1,n('scQuantity')),materialIndex:Number($('#scMaterial').value)||0,templateIndex:Number($('#scTemplate').value)||0,blankCost:n('scBlankCost'),packaging:n('scPackaging'),shipping:n('scShipping'),totalInk:n('scTotalInk'),printMinutes:n('scPrintMinutes'),laborMinutes:n('scLaborMinutes'),setupMinutes:n('scSetupMinutes'),primer:n('scPrimer'),maintenance:n('scMaintenance'),waste:n('scWaste'),laborRate:n('scLaborRate'),machineRate:n('scMachineRate'),overheadRate:n('scOverheadRate'),pricingMode:$('#scPricingMode').value,targetMargin:n('scTargetMargin'),discount:n('scDiscount'),tax:n('scTax'),manualPrice:n('scManualPrice'),desiredProfit:n('scDesiredProfit'),rounding:$('#scRounding').value,budget:n('scBudget'),minimumProfit:n('scMinimumProfit')};
}
function calcScenario(s){
 const r=state.rates,q=s.qty;
 const materials=s.blankCost*q+s.packaging*q+s.shipping;
 const ink=s.totalInk*r.ink;
 const labor=(s.laborMinutes+s.setupMinutes)/60*s.laborRate;
 const machine=s.printMinutes/60*s.machineRate;
 const electric=s.printMinutes/60*r.electric;
 const overhead=(s.printMinutes+s.laborMinutes+s.setupMinutes)/60*s.overheadRate;
 const base=materials+ink+labor+machine+electric+overhead+s.primer+s.maintenance;
 const waste=base*s.waste/100,totalCost=base+waste;
 const targetPrice=roundTo(totalCost/(1-Math.min(.95,s.targetMargin/100)),Number(s.rounding)||.01);
 const desiredPrice=s.desiredProfit?roundTo(totalCost+s.desiredProfit,Number(s.rounding)||.01):0;
 let orderPrice=targetPrice;
 if(s.pricingMode==='manual' && s.manualPrice>0) orderPrice=s.manualPrice;
 if(s.pricingMode==='profit' && s.desiredProfit>0) orderPrice=desiredPrice;
 orderPrice=orderPrice*(1-s.discount/100);
 const profit=orderPrice-totalCost,margin=orderPrice?profit/orderPrice*100:0;
 return {materials,ink,labor,machine,electric,overhead,waste,totalCost,targetPrice,desiredPrice,orderPrice,profit,margin,withTax:orderPrice*(1+s.tax/100),unitPrice:orderPrice/q,profitPerItem:profit/q,profitPerHour:(s.laborMinutes+s.setupMinutes)?profit/((s.laborMinutes+s.setupMinutes)/60):profit,minimumPrice:roundTo(totalCost,Number(s.rounding)||.01),wholesalePrice:roundTo(totalCost/(1-.30),Number(s.rounding)||.01)};
}
function cloneScenarioFromSelected(){
 if(!state.projects.length){showToast('Create a project first');return}
 const id=Number($('#scenarioProjectSelect').value)||state.projects[0].id,p=state.projects.find(x=>x.id===id)||state.projects[0];
 scenarioSourceId=p.id;scenarioOriginal=projectToScenario(p);writeScenario({...scenarioOriginal});$('#scenarioName').value='Scenario A';renderScenario();
}
function renderScenario(){
 if(!scenarioOriginal)return;
 const s=readScenario(),o=calcScenario(scenarioOriginal),c=calcScenario(s);
 const rows=[
  ['Order Total',o.orderPrice,c.orderPrice,'money'],['Unit Price',o.unitPrice,c.unitPrice,'money'],['Production Cost',o.totalCost,c.totalCost,'money'],
  ['Profit',o.profit,c.profit,'money'],['Margin',o.margin,c.margin,'percent'],['Quantity',scenarioOriginal.qty,s.qty,'number']
 ];
 $('#scenarioComparison').innerHTML='<div class="compare-row header"><span>Metric</span><span>Original</span><span>Scenario</span><span>Change</span></div>'+rows.map(([name,a,b,type])=>{
  const diff=b-a,fmt=v=>type==='money'?money(v):type==='percent'?v.toFixed(1)+'%':String(v),cls=diff>0?'delta-up':diff<0?'delta-down':'delta-neutral';
  return `<div class="compare-row"><strong>${name}</strong><span>${fmt(a)}</span><span>${fmt(b)}</span><span class="${cls}">${diff>0?'+':''}${type==='money'?money(diff):type==='percent'?diff.toFixed(1)+'%':diff}</span></div>`
 }).join('');
 $('#scRecommendedTotal').textContent=money(c.orderPrice);$('#scRecommendedUnit').textContent=money(c.unitPrice)+' per unit';$('#scTotalCost').textContent=money(c.totalCost);$('#scProfit').textContent=money(c.profit);$('#scMargin').textContent=c.margin.toFixed(1)+'%';$('#scProfitPerItem').textContent=money(c.profitPerItem);$('#scProfitPerHour').textContent=money(c.profitPerHour);$('#scWithTax').textContent=money(c.withTax);$('#scMinimumPrice').textContent=money(c.minimumPrice);$('#scTargetPrice').textContent=money(c.targetPrice);$('#scDesiredPrice').textContent=s.desiredProfit?money(c.desiredPrice):'—';$('#scWholesalePrice').textContent=money(c.wholesalePrice);
 const changes=[
  ['Quantity',scenarioOriginal.qty,s.qty,'items'],['Blank Cost',scenarioOriginal.blankCost,s.blankCost,'money'],['Labor Minutes',scenarioOriginal.laborMinutes,s.laborMinutes,'minutes'],['Total Job Ink',scenarioOriginal.totalInk,s.totalInk,'mL'],['Target Margin',scenarioOriginal.targetMargin,s.targetMargin,'%'],['Discount',scenarioOriginal.discount,s.discount,'%'],['Shipping',scenarioOriginal.shipping,s.shipping,'money']
 ].map(([name,a,b,u])=>({name,a,b,d:b-a,u})).filter(x=>Math.abs(x.d)>.0001).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d)).slice(0,5);
 $('#changeExplanation').innerHTML=changes.length?changes.map(x=>`<div class="change-item"><div><strong>${x.name}</strong><small>${x.a} → ${x.b} ${x.u==='money'?'':x.u}</small></div><strong class="${x.d>0?'delta-up':'delta-down'}">${x.d>0?'+':''}${x.u==='money'?money(x.d):x.d.toFixed(2)+' '+x.u}</strong></div>`).join(''):'<p>No scenario changes yet. Adjust any value to compare it with the original.</p>';
 const modeText=s.pricingMode==='margin'?`Target Margin mode is active. The ${s.targetMargin.toFixed(1)}% margin is applied instantly.`:s.pricingMode==='manual'?`Manual Price mode is active. The order price is set directly to ${money(s.manualPrice)} before discount and tax.`:`Desired Profit mode is active. The price is calculated to produce ${money(s.desiredProfit)} profit before discount and tax.`;
 $('#pricingModeNote').textContent=modeText;
 const advisor=$('#budgetAdvisor');advisor.className='budget-advisor';
 if(s.budget){
  const gap=s.budget-c.withTax;
  if(gap>=0){advisor.classList.add('good');advisor.textContent=`This scenario fits the customer budget by ${money(gap)}.`}
  else{advisor.classList.add('bad');advisor.textContent=`This scenario exceeds the customer budget by ${money(Math.abs(gap))}. Consider reducing cost, margin, shipping, or discounting carefully.`}
 } else if(s.minimumProfit){
  const gap=c.profit-s.minimumProfit;
  if(gap>=0){advisor.classList.add('good');advisor.textContent=`This scenario exceeds the minimum profit goal by ${money(gap)}.`}
  else{advisor.classList.add('bad');advisor.textContent=`This scenario is short of the minimum profit goal by ${money(Math.abs(gap))}. A price of about ${money(c.totalCost+s.minimumProfit)} would meet it before tax.`}
 } else advisor.textContent='Enter a customer budget or profit goal to receive guidance.';
}
scIds.forEach(id=>{const el=$('#'+id);if(el)el.addEventListener('input',renderScenario)});
$('#scenarioProjectSelect').onchange=cloneScenarioFromSelected;$('#cloneCurrentProjectBtn').onclick=cloneScenarioFromSelected;
$('#scMaterial').onchange=()=>{const m=state.materials[Number($('#scMaterial').value)];if(m)$('#scBlankCost').value=m.cost;renderScenario()};
$('#scTemplate').onchange=()=>{const t=state.templates[Number($('#scTemplate').value)];if(t){$('#scBlankCost').value=t.blank;$('#scPackaging').value=t.packaging}renderScenario()};
$('#discardScenarioBtn').onclick=()=>{if(scenarioOriginal){writeScenario({...scenarioOriginal});renderScenario();showToast('Scenario changes discarded')}};
$('#saveScenarioBtn').onclick=()=>{if(!scenarioOriginal)return;const s=readScenario(),c=calcScenario(s);state.projects.push({id:Date.now(),projectType:'scenario',name:`${s.name} — ${$('#scenarioName').value||'Scenario'}`,customer:s.customer,status:s.status,notes:'Created in Scenario Builder',qty:s.qty,cost:c.totalCost,price:c.orderPrice,margin:c.margin,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})});save('Scenario saved as new project');renderAll();populateScenarioSelectors();showToast('Scenario saved as a new project')};
$('#replaceOriginalBtn').onclick=()=>{if(!scenarioOriginal||!scenarioSourceId)return;if(state.preferences.confirmDelete&&!confirm('Replace the original project with this scenario?'))return;const s=readScenario(),c=calcScenario(s);state.projects=state.projects.map(p=>p.id===scenarioSourceId?{...p,name:s.name,customer:s.customer,status:s.status,qty:s.qty,cost:c.totalCost,price:c.orderPrice,margin:c.margin,notes:'Updated from Scenario Builder'}:p);save('Original project replaced from scenario');renderAll();populateScenarioSelectors();cloneScenarioFromSelected()};


function renderReports(){const t=totals();$('#reportProjects').textContent=state.projects.length;$('#reportRevenue').textContent=money(t.revenue);$('#reportCost').textContent=money(t.cost);$('#reportProfit').textContent=money(t.profit);const max=Math.max(...state.projects.map(p=>p.price),1);$('#barChart').innerHTML=state.projects.slice(-8).map(p=>`<div class="bar-item"><div class="bar" style="height:${Math.max(8,p.price/max*240)}px"><span>${money(p.price)}</span></div>${esc(p.name.split(' ').slice(0,2).join(' '))}</div>`).join('')}
$('#exportCsvBtn').onclick=()=>{const rows=[['Project','Customer','Quantity','Cost','Price','Margin'],...state.projects.map(p=>[p.name,p.customer,p.qty,p.cost.toFixed(2),p.price.toFixed(2),p.margin.toFixed(1)])];const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='UV_Project_Calculator_Projects.csv';a.click();URL.revokeObjectURL(a.href)};


let wizardStep=0;
function showWizard(force=false){
 wizardStep=0;updateWizard();
 $('#setupName').value=state.profile.name;$('#setupBusiness').value=state.profile.business;$('#setupCountry').value=state.profile.country;
 $('#setupLabor').value=state.rates.labor;$('#setupMachine').value=state.rates.machine;$('#setupWaste').value=state.rates.waste;$('#setupMargin').value=state.rates.margin;
 $('#welcomeModal').hidden=false;
}
function updateWizard(){
 $$('.wizard-page').forEach((p,i)=>p.classList.toggle('active',i===wizardStep));
 $$('[data-step-dot]').forEach((d,i)=>d.classList.toggle('active',i<=wizardStep));
 $('#wizardBack').disabled=false;$('#wizardBack').textContent=wizardStep===0?'Cancel':'Back';$('#wizardNext').textContent=wizardStep===2?'Finish Setup':'Continue';
}
$('#wizardBack').onclick=()=>{if(wizardStep===0){$('#welcomeModal').hidden=true;showToast('Guided setup closed');return}wizardStep=Math.max(0,wizardStep-1);updateWizard()};
$('#wizardNext').onclick=()=>{
 if(wizardStep<2){wizardStep++;updateWizard();return}
 state.profile={name:$('#setupName').value.trim()||'UV Printer Owner',business:$('#setupBusiness').value.trim()||'UV Project Calculator Pro',country:$('#setupCountry').value,currency:$('#setupCurrency').value.slice(0,3),setupComplete:true};
 state.rates.labor=Number($('#setupLabor').value)||27;state.rates.machine=Number($('#setupMachine').value)||5;state.rates.waste=Number($('#setupWaste').value)||5;state.rates.margin=Number($('#setupMargin').value)||45;
 if(document.querySelector('input[name="demoChoice"]:checked').value==='clean') state.projects=[];
 $('#welcomeModal').hidden=true;loadRates();resetForm();save('Guided setup completed');renderAll();
};
$('#openSetupBtn').onclick=()=>showWizard(true);$('#rerunSetupBtn').onclick=()=>{$('#accountMenu').hidden=true;showWizard(true)};
$('#accountBtn').onclick=e=>{e.stopPropagation();$('#accountMenu').hidden=!$('#accountMenu').hidden};
$('#accountSettingsBtn').onclick=()=>{$('#accountMenu').hidden=true;navigate('global')};
document.addEventListener('click',e=>{if(!$('#accountMenu').contains(e.target)&&e.target!==$('#accountBtn'))$('#accountMenu').hidden=true});

function renderAll(){populate();renderDashboard();renderProjects();renderReports();renderGlobalLibraries();populateScenarioSelectors();renderDashboardProjectSnapshot();renderSetupProfile();applyAppearanceState();renderPrinterProfile()}
loadRates();resetForm();renderAll();initializeConsolidatedSettings();initializeFeedbackCenter();initializePricingWorkspaceRecalculation();runTerminologyAudit();if(state.projects.length)cloneScenarioFromSelected();if(!state.profile.setupComplete)setTimeout(()=>showWizard(),250);


document.querySelectorAll('[data-settings-target]').forEach(button=>{
 button.addEventListener('click',()=>openSettingsPanel(button.dataset.settingsTarget));
});
document.querySelectorAll('[data-open-settings-panel]').forEach(button=>{
 button.addEventListener('click',()=>openSettingsPanel(button.dataset.openSettingsPanel));
});

if($('#printerFamily'))$('#printerFamily').addEventListener('change',e=>switchPrinterProfile(e.target.value,Object.keys(state.printerProfiles[e.target.value].editions)[0]));if($('#printerEdition'))$('#printerEdition').addEventListener('change',e=>switchPrinterProfile($('#printerFamily').value,e.target.value));if($('#printerWorkflow'))$('#printerWorkflow').addEventListener('change',e=>{state.activePrinter.workflow=e.target.value;save('Printer workflow updated');renderPrinterProfile()});if($('#changePrinterBtn'))$('#changePrinterBtn').addEventListener('click',()=>openSettingsPanel('printer'));
if($('#changeProjectPrinterBtn'))$('#changeProjectPrinterBtn').addEventListener('click',openProjectPrinterModal);if($('#cancelProjectPrinterBtn'))$('#cancelProjectPrinterBtn').addEventListener('click',()=>$('#projectPrinterModal').hidden=true);if($('#applyProjectPrinterBtn'))$('#applyProjectPrinterBtn').addEventListener('click',applyProjectPrinterChange);
window.addEventListener('uvpc-storage-ready',()=>{
 const label=document.querySelector('#storageStatusLabel');if(label)label.textContent='IndexedDB ready';
 const engine=document.querySelector('#storageEngineName');if(engine)engine.textContent='IndexedDB (Local)';
});


if($('#dashboardProjectSelect'))$('#dashboardProjectSelect').addEventListener('change',updateDashboardProjectSnapshot);
if($('#dashboardNewProjectBtn'))$('#dashboardNewProjectBtn').onclick=()=>{editingId=null;resetForm();navigate('calculator')};
if($('#dashboardActionNew'))$('#dashboardActionNew').onclick=()=>{editingId=null;resetForm();navigate('calculator')};
if($('#dashboardOpenProjectBtn'))$('#dashboardOpenProjectBtn').onclick=()=>{const p=getDashboardProject();if(p)editProject(p.id);else showToast('Create a project first')};
if($('#dashboardActionDuplicate'))$('#dashboardActionDuplicate').onclick=()=>{const p=getDashboardProject();if(!p){showToast('Create a project first');return}duplicateProject(p.id);dashboardSelectedProjectId=state.projects[state.projects.length-1].id;renderAll()};
if($('#dashboardActionScenario'))$('#dashboardActionScenario').onclick=()=>{const p=getDashboardProject();if(p){scenarioSourceId=p.id;populateScenarioSelectors();$('#scenarioProjectSelect').value=String(p.id);cloneScenarioFromSelected()}navigate('whatif')};
if($('#dashboardActionReports'))$('#dashboardActionReports').onclick=()=>navigate('reports');
if($('#dashboardChangePrinterBtn'))$('#dashboardChangePrinterBtn').onclick=()=>openSettingsPanel('printer');
if($('#dashboardBackupBtn'))$('#dashboardBackupBtn').onclick=()=>{openSettingsPanel('transfer')};

if($('#inkCartridgePrice'))$('#inkCartridgePrice').addEventListener('input',updateCalculatedInkRate);
if($('#inkCartridgeCapacity'))$('#inkCartridgeCapacity').addEventListener('input',updateCalculatedInkRate);
