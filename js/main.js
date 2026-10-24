// Core Memories Club — site behaviour

function slugify(s) {
  return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'trip';
}

document.addEventListener('DOMContentLoaded', () => {
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
      });
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

function initChatWidget() {
  if (document.body.dataset.noChatWidget !== undefined) return;
  const isLocalBackend = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!isLocalBackend) return;

  let sessionId = localStorage.getItem('cmc_chat_session');
  if (!sessionId) {
    sessionId = 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('cmc_chat_session', sessionId);
  }
  let visitorName = localStorage.getItem('cmc_chat_name') || '';
  let lastSeen = 0;
  let pollTimer = null;

  const bubble = document.createElement('button');
  bubble.className = 'cmc-chat-bubble';
  bubble.setAttribute('aria-label', 'Chat with us');
  bubble.innerHTML = '💬<span class="cmc-chat-dot"></span>';

  const win = document.createElement('div');
  win.className = 'cmc-chat-window';
  win.innerHTML = `
    <div class="cmc-chat-head">
      <strong>Core Memories Club</strong>
      <span>Usually replies within a few hours</span>
    </div>
    <div class="cmc-chat-body" id="cmcChatBody"></div>
    <div class="cmc-chat-name-row" id="cmcNameRow" style="${visitorName ? 'display:none' : ''}">
      <input type="text" id="cmcNameInput" placeholder="Your name">
      <button id="cmcNameBtn">Start</button>
    </div>
    <div class="cmc-chat-input-row" id="cmcInputRow" style="${visitorName ? '' : 'display:none'}">
      <input type="text" id="cmcMsgInput" placeholder="Type a message...">
      <button id="cmcSendBtn" aria-label="Send">➤</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(win);

  const body = win.querySelector('#cmcChatBody');
  const nameInput = win.querySelector('#cmcNameInput');
  const nameBtn = win.querySelector('#cmcNameBtn');
  const nameRow = win.querySelector('#cmcNameRow');
  const inputRow = win.querySelector('#cmcInputRow');
  const msgInput = win.querySelector('#cmcMsgInput');
  const sendBtn = win.querySelector('#cmcSendBtn');

  function renderMessages(messages) {
    if (!messages.length && !body.children.length) {
      body.innerHTML = '<div style="text-align:center;color:var(--text-muted-2);font-size:12.5px;margin-top:20px">Send us a message — we usually reply fast!</div>';
      return;
    }
    messages.forEach(m => {
      const div = document.createElement('div');
      div.className = 'cmc-chat-msg ' + m.sender;
      div.textContent = m.message;
      body.appendChild(div);
    });
    body.scrollTop = body.scrollHeight;
  }

  async function poll() {
    try {
      const res = await fetch(`/api/chat/poll?session=${encodeURIComponent(sessionId)}&since=${lastSeen}`);
      const data = await res.json();
      if (data.ok && data.messages.length) {
        const newAdminMsgs = data.messages.filter(m => m.sender === 'admin');
        if (body.children.length === 1 && body.children[0].tagName === 'DIV' && !body.dataset.hasMsgs) {
          body.innerHTML = '';
        }
        body.dataset.hasMsgs = '1';
        renderMessages(data.messages);
        lastSeen = data.messages[data.messages.length - 1].created_at;
        if (newAdminMsgs.length && !win.classList.contains('open')) {
          bubble.classList.add('has-unread');
        }
      }
    } catch (e) { /* silent */ }
  }

  bubble.addEventListener('click', () => {
    win.classList.toggle('open');
    bubble.classList.remove('has-unread');
    if (win.classList.contains('open')) {
      if (!pollTimer) { poll(); pollTimer = setInterval(poll, 4000); }
    }
  });

  nameBtn.addEventListener('click', startChat);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') startChat(); });

  function startChat() {
    const name = nameInput.value.trim();
    if (!name) return;
    visitorName = name;
    localStorage.setItem('cmc_chat_name', name);
    nameRow.style.display = 'none';
    inputRow.style.display = '';
    sendMessage(`Hi, I'm ${name}!`);
    msgInput.focus();
  }

  sendBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if (!msg) return;
    msgInput.value = '';
    sendMessage(msg);
  });
  msgInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendBtn.click(); });

  async function sendMessage(message) {
    const div = document.createElement('div');
    div.className = 'cmc-chat-msg visitor';
    div.textContent = message;
    body.dataset.hasMsgs = '1';
    if (body.children.length === 1 && body.children[0].textContent.includes('Send us a message')) body.innerHTML = '';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    try {
      await fetch('/api/chat/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, sender: 'visitor', visitor_name: visitorName, message }),
      });
      lastSeen = Math.max(lastSeen, Math.floor(Date.now() / 1000));
    } catch (e) { /* silent */ }
  }
}
