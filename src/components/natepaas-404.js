define(["./natepaas-app.js"],function(_natepaasApp){"use strict";class NatePaas404 extends _natepaasApp.PageViewElement{static get styles(){return[_natepaasApp.SharedStyles]}render(){return _natepaasApp.html$2`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for does not seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `}}window.customElements.define("natepaas-404",NatePaas404)});