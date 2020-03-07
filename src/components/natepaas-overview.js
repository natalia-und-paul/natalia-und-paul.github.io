import{Base,html as html$1,Polymer,html$1 as html,dom,IronA11yKeysBehavior,IronOverlayBehavior,IronOverlayBehaviorImpl,NeonAnimationRunnerBehavior,resolveUrl,dashToCamelCase,afterNextRender,PolymerElement,findOriginalTarget,PaperSpinnerBehavior,updateIsRegLoading,openDialog,updateAttendance,LitElement,html$2,css,PageViewElement,connect,SharedStyles,starIcon,store}from"./natepaas-app.js";const IronA11yAnnouncer=Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        position: fixed;
        clip: rect(0px,0px,0px,0px);
      }
    </style>
    <div aria-live$="[[mode]]">[[_text]]</div>
`,is:"iron-a11y-announcer",properties:{/**
     * The value of mode is used to set the `aria-live` attribute
     * for the element that will be announced. Valid values are: `off`,
     * `polite` and `assertive`.
     */mode:{type:String,value:"polite"},_text:{type:String,value:""}},created:function(){if(!IronA11yAnnouncer.instance){IronA11yAnnouncer.instance=this}document.body.addEventListener("iron-announce",this._onIronAnnounce.bind(this))},/**
   * Cause a text string to be announced by screen readers.
   *
   * @param {string} text The text that should be announced.
   */announce:function(text){this._text="";this.async(function(){this._text=text},100)},_onIronAnnounce:function(event){if(event.detail&&event.detail.text){this.announce(event.detail.text)}}});IronA11yAnnouncer.instance=null;IronA11yAnnouncer.requestAvailability=function(){if(!IronA11yAnnouncer.instance){IronA11yAnnouncer.instance=document.createElement("iron-a11y-announcer")}document.body.appendChild(IronA11yAnnouncer.instance)};var ironA11yAnnouncer={IronA11yAnnouncer:IronA11yAnnouncer};const IronControlState={properties:{/**
     * If true, the element currently has focus.
     */focused:{type:Boolean,value:!1,notify:!0,readOnly:!0,reflectToAttribute:!0},/**
     * If true, the user cannot interact with this element.
     */disabled:{type:Boolean,value:!1,notify:!0,observer:"_disabledChanged",reflectToAttribute:!0},/**
     * Value of the `tabindex` attribute before `disabled` was activated.
     * `null` means the attribute was not present.
     * @type {?string|undefined}
     */_oldTabIndex:{type:String},_boundFocusBlurHandler:{type:Function,value:function(){return this._focusBlurHandler.bind(this)}}},observers:["_changedControlState(focused, disabled)"],/**
   * @return {void}
   */ready:function(){this.addEventListener("focus",this._boundFocusBlurHandler,!0);this.addEventListener("blur",this._boundFocusBlurHandler,!0)},_focusBlurHandler:function(event){// Polymer takes care of retargeting events.
this._setFocused("focus"===event.type);return},_disabledChanged:function(disabled,old){this.setAttribute("aria-disabled",disabled?"true":"false");this.style.pointerEvents=disabled?"none":"";if(disabled){// Read the `tabindex` attribute instead of the `tabIndex` property.
// The property returns `-1` if there is no `tabindex` attribute.
// This distinction is important when restoring the value because
// leaving `-1` hides shadow root children from the tab order.
this._oldTabIndex=this.getAttribute("tabindex");this._setFocused(!1);this.tabIndex=-1;this.blur()}else if(this._oldTabIndex!==void 0){if(null===this._oldTabIndex){this.removeAttribute("tabindex")}else{this.setAttribute("tabindex",this._oldTabIndex)}}},_changedControlState:function(){// _controlStateChanged is abstract, follow-on behaviors may implement it
if(this._controlStateChanged){this._controlStateChanged()}}};var ironControlState={IronControlState:IronControlState};const IronButtonStateImpl={properties:{/**
     * If true, the user is currently holding down the button.
     */pressed:{type:Boolean,readOnly:!0,value:!1,reflectToAttribute:!0,observer:"_pressedChanged"},/**
     * If true, the button toggles the active state with each tap or press
     * of the spacebar.
     */toggles:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * If true, the button is a toggle and is currently in the active state.
     */active:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0},/**
     * True if the element is currently being pressed by a "pointer," which
     * is loosely defined as mouse or touch input (but specifically excluding
     * keyboard input).
     */pointerDown:{type:Boolean,readOnly:!0,value:!1},/**
     * True if the input device that caused the element to receive focus
     * was a keyboard.
     */receivedFocusFromKeyboard:{type:Boolean,readOnly:!0},/**
     * The aria attribute to be set if the button is a toggle and in the
     * active state.
     */ariaActiveAttribute:{type:String,value:"aria-pressed",observer:"_ariaActiveAttributeChanged"}},listeners:{down:"_downHandler",up:"_upHandler",tap:"_tapHandler"},observers:["_focusChanged(focused)","_activeChanged(active, ariaActiveAttribute)"],/**
   * @type {!Object}
   */keyBindings:{"enter:keydown":"_asyncClick","space:keydown":"_spaceKeyDownHandler","space:keyup":"_spaceKeyUpHandler"},_mouseEventRe:/^mouse/,_tapHandler:function(){if(this.toggles){// a tap is needed to toggle the active state
this._userActivate(!this.active)}else{this.active=!1}},_focusChanged:function(focused){this._detectKeyboardFocus(focused);if(!focused){this._setPressed(!1)}},_detectKeyboardFocus:function(focused){this._setReceivedFocusFromKeyboard(!this.pointerDown&&focused)},// to emulate native checkbox, (de-)activations from a user interaction fire
// 'change' events
_userActivate:function(active){if(this.active!==active){this.active=active;this.fire("change")}},_downHandler:function(event){this._setPointerDown(!0);this._setPressed(!0);this._setReceivedFocusFromKeyboard(!1)},_upHandler:function(){this._setPointerDown(!1);this._setPressed(!1)},/**
   * @param {!KeyboardEvent} event .
   */_spaceKeyDownHandler:function(event){var keyboardEvent=event.detail.keyboardEvent,target=dom(keyboardEvent).localTarget;// Ignore the event if this is coming from a focused light child, since that
// element will deal with it.
if(this.isLightDescendant(/** @type {Node} */target))return;keyboardEvent.preventDefault();keyboardEvent.stopImmediatePropagation();this._setPressed(!0)},/**
   * @param {!KeyboardEvent} event .
   */_spaceKeyUpHandler:function(event){var keyboardEvent=event.detail.keyboardEvent,target=dom(keyboardEvent).localTarget;// Ignore the event if this is coming from a focused light child, since that
// element will deal with it.
if(this.isLightDescendant(/** @type {Node} */target))return;if(this.pressed){this._asyncClick()}this._setPressed(!1)},// trigger click asynchronously, the asynchrony is useful to allow one
// event handler to unwind before triggering another event
_asyncClick:function(){this.async(function(){this.click()},1)},// any of these changes are considered a change to button state
_pressedChanged:function(pressed){this._changedButtonState()},_ariaActiveAttributeChanged:function(value,oldValue){if(oldValue&&oldValue!=value&&this.hasAttribute(oldValue)){this.removeAttribute(oldValue)}},_activeChanged:function(active,ariaActiveAttribute){if(this.toggles){this.setAttribute(this.ariaActiveAttribute,active?"true":"false")}else{this.removeAttribute(this.ariaActiveAttribute)}this._changedButtonState()},_controlStateChanged:function(){if(this.disabled){this._setPressed(!1)}else{this._changedButtonState()}},// provide hook for follow-on behaviors to react to button-state
_changedButtonState:function(){if(this._buttonStateChanged){this._buttonStateChanged();// abstract
}}},IronButtonState=[IronA11yKeysBehavior,IronButtonStateImpl];/** @polymerBehavior */var ironButtonState={IronButtonStateImpl:IronButtonStateImpl,IronButtonState:IronButtonState};const IronFormElementBehavior={properties:{/**
     * The name of this element.
     */name:{type:String},/**
     * The value for this element.
     * @type {*}
     */value:{notify:!0,type:String},/**
     * Set to true to mark the input as required. If used in a form, a
     * custom element that uses this behavior should also use
     * IronValidatableBehavior and define a custom validation method.
     * Otherwise, a `required` element will always be considered valid.
     * It's also strongly recommended to provide a visual style for the element
     * when its value is invalid.
     */required:{type:Boolean,value:!1}},// Empty implementations for backcompatibility.
attached:function(){},detached:function(){}};var ironFormElementBehavior={IronFormElementBehavior:IronFormElementBehavior};class IronMeta{/**
   * @param {{
   *   type: (string|null|undefined),
   *   key: (string|null|undefined),
   *   value: *,
   * }=} options
   */constructor(options){IronMeta[" "](options);/** @type {string} */this.type=options&&options.type||"default";/** @type {string|null|undefined} */this.key=options&&options.key;if(options&&"value"in options){/** @type {*} */this.value=options.value}}/** @return {*} */get value(){var type=this.type,key=this.key;if(type&&key){return IronMeta.types[type]&&IronMeta.types[type][key]}}/** @param {*} value */set value(value){var type=this.type,key=this.key;if(type&&key){type=IronMeta.types[type]=IronMeta.types[type]||{};if(null==value){delete type[key]}else{type[key]=value}}}/** @return {!Array<*>} */get list(){var type=this.type;if(type){var items=IronMeta.types[this.type];if(!items){return[]}return Object.keys(items).map(function(key){return metaDatas[this.type][key]},this)}}/**
     * @param {string} key
     * @return {*}
     */byKey(key){this.key=key;return this.value}};// This function is used to convince Closure not to remove constructor calls
// for instances that are not held anywhere. For example, when
// `new IronMeta({...})` is used only for the side effect of adding a value.
IronMeta[" "]=function(){};IronMeta.types={};var metaDatas=IronMeta.types;/**
                                `iron-meta` is a generic element you can use for sharing information across the
                                DOM tree. It uses [monostate pattern](http://c2.com/cgi/wiki?MonostatePattern)
                                such that any instance of iron-meta has access to the shared information. You
                                can use `iron-meta` to share whatever you want (or create an extension [like
                                x-meta] for enhancements).
                                
                                The `iron-meta` instances containing your actual data can be loaded in an
                                import, or constructed in any way you see fit. The only requirement is that you
                                create them before you try to access them.
                                
                                Examples:
                                
                                If I create an instance like this:
                                
                                    <iron-meta key="info" value="foo/bar"></iron-meta>
                                
                                Note that value="foo/bar" is the metadata I've defined. I could define more
                                attributes or use child nodes to define additional metadata.
                                
                                Now I can access that element (and it's metadata) from any iron-meta instance
                                via the byKey method, e.g.
                                
                                    meta.byKey('info');
                                
                                Pure imperative form would be like:
                                
                                    document.createElement('iron-meta').byKey('info');
                                
                                Or, in a Polymer element, you can include a meta in your template:
                                
                                    <iron-meta id="meta"></iron-meta>
                                    ...
                                    this.$.meta.byKey('info');
                                
                                @group Iron Elements
                                @demo demo/index.html
                                @element iron-meta
                                */Polymer({is:"iron-meta",properties:{/**
     * The type of meta-data.  All meta-data of the same type is stored
     * together.
     * @type {string}
     */type:{type:String,value:"default"},/**
     * The key used to store `value` under the `type` namespace.
     * @type {?string}
     */key:{type:String},/**
     * The meta-data to store or retrieve.
     * @type {*}
     */value:{type:String,notify:!0},/**
     * If true, `value` is set to the iron-meta instance itself.
     */self:{type:Boolean,observer:"_selfChanged"},__meta:{type:Boolean,computed:"__computeMeta(type, key, value)"}},hostAttributes:{hidden:!0},__computeMeta:function(type,key,value){var meta=new IronMeta({type:type,key:key});if(value!==void 0&&value!==meta.value){meta.value=value}else if(this.value!==meta.value){this.value=meta.value}return meta},get list(){return this.__meta&&this.__meta.list},_selfChanged:function(self){if(self){this.value=this}},/**
   * Retrieves meta data value by key.
   *
   * @method byKey
   * @param {string} key The key of the meta-data to be returned.
   * @return {*}
   */byKey:function(key){return new IronMeta({type:this.type,key:key}).value}});var ironMeta={IronMeta:IronMeta};let IronValidatableBehaviorMeta=null;/**
                                                * `Use IronValidatableBehavior` to implement an element that validates
                                                * user input. Use the related `IronValidatorBehavior` to add custom
                                                * validation logic to an iron-input.
                                                *
                                                * By default, an `<iron-form>` element validates its fields when the user
                                                * presses the submit button. To validate a form imperatively, call the form's
                                                * `validate()` method, which in turn will call `validate()` on all its
                                                * children. By using `IronValidatableBehavior`, your custom element
                                                * will get a public `validate()`, which will return the validity of the
                                                * element, and a corresponding `invalid` attribute, which can be used for
                                                * styling.
                                                *
                                                * To implement the custom validation logic of your element, you must override
                                                * the protected `_getValidity()` method of this behaviour, rather than
                                                * `validate()`. See
                                                * [this](https://github.com/PolymerElements/iron-form/blob/master/demo/simple-element.html)
                                                * for an example.
                                                *
                                                * ### Accessibility
                                                *
                                                * Changing the `invalid` property, either manually or by calling `validate()`
                                                * will update the `aria-invalid` attribute.
                                                *
                                                * @demo demo/index.html
                                                * @polymerBehavior
                                                */const IronValidatableBehavior={properties:{/**
     * Name of the validator to use.
     */validator:{type:String},/**
     * True if the last call to `validate` is invalid.
     */invalid:{notify:!0,reflectToAttribute:!0,type:Boolean,value:!1,observer:"_invalidChanged"}},registered:function(){IronValidatableBehaviorMeta=new IronMeta({type:"validator"})},_invalidChanged:function(){if(this.invalid){this.setAttribute("aria-invalid","true")}else{this.removeAttribute("aria-invalid")}},/* Recompute this every time it's needed, because we don't know if the
   * underlying IronValidatableBehaviorMeta has changed. */get _validator(){return IronValidatableBehaviorMeta&&IronValidatableBehaviorMeta.byKey(this.validator)},/**
   * @return {boolean} True if the validator `validator` exists.
   */hasValidator:function(){return null!=this._validator},/**
   * Returns true if the `value` is valid, and updates `invalid`. If you want
   * your element to have custom validation logic, do not override this method;
   * override `_getValidity(value)` instead.
    * @param {Object} value Deprecated: The value to be validated. By default,
   * it is passed to the validator's `validate()` function, if a validator is
   set.
   * If this argument is not specified, then the element's `value` property
   * is used, if it exists.
   * @return {boolean} True if `value` is valid.
   */validate:function(value){// If this is an element that also has a value property, and there was
// no explicit value argument passed, use the element's property instead.
if(value===void 0&&this.value!==void 0)this.invalid=!this._getValidity(this.value);else this.invalid=!this._getValidity(value);return!this.invalid},/**
   * Returns true if `value` is valid.  By default, it is passed
   * to the validator's `validate()` function, if a validator is set. You
   * should override this method if you want to implement custom validity
   * logic for your element.
   *
   * @param {Object} value The value to be validated.
   * @return {boolean} True if `value` is valid.
   */_getValidity:function(value){if(this.hasValidator()){return this._validator.validate(value)}return!0}};var ironValidatableBehavior={get IronValidatableBehaviorMeta(){return IronValidatableBehaviorMeta},IronValidatableBehavior:IronValidatableBehavior};const IronCheckedElementBehaviorImpl={properties:{/**
     * Fired when the checked state changes.
     *
     * @event iron-change
     */ /**
         * Gets or sets the state, `true` is checked and `false` is unchecked.
         */checked:{type:Boolean,value:!1,reflectToAttribute:!0,notify:!0,observer:"_checkedChanged"},/**
     * If true, the button toggles the active state with each tap or press
     * of the spacebar.
     */toggles:{type:Boolean,value:!0,reflectToAttribute:!0},/* Overriden from IronFormElementBehavior */value:{type:String,value:"on",observer:"_valueChanged"}},observers:["_requiredChanged(required)"],created:function(){// Used by `iron-form` to handle the case that an element with this behavior
// doesn't have a role of 'checkbox' or 'radio', but should still only be
// included when the form is serialized if `this.checked === true`.
this._hasIronCheckedElementBehavior=!0},/**
   * Returns false if the element is required and not checked, and true
   * otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false or if `checked` is true.
   */_getValidity:function(_value){return this.disabled||!this.required||this.checked},/**
   * Update the aria-required label when `required` is changed.
   */_requiredChanged:function(){if(this.required){this.setAttribute("aria-required","true")}else{this.removeAttribute("aria-required")}},/**
   * Fire `iron-changed` when the checked state changes.
   */_checkedChanged:function(){this.active=this.checked;this.fire("iron-change")},/**
   * Reset value to 'on' if it is set to `undefined`.
   */_valueChanged:function(){if(this.value===void 0||null===this.value){this.value="on"}}},IronCheckedElementBehavior=[IronFormElementBehavior,IronValidatableBehavior,IronCheckedElementBehaviorImpl];/** @polymerBehavior */var ironCheckedElementBehavior={IronCheckedElementBehaviorImpl:IronCheckedElementBehaviorImpl,IronCheckedElementBehavior:IronCheckedElementBehavior};Polymer({_template:html`
    <style>
      :host {
        position: fixed;
      }

      #contentWrapper ::slotted(*) {
        overflow: auto;
      }

      #contentWrapper.animating ::slotted(*) {
        overflow: hidden;
        pointer-events: none;
      }
    </style>

    <div id="contentWrapper">
      <slot id="content" name="dropdown-content"></slot>
    </div>
`,is:"iron-dropdown",behaviors:[IronControlState,IronA11yKeysBehavior,IronOverlayBehavior,NeonAnimationRunnerBehavior],properties:{/**
     * The orientation against which to align the dropdown content
     * horizontally relative to the dropdown trigger.
     * Overridden from `Polymer.IronFitBehavior`.
     */horizontalAlign:{type:String,value:"left",reflectToAttribute:!0},/**
     * The orientation against which to align the dropdown content
     * vertically relative to the dropdown trigger.
     * Overridden from `Polymer.IronFitBehavior`.
     */verticalAlign:{type:String,value:"top",reflectToAttribute:!0},/**
     * An animation config. If provided, this will be used to animate the
     * opening of the dropdown. Pass an Array for multiple animations.
     * See `neon-animation` documentation for more animation configuration
     * details.
     */openAnimationConfig:{type:Object},/**
     * An animation config. If provided, this will be used to animate the
     * closing of the dropdown. Pass an Array for multiple animations.
     * See `neon-animation` documentation for more animation configuration
     * details.
     */closeAnimationConfig:{type:Object},/**
     * If provided, this will be the element that will be focused when
     * the dropdown opens.
     */focusTarget:{type:Object},/**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */noAnimations:{type:Boolean,value:!1},/**
     * By default, the dropdown will constrain scrolling on the page
     * to itself when opened.
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     * This property is a shortcut to set `scrollAction` to lock or refit.
     * Prefer directly setting the `scrollAction` property.
     */allowOutsideScroll:{type:Boolean,value:!1,observer:"_allowOutsideScrollChanged"}},listeners:{"neon-animation-finish":"_onNeonAnimationFinish"},observers:["_updateOverlayPosition(positionTarget, verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)"],/**
   * The element that is contained by the dropdown, if any.
   */get containedElement(){// Polymer 2.x returns slot.assignedNodes which can contain text nodes.
for(var nodes=dom(this.$.content).getDistributedNodes(),i=0,l=nodes.length;i<l;i++){if(nodes[i].nodeType===Node.ELEMENT_NODE){return nodes[i]}}},ready:function(){// Ensure scrollAction is set.
if(!this.scrollAction){this.scrollAction=this.allowOutsideScroll?"refit":"lock"}this._readied=!0},attached:function(){if(!this.sizingTarget||this.sizingTarget===this){this.sizingTarget=this.containedElement||this}},detached:function(){this.cancelAnimation()},/**
   * Called when the value of `opened` changes.
   * Overridden from `IronOverlayBehavior`
   */_openedChanged:function(){if(this.opened&&this.disabled){this.cancel()}else{this.cancelAnimation();this._updateAnimationConfig();IronOverlayBehaviorImpl._openedChanged.apply(this,arguments)}},/**
   * Overridden from `IronOverlayBehavior`.
   */_renderOpened:function(){if(!this.noAnimations&&this.animationConfig.open){this.$.contentWrapper.classList.add("animating");this.playAnimation("open")}else{IronOverlayBehaviorImpl._renderOpened.apply(this,arguments)}},/**
   * Overridden from `IronOverlayBehavior`.
   */_renderClosed:function(){if(!this.noAnimations&&this.animationConfig.close){this.$.contentWrapper.classList.add("animating");this.playAnimation("close")}else{IronOverlayBehaviorImpl._renderClosed.apply(this,arguments)}},/**
   * Called when animation finishes on the dropdown (when opening or
   * closing). Responsible for "completing" the process of opening or
   * closing the dropdown by positioning it or setting its display to
   * none.
   */_onNeonAnimationFinish:function(){this.$.contentWrapper.classList.remove("animating");if(this.opened){this._finishRenderOpened()}else{this._finishRenderClosed()}},/**
   * Constructs the final animation config from different properties used
   * to configure specific parts of the opening and closing animations.
   */_updateAnimationConfig:function(){// Update the animation node to be the containedElement.
for(var animationNode=this.containedElement,animations=[].concat(this.openAnimationConfig||[]).concat(this.closeAnimationConfig||[]),i=0;i<animations.length;i++){animations[i].node=animationNode}this.animationConfig={open:this.openAnimationConfig,close:this.closeAnimationConfig}},/**
   * Updates the overlay position based on configured horizontal
   * and vertical alignment.
   */_updateOverlayPosition:function(){if(this.isAttached){// This triggers iron-resize, and iron-overlay-behavior will call refit if
// needed.
this.notifyResize()}},/**
   * Sets scrollAction according to the value of allowOutsideScroll.
   * Prefer setting directly scrollAction.
   */_allowOutsideScrollChanged:function(allowOutsideScroll){// Wait until initial values are all set.
if(!this._readied){return}if(!allowOutsideScroll){this.scrollAction="lock"}else if(!this.scrollAction||"lock"===this.scrollAction){this.scrollAction="refit"}},/**
   * Apply focus to focusTarget or containedElement
   */_applyFocus:function(){var focusTarget=this.focusTarget||this.containedElement;if(focusTarget&&this.opened&&!this.noAutoFocus){focusTarget.focus()}else{IronOverlayBehaviorImpl._applyFocus.apply(this,arguments)}}});Polymer({_template:html`
    <style>
      :host {
        @apply --layout-inline;
        @apply --layout-center-center;
        position: relative;

        vertical-align: middle;

        fill: var(--iron-icon-fill-color, currentcolor);
        stroke: var(--iron-icon-stroke-color, none);

        width: var(--iron-icon-width, 24px);
        height: var(--iron-icon-height, 24px);
        @apply --iron-icon;
      }

      :host([hidden]) {
        display: none;
      }
    </style>
