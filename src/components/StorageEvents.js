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

export { StorageEvents as default };
