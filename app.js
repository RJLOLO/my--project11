(function() {
  'use strict';

  // ===== State =====
  const state = {
    template: 'compact',
    buttonStyle: 'rounded',
    color: 'yellow',
    theme: 'warm',
    title: '主标题文案',
    subtitle: '副标题文案',
    icon: null,
    iconSrc: null,
    iconX: 72,
    iconY: 15,
    iconSize: 100,
    iconRotation: 0,
    bgSrc: null,
    backgrounds: {
      compact: {
        yellow: 'linear-gradient(135deg, #ffd21c 0%, #ffb347 100%)',
        blue: 'linear-gradient(135deg, #62c8f3 0%, #a78bfa 100%)'
      },
      wide: {
        yellow: 'linear-gradient(135deg, #ffd21c 0%, #ffb347 100%)',
        blue: 'linear-gradient(135deg, #62c8f3 0%, #a78bfa 100%)'
      }
    }
  };

  // ===== Dimensions =====
  const DIMS = {
    compact: { width: 640, height: 272, label: '紧凑 · 640 × 272' },
    wide: { width: 640, height: 352, label: '宽版 · 640 × 352' }
  };

  // ===== DOM Refs =====
  const $ = id => document.getElementById(id);

  const els = {};
  function cacheEls() {
    els.specPill = $('specPill');
    els.scaleLabel = $('scaleLabel');
    els.previewFrame = $('previewFrame');
    els.cardPreview = $('cardPreview');
    els.cardTitle = $('cardTitle');
    els.cardSubtitle = $('cardSubtitle');
    els.cardIcon = $('cardIcon');
    els.iconGuide = $('iconGuide');
    els.measurementRow = $('measurementRow');
    els.titleInput = $('titleInput');
    els.subtitleInput = $('subtitleInput');
    els.iconDropZone = $('iconDropZone');
    els.iconFileInput = $('iconFileInput');
    els.iconFileName = $('iconFileName');
    els.iconAdjustments = $('iconAdjustments');
    els.iconXRange = $('iconXRange');
    els.iconYRange = $('iconYRange');
    els.iconSizeRange = $('iconSizeRange');
    els.iconRotateRange = $('iconRotateRange');
    els.iconXOutput = $('iconXOutput');
    els.iconYOutput = $('iconYOutput');
    els.iconSizeOutput = $('iconSizeOutput');
    els.iconRotateOutput = $('iconRotateOutput');
    els.bgDropZone = $('bgDropZone');
    els.bgFileInput = $('bgFileInput');
    els.bgFileName = $('bgFileName');
    els.exportBtn = $('exportBtn');
    els.themeToggle = $('themeToggle');
    els.refLabel = $('refLabel');
    els.refCurrentSize = $('refCurrentSize');
    els.refPreviewFrame = $('refPreviewFrame');
    els.refComparisonVisual = $('refComparisonVisual');
    els.refMiniCard = $('refMiniCard');
    els.refMiniCopy = $('refMiniCopy');
    els.refMiniTitle = $('refMiniTitle');
    els.refMiniSubtitle = $('refMiniSubtitle');
    els.refMiniIcon = $('refMiniIcon');
    els.cardCopy = $('cardCopy');
  }

  // ===== Init =====
  function init() {
    cacheEls();
    bindEvents();
    updateCardBg();
    updatePreview();
    updateReference();
  }

  // ===== Template Switch =====
  window.switchTemplate = function(template) {
    state.template = template;
    const dim = DIMS[template];

    document.querySelectorAll('.template-switcher button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === template);
    });

    els.specPill.textContent = dim.label;
    els.previewFrame.className = 'preview-frame ' + template;
    els.cardPreview.className = 'card-preview ' + template;

    const scale = template === 'compact' ? 0.82 : 0.82;
    els.cardPreview.style.transform = `scale(${scale})`;
    els.scaleLabel.textContent = Math.round(scale * 100) + '%';

    els.measurementRow.innerHTML = `<span><i></i> ${dim.width} × ${dim.height} px</span><span>${template.toUpperCase()}</span>`;

    els.refPreviewFrame.className = 'reference-preview-frame ' + template;
    els.refComparisonVisual.className = 'comparison-visual' + (template === 'wide' ? ' wide' : '');
    els.refMiniCopy.className = 'mini-copy ' + template;
    els.refLabel.textContent = '当前: ' + template.toUpperCase();
    els.refCurrentSize.textContent = `${dim.width} × ${dim.height}`;

    updateCardBg();
    updateIconPosition();
  };

  // ===== Button Style =====
  window.switchButtonStyle = function(style) {
    state.buttonStyle = style;
    document.querySelectorAll('.button-style-switcher button[data-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.style === style);
    });
  };

  // ===== Color Switch =====
  window.switchColor = function(color) {
    state.color = color;
    document.querySelectorAll('.button-style-switcher button[data-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
    updateCardBg();
  };

  // ===== Theme Toggle =====
  function toggleTheme() {
    state.theme = state.theme === 'warm' ? 'cool' : 'warm';
    if (state.theme === 'cool') {
      document.body.classList.add('theme-cool');
    } else {
      document.body.classList.remove('theme-cool');
    }
    els.themeToggle.querySelector('.theme-icon').textContent = state.theme === 'warm' ? '◐' : '◑';
  }

  // ===== Card Background =====
  function updateCardBg() {
    if (state.bgSrc) {
      els.cardPreview.style.backgroundImage = `url(${state.bgSrc})`;
      els.refMiniCard.style.backgroundImage = `url(${state.bgSrc})`;
    } else {
      const bg = state.backgrounds[state.template][state.color];
      els.cardPreview.style.background = bg;
      els.cardPreview.style.backgroundImage = '';

      if (!state.bgSrc) {
        els.refMiniCard.style.background = bg;
        els.refMiniCard.style.backgroundImage = '';
      }
    }
  }

  // ===== Text Inputs =====
  function onTitleInput(e) {
    state.title = e.target.value;
    els.cardTitle.textContent = state.title;
    els.refMiniTitle.textContent = state.title;
  }

  function onSubtitleInput(e) {
    state.subtitle = e.target.value;
    els.cardSubtitle.textContent = state.subtitle;
    els.refMiniSubtitle.textContent = state.subtitle;
  }

  // ===== File Upload =====
  function setupDropZone(dropZone, fileInput, type) {
    dropZone.addEventListener('click', (e) => {
      if (e.target.closest('.choose-button')) return;
      fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFile(file, type);
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file, type);
    });
  }

  function handleFile(file, type) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      if (type === 'icon') {
        state.iconSrc = src;
        state.icon = new Image();
        state.icon.onload = () => {
          els.cardIcon.src = src;
          els.cardIcon.style.display = 'block';
          els.iconFileName.textContent = file.name;
          els.iconAdjustments.style.display = 'block';
          updateIconPosition();
          updateReference();
        };
        state.icon.src = src;
      } else if (type === 'bg') {
        state.bgSrc = src;
        els.bgFileName.textContent = file.name;
        updateCardBg();
      }
    };
    reader.readAsDataURL(file);
  }

  // ===== Icon Position & Adjustments =====
  function updateIconPosition() {
    if (!state.iconSrc) return;

    const dim = DIMS[state.template];
    const baseIconHeight = dim.compact ? 120 : 160;
    const iconHeight = state.template === 'compact' ? 120 : 160;
    const adjustedHeight = iconHeight * (state.iconSize / 100);

    const xPercent = state.iconX / 100;
    const yPercent = state.iconY / 100;

    const maxX = dim.width - (adjustedHeight * 0.5);
    const maxY = dim.height - adjustedHeight;

    const left = xPercent * maxX;
    const top = yPercent * maxY;

    els.cardIcon.style.height = adjustedHeight + 'px';
    els.cardIcon.style.left = left + 'px';
    els.cardIcon.style.top = top + 'px';
    els.cardIcon.style.transform = `rotate(${state.iconRotation}deg)`;

    els.iconXOutput.textContent = state.iconX + '%';
    els.iconYOutput.textContent = state.iconY + '%';
    els.iconSizeOutput.textContent = state.iconSize + '%';
    els.iconRotateOutput.textContent = state.iconRotation + '°';

    els.iconXRange.value = state.iconX;
    els.iconYRange.value = state.iconY;
    els.iconSizeRange.value = state.iconSize;
    els.iconRotateRange.value = state.iconRotation;

    updateReferenceIcon(adjustedHeight, left, top);
  }

  function updateReferenceIcon(iconHeight, left, top) {
    if (!state.iconSrc) {
      els.refMiniIcon.style.display = 'none';
      return;
    }

    const dim = DIMS[state.template];
    const refFrame = els.refPreviewFrame.getBoundingClientRect();
    const scaleRatio = refFrame.width / dim.width;

    els.refMiniIcon.src = state.iconSrc;
    els.refMiniIcon.style.display = 'block';
    els.refMiniIcon.style.height = (iconHeight * scaleRatio) + 'px';
    els.refMiniIcon.style.left = (left * scaleRatio) + 'px';
    els.refMiniIcon.style.top = (top * scaleRatio) + 'px';
    els.refMiniIcon.style.transform = `rotate(${state.iconRotation}deg)`;
  }

  function onRangeChange(type, e) {
    const val = parseInt(e.target.value);
    switch(type) {
      case 'x': state.iconX = val; break;
      case 'y': state.iconY = val; break;
      case 'size': state.iconSize = val; break;
      case 'rotate': state.iconRotation = val; break;
    }
    updateIconPosition();
  }

  // ===== Icon Drag =====
  function setupIconDrag() {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    els.cardIcon.addEventListener('mousedown', startDrag);
    els.cardIcon.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      els.cardIcon.classList.add('dragging');

      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      startLeft = parseFloat(els.cardIcon.style.left) || 0;
      startTop = parseFloat(els.cardIcon.style.top) || 0;

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();

      const point = e.touches ? e.touches[0] : e;
      const scale = 0.82;
      const dx = (point.clientX - startX) / scale;
      const dy = (point.clientY - startY) / scale;

      const dim = DIMS[state.template];
      const iconHeight = parseFloat(els.cardIcon.style.height) || 120;
      const maxX = dim.width - iconHeight * 0.5;
      const maxY = dim.height - iconHeight;

      const newLeft = Math.max(0, Math.min(maxX, startLeft + dx));
      const newTop = Math.max(0, Math.min(maxY, startTop + dy));

      els.cardIcon.style.left = newLeft + 'px';
      els.cardIcon.style.top = newTop + 'px';

      state.iconX = Math.round((newLeft / maxX) * 100);
      state.iconY = Math.round((newTop / maxY) * 100);

      els.iconXOutput.textContent = state.iconX + '%';
      els.iconYOutput.textContent = state.iconY + '%';
      els.iconXRange.value = state.iconX;
      els.iconYRange.value = state.iconY;

      updateReference();
    }

    function endDrag() {
      isDragging = false;
      els.cardIcon.classList.remove('dragging');
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
    }
  }

  // ===== Update Preview =====
  function updatePreview() {
    els.cardTitle.textContent = state.title;
    els.cardSubtitle.textContent = state.subtitle;
  }

  // ===== Update Reference =====
  function updateReference() {
    els.refMiniTitle.textContent = state.title;
    els.refMiniSubtitle.textContent = state.subtitle;

    if (state.iconSrc) {
      const dim = DIMS[state.template];
      const refFrame = els.refPreviewFrame.getBoundingClientRect();
      const scaleRatio = refFrame.width / dim.width;

      const iconHeight = (state.template === 'compact' ? 120 : 160) * (state.iconSize / 100);
      const maxX = dim.width - iconHeight * 0.5;
      const maxY = dim.height - iconHeight;
      const left = (state.iconX / 100) * maxX;
      const top = (state.iconY / 100) * maxY;

      els.refMiniIcon.src = state.iconSrc;
      els.refMiniIcon.style.display = 'block';
      els.refMiniIcon.style.height = (iconHeight * scaleRatio) + 'px';
      els.refMiniIcon.style.left = (left * scaleRatio) + 'px';
      els.refMiniIcon.style.top = (top * scaleRatio) + 'px';
      els.refMiniIcon.style.transform = `rotate(${state.iconRotation}deg)`;
    }
  }

  // ===== Export =====
  window.exportCard = async function() {
    const dim = DIMS[state.template];
    const canvas = document.createElement('canvas');
    canvas.width = dim.width;
    canvas.height = dim.height;
    const ctx = canvas.getContext('2d');

    // Draw background
    if (state.bgSrc) {
      await drawImage(ctx, state.bgSrc, 0, 0, dim.width, dim.height);
    } else {
      const colors = {
        yellow: [['#ffd21c', 0], ['#ffb347', 1]],
        blue: [['#62c8f3', 0], ['#a78bfa', 1]]
      };
      const c = colors[state.color];
      const gradient = ctx.createLinearGradient(0, 0, dim.width, dim.height);
      gradient.addColorStop(c[0][1], c[0][0]);
      gradient.addColorStop(c[1][1], c[1][0]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dim.width, dim.height);
    }

    // Draw text
    ctx.fillStyle = '#181c23';
    const titleSize = state.template === 'compact' ? 56 : 52;
    ctx.font = `400 ${titleSize}px "Alimama ShuHeiTi", -apple-system, "PingFang SC", sans-serif`;
    const titleY = state.template === 'compact' ? 68 + titleSize : 55 + titleSize;
    ctx.fillText(state.title, 64, titleY);

    ctx.fillStyle = state.template === 'compact' ? '#62666f' : '#66686d';
    const subSize = state.template === 'compact' ? 48 : 40;
    ctx.font = `400 ${subSize}px "Alibaba PuHuiTi", -apple-system, "PingFang SC", sans-serif`;
    const subY = state.template === 'compact' ? 86 + 68 + subSize : 90 + 55 + subSize;
    ctx.fillText(state.subtitle, 64, subY > dim.height ? dim.height - 20 : subY);

    // Draw icon
    if (state.iconSrc) {
      const iconHeight = (state.template === 'compact' ? 120 : 160) * (state.iconSize / 100);
      const maxX = dim.width - iconHeight * 0.5;
      const maxY = dim.height - iconHeight;
      const left = (state.iconX / 100) * maxX;
      const top = (state.iconY / 100) * maxY;

      const img = await loadImage(state.iconSrc);
      const aspect = img.width / img.height;
      const iconWidth = iconHeight * aspect;

      ctx.save();
      ctx.translate(left + iconWidth / 2, top + iconHeight / 2);
      ctx.rotate(state.iconRotation * Math.PI / 180);
      ctx.drawImage(img, -iconWidth / 2, -iconHeight / 2, iconWidth, iconHeight);
      ctx.restore();
    }

    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `card-${state.template}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  async function drawImage(ctx, src, x, y, w, h) {
    const img = await loadImage(src);
    ctx.drawImage(img, x, y, w, h);
  }

  // ===== Bind Events =====
  function bindEvents() {
    els.titleInput.addEventListener('input', onTitleInput);
    els.subtitleInput.addEventListener('input', onSubtitleInput);

    els.themeToggle.addEventListener('click', toggleTheme);

    setupDropZone(els.iconDropZone, els.iconFileInput, 'icon');
    setupDropZone(els.bgDropZone, els.bgFileInput, 'bg');

    els.iconXRange.addEventListener('input', (e) => onRangeChange('x', e));
    els.iconYRange.addEventListener('input', (e) => onRangeChange('y', e));
    els.iconSizeRange.addEventListener('input', (e) => onRangeChange('size', e));
    els.iconRotateRange.addEventListener('input', (e) => onRangeChange('rotate', e));

    setupIconDrag();

    window.addEventListener('resize', () => {
      if (state.iconSrc) updateReference();
    });
  }

  // ===== Start =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
