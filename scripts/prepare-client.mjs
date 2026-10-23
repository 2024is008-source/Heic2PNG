import fs from 'node:fs';
let ui=fs.readFileSync('src/design/helpers.js','utf8');
ui=ui.replaceAll('onclick=', 'data-onclick=');
ui=ui.replace("function handleDimensionInput(axis, val) {", "function handleDimensionInput(axis, val) { customAxis = axis;");
ui=ui.replace('var thumbSrc = getThumbnailSvgDataUri(item.theme);',`var thumbSrc = item.preview || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect width="80" height="60" fill="%23F1F5F9"/%3E%3C/svg%3E';`);
ui=ui.replace('var outSize = calculateEstimatedOutputSize(item.inputSizeMB);',"var outSize = item.blob ? formatBytes(item.blob.size) : 'Pending';");
ui=ui.replaceAll('item.name','escapeHtml(item.name)').replaceAll('item.errorMessage','escapeHtml(item.errorMessage)');
ui=ui.replaceAll("'Converting ' + item.progress + '%'","'Decoding & encoding…'");
ui=ui.replaceAll("Converting ' + item.progress + '%",'Decoding & encoding…');
ui=ui.replace("style=\"width:' + item.progress + '%\"",'style="width:100%" role="progressbar" aria-label="Converting image"');
ui=ui.replace("' + item.progress + '%</span>","…</span>");
// Format routing is handled by ordinary anchors. Do not touch metadata at runtime.
ui=ui.replace(/updateSeoBar\([^\n]+\);/g,'');
// Preserve removed educational view references as no-op objects in this helper.
ui=ui.replace(/var content(Png|Jpg|Avif) = document.getElementById\('[^']+'\);/g,'var content$1 = {classList:{add(){},remove(){}}};');
ui=ui.replace(/      if \(keepRatio\) \{[\s\S]*?\n      \}/,`      if (keepRatio && fileQueue[0]?.originalWidth) {
        var ratio = fileQueue[0].originalWidth / fileQueue[0].originalHeight;
        if (axis === 'w') hEl.value = Math.max(1, Math.round(num / ratio));
        else wEl.value = Math.max(1, Math.round(num * ratio));
      }`);
ui=ui.replace("wEl.value = 4032;\n        hEl.value = 3024;", "wEl.value = fileQueue[0]?.originalWidth || '';\n        hEl.value = fileQueue[0]?.originalHeight || '';" );
ui=ui.replace("sumRes.textContent = 'Resized: 2016 × 1512 px';","sumRes.textContent = 'Scale each image to 50%';");
ui=ui.replace("sumRes.textContent = 'Resized: 1920 × 1440 px';","sumRes.textContent = 'Fit each image to maximum width 1920 px';");
ui=ui.replace("wEl.value = 2016;\n        hEl.value = 1512;","wEl.value = ''; hEl.value = '';" ).replace("wEl.value = 1920;\n        hEl.value = 1440;","wEl.value = 1920; hEl.value = '';" );
fs.writeFileSync('src/scripts/client.ts','// @ts-nocheck\n// Original approved UI renderers and toggles, with real-data substitutions.\n'+ui+'\n'+fs.readFileSync('src/scripts/runtime.txt','utf8'));
