/**
 * ENDURO 2026 - Interactive Script & Google Sheets Connector
 * Handles Form submission, Google Apps Script integration, Local Response Backup,
 * Interactive Slide Deck Modal, Track Tab switching, and UI animations.
 */

// ==========================================================================
// 1. CONFIGURATION: Google Sheets Web App Endpoint
// ==========================================================================
// Replace this with your Google Apps Script Web App URL after deployment:
// e.g., 'https://script.google.com/macros/s/AKfycb.../exec'
let GOOGLE_SHEET_WEB_APP_URL = localStorage.getItem('enduro_google_sheet_url') || '';

const DEFAULT_SLIDES = [
  {
    src: 'assets/Slide Deck for Same Theme (1)-1.jpg',
    title: 'Enduro 2026 Overview',
    desc: 'Annual Technical Workshops in Python, ML & AI in association with Distinguished IIT Professors.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-2.jpg',
    title: 'About the Workshop & Pedagogy',
    desc: 'Empowering students with hands-on lab sessions, corporate projects, and IIT campus experiences.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-3.jpg',
    title: 'Workshop Benefits & Certification',
    desc: 'Direct recognition letters from IIT mentors, certificates of completion, and merit stipends.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-4.jpg',
    title: 'AI & Deep Learning Curriculum',
    desc: 'Mastering neural networks, self-driving architectures, AlphaGo case studies, and Python toolchains.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-5.jpg',
    title: 'Support & Advisory Board',
    desc: 'Eminent leaders from IIT Bombay, Stanford, Google, IISc, IIT Kanpur, IIT Hyderabad & Strategic ERP.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-6.jpg',
    title: 'Entrepreneurship & Personality Development',
    desc: 'The Change Makers seminar, executive public speaking, corporate etiquettes, and interview readiness.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-7.jpg',
    title: 'Roadmap & Subsidized Fee Structure',
    desc: 'Free Phase I online learning followed by Phase II residential program with merit-based waivers.'
  },
  {
    src: 'assets/Slide Deck for Same Theme (1)-8.jpg',
    title: 'Registration & Admissions Pass',
    desc: 'Official admissions portal and QR code for batch registration.'
  }
];

// ==========================================================================
// 2. DOM Ready & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTrackTabs();
  initSlideDeckGallery();
  initFAQAccordion();
  initRegistrationForm();
  initSheetsConfigModal();
  initResponsesViewer();
  initThemeToggle();
  initPhaseAnimations();
  updateSheetsStatusBadge();
});

// ==========================================================================
// 3. Navbar & Smooth Scrolling
// ==========================================================================
function initNavbar() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
    
    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Active Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

// ==========================================================================
// 4. Curriculum Track Tabs
// ==========================================================================
function initTrackTabs() {
  const tabButtons = document.querySelectorAll('.track-tab-btn');
  const panels = document.querySelectorAll('.track-content-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-track');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 5. Slide Deck Gallery & Modal
// ==========================================================================
let currentSlideIndex = 0;

function initSlideDeckGallery() {
  const gallery = document.getElementById('deckPreviewGrid');
  const modal = document.getElementById('slideModal');
  const modalImg = document.getElementById('modalSlideImg');
  const modalTitle = document.getElementById('modalSlideTitle');
  const modalDesc = document.getElementById('modalSlideDesc');
  const modalCounter = document.getElementById('modalSlideCounter');
  const closeBtn = document.getElementById('modalCloseBtn');
  const prevBtn = document.getElementById('modalPrevBtn');
  const nextBtn = document.getElementById('modalNextBtn');

  if (!gallery || !modal) return;

  // Render Slide Thumbnails
  gallery.innerHTML = DEFAULT_SLIDES.map((slide, idx) => `
    <div class="slide-thumbnail-card" data-index="${idx}" tabindex="0" role="button" aria-label="View ${slide.title}">
      <img src="${encodeURI(slide.src)}" alt="${slide.title}" loading="lazy" />
      <div class="slide-overlay-info">
        <span class="slide-number-pill">${idx + 1} of 8</span>
        <h4 class="slide-overlay-title">${slide.title.split(':')[1] || slide.title}</h4>
      </div>
    </div>
  `).join('');

  // Open modal on click
  gallery.querySelectorAll('.slide-thumbnail-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openSlideModal(idx);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openSlideModal(idx);
      }
    });
  });

  function openSlideModal(index) {
    currentSlideIndex = index;
    renderModalSlide();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function renderModalSlide() {
    const slide = DEFAULT_SLIDES[currentSlideIndex];
    if (!slide) return;
    modalImg.src = encodeURI(slide.src);
    modalTitle.textContent = slide.title;
    modalDesc.textContent = slide.desc;
    modalCounter.textContent = `${currentSlideIndex + 1} / ${DEFAULT_SLIDES.length}`;
  }

  function closeSlideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeSlideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSlideModal();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length;
      renderModalSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % DEFAULT_SLIDES.length;
      renderModalSlide();
    });
  }

  // Keyboard navigation for slides
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeSlideModal();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });
}

