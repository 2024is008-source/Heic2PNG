import {canonicalPagePath} from './urls.mjs';

// Editorial changes only: retain the approved element classes, controls and IDs.
function copy(element, parts) {
 if (!element) throw new Error('Expected converter copy element is missing.');
 const children=[...element.children];
 if(typeof parts==='string') {
  if(children.length)throw new Error('Use text slots to preserve inline markup: '+element.localName);
  element.textContent=parts;
  return;
 }
 if(parts.length!==children.length+1)throw new Error('Converter copy slots do not match existing inline elements.');
 const nodes=[element.ownerDocument.createTextNode(parts[0])];
 children.forEach((child,i)=>nodes.push(child,element.ownerDocument.createTextNode(parts[i+1])));
 element.replaceChildren(...nodes);
}
function heading(element,document,tag) {
 const replacement=document.createElement(tag);
 for(const attribute of [...element.attributes].reverse())replacement.setAttribute(attribute.name,attribute.value);
 replacement.append(...element.childNodes);
 element.replaceWith(replacement);
 return replacement;
}
function cells(table,rows) {
 [...table.querySelectorAll('tbody tr')].forEach((row,i)=>{
  [...row.children].forEach((cell,j)=>copy(cell,rows[i][j]));
 });
}

export function improveConverterContent(document,format) {
 copy(document.getElementById('dropzone-title'),'Select HEIC files to convert');
 const support=document.querySelector('#upload-dropzone > p:last-child');
 copy(support,['Supports ', ' and ', ' files • Up to 50 files per batch • Max 100 MB per file']);
 for(const id of ['converter-error-title','success-banner-title'])heading(document.getElementById(id),document,'p');
 heading(document.querySelector('#file-list-section h3'),document,'p');
 if(format==='PNG') {
  copy(document.getElementById('converter-hero-desc'),'Convert HEIC photos to PNG online for free. Choose your files, set optional dimensions, and download PNG images or a batch ZIP.');
  copy(document.getElementById('settings-summary-quality'),'Lossless PNG encoding');
  pngContent(document);
 } else if(format==='JPG') jpgContent(document);
 else avifContent(document);
 contextualGuideLinks(document,format);
}

// Wrap existing explanatory text only; keep converter controls and copy intact.
function contextualGuideLinks(document,format) {
 const root=document.getElementById(format==='PNG'?'content-home-png':'content-heic-to-'+format.toLowerCase());
 const guides={
  PNG:[
   ['lossless image compression','/blog/heic-vs-png-quality-file-size-compatibility/'],
   ['format, size and crop requirements','/blog/how-to-convert-heic-images-for-website-uploads/']
  ],
  JPG:[
   ['JPEG quality trades file size against visible detail','/blog/how-to-convert-heic-to-jpg-without-losing-quality/'],
   ['HEIF/HEVC extension requirements','/blog/how-to-open-heic-files-on-windows-and-mac/'],
   ['changes future iPhone captures','/blog/why-does-my-iphone-save-photos-as-heic/']
  ],
  AVIF:[
   ['a destination that accepts AVIF','/blog/heic-to-jpg-vs-png-which-format-should-you-choose/'],
   ['Check the destination','/blog/how-to-convert-heic-images-for-website-uploads/']
  ]
 };
 const textNodes=node=>[...node.childNodes].flatMap(child=>child.nodeType===3?[child]:child.localName==='a'?[]:textNodes(child));
 for(const [text,href] of guides[format]) {
  const matches=textNodes(root).filter(node=>node.parentElement.closest('p,li')&&node.textContent.includes(text));
  if(matches.length!==1)throw new Error('Expected one contextual guide phrase: '+text);
  const node=matches[0],offset=node.textContent.indexOf(text),anchor=document.createElement('a');
  anchor.setAttribute('href',href);anchor.className='text-[#4F46E5] font-semibold underline';anchor.textContent=text;
  node.replaceWith(document.createTextNode(node.textContent.slice(0,offset)),anchor,document.createTextNode(node.textContent.slice(offset+text.length)));
 }
 for(const anchor of root.querySelectorAll('a[href^="/"]')) {
  const url=new URL(anchor.getAttribute('href'),'https://heic2png.site');
  anchor.setAttribute('href',canonicalPagePath(url.pathname)+url.search+url.hash);
 }
}