`,is:"iron-icon",properties:{/**
     * The name of the icon to use. The name should be of the form:
     * `iconset_name:icon_name`.
     */icon:{type:String},/**
     * The name of the theme to used, if one is specified by the
     * iconset.
     */theme:{type:String},/**
     * If using iron-icon without an iconset, you can set the src to be
     * the URL of an individual icon image file. Note that this will take
     * precedence over a given icon attribute.
     */src:{type:String},/**
     * @type {!IronMeta}
     */_meta:{value:Base.create("iron-meta",{type:"iconset"})}},observers:["_updateIcon(_meta, isAttached)","_updateIcon(theme, isAttached)","_srcChanged(src, isAttached)","_iconChanged(icon, isAttached)"],_DEFAULT_ICONSET:"icons",_iconChanged:function(icon){var parts=(icon||"").split(":");this._iconName=parts.pop();this._iconsetName=parts.pop()||this._DEFAULT_ICONSET;this._updateIcon()},_srcChanged:function(src){this._updateIcon()},_usesIconset:function(){return this.icon||!this.src},/** @suppress {visibility} */_updateIcon:function(){if(this._usesIconset()){if(this._img&&this._img.parentNode){dom(this.root).removeChild(this._img)}if(""===this._iconName){if(this._iconset){this._iconset.removeIcon(this)}}else if(this._iconsetName&&this._meta){this._iconset=/** @type {?Polymer.Iconset} */this._meta.byKey(this._iconsetName);if(this._iconset){this._iconset.applyIcon(this,this._iconName,this.theme);this.unlisten(window,"iron-iconset-added","_updateIcon")}else{this.listen(window,"iron-iconset-added","_updateIcon")}}}else{if(this._iconset){this._iconset.removeIcon(this)}if(!this._img){this._img=document.createElement("img");this._img.style.width="100%";this._img.style.height="100%";this._img.draggable=!1}this._img.src=this.src;dom(this.root).appendChild(this._img)}}});Polymer({is:"iron-iconset-svg",properties:{/**
     * The name of the iconset.
     */name:{type:String,observer:"_nameChanged"},/**
     * The size of an individual icon. Note that icons must be square.
     */size:{type:Number,value:24},/**
     * Set to true to enable mirroring of icons where specified when they are
     * stamped. Icons that should be mirrored should be decorated with a
     * `mirror-in-rtl` attribute.
     *
     * NOTE: For performance reasons, direction will be resolved once per
     * document per iconset, so moving icons in and out of RTL subtrees will
     * not cause their mirrored state to change.
     */rtlMirroring:{type:Boolean,value:!1},/**
     * Set to true to measure RTL based on the dir attribute on the body or
     * html elements (measured on document.body or document.documentElement as
     * available).
     */useGlobalRtlAttribute:{type:Boolean,value:!1}},created:function(){this._meta=new IronMeta({type:"iconset",key:null,value:null})},attached:function(){this.style.display="none"},/**
   * Construct an array of all icon names in this iconset.
   *
   * @return {!Array} Array of icon names.
   */getIconNames:function(){this._icons=this._createIconMap();return Object.keys(this._icons).map(function(n){return this.name+":"+n},this)},/**
   * Applies an icon to the given element.
   *
   * An svg icon is prepended to the element's shadowRoot if it exists,
   * otherwise to the element itself.
   *
   * If RTL mirroring is enabled, and the icon is marked to be mirrored in
   * RTL, the element will be tested (once and only once ever for each
   * iconset) to determine the direction of the subtree the element is in.
   * This direction will apply to all future icon applications, although only
   * icons marked to be mirrored will be affected.
   *
   * @method applyIcon
   * @param {Element} element Element to which the icon is applied.
   * @param {string} iconName Name of the icon to apply.
   * @return {?Element} The svg element which renders the icon.
   */applyIcon:function(element,iconName){// Remove old svg element
this.removeIcon(element);// install new svg element
var svg=this._cloneIcon(iconName,this.rtlMirroring&&this._targetIsRTL(element));if(svg){// insert svg element into shadow root, if it exists
var pde=dom(element.root||element);pde.insertBefore(svg,pde.childNodes[0]);return element._svgIcon=svg}return null},/**
   * Remove an icon from the given element by undoing the changes effected
   * by `applyIcon`.
   *
   * @param {Element} element The element from which the icon is removed.
   */removeIcon:function(element){// Remove old svg element
if(element._svgIcon){dom(element.root||element).removeChild(element._svgIcon);element._svgIcon=null}},/**
   * Measures and memoizes the direction of the element. Note that this
   * measurement is only done once and the result is memoized for future
   * invocations.
   */_targetIsRTL:function(target){if(null==this.__targetIsRTL){if(this.useGlobalRtlAttribute){var globalElement=document.body&&document.body.hasAttribute("dir")?document.body:document.documentElement;this.__targetIsRTL="rtl"===globalElement.getAttribute("dir")}else{if(target&&target.nodeType!==Node.ELEMENT_NODE){target=target.host}this.__targetIsRTL=target&&"rtl"===window.getComputedStyle(target).direction}}return this.__targetIsRTL},/**
   *
   * When name is changed, register iconset metadata
   *
   */_nameChanged:function(){this._meta.value=null;this._meta.key=this.name;this._meta.value=this;this.async(function(){this.fire("iron-iconset-added",this,{node:window})})},/**
   * Create a map of child SVG elements by id.
   *
   * @return {!Object} Map of id's to SVG elements.
   */_createIconMap:function(){// Objects chained to Object.prototype (`{}`) have members. Specifically,
// on FF there is a `watch` method that confuses the icon map, so we
// need to use a null-based object here.
var icons=Object.create(null);dom(this).querySelectorAll("[id]").forEach(function(icon){icons[icon.id]=icon});return icons},/**
   * Produce installable clone of the SVG element matching `id` in this
   * iconset, or `undefined` if there is no matching element.
   *
   * @return {Element} Returns an installable clone of the SVG element
   * matching `id`.
   */_cloneIcon:function(id,mirrorAllowed){// create the icon map on-demand, since the iconset itself has no discrete
// signal to know when it's children are fully parsed
this._icons=this._icons||this._createIconMap();return this._prepareSvgClone(this._icons[id],this.size,mirrorAllowed)},/**
   * @param {Element} sourceSvg
   * @param {number} size
   * @param {Boolean} mirrorAllowed
   * @return {Element}
   */_prepareSvgClone:function(sourceSvg,size,mirrorAllowed){if(sourceSvg){var content=sourceSvg.cloneNode(!0),svg=document.createElementNS("http://www.w3.org/2000/svg","svg"),viewBox=content.getAttribute("viewBox")||"0 0 "+size+" "+size,cssText="pointer-events: none; display: block; width: 100%; height: 100%;";if(mirrorAllowed&&content.hasAttribute("mirror-in-rtl")){cssText+="-webkit-transform:scale(-1,1);transform:scale(-1,1);transform-origin:center;"}svg.setAttribute("viewBox",viewBox);svg.setAttribute("preserveAspectRatio","xMidYMid meet");svg.setAttribute("focusable","false");// TODO(dfreedm): `pointer-events: none` works around
// https://crbug.com/370136
// TODO(sjmiles): inline style may not be ideal, but avoids requiring a
// shadow-root
svg.style.cssText=cssText;svg.appendChild(content).removeAttribute("id");return svg}return null}});Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }

      #baseURIAnchor {
        display: none;
      }

      #sizedImgDiv {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        display: none;
      }

      #img {
        display: block;
        width: var(--iron-image-width, auto);
        height: var(--iron-image-height, auto);
      }

      :host([sizing]) #sizedImgDiv {
        display: block;
      }

      :host([sizing]) #img {
        display: none;
      }

      #placeholder {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        background-color: inherit;
        opacity: 1;

        @apply --iron-image-placeholder;
      }

      #placeholder.faded-out {
        transition: opacity 0.5s linear;
        opacity: 0;
      }
    </style>

    <a id="baseURIAnchor" href="#"></a>
    <div id="sizedImgDiv" role="img" hidden$="[[_computeImgDivHidden(sizing)]]" aria-hidden$="[[_computeImgDivARIAHidden(alt)]]" aria-label$="[[_computeImgDivARIALabel(alt, src)]]"></div>
    <img id="img" alt$="[[alt]]" hidden$="[[_computeImgHidden(sizing)]]" crossorigin$="[[crossorigin]]" on-load="_imgOnLoad" on-error="_imgOnError">
    <div id="placeholder" hidden$="[[_computePlaceholderHidden(preload, fade, loading, loaded)]]" class$="[[_computePlaceholderClassName(preload, fade, loading, loaded)]]"></div>
`,is:"iron-image",properties:{/**
     * The URL of an image.
     */src:{type:String,value:""},/**
     * A short text alternative for the image.
     */alt:{type:String,value:null},/**
     * CORS enabled images support:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
     */crossorigin:{type:String,value:null},/**
     * When true, the image is prevented from loading and any placeholder is
     * shown.  This may be useful when a binding to the src property is known to
     * be invalid, to prevent 404 requests.
     */preventLoad:{type:Boolean,value:!1},/**
     * Sets a sizing option for the image.  Valid values are `contain` (full
     * aspect ratio of the image is contained within the element and
     * letterboxed) or `cover` (image is cropped in order to fully cover the
     * bounds of the element), or `null` (default: image takes natural size).
     */sizing:{type:String,value:null,reflectToAttribute:!0},/**
     * When a sizing option is used (`cover` or `contain`), this determines
     * how the image is aligned within the element bounds.
     */position:{type:String,value:"center"},/**
     * When `true`, any change to the `src` property will cause the
     * `placeholder` image to be shown until the new image has loaded.
     */preload:{type:Boolean,value:!1},/**
     * This image will be used as a background/placeholder until the src image
     * has loaded.  Use of a data-URI for placeholder is encouraged for instant
     * rendering.
     */placeholder:{type:String,value:null,observer:"_placeholderChanged"},/**
     * When `preload` is true, setting `fade` to true will cause the image to
     * fade into place.
     */fade:{type:Boolean,value:!1},/**
     * Read-only value that is true when the image is loaded.
     */loaded:{notify:!0,readOnly:!0,type:Boolean,value:!1},/**
     * Read-only value that tracks the loading state of the image when the
     * `preload` option is used.
     */loading:{notify:!0,readOnly:!0,type:Boolean,value:!1},/**
     * Read-only value that indicates that the last set `src` failed to load.
     */error:{notify:!0,readOnly:!0,type:Boolean,value:!1},/**
     * Can be used to set the width of image (e.g. via binding); size may also
     * be set via CSS.
     */width:{observer:"_widthChanged",type:Number,value:null},/**
     * Can be used to set the height of image (e.g. via binding); size may also
     * be set via CSS.
     *
     * @attribute height
     * @type number
     * @default null
     */height:{observer:"_heightChanged",type:Number,value:null}},observers:["_transformChanged(sizing, position)","_loadStateObserver(src, preventLoad)"],created:function(){this._resolvedSrc=""},_imgOnLoad:function(){if(this.$.img.src!==this._resolveSrc(this.src)){return}this._setLoading(!1);this._setLoaded(!0);this._setError(!1)},_imgOnError:function(){if(this.$.img.src!==this._resolveSrc(this.src)){return}this.$.img.removeAttribute("src");this.$.sizedImgDiv.style.backgroundImage="";this._setLoading(!1);this._setLoaded(!1);this._setError(!0)},_computePlaceholderHidden:function(){return!this.preload||!this.fade&&!this.loading&&this.loaded},_computePlaceholderClassName:function(){return this.preload&&this.fade&&!this.loading&&this.loaded?"faded-out":""},_computeImgDivHidden:function(){return!this.sizing},_computeImgDivARIAHidden:function(){return""===this.alt?"true":void 0},_computeImgDivARIALabel:function(){if(null!==this.alt){return this.alt}// Polymer.ResolveUrl.resolveUrl will resolve '' relative to a URL x to
// that URL x, but '' is the default for src.
if(""===this.src){return""}// NOTE: Use of `URL` was removed here because IE11 doesn't support
// constructing it. If this ends up being problematic, we should
// consider reverting and adding the URL polyfill as a dev dependency.
var resolved=this._resolveSrc(this.src);// Remove query parts, get file name.
return resolved.replace(/[?|#].*/g,"").split("/").pop()},_computeImgHidden:function(){return!!this.sizing},_widthChanged:function(){this.style.width=isNaN(this.width)?this.width:this.width+"px"},_heightChanged:function(){this.style.height=isNaN(this.height)?this.height:this.height+"px"},_loadStateObserver:function(src,preventLoad){var newResolvedSrc=this._resolveSrc(src);if(newResolvedSrc===this._resolvedSrc){return}this._resolvedSrc="";this.$.img.removeAttribute("src");this.$.sizedImgDiv.style.backgroundImage="";if(""===src||preventLoad){this._setLoading(!1);this._setLoaded(!1);this._setError(!1)}else{this._resolvedSrc=newResolvedSrc;this.$.img.src=this._resolvedSrc;this.$.sizedImgDiv.style.backgroundImage="url(\""+this._resolvedSrc+"\")";this._setLoading(!0);this._setLoaded(!1);this._setError(!1)}},_placeholderChanged:function(){this.$.placeholder.style.backgroundImage=this.placeholder?"url(\""+this.placeholder+"\")":""},_transformChanged:function(){var sizedImgDivStyle=this.$.sizedImgDiv.style,placeholderStyle=this.$.placeholder.style;sizedImgDivStyle.backgroundSize=placeholderStyle.backgroundSize=this.sizing;sizedImgDivStyle.backgroundPosition=placeholderStyle.backgroundPosition=this.sizing?this.position:"";sizedImgDivStyle.backgroundRepeat=placeholderStyle.backgroundRepeat=this.sizing?"no-repeat":""},_resolveSrc:function(testSrc){var resolved=resolveUrl(testSrc,this.$.baseURIAnchor.href);// NOTE: Use of `URL` was removed here because IE11 doesn't support
// constructing it. If this ends up being problematic, we should
// consider reverting and adding the URL polyfill as a dev dependency.
if(2<=resolved.length&&"/"===resolved[0]&&"/"!==resolved[1]){// In IE location.origin might not work
// https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
resolved=(location.origin||location.protocol+"//"+location.host)+resolved}return resolved}});Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
      }
    </style>
    <slot id="content"></slot>
