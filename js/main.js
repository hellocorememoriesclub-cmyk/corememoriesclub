// Core Memories Club — site behaviour

function slugify(s) {
  return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'trip';
}

// Adds a small "Itinerary PDF" link into any .pkg-card whose title has an uploaded trip document.
function attachTripDocLinks() {
  const cards = document.querySelectorAll('.pkg-card h3');
  if (!cards.length) return;
  fetch('/api/trip-docs')
    .then(res => res.json())
    .then(tripDocs => {
      cards.forEach(h3 => {
        const card = h3.closest('.pkg-card');
        if (!card || card.tagName === 'A') return; // skip cards that are themselves links (e.g. Previous Trips) — no nested <a>
        const title = h3.textContent.trim();
        const entry = tripDocs[slugify(title)];
        const doc = entry && entry.docs && entry.docs[0];
        if (!doc) return;
        const body = h3.closest('.pkg-body');
        if (!body || body.querySelector('.pkg-doc-link')) return;
        const link = document.createElement('a');
        link.href = '/' + doc.path;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'pkg-doc-link';
        link.textContent = '📄 Itinerary PDF';
        const dates = body.querySelector('.pkg-dates');
        (dates || h3).insertAdjacentElement('afterend', link);
      });
    })
    .catch(() => {});
}

