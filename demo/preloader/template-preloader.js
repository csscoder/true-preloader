(() => {
  if (typeof window === 'undefined') return false;
  const template = document.createElement('template');
  template.innerHTML = `

  <!-- Add code preloader -->

  `;
  window.templatePreloader = template;
})();
