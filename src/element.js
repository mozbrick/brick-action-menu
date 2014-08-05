(function () {

  var currentScript = document._currentScript || document.currentScript;

  var BrickActionMenuElementPrototype = Object.create(HTMLElement.prototype);

  // Element attribute handlers
  var attrs = {

    "visible": function (oldVal, newVal) {
      // Be very particular about what values of "visible" mean not visible.
      newVal = ('undefined' !== typeof newVal) &&
               (null !== newVal) &&
               (false !== newVal);

      if (oldVal === newVal) {
        return;
      } else if (newVal === true) {
        this.show(null, true);
      } else if (newVal === false) {
        this.hide(true);
      }
    }

  };

  // Custom methods
  
  BrickActionMenuElementPrototype.show = function (callback, immediate) {
    if (this.ns.visible) { return; }
    
    this.ns.visible = true;
    this.ns.callback = callback;
    
    var form = shadowRoot.querySelector('form');
    form.classList.remove('fade-out');
    form.classList.remove('hide');
    form.classList.add(immediate ? 'show' : 'fade-in');
  };

  BrickActionMenuElementPrototype.hide = function (immediate) {
    if (!this.ns.visible) { return; }
    
    this.ns.visible = false;
    this.ns.callback = null;

    var form = shadowRoot.querySelector('form');
    form.classList.remove('fade-in');
    form.classList.remove('show');
    form.classList.add(immediate ? 'hide' : 'fade-out');
  };

  var EV_PICK = 'pick';
  var RE_BUTTON = /^button$/i;

  // Lifecycle methods

  BrickActionMenuElementPrototype.createdCallback = function () {

    var importDoc = currentScript.ownerDocument;
    var template = importDoc.getElementById('brick-action-menu-template');

    this.ns = {
      visible: false
    };

    // create shadowRoot and append template to it.
    var shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(template.content.cloneNode(true));

    // HACK: Annotate the menu for styling if there's a cancel button
    if (this.querySelector('button.cancel')) {
      shadowRoot.querySelector('form')
        .setAttribute('data-with-cancel', 'true');
    }

    // Squelch the form submission process
    this.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // Event delegation for all buttons in the menu
    this.addEventListener('click', function (e) {
      if (!RE_BUTTON.test(e.target.tagName)) { return; }

      // Do we have a callback supplied from show()?
      if (this.ns.callback) {
        // HACK: Defer the callback, yielding for animations & etc.
        (function (cb) {
          setTimeout(function () { cb(e.target); }, 0.1);
        })(this.ns.callback);
        
        // Clear the callback (which is why we just used a closure to defer)
        this.ns.callback = null;
      }

      // Dispatch a custom event for the menu item pick
      e.target.dispatchEvent(new CustomEvent(EV_PICK, {
        bubbles: true
      }));

      // Finish up by hiding the menu.
      return this.hide();
    });
  };

  BrickActionMenuElementPrototype.attachedCallback = function () {
    for (var k in attrs) {
      if (this.hasAttribute(k)) {
        attrs[k].call(this, undefined, this.getAttribute(k));
      }
    }
  };

  BrickActionMenuElementPrototype.attributeChangedCallback = function (attr, oldVal, newVal) {
    if (attr in attrs) {
      attrs[attr].call(this, oldVal, newVal);
    }
  };

  BrickActionMenuElementPrototype.detachedCallback = function () {
  };

  // Property handlers, magically boilerplated from attribute handlers.
  var props = {};
  function makeProp (name) {
    return {
      get: function () {
        return this.ns[name];
      },
      set: function (newVal) {
        return this.attributeChangedCallback(name, this.ns[name], newVal);
      }
    };
  }
  for (var name in attrs) {
    props[name] = makeProp(name);
  }
  Object.defineProperties(BrickActionMenuElementPrototype, props);

  // Register the element
  window.BrickActionMenuElement = document.registerElement('brick-action-menu', {
    prototype: BrickActionMenuElementPrototype
  });

})();
