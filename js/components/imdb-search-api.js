/**
 * By Search
 Parameter	Required	Valid options	Default Value	Description
 s	Yes		<empty>	Movie title to search for.
 type	No	movie, series, episode	<empty>	Type of result to return.
 y	No		<empty>	Year of release.
 r	No	json, xml	json	The data type to return.
 page New!	No	1-100	1	Page number to return.
 callback	No		<empty>	JSONP callback name.
 v	No		1	API version (reserved for future use).
 * http://www.omdbapi.com/
 */

const apiUrl = 'http://www.omdbapi.com/?apikey=b51544b0&type=movie&s=';

class ImdbSearchApi extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.createShadowRoot();
    this.registerCustomEvent();
  }

  async fetch(url){
    const response = await window.fetch(url);
    const responseAsJson = await response.json();
    return responseAsJson;
  }

  displayMessage(msg, type) {
    const event = new CustomEvent('search-message', {
      detail: {msg,type}
    });
    window.dispatchEvent(event);
  }

  onSearchReady(responseAsJson){
    console.log(responseAsJson);
    if(responseAsJson.hasOwnProperty('Error')) {
      this.displayMessage(responseAsJson.Error, 'error');
    } else {
      this.displayMessage(`Found ${responseAsJson.totalResults} displaying ${responseAsJson.Search.length}`, 'info');
      this.shadow.querySelector('search-result').setAttribute('items', JSON.stringify(responseAsJson.Search));
    }
  }

  onSearchFaild(){

  }

  onSearch(evt){
    const url = apiUrl + window.encodeURIComponent(evt.detail.s);
    this.fetch(url)
        .then((responseAsJson) => {
          this.onSearchReady(responseAsJson);
        })
        .catch(this.onSearchFaild.bind(this));
  }

  registerCustomEvent(){
    window.addEventListener('search-api', this.onSearch.bind(this));
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        .main {
            overflow-y: hidden;
            overflow-x: hidden;
            min-height: 80vw;
            max-height: 100vh;
            min-width: 80vw;
            margin: auto;
            display: flex;
            flex-direction: column;
            border-radius: 5px;
            background: #c4d6dc;
            padding-top: 5px;
        }
        .main:nth-child(0) {
            margin-top: 5px;
        }
        .main > * {
            margin-bottom: 5px;
        }
      </style>
      <div class="main">
        <search-form></search-form>
        <search-message></search-message>
        <search-result items="[]"></search-result>
      </div>
    `;
  }
}
window.customElements.define('imdb-search-api', ImdbSearchApi);
// export default ImdbSearchApi;