// ==========================================================================
// 6. FAQ Accordion
// ==========================================================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 7. Google Sheets Registration Form Handler
// ==========================================================================
function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  const feedback = document.getElementById('submissionFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather Form Values
    const formData = {
      timestamp: new Date().toISOString(),
      regId: 'ENDURO-' + Math.floor(100000 + Math.random() * 900000),
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      college: form.college.value.trim(),
      year: form.academicYear.value,
      branch: form.branch.value,
      track: form.trackInterest.value,
      experience: form.experienceLevel.value,
      statement: form.sop.value.trim(),
      linkedin: form.linkedin.value.trim()
    };

    // Client-side validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.college) {
      showFeedback('Please fill in all mandatory fields marked with an asterisk (*).', 'error');
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    showFeedback('<span class="spinner"></span> Transmitting application securely...', 'loading');

    let sheetSaved = false;

    // 1. If Google Sheet URL is configured, send via POST request
    if (GOOGLE_SHEET_WEB_APP_URL) {
      try {
        // We use URLSearchParams or form-data with mode: 'no-cors' for Apps Script Web App
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(formData)) {
          params.append(key, value);
        }

        await fetch(GOOGLE_SHEET_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        sheetSaved = true;
      } catch (err) {
        console.warn('Google Sheets Web App dispatch encountered an error, falling back to local store:', err);
      }
    }

    // 2. Always persist safely in browser LocalStorage
    saveResponseLocally(formData);

    // Reset button state
    submitBtn.disabled = false;
    form.reset();

    // 3. Show Success Ticket & Feedback
    const noteText = sheetSaved 
      ? 'Your application has been synced to Google Sheets and secured in the registry!'
      : 'Application recorded! (Stored safely in local registry. Connect Google Sheet URL to enable live spreadsheet sync).';

    showSuccessModal(formData, noteText);
    showFeedback('✓ Registration successfully submitted!', 'success');
  });

  function showFeedback(html, type) {
    if (!feedback) return;
    feedback.className = `submission-feedback ${type}`;
    feedback.innerHTML = html;
    feedback.style.display = 'block';
  }
}

// Local Storage Helper
function saveResponseLocally(data) {
  try {
    const list = JSON.parse(localStorage.getItem('enduro_registrations') || '[]');
    list.unshift(data);
    localStorage.setItem('enduro_registrations', JSON.stringify(list));
    updateResponsesCount();
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

// ==========================================================================
// 8. Success Ticket Modal
// ==========================================================================
function showSuccessModal(data, extraNote) {
  const modal = document.getElementById('successModal');
  if (!modal) return;

  document.getElementById('ticketCandidateName').textContent = data.fullName;
  document.getElementById('ticketRegId').textContent = data.regId;
  document.getElementById('ticketTrack').textContent = data.track;
  document.getElementById('ticketCollege').textContent = data.college;
  document.getElementById('ticketNote').textContent = extraNote;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('ticketCloseBtn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
}

// ==========================================================================
// 9. Google Sheets Connector Configuration Modal
// ==========================================================================
function initSheetsConfigModal() {
  const openBtn = document.getElementById('openSheetsConfigBtn');
  const modal = document.getElementById('sheetsConfigModal');
  const closeBtn = document.getElementById('closeSheetsConfigBtn');
  const saveBtn = document.getElementById('saveSheetUrlBtn');
  const input = document.getElementById('googleSheetUrlInput');
  const copyScriptBtn = document.getElementById('copyScriptBtn');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      input.value = GOOGLE_SHEET_WEB_APP_URL;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const url = input.value.trim();
      GOOGLE_SHEET_WEB_APP_URL = url;
      localStorage.setItem('enduro_google_sheet_url', url);
      updateSheetsStatusBadge();
      alert('Google Sheet Web App URL updated successfully!');
      closeModal();
    });
  }

  if (copyScriptBtn) {
    copyScriptBtn.addEventListener('click', () => {
      const scriptCode = document.getElementById('appsScriptCodeBlock').innerText;
      navigator.clipboard.writeText(scriptCode).then(() => {
        copyScriptBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => copyScriptBtn.textContent = 'Copy Script Code', 2500);
      });
    });
  }
}