`,is:"iron-input",behaviors:[IronValidatableBehavior],/**
   * Fired whenever `validate()` is called.
   *
   * @event iron-input-validate
   */properties:{/**
     * Use this property instead of `value` for two-way data binding, or to
     * set a default value for the input. **Do not** use the distributed
     * input's `value` property to set a default value.
     */bindValue:{type:String,value:""},/**
     * Computed property that echoes `bindValue` (mostly used for Polymer 1.0
     * backcompatibility, if you were one-way binding to the Polymer 1.0
     * `input is="iron-input"` value attribute).
     */value:{type:String,computed:"_computeValue(bindValue)"},/**
     * Regex-like list of characters allowed as input; all characters not in the
     * list will be rejected. The recommended format should be a list of allowed
     * characters, for example, `[a-zA-Z0-9.+-!;:]`.
     *
     * This pattern represents the allowed characters for the field; as the user
     * inputs text, each individual character will be checked against the
     * pattern (rather than checking the entire value as a whole). If a
     * character is not a match, it will be rejected.
     *
     * Pasted input will have each character checked individually; if any
     * character doesn't match `allowedPattern`, the entire pasted string will
     * be rejected.
     *
     * Note: if you were using `iron-input` in 1.0, you were also required to
     * set `prevent-invalid-input`. This is no longer needed as of Polymer 2.0,
     * and will be set automatically for you if an `allowedPattern` is provided.
     *
     */allowedPattern:{type:String},/**
     * Set to true to auto-validate the input value as you type.
     */autoValidate:{type:Boolean,value:!1},/**
     * The native input element.
     */_inputElement:Object},observers:["_bindValueChanged(bindValue, _inputElement)"],listeners:{input:"_onInput",keypress:"_onKeypress"},created:function(){IronA11yAnnouncer.requestAvailability();this._previousValidInput="";this._patternAlreadyChecked=!1},attached:function(){// If the input is added at a later time, update the internal reference.
this._observer=dom(this).observeNodes(function(info){this._initSlottedInput()}.bind(this))},detached:function(){if(this._observer){dom(this).unobserveNodes(this._observer);this._observer=null}},/**
   * Returns the distributed input element.
   */get inputElement(){return this._inputElement},_initSlottedInput:function(){this._inputElement=this.getEffectiveChildren()[0];if(this.inputElement&&this.inputElement.value){this.bindValue=this.inputElement.value}this.fire("iron-input-ready")},get _patternRegExp(){var pattern;if(this.allowedPattern){pattern=new RegExp(this.allowedPattern)}else{switch(this.inputElement.type){case"number":pattern=/[0-9.,e-]/;break;}}return pattern},/**
   * @suppress {checkTypes}
   */_bindValueChanged:function(bindValue,inputElement){// The observer could have run before attached() when we have actually
// initialized this property.
if(!inputElement){return}if(bindValue===void 0){inputElement.value=null}else if(bindValue!==inputElement.value){this.inputElement.value=bindValue}if(this.autoValidate){this.validate()}// manually notify because we don't want to notify until after setting value
this.fire("bind-value-changed",{value:bindValue})},_onInput:function(){// Need to validate each of the characters pasted if they haven't
// been validated inside `_onKeypress` already.
if(this.allowedPattern&&!this._patternAlreadyChecked){var valid=this._checkPatternValidity();if(!valid){this._announceInvalidCharacter("Invalid string of characters not entered.");this.inputElement.value=this._previousValidInput}}this.bindValue=this._previousValidInput=this.inputElement.value;this._patternAlreadyChecked=!1},_isPrintable:function(event){// What a control/printable character is varies wildly based on the browser.
// - most control characters (arrows, backspace) do not send a `keypress`
// event
//   in Chrome, but the *do* on Firefox
// - in Firefox, when they do send a `keypress` event, control chars have
//   a charCode = 0, keyCode = xx (for ex. 40 for down arrow)
// - printable characters always send a keypress event.
// - in Firefox, printable chars always have a keyCode = 0. In Chrome, the
// keyCode
//   always matches the charCode.
// None of this makes any sense.
// For these keys, ASCII code == browser keycode.
var anyNonPrintable=8==event.keyCode||// backspace
9==event.keyCode||// tab
13==event.keyCode||// enter
27==event.keyCode,mozNonPrintable=19==event.keyCode||// pause
20==event.keyCode||// caps lock
45==event.keyCode||// insert
46==event.keyCode||// delete
144==event.keyCode||// num lock
145==event.keyCode||// scroll lock
32<event.keyCode&&41>event.keyCode||// page up/down, end, home, arrows
111<event.keyCode&&124>event.keyCode;// escape
// For these keys, make sure it's a browser keycode and not an ASCII code.
// fn keys
return!anyNonPrintable&&!(0==event.charCode&&mozNonPrintable)},_onKeypress:function(event){if(!this.allowedPattern&&"number"!==this.inputElement.type){return}var regexp=this._patternRegExp;if(!regexp){return}// Handle special keys and backspace
if(event.metaKey||event.ctrlKey||event.altKey){return}// Check the pattern either here or in `_onInput`, but not in both.
this._patternAlreadyChecked=!0;var thisChar=String.fromCharCode(event.charCode);if(this._isPrintable(event)&&!regexp.test(thisChar)){event.preventDefault();this._announceInvalidCharacter("Invalid character "+thisChar+" not entered.")}},_checkPatternValidity:function(){var regexp=this._patternRegExp;if(!regexp){return!0}for(var i=0;i<this.inputElement.value.length;i++){if(!regexp.test(this.inputElement.value[i])){return!1}}return!0},/**
   * Returns true if `value` is valid. The validator provided in `validator`
   * will be used first, then any constraints.
   * @return {boolean} True if the value is valid.
   */validate:function(){if(!this.inputElement){this.invalid=!1;return!0}// Use the nested input's native validity.
var valid=this.inputElement.checkValidity();// Only do extra checking if the browser thought this was valid.
if(valid){// Empty, required input is invalid
if(this.required&&""===this.bindValue){valid=!1}else if(this.hasValidator()){valid=IronValidatableBehavior.validate.call(this,this.bindValue)}}this.invalid=!valid;this.fire("iron-input-validate");return valid},_announceInvalidCharacter:function(message){this.fire("iron-announce",{text:message})},_computeValue:function(bindValue){return bindValue}});class IronSelection{/**
   * @param {!Function} selectCallback
   * @suppress {missingProvide}
   */constructor(selectCallback){this.selection=[];this.selectCallback=selectCallback}/**
     * Retrieves the selected item(s).
     *
     * @returns Returns the selected item(s). If the multi property is true,
     * `get` will return an array, otherwise it will return
     * the selected item or undefined if there is no selection.
     */get(){return this.multi?this.selection.slice():this.selection[0]}/**
     * Clears all the selection except the ones indicated.
     *
     * @param {Array} excludes items to be excluded.
     */clear(excludes){this.selection.slice().forEach(function(item){if(!excludes||0>excludes.indexOf(item)){this.setItemSelected(item,!1)}},this)}/**
     * Indicates if a given item is selected.
     *
     * @param {*} item The item whose selection state should be checked.
     * @return {boolean} Returns true if `item` is selected.
     */isSelected(item){return 0<=this.selection.indexOf(item)}/**
     * Sets the selection state for a given item to either selected or deselected.
     *
     * @param {*} item The item to select.
     * @param {boolean} isSelected True for selected, false for deselected.
     */setItemSelected(item,isSelected){if(null!=item){if(isSelected!==this.isSelected(item)){// proceed to update selection only if requested state differs from
// current
if(isSelected){this.selection.push(item)}else{var i=this.selection.indexOf(item);if(0<=i){this.selection.splice(i,1)}}if(this.selectCallback){this.selectCallback(item,isSelected)}}}}/**
     * Sets the selection state for a given item. If the `multi` property
     * is true, then the selected state of `item` will be toggled; otherwise
     * the `item` will be selected.
     *
     * @param {*} item The item to select.
     */select(item){if(this.multi){this.toggle(item)}else if(this.get()!==item){this.setItemSelected(this.get(),!1);this.setItemSelected(item,!0)}}/**
     * Toggles the selection state for `item`.
     *
     * @param {*} item The item to toggle.
     */toggle(item){this.setItemSelected(item,!this.isSelected(item))}};var ironSelection={IronSelection:IronSelection};const IronSelectableBehavior={/**
   * Fired when iron-selector is activated (selected or deselected).
   * It is fired before the selected items are changed.
   * Cancel the event to abort selection.
   *
   * @event iron-activate
   */ /**
       * Fired when an item is selected
       *
       * @event iron-select
       */ /**
           * Fired when an item is deselected
           *
           * @event iron-deselect
           */ /**
               * Fired when the list of selectable items changes (e.g., items are
               * added or removed). The detail of the event is a mutation record that
               * describes what changed.
               *
               * @event iron-items-changed
               */properties:{/**
     * If you want to use an attribute value or property of an element for
     * `selected` instead of the index, set this to the name of the attribute
     * or property. Hyphenated values are converted to camel case when used to
     * look up the property of a selectable element. Camel cased values are
     * *not* converted to hyphenated values for attribute lookup. It's
     * recommended that you provide the hyphenated form of the name so that
     * selection works in both cases. (Use `attr-or-property-name` instead of
     * `attrOrPropertyName`.)
     */attrForSelected:{type:String,value:null},/**
     * Gets or sets the selected element. The default is to use the index of the
     * item.
     * @type {string|number}
     */selected:{type:String,notify:!0},/**
     * Returns the currently selected item.
     *
     * @type {?Object}
     */selectedItem:{type:Object,readOnly:!0,notify:!0},/**
     * The event that fires from items when they are selected. Selectable
     * will listen for this event from items and update the selection state.
     * Set to empty string to listen to no events.
     */activateEvent:{type:String,value:"tap",observer:"_activateEventChanged"},/**
     * This is a CSS selector string.  If this is set, only items that match the
     * CSS selector are selectable.
     */selectable:String,/**
     * The class to set on elements when selected.
     */selectedClass:{type:String,value:"iron-selected"},/**
     * The attribute to set on elements when selected.
     */selectedAttribute:{type:String,value:null},/**
     * Default fallback if the selection based on selected with
     * `attrForSelected` is not found.
     */fallbackSelection:{type:String,value:null},/**
     * The list of items from which a selection can be made.
     */items:{type:Array,readOnly:!0,notify:!0,value:function(){return[]}},/**
     * The set of excluded elements where the key is the `localName`
     * of the element that will be ignored from the item list.
     *
     * @default {template: 1}
     */_excludedLocalNames:{type:Object,value:function(){return{template:1,"dom-bind":1,"dom-if":1,"dom-repeat":1}}}},observers:["_updateAttrForSelected(attrForSelected)","_updateSelected(selected)","_checkFallback(fallbackSelection)"],created:function(){this._bindFilterItem=this._filterItem.bind(this);this._selection=new IronSelection(this._applySelection.bind(this))},attached:function(){this._observer=this._observeItems(this);this._addListener(this.activateEvent)},detached:function(){if(this._observer){dom(this).unobserveNodes(this._observer)}this._removeListener(this.activateEvent)},/**
   * Returns the index of the given item.
   *
   * @method indexOf
   * @param {Object} item
   * @returns Returns the index of the item
   */indexOf:function(item){return this.items?this.items.indexOf(item):-1},/**
   * Selects the given value.
   *
   * @method select
   * @param {string|number} value the value to select.
   */select:function(value){this.selected=value},/**
   * Selects the previous item.
   *
   * @method selectPrevious
   */selectPrevious:function(){var length=this.items.length,index=length-1;if(this.selected!==void 0){index=(+this._valueToIndex(this.selected)-1+length)%length}this.selected=this._indexToValue(index)},/**
   * Selects the next item.
   *
   * @method selectNext
   */selectNext:function(){var index=0;if(this.selected!==void 0){index=(+this._valueToIndex(this.selected)+1)%this.items.length}this.selected=this._indexToValue(index)},/**
   * Selects the item at the given index.
   *
   * @method selectIndex
   */selectIndex:function(index){this.select(this._indexToValue(index))},/**
   * Force a synchronous update of the `items` property.
   *
   * NOTE: Consider listening for the `iron-items-changed` event to respond to
   * updates to the set of selectable items after updates to the DOM list and
   * selection state have been made.
   *
   * WARNING: If you are using this method, you should probably consider an
   * alternate approach. Synchronously querying for items is potentially
   * slow for many use cases. The `items` property will update asynchronously
   * on its own to reflect selectable items in the DOM.
   */forceSynchronousItemUpdate:function(){if(this._observer&&"function"===typeof this._observer.flush){// NOTE(bicknellr): `dom.flush` above is no longer sufficient to trigger
// `observeNodes` callbacks. Polymer 2.x returns an object from
// `observeNodes` with a `flush` that synchronously gives the callback any
// pending MutationRecords (retrieved with `takeRecords`). Any case where
// ShadyDOM flushes were expected to synchronously trigger item updates
// will now require calling `forceSynchronousItemUpdate`.
this._observer.flush()}else{this._updateItems()}},// UNUSED, FOR API COMPATIBILITY
get _shouldUpdateSelection(){return null!=this.selected},_checkFallback:function(){this._updateSelected()},_addListener:function(eventName){this.listen(this,eventName,"_activateHandler")},_removeListener:function(eventName){this.unlisten(this,eventName,"_activateHandler")},_activateEventChanged:function(eventName,old){this._removeListener(old);this._addListener(eventName)},_updateItems:function(){var nodes=dom(this).queryDistributedElements(this.selectable||"*");nodes=Array.prototype.filter.call(nodes,this._bindFilterItem);this._setItems(nodes)},_updateAttrForSelected:function(){if(this.selectedItem){this.selected=this._valueForItem(this.selectedItem)}},_updateSelected:function(){this._selectSelected(this.selected)},_selectSelected:function(selected){if(!this.items){return}var item=this._valueToItem(this.selected);if(item){this._selection.select(item)}else{this._selection.clear()}// Check for items, since this array is populated only when attached
// Since Number(0) is falsy, explicitly check for undefined
if(this.fallbackSelection&&this.items.length&&this._selection.get()===void 0){this.selected=this.fallbackSelection}},_filterItem:function(node){return!this._excludedLocalNames[node.localName]},_valueToItem:function(value){return null==value?null:this.items[this._valueToIndex(value)]},_valueToIndex:function(value){if(this.attrForSelected){for(var i=0,item;item=this.items[i];i++){if(this._valueForItem(item)==value){return i}}}else{return+value}},_indexToValue:function(index){if(this.attrForSelected){var item=this.items[index];if(item){return this._valueForItem(item)}}else{return index}},_valueForItem:function(item){if(!item){return null}if(!this.attrForSelected){var i=this.indexOf(item);return-1===i?null:i}var propValue=item[dashToCamelCase(this.attrForSelected)];return propValue!=void 0?propValue:item.getAttribute(this.attrForSelected)},_applySelection:function(item,isSelected){if(this.selectedClass){this.toggleClass(this.selectedClass,isSelected,item)}if(this.selectedAttribute){this.toggleAttribute(this.selectedAttribute,isSelected,item)}this._selectionChange();this.fire("iron-"+(isSelected?"select":"deselect"),{item:item})},_selectionChange:function(){this._setSelectedItem(this._selection.get())},// observe items change under the given node.
_observeItems:function(node){return dom(node).observeNodes(function(mutation){this._updateItems();this._updateSelected();// Let other interested parties know about the change so that
// we don't have to recreate mutation observers everywhere.
this.fire("iron-items-changed",mutation,{bubbles:!1,cancelable:!1})})},_activateHandler:function(e){var t=e.target,items=this.items;while(t&&t!=this){var i=items.indexOf(t);if(0<=i){var value=this._indexToValue(i);this._itemActivate(value,t);return}t=t.parentNode}},_itemActivate:function(value,item){if(!this.fire("iron-activate",{selected:value,item:item},{cancelable:!0}).defaultPrevented){this.select(value)}}};var ironSelectable={IronSelectableBehavior:IronSelectableBehavior};const IronMultiSelectableBehaviorImpl={properties:{/**
     * If true, multiple selections are allowed.
     */multi:{type:Boolean,value:!1,observer:"multiChanged"},/**
     * Gets or sets the selected elements. This is used instead of `selected`
     * when `multi` is true.
     */selectedValues:{type:Array,notify:!0,value:function(){return[]}},/**
     * Returns an array of currently selected items.
     */selectedItems:{type:Array,readOnly:!0,notify:!0,value:function(){return[]}}},observers:["_updateSelected(selectedValues.splices)"],/**
   * Selects the given value. If the `multi` property is true, then the selected
   * state of the `value` will be toggled; otherwise the `value` will be
   * selected.
   *
   * @method select
   * @param {string|number} value the value to select.
   */select:function(value){if(this.multi){this._toggleSelected(value)}else{this.selected=value}},multiChanged:function(multi){this._selection.multi=multi;this._updateSelected()},// UNUSED, FOR API COMPATIBILITY
get _shouldUpdateSelection(){return null!=this.selected||null!=this.selectedValues&&this.selectedValues.length},_updateAttrForSelected:function(){if(!this.multi){IronSelectableBehavior._updateAttrForSelected.apply(this)}else if(this.selectedItems&&0<this.selectedItems.length){this.selectedValues=this.selectedItems.map(function(selectedItem){return this._indexToValue(this.indexOf(selectedItem))},this).filter(function(unfilteredValue){return null!=unfilteredValue},this)}},_updateSelected:function(){if(this.multi){this._selectMulti(this.selectedValues)}else{this._selectSelected(this.selected)}},_selectMulti:function(values){values=values||[];var selectedItems=(this._valuesToItems(values)||[]).filter(function(item){return null!==item&&item!==void 0});// clear all but the current selected items
this._selection.clear(selectedItems);// select only those not selected yet
for(var i=0;i<selectedItems.length;i++){this._selection.setItemSelected(selectedItems[i],!0)}// Check for items, since this array is populated only when attached
if(this.fallbackSelection&&!this._selection.get().length){var fallback=this._valueToItem(this.fallbackSelection);if(fallback){this.select(this.fallbackSelection)}}},_selectionChange:function(){var s=this._selection.get();if(this.multi){this._setSelectedItems(s);this._setSelectedItem(s.length?s[0]:null)}else{if(null!==s&&s!==void 0){this._setSelectedItems([s]);this._setSelectedItem(s)}else{this._setSelectedItems([]);this._setSelectedItem(null)}}},_toggleSelected:function(value){var i=this.selectedValues.indexOf(value),unselected=0>i;if(unselected){this.push("selectedValues",value)}else{this.splice("selectedValues",i,1)}},_valuesToItems:function(values){return null==values?null:values.map(function(value){return this._valueToItem(value)},this)}},IronMultiSelectableBehavior=[IronSelectableBehavior,IronMultiSelectableBehaviorImpl];/** @polymerBehavior */var ironMultiSelectable={IronMultiSelectableBehaviorImpl:IronMultiSelectableBehaviorImpl,IronMultiSelectableBehavior:IronMultiSelectableBehavior};const IronMenuBehaviorImpl={properties:{/**
     * Returns the currently focused item.
     * @type {?Object}
     */focusedItem:{observer:"_focusedItemChanged",readOnly:!0,type:Object},/**
     * The attribute to use on menu items to look up the item title. Typing the
     * first letter of an item when the menu is open focuses that item. If
     * unset, `textContent` will be used.
     */attrForItemTitle:{type:String},/**
     * @type {boolean}
     */disabled:{type:Boolean,value:!1,observer:"_disabledChanged"}},/**
   * The list of keys has been taken from
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
   * @private
   */_MODIFIER_KEYS:["Alt","AltGraph","CapsLock","Control","Fn","FnLock","Hyper","Meta","NumLock","OS","ScrollLock","Shift","Super","Symbol","SymbolLock"],/** @private */_SEARCH_RESET_TIMEOUT_MS:1e3,/** @private */_previousTabIndex:0,hostAttributes:{role:"menu"},observers:["_updateMultiselectable(multi)"],listeners:{focus:"_onFocus",keydown:"_onKeydown","iron-items-changed":"_onIronItemsChanged"},/**
   * @type {!Object}
   */keyBindings:{up:"_onUpKey",down:"_onDownKey",esc:"_onEscKey","shift+tab:keydown":"_onShiftTabDown"},attached:function(){this._resetTabindices()},/**
   * Selects the given value. If the `multi` property is true, then the selected
   * state of the `value` will be toggled; otherwise the `value` will be
   * selected.
   *
   * @param {string|number} value the value to select.
   */select:function(value){// Cancel automatically focusing a default item if the menu received focus
// through a user action selecting a particular item.
if(this._defaultFocusAsync){this.cancelAsync(this._defaultFocusAsync);this._defaultFocusAsync=null}var item=this._valueToItem(value);if(item&&item.hasAttribute("disabled"))return;this._setFocusedItem(item);IronMultiSelectableBehaviorImpl.select.apply(this,arguments)},/**
   * Resets all tabindex attributes to the appropriate value based on the
   * current selection state. The appropriate value is `0` (focusable) for
   * the default selected item, and `-1` (not keyboard focusable) for all
   * other items. Also sets the correct initial values for aria-selected
   * attribute, true for default selected item and false for others.
   */_resetTabindices:function(){var firstSelectedItem=this.multi?this.selectedItems&&this.selectedItems[0]:this.selectedItem;this.items.forEach(function(item){item.setAttribute("tabindex",item===firstSelectedItem?"0":"-1");item.setAttribute("aria-selected",this._selection.isSelected(item))},this)},/**
   * Sets appropriate ARIA based on whether or not the menu is meant to be
   * multi-selectable.
   *
   * @param {boolean} multi True if the menu should be multi-selectable.
   */_updateMultiselectable:function(multi){if(multi){this.setAttribute("aria-multiselectable","true")}else{this.removeAttribute("aria-multiselectable")}},/**
   * Given a KeyboardEvent, this method will focus the appropriate item in the
   * menu (if there is a relevant item, and it is possible to focus it).
   *
   * @param {KeyboardEvent} event A KeyboardEvent.
   */_focusWithKeyboardEvent:function(event){// Make sure that the key pressed is not a modifier key.
// getModifierState is not being used, as it is not available in Safari
// earlier than 10.0.2 (https://trac.webkit.org/changeset/206725/webkit)
if(-1!==this._MODIFIER_KEYS.indexOf(event.key))return;this.cancelDebouncer("_clearSearchText");var searchText=this._searchText||"",key=event.key&&1==event.key.length?event.key:String.fromCharCode(event.keyCode);searchText+=key.toLocaleLowerCase();for(var searchLength=searchText.length,i=0,item;item=this.items[i];i++){if(item.hasAttribute("disabled")){continue}var attr=this.attrForItemTitle||"textContent",title=(item[attr]||item.getAttribute(attr)||"").trim();if(title.length<searchLength){continue}if(title.slice(0,searchLength).toLocaleLowerCase()==searchText){this._setFocusedItem(item);break}}this._searchText=searchText;this.debounce("_clearSearchText",this._clearSearchText,this._SEARCH_RESET_TIMEOUT_MS)},_clearSearchText:function(){this._searchText=""},/**
   * Focuses the previous item (relative to the currently focused item) in the
   * menu, disabled items will be skipped.
   * Loop until length + 1 to handle case of single item in menu.
   */_focusPrevious:function(){for(var length=this.items.length,curFocusIndex=+this.indexOf(this.focusedItem),i=1,item;i<length+1;i++){item=this.items[(curFocusIndex-i+length)%length];if(!item.hasAttribute("disabled")){var owner=dom(item).getOwnerRoot()||document;this._setFocusedItem(item);// Focus might not have worked, if the element was hidden or not
// focusable. In that case, try again.
if(dom(owner).activeElement==item){return}}}},/**
   * Focuses the next item (relative to the currently focused item) in the
   * menu, disabled items will be skipped.
   * Loop until length + 1 to handle case of single item in menu.
   */_focusNext:function(){for(var length=this.items.length,curFocusIndex=+this.indexOf(this.focusedItem),i=1,item;i<length+1;i++){item=this.items[(curFocusIndex+i)%length];if(!item.hasAttribute("disabled")){var owner=dom(item).getOwnerRoot()||document;this._setFocusedItem(item);// Focus might not have worked, if the element was hidden or not
// focusable. In that case, try again.
if(dom(owner).activeElement==item){return}}}},/**
   * Mutates items in the menu based on provided selection details, so that
   * all items correctly reflect selection state.
   *
   * @param {Element} item An item in the menu.
   * @param {boolean} isSelected True if the item should be shown in a
   * selected state, otherwise false.
   */_applySelection:function(item,isSelected){if(isSelected){item.setAttribute("aria-selected","true")}else{item.setAttribute("aria-selected","false")}IronSelectableBehavior._applySelection.apply(this,arguments)},/**
   * Discretely updates tabindex values among menu items as the focused item
   * changes.
   *
   * @param {Element} focusedItem The element that is currently focused.
   * @param {?Element} old The last element that was considered focused, if
   * applicable.
   */_focusedItemChanged:function(focusedItem,old){old&&old.setAttribute("tabindex","-1");if(focusedItem&&!focusedItem.hasAttribute("disabled")&&!this.disabled){focusedItem.setAttribute("tabindex","0");focusedItem.focus()}},/**
   * A handler that responds to mutation changes related to the list of items
   * in the menu.
   *
   * @param {CustomEvent} event An event containing mutation records as its
   * detail.
   */_onIronItemsChanged:function(event){if(event.detail.addedNodes.length){this._resetTabindices()}},/**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param {CustomEvent} event A key combination event.
   */_onShiftTabDown:function(event){var oldTabIndex=this.getAttribute("tabindex");IronMenuBehaviorImpl._shiftTabPressed=!0;this._setFocusedItem(null);this.setAttribute("tabindex","-1");this.async(function(){this.setAttribute("tabindex",oldTabIndex);IronMenuBehaviorImpl._shiftTabPressed=!1;// NOTE(cdata): polymer/polymer#1305
},1)},/**
   * Handler that is called when the menu receives focus.
   *
   * @param {FocusEvent} event A focus event.
   */_onFocus:function(event){if(IronMenuBehaviorImpl._shiftTabPressed){// do not focus the menu itself
return}// Do not focus the selected tab if the deepest target is part of the
// menu element's local DOM and is focusable.
var rootTarget=/** @type {?HTMLElement} */dom(event).rootTarget;if(rootTarget!==this&&"undefined"!==typeof rootTarget.tabIndex&&!this.isLightDescendant(rootTarget)){return}// clear the cached focus item
this._defaultFocusAsync=this.async(function(){// focus the selected item when the menu receives focus, or the first item
// if no item is selected
var firstSelectedItem=this.multi?this.selectedItems&&this.selectedItems[0]:this.selectedItem;this._setFocusedItem(null);if(firstSelectedItem){this._setFocusedItem(firstSelectedItem)}else if(this.items[0]){// We find the first none-disabled item (if one exists)
this._focusNext()}})},/**
   * Handler that is called when the up key is pressed.
   *
   * @param {CustomEvent} event A key combination event.
   */_onUpKey:function(event){// up and down arrows moves the focus
this._focusPrevious();event.detail.keyboardEvent.preventDefault()},/**
   * Handler that is called when the down key is pressed.
   *
   * @param {CustomEvent} event A key combination event.
   */_onDownKey:function(event){this._focusNext();event.detail.keyboardEvent.preventDefault()},/**
   * Handler that is called when the esc key is pressed.
   *
   * @param {CustomEvent} event A key combination event.
   */_onEscKey:function(event){var focusedItem=this.focusedItem;if(focusedItem){focusedItem.blur()}},/**
   * Handler that is called when a keydown event is detected.
   *
   * @param {KeyboardEvent} event A keyboard event.
   */_onKeydown:function(event){if(!this.keyboardEventMatchesKeys(event,"up down esc")){// all other keys focus the menu item starting with that character
this._focusWithKeyboardEvent(event)}event.stopPropagation()},// override _activateHandler
_activateHandler:function(event){IronSelectableBehavior._activateHandler.call(this,event);event.stopPropagation()},/**
   * Updates this element's tab index when it's enabled/disabled.
   * @param {boolean} disabled
   */_disabledChanged:function(disabled){if(disabled){this._previousTabIndex=this.hasAttribute("tabindex")?this.tabIndex:0;this.removeAttribute("tabindex");// No tabindex means not tab-able or select-able.
}else if(!this.hasAttribute("tabindex")){this.setAttribute("tabindex",this._previousTabIndex)}},_shiftTabPressed:!1},IronMenuBehavior=[IronMultiSelectableBehavior,IronA11yKeysBehavior,IronMenuBehaviorImpl];var ironMenuBehavior={IronMenuBehaviorImpl:IronMenuBehaviorImpl,IronMenuBehavior:IronMenuBehavior};const NeonAnimationBehavior={properties:{/**
     * Defines the animation timing.
     */animationTiming:{type:Object,value:function(){return{duration:500,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"both"}}}},/**
   * Can be used to determine that elements implement this behavior.
   */isNeonAnimation:!0,/**
   * Do any animation configuration here.
   */ // configure: function(config) {
// },
created:function(){if(!document.body.animate){console.warn("No web animations detected. This element will not"+" function without a web animations polyfill.")}},/**
   * Returns the animation timing by mixing in properties from `config` to the
   * defaults defined by the animation.
   */timingFromConfig:function(config){if(config.timing){for(var property in config.timing){this.animationTiming[property]=config.timing[property]}}return this.animationTiming},/**
   * Sets `transform` and `transformOrigin` properties along with the prefixed
   * versions.
   */setPrefixedProperty:function(node,property,value){for(var map={transform:["webkitTransform"],transformOrigin:["mozTransformOrigin","webkitTransformOrigin"]},prefixes=map[property],prefix,index=0;prefix=prefixes[index];index++){node.style[prefix]=value}node.style[property]=value},/**
   * Called when the animation finishes.
   */complete:function(config){}};var neonAnimationBehavior={NeonAnimationBehavior:NeonAnimationBehavior};Polymer({is:"fade-in-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node;this._effect=new KeyframeEffect(node,[{opacity:"0"},{opacity:"1"}],this.timingFromConfig(config));return this._effect}});Polymer({is:"fade-out-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node;this._effect=new KeyframeEffect(node,[{opacity:"1"},{opacity:"0"}],this.timingFromConfig(config));return this._effect}});var Utility={distance:function(x1,y1,x2,y2){var xDelta=x1-x2,yDelta=y1-y2;return Math.sqrt(xDelta*xDelta+yDelta*yDelta)},now:window.performance&&window.performance.now?window.performance.now.bind(window.performance):Date.now};/**
    * @param {HTMLElement} element
    * @constructor
    */function ElementMetrics(element){this.element=element;this.width=this.boundingRect.width;this.height=this.boundingRect.height;this.size=Math.max(this.width,this.height)}ElementMetrics.prototype={get boundingRect(){return this.element.getBoundingClientRect()},furthestCornerDistanceFrom:function(x,y){var topLeft=Utility.distance(x,y,0,0),topRight=Utility.distance(x,y,this.width,0),bottomLeft=Utility.distance(x,y,0,this.height),bottomRight=Utility.distance(x,y,this.width,this.height);return Math.max(topLeft,topRight,bottomLeft,bottomRight)}};/**
    * @param {HTMLElement} element
    * @constructor
    */function Ripple(element){this.element=element;this.color=window.getComputedStyle(element).color;this.wave=document.createElement("div");this.waveContainer=document.createElement("div");this.wave.style.backgroundColor=this.color;this.wave.classList.add("wave");this.waveContainer.classList.add("wave-container");dom(this.waveContainer).appendChild(this.wave);this.resetInteractionState()}Ripple.MAX_RADIUS=300;Ripple.prototype={get recenters(){return this.element.recenters},get center(){return this.element.center},get mouseDownElapsed(){var elapsed;if(!this.mouseDownStart){return 0}elapsed=Utility.now()-this.mouseDownStart;if(this.mouseUpStart){elapsed-=this.mouseUpElapsed}return elapsed},get mouseUpElapsed(){return this.mouseUpStart?Utility.now()-this.mouseUpStart:0},get mouseDownElapsedSeconds(){return this.mouseDownElapsed/1e3},get mouseUpElapsedSeconds(){return this.mouseUpElapsed/1e3},get mouseInteractionSeconds(){return this.mouseDownElapsedSeconds+this.mouseUpElapsedSeconds},get initialOpacity(){return this.element.initialOpacity},get opacityDecayVelocity(){return this.element.opacityDecayVelocity},get radius(){var width2=this.containerMetrics.width*this.containerMetrics.width,height2=this.containerMetrics.height*this.containerMetrics.height,waveRadius=1.1*Math.min(Math.sqrt(width2+height2),Ripple.MAX_RADIUS)+5,duration=1.1-.2*(waveRadius/Ripple.MAX_RADIUS),timeNow=this.mouseInteractionSeconds/duration,size=waveRadius*(1-Math.pow(80,-timeNow));return Math.abs(size)},get opacity(){if(!this.mouseUpStart){return this.initialOpacity}return Math.max(0,this.initialOpacity-this.mouseUpElapsedSeconds*this.opacityDecayVelocity)},get outerOpacity(){// Linear increase in background opacity, capped at the opacity
// of the wavefront (waveOpacity).
var outerOpacity=.3*this.mouseUpElapsedSeconds,waveOpacity=this.opacity;return Math.max(0,Math.min(outerOpacity,waveOpacity))},get isOpacityFullyDecayed(){return .01>this.opacity&&this.radius>=Math.min(this.maxRadius,Ripple.MAX_RADIUS)},get isRestingAtMaxRadius(){return this.opacity>=this.initialOpacity&&this.radius>=Math.min(this.maxRadius,Ripple.MAX_RADIUS)},get isAnimationComplete(){return this.mouseUpStart?this.isOpacityFullyDecayed:this.isRestingAtMaxRadius},get translationFraction(){return Math.min(1,2*(this.radius/this.containerMetrics.size)/Math.sqrt(2))},get xNow(){if(this.xEnd){return this.xStart+this.translationFraction*(this.xEnd-this.xStart)}return this.xStart},get yNow(){if(this.yEnd){return this.yStart+this.translationFraction*(this.yEnd-this.yStart)}return this.yStart},get isMouseDown(){return this.mouseDownStart&&!this.mouseUpStart},resetInteractionState:function(){this.maxRadius=0;this.mouseDownStart=0;this.mouseUpStart=0;this.xStart=0;this.yStart=0;this.xEnd=0;this.yEnd=0;this.slideDistance=0;this.containerMetrics=new ElementMetrics(this.element)},draw:function(){var scale,dx,dy;this.wave.style.opacity=this.opacity;scale=this.radius/(this.containerMetrics.size/2);dx=this.xNow-this.containerMetrics.width/2;dy=this.yNow-this.containerMetrics.height/2;// 2d transform for safari because of border-radius and overflow:hidden
// clipping bug. https://bugs.webkit.org/show_bug.cgi?id=98538
this.waveContainer.style.webkitTransform="translate("+dx+"px, "+dy+"px)";this.waveContainer.style.transform="translate3d("+dx+"px, "+dy+"px, 0)";this.wave.style.webkitTransform="scale("+scale+","+scale+")";this.wave.style.transform="scale3d("+scale+","+scale+",1)"},/** @param {Event=} event */downAction:function(event){var xCenter=this.containerMetrics.width/2,yCenter=this.containerMetrics.height/2;this.resetInteractionState();this.mouseDownStart=Utility.now();if(this.center){this.xStart=xCenter;this.yStart=yCenter;this.slideDistance=Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd)}else{this.xStart=event?event.detail.x-this.containerMetrics.boundingRect.left:this.containerMetrics.width/2;this.yStart=event?event.detail.y-this.containerMetrics.boundingRect.top:this.containerMetrics.height/2}if(this.recenters){this.xEnd=xCenter;this.yEnd=yCenter;this.slideDistance=Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd)}this.maxRadius=this.containerMetrics.furthestCornerDistanceFrom(this.xStart,this.yStart);this.waveContainer.style.top=(this.containerMetrics.height-this.containerMetrics.size)/2+"px";this.waveContainer.style.left=(this.containerMetrics.width-this.containerMetrics.size)/2+"px";this.waveContainer.style.width=this.containerMetrics.size+"px";this.waveContainer.style.height=this.containerMetrics.size+"px"},/** @param {Event=} event */upAction:function(event){if(!this.isMouseDown){return}this.mouseUpStart=Utility.now()},remove:function(){dom(this.waveContainer.parentNode).removeChild(this.waveContainer)}};/**
   Material design: [Surface
   reaction](https://www.google.com/design/spec/animation/responsive-interaction.html#responsive-interaction-surface-reaction)
   
   `paper-ripple` provides a visual effect that other paper elements can
   use to simulate a rippling effect emanating from the point of contact.  The
   effect can be visualized as a concentric circle with motion.
   
   Example:
   
       <div style="position:relative">
         <paper-ripple></paper-ripple>
       </div>
   
   Note, it's important that the parent container of the ripple be relative
   position, otherwise the ripple will emanate outside of the desired container.
   
   `paper-ripple` listens to "mousedown" and "mouseup" events so it would display
   ripple effect when touches on it.  You can also defeat the default behavior and
   manually route the down and up actions to the ripple element.  Note that it is
   important if you call `downAction()` you will have to make sure to call
   `upAction()` so that `paper-ripple` would end the animation loop.
   
   Example:
   
       <paper-ripple id="ripple" style="pointer-events: none;"></paper-ripple>
       ...
       downAction: function(e) {
         this.$.ripple.downAction(e.detail);
       },
       upAction: function(e) {
         this.$.ripple.upAction();
       }
   
   Styling ripple effect:
   
     Use CSS color property to style the ripple:
   
       paper-ripple {
         color: #4285f4;
       }
   
     Note that CSS color property is inherited so it is not required to set it on
     the `paper-ripple` element directly.
   
   By default, the ripple is centered on the point of contact.  Apply the
   `recenters` attribute to have the ripple grow toward the center of its
   container.
   
       <paper-ripple recenters></paper-ripple>
   
   You can also  center the ripple inside its container from the start.
   
       <paper-ripple center></paper-ripple>
   
   Apply `circle` class to make the rippling effect within a circle.
   
       <paper-ripple class="circle"></paper-ripple>
   
   @group Paper Elements
   @element paper-ripple
   @hero hero.svg
   @demo demo/index.html
   */Polymer({_template:html`
    <style>
      :host {
        display: block;
        position: absolute;
        border-radius: inherit;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* See PolymerElements/paper-behaviors/issues/34. On non-Chrome browsers,
         * creating a node (with a position:absolute) in the middle of an event
         * handler "interrupts" that event handler (which happens when the
         * ripple is created on demand) */
        pointer-events: none;
      }

      :host([animating]) {
        /* This resolves a rendering issue in Chrome (as of 40) where the
           ripple is not properly clipped by its parent (which may have
           rounded corners). See: http://jsbin.com/temexa/4

           Note: We only apply this style conditionally. Otherwise, the browser
           will create a new compositing layer for every ripple element on the
           page, and that would be bad. */
        -webkit-transform: translate(0, 0);
        transform: translate3d(0, 0, 0);
      }

      #background,
      #waves,
      .wave-container,
      .wave {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      #background,
      .wave {
        opacity: 0;
      }

      #waves,
      .wave {
        overflow: hidden;
      }

      .wave-container,
      .wave {
        border-radius: 50%;
      }

      :host(.circle) #background,
      :host(.circle) #waves {
        border-radius: 50%;
      }

      :host(.circle) .wave-container {
        overflow: hidden;
      }
    </style>

    <div id="background"></div>
    <div id="waves"></div>
