# brick-action-menu

> An action menu element for [Brick](https://github.com/mozilla/brick/)

## Demo

[Check it live!](http://lmorchard.github.io/brick-action-menu)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="src/element.html">
    ```

3. Start using it:

    ```html
    <brick-action-menu id="menu-ex1">
      <menu>
        <button>Action 1</button>
        <button>Action 2</button>
        <button>Action 3</button>
      </menu>
    </brick-action-menu>
    ```

    ```javascript
    var menu = document.getElementById('menu-ex1');

    // Optional event handler
    menu.addEventListener('pick', function (ev) {
      var button = ev.target;
      // Handle clicked menu item button here.
    });

    // Optional callback on show()
    menu.show(function (button) {
      // Handle clicked menu item button here.
    });
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`visible`     | *boolean*   | `false`      | Whether or not the menu is visible and active.

## Methods

Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`show([cb])`  | Optional callback, receives the menu item clicked | Nothing. | Reveals and activates the menu.
`hide()`      | None.        | Nothing.    | Hide and deactivate the menu. 

## Events

Event         | Description
---           | ---
`onpick`      | Triggered when an item is chosen from the menu.

## Development

This repository comes outfitted with a set of tools to ease the development process.

To get started:

* Install [Bower](http://bower.io/) & [Gulp](http://gulpjs.com/):

    ```sh
    $ npm install -g bower gulp
    ```

* Install local dependencies:

    ```sh
    $ npm install && bower install
    ```

While developing your component, there is a development server that will watch your files for changes and automatically re-build your styles and re-lint your code.

To run the development server:

* Run `gulp server`
* Navigate to `http:localhost:3001`

To simply build and lint your code, run `gulp build`.

You can also push your code to GitHub Pages by running `gulp deploy`.

## License

[MIT License](http://opensource.org/licenses/MIT)