function pngContent(document) {
 const root=document.getElementById('content-home-png');
 const sections=[...root.querySelectorAll('section')];
 const features=sections[0];
 copy(features.querySelector('h2'),'Why Convert HEIC to PNG Here?');
 const descriptions=[
  'Create PNG copies for apps, upload forms and editing workflows that do not accept HEIC. Keep the originals for future exports.',
  'Photos are decoded and converted on your device. This converter does not upload the image files to a conversion server.',
  'PNG compression is lossless for the rendered pixels. It cannot restore source detail or guarantee the original HDR and color appearance.',
  'Select up to 50 supported HEIC files, convert them in sequence, and download individual PNGs or one ZIP archive.',
  'Keep the source pixel dimensions by default, or choose proportional resizing. Large images still need enough device memory.',
  'Use a browser with the required worker and canvas support. The decoder does not rely on installed Windows Photos codecs; some files may be unsupported.',
  'Use the converter without installing a desktop app or creating an account. No watermark is added to the exported image.'
 ];
 [...features.querySelectorAll('p')].forEach((p,i)=>copy(p,descriptions[i]));
 const featureTitles=['Local Image Processing','Lossless PNG Encoding','Batch HEIC Conversion','Keep or Resize Dimensions','Browser Compatibility','No Installation or Signup'];
 [...features.querySelectorAll('h3')].forEach((h,i)=>copy(h,featureTitles[i]));

 const steps=sections[1],paragraphs=[...steps.querySelectorAll('p')];
 copy(paragraphs[0],['Change ', ' photos into ', ' copies, then check the downloaded files before sharing.']);
 copy(paragraphs[1],['Click ', ' or drag supported ', ' and ', ' files into the converter. Download cloud-only originals to your device first.']);
 copy(paragraphs[2],['Keep the original dimensions or set a resize option, then click ', '. Camera/GPS EXIF is removed automatically; source ICC profiles and HDR are not preserved.']);
 copy(paragraphs[3],['Open and check a downloaded PNG, or use ', ' to save all completed files. Extract the ZIP before selecting an image in an upload form.']);
 copy(steps.querySelector('a span,button span'),'Read the HEIC to PNG guide for Windows 11');
 const illustrations=[...steps.querySelectorAll('.responsive-grid-3 > div')];
 copy(illustrations[0].querySelector('.text-\\[10px\\]'),'Example input file');
 copy(illustrations[1].querySelector('.text-\\[10px\\] span'),'8-bit RGB output');
 copy(illustrations[1].querySelector('.text-\\[10px\\] span:last-child'),'PNG encoding');
 copy(illustrations[1].querySelector('.text-xs .font-bold'),'PNG');
 copy(illustrations[2].querySelector('.flex.items-center.justify-between.mb-4 > span:last-child'),'Download Files');

 const compare=sections[2];
 copy(compare.querySelector('h2'),'HEIC vs PNG: Quality and Compatibility');
 copy(compare.querySelector('p'),'HEIC camera photos use efficient photographic compression. PNG uses lossless image compression and is widely supported, but a PNG copy can be larger without adding detail.');
 cells(compare.querySelector('table'),[
  ['Compression','Usually lossy for camera photos','Lossless compression of the supplied pixels'],
  ['Photo File Size','Efficient storage; size varies by image','Can be larger; dimensions and content matter'],
  ['App Compatibility','Depends on the app and installed decoder','Widely accepted; check the destination rules'],
  ['Transparency','The container can hold auxiliary alpha data','Supports alpha; conversion may not retain source layers'],
  ['Common Uses','Camera originals and Apple photo libraries','Compatible copies, graphics and editing workflows'],
  ['Editing','Keep an original rather than repeatedly exporting lossy copies','Avoids another lossy encoding step, not earlier rendering changes'],
  ['Browser Support',['Direct ', ' display depends on the browser and device'],'Broad support in current browsers']
 ]);
 const note=compare.querySelector('[class~="bg-amber-50/70"] > div');
 if(!note)throw Error('PNG technical note is missing.');
 copy(note.querySelector('strong'),'PNG Quality and Source Limits:');
 copy(note.querySelector('em'),'rendered pixels');
 copy(note,['', ' PNG losslessly encodes the ', '. This tool writes 8-bit RGB and removes EXIF. Source ICC/HDR and auxiliary layers are not preserved as an archive. Keep the original HEIC. For smaller photo attachments, try ', '.']);

 const uses=sections[3],useParagraphs=[...uses.querySelectorAll('p')];
 copy(useParagraphs[0],'Use PNG when your destination requests it or when a losslessly encoded rendered copy fits the task. Check file-size and dimension limits before exporting.');
 copy(useParagraphs[1],['Some upload forms accept only ', ' or ', ' images. Follow the stated format, size and crop requirements rather than renaming the HEIC extension.']);
 copy(useParagraphs[2],'Export PNG when your editor cannot import HEIC or you want to avoid another lossy save. Check the image and color appearance before continuing.');
 copy(useParagraphs[3],'Create a compatible still image for slides or documents. Verify its dimensions and appearance in the application where the file will be used.');
 copy(useParagraphs[4],'Send a PNG copy when a recipient or design app requests one. Keep the HEIC separately if you need the original photo data later.');
 const tools=sections[4],toolParagraphs=[...tools.querySelectorAll('p')];
 copy(toolParagraphs[0],'Choose JPG for widely supported photo delivery, or AVIF when the receiving app or website accepts it. Compare the actual output before choosing.');
 copy(toolParagraphs[1],'Convert HEIC to JPG with an adjustable quality setting. Inspect fine detail and keep the original: a high setting does not make JPEG lossless.');
 copy(toolParagraphs[2],'Convert HEIC to AVIF with quality, chroma and lossless controls. Check destination support; this tool exports 8-bit RGB, not the original HDR image.');
 for(const badge of tools.querySelectorAll('span'))if(!badge.children.length&&badge.textContent.trim()==='Most Popular for Email & Print')copy(badge,'Photo Sharing and Uploads');

 const questions=[
  ['What is a HEIC file?',['HEIC stands for ', ' and commonly stores iPhone photos efficiently. Opening it depends on the app and decoder. Keep it for source features beyond a compatible still-image copy.']],
  ['How do I convert HEIC to PNG?',['Select ', ' files using ', ', keep or adjust dimensions, then click ', '. Open and check a downloaded PNG. Renaming the extension does not convert the file.']],
  ['Can I convert multiple HEIC files at once?',['Yes. Select up to 50 files, with a maximum of 100 MB per file and 256 MB total input. Output is capped at 512 MB per batch. Use ', ' for completed files. Smaller batches can help on devices with limited memory.']],
  ['Does HEIC to PNG conversion reduce quality?','PNG adds no lossy compression to the rendered pixels. However, this converter outputs 8-bit RGB and does not preserve source ICC/HDR processing or auxiliary layers. It cannot recover missing detail, so keep the HEIC original.'],
  ['Why is my converted PNG larger?',['PNG and HEIC use different compression methods. A photographic PNG can be larger without containing more original detail. Size depends on the image and dimensions. If the destination accepts it, try the ', ' for a smaller delivery copy.']],
  ['Can I convert HEIC files on Windows?','Yes, in a compatible browser with worker and canvas support. This converter includes its own decoding path and does not need Windows Photos extensions. An unsupported HEIC variant or insufficient memory can still cause a file to fail.'],
  ['Can I convert HEIC photos on Android?',['Open ', ' in a compatible Android browser and tap ', '. Choose a locally available HEIC, then find the output in the browser’s downloads folder. Memory and browser APIs affect support; try one image first.']],
  ['Will PNG conversion remove the background?','No. An ordinary camera photo remains opaque. PNG can represent transparency, but this converter does not remove backgrounds or guarantee that auxiliary alpha, depth or cutout layers survive decoding.'],
  ['Are my photos uploaded for conversion?','No. Image conversion runs on your device in the browser. Downloading or loading the website is separate from processing your selected photos; submitting an output to another website sends it to that destination.'],
  ['Is the HEIC to PNG converter free?','Yes. No account or payment is required, and no watermark is added. File, batch and device-memory limits still apply.']
 ];
 questions.forEach(([question,answer],i)=>{
  const panel=document.getElementById('faq-body-'+(i+1)),button=panel.previousElementSibling;
  copy(button.firstElementChild,(i+1)+'. '+question);
  copy(panel,answer);
  const wrapper=document.createElement('h3');button.replaceWith(wrapper);wrapper.append(button);
 });
}

