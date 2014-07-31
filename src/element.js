(function () {

  var BrickActionMenuElementPrototype = Object.create(HTMLElement.prototype);

  var currScript = document._currentScript || document.currentScript;
  var tmpl = currScript.ownerDocument.getElementById('action-menu-template');

  // Attribute handlers
 
  var attrs = {
  };

  // Custom methods
  
  BrickActionMenuElementPrototype.show = function (callback, immediate) {
    if (this.ns.shown) { return; }
    this.ns.shown = true;
    this.ns.callback = callback;
    this.root.classList.remove('fade-out');
    this.root.classList.remove('hide');
    this.root.classList.add(immediate ? 'show' : 'fade-in');
  };

  BrickActionMenuElementPrototype.hide = function (immediate) {
    if (!this.ns.shown) { return; }
    this.ns.shown = false;
    this.ns.callback = null;
    this.root.classList.remove('fade-in');
    this.root.classList.remove('show');
    this.root.classList.add(immediate ? 'hide' : 'fade-out');
  };

  var EV_PICK = 'pick';
  var RE_BUTTON = /^button$/i;

  // Initial setup of the custom element

  function setup (_this) {
    _this.ns = {
      shown: false
    };

    // Grab root _this from template, clone & remember it
    var frag = document.importNode(tmpl.content, true);
    _this.root = frag.querySelector('form');

    // Move all the custom _this children into the cloned root
    while (_this.firstChild) {
      _this.root.appendChild(_this.firstChild);
    }

    // Event delegation for all buttons in the menu
    _this.root.addEventListener('click', function (e) {
      if (!RE_BUTTON.test(e.target.tagName)) { return; }

      // Do we have a callback supplied from show()?
      if (_this.ns.callback) {
        // HACK: Preserve the callback we're about to discard on hide(), but
        // defer the callback for just a little bit.
        (function (cb) {
          setTimeout(function () { cb(e.target); }, 0.1);
        })(_this.ns.callback);
      }

      // Dispatch a custom event for the menu item pick
      e.target.dispatchEvent(new CustomEvent(EV_PICK, {
        bubbles: true
      }));

      // Finish up by hiding the menu.
      return _this.hide();
    });

    // Squelch the form submission process
    _this.root.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // HACK: Annotate the menu for styling if there's a cancel button
    var elCancel = _this.root.querySelector('button.cancel');
    if (elCancel) {
      _this.root.setAttribute('data-with-cancel', 'true');
    }

    // Inject the cloned root into the document.
    _this.appendChild(_this.root);
  }

  // Post-setup update for custom element

  function update (_this) {
    return _this;
  }

  function cleanup (_this) {
    // TODO: Do I really need to do this? Memory leak superstition.
    _this.root = _this.ns = null;
  }

  // Lifecycle methods

  BrickActionMenuElementPrototype.createdCallback = function () {
    setup(this);
  };

  BrickActionMenuElementPrototype.attachedCallback = function () {
    // Update all the attribs on attach before updating.
    for (var k in attrs) {
      attrs[k].call(this, null, this.getAttribute(k));
    }
    update(this);
  };

  BrickActionMenuElementPrototype.attributeChangedCallback = function (attr, oldVal, newVal) {
    // Update a single attrib on change before updating.
    if (attr in attrs) {
      attrs[attr].call(this, oldVal, newVal);
    }
    update(this);
  };

  BrickActionMenuElementPrototype.detachedCallback = function () {
    cleanup(this);
  };

  // Property handlers, magically boilerplated

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
