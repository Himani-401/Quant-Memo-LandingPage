const themeToggle = document.querySelector('.theme-toggle');
const applyTheme = (theme) => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.toggle('theme-dark', nextTheme === 'dark');
  document.body.style.colorScheme = nextTheme;
  localStorage.setItem('quantmemo-theme', nextTheme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.title = nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('data-theme', nextTheme);
  }
};

const savedTheme = localStorage.getItem('quantmemo-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(next);
  });
}

const dropdowns = document.querySelectorAll('.nav-dropdown');

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.nav-trigger');
  if (!trigger) return;

  const openDropdown = () => {
    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove('open');
        const otherTrigger = item.querySelector('.nav-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const closeDropdown = () => {
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', () => {
    const isOpen = dropdown.classList.contains('open');
    dropdowns.forEach((item) => {
      item.classList.remove('open');
      const itemTrigger = item.querySelector('.nav-trigger');
      if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      openDropdown();
    }
  });

  dropdown.addEventListener('mouseleave', closeDropdown);
  trigger.addEventListener('blur', (event) => {
    if (!dropdown.contains(event.relatedTarget)) {
      closeDropdown();
    }
  });
});

const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const duration = 1200;
      const startTime = performance.now();

      const step = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        counter.textContent = `${value}${target >= 100 ? '+' : ''}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const progressDots = document.querySelectorAll('.progress-dot');
progressDots.forEach((dot, index) => {
  if (index < 3) {
    dot.classList.add('filled');
  }
});

const form = document.querySelector('.newsletter-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const input = form.querySelector('input');

    if (button) {
      button.textContent = 'Subscribed';
      button.disabled = true;
    }

    if (input) {
      input.value = '';
      input.placeholder = 'Thanks for subscribing';
    }
  });
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
}