function jpgContent(document) {
 const root=document.getElementById('content-heic-to-jpg');
 const sections=[...root.querySelectorAll('section')];
 const steps=[...sections[0].querySelectorAll('ol li > div')];
 copy(steps[0],['', ' Select one or more ', ' files. Make sure cloud-only photos are downloaded before conversion.']);
 copy(steps[1],['', ' Adjust the ', ' slider. Its starting value is ', '; compare a sample and resize only if needed.']);
 copy(steps[2],['', ' Click ', ', then open the downloaded ', ' copy to check it. A ZIP groups completed files for download.']);
 copy(sections[0].querySelector('p'),['', ' is widely accepted for photo sharing and uploads. It usually uses lossy compression, so choose settings that fit the destination and keep your original HEIC.']);
 const reasons=[
  ['Manageable Photo Files:','Adjust dimensions and quality to meet a destination limit; no fixed saving applies to every image.'],
  ['Broad Compatibility:','Many photo apps, print services and upload forms accept JPG. Check the specific destination before sending.'],
  ['Email and Upload Limits:','Inspect the file size and required dimensions. Attachment limits vary by service.']
 ];
 [...sections[0].querySelectorAll('ul li > span:last-child')].forEach((el,i)=>{copy(el.querySelector('strong'),reasons[i][0]);copy(el,['', ' '+reasons[i][1]]);});

 const quality=sections[1];
 copy(quality.querySelector('h2'),'How Does JPG Quality Affect the Result?');
 copy(quality.querySelector('p'),'JPEG quality trades file size against visible detail. A high setting is still a lossy export, and the same number can behave differently across encoders.');
 const qualityCards=[...quality.querySelectorAll('.responsive-grid-3 > div')];
 const titles=['Smaller Delivery Copies','High-Quality Starting Point','Higher-Quality Export'];
 const explanations=[
  'Try for small web images or strict upload limits. Inspect text, edges and textures rather than expecting a fixed output size.',
  'The default is a starting point, not a lossless guarantee. Check a sample at its intended display size and adjust as needed.',
  'May reduce visible compression artifacts while increasing size. It does not restore detail or replace the original as an archive.'
 ];
 qualityCards.forEach((card,i)=>{const label=card.children[1];copy(label,titles[i]);heading(label,document,'h3');copy(card.querySelector('p'),explanations[i]);});
 cells(quality.querySelector('table'),[
  ['Compression','Commonly HEVC-compressed camera photos','Usually lossy JPEG compression'],
  ['Color and Features','Source bit depth and auxiliary data vary','This tool: 8-bit RGB; source ICC/HDR not retained'],
  ['App Compatibility','May need a supported decoder or extension','Widely supported; destination rules still apply'],
  ['Typical Use','Keep as the camera original','Create a photo delivery or upload copy']
 ]);
 const windows=sections[2];
 copy(windows.querySelector('h2'),'What If Windows Cannot Open My HEIC?');
 copy(windows.querySelector('p'),['A Windows app may lack a decoder for ', ' photos even when your phone opens them. Choose between making a JPG copy and adding support in the app.']);
 const options=[...windows.querySelectorAll('ul li')];
 copy(options[0].querySelector('strong'),'Option 1: Convert an Existing Photo:');
 copy(options[0],['', ' Use the converter above to create a ', ' copy. Check it in the destination app and retain the HEIC original.']);
 copy(options[1].querySelector('strong'),'Option 2: Review Viewing Support:');
 copy(options[1],['', ' Review the app’s HEIF/HEVC extension requirements. ', ' may be needed. ', ' changes future iPhone captures, not existing HEIC files.']);
 copy(windows.querySelector('a[href="/"],button[onclick*="home"]'),'Prefer lossless PNG encoding? Try HEIC to PNG →');
 const faqCard=windows.querySelector('.responsive-grid-2 > div:last-child');
 const questions=[...faqCard.querySelectorAll('.space-y-3 > div')];
 questions.forEach(card=>heading(card.firstElementChild,document,'h3'));
 copy(questions[0].querySelector('p'),['Choose ', ' for a widely accepted photo copy with adjustable compression. Choose ', ' when the destination requests it or avoiding another lossy encoding step matters more than file size.']);
 copy(questions[1].querySelector('p'),'This converter writes an 8-bit RGB primary image and removes camera/GPS EXIF. Source ICC profiles, HDR, Live Photo motion and auxiliary layers are not preserved as an original archive. Keep the HEIC.');
}

