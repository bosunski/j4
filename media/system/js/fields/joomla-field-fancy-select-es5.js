"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

/**
 * Fancy select field, which use Choices.js
 *
 * Example:
 * <joomla-field-fancy-select ...attributes>
 *   <select>...</select>
 * </joomla-field-fancy-select>
 *
 * Possible attributes:
 *
 * allow-custom          Whether allow User to dynamically add a new value.
 * new-item-prefix=""    Prefix for a dynamically added value.
 *
 * remote-search         Enable remote search.
 * url=""                Url for remote search.
 * term-key="term"       Variable key name for searched term, will be appended to Url.
 *
 * min-term-length="1"   The minimum length a search value should be before choices are searched.
 * placeholder=""        The value of the inputs placeholder.
 * search-placeholder="" The value of the search inputs placeholder.
 */
window.customElements.define('joomla-field-fancy-select',
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  _createClass(_class, [{
    key: "allowCustom",
    // Attributes to monitor
    get: function get() {
      return this.hasAttribute('allow-custom');
    }
  }, {
    key: "remoteSearch",
    get: function get() {
      return this.hasAttribute('remote-search');
    }
  }, {
    key: "url",
    get: function get() {
      return this.getAttribute('url');
    }
  }, {
    key: "termKey",
    get: function get() {
      return this.getAttribute('term-key') || 'term';
    }
  }, {
    key: "minTermLength",
    get: function get() {
      return parseInt(this.getAttribute('min-term-length')) || 1;
    }
  }, {
    key: "newItemPrefix",
    get: function get() {
      return this.getAttribute('new-item-prefix') || '';
    }
  }, {
    key: "placeholder",
    get: function get() {
      return this.getAttribute('placeholder');
    }
  }, {
    key: "searchPlaceholder",
    get: function get() {
      return this.getAttribute('search-placeholder');
    }
  }, {
    key: "value",
    get: function get() {
      return this.choicesInstance.getValue(true);
    },
    set: function set($val) {
      this.choicesInstance.setValueByChoice($val);
    }
    /**
     * Lifecycle
     */

  }]);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this)); // Keycodes

    _this.keyCode = {
      ENTER: 13
    };

    if (!Joomla) {
      throw new Error('Joomla API is not properly initiated');
    }

    if (!window.Choices) {
      throw new Error('JoomlaFieldFancySelect requires Choices.js to work');
    }

    _this.choicesCache = {};
    _this.activeXHR = null;
    _this.choicesInstance = null;
    return _this;
  }
  /**
   * Lifecycle
   */


  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      // Get a <select> element
      this.select = this.querySelector('select');

      if (!this.select) {
        throw new Error('JoomlaFieldFancySelect requires <select> element to work');
      } // Init Choices


      this.choicesInstance = new Choices(this.select, {
        placeholderValue: this.placeholder,
        searchPlaceholderValue: this.searchPlaceholder,
        removeItemButton: true,
        searchFloor: this.minTermLength,
        searchResultLimit: 10,
        shouldSort: false,
        fuseOptions: {
          threshold: 0.3 // Strict search

        },
        noResultsText: Joomla.Text._('JGLOBAL_SELECT_NO_RESULTS_MATCH', 'No results found'),
        noChoicesText: Joomla.Text._('JGLOBAL_SELECT_NO_RESULTS_MATCH', 'No results found'),
        itemSelectText: Joomla.Text._('JGLOBAL_SELECT_PRESS_TO_SELECT', 'Press to select'),
        // Redefine some classes
        classNames: {
          button: 'choices__button_joomla' // It is need because an original styling use unavailable Icon.svg file

        }
      }); // Handle typing of custom term

      if (this.allowCustom) {
        this.addEventListener('keydown', function (event) {
          if (event.keyCode !== _this2.keyCode.ENTER || event.target !== _this2.choicesInstance.input) {
            return;
          }

          event.preventDefault();

          if (_this2.choicesInstance.highlightPosition || !event.target.value || _this2.choicesCache[event.target.value]) {
            return;
          } // Make sure nothing is highlighted


          var highlighted = _this2.choicesInstance.dropdown.querySelector(".".concat(_this2.choicesInstance.config.classNames.highlightedState));

          if (highlighted) {
            return;
          }

          ;

          _this2.choicesInstance.setChoices([{
            value: _this2.newItemPrefix + event.target.value,
            label: event.target.value,
            selected: true,
            customProperties: {
              value: event.target.value // Store real value, just in case

            }
          }], 'value', 'label', false);

          _this2.choicesCache[event.target.value] = event.target.value;
          event.target.value = null;

          _this2.choicesInstance.hideDropdown();

          return false;
        });
      } // Handle remote search


      if (this.remoteSearch && this.url) {
        // Cache existing
        this.choicesInstance.presetChoices.forEach(function (choiceItem) {
          _this2.choicesCache[choiceItem.value] = choiceItem.label;
        });
        var lookupDelay = 300;
        var lookupTimeout = null;
        this.select.addEventListener('search', function (event) {
          clearTimeout(lookupTimeout);
          lookupTimeout = setTimeout(_this2.requestLookup.bind(_this2), lookupDelay);
        });
      }
    }
    /**
     * Lifecycle
     */

  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      // Destroy Choices instance, to unbind event listeners
      if (this.choicesInstance) {
        this.choicesInstance.destroy();
        this.choicesInstance = null;
      }

      if (this.activeXHR) {
        this.activeXHR.abort();
        this.activeXHR = null;
      }
    }
  }, {
    key: "requestLookup",
    value: function requestLookup() {
      var _this3 = this;

      var url = this.url;
      url += url.indexOf('?') === -1 ? '?' : '&';
      url += "".concat(encodeURIComponent(this.termKey), "=").concat(encodeURIComponent(this.choicesInstance.input.value)); // Stop previous request if any

      if (this.activeXHR) {
        this.activeXHR.abort();
      }

      this.activeXHR = Joomla.request({
        url: url,
        onSuccess: function onSuccess(response) {
          _this3.activeXHR = null;
          var items = response ? JSON.parse(response) : [];

          if (!items.length) {
            return;
          } // Remove duplications


          items.forEach(function (item, index) {
            if (_this3.choicesCache[item.value]) {
              items.splice(index, 1);
            }
          }); // Add new options to field, assume that each item is object, eg {value: "foo", text: "bar"}

          if (items.length) {
            _this3.choicesInstance.setChoices(items, 'value', 'text', false);
          }
        },
        onError: function onError() {
          _this3.activeXHR = null;
        }
      });
    }
  }]);

  return _class;
}(_wrapNativeSuper(HTMLElement)));