// Small standalone runtime for the two client preview pages.
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.classList.add('wf-armed');
  if (reduce) html.classList.add('wf-reduce');
  const hooks = {};
  window.wf = { on: (name, fn) => ((hooks[name] ||= []).push(fn)), state: { reduce } };
  const fire = (name) => (hooks[name] || []).forEach(fn => fn());

  function splitWords(el) {
    let index = 0;
    function walk(node) {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const fragment = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) fragment.append(part);
            else {
              const span = document.createElement('span');
              span.className = 'wf-w';
              span.style.setProperty('--i', index++);
              span.textContent = part;
              fragment.append(span);
            }
          }
          child.replaceWith(fragment);
        } else if (child.nodeType === 1) walk(child);
      }
    }
    walk(el);
  }

  function start() {
    document.querySelectorAll('[data-in="words"]').forEach(splitWords);
    const items = [...document.querySelectorAll('[data-in]')];
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'));
      fire('start');
      return;
    }
    const watched = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        (watched.get(entry.target) || []).forEach(reveal);
        watched.delete(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    function reveal(el) {
      setTimeout(() => el.classList.add('in'), Number(el.dataset.at) || 0);
      if (el.hasAttribute('data-group')) el.querySelectorAll('[data-in]').forEach(reveal);
    }
    function watch(el) {
      const node = el.dataset.in === 'aperture' || el.dataset.in === 'wipe' ? el.parentElement : el;
      if (!watched.has(node)) { watched.set(node, []); observer.observe(node); }
      watched.get(node).push(el);
    }
    for (const el of items) {
      if (el.closest('[data-group]') && !el.hasAttribute('data-group')) continue;
      if (el.dataset.trigger === 'load') reveal(el);
      else watch(el);
    }
    for (const group of document.querySelectorAll('[data-group]:not([data-in])')) watch(group);
    fire('start');
  }
  document.addEventListener('DOMContentLoaded', start, { once: true });
})();
