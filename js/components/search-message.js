class SearchMessage extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.createShadowRoot();
    this.timer = null;
    this.registerCustomEvent();
    this.classNameByMessageType = {
      error: 'error',
      success: 'success',
      info: 'info',
      warning: 'warning'
    };
  }

  reset() {
    const searchMessage = this.shadow.querySelector('.search-message');
    searchMessage.style.display = 'none';
    Object.values(this.classNameByMessageType).forEach((classToRemove) => {
      searchMessage.classList.remove(classToRemove);
    });
    searchMessage.querySelector('p > strong').innerHTML = '';
  }

  clearTimeout(){
    if(this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = null;
  }

  resetByTimeout(){
    this.clearTimeout();
    this.timer = window.setTimeout(this.reset.bind(this), 5*1000);
  }

  onSearchMessage(evt) {
    const searchMessage = this.shadow.querySelector('.search-message');
    searchMessage.classList.add(this.classNameByMessageType[evt.detail.type]);
    searchMessage.style.display = 'block';
    searchMessage.querySelector('p > strong').innerHTML = evt.detail.msg;
    this.resetByTimeout();
  }

  onSearchMessageReset() {
    this.clearTimeout();
    this.reset();
  }

  registerCustomEvent() {
    window.addEventListener('search-message', this.onSearchMessage.bind(this));
    window.addEventListener('search-message-reset', this.onSearchMessageReset.bind(this));
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        @import 'css/components/search-message.css';
      </style>
      <div class="search-message">
        <p><strong></strong></p>
      </div>
    `;
  }
}
window.customElements.define('search-message', SearchMessage);
// export default SearchMessage;