import{html$2 as html,PageViewElement,SharedStyles}from"./natepaas-app.js";class NatePaas404 extends PageViewElement{static get styles(){return[SharedStyles]}render(){return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for does not seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `}}window.customElements.define("natepaas-404",NatePaas404);