// Applies admin-edited phone/email/address everywhere those are marked up on the page.
function applySiteSettings() {
  const hasTargets = document.querySelector('.site-tel, .site-mail, .site-tel-text, .site-mail-text, .site-tel-href, .site-wa-href, .site-address-text, .stat-travellers, .stat-destinations, .stat-rating-star, .stat-rating-outof5, .stat-support, .stat-ig-followers, .stat-trips-run, .stat-founder-name, .stat-cofounder-name, .stat-founder-initial, .stat-cofounder-initial');
  if (!hasTargets) return;
  fetch('/api/site-settings')
    .then(res => res.json())
    .then(s => {
      const phoneDigits = (s.phone || '').replace(/[^0-9]/g, '');
      document.querySelectorAll('.site-tel').forEach(el => {
        el.href = 'tel:+' + phoneDigits;
        el.textContent = `📞 ${s.phone}`;
      });
      document.querySelectorAll('.site-tel-text').forEach(el => { el.textContent = `📞 ${s.phone}`; });
      document.querySelectorAll('.site-tel-href').forEach(el => { el.href = 'tel:+' + phoneDigits; });
      document.querySelectorAll('.site-wa-href').forEach(el => { el.href = 'https://wa.me/' + phoneDigits; });
      document.querySelectorAll('.site-mail').forEach(el => {
        el.href = 'mailto:' + s.email;
        el.textContent = `✉️ ${s.email}`;
      });
      document.querySelectorAll('.site-mail-text').forEach(el => { el.textContent = `✉️ ${s.email}`; });
      document.querySelectorAll('.site-address-text').forEach(el => { el.textContent = `📍 ${s.address}`; });
      document.querySelectorAll('.stat-travellers').forEach(el => { el.textContent = s.travellers; });
      document.querySelectorAll('.stat-destinations').forEach(el => { el.textContent = s.destinations; });
      document.querySelectorAll('.stat-rating-star').forEach(el => { el.textContent = `${s.rating}★`; });
      document.querySelectorAll('.stat-rating-outof5').forEach(el => { el.textContent = `${s.rating}/5.0`; });
      document.querySelectorAll('.stat-support').forEach(el => { el.textContent = s.support; });
      document.querySelectorAll('.stat-ig-followers').forEach(el => { el.textContent = s.igFollowers; });
      document.querySelectorAll('.stat-trips-run').forEach(el => { el.textContent = s.tripsRun; });
      document.querySelectorAll('.stat-founder-name').forEach(el => { el.textContent = s.founderName; });
      document.querySelectorAll('.stat-cofounder-name').forEach(el => { el.textContent = s.cofounderName; });
      document.querySelectorAll('.stat-founder-initial').forEach(el => { el.textContent = (s.founderName || '?').charAt(0).toUpperCase(); });
      document.querySelectorAll('.stat-cofounder-initial').forEach(el => { el.textContent = (s.cofounderName || '?').charAt(0).toUpperCase(); });
    })
    .catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  applySiteSettings();
  // Mobile nav
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav .close-btn');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  }
  document.querySelectorAll('.mobile-nav a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Destination horizontal scroll with mouse wheel
  document.querySelectorAll('.dest-scroller').forEach(scroller => {
    scroller.addEventListener('wheel', e => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      scroller.scrollLeft += e.deltaY;
    }, { passive: false });
  });

  // Scroll reveal — auto-tag common content blocks so pages don't need the class by hand
  document.querySelectorAll(
    '.section-head, .pkg-card, .testi-card, .blog-card, .why-card, .cat-card, .cta-banner, .card, .dest-item'
  ).forEach(el => el.classList.add('reveal'));

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 8px 24px rgba(0,0,0,.35)' : 'none';
    });
  }

  // Header search
  const searchToggle = document.getElementById('searchToggle');
  const searchBox = document.querySelector('.search-box');
  const searchInput = document.getElementById('siteSearchInput');
  const searchForm = document.getElementById('siteSearchForm');
  const DEST_MAP = {
    ibiza: 'ibiza', iceland: 'iceland', zurich: 'zurich', paris: 'paris',
    bali: 'bali', thailand: 'thailand', belgium: 'tomorrowland', tomorrowland: 'tomorrowland',
    mexico: 'mexico', dubai: 'dubai', vietnam: 'vietnam',
    newzealand: 'newzealand', 'new zealand': 'newzealand',
  };
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', () => {
      searchBox.classList.toggle('open');
      if (searchBox.classList.contains('open')) searchInput.focus();
    });
  }
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (searchInput.value || '').trim().toLowerCase();
      const onToursPage = /tours\.html$/.test(location.pathname);
      const slug = DEST_MAP[q] || Object.keys(DEST_MAP).find(k => k.startsWith(q) && q.length > 1);
      const target = slug ? `tours.html#${DEST_MAP[slug] || slug}` : `tours.html${q ? '?q=' + encodeURIComponent(q) : ''}`;
      if (onToursPage && slug) {
        document.getElementById(DEST_MAP[slug] || slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = target;
      }
    });
  }

  // Gallery filters
  const filters = document.querySelectorAll('.gfilter');
  const gitems = document.querySelectorAll('.gitem');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      gitems.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
      });
    });
  });

  // Deep-link a trip card straight to its photos: "gallery.html#trip-<slug>"
  // matches an existing filter category by fuzzy name (e.g. "new-zealand-group-trip" -> "newzealand"),
  // falling back to the admin-uploaded trip gallery section if no category matches.
  if (filters.length && location.hash.startsWith('#trip-')) {
    const normalized = location.hash.slice(6).replace(/-/g, '');
    const matchBtn = [...filters].find(b => b.dataset.filter !== 'all' && normalized.includes(b.dataset.filter));
    if (matchBtn) {
      matchBtn.click();
      document.querySelector('.gallery-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCap = lightbox.querySelector('.lb-cap');
    gitems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lbImg.src = img.src;
        lbCap.textContent = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  // Itinerary accordion (package detail pages)
  document.querySelectorAll('.itin-day').forEach(item => {
    const q = item.querySelector('.itin-day-head');
    q.addEventListener('click', () => item.classList.toggle('open'));
  });

  // "Read More" overview toggle
  document.querySelectorAll('.read-more-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.target);
      const expanded = target.classList.toggle('expanded');
      btn.textContent = expanded ? 'Read Less' : 'Read More';
    });
  });

  // Sticky sidebar CTA scroll
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(btn.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Trip galleries (used on gallery.html) — populate from uploaded trip photos
  const tripGalleriesEl = document.querySelector('#tripGalleries');
  if (tripGalleriesEl) {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(gallery => {
        const trips = Object.values(gallery || {}).filter(t => t.photos && t.photos.length);
        if (!trips.length) return;
        document.querySelector('#tripGalleriesSection').style.display = '';
        tripGalleriesEl.innerHTML = trips.map(t => `
          <div style="margin-bottom:28px" id="trip-${slugify(t.title)}">
            <h3 style="font-size:17px;font-weight:600;margin-bottom:12px">${t.title}</h3>
            <div class="gallery-grid">
              ${t.photos.map(p => `<div class="gitem"><img src="/${p}" alt="${t.title}"></div>`).join('')}
            </div>
          </div>`).join('');
        if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(() => {});
  }

  // Upcoming / Previous trip grids (used on tours.html) — populate from live trip data
  const upcomingTripsGrid = document.querySelector('#upcomingTripsGrid');
  const previousTripsGrid = document.querySelector('#previousTripsGrid');
  if (upcomingTripsGrid || previousTripsGrid) {
    fetch('/api/trips')
      .then(res => res.json())
      .then(trips => {
        if (upcomingTripsGrid) {
          const items = (trips.upcoming || []).slice(0, 4);
          upcomingTripsGrid.innerHTML = items.length ? items.map(t => `
            <div class="pkg-card">
              <div class="pkg-media">
                <img src="${t.image || ''}" alt="${t.alt || t.title || ''}">
                ${t.badge ? `<span class="pkg-tag">${t.badge}</span>` : ''}
              </div>
              <div class="pkg-body">
                <div class="pkg-days">${t.days || ''}</div>
                <h3><a href="${t.link || 'book-a-trip.html'}" style="color:inherit">${t.title || ''}</a></h3>
                <div class="pkg-dates">${t.dates || ''}</div>
                <div class="pkg-price-row">
                  <div class="pkg-price"><span class="label">Starting</span><br><strong>${t.price || ''}</strong></div>
                  <a href="${t.link || 'book-a-trip.html'}" class="btn btn-dark btn-sm">View Details</a>
                </div>
              </div>
            </div>`).join('') : '<div class="empty-state">No upcoming trips right now — check back soon.</div>';
        }
        if (previousTripsGrid) {
          const items = (trips.previous || []).slice(0, 4);
          previousTripsGrid.innerHTML = items.length ? items.map(t => `
            <a class="pkg-card" href="gallery.html" style="display:block">
              <div class="pkg-media">
                <img src="${t.image || ''}" alt="${t.alt || t.title || ''}">
                <span class="pkg-tag">✓ Completed</span>
              </div>
              <div class="pkg-body">
                <h3>${t.title || ''}</h3>
                <div class="pkg-dates">${t.date || ''}</div>
              </div>
            </a>`).join('') : '<div class="empty-state">No previous trips to show yet.</div>';
        }
      })
      .catch(() => {
        if (upcomingTripsGrid) upcomingTripsGrid.innerHTML = '<div class="empty-state">Could not load trips.</div>';
        if (previousTripsGrid) previousTripsGrid.innerHTML = '<div class="empty-state">Could not load trips.</div>';
      })
      .then(attachTripDocLinks);
  } else {
    attachTripDocLinks();
  }

  // Destination dropdown — populate from current upcoming trips
  const destinationSelect = document.querySelector('#destinationSelect');
  if (destinationSelect) {
    fetch('/api/trips')
      .then(res => res.json())
      .then(trips => {
        const upcoming = trips.upcoming || [];
        if (!upcoming.length) return;
        destinationSelect.innerHTML = upcoming
          .map(t => `<option>${t.title}</option>`)
          .join('') + '<option>Not sure yet</option>';
      })
      .catch(() => {});
  }

  // Booking form — submits to the /api/bookings backend
  const bookForm = document.querySelector('#bookingForm');
  if (bookForm) {
    const msg = document.querySelector('#formMsg');
    const submitBtn = bookForm.querySelector('button[type="submit"]');

    function clearFieldErrors() {
      bookForm.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
      bookForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-invalid'));
    }

    function showMsg(text, isError) {
      if (!msg) return;
      msg.textContent = text;
      msg.style.color = isError ? '#e0453f' : 'var(--accent)';
      msg.style.display = 'block';
    }

    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors();
      if (msg) msg.style.display = 'none';

      const formData = new FormData(bookForm);
      const payload = Object.fromEntries(formData.entries());

      if (payload.firstName || payload.lastName) {
        payload.name = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
      }
      if (payload.adults || payload.children) {
        const parts = [];
        if (payload.adults) parts.push(`${payload.adults} Adult${payload.adults === '1' ? '' : 's'}`);
        if (payload.children) parts.push(`${payload.children} Child${payload.children === '1' ? '' : 'ren'}`);
        payload.group_size = parts.join(', ');
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.status === 422 && data.errors) {
          Object.entries(data.errors).forEach(([field, text]) => {
            const errEl = bookForm.querySelector(`.field-error[data-for="${field}"]`);
            const inputEl = bookForm.querySelector(`[name="${field}"]`);
            if (errEl) errEl.textContent = text;
            if (inputEl) inputEl.classList.add('input-invalid');
          });
          showMsg('Please fix the highlighted fields.', true);
          return;
        }

        if (!res.ok || !data.ok) {
          showMsg("Something went wrong on our end — please call us directly at +91 88265 26252.", true);
          return;
        }

        showMsg("Thanks! Your request is in — our travel team will call you back within 24 hours.", false);
        bookForm.reset();
      } catch (err) {
        showMsg("Couldn't reach our server. Please check your connection and try again.", true);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Book a Call Back →'; }
      }
    });
  }

  // ---- Live chat widget (injected on every page) ----
  initChatWidget();
});

