class SearchResult extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.createShadowRoot();
    this._items = [];
  }

  static get observedAttributes() {
    return ['items'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // name will always be "country" due to observedAttributes
    try {
      this._items = JSON.parse(newValue);
    }catch(e) {
      this._items = [];
      console.error(e);
    }
    this._updateRendering();
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        .search-result {
            overflow-y: scroll;
            max-height: 80vh;
        }
        /*ul {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            list-style: none;
        }
        li {
            max-height: 200px;
        }
        img {
            max-height: 100px;
            max-width: 100px;
        }*/
        * {margin: 0; padding: 0;}
         
        div {
          margin: 20px;
        }
         
        ul {
          list-style-type: none;
          width: 500px;
        }
         
        h3 {
          font: bold 20px/1.5 Helvetica, Verdana, sans-serif;
        }
         
        li img {
          float: left;
          margin: 0 15px 0 0;
          max-height: 100px;
          max-width: 100px;
        }
         
        li p {
          font: 200 12px/1.5 Georgia, Times New Roman, serif;
        }
         
        li {
          padding: 10px;
          overflow: auto;
        }
         
        li:hover {
          background: #eee;
          cursor: pointer;
        }
      </style>
      <div class="search-result">
        <ul></ul>
      </div> 
    `;
  }

  _updateRendering() {
    const html = [];
    this._items.forEach((item) => {
      const template = `
        <li><img src="${item.Poster}"><h3>${item.Title}</h3></span></li>
      `;
      html.push(template.trim());
    });
    if(html.length) {
      this.shadow.querySelector('ul').innerHTML = html.join('');
    }
  }
}

window.customElements.define('search-result', SearchResult);
// export default SearchMessage;