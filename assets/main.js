// ===== scroll reveal =====
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ===== mobile nav =====
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('nav ul');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('mobile-open');
      if (navList.classList.contains('mobile-open')) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '60px';
        navList.style.right = '0';
        navList.style.left = '0';
        navList.style.background = 'rgba(11,11,13,0.97)';
        navList.style.padding = '16px 28px';
        navList.style.gap = '6px';
      } else {
        navList.style.display = 'none';
      }
    });
  }

  // ===== lightbox (FLIP-style scale-up from card) =====
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbCard = document.getElementById('lightboxCard');
  const lbAvatar = document.getElementById('lightboxAvatar');
  const lbName = document.getElementById('lightboxName');
  const lbRole = document.getElementById('lightboxRole');
  const lbDesc = document.getElementById('lightboxDesc');
  const lbClose = document.querySelector('.lightbox-close');
  const lbBackdrop = document.querySelector('.lightbox-backdrop');

  let lastFocused = null;

  function openLightbox(card) {
    const avatar = card.querySelector('.p-avatar');
    const rect = avatar.getBoundingClientRect();
    const name = card.dataset.name;
    const role = card.dataset.role;
    const desc = card.dataset.desc;
    const bg = getComputedStyle(avatar).backgroundImage;
    const initials = avatar.textContent.trim();

    lbAvatar.style.background = bg;
    lbAvatar.textContent = initials;
    lbName.textContent = name;
    lbRole.textContent = role;
    lbDesc.textContent = desc;

    // start state: match the clicked card exactly
    lbCard.style.transition = 'none';
    lbCard.style.top = rect.top + 'px';
    lbCard.style.left = rect.left + 'px';
    lbCard.style.width = rect.width + 'px';
    lbCard.style.height = rect.height + 'px';
    lbCard.style.borderRadius = '4px';
    lbAvatar.style.fontSize = '46px';
    lbAvatar.style.height = '100%';

    lightbox.style.display = 'flex';
    lastFocused = document.activeElement;

    requestAnimationFrame(() => {
      lightbox.classList.add('show');
      // target state: centered, larger
      const targetW = Math.min(window.innerWidth * 0.78, 560);
      const targetH = Math.min(window.innerHeight * 0.78, 640);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      lbCard.style.transition = '';
      lbCard.style.top = targetTop + 'px';
      lbCard.style.left = targetLeft + 'px';
      lbCard.style.width = targetW + 'px';
      lbCard.style.height = targetH + 'px';
      lbCard.style.borderRadius = '8px';
      lbAvatar.style.height = '60%';
      lbAvatar.style.fontSize = '78px';
    });

    lightbox.classList.add('open');
    lbClose.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    lbAvatar.style.fontSize = '46px';
    setTimeout(() => {
      lightbox.classList.remove('open');
      lightbox.style.display = 'none';
      if (lastFocused) lastFocused.focus();
    }, 420);
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  document.querySelectorAll('.p-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
});