function updateSheetsStatusBadge() {
  const badge = document.getElementById('sheetsStatusBadge');
  if (!badge) return;
  if (GOOGLE_SHEET_WEB_APP_URL) {
    badge.className = 'sheets-badge connected';
    badge.innerHTML = '<span class="pulse-dot"></span> Live Google Sheet Connected';
  } else {
    badge.className = 'sheets-badge local-mode';
    badge.innerHTML = '● Local Storage Ready (Click to Connect Sheet)';
  }
}

// ==========================================================================
// 10. Offline / Stored Responses Admin Modal & CSV Export
// ==========================================================================
function initResponsesViewer() {
  const viewBtn = document.getElementById('viewResponsesBtn');
  const modal = document.getElementById('responsesModal');
  const closeBtn = document.getElementById('closeResponsesBtn');
  const exportBtn = document.getElementById('exportCsvBtn');
  const clearBtn = document.getElementById('clearResponsesBtn');

  if (!modal) return;

  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      renderResponsesTable();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', exportResponsesToCSV);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all locally cached responses?')) {
        localStorage.removeItem('enduro_registrations');
        renderResponsesTable();
        updateResponsesCount();
      }
    });
  }

  updateResponsesCount();
}

function renderResponsesTable() {
  const tbody = document.getElementById('responsesTableBody');
  const countSpan = document.getElementById('totalResponsesCount');
  if (!tbody) return;

  const responses = JSON.parse(localStorage.getItem('enduro_registrations') || '[]');
  if (countSpan) countSpan.textContent = responses.length;

  if (responses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No candidate registrations recorded yet. Submit a test form below!</td></tr>`;
    return;
  }

  tbody.innerHTML = responses.map((r, i) => `
    <tr>
      <td><strong>${r.regId || ('#' + (i + 1))}</strong></td>
      <td>${escapeHTML(r.fullName)}</td>
      <td>${escapeHTML(r.email)}</td>
      <td>${escapeHTML(r.phone)}</td>
      <td>${escapeHTML(r.college)}</td>
      <td><span class="assoc-chip">${escapeHTML(r.track)}</span></td>
    </tr>
  `).join('');
}

function updateResponsesCount() {
  const badge = document.getElementById('responsesCountBadge');
  if (!badge) return;
  const responses = JSON.parse(localStorage.getItem('enduro_registrations') || '[]');
  badge.textContent = `${responses.length} stored`;
}

function exportResponsesToCSV() {
  const responses = JSON.parse(localStorage.getItem('enduro_registrations') || '[]');
  if (responses.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = ['Timestamp', 'Reg ID', 'Full Name', 'Email', 'Phone', 'College', 'Year', 'Branch', 'Track', 'Experience', 'Statement', 'LinkedIn'];
  const rows = responses.map(r => [
    `"${r.timestamp || ''}"`,
    `"${r.regId || ''}"`,
    `"${(r.fullName || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.college || '').replace(/"/g, '""')}"`,
    `"${(r.year || '').replace(/"/g, '""')}"`,
    `"${(r.branch || '').replace(/"/g, '""')}"`,
    `"${(r.track || '').replace(/"/g, '""')}"`,
    `"${(r.experience || '').replace(/"/g, '""')}"`,
    `"${(r.statement || '').replace(/"/g, '""')}"`,
    `"${(r.linkedin || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `enduro_2026_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// 11. Theme Toggle (Warm Dark / Light mode)
// ==========================================================================
function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  const savedTheme = localStorage.getItem('enduro_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    btn.innerHTML = '🌙';
  } else {
    btn.innerHTML = '☀️';
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('enduro_theme', isLight ? 'light' : 'dark');
    btn.innerHTML = isLight ? '🌙' : '☀️';
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================================================
// 12. Phase Cards & Points Entrance Animations
// ==========================================================================
function initPhaseAnimations() {
  const cards = document.querySelectorAll('[data-animate="phase-card"]');
  if (!cards.length) return;

  // Immediate check for elements already in viewport
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      card.classList.add('in-view');
    }
  });

  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  cards.forEach(card => {
    if (!card.classList.contains('in-view')) {
      observer.observe(card);
    }
  });
}