async function initChatWidget() {
  if (document.body.dataset.noChatWidget !== undefined) return;

  let waNumber = '918826526252';
  try {
    const settings = await fetch('/api/site-settings').then(r => r.json());
    if (settings.phone) waNumber = settings.phone.replace(/[^0-9]/g, '');
  } catch (e) { /* use default */ }

  const link = document.createElement('a');
  link.className = 'cmc-chat-bubble';
  link.setAttribute('aria-label', 'Chat with us on WhatsApp');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(`Hi! I'm on ${location.pathname.replace('.html','').replace('/','') || 'the homepage'} and have a question about a trip.`);
  link.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.02 2C6.5 2 2 6.47 2 11.96c0 1.85.5 3.59 1.39 5.09L2 22l5.1-1.34a10.03 10.03 0 0 0 4.92 1.3h.01c5.51 0 10-4.47 10-9.96S17.53 2 12.02 2zm0 18.18h-.01c-1.57 0-3.1-.42-4.44-1.21l-.32-.19-3.3.87.88-3.2-.21-.33a8.14 8.14 0 0 1-1.25-4.36c0-4.52 3.69-8.2 8.23-8.2a8.17 8.17 0 0 1 8.2 8.2c0 4.52-3.69 8.42-8.78 8.42z"/></svg>';

  document.body.appendChild(link);
}
