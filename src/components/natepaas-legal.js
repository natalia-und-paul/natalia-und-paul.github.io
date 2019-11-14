define(["./natepaas-app.js"],function(_natepaasApp){"use strict";class NatePaasLegal extends(0,_natepaasApp.connect)(_natepaasApp.store)(_natepaasApp.PageViewElement){static get properties(){return{_texts:{type:Array},_lang:{type:String}}}static get styles(){return[_natepaasApp.SharedStyles]}render(){const txt=this._texts&&this._texts[this._lang+".json"]?this._texts[this._lang+".json"].legal:null;if(txt){return _natepaasApp.html$2`
        <section>
          <h2>${txt.t1}</h2>
          <h3>${txt.t2}</h3>
          <p>${txt.c1}</p>
          <p>
            ${txt.c2}<br>
            ${txt.c3}<br>
            ${txt.c4}<br>
          </p>
          <p>${txt.c5}</p>

          <h3>${txt.t4}</h3>
          <p>${txt.c6}</p>

          <h3>${txt.t5}</h3>
          <p>${txt.c7}<br><a href="${txt.l1}">${txt.l1}</a></p>

          <h3>${txt.t6}</h3>
          <p>${txt.c8}</p>

          <h3>${txt.t7}</h3>
          <p>${txt.c9}</p>

          <h3>${txt.t8}</h3>
          <p>${txt.c10}</p>

          <h3>${txt.t9}</h3>
          <p>${txt.c11}</p>
          <p>${txt.c12}</p>
          <p>${txt.c13}</p>
          <p>${txt.c14}</p>
          <p>${txt.c15} <a href="${txt.l2}">${txt.l2}<a></p>
        </section>
      `}else{return _natepaasApp.html$2`
      <section>
        <p class="centered">
          <paper-spinner active></paper-spinner>
        </p>
      </section>`}}stateChanged(state){this._lang=state.app.lang;this._texts=state.assets.texts}}window.customElements.define("natepaas-legal",NatePaasLegal)});