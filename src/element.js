(function () {

  var BrickActionMenuElementPrototype = Object.create(HTMLElement.prototype);

  var currScript = document._currentScript || document.currentScript;
  var tmpl = currScript.ownerDocument.getElementById('action-menu-template');

  // Attribute handlers
 
  var attrs = {
  };

  // Custom methods

  /*
  BrickActionMenuElementPrototype.foo = function () {
  };
  */

  // Initial setup of the custom element

  function setup (element) {
    element.ns = {};

    // Grab root element from template, clone & remember it
    var frag = document.importNode(tmpl.content, true);
    element.root = frag.querySelector('form');

    // Move all the custom element children into the cloned root
    while (element.firstChild) {
      element.root.appendChild(element.firstChild);
    }

    // Inject the cloned root into the document.
    element.appendChild(element.root);
  }

  // Post-setup update for custom element

  function update (element) {
    console.log("UPDATE " + element);
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
    // TODO: Do I really need to do this? Memory leak superstition.
    this.root = this.ns = null;
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