`,is:"paper-ripple",behaviors:[IronA11yKeysBehavior],properties:{/**
     * The initial opacity set on the wave.
     *
     * @attribute initialOpacity
     * @type number
     * @default 0.25
     */initialOpacity:{type:Number,value:.25},/**
     * How fast (opacity per second) the wave fades out.
     *
     * @attribute opacityDecayVelocity
     * @type number
     * @default 0.8
     */opacityDecayVelocity:{type:Number,value:.8},/**
     * If true, ripples will exhibit a gravitational pull towards
     * the center of their container as they fade away.
     *
     * @attribute recenters
     * @type boolean
     * @default false
     */recenters:{type:Boolean,value:!1},/**
     * If true, ripples will center inside its container
     *
     * @attribute recenters
     * @type boolean
     * @default false
     */center:{type:Boolean,value:!1},/**
     * A list of the visual ripples.
     *
     * @attribute ripples
     * @type Array
     * @default []
     */ripples:{type:Array,value:function(){return[]}},/**
     * True when there are visible ripples animating within the
     * element.
     */animating:{type:Boolean,readOnly:!0,reflectToAttribute:!0,value:!1},/**
     * If true, the ripple will remain in the "down" state until `holdDown`
     * is set to false again.
     */holdDown:{type:Boolean,value:!1,observer:"_holdDownChanged"},/**
     * If true, the ripple will not generate a ripple effect
     * via pointer interaction.
     * Calling ripple's imperative api like `simulatedRipple` will
     * still generate the ripple effect.
     */noink:{type:Boolean,value:!1},_animating:{type:Boolean},_boundAnimate:{type:Function,value:function(){return this.animate.bind(this)}}},get target(){return this.keyEventTarget},/**
   * @type {!Object}
   */keyBindings:{"enter:keydown":"_onEnterKeydown","space:keydown":"_onSpaceKeydown","space:keyup":"_onSpaceKeyup"},attached:function(){// Set up a11yKeysBehavior to listen to key events on the target,
// so that space and enter activate the ripple even if the target doesn't
// handle key events. The key handlers deal with `noink` themselves.
if(11==this.parentNode.nodeType){// DOCUMENT_FRAGMENT_NODE
this.keyEventTarget=dom(this).getOwnerRoot().host}else{this.keyEventTarget=this.parentNode}var keyEventTarget=/** @type {!EventTarget} */this.keyEventTarget;this.listen(keyEventTarget,"up","uiUpAction");this.listen(keyEventTarget,"down","uiDownAction")},detached:function(){this.unlisten(this.keyEventTarget,"up","uiUpAction");this.unlisten(this.keyEventTarget,"down","uiDownAction");this.keyEventTarget=null},get shouldKeepAnimating(){for(var index=0;index<this.ripples.length;++index){if(!this.ripples[index].isAnimationComplete){return!0}}return!1},simulatedRipple:function(){this.downAction(null);// Please see polymer/polymer#1305
this.async(function(){this.upAction()},1)},/**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   * @param {Event=} event
   */uiDownAction:function(event){if(!this.noink){this.downAction(event)}},/**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {Event=} event
   */downAction:function(event){if(this.holdDown&&0<this.ripples.length){return}var ripple=this.addRipple();ripple.downAction(event);if(!this._animating){this._animating=!0;this.animate()}},/**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   * @param {Event=} event
   */uiUpAction:function(event){if(!this.noink){this.upAction(event)}},/**
   * Provokes a ripple up effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {Event=} event
   */upAction:function(event){if(this.holdDown){return}this.ripples.forEach(function(ripple){ripple.upAction(event)});this._animating=!0;this.animate()},onAnimationComplete:function(){this._animating=!1;this.$.background.style.backgroundColor=null;this.fire("transitionend")},addRipple:function(){var ripple=new Ripple(this);dom(this.$.waves).appendChild(ripple.waveContainer);this.$.background.style.backgroundColor=ripple.color;this.ripples.push(ripple);this._setAnimating(!0);return ripple},removeRipple:function(ripple){var rippleIndex=this.ripples.indexOf(ripple);if(0>rippleIndex){return}this.ripples.splice(rippleIndex,1);ripple.remove();if(!this.ripples.length){this._setAnimating(!1)}},/**
   * Deprecated. Please use animateRipple() instead.
   *
   * This method name conflicts with Element#animate().
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/animate.
   *
   * @suppress {checkTypes}
   */animate:function(){if(!this._animating){return}var index,ripple;for(index=0;index<this.ripples.length;++index){ripple=this.ripples[index];ripple.draw();this.$.background.style.opacity=ripple.outerOpacity;if(ripple.isOpacityFullyDecayed&&!ripple.isRestingAtMaxRadius){this.removeRipple(ripple)}}if(!this.shouldKeepAnimating&&0===this.ripples.length){this.onAnimationComplete()}else{window.requestAnimationFrame(this._boundAnimate)}},/**
   * An alias for animate() whose name does not conflict with the platform
   * Element.animate() method.
   */animateRipple:function(){return this.animate()},_onEnterKeydown:function(){this.uiDownAction();this.async(this.uiUpAction,1)},_onSpaceKeydown:function(){this.uiDownAction()},_onSpaceKeyup:function(){this.uiUpAction()},// note: holdDown does not respect noink since it can be a focus based
// effect.
_holdDownChanged:function(newVal,oldVal){if(oldVal===void 0){return}if(newVal){this.downAction()}else{this.upAction()}}/**
    Fired when the animation finishes.
    This is useful if you want to wait until
    the ripple animation finishes to perform some action.
     @event transitionend
    @param {{node: Object}} detail Contains the animated node.
    */});const PaperRippleBehavior={properties:{/**
     * If true, the element will not produce a ripple effect when interacted
     * with via the pointer.
     */noink:{type:Boolean,observer:"_noinkChanged"},/**
     * @type {Element|undefined}
     */_rippleContainer:{type:Object}},/**
   * Ensures a `<paper-ripple>` element is available when the element is
   * focused.
   */_buttonStateChanged:function(){if(this.focused){this.ensureRipple()}},/**
   * In addition to the functionality provided in `IronButtonState`, ensures
   * a ripple effect is created when the element is in a `pressed` state.
   */_downHandler:function(event){IronButtonStateImpl._downHandler.call(this,event);if(this.pressed){this.ensureRipple(event)}},/**
   * Ensures this element contains a ripple effect. For startup efficiency
   * the ripple effect is dynamically on demand when needed.
   * @param {!Event=} optTriggeringEvent (optional) event that triggered the
   * ripple.
   */ensureRipple:function(optTriggeringEvent){if(!this.hasRipple()){this._ripple=this._createRipple();this._ripple.noink=this.noink;var rippleContainer=this._rippleContainer||this.root;if(rippleContainer){dom(rippleContainer).appendChild(this._ripple)}if(optTriggeringEvent){// Check if the event happened inside of the ripple container
// Fall back to host instead of the root because distributed text
// nodes are not valid event targets
var domContainer=dom(this._rippleContainer||this),target=dom(optTriggeringEvent).rootTarget;if(domContainer.deepContains(/** @type {Node} */target)){this._ripple.uiDownAction(optTriggeringEvent)}}}},/**
   * Returns the `<paper-ripple>` element used by this element to create
   * ripple effects. The element's ripple is created on demand, when
   * necessary, and calling this method will force the
   * ripple to be created.
   */getRipple:function(){this.ensureRipple();return this._ripple},/**
   * Returns true if this element currently contains a ripple effect.
   * @return {boolean}
   */hasRipple:function(){return!!this._ripple},/**
   * Create the element's ripple effect via creating a `<paper-ripple>`.
   * Override this method to customize the ripple element.
   * @return {!PaperRippleElement} Returns a `<paper-ripple>` element.
   */_createRipple:function(){var element=/** @type {!PaperRippleElement} */document.createElement("paper-ripple");return element},_noinkChanged:function(noink){if(this.hasRipple()){this._ripple.noink=noink}}};var paperRippleBehavior={PaperRippleBehavior:PaperRippleBehavior};const PaperButtonBehaviorImpl={properties:{/**
     * The z-depth of this element, from 0-5. Setting to 0 will remove the
     * shadow, and each increasing number greater than 0 will be "deeper"
     * than the last.
     *
     * @attribute elevation
     * @type number
     * @default 1
     */elevation:{type:Number,reflectToAttribute:!0,readOnly:!0}},observers:["_calculateElevation(focused, disabled, active, pressed, receivedFocusFromKeyboard)","_computeKeyboardClass(receivedFocusFromKeyboard)"],hostAttributes:{role:"button",tabindex:"0",animated:!0},_calculateElevation:function(){var e=1;if(this.disabled){e=0}else if(this.active||this.pressed){e=4}else if(this.receivedFocusFromKeyboard){e=3}this._setElevation(e)},_computeKeyboardClass:function(receivedFocusFromKeyboard){this.toggleClass("keyboard-focus",receivedFocusFromKeyboard)},/**
   * In addition to `IronButtonState` behavior, when space key goes down,
   * create a ripple down effect.
   *
   * @param {!KeyboardEvent} event .
   */_spaceKeyDownHandler:function(event){IronButtonStateImpl._spaceKeyDownHandler.call(this,event);// Ensure that there is at most one ripple when the space key is held down.
if(this.hasRipple()&&1>this.getRipple().ripples.length){this._ripple.uiDownAction()}},/**
   * In addition to `IronButtonState` behavior, when space key goes up,
   * create a ripple up effect.
   *
   * @param {!KeyboardEvent} event .
   */_spaceKeyUpHandler:function(event){IronButtonStateImpl._spaceKeyUpHandler.call(this,event);if(this.hasRipple()){this._ripple.uiUpAction()}}},PaperButtonBehavior=[IronButtonState,IronControlState,PaperRippleBehavior,PaperButtonBehaviorImpl];/** @polymerBehavior */var paperButtonBehavior={PaperButtonBehaviorImpl:PaperButtonBehaviorImpl,PaperButtonBehavior:PaperButtonBehavior};const PaperInkyFocusBehaviorImpl={observers:["_focusedChanged(receivedFocusFromKeyboard)"],_focusedChanged:function(receivedFocusFromKeyboard){if(receivedFocusFromKeyboard){this.ensureRipple()}if(this.hasRipple()){this._ripple.holdDown=receivedFocusFromKeyboard}},_createRipple:function(){var ripple=PaperRippleBehavior._createRipple();ripple.id="ink";ripple.setAttribute("center","");ripple.classList.add("circle");return ripple}},PaperInkyFocusBehavior=[IronButtonState,IronControlState,PaperRippleBehavior,PaperInkyFocusBehaviorImpl];/** @polymerBehavior */var paperInkyFocusBehavior={PaperInkyFocusBehaviorImpl:PaperInkyFocusBehaviorImpl,PaperInkyFocusBehavior:PaperInkyFocusBehavior};const PaperCheckedElementBehaviorImpl={/**
   * Synchronizes the element's checked state with its ripple effect.
   */_checkedChanged:function(){IronCheckedElementBehaviorImpl._checkedChanged.call(this);if(this.hasRipple()){if(this.checked){this._ripple.setAttribute("checked","")}else{this._ripple.removeAttribute("checked")}}},/**
   * Synchronizes the element's `active` and `checked` state.
   */_buttonStateChanged:function(){PaperRippleBehavior._buttonStateChanged.call(this);if(this.disabled){return}if(this.isAttached){this.checked=this.active}}},PaperCheckedElementBehavior=[PaperInkyFocusBehavior,IronCheckedElementBehavior,PaperCheckedElementBehaviorImpl];/** @polymerBehavior */var paperCheckedElementBehavior={PaperCheckedElementBehaviorImpl:PaperCheckedElementBehaviorImpl,PaperCheckedElementBehavior:PaperCheckedElementBehavior};const template=html`
<dom-module id="paper-material-styles">
  <template>
    <style>
      html {
        --paper-material: {
          display: block;
          position: relative;
        };
        --paper-material-elevation-1: {
          @apply --shadow-elevation-2dp;
        };
        --paper-material-elevation-2: {
          @apply --shadow-elevation-4dp;
        };
        --paper-material-elevation-3: {
          @apply --shadow-elevation-6dp;
        };
        --paper-material-elevation-4: {
          @apply --shadow-elevation-8dp;
        };
        --paper-material-elevation-5: {
          @apply --shadow-elevation-16dp;
        };
      }
      .paper-material {
        @apply --paper-material;
      }
      .paper-material[elevation="1"] {
        @apply --paper-material-elevation-1;
      }
      .paper-material[elevation="2"] {
        @apply --paper-material-elevation-2;
      }
      .paper-material[elevation="3"] {
        @apply --paper-material-elevation-3;
      }
      .paper-material[elevation="4"] {
        @apply --paper-material-elevation-4;
      }
      .paper-material[elevation="5"] {
        @apply --paper-material-elevation-5;
      }

      /* Duplicate the styles because of https://github.com/webcomponents/shadycss/issues/193 */
      :host {
        --paper-material: {
          display: block;
          position: relative;
        };
        --paper-material-elevation-1: {
          @apply --shadow-elevation-2dp;
        };
        --paper-material-elevation-2: {
          @apply --shadow-elevation-4dp;
        };
        --paper-material-elevation-3: {
          @apply --shadow-elevation-6dp;
        };
        --paper-material-elevation-4: {
          @apply --shadow-elevation-8dp;
        };
        --paper-material-elevation-5: {
          @apply --shadow-elevation-16dp;
        };
      }
      :host(.paper-material) {
        @apply --paper-material;
      }
      :host(.paper-material[elevation="1"]) {
        @apply --paper-material-elevation-1;
      }
      :host(.paper-material[elevation="2"]) {
        @apply --paper-material-elevation-2;
      }
      :host(.paper-material[elevation="3"]) {
        @apply --paper-material-elevation-3;
      }
      :host(.paper-material[elevation="4"]) {
        @apply --paper-material-elevation-4;
      }
      :host(.paper-material[elevation="5"]) {
        @apply --paper-material-elevation-5;
      }
    </style>
  </template>
