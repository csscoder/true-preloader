class DomElement {
  constructor(options) {
    this.el = options.el;
    this.props = options.props;
    this.removeTemplate = options.removeTemplate;
    this.storageEvents = options.storageEvents;
    this.durationHide = options.props.durationHide || 300;
    this.init();
    this.minShowTimeDone = false;
    this.hasEventToClose = false;
  }

  init() {
    document
      .querySelector(':root')
      .insertAdjacentHTML('afterbegin', `<${this.el}></${this.el}>`);
    this.domEl = document.querySelector(this.el);
    this.domEl.style.cssText =
      'position: fixed; top: 0; left: 0; height: 100vh;  width: 100vw; z-index: 2147483647; overflow: hidden;';
    customElements.define(
      this.el,
      class extends HTMLElement {
        constructor() {
          super();
          let templateContent = window.templatePreloader.content;
          const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(
            templateContent.cloneNode(true),
          );
        }
      },
    );
    this.removeTemplate();
    this.minMinDuration();
  }

  minMinDuration() {
    setTimeout(() => {
      if (this.hasEventToClose) {
        this.minShowTimeDone = true;
        this.remove();
      }
    }, this.props.minShowTime || 1000);
  }

  remove() {
    if (!this.minShowTimeDone) {
      this.hasEventToClose = true;
      console.log('has event');
      return false;
    }
    this.storageEvents.setLoaded();
    this.domEl.style.transition = `all ${this.durationHide}ms`;
    this.domEl.style.opacity = '0';
    setTimeout(() => {
      this.domEl.remove();
    }, this.durationHide);
  }
}

export { DomElement as default };