function avifContent(document) {
 const root=document.getElementById('content-heic-to-avif');
 const cards=[...root.querySelectorAll('.responsive-grid-2 > div')];
 copy(cards[0].querySelector('h2'),'How to Convert HEIC to AVIF');
 copy(cards[0].querySelector('p'),['', ' uses AV1 image coding. Create a copy for a destination that accepts AVIF, and compare the downloaded result before converting a large batch.']);
 const steps=[
  ['1. Select HEIC Files:','Choose locally available originals or drop them into the converter. Keep a separate source copy.'],
  ['2. Choose Your Settings:','Set quality and 4:2:0 or 4:4:4 chroma, or choose lossless mode. Lossless applies to decoded pixels, not every source HEIC feature.'],
  ['3. Convert and Download:','Click Convert to AVIF. Check a downloaded image, or save completed outputs as a ZIP.']
 ];
 [...cards[0].querySelectorAll('li > span:last-child')].forEach((el,i)=>{copy(el.querySelector('strong'),steps[i][0]);copy(el,['', ' '+steps[i][1]]);});
 copy(cards[1].querySelector('h2'),'Will My App or Website Accept AVIF?');
 copy(cards[1].querySelector('p'),['Many current browsers display ', ' images, but upload forms and editors may reject them. Check the destination. This tool exports 8-bit RGB and removes EXIF; source ICC/HDR and auxiliary layers are not preserved.']);
 const callout=cards[1].querySelector('.space-y-2');
 copy(callout.firstElementChild,'AVIF Quality and Conversion Limits');
 heading(callout.firstElementChild,document,'h3');
 const notes=[...callout.querySelectorAll('p')];
 copy(notes[0],['• If a destination rejects ', ', choose an accepted format: ', ' or ', '.']);
 copy(notes[1],'• Encoding uses a local WebAssembly worker. Large images need memory and time. Try a small batch; lossless or 4:4:4 can increase size, so inspect fine detail and the actual output.');
 cells(root.querySelector('table'),[
  ['App and Web Support','Many current browsers; check uploads','Widely supported','Widely supported','Depends on the app and decoder'],
  ['Transparency Support','Supported by the format','Supported by the format','No alpha channel','Source auxiliary data may vary'],
  ['Compression','Lossy or lossless modes','Lossless','Usually lossy','Usually lossy for camera photos']
 ]);
}