</dom-module>`;template.setAttribute("style","display: none;");document.head.appendChild(template.content);const template$1=html$1`
  <style include="paper-material-styles">
    /* Need to specify the same specificity as the styles imported from paper-material. */
    :host {
      @apply --layout-inline;
      @apply --layout-center-center;
      position: relative;
      box-sizing: border-box;
      min-width: 5.14em;
      margin: 0 0.29em;
      background: transparent;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      font: inherit;
      text-transform: uppercase;
      outline-width: 0;
      border-radius: 3px;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      z-index: 0;
      padding: 0.7em 0.57em;

      @apply --paper-font-common-base;
      @apply --paper-button;
    }

    :host([elevation="1"]) {
      @apply --paper-material-elevation-1;
    }

    :host([elevation="2"]) {
      @apply --paper-material-elevation-2;
    }

    :host([elevation="3"]) {
      @apply --paper-material-elevation-3;
    }

    :host([elevation="4"]) {
      @apply --paper-material-elevation-4;
    }

    :host([elevation="5"]) {
      @apply --paper-material-elevation-5;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([raised].keyboard-focus) {
      font-weight: bold;
      @apply --paper-button-raised-keyboard-focus;
    }

    :host(:not([raised]).keyboard-focus) {
      font-weight: bold;
      @apply --paper-button-flat-keyboard-focus;
    }

    :host([disabled]) {
      background: none;
      color: #a8a8a8;
      cursor: auto;
      pointer-events: none;

      @apply --paper-button-disabled;
    }

    :host([disabled][raised]) {
      background: #eaeaea;
    }


    :host([animated]) {
      @apply --shadow-transition;
    }

    paper-ripple {
      color: var(--paper-button-ink-color);
    }
  </style>

  <slot></slot>`;template$1.setAttribute("strip-whitespace","");/**
                                                 Material design:
                                                 [Buttons](https://www.google.com/design/spec/components/buttons.html)
                                                                                               `paper-button` is a button. When the user touches the button, a ripple effect
                                                 emanates from the point of contact. It may be flat or raised. A raised button is
                                                 styled with a shadow.
                                                                                               Example:
                                                                                                   <paper-button>Flat button</paper-button>
                                                   <paper-button raised>Raised button</paper-button>
                                                   <paper-button noink>No ripple effect</paper-button>
                                                   <paper-button toggles>Toggle-able button</paper-button>
                                                                                               A button that has `toggles` true will remain `active` after being clicked (and
                                                 will have an `active` attribute set). For more information, see the
                                                 `IronButtonState` behavior.
                                                                                               You may use custom DOM in the button body to create a variety of buttons. For
                                                 example, to create a button with an icon and some text:
                                                                                                   <paper-button>
                                                     <iron-icon icon="favorite"></iron-icon>
                                                     custom button content
                                                   </paper-button>
                                                                                               To use `paper-button` as a link, wrap it in an anchor tag. Since `paper-button`
                                                 will already receive focus, you may want to prevent the anchor tag from
                                                 receiving focus as well by setting its tabindex to -1.
                                                                                                   <a href="https://www.polymer-project.org/" tabindex="-1">
                                                     <paper-button raised>Polymer Project</paper-button>
                                                   </a>
                                                                                               ### Styling
                                                                                               Style the button with CSS as you would a normal DOM element.
                                                                                                   paper-button.fancy {
                                                     background: green;
                                                     color: yellow;
                                                   }
                                                                                                   paper-button.fancy:hover {
                                                     background: lime;
                                                   }
                                                                                                   paper-button[disabled],
                                                   paper-button[toggles][active] {
                                                     background: red;
                                                   }
                                                                                               By default, the ripple is the same color as the foreground at 25% opacity. You
                                                 may customize the color using the `--paper-button-ink-color` custom property.
                                                                                               The following custom properties and mixins are also available for styling:
                                                                                               Custom property | Description | Default
                                                 ----------------|-------------|----------
                                                 `--paper-button-ink-color` | Background color of the ripple | `Based on the button's color`
                                                 `--paper-button` | Mixin applied to the button | `{}`
                                                 `--paper-button-disabled` | Mixin applied to the disabled button. Note that you can also use the `paper-button[disabled]` selector | `{}`
                                                 `--paper-button-flat-keyboard-focus` | Mixin applied to a flat button after it's been focused using the keyboard | `{}`
                                                 `--paper-button-raised-keyboard-focus` | Mixin applied to a raised button after it's been focused using the keyboard | `{}`
                                                                                               @demo demo/index.html
                                                 */Polymer({_template:template$1,is:"paper-button",behaviors:[PaperButtonBehavior],properties:{/**
     * If true, the button should be styled with a shadow.
     */raised:{type:Boolean,reflectToAttribute:!0,value:!1,observer:"_calculateElevation"}},_calculateElevation:function(){if(!this.raised){this._setElevation(0)}else{PaperButtonBehaviorImpl._calculateElevation.apply(this)}}/**
    Fired when the animation finishes.
    This is useful if you want to wait until
    the ripple animation finishes to perform some action.
     @event transitionend
    Event param: {{node: Object}} detail Contains the animated node.
    */});const template$2=html`<style>
  :host {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);
    /* -1px is a sentinel for the default and is replaced in \`attached\`. */
    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);
    @apply --paper-font-common-base;
    line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus) {
    outline: none;
  }

  .hidden {
    display: none;
  }

  #checkboxContainer {
    display: inline-block;
    position: relative;
    width: var(--calculated-paper-checkbox-size);
    height: var(--calculated-paper-checkbox-size);
    min-width: var(--calculated-paper-checkbox-size);
    margin: var(--paper-checkbox-margin, initial);
    vertical-align: var(--paper-checkbox-vertical-align, middle);
    background-color: var(--paper-checkbox-unchecked-background-color, transparent);
  }

  #ink {
    position: absolute;

    /* Center the ripple in the checkbox by negative offsetting it by
     * (inkWidth - rippleWidth) / 2 */
    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    width: var(--calculated-paper-checkbox-ink-size);
    height: var(--calculated-paper-checkbox-ink-size);
    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));
    opacity: 0.6;
    pointer-events: none;
  }

  #ink:dir(rtl) {
    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: auto;
  }

  #ink[checked] {
    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));
  }

  #checkbox {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    border: solid 2px;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    border-radius: 2px;
    pointer-events: none;
    -webkit-transition: background-color 140ms, border-color 140ms;
    transition: background-color 140ms, border-color 140ms;

    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);
    transition-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  /* checkbox checked animations */
  #checkbox.checked #checkmark {
    -webkit-animation: checkmark-expand 140ms ease-out forwards;
    animation: checkmark-expand 140ms ease-out forwards;

    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);
    animation-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  @-webkit-keyframes checkmark-expand {
    0% {
      -webkit-transform: scale(0, 0) rotate(45deg);
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(45deg);
    }
  }

  @keyframes checkmark-expand {
    0% {
      transform: scale(0, 0) rotate(45deg);
    }
    100% {
      transform: scale(1, 1) rotate(45deg);
    }
  }

  #checkbox.checked {
    background-color: var(--paper-checkbox-checked-color, var(--primary-color));
    border-color: var(--paper-checkbox-checked-color, var(--primary-color));
  }

  #checkmark {
    position: absolute;
    width: 36%;
    height: 70%;
    border-style: solid;
    border-top: none;
    border-left: none;
    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-color: var(--paper-checkbox-checkmark-color, white);
    -webkit-transform-origin: 97% 86%;
    transform-origin: 97% 86%;
    box-sizing: content-box; /* protect against page-level box-sizing */
  }

  #checkmark:dir(rtl) {
    -webkit-transform-origin: 50% 14%;
    transform-origin: 50% 14%;
  }

  /* label */
  #checkboxLabel {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: var(--paper-checkbox-label-spacing, 8px);
    white-space: normal;
    line-height: normal;
    color: var(--paper-checkbox-label-color, var(--primary-text-color));
    @apply --paper-checkbox-label;
  }

  :host([checked]) #checkboxLabel {
    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));
    @apply --paper-checkbox-label-checked;
  }

  #checkboxLabel:dir(rtl) {
    padding-right: var(--paper-checkbox-label-spacing, 8px);
    padding-left: 0;
  }

  #checkboxLabel[hidden] {
    display: none;
  }

  /* disabled state */

  :host([disabled]) #checkbox {
    opacity: 0.5;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
  }

  :host([disabled][checked]) #checkbox {
    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    opacity: 0.5;
  }

  :host([disabled]) #checkboxLabel  {
    opacity: 0.65;
  }

  /* invalid state */
  #checkbox.invalid:not(.checked) {
    border-color: var(--paper-checkbox-error-color, var(--error-color));
  }
</style>

<div id="checkboxContainer">
  <div id="checkbox" class$="[[_computeCheckboxClass(checked, invalid)]]">
    <div id="checkmark" class$="[[_computeCheckmarkClass(checked)]]"></div>
  </div>
</div>

<div id="checkboxLabel"><slot></slot></div>`;template$2.setAttribute("strip-whitespace","");/**
                                                 Material design:
                                                 [Checkbox](https://www.google.com/design/spec/components/selection-controls.html#selection-controls-checkbox)
                                                                                               `paper-checkbox` is a button that can be either checked or unchecked. User can
                                                 tap the checkbox to check or uncheck it. Usually you use checkboxes to allow
                                                 user to select multiple options from a set. If you have a single ON/OFF option,
                                                 avoid using a single checkbox and use `paper-toggle-button` instead.
                                                                                               Example:
                                                                                                   <paper-checkbox>label</paper-checkbox>
                                                                                                   <paper-checkbox checked> label</paper-checkbox>
                                                                                               ### Styling
                                                                                               The following custom properties and mixins are available for styling:
                                                                                               Custom property | Description | Default
                                                 ----------------|-------------|----------
                                                 `--paper-checkbox-unchecked-background-color` | Checkbox background color when the input is not checked | `transparent`
                                                 `--paper-checkbox-unchecked-color` | Checkbox border color when the input is not checked | `--primary-text-color`
                                                 `--paper-checkbox-unchecked-ink-color` | Selected/focus ripple color when the input is not checked | `--primary-text-color`
                                                 `--paper-checkbox-checked-color` | Checkbox color when the input is checked | `--primary-color`
                                                 `--paper-checkbox-checked-ink-color` | Selected/focus ripple color when the input is checked | `--primary-color`
                                                 `--paper-checkbox-checkmark-color` | Checkmark color | `white`
                                                 `--paper-checkbox-label-color` | Label color | `--primary-text-color`
                                                 `--paper-checkbox-label-checked-color` | Label color when the input is checked | `--paper-checkbox-label-color`
                                                 `--paper-checkbox-label-spacing` | Spacing between the label and the checkbox | `8px`
                                                 `--paper-checkbox-label` | Mixin applied to the label | `{}`
                                                 `--paper-checkbox-label-checked` | Mixin applied to the label when the input is checked | `{}`
                                                 `--paper-checkbox-error-color` | Checkbox color when invalid | `--error-color`
                                                 `--paper-checkbox-size` | Size of the checkbox | `18px`
                                                 `--paper-checkbox-ink-size` | Size of the ripple | `48px`
                                                 `--paper-checkbox-margin` | Margin around the checkbox container | `initial`
                                                 `--paper-checkbox-vertical-align` | Vertical alignment of the checkbox container | `middle`
                                                                                               This element applies the mixin `--paper-font-common-base` but does not import
                                                 `paper-styles/typography.html`. In order to apply the `Roboto` font to this
                                                 element, make sure you've imported `paper-styles/typography.html`.
                                                                                               @demo demo/index.html
                                                 */Polymer({_template:template$2,is:"paper-checkbox",behaviors:[PaperCheckedElementBehavior],/** @private */hostAttributes:{role:"checkbox","aria-checked":!1,tabindex:0},properties:{/**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */ /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */ariaActiveAttribute:{type:String,value:"aria-checked"}},attached:function(){// Wait until styles have resolved to check for the default sentinel.
// See polymer#4009 for more details.
afterNextRender(this,function(){var inkSize=this.getComputedStyleValue("--calculated-paper-checkbox-ink-size").trim();// If unset, compute and set the default `--paper-checkbox-ink-size`.
if("-1px"===inkSize){var checkboxSizeText=this.getComputedStyleValue("--calculated-paper-checkbox-size").trim(),units="px",unitsMatches=checkboxSizeText.match(/[A-Za-z]+$/);if(null!==unitsMatches){units=unitsMatches[0]}var checkboxSize=parseFloat(checkboxSizeText),defaultInkSize=8/3*checkboxSize;if("px"===units){defaultInkSize=Math.floor(defaultInkSize);// The checkbox and ripple need to have the same parity so that their
// centers align.
if(defaultInkSize%2!==checkboxSize%2){defaultInkSize++}}this.updateStyles({"--paper-checkbox-ink-size":defaultInkSize+units})}})},_computeCheckboxClass:function(checked,invalid){var className="";if(checked){className+="checked "}if(invalid){className+="invalid"}return className},_computeCheckmarkClass:function(checked){return checked?"":"hidden"},// create ripple inside the checkboxContainer
_createRipple:function(){this._rippleContainer=this.$.checkboxContainer;return PaperInkyFocusBehaviorImpl._createRipple.call(this)}});const $_documentContainer=document.createElement("template");$_documentContainer.setAttribute("style","display: none;");$_documentContainer.innerHTML=`<iron-iconset-svg name="paper-dropdown-menu" size="24">
<svg><defs>
<g id="arrow-drop-down"><path d="M7 10l5 5 5-5z"></path></g>
</defs></svg>
</iron-iconset-svg>`;document.head.appendChild($_documentContainer.content);const $_documentContainer$1=document.createElement("template");$_documentContainer$1.setAttribute("style","display: none;");$_documentContainer$1.innerHTML=`<dom-module id="paper-dropdown-menu-shared-styles">
  <template>
    <style>
      :host {
        display: inline-block;
        position: relative;
        text-align: left;

        /* NOTE(cdata): Both values are needed, since some phones require the
         * value to be \`transparent\`.
         */
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-tap-highlight-color: transparent;

        --paper-input-container-input: {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
          box-sizing: border-box;
          cursor: pointer;
        };

        @apply --paper-dropdown-menu;
      }

      :host([disabled]) {
        @apply --paper-dropdown-menu-disabled;
      }

      :host([noink]) paper-ripple {
        display: none;
      }

      :host([no-label-float]) paper-ripple {
        top: 8px;
      }

      paper-ripple {
        top: 12px;
        left: 0px;
        bottom: 8px;
        right: 0px;

        @apply --paper-dropdown-menu-ripple;
      }

      paper-menu-button {
        display: block;
        padding: 0;

        @apply --paper-dropdown-menu-button;
      }

      paper-input {
        @apply --paper-dropdown-menu-input;
      }

      iron-icon {
        color: var(--disabled-text-color);

        @apply --paper-dropdown-menu-icon;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$1.content);const PaperInputAddonBehavior={attached:function(){this.fire("addon-attached")},/**
   * The function called by `<paper-input-container>` when the input value or
   * validity changes.
   * @param {{
   *   invalid: boolean,
   *   inputElement: (Element|undefined),
   *   value: (string|undefined)
   * }} state -
   *     inputElement: The input element.
   *     value: The input value.
   *     invalid: True if the input value is invalid.
   */update:function(state){}};var paperInputAddonBehavior={PaperInputAddonBehavior:PaperInputAddonBehavior};Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        float: right;

        @apply --paper-font-caption;
        @apply --paper-input-char-counter;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:dir(rtl)) {
        float: left;
      }
    </style>

    <span>[[_charCounterStr]]</span>
`,is:"paper-input-char-counter",behaviors:[PaperInputAddonBehavior],properties:{_charCounterStr:{type:String,value:"0"}},/**
   * This overrides the update function in PaperInputAddonBehavior.
   * @param {{
   *   inputElement: (Element|undefined),
   *   value: (string|undefined),
   *   invalid: boolean
   * }} state -
   *     inputElement: The input element.
   *     value: The input value.
   *     invalid: True if the input value is invalid.
   */update:function(state){if(!state.inputElement){return}state.value=state.value||"";var counter=state.value.toString().length.toString();if(state.inputElement.hasAttribute("maxlength")){counter+="/"+state.inputElement.getAttribute("maxlength")}this._charCounterStr=counter}});const template$3=html`
<custom-style>
  <style is="custom-style">
    html {
      --paper-input-container-shared-input-style: {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        padding: 0;
        margin: 0;
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: var(--paper-input-container-input-align, bottom);

        @apply --paper-font-subhead;
      };
    }
  </style>
</custom-style>
`;template$3.setAttribute("style","display: none;");document.head.appendChild(template$3.content);/*
                                               `<paper-input-container>` is a container for a `<label>`, an `<iron-input>` or
                                               `<textarea>` and optional add-on elements such as an error message or character
                                               counter, used to implement Material Design text fields.
                                                                                           For example:
                                                                                               <paper-input-container>
                                                   <label slot="label">Your name</label>
                                                   <iron-input slot="input">
                                                     <input>
                                                   </iron-input>
                                                   // In Polymer 1.0, you would use `<input is="iron-input" slot="input">`
                                               instead of the above.
                                                 </paper-input-container>
                                                                                           You can style the nested `<input>` however you want; if you want it to look like
                                               a Material Design input, you can style it with the
                                               --paper-input-container-shared-input-style mixin.
                                                                                           Do not wrap `<paper-input-container>` around elements that already include it,
                                               such as `<paper-input>`. Doing so may cause events to bounce infinitely between
                                               the container and its contained element.
                                                                                           ### Listening for input changes
                                                                                           By default, it listens for changes on the `bind-value` attribute on its children
                                               nodes and perform tasks such as auto-validating and label styling when the
                                               `bind-value` changes. You can configure the attribute it listens to with the
                                               `attr-for-value` attribute.
                                                                                           ### Using a custom input element
                                                                                           You can use a custom input element in a `<paper-input-container>`, for example
                                               to implement a compound input field like a social security number input. The
                                               custom input element should have the `paper-input-input` class, have a
                                               `notify:true` value property and optionally implements
                                               `Polymer.IronValidatableBehavior` if it is validatable.
                                                                                               <paper-input-container attr-for-value="ssn-value">
                                                   <label slot="label">Social security number</label>
                                                   <ssn-input slot="input" class="paper-input-input"></ssn-input>
                                                 </paper-input-container>
                                                                                           
                                               If you're using a `<paper-input-container>` imperatively, it's important to make
                                               sure that you attach its children (the `iron-input` and the optional `label`)
                                               before you attach the `<paper-input-container>` itself, so that it can be set up
                                               correctly.
                                                                                           ### Validation
                                                                                           If the `auto-validate` attribute is set, the input container will validate the
                                               input and update the container styling when the input value changes.
                                                                                           ### Add-ons
                                                                                           Add-ons are child elements of a `<paper-input-container>` with the `add-on`
                                               attribute and implements the `Polymer.PaperInputAddonBehavior` behavior. They
                                               are notified when the input value or validity changes, and may implement
                                               functionality such as error messages or character counters. They appear at the
                                               bottom of the input.
                                                                                           ### Prefixes and suffixes
                                               These are child elements of a `<paper-input-container>` with the `prefix`
                                               or `suffix` attribute, and are displayed inline with the input, before or after.
                                                                                               <paper-input-container>
                                                   <div slot="prefix">$</div>
                                                   <label slot="label">Total</label>
                                                   <iron-input slot="input">
                                                     <input>
                                                   </iron-input>
                                                   // In Polymer 1.0, you would use `<input is="iron-input" slot="input">`
                                               instead of the above. <paper-icon-button slot="suffix"
                                               icon="clear"></paper-icon-button>
                                                 </paper-input-container>
                                                                                           ### Styling
                                                                                           The following custom properties and mixins are available for styling:
                                                                                           Custom property | Description | Default
                                               ----------------|-------------|----------
                                               `--paper-input-container-color` | Label and underline color when the input is not focused | `--secondary-text-color`
                                               `--paper-input-container-focus-color` | Label and underline color when the input is focused | `--primary-color`
                                               `--paper-input-container-invalid-color` | Label and underline color when the input is is invalid | `--error-color`
                                               `--paper-input-container-input-color` | Input foreground color | `--primary-text-color`
                                               `--paper-input-container` | Mixin applied to the container | `{}`
                                               `--paper-input-container-disabled` | Mixin applied to the container when it's disabled | `{}`
                                               `--paper-input-container-label` | Mixin applied to the label | `{}`
                                               `--paper-input-container-label-focus` | Mixin applied to the label when the input is focused | `{}`
                                               `--paper-input-container-label-floating` | Mixin applied to the label when floating | `{}`
                                               `--paper-input-container-input` | Mixin applied to the input | `{}`
                                               `--paper-input-container-input-align` | The vertical-align property of the input | `bottom`
                                               `--paper-input-container-input-disabled` | Mixin applied to the input when the component is disabled | `{}`
                                               `--paper-input-container-input-focus` | Mixin applied to the input when focused | `{}`
                                               `--paper-input-container-input-invalid` | Mixin applied to the input when invalid | `{}`
                                               `--paper-input-container-input-webkit-spinner` | Mixin applied to the webkit spinner | `{}`
                                               `--paper-input-container-input-webkit-clear` | Mixin applied to the webkit clear button | `{}`
                                               `--paper-input-container-input-webkit-calendar-picker-indicator` | Mixin applied to the webkit calendar picker indicator | `{}`
                                               `--paper-input-container-ms-clear` | Mixin applied to the Internet Explorer clear button | `{}`
                                               `--paper-input-container-underline` | Mixin applied to the underline | `{}`
                                               `--paper-input-container-underline-focus` | Mixin applied to the underline when the input is focused | `{}`
                                               `--paper-input-container-underline-disabled` | Mixin applied to the underline when the input is disabled | `{}`
                                               `--paper-input-prefix` | Mixin applied to the input prefix | `{}`
                                               `--paper-input-suffix` | Mixin applied to the input suffix | `{}`
                                                                                           This element is `display:block` by default, but you can set the `inline`
                                               attribute to make it `display:inline-block`.
                                               */Polymer({_template:html`
    <style>
      :host {
        display: block;
        padding: 8px 0;
        @apply --paper-input-container;
      }

      :host([inline]) {
        display: inline-block;
      }

      :host([disabled]) {
        pointer-events: none;
        opacity: 0.33;

        @apply --paper-input-container-disabled;
      }

      :host([hidden]) {
        display: none !important;
      }

      [hidden] {
        display: none !important;
      }

      .floated-label-placeholder {
        @apply --paper-font-caption;
      }

      .underline {
        height: 2px;
        position: relative;
      }

      .focused-line {
        @apply --layout-fit;
        border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));

        -webkit-transform-origin: center center;
        transform-origin: center center;
        -webkit-transform: scale3d(0,1,1);
        transform: scale3d(0,1,1);

        @apply --paper-input-container-underline-focus;
      }

      .underline.is-highlighted .focused-line {
        -webkit-transform: none;
        transform: none;
        -webkit-transition: -webkit-transform 0.25s;
        transition: transform 0.25s;

        @apply --paper-transition-easing;
      }

      .underline.is-invalid .focused-line {
        border-color: var(--paper-input-container-invalid-color, var(--error-color));
        -webkit-transform: none;
        transform: none;
        -webkit-transition: -webkit-transform 0.25s;
        transition: transform 0.25s;

        @apply --paper-transition-easing;
      }

      .unfocused-line {
        @apply --layout-fit;
        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));
        @apply --paper-input-container-underline;
      }

      :host([disabled]) .unfocused-line {
        border-bottom: 1px dashed;
        border-color: var(--paper-input-container-color, var(--secondary-text-color));
        @apply --paper-input-container-underline-disabled;
      }

      .input-wrapper {
        @apply --layout-horizontal;
        @apply --layout-center;
        position: relative;
      }

      .input-content {
        @apply --layout-flex-auto;
        @apply --layout-relative;
        max-width: 100%;
      }

      .input-content ::slotted(label),
      .input-content ::slotted(.paper-input-label) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        font: inherit;
        color: var(--paper-input-container-color, var(--secondary-text-color));
        -webkit-transition: -webkit-transform 0.25s, width 0.25s;
        transition: transform 0.25s, width 0.25s;
        -webkit-transform-origin: left top;
        transform-origin: left top;
        /* Fix for safari not focusing 0-height date/time inputs with -webkit-apperance: none; */
        min-height: 1px;

        @apply --paper-font-common-nowrap;
        @apply --paper-font-subhead;
        @apply --paper-input-container-label;
        @apply --paper-transition-easing;
      }

      .input-content.label-is-floating ::slotted(label),
      .input-content.label-is-floating ::slotted(.paper-input-label) {
        -webkit-transform: translateY(-75%) scale(0.75);
        transform: translateY(-75%) scale(0.75);

        /* Since we scale to 75/100 of the size, we actually have 100/75 of the
        original space now available */
        width: 133%;

        @apply --paper-input-container-label-floating;
      }

      :host(:dir(rtl)) .input-content.label-is-floating ::slotted(label),
      :host(:dir(rtl)) .input-content.label-is-floating ::slotted(.paper-input-label) {
        right: 0;
        left: auto;
        -webkit-transform-origin: right top;
        transform-origin: right top;
      }

      .input-content.label-is-highlighted ::slotted(label),
      .input-content.label-is-highlighted ::slotted(.paper-input-label) {
        color: var(--paper-input-container-focus-color, var(--primary-color));

        @apply --paper-input-container-label-focus;
      }

      .input-content.is-invalid ::slotted(label),
      .input-content.is-invalid ::slotted(.paper-input-label) {
        color: var(--paper-input-container-invalid-color, var(--error-color));
      }

      .input-content.label-is-hidden ::slotted(label),
      .input-content.label-is-hidden ::slotted(.paper-input-label) {
        visibility: hidden;
      }

      .input-content ::slotted(input),
      .input-content ::slotted(iron-input),
      .input-content ::slotted(textarea),
      .input-content ::slotted(iron-autogrow-textarea),
      .input-content ::slotted(.paper-input-input) {
        @apply --paper-input-container-shared-input-style;
        /* The apply shim doesn't apply the nested color custom property,
          so we have to re-apply it here. */
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        @apply --paper-input-container-input;
      }

      .input-content ::slotted(input)::-webkit-outer-spin-button,
      .input-content ::slotted(input)::-webkit-inner-spin-button {
        @apply --paper-input-container-input-webkit-spinner;
      }

      .input-content.focused ::slotted(input),
      .input-content.focused ::slotted(iron-input),
      .input-content.focused ::slotted(textarea),
      .input-content.focused ::slotted(iron-autogrow-textarea),
      .input-content.focused ::slotted(.paper-input-input) {
        @apply --paper-input-container-input-focus;
      }

      .input-content.is-invalid ::slotted(input),
      .input-content.is-invalid ::slotted(iron-input),
      .input-content.is-invalid ::slotted(textarea),
      .input-content.is-invalid ::slotted(iron-autogrow-textarea),
      .input-content.is-invalid ::slotted(.paper-input-input) {
        @apply --paper-input-container-input-invalid;
      }

      .prefix ::slotted(*) {
        display: inline-block;
        @apply --paper-font-subhead;
        @apply --layout-flex-none;
        @apply --paper-input-prefix;
      }

      .suffix ::slotted(*) {
        display: inline-block;
        @apply --paper-font-subhead;
        @apply --layout-flex-none;

        @apply --paper-input-suffix;
      }

      /* Firefox sets a min-width on the input, which can cause layout issues */
      .input-content ::slotted(input) {
        min-width: 0;
      }

      .input-content ::slotted(textarea) {
        resize: none;
      }

      .add-on-content {
        position: relative;
      }

      .add-on-content.is-invalid ::slotted(*) {
        color: var(--paper-input-container-invalid-color, var(--error-color));
      }

      .add-on-content.is-highlighted ::slotted(*) {
        color: var(--paper-input-container-focus-color, var(--primary-color));
      }
    </style>

    <div class="floated-label-placeholder" aria-hidden="true" hidden="[[noLabelFloat]]">&nbsp;</div>

    <div class="input-wrapper">
      <span class="prefix"><slot name="prefix"></slot></span>

      <div class$="[[_computeInputContentClass(noLabelFloat,alwaysFloatLabel,focused,invalid,_inputHasContent)]]" id="labelAndInputContainer">
        <slot name="label"></slot>
        <slot name="input"></slot>
      </div>

      <span class="suffix"><slot name="suffix"></slot></span>
    </div>

    <div class$="[[_computeUnderlineClass(focused,invalid)]]">
      <div class="unfocused-line"></div>
      <div class="focused-line"></div>
    </div>

    <div class$="[[_computeAddOnContentClass(focused,invalid)]]">
      <slot name="add-on"></slot>
    </div>
`,is:"paper-input-container",properties:{/**
     * Set to true to disable the floating label. The label disappears when the
     * input value is not null.
     */noLabelFloat:{type:Boolean,value:!1},/**
     * Set to true to always float the floating label.
     */alwaysFloatLabel:{type:Boolean,value:!1},/**
     * The attribute to listen for value changes on.
     */attrForValue:{type:String,value:"bind-value"},/**
     * Set to true to auto-validate the input value when it changes.
     */autoValidate:{type:Boolean,value:!1},/**
     * True if the input is invalid. This property is set automatically when the
     * input value changes if auto-validating, or when the `iron-input-validate`
     * event is heard from a child.
     */invalid:{observer:"_invalidChanged",type:Boolean,value:!1},/**
     * True if the input has focus.
     */focused:{readOnly:!0,type:Boolean,value:!1,notify:!0},_addons:{type:Array// do not set a default value here intentionally - it will be initialized
// lazily when a distributed child is attached, which may occur before
// configuration for this element in polyfill.
},_inputHasContent:{type:Boolean,value:!1},_inputSelector:{type:String,value:"input,iron-input,textarea,.paper-input-input"},_boundOnFocus:{type:Function,value:function(){return this._onFocus.bind(this)}},_boundOnBlur:{type:Function,value:function(){return this._onBlur.bind(this)}},_boundOnInput:{type:Function,value:function(){return this._onInput.bind(this)}},_boundValueChanged:{type:Function,value:function(){return this._onValueChanged.bind(this)}}},listeners:{"addon-attached":"_onAddonAttached","iron-input-validate":"_onIronInputValidate"},get _valueChangedEvent(){return this.attrForValue+"-changed"},get _propertyForValue(){return dashToCamelCase(this.attrForValue)},get _inputElement(){return dom(this).querySelector(this._inputSelector)},get _inputElementValue(){return this._inputElement[this._propertyForValue]||this._inputElement.value},ready:function(){// Paper-input treats a value of undefined differently at startup than
// the rest of the time (specifically: it does not validate it at startup,
// but it does after that. We need to track whether the first time we
// encounter the value is basically this first time, so that we can validate
// it correctly the rest of the time. See
// https://github.com/PolymerElements/paper-input/issues/605
this.__isFirstValueUpdate=!0;if(!this._addons){this._addons=[]}this.addEventListener("focus",this._boundOnFocus,!0);this.addEventListener("blur",this._boundOnBlur,!0)},attached:function(){if(this.attrForValue){this._inputElement.addEventListener(this._valueChangedEvent,this._boundValueChanged)}else{this.addEventListener("input",this._onInput)}// Only validate when attached if the input already has a value.
if(this._inputElementValue&&""!=this._inputElementValue){this._handleValueAndAutoValidate(this._inputElement)}else{this._handleValue(this._inputElement)}},/** @private */_onAddonAttached:function(event){if(!this._addons){this._addons=[]}var target=event.target;if(-1===this._addons.indexOf(target)){this._addons.push(target);if(this.isAttached){this._handleValue(this._inputElement)}}},/** @private */_onFocus:function(){this._setFocused(!0)},/** @private */_onBlur:function(){this._setFocused(!1);this._handleValueAndAutoValidate(this._inputElement)},/** @private */_onInput:function(event){this._handleValueAndAutoValidate(event.target)},/** @private */_onValueChanged:function(event){var input=event.target;// Paper-input treats a value of undefined differently at startup than
// the rest of the time (specifically: it does not validate it at startup,
// but it does after that. If this is in fact the bootup case, ignore
// validation, just this once.
if(this.__isFirstValueUpdate){this.__isFirstValueUpdate=!1;if(input.value===void 0||""===input.value){return}}this._handleValueAndAutoValidate(event.target)},/** @private */_handleValue:function(inputElement){var value=this._inputElementValue;// type="number" hack needed because this.value is empty until it's valid
if(value||0===value||"number"===inputElement.type&&!inputElement.checkValidity()){this._inputHasContent=!0}else{this._inputHasContent=!1}this.updateAddons({inputElement:inputElement,value:value,invalid:this.invalid})},/** @private */_handleValueAndAutoValidate:function(inputElement){if(this.autoValidate&&inputElement){var valid;if(inputElement.validate){valid=inputElement.validate(this._inputElementValue)}else{valid=inputElement.checkValidity()}this.invalid=!valid}// Call this last to notify the add-ons.
this._handleValue(inputElement)},/** @private */_onIronInputValidate:function(event){this.invalid=this._inputElement.invalid},/** @private */_invalidChanged:function(){if(this._addons){this.updateAddons({invalid:this.invalid})}},/**
   * Call this to update the state of add-ons.
   * @param {Object} state Add-on state.
   */updateAddons:function(state){for(var addon,index=0;addon=this._addons[index];index++){addon.update(state)}},/** @private */_computeInputContentClass:function(noLabelFloat,alwaysFloatLabel,focused,invalid,_inputHasContent){var cls="input-content";if(!noLabelFloat){var label=this.querySelector("label");if(alwaysFloatLabel||_inputHasContent){cls+=" label-is-floating";// If the label is floating, ignore any offsets that may have been
// applied from a prefix element.
this.$.labelAndInputContainer.style.position="static";if(invalid){cls+=" is-invalid"}else if(focused){cls+=" label-is-highlighted"}}else{// When the label is not floating, it should overlap the input element.
if(label){this.$.labelAndInputContainer.style.position="relative"}if(invalid){cls+=" is-invalid"}}}else{if(_inputHasContent){cls+=" label-is-hidden"}if(invalid){cls+=" is-invalid"}}if(focused){cls+=" focused"}return cls},/** @private */_computeUnderlineClass:function(focused,invalid){var cls="underline";if(invalid){cls+=" is-invalid"}else if(focused){cls+=" is-highlighted"}return cls},/** @private */_computeAddOnContentClass:function(focused,invalid){var cls="add-on-content";if(invalid){cls+=" is-invalid"}else if(focused){cls+=" is-highlighted"}return cls}});Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        visibility: hidden;

        color: var(--paper-input-container-invalid-color, var(--error-color));

        @apply --paper-font-caption;
        @apply --paper-input-error;
        position: absolute;
        left:0;
        right:0;
      }

      :host([invalid]) {
        visibility: visible;
      }

      #a11yWrapper {
        visibility: hidden;
      }

      :host([invalid]) #a11yWrapper {
        visibility: visible;
      }
    </style>

    <!--
    If the paper-input-error element is directly referenced by an
    \`aria-describedby\` attribute, such as when used as a paper-input add-on,
    then applying \`visibility: hidden;\` to the paper-input-error element itself
    does not hide the error.

    For more information, see:
    https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
    -->
    <div id="a11yWrapper">
      <slot></slot>
    </div>
`,is:"paper-input-error",behaviors:[PaperInputAddonBehavior],properties:{/**
     * True if the error is showing.
     */invalid:{readOnly:!0,reflectToAttribute:!0,type:Boolean}},/**
   * This overrides the update function in PaperInputAddonBehavior.
   * @param {{
   *   inputElement: (Element|undefined),
   *   value: (string|undefined),
   *   invalid: boolean
   * }} state -
   *     inputElement: The input element.
   *     value: The input value.
   *     invalid: True if the input value is invalid.
   */update:function(state){this._setInvalid(state.invalid)}});// aria-labelledby) and add-ons.
