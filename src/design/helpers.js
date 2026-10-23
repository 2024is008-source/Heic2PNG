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
        var thumbSrc = getThumbnailSvgDataUri(item.theme);
        var outName = getOutputFilename(item.name);
        var outSize = calculateEstimatedOutputSize(item.inputSizeMB);

        var statusBadge = '';
        var progressHtml = '';
        var actionBtnHtml = '';

        if (item.status === 'queued') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] font-semibold text-[11px]">Queued for ' + currentFormat + '</span>';
          actionBtnHtml = '<button type="button" onclick="convertSingleFile(\'' + item.id + '\')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] font-semibold text-xs transition-soft">Convert</button>';
        } else if (item.status === 'converting') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] font-bold text-[11px]">Converting ' + item.progress + '%</span>';
          progressHtml = '<div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2"><div class="h-full brand-gradient transition-all duration-200" style="width:' + item.progress + '%"></div></div>';
          actionBtnHtml = '<span class="text-xs font-mono text-[#4F46E5] font-semibold">' + item.progress + '%</span>';
        } else if (item.status === 'completed') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 font-bold text-[11px]">Completed → ' + outSize + '</span>';
          actionBtnHtml = '<button type="button" onclick="downloadConvertedFile(\'' + item.id + '\')" class="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-soft inline-flex items-center gap-1">' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>' +
            '<span>Download ' + currentFormat + '</span></button>';
        } else if (item.status === 'error-invalid') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px]">Invalid Format Error</span>';
          progressHtml = '<p class="text-[11px] text-rose-600 mt-1 font-medium">' + item.errorMessage + '</p>';
        } else if (item.status === 'error-unsupported') {
          statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-300 font-bold text-[11px]">Unsupported HEIC Variant</span>';
          progressHtml = '<p class="text-[11px] text-amber-800 mt-1 font-medium">' + item.errorMessage + '</p>';
        }

        html += '<div class="file-row-item rounded-2xl border border-[#E2E8F0] bg-white p-3.5 flex items-center justify-between gap-4 hover:border-indigo-200 transition-soft">' +
          '<div class="file-row-info flex items-center gap-3.5 min-w-0 flex-1">' +
            '<img src="' + thumbSrc + '" alt="Thumbnail for ' + item.name + '" class="file-row-thumbnail w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />' +
            '<div class="file-row-details min-w-0 flex-1">' +
              '<div class="file-row-names flex flex-wrap items-center gap-2">' +
                '<span title="' + item.name + '" class="file-input-name text-xs sm:text-sm font-bold text-[#0F172A] truncate">' + item.name + '</span>' +
                '<span title="' + outName + '" class="file-output-name text-[11px] font-mono text-[#64748B]">→ ' + outName + '</span>' +
              '</div>' +
              '<div class="file-row-meta flex flex-wrap items-center gap-2 text-[11px] text-[#64748B] mt-0.5">' +
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
            '<button type="button" onclick="removeFileById(\'' + item.id + '\')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-soft" title="Remove file" aria-label="Remove ' + item.name + '">' +
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

      var contentPng = document.getElementById('content-home-png');
      var contentJpg = document.getElementById('content-heic-to-jpg');
      var contentAvif = document.getElementById('content-heic-to-avif');

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
        updateSeoBar('/', 'HEIC to PNG Converter', 'HEIC to PNG Converter – Free Online iPhone Photo Converter | HEIC2PNG.site');
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
        updateSeoBar('/heic-to-jpg', 'HEIC to JPG Converter', 'HEIC to JPG Converter – Free Online iPhone Photo to JPEG Tool | HEIC2PNG.site');
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
        updateSeoBar('/heic-to-avif', 'HEIC to AVIF Converter', 'HEIC to AVIF Converter – Modern Web Image Format Tool | HEIC2PNG.site');
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
        wEl.value = 4032;
        hEl.value = 3024;
        sumRes.textContent = 'Keep original resolution';
      } else if (mode === 'scale-50') {
        wEl.value = 2016;
        hEl.value = 1512;
        sumRes.textContent = 'Resized: 2016 × 1512 px';
      } else if (mode === 'web-1920') {
        wEl.value = 1920;
        hEl.value = 1440;
        sumRes.textContent = 'Resized: 1920 × 1440 px';
      } else {
        sumRes.textContent = 'Custom: ' + wEl.value + ' × ' + hEl.value + ' px';
      }
    }

    function handleDimensionInput(axis, val) {
      var num = parseInt(val, 10) || 100;
      var keepRatio = document.getElementById('chk-aspect-ratio').checked;
      var wEl = document.getElementById('input-width-px');
      var hEl = document.getElementById('input-height-px');
      if (keepRatio) {
        if (axis === 'w') {
          hEl.value = Math.round(num * 0.75);
        } else {
          wEl.value = Math.round(num * (4 / 3));
        }
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


