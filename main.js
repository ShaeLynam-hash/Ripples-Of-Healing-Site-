/* =============================================
   RIPPLES OF HEALING — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     NAVIGATION — scroll behavior & mobile
     ============================================ */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');

  // Scroll: make nav solid after 60px
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav && nav.classList.add('scrolled');
    } else {
      nav && nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile hamburger
  function openDrawer() {
    hamburger && hamburger.classList.add('open');
    drawer && drawer.classList.add('open');
    overlay && overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger && hamburger.classList.remove('open');
    drawer && drawer.classList.remove('open');
    overlay && overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay && overlay.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  const drawerLinks = document.querySelectorAll('.nav-drawer-links a');
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a, .nav-drawer-links a');
  navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================
     SMOOTH SCROLL for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     STAGGER FADE-IN for grids (must run BEFORE observer)
     ============================================ */
  // Scroll animations disabled — all content visible immediately
  document.querySelectorAll('.fade-in, .stagger-children').forEach(el => {
    el.classList.add('visible');
  });
  document.querySelectorAll('.stagger-children').forEach(parent => {
    Array.from(parent.children).forEach(child => {
      child.classList.add('visible');
      child.style.transitionDelay = '0s';
    });
  });

  /* Pricing toggle is handled inline in pricing.html */

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ============================================
     FAQ CATEGORY FILTER
     ============================================ */
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');

  faqCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      faqItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ============================================
     CLASSES FILTER TABS
     ============================================ */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const classCards = document.querySelectorAll('.class-card-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      classCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ============================================
     NEWSLETTER FORM
     ============================================ */
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');

      if (input && input.value) {
        btn.textContent = '✓ You\'re in!';
        btn.style.background = '#10B981';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Get Started';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  /* ============================================
     HERO VIDEO FALLBACK
     ============================================ */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
    });
  }

  /* ============================================
     SCHEDULE — WEEK NAVIGATION
     ============================================ */
  const weekPrevBtn = document.getElementById('week-prev');
  const weekNextBtn = document.getElementById('week-next');
  const weekLabel = document.getElementById('week-label');

  if (weekLabel) {
    let weekOffset = 0;

    function getWeekRange(offset) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const opts = { month: 'short', day: 'numeric' };
      return `${monday.toLocaleDateString('en-US', opts)} – ${sunday.toLocaleDateString('en-US', opts)}`;
    }

    function updateWeekLabel() {
      weekLabel.textContent = getWeekRange(weekOffset);
    }

    updateWeekLabel();

    weekPrevBtn && weekPrevBtn.addEventListener('click', () => {
      weekOffset--;
      updateWeekLabel();
    });

    weekNextBtn && weekNextBtn.addEventListener('click', () => {
      weekOffset++;
      updateWeekLabel();
    });
  }


  /* ============================================
     TOOLTIPS for schedule register buttons
     ============================================ */
  document.querySelectorAll('.schedule-slot .btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const original = this.textContent;
      this.textContent = '✓ Registered!';
      this.style.background = '#10B981';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
      }, 2500);
    });
  });

  /* ============================================
     Mark page as loaded (triggers transitions)
     ============================================ */
  document.body.classList.add('page-loaded');

});

/* ============================================
   AUTH STATE — update nav based on Supabase session
   ============================================ */
(function() {
  if (typeof sb === 'undefined') return;

  async function goToCheckout(session) {
    try {
      const { data: profile } = await sb.from('profiles').select('stripe_customer_id').eq('id', session.user.id).maybeSingle();
      if (profile?.stripe_customer_id) {
        window.location.href = 'portal.html';
        return;
      }
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, userId: session.user.id }),
      });
      const { url } = await res.json();
      window.location.href = url || 'portal.html';
    } catch(e) {
      window.location.href = 'portal.html';
    }
  }

  function buildDropdown(session) {
    const meta      = session.user.user_metadata || {};
    const firstName = meta.first_name || '';
    const lastName  = meta.last_name  || '';
    const email     = session.user.email;
    const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || email[0].toUpperCase();
    const fullName  = [firstName, lastName].filter(Boolean).join(' ') || email;
    const planLabel = 'Ripples Membership';

    // Replace .nav-login link with account button+dropdown
    document.querySelectorAll('a.nav-login').forEach(el => {
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-account';
      wrapper.innerHTML = `
        <button class="nav-account-btn" aria-haspopup="true" aria-expanded="false">
          <span class="nav-account-avatar">${initials}</span>
          ${firstName ? `<span>${firstName}</span>` : ''}
          <span class="nav-account-chevron">▾</span>
        </button>
        <div class="nav-account-dropdown" role="menu">
          <div class="nav-account-info">
            <div class="nav-account-name">${fullName}</div>
            <div class="nav-account-email">${email}</div>
            <span class="nav-account-plan">${planLabel}</span>
          </div>
          <a href="portal.html" class="nav-dropdown-link" role="menuitem">🏠 My Portal</a>
          <a href="classes.html" class="nav-dropdown-link" role="menuitem">📅 My Classes</a>
          <a href="pricing.html" class="nav-dropdown-link" role="menuitem">💳 My Plan</a>
          <div class="nav-dropdown-divider"></div>
          <button class="nav-dropdown-link danger" id="nav-signout-btn" role="menuitem">Sign Out</button>
        </div>
      `;
      el.parentNode.replaceChild(wrapper, el);

      const btn = wrapper.querySelector('.nav-account-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      });
      document.addEventListener('click', () => {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });

      wrapper.querySelector('#nav-signout-btn').addEventListener('click', async () => {
        await sb.auth.signOut();
        window.location.href = 'index.html';
      });
    });

    // For logged-in users: intercept ALL "Join Now" clicks → go straight to Stripe, never signup.html
    document.querySelectorAll('a[href="signup.html"]').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        await goToCheckout(session);
      });
    });

    // Hide the "Join Now" button in the nav (user is already logged in)
    document.querySelectorAll('a.btn-primary.btn-sm[href="signup.html"]').forEach(el => {
      el.style.display = 'none';
    });

    // Mobile drawer: replace Log In with "My Portal", hide Join Now
    document.querySelectorAll('.nav-drawer-links a[href="login.html"]').forEach(el => {
      el.textContent = 'My Portal';
      el.href = 'portal.html';
    });
    document.querySelectorAll('.nav-drawer-actions a[href="signup.html"]').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.nav-drawer-actions a[href="login.html"]').forEach(el => {
      el.textContent = 'Sign Out';
      el.href = '#';
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        await sb.auth.signOut();
        window.location.href = 'index.html';
      });
    });
  }

  function resetNav() {
    // If signed out, refresh so the original nav links show
    // (simplest approach for a static site)
  }

  sb.auth.getSession().then(({ data: { session } }) => {
    if (session) buildDropdown(session);
  });

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) buildDropdown(session);
    if (event === 'SIGNED_OUT') window.location.reload();
  });
})();

/* ============================================
   Utility: add CSS animation for filtered cards
   ============================================ */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleEl);