const PaperInputHelper={NextLabelID:1,NextAddonID:1,NextInputID:1},PaperInputBehaviorImpl={properties:{/**
     * Fired when the input changes due to user interaction.
     *
     * @event change
     */ /**
         * The label for this input. If you're using PaperInputBehavior to
         * implement your own paper-input-like element, bind this to
         * `<label>`'s content and `hidden` property, e.g.
         * `<label hidden$="[[!label]]">[[label]]</label>` in your `template`
         */label:{type:String},/**
     * The value for this input. If you're using PaperInputBehavior to
     * implement your own paper-input-like element, bind this to
     * the `<iron-input>`'s `bindValue`
     * property, or the value property of your input that is `notify:true`.
     * @type {*}
     */value:{notify:!0,type:String},/**
     * Set to true to disable this input. If you're using PaperInputBehavior to
     * implement your own paper-input-like element, bind this to
     * both the `<paper-input-container>`'s and the input's `disabled` property.
     */disabled:{type:Boolean,value:!1},/**
     * Returns true if the value is invalid. If you're using PaperInputBehavior
     * to implement your own paper-input-like element, bind this to both the
     * `<paper-input-container>`'s and the input's `invalid` property.
     *
     * If `autoValidate` is true, the `invalid` attribute is managed
     * automatically, which can clobber attempts to manage it manually.
     */invalid:{type:Boolean,value:!1,notify:!0},/**
     * Set this to specify the pattern allowed by `preventInvalidInput`. If
     * you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `allowedPattern`
     * property.
     */allowedPattern:{type:String},/**
     * The type of the input. The supported types are the
     * [native input's
     * types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_<input>_types).
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the (Polymer 1) `<input is="iron-input">`'s or
     * (Polymer 2)
     * `<iron-input>`'s `type` property.
     */type:{type:String},/**
     * The datalist of the input (if any). This should match the id of an
     * existing `<datalist>`. If you're using PaperInputBehavior to implement
     * your own paper-input-like element, bind this to the `<input
     * is="iron-input">`'s `list` property.
     */list:{type:String},/**
     * A pattern to validate the `input` with. If you're using
     * PaperInputBehavior to implement your own paper-input-like element, bind
     * this to the `<input is="iron-input">`'s `pattern` property.
     */pattern:{type:String},/**
     * Set to true to mark the input as required. If you're using
     * PaperInputBehavior to implement your own paper-input-like element, bind
     * this to the `<input is="iron-input">`'s `required` property.
     */required:{type:Boolean,value:!1},/**
     * The error message to display when the input is invalid. If you're using
     * PaperInputBehavior to implement your own paper-input-like element,
     * bind this to the `<paper-input-error>`'s content, if using.
     */errorMessage:{type:String},/**
     * Set to true to show a character counter.
     */charCounter:{type:Boolean,value:!1},/**
     * Set to true to disable the floating label. If you're using
     * PaperInputBehavior to implement your own paper-input-like element, bind
     * this to the `<paper-input-container>`'s `noLabelFloat` property.
     */noLabelFloat:{type:Boolean,value:!1},/**
     * Set to true to always float the label. If you're using PaperInputBehavior
     * to implement your own paper-input-like element, bind this to the
     * `<paper-input-container>`'s `alwaysFloatLabel` property.
     */alwaysFloatLabel:{type:Boolean,value:!1},/**
     * Set to true to auto-validate the input value. If you're using
     * PaperInputBehavior to implement your own paper-input-like element, bind
     * this to the `<paper-input-container>`'s `autoValidate` property.
     */autoValidate:{type:Boolean,value:!1},/**
     * Name of the validator to use. If you're using PaperInputBehavior to
     * implement your own paper-input-like element, bind this to
     * the `<input is="iron-input">`'s `validator` property.
     */validator:{type:String},// HTMLInputElement attributes for binding if needed
/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `autocomplete`
     * property.
     */autocomplete:{type:String,value:"off"},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `autofocus`
     * property.
     */autofocus:{type:Boolean,observer:"_autofocusChanged"},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `inputmode`
     * property.
     */inputmode:{type:String},/**
     * The minimum length of the input value.
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `minlength`
     * property.
     */minlength:{type:Number},/**
     * The maximum length of the input value.
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `maxlength`
     * property.
     */maxlength:{type:Number},/**
     * The minimum (numeric or date-time) input value.
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `min` property.
     */min:{type:String},/**
     * The maximum (numeric or date-time) input value.
     * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `max` property.
     */max:{type:String},/**
     * Limits the numeric or date-time increments.
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `step` property.
     */step:{type:String},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `name` property.
     */name:{type:String},/**
     * A placeholder string in addition to the label. If this is set, the label
     * will always float.
     */placeholder:{type:String,// need to set a default so _computeAlwaysFloatLabel is run
value:""},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `readonly`
     * property.
     */readonly:{type:Boolean,value:!1},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `size` property.
     */size:{type:Number},// Nonstandard attributes for binding if needed
/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `autocapitalize`
     * property.
     *
     * @type {string}
     */autocapitalize:{type:String,value:"none"},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `autocorrect`
     * property.
     */autocorrect:{type:String,value:"off"},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `autosave`
     * property, used with type=search.
     */autosave:{type:String},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `results` property,
     * used with type=search.
     */results:{type:Number},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the `<input is="iron-input">`'s `accept` property,
     * used with type=file.
     */accept:{type:String},/**
     * If you're using PaperInputBehavior to implement your own paper-input-like
     * element, bind this to the`<input is="iron-input">`'s `multiple` property,
     * used with type=file.
     */multiple:{type:Boolean},/** @private */_ariaDescribedBy:{type:String,value:""},/** @private */_ariaLabelledBy:{type:String,value:""},/** @private */_inputId:{type:String,value:""}},listeners:{"addon-attached":"_onAddonAttached"},/**
   * @type {!Object}
   */keyBindings:{"shift+tab:keydown":"_onShiftTabDown"},/** @private */hostAttributes:{tabindex:0},/**
   * Returns a reference to the input element.
   * @return {!HTMLElement}
   */get inputElement(){// Chrome generates audit errors if an <input type="password"> has a
// duplicate ID, which is almost always true in Shady DOM. Generate
// a unique ID instead.
if(!this.$){this.$={}}if(!this.$.input){this._generateInputId();this.$.input=this.$$("#"+this._inputId)}return this.$.input},/**
   * Returns a reference to the focusable element.
   * @return {!HTMLElement}
   */get _focusableElement(){return this.inputElement},created:function(){// These types have some default placeholder text; overlapping
// the label on top of it looks terrible. Auto-float the label in this case.
this._typesThatHaveText=["date","datetime","datetime-local","month","time","week","file"]},attached:function(){this._updateAriaLabelledBy();// In the 2.0 version of the element, this is handled in `onIronInputReady`,
// i.e. after the native input has finished distributing. In the 1.0
// version, the input is in the shadow tree, so it's already available.
if(!PolymerElement&&this.inputElement&&-1!==this._typesThatHaveText.indexOf(this.inputElement.type)){this.alwaysFloatLabel=!0}},_appendStringWithSpace:function(str,more){if(str){str=str+" "+more}else{str=more}return str},_onAddonAttached:function(event){var target=dom(event).rootTarget;if(target.id){this._ariaDescribedBy=this._appendStringWithSpace(this._ariaDescribedBy,target.id)}else{var id="paper-input-add-on-"+PaperInputHelper.NextAddonID++;target.id=id;this._ariaDescribedBy=this._appendStringWithSpace(this._ariaDescribedBy,id)}},/**
   * Validates the input element and sets an error style if needed.
   *
   * @return {boolean}
   */validate:function(){return this.inputElement.validate()},/**
   * Forward focus to inputElement. Overriden from IronControlState.
   */_focusBlurHandler:function(event){IronControlState._focusBlurHandler.call(this,event);// Forward the focus to the nested input.
if(this.focused&&!this._shiftTabPressed&&this._focusableElement){this._focusableElement.focus()}},/**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param {CustomEvent} event A key combination event.
   */_onShiftTabDown:function(event){var oldTabIndex=this.getAttribute("tabindex");this._shiftTabPressed=!0;this.setAttribute("tabindex","-1");this.async(function(){this.setAttribute("tabindex",oldTabIndex);this._shiftTabPressed=!1},1)},/**
   * If `autoValidate` is true, then validates the element.
   */_handleAutoValidate:function(){if(this.autoValidate)this.validate()},/**
   * Restores the cursor to its original position after updating the value.
   * @param {string} newValue The value that should be saved.
   */updateValueAndPreserveCaret:function(newValue){// Not all elements might have selection, and even if they have the
// right properties, accessing them might throw an exception (like for
// <input type=number>)
try{var start=this.inputElement.selectionStart;this.value=newValue;// The cursor automatically jumps to the end after re-setting the value,
// so restore it to its original position.
this.inputElement.selectionStart=start;this.inputElement.selectionEnd=start}catch(e){// Just set the value and give up on the caret.
this.value=newValue}},_computeAlwaysFloatLabel:function(alwaysFloatLabel,placeholder){return placeholder||alwaysFloatLabel},_updateAriaLabelledBy:function(){var label=dom(this.root).querySelector("label");if(!label){this._ariaLabelledBy="";return}var labelledBy;if(label.id){labelledBy=label.id}else{labelledBy="paper-input-label-"+PaperInputHelper.NextLabelID++;label.id=labelledBy}this._ariaLabelledBy=labelledBy},_generateInputId:function(){if(!this._inputId||""===this._inputId){this._inputId="input-"+PaperInputHelper.NextInputID++}},_onChange:function(event){// In the Shadow DOM, the `change` event is not leaked into the
// ancestor tree, so we must do this manually.
// See
// https://w3c.github.io/webcomponents/spec/shadow/#events-that-are-not-leaked-into-ancestor-trees.
if(this.shadowRoot){this.fire(event.type,{sourceEvent:event},{node:this,bubbles:event.bubbles,cancelable:event.cancelable})}},_autofocusChanged:function(){// Firefox doesn't respect the autofocus attribute if it's applied after
// the page is loaded (Chrome/WebKit do respect it), preventing an
// autofocus attribute specified in markup from taking effect when the
// element is upgraded. As a workaround, if the autofocus property is set,
// and the focus hasn't already been moved elsewhere, we take focus.
if(this.autofocus&&this._focusableElement){// In IE 11, the default document.activeElement can be the page's
// outermost html element, but there are also cases (under the
// polyfill?) in which the activeElement is not a real HTMLElement, but
// just a plain object. We identify the latter case as having no valid
// activeElement.
var activeElement=document.activeElement,isActiveElementValid=activeElement instanceof HTMLElement,isSomeElementActive=isActiveElementValid&&activeElement!==document.body&&activeElement!==document.documentElement;/* IE 11 */if(!isSomeElementActive){// No specific element has taken the focus yet, so we can take it.
this._focusableElement.focus()}}}},PaperInputBehavior=[IronControlState,IronA11yKeysBehavior,PaperInputBehaviorImpl];var paperInputBehavior={PaperInputHelper:PaperInputHelper,PaperInputBehaviorImpl:PaperInputBehaviorImpl,PaperInputBehavior:PaperInputBehavior};Polymer({is:"paper-input",_template:html`
    <style>
      :host {
        display: block;
      }

      :host([focused]) {
        outline: none;
      }

      :host([hidden]) {
        display: none !important;
      }

      input {
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
      }

      /* In 1.x, the <input> is distributed to paper-input-container, which styles it.
      In 2.x the <iron-input> is distributed to paper-input-container, which styles
      it, but in order for this to work correctly, we need to reset some
      of the native input's properties to inherit (from the iron-input) */
      iron-input > input {
        @apply --paper-input-container-shared-input-style;
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        letter-spacing: inherit;
        word-spacing: inherit;
        line-height: inherit;
        text-shadow: inherit;
        color: inherit;
        cursor: inherit;
      }

      input:disabled {
        @apply --paper-input-container-input-disabled;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        @apply --paper-input-container-input-webkit-spinner;
      }

      input::-webkit-clear-button {
        @apply --paper-input-container-input-webkit-clear;
      }

      input::-webkit-calendar-picker-indicator {
        @apply --paper-input-container-input-webkit-calendar-picker-indicator;
      }

      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input::-ms-clear {
        @apply --paper-input-container-ms-clear;
      }

      input::-ms-reveal {
        @apply --paper-input-container-ms-reveal;
      }

      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      label {
        pointer-events: none;
      }
    </style>

    <paper-input-container id="container" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" auto-validate$="[[autoValidate]]" disabled$="[[disabled]]" invalid="[[invalid]]">

      <slot name="prefix" slot="prefix"></slot>

      <label hidden$="[[!label]]" aria-hidden="true" for$="[[_inputId]]" slot="label">[[label]]</label>

      <!-- Need to bind maxlength so that the paper-input-char-counter works correctly -->
      <iron-input bind-value="{{value}}" slot="input" class="input-element" id$="[[_inputId]]" maxlength$="[[maxlength]]" allowed-pattern="[[allowedPattern]]" invalid="{{invalid}}" validator="[[validator]]">
        <input aria-labelledby$="[[_ariaLabelledBy]]" aria-describedby$="[[_ariaDescribedBy]]" disabled$="[[disabled]]" title$="[[title]]" type$="[[type]]" pattern$="[[pattern]]" required$="[[required]]" autocomplete$="[[autocomplete]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" step$="[[step]]" name$="[[name]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" list$="[[list]]" size$="[[size]]" autocapitalize$="[[autocapitalize]]" autocorrect$="[[autocorrect]]" on-change="_onChange" tabindex$="[[tabIndex]]" autosave$="[[autosave]]" results$="[[results]]" accept$="[[accept]]" multiple$="[[multiple]]">
      </iron-input>

      <slot name="suffix" slot="suffix"></slot>

      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
      </template>

      <template is="dom-if" if="[[charCounter]]">
        <paper-input-char-counter slot="add-on"></paper-input-char-counter>
      </template>

    </paper-input-container>
  `,behaviors:[PaperInputBehavior,IronFormElementBehavior],properties:{value:{// Required for the correct TypeScript type-generation
type:String}},/**
   * Returns a reference to the focusable element. Overridden from
   * PaperInputBehavior to correctly focus the native input.
   *
   * @return {!HTMLElement}
   */get _focusableElement(){return this.inputElement._inputElement},// Note: This event is only available in the 1.0 version of this element.
// In 2.0, the functionality of `_onIronInputReady` is done in
// PaperInputBehavior::attached.
listeners:{"iron-input-ready":"_onIronInputReady"},_onIronInputReady:function(){// Even though this is only used in the next line, save this for
// backwards compatibility, since the native input had this ID until 2.0.5.
if(!this.$.nativeInput){this.$.nativeInput=this.$$("input")}if(this.inputElement&&-1!==this._typesThatHaveText.indexOf(this.$.nativeInput.type)){this.alwaysFloatLabel=!0}// Only validate when attached if the input already has a value.
if(!!this.inputElement.bindValue){this.$.container._handleValueAndAutoValidate(this.inputElement)}}});Polymer({is:"paper-menu-grow-height-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node,rect=node.getBoundingClientRect(),height=rect.height;this._effect=new KeyframeEffect(node,[{height:height/2+"px"},{height:height+"px"}],this.timingFromConfig(config));return this._effect}});Polymer({is:"paper-menu-grow-width-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node,rect=node.getBoundingClientRect(),width=rect.width;this._effect=new KeyframeEffect(node,[{width:width/2+"px"},{width:width+"px"}],this.timingFromConfig(config));return this._effect}});Polymer({is:"paper-menu-shrink-width-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node,rect=node.getBoundingClientRect(),width=rect.width;this._effect=new KeyframeEffect(node,[{width:width+"px"},{width:width-width/20+"px"}],this.timingFromConfig(config));return this._effect}});Polymer({is:"paper-menu-shrink-height-animation",behaviors:[NeonAnimationBehavior],configure:function(config){var node=config.node,rect=node.getBoundingClientRect(),height=rect.height;this.setPrefixedProperty(node,"transformOrigin","0 0");this._effect=new KeyframeEffect(node,[{height:height+"px",transform:"translateY(0)"},{height:height/2+"px",transform:"translateY(-20px)"}],this.timingFromConfig(config));return this._effect}});var config={ANIMATION_CUBIC_BEZIER:"cubic-bezier(.3,.95,.5,1)",MAX_ANIMATION_TIME_MS:400};/**
   Material design: [Dropdown
   buttons](https://www.google.com/design/spec/components/buttons.html#buttons-dropdown-buttons)
   
   `paper-menu-button` allows one to compose a designated "trigger" element with
   another element that represents "content", to create a dropdown menu that
   displays the "content" when the "trigger" is clicked.
   
   The child element assigned to the `dropdown-trigger` slot will be used as the
   "trigger" element. The child element assigned to the `dropdown-content` slot
   will be used as the "content" element.
   
   The `paper-menu-button` is sensitive to its content's `iron-select` events. If
   the "content" element triggers an `iron-select` event, the `paper-menu-button`
   will close automatically.
   
   Example:
   
       <paper-menu-button>
         <paper-icon-button icon="menu"
   slot="dropdown-trigger"></paper-icon-button> <paper-listbox
   slot="dropdown-content"> <paper-item>Share</paper-item>
           <paper-item>Settings</paper-item>
           <paper-item>Help</paper-item>
         </paper-listbox>
       </paper-menu-button>
   
   ### Styling
   
   The following custom properties and mixins are also available for styling:
   
   Custom property | Description | Default
   ----------------|-------------|----------
   `--paper-menu-button-dropdown-background` | Background color of the paper-menu-button dropdown | `--primary-background-color`
   `--paper-menu-button` | Mixin applied to the paper-menu-button | `{}`
   `--paper-menu-button-disabled` | Mixin applied to the paper-menu-button when disabled | `{}`
   `--paper-menu-button-dropdown` | Mixin applied to the paper-menu-button dropdown | `{}`
   `--paper-menu-button-content` | Mixin applied to the paper-menu-button content | `{}`
   
   @hero hero.svg
   @demo demo/index.html
   */const PaperMenuButton=Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 8px;
        outline: none;

        @apply --paper-menu-button;
      }

      :host([disabled]) {
        cursor: auto;
        color: var(--disabled-text-color);

        @apply --paper-menu-button-disabled;
      }

      iron-dropdown {
        @apply --paper-menu-button-dropdown;
      }

      .dropdown-content {
        @apply --shadow-elevation-2dp;

        position: relative;
        border-radius: 2px;
        background-color: var(--paper-menu-button-dropdown-background, var(--primary-background-color));

        @apply --paper-menu-button-content;
      }

      :host([vertical-align="top"]) .dropdown-content {
        margin-bottom: 20px;
        margin-top: -10px;
        top: 10px;
      }

      :host([vertical-align="bottom"]) .dropdown-content {
        bottom: 10px;
        margin-bottom: -10px;
        margin-top: 20px;
      }

      #trigger {
        cursor: pointer;
      }
    </style>

    <div id="trigger" on-tap="toggle">
      <slot name="dropdown-trigger"></slot>
    </div>

    <iron-dropdown id="dropdown" opened="{{opened}}" horizontal-align="[[horizontalAlign]]" vertical-align="[[verticalAlign]]" dynamic-align="[[dynamicAlign]]" horizontal-offset="[[horizontalOffset]]" vertical-offset="[[verticalOffset]]" no-overlap="[[noOverlap]]" open-animation-config="[[openAnimationConfig]]" close-animation-config="[[closeAnimationConfig]]" no-animations="[[noAnimations]]" focus-target="[[_dropdownContent]]" allow-outside-scroll="[[allowOutsideScroll]]" restore-focus-on-close="[[restoreFocusOnClose]]" on-iron-overlay-canceled="__onIronOverlayCanceled">
      <div slot="dropdown-content" class="dropdown-content">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    </iron-dropdown>
`,is:"paper-menu-button",/**
   * Fired when the dropdown opens.
   *
   * @event paper-dropdown-open
   */ /**
       * Fired when the dropdown closes.
       *
       * @event paper-dropdown-close
       */behaviors:[IronA11yKeysBehavior,IronControlState],properties:{/**
     * True if the content is currently displayed.
     */opened:{type:Boolean,value:!1,notify:!0,observer:"_openedChanged"},/**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */horizontalAlign:{type:String,value:"left",reflectToAttribute:!0},/**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */verticalAlign:{type:String,value:"top",reflectToAttribute:!0},/**
     * If true, the `horizontalAlign` and `verticalAlign` properties will
     * be considered preferences instead of strict requirements when
     * positioning the dropdown and may be changed if doing so reduces
     * the area of the dropdown falling outside of `fitInto`.
     */dynamicAlign:{type:Boolean},/**
     * A pixel value that will be added to the position calculated for the
     * given `horizontalAlign`. Use a negative value to offset to the
     * left, or a positive value to offset to the right.
     */horizontalOffset:{type:Number,value:0,notify:!0},/**
     * A pixel value that will be added to the position calculated for the
     * given `verticalAlign`. Use a negative value to offset towards the
     * top, or a positive value to offset towards the bottom.
     */verticalOffset:{type:Number,value:0,notify:!0},/**
     * If true, the dropdown will be positioned so that it doesn't overlap
     * the button.
     */noOverlap:{type:Boolean},/**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */noAnimations:{type:Boolean,value:!1},/**
     * Set to true to disable automatically closing the dropdown after
     * a selection has been made.
     */ignoreSelect:{type:Boolean,value:!1},/**
     * Set to true to enable automatically closing the dropdown after an
     * item has been activated, even if the selection did not change.
     */closeOnActivate:{type:Boolean,value:!1},/**
     * An animation config. If provided, this will be used to animate the
     * opening of the dropdown.
     */openAnimationConfig:{type:Object,value:function(){return[{name:"fade-in-animation",timing:{delay:100,duration:200}},{name:"paper-menu-grow-width-animation",timing:{delay:100,duration:150,easing:config.ANIMATION_CUBIC_BEZIER}},{name:"paper-menu-grow-height-animation",timing:{delay:100,duration:275,easing:config.ANIMATION_CUBIC_BEZIER}}]}},/**
     * An animation config. If provided, this will be used to animate the
     * closing of the dropdown.
     */closeAnimationConfig:{type:Object,value:function(){return[{name:"fade-out-animation",timing:{duration:150}},{name:"paper-menu-shrink-width-animation",timing:{delay:100,duration:50,easing:config.ANIMATION_CUBIC_BEZIER}},{name:"paper-menu-shrink-height-animation",timing:{duration:200,easing:"ease-in"}}]}},/**
     * By default, the dropdown will constrain scrolling on the page
     * to itself when opened.
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     */allowOutsideScroll:{type:Boolean,value:!1},/**
     * Whether focus should be restored to the button when the menu closes.
     */restoreFocusOnClose:{type:Boolean,value:!0},/**
     * This is the element intended to be bound as the focus target
     * for the `iron-dropdown` contained by `paper-menu-button`.
     */_dropdownContent:{type:Object}},hostAttributes:{role:"group","aria-haspopup":"true"},listeners:{"iron-activate":"_onIronActivate","iron-select":"_onIronSelect"},/**
   * The content element that is contained by the menu button, if any.
   */get contentElement(){// Polymer 2.x returns slot.assignedNodes which can contain text nodes.
for(var nodes=dom(this.$.content).getDistributedNodes(),i=0,l=nodes.length;i<l;i++){if(nodes[i].nodeType===Node.ELEMENT_NODE){return nodes[i]}}},/**
   * Toggles the dropdown content between opened and closed.
   */toggle:function(){if(this.opened){this.close()}else{this.open()}},/**
   * Make the dropdown content appear as an overlay positioned relative
   * to the dropdown trigger.
   */open:function(){if(this.disabled){return}this.$.dropdown.open()},/**
   * Hide the dropdown content.
   */close:function(){this.$.dropdown.close()},/**
   * When an `iron-select` event is received, the dropdown should
   * automatically close on the assumption that a value has been chosen.
   *
   * @param {CustomEvent} event A CustomEvent instance with type
   * set to `"iron-select"`.
   */_onIronSelect:function(event){if(!this.ignoreSelect){this.close()}},/**
   * Closes the dropdown when an `iron-activate` event is received if
   * `closeOnActivate` is true.
   *
   * @param {CustomEvent} event A CustomEvent of type 'iron-activate'.
   */_onIronActivate:function(event){if(this.closeOnActivate){this.close()}},/**
   * When the dropdown opens, the `paper-menu-button` fires `paper-open`.
   * When the dropdown closes, the `paper-menu-button` fires `paper-close`.
   *
   * @param {boolean} opened True if the dropdown is opened, otherwise false.
   * @param {boolean} oldOpened The previous value of `opened`.
   */_openedChanged:function(opened,oldOpened){if(opened){// TODO(cdata): Update this when we can measure changes in distributed
// children in an idiomatic way.
// We poke this property in case the element has changed. This will
// cause the focus target for the `iron-dropdown` to be updated as
// necessary:
this._dropdownContent=this.contentElement;this.fire("paper-dropdown-open")}else if(null!=oldOpened){this.fire("paper-dropdown-close")}},/**
   * If the dropdown is open when disabled becomes true, close the
   * dropdown.
   *
   * @param {boolean} disabled True if disabled, otherwise false.
   */_disabledChanged:function(disabled){IronControlState._disabledChanged.apply(this,arguments);if(disabled&&this.opened){this.close()}},__onIronOverlayCanceled:function(event){var uiEvent=event.detail,trigger=this.$.trigger,path=dom(uiEvent).path;if(-1<path.indexOf(trigger)){event.preventDefault()}}});Object.keys(config).forEach(function(key){PaperMenuButton[key]=config[key]});var paperMenuButton={PaperMenuButton:PaperMenuButton};Polymer({_template:html`
    <style include="paper-dropdown-menu-shared-styles"></style>

    <!-- this div fulfills an a11y requirement for combobox, do not remove -->
    <span role="button"></span>
    <paper-menu-button id="menuButton" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" dynamic-align="[[dynamicAlign]]" vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat, verticalOffset)]]" disabled="[[disabled]]" no-animations="[[noAnimations]]" on-iron-select="_onIronSelect" on-iron-deselect="_onIronDeselect" opened="{{opened}}" close-on-activate allow-outside-scroll="[[allowOutsideScroll]]" restore-focus-on-close="[[restoreFocusOnClose]]">
      <!-- support hybrid mode: user might be using paper-menu-button 1.x which distributes via <content> -->
      <div class="dropdown-trigger" slot="dropdown-trigger">
        <paper-ripple></paper-ripple>
        <!-- paper-input has type="text" for a11y, do not remove -->
        <paper-input type="text" invalid="[[invalid]]" readonly disabled="[[disabled]]" value="[[value]]" placeholder="[[placeholder]]" error-message="[[errorMessage]]" always-float-label="[[alwaysFloatLabel]]" no-label-float="[[noLabelFloat]]" label="[[label]]">
          <!-- support hybrid mode: user might be using paper-input 1.x which distributes via <content> -->
          <iron-icon icon="paper-dropdown-menu:arrow-drop-down" suffix slot="suffix"></iron-icon>
        </paper-input>
      </div>
      <slot id="content" name="dropdown-content" slot="dropdown-content"></slot>
    </paper-menu-button>
`,is:"paper-dropdown-menu",behaviors:[IronButtonState,IronControlState,IronFormElementBehavior,IronValidatableBehavior],properties:{/**
     * The derived "label" of the currently selected item. This value
     * is the `label` property on the selected item if set, or else the
     * trimmed text content of the selected item.
     */selectedItemLabel:{type:String,notify:!0,readOnly:!0},/**
     * The last selected item. An item is selected if the dropdown menu has
     * a child with slot `dropdown-content`, and that child triggers an
     * `iron-select` event with the selected `item` in the `detail`.
     *
     * @type {?Object}
     */selectedItem:{type:Object,notify:!0,readOnly:!0},/**
     * The value for this element that will be used when submitting in
     * a form. It reflects the value of `selectedItemLabel`. If set directly,
     * it will not update the `selectedItemLabel` value.
     */value:{type:String,notify:!0},/**
     * The label for the dropdown.
     */label:{type:String},/**
     * The placeholder for the dropdown.
     */placeholder:{type:String},/**
     * The error message to display when invalid.
     */errorMessage:{type:String},/**
     * True if the dropdown is open. Otherwise, false.
     */opened:{type:Boolean,notify:!0,value:!1,observer:"_openedChanged"},/**
     * By default, the dropdown will constrain scrolling on the page
     * to itself when opened.
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     */allowOutsideScroll:{type:Boolean,value:!1},/**
     * Set to true to disable the floating label. Bind this to the
     * `<paper-input-container>`'s `noLabelFloat` property.
     */noLabelFloat:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Set to true to always float the label. Bind this to the
     * `<paper-input-container>`'s `alwaysFloatLabel` property.
     */alwaysFloatLabel:{type:Boolean,value:!1},/**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */noAnimations:{type:Boolean,value:!1},/**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */horizontalAlign:{type:String,value:"right"},/**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */verticalAlign:{type:String,value:"top"},/**
     * Overrides the vertical offset computed in
     * _computeMenuVerticalOffset.
     */verticalOffset:Number,/**
     * If true, the `horizontalAlign` and `verticalAlign` properties will
     * be considered preferences instead of strict requirements when
     * positioning the dropdown and may be changed if doing so reduces
     * the area of the dropdown falling outside of `fitInto`.
     */dynamicAlign:{type:Boolean},/**
     * Whether focus should be restored to the dropdown when the menu closes.
     */restoreFocusOnClose:{type:Boolean,value:!0}},listeners:{tap:"_onTap"},/**
   * @type {!Object}
   */keyBindings:{"up down":"open",esc:"close"},hostAttributes:{role:"combobox","aria-autocomplete":"none","aria-haspopup":"true"},observers:["_selectedItemChanged(selectedItem)"],attached:function(){// NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
// child will cause an `iron-select` event to fire while the element is
// still in a `DocumentFragment`. This has the effect of causing
// handlers not to fire. So, we double check this value on attached:
var contentElement=this.contentElement;if(contentElement&&contentElement.selectedItem){this._setSelectedItem(contentElement.selectedItem)}},/**
   * The content element that is contained by the dropdown menu, if any.
   */get contentElement(){// Polymer 2.x returns slot.assignedNodes which can contain text nodes.
for(var nodes=dom(this.$.content).getDistributedNodes(),i=0,l=nodes.length;i<l;i++){if(nodes[i].nodeType===Node.ELEMENT_NODE){return nodes[i]}}},/**
   * Show the dropdown content.
   */open:function(){this.$.menuButton.open()},/**
   * Hide the dropdown content.
   */close:function(){this.$.menuButton.close()},/**
   * A handler that is called when `iron-select` is fired.
   *
   * @param {CustomEvent} event An `iron-select` event.
   */_onIronSelect:function(event){this._setSelectedItem(event.detail.item)},/**
   * A handler that is called when `iron-deselect` is fired.
   *
   * @param {CustomEvent} event An `iron-deselect` event.
   */_onIronDeselect:function(event){this._setSelectedItem(null)},/**
   * A handler that is called when the dropdown is tapped.
   *
   * @param {CustomEvent} event A tap event.
   */_onTap:function(event){if(findOriginalTarget(event)===this){this.open()}},/**
   * Compute the label for the dropdown given a selected item.
   *
   * @param {Element} selectedItem A selected Element item, with an
   * optional `label` property.
   */_selectedItemChanged:function(selectedItem){var value="";if(!selectedItem){value=""}else{value=selectedItem.label||selectedItem.getAttribute("label")||selectedItem.textContent.trim()}this.value=value;this._setSelectedItemLabel(value)},/**
   * Compute the vertical offset of the menu based on the value of
   * `noLabelFloat`.
   *
   * @param {boolean} noLabelFloat True if the label should not float
   * @param {number=} opt_verticalOffset Optional offset from the user
   * above the input, otherwise false.
   */_computeMenuVerticalOffset:function(noLabelFloat,opt_verticalOffset){// Override offset if it's passed from the user.
if(opt_verticalOffset){return opt_verticalOffset}// NOTE(cdata): These numbers are somewhat magical because they are
// derived from the metrics of elements internal to `paper-input`'s
// template. The metrics will change depending on whether or not the
// input has a floating label.
return noLabelFloat?-4:8},/**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */_getValidity:function(_value){return this.disabled||!this.required||this.required&&!!this.value},_openedChanged:function(){var openState=this.opened?"true":"false",e=this.contentElement;if(e){e.setAttribute("aria-expanded",openState)}}});const PaperItemBehaviorImpl={hostAttributes:{role:"option",tabindex:"0"}},PaperItemBehavior=[IronButtonState,IronControlState,PaperItemBehaviorImpl];/** @polymerBehavior */var paperItemBehavior={PaperItemBehaviorImpl:PaperItemBehaviorImpl,PaperItemBehavior:PaperItemBehavior};const $_documentContainer$2=document.createElement("template");$_documentContainer$2.setAttribute("style","display: none;");$_documentContainer$2.innerHTML=`<dom-module id="paper-item-shared-styles">
  <template>
    <style>
      :host, .paper-item {
        display: block;
        position: relative;
        min-height: var(--paper-item-min-height, 48px);
        padding: 0px 16px;
      }

      .paper-item {
        @apply --paper-font-subhead;
        border:none;
        outline: none;
        background: white;
        width: 100%;
        text-align: left;
      }

      :host([hidden]), .paper-item[hidden] {
        display: none !important;
      }

      :host(.iron-selected), .paper-item.iron-selected {
        font-weight: var(--paper-item-selected-weight, bold);

        @apply --paper-item-selected;
      }

      :host([disabled]), .paper-item[disabled] {
        color: var(--paper-item-disabled-color, var(--disabled-text-color));

        @apply --paper-item-disabled;
      }

      :host(:focus), .paper-item:focus {
        position: relative;
        outline: 0;

        @apply --paper-item-focused;
      }

      :host(:focus):before, .paper-item:focus:before {
        @apply --layout-fit;

        background: currentColor;
        content: '';
        opacity: var(--dark-divider-opacity);
        pointer-events: none;

        @apply --paper-item-focused-before;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$2.content);Polymer({_template:html`
    <style include="paper-item-shared-styles">
      :host {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --paper-font-subhead;

        @apply --paper-item;
      }
    </style>
    <slot></slot>
`,is:"paper-item",behaviors:[PaperItemBehavior]});Polymer({_template:html`
    <style>
      :host {
        display: block;
        padding: 8px 0;

        background: var(--paper-listbox-background-color, var(--primary-background-color));
        color: var(--paper-listbox-color, var(--primary-text-color));

        @apply --paper-listbox;
      }
    </style>

    <slot></slot>
`,is:"paper-listbox",behaviors:[IronMenuBehavior],/** @private */hostAttributes:{role:"listbox"}});const template$4=html`
  <style include="paper-spinner-styles"></style>

  <div id="spinnerContainer" class-name="[[__computeContainerClasses(active, __coolingDown)]]" on-animationend="__reset" on-webkit-animation-end="__reset">
    <div class="spinner-layer">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
`;template$4.setAttribute("strip-whitespace","");/**
                                                 Material design: [Progress &
                                                 activity](https://www.google.com/design/spec/components/progress-activity.html)
                                                                                               Element providing a single color material design circular spinner.
                                                                                                   <paper-spinner-lite active></paper-spinner-lite>
                                                                                               The default spinner is blue. It can be customized to be a different color.
                                                                                               ### Accessibility
                                                                                               Alt attribute should be set to provide adequate context for accessibility. If
                                                 not provided, it defaults to 'loading'. Empty alt can be provided to mark the
                                                 element as decorative if alternative content is provided in another form (e.g. a
                                                 text block following the spinner).
                                                                                                   <paper-spinner-lite alt="Loading contacts list" active></paper-spinner-lite>
                                                                                               ### Styling
                                                                                               The following custom properties and mixins are available for styling:
                                                                                               Custom property | Description | Default
                                                 ----------------|-------------|----------
                                                 `--paper-spinner-color` | Color of the spinner | `--google-blue-500`
                                                 `--paper-spinner-stroke-width` | The width of the spinner stroke | 3px
                                                                                               @group Paper Elements
                                                 @element paper-spinner-lite
                                                 @hero hero.svg
                                                 @demo demo/index.html
                                                 */Polymer({_template:template$4,is:"paper-spinner-lite",behaviors:[PaperSpinnerBehavior]});const ADD_GUEST="ADD_GUEST",register=(guest,msg,callback)=>dispatch=>{const url="https://europe-west1-natepaas.cloudfunctions.net/register";dispatch(updateIsRegLoading(!0));fetch(url,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({guests:[guest]})}).then(response=>response.json()).then(data=>{dispatch({type:ADD_GUEST,guest});const dialogText=msg+guest.name;dispatch(openDialog(dialogText));dispatch(updateIsRegLoading(!1));callback()}).catch(error=>{console.error(error);dispatch(updateIsRegLoading(!1))})};var register$1={ADD_GUEST:ADD_GUEST,register:register};class MultiCarousel extends LitElement{static get is(){return"multi-carousel"}static get properties(){return{numslides:{type:Number},arrayContent:{type:Array},master:{type:Boolean},masterId:{type:String,attribute:"master-id"},slideChecked:{type:Number,attribute:"slide-checked-number"},noNavigation:{type:Boolean,attribute:"no-arrows"},noArrows:{type:Boolean,attribute:"no-nav"}}}constructor(){super();this.master=!1;this.masterId="";this.slideChecked=1;this.noArrows=!1;this.noNavigation=!1}connectedCallback(){super.connectedCallback();if(""!==this.masterId){document.addEventListener("multicarouselnextslide",this.nextslide.bind(this))}this.arrayContent=this.children;this.numslides=this.arrayContent.length+1;this.opArr=Array.apply(null,{length:this.numslides}).map(Number.call,Number);this.opArr.shift();//Delete 0 element
this.cssliderStyles=html$2`${this.opArr.map(val=>`.csslider > input:nth-of-type(${val}):checked ~ ul li:first-of-type { margin-left: -${100*(val-1)}%; }`).join("\n")}`;this.cssliderInputStyles=html$2`${this.opArr.map(val=>`.csslider > input:nth-of-type(${val}):checked ~ .navigation label:nth-of-type(${val}):after`).join(", ")} { opacity: 1; }`;this.cssliderInputCheckedStyles=html$2`.csslider.infinity > input:first-of-type:checked ~ .arrows label.goto-last,
    ${this.opArr.map(val=>`.csslider > input:nth-of-type(${val}):checked ~ .arrows > label:nth-of-type(${val-1})`).join(", ")} {
      display: block;
      left: 0;
      right: auto;
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }`;this.cssliderInfinityStyles=html$2`.csslider.infinity > input:last-of-type:checked ~ .arrows label.goto-first,
    ${this.opArr.map(val=>`.csslider > input:nth-of-type(${val}):checked ~ .arrows > label:nth-of-type(${val+1})`).join(", ")} {
      display: block;
      right: 0;
      left: auto;
      -moz-transform: rotate(225deg);
      -ms-transform: rotate(225deg);
      -o-transform: rotate(225deg);
      -webkit-transform: rotate(225deg);
      transform: rotate(225deg);
    }`;this.htmlInputs=`${this.opArr.map(val=>html$2`<input type="radio" name="slides" id="slides_${val}"/>`)}`}disconnectedCallback(){super.disconnectedCallback();document.removeEventListener("multicarouselnextslide",this.nextSlide.bind(this))}static get styles(){return css`
      :host {
        --main-color: #000;
        --slides-bg-color: #FFF;
        --slides-border: 10px solid var(--slides-bg-color);
        --slides-border-radius:0px;
        --slides-padding: 0;
        --slides-width: 820px;
        --slides-height: 420px;
        --hover-arrow-color: #FF0;
        --nav-point-color: #3A3A3A;
        height: 100%;
        overflow-x: hidden;
        text-align: center;
        font: 400 100% 'Raleway', 'Lato';
        background-color: transparent;
        color: var(--main-color);
        padding-bottom: 60px;
      }
      .csslider {
        margin: auto -3em;
        text-align:center;
        -moz-perspective: 1300px;
        -ms-perspective: 1300px;
        -webkit-perspective: 1300px;
        perspective: 1300px;
        // display: inline-block;
        position: relative;
        margin-bottom: 22px;
      }
      @media (min-width: 460px) {
        .csslider {
          margin: auto 3em;
        }
      }
      .csslider > input {
        display: none;
      }
      .csslider > ul {
        position: relative;
        width: var(--slides-width);
        height: var(--slides-height);
        z-index: 1;
        font-size: 0;
        line-height: 0;
        background-color: var(--slides-bg-color);
        border: var(--slides-border);
        border-radius: var(--slides-border-radius);
        margin: 0 auto;
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .csslider > ul > li {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: var(--slides-padding);
        overflow: hidden;
        font-size: 15px;
        font-size: initial;
        line-height: normal;
        -moz-transition: all 0.5s cubic-bezier(0.4, 1.3, 0.65, 1);
        -o-transition: all 0.5s ease-out;
        -webkit-transition: all 0.5s cubic-bezier(0.4, 1.3, 0.65, 1);
        transition: all 0.5s cubic-bezier(0.4, 1.3, 0.65, 1);
        vertical-align: top;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: normal;
      }
      .csslider > ul > li.scrollable {
        overflow-y: scroll;
      }
      .csslider > .navigation {
        position: absolute;
        bottom: -8px;
        left: 50%;
        z-index: 10;
        margin-bottom: -10px;
        font-size: 0;
        line-height: 0;
        text-align: center;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .csslider > .navigation > div {
        margin-left: -100%;
      }
      .csslider > .navigation label {
        position: relative;
        display: inline-block;
        cursor: pointer;
        border-radius: 50%;
        margin: 0 4px;
        padding: 4px;
        background: var(--nav-point-color);
      }
      .csslider > .navigation label:hover:after {
        opacity: 1;
      }
      .csslider > .navigation label:after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -6px;
        margin-top: -6px;
        background: #71ad37;
        border-radius: 50%;
        padding: 6px;
        opacity: 0;
      }
      .csslider > .arrows {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .csslider.inside .navigation {
        bottom: 10px;
        margin-bottom: 10px;
      }
      .csslider.inside .navigation label {
        border: 1px solid #7e7e7e;
      }
      .csslider > .arrows {
        position: absolute;
        left: -31px;
        top: 50%;
        width: 100%;
        height: 26px;
        padding: 0 31px;
        z-index: 0;
        -moz-box-sizing: content-box;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
      }
      .csslider > .arrows label {
        display: none;
        position: absolute;
        top: -50%;
        padding: 13px;
        box-shadow: inset 2px -2px 1px 1px var(--main-color);
        cursor: pointer;
        -moz-transition: box-shadow 0.15s, margin 0.15s;
        -o-transition: box-shadow 0.15s, margin 0.15s;
        -webkit-transition: box-shadow 0.15s, margin 0.15s;
        transition: box-shadow 0.15s, margin 0.15s;
      }
      .csslider > .arrows label:hover {
        box-shadow: inset 3px -3px 1px 2px var(--hover-arrow-color);
        margin: 0 0px;
      }
      .csslider > .arrows label:before {
        content: '';
        position: absolute;
        top: -100%;
        left: -100%;
        height: 300%;
        width: 300%;
      }
      .noshow {
        visibility: hidden;
      }

      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjx4wWw.ttf) format('truetype');
      }
      @font-face {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 400;
        src: local('Raleway'), local('Raleway-Regular'), url(https://fonts.gstatic.com/s/raleway/v13/1Ptug8zYS_SKggPNyC0ISg.ttf) format('truetype');
      }
      @font-face {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 700;
        src: local('Raleway Bold'), local('Raleway-Bold'), url(https://fonts.gstatic.com/s/raleway/v13/1Ptrg8zYS_SKggPNwJYtWqZPBQ.ttf) format('truetype');
      }
      ::-webkit-scrollbar {
        width: 2px;
        background: rgba(255, 255, 255, 0.1);
      }
      ::-webkit-scrollbar-track {
        background: none;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(74, 168, 0, 0.6);
      }
      ul,
      ol {
        padding-left: 40px;
      }
      #theslider {
        font-family: 'Lato';
      }
      .scrollable p {
        padding: 30px;
        text-align: justify;
        line-height: 140%;
        font-size: 120%;
      }

      @-webkit-keyframes sign-anim {
        to {
          background-position: 0 -7140px;
        }
      }
      @-moz-keyframes sign-anim {
        to {
          background-position: 0 -7140px;
        }
      }
      @keyframes sign-anim {
        to {
          background-position: 0 -7140px;
        }
      }
    `}nextslide(ev){let masterId=ev.detail.masterid;if(masterId===this.masterId){let slide=ev.detail.slide;this.shadowRoot.querySelector("label[for=\"slides_"+slide+"\"]").click()}}_gotonav(ev){let slideChecked=ev.target.getAttribute("for").split("_")[1];if(this.master){let event=new CustomEvent("multicarouselnextslide",{detail:{masterid:this.id,slide:slideChecked}});document.dispatchEvent(event)}}_getNav(){let arrowClass=""!==this.masterId?"noshow":"",arrows=html$2`<div class="arrows">
      ${this.opArr.map(val=>html$2`<label class="${arrowClass}" for="slides_${val}" @click="${this._gotonav}"></label>`)}
      <label class="goto-first ${arrowClass}" for="slides_1" @click="${this._gotonav}"></label>
      <label class="goto-last ${arrowClass}" for="slides_${this.numslides-1}" @click="${this._gotonav}"></label>
    </div>`;return arrows}_getArrows(){let nav=html$2`<div class="navigation">
      <div>
        ${this.opArr.map(val=>html$2`<label for="slides_${val}" @click="${this._gotonav}"></label>`)}
      </div>
    </div>`;return""!==this.masterId?"":nav}render(){return html$2`
      <style>
        ${this.cssliderInputStyles}
        ${this.cssliderInputCheckedStyles}
        ${this.cssliderInfinityStyles}
        ${this.cssliderStyles}
      </style>
      <div class="csslider infinity" id="theslider">
        ${this.opArr.map(val=>{let res;if(1!==val){res=html$2`<input type="radio" name="slides" id="slides_${val}" />`}else{res=html$2`<input type="radio" name="slides" id="slides_${val}" checked />`}return res})}
        <ul>
          ${this.opArr.map(val=>html$2`<li>${this.arrayContent[val-1]}</li>`)}
        </ul>

        ${this.noArrows?"":this._getArrows()}
        ${this.noNavigation?"":this._getNav()}
      </div>
    `}}window.customElements.define(MultiCarousel.is,MultiCarousel);class NatePaasOverview extends connect(store)(PageViewElement){static get properties(){return{_images:{type:Array},_texts:{type:Array},_lang:{type:String},_key:{type:String},_isRegLoading:{type:Boolean},_isAttending:{type:Boolean}}}static get styles(){return[SharedStyles]}render(){const img=this._images?this._images:{},txt=this._texts?this._texts[this._lang+"_2.json"]:null,legalPath="/legal"+(this._key?"?k="+this._key:""),isAttending=this._isAttending;if(txt&&img){return html$2`
        <section>
        ${img["grs.png"]?html$2`
          <div class="bg-img bg-img-left">
            <img
              width="150px"
              src="data:image/jpeg;base64, ${img["grs.png"]}"/>
          </div>`:html$2``}
          ${img["flp.png"]?html$2`
            <div class="bg-img bg-img-right">
              <img
                width="100px"
                src="data:image/jpeg;base64, ${img["flp.png"]}"/>
            </div>`:html$2``}
          ${img["natepaas.JPG"]?html$2`
            <div class="centered img">
              <img
                width="300px"
                src="data:image/jpeg;base64, ${img["natepaas.JPG"]}"/>
            </div>`:html$2``}
          ${txt.ovw?html$2`
            <h2>
              ${txt.ovw.title}
            </h2>
            <hr></hr>
            ${txt.ovw.content.map(c=>html$2`
              <p>
                ${c}
              </p>
              `)}
            `:html$2``}
        </section>

        ${txt.std?html$2`
          <section>
            <h2>
              ${txt.std.title}
            </h2>
            <div class="separator">
              <div class="icons icons-even">
                <div class="mauve">&#9733;</div>
                <div class="navy">&#9733;</div>
                <div class="plum">&#9733;</div>
                <div class="rosegold">&#9733;</div>
              </div>
            </div>
            ${txt.std.content.map(c=>html$2`
              <p class="date">
                ${c}
              </p>
              `)}
          </section>`:html$2``}

        ${txt.plc?html$2`
          <section>
            <h2>
              ${txt.plc.title}
            </h2>
            <hr></hr>
            <div>
              <div class="mp mp-if">
                <iframe
                  src="${txt.tt.src}"
                  width="250"
                  height="250"
                  frameborder="0" style="border:0; border-radius: 25px;"
                  allowfullscreen="">
                </iframe>
              </div>
              <div class="mp mp-txt">
                <h4>${txt.plc["title-side"]}</h4>
                ${txt.plc["content-side"].map(c=>html$2`
                  <p>
                    ${c}
                  </p>
                  `)}
                <a href="${txt.plc.lnk}">${txt.plc["lnk-txt"]}</a>
              </div>
            </div>
            ${txt.plc.content.map(c=>html$2`
              <p>
                ${c}
              </p>
              `)}
          </section>`:html$2``}

        ${txt.tt?html$2`
          <section>
            <h2>
              ${txt.tt.title}
            </h2>
            <hr></hr>

            <p>
            </p>
            <ul class="tt">
              ${txt.tt.contents.map(item=>html$2`
                <li class="tt">
                  <div class="tt-icon-wrapper">
                    <div class="tt-icon">
                      ${starIcon}
                    </div>
                  </div>
                  <div class="tt-content">
                    <h4>
                      ${item.title}
                    </h4>
                    <div>
                      ${item.content}
                    </div>
                  </div>
                </li>
                `)}
            </ul>
          </section>`:html$2``}

        ${txt.impr?html$2`
          <section>
            <h2>
              ${txt.impr.title}
            </h2>
            <hr></hr>
            <div>
              <multi-carousel>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s1.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s2.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s3.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s4.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s5.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s6.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s7.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s8.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s9.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s10.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s11.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s12.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s13.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s14.JPG"]}"/>
                <img
                  width="375px"
                  src="data:image/jpeg;base64, ${img["s15.JPG"]}"/>
              </multi-carousel>
            </div>
          </section>`:html$2``}

        ${txt.prst?html$2`
          <section>
            <h2>
              ${txt.prst.title}
            </h2>
            <hr></hr>
            <p>
              ${txt.prst.content}
            </p>
          </section>`:html$2``}

        ${txt.fdb?html$2`
          <section>
            <h2>
              ${txt.fdb.title}
            </h2>
            <hr></hr>
            <p>
              ${txt.fdb["content-1"]}
            </p>
            <p>
              ${txt.fdb.fields.slice(0,2).map(i=>html$2`<paper-input
                            name="${i.name}"
                            label="${i.label}"
                            type="${i.type}"
                            .required="${i.required}">
                          </paper-input>`)}
            </p>
            <p>
              ${txt.fdb.cbs.slice(0,1).map(i=>html$2`
                <paper-checkbox
                  name="${i.name}"
                  .checked="${isAttending}"
                  @click="${this._checkboxChanged}">
                  ${i.label}
                </paper-checkbox>`)}
            </p>
            ${isAttending?html$2`
              <p>
                ${txt.fdb.fields.slice(2,3).map(i=>html$2`<paper-input
                              name="${i.name}"
                              label="${i.label}"
                              type="${i.type}"
                              .required="${i.required}">
                            </paper-input>`)}
              </p>
              <p>
                ${txt.fdb.cbs.slice(1,2).map(i=>html$2`
                  <paper-checkbox name="${i.name}">
                    ${i.label}
                  </paper-checkbox>`)}
              </p>
              <p>
                ${txt.fdb.fields.slice(3).map(i=>html$2`<paper-input
                              name="${i.name}"
                              label="${i.label}"
                              type="${i.type}"
                              .required="${i.required}">
                            </paper-input>`)}
              </p>`:html$2``}
            <p>
              <paper-checkbox id="legal">
                ${txt.fdb["content-2"]}
                <a href="${legalPath}">
                  ${txt.fdb["content-3"]}
                </a>
              </paper-checkbox>
            </p>
            <br></br>
            <p>
              <paper-button
                @click="${this._btnClicked}"
                class="register-btn"
                ?disabled="${this._isRegLoading}">
                ${this._isRegLoading?html$2`
                    <paper-spinner-lite class="white" active>
                    </paper-spinner-lite>`:html$2`
                    ${txt.fdb.btn}`}
              </paper-button>
            </p>
          </section>`:html$2``}
      `}else{return html$2`
        <section>
          <p class="centered">
            <paper-spinner active></paper-spinner>
          </p>
        </section>`}}stateChanged(state){this._key=state.app.key;this._lang=state.app.lang;this._images=state.assets.images;this._texts=state.assets.texts;this._isRegLoading=state.app.isRegLoading;this._isAttending=state.app.isAttending}_checkboxChanged(e){const checked=e.target.checked;store.dispatch(updateAttendance(checked))}_btnClicked(e){let valid=!0;const cb=this.shadowRoot.querySelector("paper-checkbox#legal");if(cb.checked){cb.removeAttribute("invalid")}else{valid=!1;cb.setAttribute("invalid",!0)}const inputs=this.shadowRoot.querySelectorAll("paper-input");let data={};inputs.forEach(item=>{const val=item.value;data[item.name]=val?val:"";if(item.required&&!val){valid=!1;item.setAttribute("invalid",!0)}else{item.removeAttribute("invalid")}});const checkboxes=this.shadowRoot.querySelectorAll("paper-checkbox");checkboxes.forEach(item=>{if(item!=cb){data[item.name]=item.checked}});if(valid){const msg=this._texts[this._lang+".json"].fdb.msg;store.dispatch(register(data,msg,()=>{inputs.forEach(item=>{item.value=null})}))}}}window.customElements.define("natepaas-overview",NatePaasOverview);export{ironA11yAnnouncer as $ironA11yAnnouncer,ironButtonState as $ironButtonState,ironCheckedElementBehavior as $ironCheckedElementBehavior,ironControlState as $ironControlState,ironFormElementBehavior as $ironFormElementBehavior,ironMenuBehavior as $ironMenuBehavior,ironMeta as $ironMeta,ironMultiSelectable as $ironMultiSelectable,ironSelectable as $ironSelectable,ironSelection as $ironSelection,ironValidatableBehavior as $ironValidatableBehavior,neonAnimationBehavior as $neonAnimationBehavior,paperButtonBehavior as $paperButtonBehavior,paperCheckedElementBehavior as $paperCheckedElementBehavior,paperInkyFocusBehavior as $paperInkyFocusBehavior,paperInputAddonBehavior as $paperInputAddonBehavior,paperInputBehavior as $paperInputBehavior,paperItemBehavior as $paperItemBehavior,paperMenuButton as $paperMenuButton,paperRippleBehavior as $paperRippleBehavior,register$1 as $register,ADD_GUEST,IronA11yAnnouncer,IronButtonState,IronButtonStateImpl,IronCheckedElementBehavior,IronCheckedElementBehaviorImpl,IronControlState,IronFormElementBehavior,IronMenuBehavior,IronMenuBehaviorImpl,IronMeta,IronMultiSelectableBehavior,IronMultiSelectableBehaviorImpl,IronSelectableBehavior,IronSelection,IronValidatableBehavior,IronValidatableBehaviorMeta,NeonAnimationBehavior,PaperButtonBehavior,PaperButtonBehaviorImpl,PaperCheckedElementBehavior,PaperCheckedElementBehaviorImpl,PaperInkyFocusBehavior,PaperInkyFocusBehaviorImpl,PaperInputAddonBehavior,PaperInputBehavior,PaperInputBehaviorImpl,PaperInputHelper,PaperItemBehavior,PaperItemBehaviorImpl,PaperMenuButton,PaperRippleBehavior,register};