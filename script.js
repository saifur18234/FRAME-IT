/**
 * =============================================================================
 * FRAME IT ATELIER — Master Interactive Script
 * Timestamp: 2026-11-11 02:48
 * Architecture:
 *   [JS FEATURE 01] Darkroom Engine (Upload, Presets, Sliders, Live Preview)
 *   [JS FEATURE 02] High-Resolution Framed Canvas Export & Download
 *   [JS FEATURE 03] Portfolio Category Filtering System
 *   [JS FEATURE 04] Fullscreen Darkroom Lightbox Viewer
 *   [JS FEATURE 05] Bespoke Package Selector & Booking Automation
 *   [JS FEATURE 06] Client Commission Form Validation & Feedback
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===========================================================================
  // [JS FEATURE 01] Darkroom Engine State & Controls | Added: 2026-11-11 02:48
  // ===========================================================================
  const darkroomState = {
    exposure: 100, // 60 - 140
    contrast: 115, // 70 - 180
    warmth: 25,    // 0 - 80 (sepia %)
    grain: 30,     // 0 - 100 (%)
    vignette: 40,  // 0 - 100 (%)
    frameStyle: 'frame-passepartout',
    activePreset: 'obsidian',
    imageLoaded: false
  };

  // DOM Elements
  const previewImg = document.getElementById('editorPreviewImg');
  const grainLayer = document.getElementById('editorGrainLayer');
  const vignetteLayer = document.getElementById('editorVignetteLayer');
  const frameContainer = document.getElementById('editorFrameContainer');
  const imprintMeta = document.getElementById('imprintMeta');
  const dropZone = document.getElementById('dropZone');
  const photoUploadInput = document.getElementById('photoUploadInput');

  // Slider Inputs & Value Displays
  const inputExposure = document.getElementById('inputExposure');
  const inputContrast = document.getElementById('inputContrast');
  const inputWarmth = document.getElementById('inputWarmth');
  const inputGrain = document.getElementById('inputGrain');
  const inputVignette = document.getElementById('inputVignette');

  const valExposure = document.getElementById('valExposure');
  const valContrast = document.getElementById('valContrast');
  const valWarmth = document.getElementById('valWarmth');
  const valGrain = document.getElementById('valGrain');
  const valVignette = document.getElementById('valVignette');

  // Preset Configurations
  const presets = {
    obsidian: { exposure: 100, contrast: 115, warmth: 25, grain: 30, vignette: 40 },
    noir: { exposure: 95, contrast: 140, warmth: 0, grain: 45, vignette: 60, grayscale: true },
    silver: { exposure: 105, contrast: 125, warmth: 10, grain: 50, vignette: 30 },
    amber: { exposure: 100, contrast: 110, warmth: 60, grain: 25, vignette: 45 },
    raw: { exposure: 100, contrast: 100, warmth: 0, grain: 0, vignette: 0 }
  };

  /**
   * Applies the current darkroom state to the live preview layers
   */
  function applyLiveFilters() {
    if (!previewImg) return;

    let filterStr = `brightness(${darkroomState.exposure}%) contrast(${darkroomState.contrast}%)`;
    if (darkroomState.activePreset === 'noir') {
      filterStr += ` grayscale(100%)`;
    } else if (darkroomState.warmth > 0) {
      filterStr += ` sepia(${darkroomState.warmth}%)`;
    }

    previewImg.style.filter = filterStr;

    if (grainLayer) {
      grainLayer.style.opacity = (darkroomState.grain / 100) * 0.7;
    }

    if (vignetteLayer) {
      vignetteLayer.style.opacity = darkroomState.vignette / 100;
    }
  }

  /**
   * Synchronizes slider inputs and displays with state values
   */
  function syncSliders() {
    if (inputExposure) { inputExposure.value = darkroomState.exposure; valExposure.textContent = `${darkroomState.exposure}%`; }
    if (inputContrast) { inputContrast.value = darkroomState.contrast; valContrast.textContent = `${darkroomState.contrast}%`; }
    if (inputWarmth) { inputWarmth.value = darkroomState.warmth; valWarmth.textContent = `${darkroomState.warmth}%`; }
    if (inputGrain) { inputGrain.value = darkroomState.grain; valGrain.textContent = `${darkroomState.grain}%`; }
    if (inputVignette) { inputVignette.value = darkroomState.vignette; valVignette.textContent = `${darkroomState.vignette}%`; }
  }

  // Slider Event Listeners
  if (inputExposure) {
    inputExposure.addEventListener('input', (e) => {
      darkroomState.exposure = parseInt(e.target.value, 10);
      valExposure.textContent = `${darkroomState.exposure}%`;
      applyLiveFilters();
    });
  }

  if (inputContrast) {
    inputContrast.addEventListener('input', (e) => {
      darkroomState.contrast = parseInt(e.target.value, 10);
      valContrast.textContent = `${darkroomState.contrast}%`;
      applyLiveFilters();
    });
  }

  if (inputWarmth) {
    inputWarmth.addEventListener('input', (e) => {
      darkroomState.warmth = parseInt(e.target.value, 10);
      valWarmth.textContent = `${darkroomState.warmth}%`;
      applyLiveFilters();
    });
  }

  if (inputGrain) {
    inputGrain.addEventListener('input', (e) => {
      darkroomState.grain = parseInt(e.target.value, 10);
      valGrain.textContent = `${darkroomState.grain}%`;
      applyLiveFilters();
    });
  }

  if (inputVignette) {
    inputVignette.addEventListener('input', (e) => {
      darkroomState.vignette = parseInt(e.target.value, 10);
      valVignette.textContent = `${darkroomState.vignette}%`;
      applyLiveFilters();
    });
  }

  // Preset Buttons
  const presetButtons = document.querySelectorAll('.preset-pill');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.dataset.preset;
      darkroomState.activePreset = presetKey;
      if (presets[presetKey]) {
        Object.assign(darkroomState, presets[presetKey]);
        syncSliders();
        applyLiveFilters();
      }
    });
  });

  // Sample Plates Selector
  const sampleButtons = document.querySelectorAll('.sample-btn');
  sampleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sampleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const newSrc = btn.dataset.img;
      if (previewImg && newSrc) {
        previewImg.src = newSrc;
      }
    });
  });

  // File Upload Handling
  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (previewImg) {
            previewImg.src = event.target.result;
            sampleButtons.forEach(b => b.classList.remove('active'));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Drag and Drop support on Darkroom Dropzone
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-active');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (previewImg) {
            previewImg.src = event.target.result;
            sampleButtons.forEach(b => b.classList.remove('active'));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Bespoke Frame Style Selection
  const frameButtons = document.querySelectorAll('.frame-btn');
  frameButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      frameButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const frameClass = btn.dataset.frame;
      darkroomState.frameStyle = frameClass;

      if (frameContainer) {
        frameContainer.className = `editor-frame-container ${frameClass}`;
      }

      if (imprintMeta) {
        if (frameClass === 'frame-gallery') {
          imprintMeta.textContent = 'EXHIBITION ARCHIVE NO. 07 · SALON 2026';
        } else if (frameClass === 'frame-minimal') {
          imprintMeta.textContent = 'FINE LINE MONOGRAPH · 1/1';
        } else {
          imprintMeta.textContent = 'OBSIDIAN ARCHIVE · 2026';
        }
      }
    });
  });

  // Reset Controls Button
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      darkroomState.activePreset = 'obsidian';
      Object.assign(darkroomState, presets.obsidian);
      presetButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.preset === 'obsidian');
      });
      syncSliders();
      applyLiveFilters();
    });
  }

  // ===========================================================================
  // [JS FEATURE 02] High-Resolution Framed Canvas Export | Added: 2026-11-11 02:48
  // ===========================================================================
  const btnDownload = document.getElementById('btnDownload');
  const darkroomCanvas = document.getElementById('darkroomCanvas');

  if (btnDownload && darkroomCanvas && previewImg) {
    btnDownload.addEventListener('click', () => {
      btnDownload.textContent = 'Rendering Frame...';

      const exportImg = new Image();
      exportImg.crossOrigin = 'anonymous';

      exportImg.onload = () => {
        const ctx = darkroomCanvas.getContext('2d');
        const targetWidth = 1400;
        const targetHeight = 1750; // 4:5 fine art aspect ratio
        darkroomCanvas.width = targetWidth;
        darkroomCanvas.height = targetHeight;

        // 1. Draw Frame Background
        if (darkroomState.frameStyle === 'frame-gallery') {
          ctx.fillStyle = '#161513';
        } else if (darkroomState.frameStyle === 'frame-minimal') {
          ctx.fillStyle = '#0c0b0a';
        } else {
          ctx.fillStyle = '#11100e';
        }
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // 2. Compute inner image dimensions
        let borderPadding = 120;
        let bottomPadding = 180;
        if (darkroomState.frameStyle === 'frame-gallery') {
          borderPadding = 180;
          bottomPadding = 240;
        } else if (darkroomState.frameStyle === 'frame-minimal') {
          borderPadding = 60;
          bottomPadding = 100;
        } else if (darkroomState.frameStyle === 'frame-raw') {
          borderPadding = 0;
          bottomPadding = 0;
        }

        const innerW = targetWidth - (borderPadding * 2);
        const innerH = targetHeight - borderPadding - bottomPadding;

        // 3. Draw filtered image to canvas using ctx.filter
        ctx.save();
        let filterStr = `brightness(${darkroomState.exposure}%) contrast(${darkroomState.contrast}%)`;
        if (darkroomState.activePreset === 'noir') {
          filterStr += ` grayscale(100%)`;
        } else if (darkroomState.warmth > 0) {
          filterStr += ` sepia(${darkroomState.warmth}%)`;
        }
        ctx.filter = filterStr;

        // Calculate aspect crop
        const imgAspect = exportImg.width / exportImg.height;
        const targetAspect = innerW / innerH;
        let sWidth, sHeight, sx, sy;

        if (imgAspect > targetAspect) {
          sHeight = exportImg.height;
          sWidth = exportImg.height * targetAspect;
          sx = (exportImg.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = exportImg.width;
          sHeight = exportImg.width / targetAspect;
          sx = 0;
          sy = (exportImg.height - sHeight) / 2;
        }

        ctx.drawImage(exportImg, sx, sy, sWidth, sHeight, borderPadding, borderPadding, innerW, innerH);
        ctx.restore();

        // 4. Draw Vignette & Fine Grain overlay on canvas
        if (darkroomState.vignette > 0 && borderPadding > 0) {
          ctx.save();
          const grad = ctx.createRadialGradient(
            borderPadding + innerW / 2,
            borderPadding + innerH / 2,
            innerW * 0.25,
            borderPadding + innerW / 2,
            borderPadding + innerH / 2,
            innerW * 0.75
          );
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, `rgba(0,0,0,${(darkroomState.vignette / 100) * 0.85})`);
          ctx.fillStyle = grad;
          ctx.fillRect(borderPadding, borderPadding, innerW, innerH);
          ctx.restore();
        }

        // 5. Draw Gold Frame Accents & Typography Imprint
        if (darkroomState.frameStyle !== 'frame-raw') {
          ctx.save();
          ctx.strokeStyle = '#cbb493';
          ctx.lineWidth = 2;
          ctx.strokeRect(borderPadding - 10, borderPadding - 10, innerW + 20, innerH + 20);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#cbb493';
          ctx.font = '500 24px "Cormorant Garamond", Georgia, serif';
          ctx.fillText('FRAME IT ATELIER', targetWidth / 2, targetHeight - 85);

          ctx.fillStyle = '#aba497';
          ctx.font = '12px "DM Sans", sans-serif';
          ctx.letterSpacing = '3px';
          ctx.fillText('OBSIDIAN ARCHIVE · FINE ART STUDY', targetWidth / 2, targetHeight - 55);
          ctx.restore();
        }

        // 6. Trigger Download
        try {
          const dataUrl = darkroomCanvas.toDataURL('image/png');
          const downloadAnchor = document.createElement('a');
          downloadAnchor.download = `FrameIt-Atelier-${Date.now()}.png`;
          downloadAnchor.href = dataUrl;
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          document.body.removeChild(downloadAnchor);
        } catch (err) {
          console.warn('Canvas export tainted by cross-origin resource. Opening view in new tab instead.', err);
          alert('Artwork rendered! For custom high-resolution downloads, upload your own photograph.');
        } finally {
          btnDownload.textContent = 'Download Framed Artwork';
        }
      };

      exportImg.onerror = () => {
        btnDownload.textContent = 'Download Framed Artwork';
        alert('Could not render image. Please try uploading a local image file.');
      };

      exportImg.src = previewImg.src;
    });
  }

  // Initialize filters on load
  applyLiveFilters();

  // ===========================================================================
  // [JS FEATURE 03] Portfolio Category Filtering | Added: 2026-11-11 02:48
  // ===========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.dataset.category;

      portfolioCards.forEach((card) => {
        const cardCat = card.dataset.category;
        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ===========================================================================
  // [JS FEATURE 04] Fullscreen Darkroom Lightbox | Added: 2026-11-11 02:48
  // ===========================================================================
  const lightboxModal = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCamera = document.getElementById('lightboxCamera');
  const lightboxClose = document.getElementById('lightboxClose');

  portfolioCards.forEach((card) => {
    card.addEventListener('click', () => {
      const cardImg = card.querySelector('img');
      const title = card.dataset.title || 'Studio Study';
      const camera = card.dataset.camera || 'Archival Photographic Plate';

      if (lightboxModal && lightboxImg) {
        lightboxImg.src = cardImg ? cardImg.src : '';
        lightboxTitle.textContent = title;
        lightboxCamera.textContent = camera;
        lightboxModal.classList.add('is-active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('is-active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    const backdrop = lightboxModal.querySelector('.lightbox-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeLightbox);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ===========================================================================
  // [JS FEATURE 05] Bespoke Package Selector Automation | Added: 2026-11-11 02:48
  // ===========================================================================
  const packageButtons = document.querySelectorAll('.select-package-btn');
  const commissionSelect = document.getElementById('commissionType');

  packageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const packageName = btn.dataset.package;
      if (commissionSelect && packageName) {
        for (let i = 0; i < commissionSelect.options.length; i++) {
          if (commissionSelect.options[i].value.includes(packageName)) {
            commissionSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // ===========================================================================
  // [JS FEATURE 06] Client Commission Form Interaction | Added: 2026-11-11 02:48
  // ===========================================================================
  const inquiryForm = document.getElementById('inquiryForm');
  const formSuccessBanner = document.getElementById('formSuccessMessage');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('.submit-btn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting Inquiry...</span>';
      }

      setTimeout(() => {
        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'block';
        }
        if (submitBtn) {
          submitBtn.style.display = 'none';
        }
        inquiryForm.reset();
      }, 700);
    });
  }

});
