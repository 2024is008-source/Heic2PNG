// @ts-nocheck
// Original approved UI renderers and toggles, with real-data substitutions.
var currentFormat = "PNG", jpgQuality = 85, avifQuality = 78, toastTimeout = null;
    function renderFileQueue() {
      var section = document.getElementById('file-list-section');
      var container = document.getElementById('file-rows-container');
      var countLabel = document.getElementById('file-count-label');
      var summaryPill = document.getElementById('batch-summary-pill');

      if (!fileQueue || fileQueue.length === 0) {
        section.classList.add('hidden');
        return;
      }
      section.classList.remove('hidden');
      countLabel.textContent = String(fileQueue.length);

      var totalMB = 0;
      for (var i = 0; i < fileQueue.length; i++) {
        totalMB += Number(fileQueue[i].inputSizeMB || 0);
      }
      summaryPill.textContent = 'Total input: ' + totalMB.toFixed(1) + ' MB';

      var html = '';
      for (var j = 0; j < fileQueue.length; j++) {
        var item = fileQueue[j];
        var thumbSrc = item.preview || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect width="80" height="60" fill="%23F1F5F9"/%3E%3C/svg%3E';
        var outName = getOutputFilename(escapeHtml(item.name));
        var outSize = item.blob ? formatBytes(item.blob.size) : 'Pending';

        var statusBadge = '';
        var progressHtml = '';
        var actionBtnHtml = '';

        if (item.status === 'queued') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] font-semibold text-[11px]">Queued for ' + currentFormat + '</span>';
          actionBtnHtml = '<button type="button" data-onclick="convertSingleFile(\'' + item.id + '\')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] font-semibold text-xs transition-soft">Convert</button>';
        } else if (item.status === 'converting') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] font-bold text-[11px]">Decoding & encoding…</span>';
          progressHtml = '<div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2"><div class="h-full brand-gradient transition-all duration-200" style="width:100%" role="progressbar" aria-label="Converting image"></div></div>';
          actionBtnHtml = '<span class="text-xs font-mono text-[#4F46E5] font-semibold">…</span>';
        } else if (item.status === 'completed') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 font-bold text-[11px]">Completed → ' + outSize + '</span>';
          actionBtnHtml = '<button type="button" data-onclick="downloadConvertedFile(\'' + item.id + '\')" class="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-soft inline-flex items-center gap-1">' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
            '<span>Download ' + currentFormat + '</span></button>';
        } else if (item.status === 'error-invalid') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px]">Invalid Format Error</span>';
          progressHtml = '<p class="text-[11px] text-rose-600 mt-1 font-medium">' + escapeHtml(item.errorMessage) + '</p>';
        } else if (item.status === 'error-unsupported') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-300 font-bold text-[11px]">Unsupported HEIC Variant</span>';
          progressHtml = '<p class="text-[11px] text-amber-800 mt-1 font-medium">' + escapeHtml(item.errorMessage) + '</p>';
        }

        html += '<div class="file-row-item rounded-2xl border border-[#E2E8F0] bg-white p-3.5 flex items-center justify-between gap-4 hover:border-indigo-200 transition-soft">' +
          '<div class="flex items-center gap-3.5 min-w-0 flex-1">' +
            '<img src="' + thumbSrc + '" alt="Thumbnail for ' + escapeHtml(item.name) + '" class="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />' +
            '<div class="min-w-0 flex-1">' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<span class="text-xs sm:text-sm font-bold text-[#0F172A] truncate">' + escapeHtml(item.name) + '</span>' +
                '<span class="text-[11px] font-mono text-[#64748B]">→ ' + outName + '</span>' +
              '</div>' +
              '<div class="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B] mt-0.5">' +
                '<span>' + item.inputSizeMB.toFixed(1) + ' MB</span>' +
                '<span>•</span>' +
                '<span>' + item.dimensions + '</span>' +
                '<span>•</span>' +
                '<span>' + item.colorSpace + '</span>' +
              '</div>' +
              progressHtml +
            '</div>' +
          '</div>' +
          '<div class="file-row-actions flex items-center gap-2 shrink-0">' +
            statusBadge +
            actionBtnHtml +
            '<button type="button" data-onclick="removeFileById(\'' + item.id + '\')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-soft" title="Remove file" aria-label="Remove ' + escapeHtml(item.name) + '">' +
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';
      }

      container.innerHTML = html;
    }

    function switchToolFormat(fmt) {
      currentFormat = fmt;

      var tabPng = document.getElementById('tab-fmt-png');
      var tabJpg = document.getElementById('tab-fmt-jpg');
      var tabAvif = document.getElementById('tab-fmt-avif');
      var activeClass = 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-white text-[#4F46E5] shadow-sm transition-soft flex items-center gap-1.5';
      var inactiveClass = 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-soft flex items-center gap-1.5';

      tabPng.className = fmt === 'PNG' ? activeClass : inactiveClass;
      tabJpg.className = fmt === 'JPG' ? activeClass : inactiveClass;
      tabAvif.className = fmt === 'AVIF' ? activeClass : inactiveClass;

      var h1El = document.getElementById('converter-hero-h1');
      var descEl = document.getElementById('converter-hero-desc');
      var outBadge = document.getElementById('badge-output-format');
      var sumFmt = document.getElementById('settings-summary-format');
      var sumQual = document.getElementById('settings-summary-quality');
      var jpgPanel = document.getElementById('jpg-quality-panel');
      var avifPanel = document.getElementById('avif-quality-panel');
      var pngNote = document.getElementById('png-transparency-note');
      var btnConvLabel = document.getElementById('btn-convert-label');
      var btnDlLabel = document.getElementById('btn-download-single-label');

      var contentPng = {classList:{add(){},remove(){}}};
      var contentJpg = {classList:{add(){},remove(){}}};
      var contentAvif = {classList:{add(){},remove(){}}};

      contentPng.classList.add('hidden');
      contentJpg.classList.add('hidden');
      contentAvif.classList.add('hidden');

      if (fmt === 'PNG') {
        h1El.textContent = 'HEIC to PNG Converter';
        descEl.textContent = 'Convert HEIC photos to high-quality PNG images online for free. Convert multiple iPhone photos directly in your browser. No signup required.';
        outBadge.textContent = 'Output: .PNG (Lossless)';
        sumFmt.textContent = 'PNG (Lossless 24/32-bit)';
        sumQual.textContent = 'Full quality preserved';
        jpgPanel.classList.add('hidden');
        avifPanel.classList.add('hidden');
        pngNote.classList.remove('hidden');
        btnConvLabel.textContent = 'Convert to PNG';
        btnDlLabel.textContent = 'Download PNG';
        contentPng.classList.remove('hidden');
        
      } else if (fmt === 'JPG') {
        h1El.textContent = 'HEIC to JPG Converter';
        descEl.textContent = 'Convert HEIC photos into widely compatible JPG images online for free.';
        outBadge.textContent = 'Output: .JPG (Quality ' + jpgQuality + '%)';
        sumFmt.textContent = 'JPG (Photographic)';
        sumQual.textContent = 'Quality: ' + jpgQuality + '% Default';
        jpgPanel.classList.remove('hidden');
        avifPanel.classList.add('hidden');
        pngNote.classList.add('hidden');
        btnConvLabel.textContent = 'Convert to JPG';
        btnDlLabel.textContent = 'Download JPG';
        contentJpg.classList.remove('hidden');
        
      } else if (fmt === 'AVIF') {
        h1El.textContent = 'HEIC to AVIF Converter';
        descEl.textContent = 'Convert iPhone HEIC photos to modern, high-efficiency AVIF images for supported web and image workflows.';
        outBadge.textContent = 'Output: .AVIF (AV1 Image)';
        sumFmt.textContent = 'AVIF (Next-Gen Web)';
        sumQual.textContent = 'Quality: ' + avifQuality + '% Balanced';
        jpgPanel.classList.add('hidden');
        avifPanel.classList.remove('hidden');
        pngNote.classList.add('hidden');
        btnConvLabel.textContent = 'Convert to AVIF';
        btnDlLabel.textContent = 'Download AVIF';
        contentAvif.classList.remove('hidden');
        
      }

      renderFileQueue();
    }

    function updateJpgQuality(val) {
      jpgQuality = parseInt(val, 10) || 85;
      var label = jpgQuality >= 90 ? 'Maximum Detail' : jpgQuality >= 80 ? 'High Quality' : 'Compact File';
      document.getElementById('jpg-quality-value-badge').textContent = jpgQuality + '% (' + label + ')';
      document.getElementById('badge-output-format').textContent = 'Output: .JPG (Quality ' + jpgQuality + '%)';
      document.getElementById('settings-summary-quality').textContent = 'Quality: ' + jpgQuality + '%';
      renderFileQueue();
    }

    function toggleAdvancedSettings() {
      var panel = document.getElementById('advanced-settings-panel');
      var icon = document.getElementById('adv-toggle-icon');
      var btn = document.getElementById('btn-toggle-advanced');
      var isHidden = panel.classList.contains('hidden');
      if (isHidden) {
        panel.classList.remove('hidden');
        icon.classList.add('rotate-180');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        panel.classList.add('hidden');
        icon.classList.remove('rotate-180');
        btn.setAttribute('aria-expanded', 'false');
      }
    }

    function handleResizeModeChange(mode) {
      var wEl = document.getElementById('input-width-px');
      var hEl = document.getElementById('input-height-px');
      var sumRes = document.getElementById('settings-summary-res');
      if (mode === 'original') {
        wEl.value = fileQueue[0]?.originalWidth || '';
        hEl.value = fileQueue[0]?.originalHeight || '';
        sumRes.textContent = 'Keep original resolution';
      } else if (mode === 'scale-50') {
        wEl.value = ''; hEl.value = '';
        sumRes.textContent = 'Scale each image to 50%';
      } else if (mode === 'web-1920') {
        wEl.value = 1920; hEl.value = '';
        sumRes.textContent = 'Fit each image to maximum width 1920 px';
      } else {
        sumRes.textContent = 'Custom: ' + wEl.value + ' × ' + hEl.value + ' px';
      }
    }

    function handleDimensionInput(axis, val) { customAxis = axis;
      var num = parseInt(val, 10) || 100;
      var keepRatio = document.getElementById('chk-aspect-ratio').checked;
      var wEl = document.getElementById('input-width-px');
      var hEl = document.getElementById('input-height-px');
      if (keepRatio && fileQueue[0]?.originalWidth) {
        var ratio = fileQueue[0].originalWidth / fileQueue[0].originalHeight;
        if (axis === 'w') hEl.value = Math.max(1, Math.round(num / ratio));
        else wEl.value = Math.max(1, Math.round(num * ratio));
      }
      document.getElementById('resize-mode-select').value = 'custom';
      document.getElementById('settings-summary-res').textContent = 'Custom: ' + wEl.value + ' × ' + hEl.value + ' px';
    }

    function toggleToolsDropdown() {
      var menu = document.getElementById('tools-dropdown-menu');
      menu.classList.toggle('hidden');
    }

    function closeToolsDropdown() {
      var menu = document.getElementById('tools-dropdown-menu');
      if (menu) menu.classList.add('hidden');
    }

    function toggleMobileMenu() {
      var drawer = document.getElementById('mobile-nav-drawer');
      var openIcon = document.getElementById('icon-menu-open');
      var closeIcon = document.getElementById('icon-menu-close');
      var isHidden = drawer.classList.contains('hidden');
      if (isHidden) {
        drawer.classList.remove('hidden');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }

    function closeMobileMenu() {
      var drawer = document.getElementById('mobile-nav-drawer');
      var openIcon = document.getElementById('icon-menu-open');
      var closeIcon = document.getElementById('icon-menu-close');
      if (drawer) drawer.classList.add('hidden');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }

    function toggleFaq(idx) {
      var body = document.getElementById('faq-body-' + idx);
      var icon = document.getElementById('faq-icon-' + idx);
      if (!body) return;
      var isHidden = body.classList.contains('hidden');
      if (isHidden) {
        body.classList.remove('hidden');
        if (icon) icon.textContent = '−';
      } else {
        body.classList.add('hidden');
        if (icon) icon.textContent = '+';
      }
    }

    function showToast(msg) {
      var t = document.getElementById('app-toast');
      var txt = document.getElementById('app-toast-text');
      if (!t || !txt) return;
      txt.textContent = msg;
      t.classList.remove('hidden');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(function () {
        t.classList.add('hidden');
      }, 3200);
    }



const $ = id => document.getElementById(id);
var fileQueue = [];
let busy = false, activeWorker = null, cancelActive = null, generation = 0, customAxis = 'w';
const MAX_FILE = 100 * 1024 * 1024, MAX_INPUT = 256 * 1024 * 1024, MAX_OUTPUT = 512 * 1024 * 1024;
const escapeHtml = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatBytes = n => n < 1024*1024 ? (n/1024).toFixed(1)+' KB' : (n/1024/1024).toFixed(2)+' MB';
function getOutputFilename(name) { return name.replace(/\.[^.]+$/,'').replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g,'_').replace(/^\.+/,'_').slice(0,160)+'.'+currentFormat.toLowerCase(); }
function errorBanner(message) {
 if(!$('converter-error-banner')) return showToast(message);
 $('converter-error-title').textContent='Unable to process file';
 $('converter-error-desc').textContent=message;
 $('converter-error-banner').classList.remove('hidden');
}
function dismissErrorBanner(){ $('converter-error-banner').classList.add('hidden'); }
function release(item){ if(item.preview) URL.revokeObjectURL(item.preview); item.blob=null;item.preview=null; }
function refresh(){
 if(!$('file-rows-container'))return;
 renderFileQueue();
 if(!fileQueue.length)$('file-rows-container').replaceChildren();
 const done=fileQueue.filter(x=>x.blob);
 if($('resize-mode-select').value==='original'){
  $('input-width-px').value=fileQueue[0]?.originalWidth||'';
  $('input-height-px').value=fileQueue[0]?.originalHeight||'';
 }
 const successes=$('converter-success-banner');
 successes.classList.toggle('hidden',!done.length);
 if(done.length){
  $('success-banner-title').textContent=done.length+' of '+fileQueue.length+' photos converted to '+currentFormat;
  $('success-banner-subtitle').textContent='Processed locally • '+formatBytes(done.reduce((n,x)=>n+x.blob.size,0))+' total output';
 }
 $('btn-primary-convert').disabled=busy||!fileQueue.length;
 $('btn-download-single').disabled=!done.length;
 $('btn-download-zip').disabled=busy||!done.length;
 for(const el of document.querySelectorAll('#advanced-settings-panel input, #resize-mode-select, #jpg-quality-slider, #avif-quality-slider, #avif-subsampling')) if(!['chk-strip-exif','chk-color-srgb'].includes(el.id)) el.disabled=busy||(el.id==='avif-quality-slider'&&$('avif-subsampling').value==='lossless');
 for(const el of document.querySelectorAll('[data-onclick^="convertSingleFile"]')) el.disabled=busy;
}
async function ingestUserFiles(files){
 const epoch=generation;
 for(const file of [...files]){
  if(epoch!==generation)break;
  if(fileQueue.length>=50){errorBanner('A batch can contain at most 50 files.');break;}
  if(!/\.(heic|heif)$/i.test(file.name)||!file.size||file.size>MAX_FILE){errorBanner('Choose a non-empty .heic or .heif file no larger than 100 MB: '+file.name);continue;}
  if(fileQueue.reduce((n,x)=>n+x.file.size,0)+file.size>MAX_INPUT){errorBanner('Batch input is limited to 256 MB. Clear or remove files first.');break;}
  const header=new Uint8Array(await file.slice(0,128).arrayBuffer());
  if(epoch!==generation)break;
  const text=new TextDecoder('latin1').decode(header);
  if(text.slice(4,8)!=='ftyp'||!/(heic|heix|hevc|hevx|heim|heis|hevm|hevs|mif1|msf1)/.test(text.slice(8))){errorBanner('This file does not contain a HEIC/HEIF container: '+file.name);continue;}
  fileQueue.push({id:crypto.randomUUID(),file,name:file.name,inputSizeMB:file.size/1024/1024,dimensions:'Dimensions available after decoding',colorSpace:'Not inspected',status:'queued',errorMessage:'',progress:0});
 }
 refresh();
}
function handleRealFileSelect(e){ const files=[...e.target.files];e.target.value='';void ingestUserFiles(files); }
function handleDragOver(e){e.preventDefault();$('upload-dropzone').classList.add('ring-4','ring-indigo-500/15');}
function handleDragLeave(e){e.preventDefault();$('upload-dropzone').classList.remove('ring-4','ring-indigo-500/15');}
function handleFileDrop(e){e.preventDefault();handleDragLeave(e);void ingestUserFiles(e.dataTransfer.files);}
function updateAvifQuality(value){
 avifQuality=Math.min(95,Math.max(40,Number(value)||78));
 updateAvifSummary();
}
function updateAvifSummary(){
 const mode=$('avif-subsampling').value,lossless=mode==='lossless';
 $('avif-quality-slider').disabled=busy||lossless;
 $('avif-quality-badge').textContent=lossless?'Lossless (100%)':avifQuality+'% (Balanced)';
 if(currentFormat==='AVIF'){
  $('settings-summary-quality').textContent=lossless?'Lossless • 4:4:4 • 8-bit RGB':'Quality: '+avifQuality+'% • '+(mode==='444'?'4:4:4':'4:2:0')+' • 8-bit RGB';
  $('badge-output-format').textContent=lossless?'Output: .AVIF (Lossless)':'Output: .AVIF (Quality '+avifQuality+'%)';
 }
}
function handleAvifModeChange(){updateAvifSummary();}
function settings(){return {format:currentFormat,quality:currentFormat==='AVIF'?avifQuality:jpgQuality,avifChroma:$('avif-subsampling').value,mode:$('resize-mode-select').value,width:Number($('input-width-px').value),height:Number($('input-height-px').value),aspect:$('chk-aspect-ratio').checked,axis:customAxis};}
function runWorker(file, options){
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./converter.worker.ts',import.meta.url),{type:'module'});activeWorker=worker;
  const cleanup=()=>{clearTimeout(timer);worker.terminate();if(activeWorker===worker){activeWorker=null;cancelActive=null;}};
  const timer=setTimeout(()=>{cleanup();reject(new Error('Conversion timed out. Try a smaller image or another browser.'));},options.format==='AVIF'?300000:120000);
  cancelActive=()=>{cleanup();reject(new Error('Conversion cancelled.'));};
  worker.onmessage=({data})=>{cleanup();data.error?reject(new Error(data.error)):resolve(data);};
  worker.onerror=()=>{cleanup();reject(new Error('Decoder could not run in this browser. Try an updated Chrome, Edge, Firefox or Safari.'));};
  worker.postMessage({file,settings:options});
 });
}
async function convertItems(items){
 if(busy)return;
 if(!items.length)return showToast('Choose HEIC files first.');
 const epoch=generation, options=settings();busy=true;dismissErrorBanner();refresh();
 for(const item of items){
  if(epoch!==generation)break;
  if(!fileQueue.includes(item))continue;
  release(item);item.status='converting';refresh();
  try{
   const result=await runWorker(item.file,options);
   if(epoch!==generation||!fileQueue.includes(item))continue;
   if(fileQueue.reduce((n,x)=>n+(x.blob?.size||0),0)+result.blob.size>MAX_OUTPUT)throw new Error('Batch output reached 512 MB. Download and clear files before continuing.');
   Object.assign(item,result,{preview:URL.createObjectURL(result.thumbnail),status:'completed',colorSpace:'8-bit RGB',dimensions:result.width+' × '+result.height+' px',progress:100});
  }catch(error){if(epoch!==generation)break;if(!fileQueue.includes(item))continue;item.status='error-unsupported';item.errorMessage=error.message;errorBanner(error.message+' Retry with Convert to '+currentFormat+' or remove the file.');}
  refresh();
 }
 busy=false;refresh();
}
function startBatchConversion(){return convertItems(fileQueue.filter(x=>x.status!=='completed'));}
function convertSingleFile(id){return convertItems(fileQueue.filter(x=>x.id===id));}
function removeFileById(id){
 const item=fileQueue.find(x=>x.id===id);if(!item)return;
 if(item.status==='converting')cancelActive?.();
 release(item);fileQueue=fileQueue.filter(x=>x!==item);refresh();
}
function clearAllFiles(){generation++;cancelActive?.();fileQueue.forEach(release);fileQueue=[];refresh();dismissErrorBanner();}
function save(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function downloadConvertedFile(id){const item=fileQueue.find(x=>x.id===id);if(item?.blob)save(item.blob,getOutputFilename(item.name));}
function downloadFirstCompleted(){const item=fileQueue.find(x=>x.blob);if(item)downloadConvertedFile(item.id);else showToast('Convert a file before downloading.');}
let zipping=false;
async function downloadAllAsZip(){
 if(zipping||busy)return;
 const items=fileQueue.filter(x=>x.blob);if(!items.length)return showToast('Convert files before downloading.');
 zipping=true;
 try{
  const {default:JSZip}=await import('jszip');const zip=new JSZip(), names=new Set();
  for(const item of items){let name=getOutputFilename(item.name),n=2;while(names.has(name.toLowerCase()))name=getOutputFilename(item.name).replace(/\.[^.]+$/,` (${n++}).${currentFormat.toLowerCase()}`);names.add(name.toLowerCase());zip.file(name,item.blob);}
  save(await zip.generateAsync({type:'blob',compression:'STORE'}),'HEIC2PNG_Batch_'+currentFormat+'.zip');
 }catch{errorBanner('ZIP creation failed. Download images individually or use a smaller batch.');}
 finally{zipping=false;}
}
function invalidate(){if(busy)return;for(const item of fileQueue){release(item);item.status='queued';item.errorMessage='';}refresh();}
// Blog filtering works against statically rendered, accessible article links.
let blogCategory=new URLSearchParams(location.search).get('category')||'ALL', blogQuery=new URLSearchParams(location.search).get('q')||'',blogPage=1;
function renderBlogCards(){
 const cards=[...document.querySelectorAll('[data-blog-card]')];if(!$('blog-articles-grid'))return;
 const matches=cards.filter(c=>(blogCategory==='ALL'||c.dataset.category===blogCategory)&&c.dataset.search.toLowerCase().includes(blogQuery.toLowerCase()));
 const pages=Math.max(1,Math.ceil(matches.length/6));blogPage=Math.min(blogPage,pages);
 for(const c of cards){const i=matches.indexOf(c);c.classList.toggle('hidden',i<0||i<(blogPage-1)*6||i>=blogPage*6);}
 $('blog-no-results').classList.toggle('hidden',!!matches.length);$('blog-empty-query').textContent=blogQuery||blogCategory;
 $('blog-showing-count').textContent=matches.length?`${(blogPage-1)*6+1}–${Math.min(blogPage*6,matches.length)}`:'0';
 const holder=$('page-btn-1').parentElement;
 holder.innerHTML=Array.from({length:pages},(_,i)=>`<button type="button" id="page-btn-${i+1}" class="${blogPage===i+1?'px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4F46E5] text-white':'px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'}" data-onclick="setBlogPage(${i+1})" aria-current="${blogPage===i+1?'page':'false'}">${i+1}</button>`).join('');
 for(const chip of document.querySelectorAll('[data-cat-chip]')){
  const active=chip.dataset.catChip===blogCategory;
  chip.setAttribute('aria-pressed',String(active));
  chip.className=active?'blog-cat-chip px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4F46E5] text-white transition-soft':'blog-cat-chip px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-soft';
 }
}
function filterBlogCategory(cat){blogCategory=cat;blogPage=1;renderBlogCards();}
function handleBlogSearch(query){blogQuery=query;blogPage=1;renderBlogCards();}
function setBlogPage(page){blogPage=page;renderBlogCards();}
function setBlogUIState(){blogCategory='ALL';blogQuery='';blogPage=1;$('blog-search-input').value='';renderBlogCards();}
function handleContactSubmit(e){
 e.preventDefault();
 const email=import.meta.env.PUBLIC_CONTACT_EMAIL||'backbencherz@gmail.com';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  $('contact-error-box').classList.remove('hidden');
  $('contact-error-box').querySelector('.font-bold').textContent='Contact email is not configured yet';
  $('contact-error-box').querySelector('p').textContent='No message was sent. Please try again after the site owner configures support.';return;
 }
 if(!$('contact-form').reportValidity())return;
 location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('HEIC2PNG support — '+$('contact-name').value)+'&body='+encodeURIComponent('Reply to: '+$('contact-email').value+'\n\n'+$('contact-message').value);
 showToast('Opening your email app. Send your message there.');
}
Object.assign(window,{startBatchConversion,convertSingleFile,downloadConvertedFile,downloadFirstCompleted,downloadAllAsZip,removeFileById,clearAllFiles,handleDragOver,handleDragLeave,handleFileDrop,handleRealFileSelect,dismissErrorBanner,toggleAdvancedSettings,handleResizeModeChange,handleDimensionInput,updateJpgQuality,updateAvifQuality,handleAvifModeChange,toggleToolsDropdown,closeToolsDropdown,toggleMobileMenu,closeMobileMenu,toggleFaq,filterBlogCategory,handleBlogSearch,setBlogPage,setBlogUIState,handleContactSubmit,switchToolFormat:(fmt)=>{if(fmt==='PNG')location.href='/';if(fmt==='JPG')location.href='/heic-to-jpg';if(fmt==='AVIF')location.href='/heic-to-avif';}});
// Bind the existing declarative handlers without eval or inline JavaScript execution.
for(const type of ['click','input','change','submit','dragover','dragleave','drop'])document.addEventListener(type,event=>{
 if(type==='click'&&event.target instanceof HTMLInputElement)return;
 const el=event.target.closest?.('[data-on'+type+']');if(!el||el.disabled)return;
 const code=el.getAttribute('data-on'+type);
 for(const statement of code.split(';').map(s=>s.trim()).filter(Boolean)){
  if(statement==='event.stopPropagation()'){event.stopPropagation();continue;}
  if(statement==="document.getElementById('real-file-input').click()"){$('real-file-input').click();continue;}
  const call=statement.match(/^(\w+)\((.*)\)$/);if(!call||typeof window[call[1]]!=='function')continue;
  const args=call[2]?call[2].split(/,\s*/).map(arg=>arg==='event'?event:arg==='this.value'?el.value:/^'.*'$/.test(arg)?arg.slice(1,-1):Number(arg)):[];
  window[call[1]](...args);
 }
});
currentFormat=document.body.dataset.format||'PNG';
if($('file-rows-container')){
 if(currentFormat==='AVIF')updateAvifSummary();
 refresh();
 $('upload-dropzone').addEventListener('keydown',e=>{if(e.target===e.currentTarget&&['Enter',' '].includes(e.key)){e.preventDefault();$('real-file-input').click();}});
 for(const el of document.querySelectorAll('#advanced-settings-panel input, #resize-mode-select, #jpg-quality-slider, #avif-quality-slider, #avif-subsampling'))el.addEventListener('change',invalidate);
}
if($('blog-search-input')){$('blog-search-input').value=blogQuery;renderBlogCards();}
document.addEventListener('click',e=>{if(!$('tools-dropdown-container')?.contains(e.target))closeToolsDropdown();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeToolsDropdown();closeMobileMenu();syncMenuDisclosureState();}});
// Match ARIA state to the preserved toggles without changing their visuals.
function syncMenuDisclosureState(){
 $('tools-dropdown-btn')?.setAttribute('aria-expanded',String(!$('tools-dropdown-menu').classList.contains('hidden')));
 $('mobile-menu-btn')?.setAttribute('aria-expanded',String(!$('mobile-nav-drawer').classList.contains('hidden')));
}
document.addEventListener('click',e=>{
 const faq=e.target.closest('[data-onclick^="toggleFaq"]');if(faq){const n=faq.getAttribute('data-onclick').match(/\d+/)[0];faq.setAttribute('aria-expanded',String(!$('faq-body-'+n).classList.contains('hidden')));}
 syncMenuDisclosureState();
});
window.addEventListener('pagehide',()=>{generation++;cancelActive?.();fileQueue.forEach(release);});
