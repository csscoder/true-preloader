
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  class StorageEvents {
    constructor(options) {
      this.templateID = options.templateID;
      this.prefixStorage = 'vmv_PredL';
      this.options = options.props;
      this.frequency = options.frequency || 'once';
      this.showAlways = false;
      this.needCookies = false;
      this.init();
    }

    init() {
      this.keyStorage = this.prefixStorage + this.options.buildVersion;

      switch (this.options.frequency) {
        case 'once':
          this.storage = window.localStorage;
          this.needCookies = true;
          break;
        case 'visit':
          this.storage = window.sessionStorage;
          break;
        case 'always':
          this.showAlways = true;
          this.clear();
          break;
        default:
          this.storage = window.sessionStorage;
          break;
      }
    }

    checkAllow() {
      return this.showAlways || !this.storage?.getItem(this.keyStorage);
    }

    clear() {
      [window.localStorage, window.sessionStorage].forEach((storage) => {
        const dL = Object.assign({}, storage);
        for (let key in dL) {
          if (key.includes(this.prefixStorage)) {
            storage.removeItem(key);
          }
        }
      });

      const theCookies = document.cookie.split(';');
      theCookies.forEach((item) => {
        if (item.includes(this.prefixStorage)) {
          document.cookie = `${item}; max-age=-1;`;
        }
      });
    }

    setLoaded() {
      if (this.showAlways) return false;
      this.clear();
      this.storage.setItem(this.keyStorage, '1');
      if (this.needCookies) {
        document.cookie = `${this.keyStorage}=1; max-age=31104000; path=/`;
      }
    }
  }

  class DomElement {
    constructor(options) {
      console.log(options);
      this.el = options.el;
      this.fallbackTime = options.fallbackTime;
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
            this.attachShadow({ mode: 'open' }).appendChild(
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
        this.minShowTimeDone = true;
        if (this.hasEventToClose) {
          this.remove();
        }
      }, this.props.minShowTime || 1000);
    }

    remove() {
      if (!this.minShowTimeDone) {
        this.hasEventToClose = true;
        return false;
      }
      this.storageEvents.setLoaded();
      this.domEl.style.transition = `all ${this.durationHide}ms`;
      this.domEl.style.opacity = '0';
      console.log(this.fallBackTimer);
      if (this.fallBackTimer) clearTimeout(this.fallBackTimer);
      setTimeout(() => {
        this.domEl.remove();
      }, this.durationHide);
    }
  }

  class Preloader {
    constructor() {
      this.el = 'preloader-box';
      this.templateID = 'preloader-template';
      this.props = document.querySelector(`script[data-preloader]`).dataset;
      this.storageEvents = new StorageEvents({
        templateID: this.templateID,
        props: this.props,
      });
      this.init();
      this.fallBackTimer = null;
    }

    removeTemplate() {
      window.templatePreloader = null;
    }

    boundListener = this.listenerFunc.bind(this);

    listenerFunc() {
      this.domElement.remove();
      if (this.fallBackTimer) clearTimeout(this.fallBackTimer);
    }

    addListenerHide() {
      window.addEventListener('preloaderHide', this.boundListener, {
        once: true,
      });
    }

    init() {
      if (typeof window === 'undefined') {
        return false;
      }

      if (this.storageEvents.checkAllow()) {
        this.domElement = new DomElement(this);
        this.addListenerHide();
        this.fallbackTimeToHideInit();
      } else {
        this.removeTemplate();
      }
    }

    fallbackTimeToHideInit() {
      const timeFallback = this.props.timeFallback || 6;
      this.fallBackTimer = setTimeout(() => {
        this.domElement.remove();
        window.removeEventListener('preloaderHide', this.boundListener);
      }, timeFallback);
    }
  }

  new Preloader();

})();
