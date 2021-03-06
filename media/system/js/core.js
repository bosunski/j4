/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
// eslint-disable max-len

/**
 * Patch Custom Events
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
(function () {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }

  var CustomEvent = function CustomEvent(event, params) {
    var evt = document.createEvent('CustomEvent');
    var newParams = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    evt.initCustomEvent(event, newParams.bubbles, newParams.cancelable, newParams.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
  return true;
})(); // Only define the Joomla namespace if not defined.


window.Joomla = window.Joomla || {}; // Only define editors if not defined

window.Joomla.editors = window.Joomla.editors || {}; // An object to hold each editor instance on page, only define if not defined.

window.Joomla.editors.instances = window.Joomla.editors.instances || {
  /**
   * *****************************************************************
   * All Editors MUST register, per instance, the following callbacks:
   * *****************************************************************
   *
   * getValue         Type  Function  Should return the complete data from the editor
   *                                  Example: () => { return this.element.value; }
   * setValue         Type  Function  Should replace the complete data of the editor
   *                                  Example: (text) => { return this.element.value = text; }
   * replaceSelection Type  Function  Should replace the selected text of the editor
   *                                  If nothing selected, will insert the data at the cursor
   *                                  Example:
   *                                  (text) => {
   *                                    return insertAtCursor(this.element, text);
   *                                    }
   *
   * USAGE (assuming that jform_articletext is the textarea id)
   * {
   * To get the current editor value:
   *  Joomla.editors.instances['jform_articletext'].getValue();
   * To set the current editor value:
   *  Joomla.editors.instances['jform_articletext'].setValue('Joomla! rocks');
   * To replace(selection) or insert a value at  the current editor cursor:
   *  replaceSelection:
   *  Joomla.editors.instances['jform_articletext'].replaceSelection('Joomla! rocks')
   * }
   *
   * *********************************************************
   * ANY INTERACTION WITH THE EDITORS SHOULD USE THE ABOVE API
   * *********************************************************
   *
   * jInsertEditorText() @deprecated 4.0
   */
};
window.Joomla.Modal = window.Joomla.Modal || {
  /**
   * *****************************************************************
   * Modals should implement
   * *****************************************************************
   *
   * getCurrent  Type  Function  Should return the modal element
   * setCurrent  Type  Function  Should set the modal element
   * current     Type  {node}    The modal element
   *
   * USAGE (assuming that exampleId is the modal id)
   * To get the current modal element:
   *   Joomla.Modal.current; // Returns node element, eg: document.getElementById('exampleId')
   * To set the current modal element:
   *   Joomla.Modal.setCurrent(document.getElementById('exampleId'));
   *
   * *************************************************************
   * Joomla's UI modal uses `element.close();` to close the modal
   * and `element.open();` to open the modal
   * If you are using another modal make sure the same
   * functionality is bound to the modal element
   * @see media/legacy/bootstrap.init.js
   * *************************************************************
   */
  current: '',
  setCurrent: function setCurrent(element) {
    window.Joomla.current = element;
  },
  getCurrent: function getCurrent() {
    return window.Joomla.current;
  }
};

(function (Joomla, document) {
  'use strict';
  /**
   * Generic submit form
   *
   * @param  {String}  task      The given task
   * @param  {node}    form      The form element
   * @param  {bool}    validate  The form element
   *
   * @returns  {void}
   */

  Joomla.submitform = function (task, form, validate) {
    var newForm = form;
    var newTask = task;

    if (!newForm) {
      newForm = document.getElementById('adminForm');
    }

    if (newTask) {
      newForm.task.value = newTask;
    } // Toggle HTML5 validation


    newForm.noValidate = !validate;

    if (!validate) {
      newForm.setAttribute('novalidate', '');
    } else if (newForm.hasAttribute('novalidate')) {
      newForm.removeAttribute('novalidate');
    } // Submit the form.
    // Create the input type="submit"


    var button = document.createElement('input');
    button.style.display = 'none';
    button.type = 'submit'; // Append it and click it

    newForm.appendChild(button).click(); // If "submit" was prevented, make sure we don't get a build up of buttons

    newForm.removeChild(button);
  };
  /**
   * Default function. Can be overridden by the component to add custom logic
   *
   * @param  {String}  task            The given task
   * @param  {String}  formSelector    The form selector eg '#adminForm'
   * @param  {bool}    validate        The form element
   *
   * @returns {void}
   */


  Joomla.submitbutton = function (task, formSelector, validate) {
    var form = document.querySelector(formSelector || 'form.form-validate');
    var newValidate = validate;

    if (typeof formSelector === 'string' && form === null) {
      form = document.querySelector("#".concat(formSelector));
    }

    if (form) {
      if (newValidate === undefined || newValidate === null) {
        var pressbutton = task.split('.');
        var cancelTask = form.getAttribute('data-cancel-task');

        if (!cancelTask) {
          cancelTask = "".concat(pressbutton[0], ".cancel");
        }

        newValidate = task !== cancelTask;
      }

      if (!newValidate || document.formvalidator.isValid(form)) {
        Joomla.submitform(task, form);
      }
    } else {
      Joomla.submitform(task);
    }
  };
  /**
   * Custom behavior for JavaScript I18N in Joomla! 1.6
   *
   * @type {{}}
   *
   * Allows you to call Joomla.Text._() to get a translated JavaScript string
   * pushed in with Text::script() in Joomla.
   */


  Joomla.Text = {
    strings: {},

    /**
     * Translates a string into the current language.
     *
     * @param {String} key   The string to translate
     * @param {String} def   Default string
     *
     * @returns {String}
     */
    _: function _(key, def) {
      var newKey = key;
      var newDef = def; // Check for new strings in the optionsStorage, and load them

      var newStrings = Joomla.getOptions('joomla.jtext');

      if (newStrings) {
        Joomla.Text.load(newStrings); // Clean up the optionsStorage from useless data

        Joomla.loadOptions({
          'joomla.jtext': null
        });
      }

      newDef = newDef === undefined ? '' : newDef;
      newKey = newKey.toUpperCase();
      return Joomla.Text.strings[newKey] !== undefined ? Joomla.Text.strings[newKey] : newDef;
    },

    /**
     * Load new strings in to Joomla.Text
     *
     * @param {Object} object  Object with new strings
     * @returns {Joomla.Text}
     */
    load: function load(object) {
      [].slice.call(Object.keys(object)).forEach(function (key) {
        Joomla.Text.strings[key.toUpperCase()] = object[key];
      });
      return Joomla.Text;
    }
  };
  /**
   * For B/C we still support Joomla.JText
   *
   * @type {{}}
   *
   * @deprecated 5.0
   */

  Joomla.JText = Joomla.Text;
  /**
   * Joomla options storage
   *
   * @type {{}}
   *
   * @since 3.7.0
   */

  Joomla.optionsStorage = Joomla.optionsStorage || null;
  /**
   * Get script(s) options
   *
   * @param  {String}  key  Name in Storage
   * @param  {mixed}   def  Default value if nothing found
   *
   * @return {mixed}
   *
   * @since 3.7.0
   */

  Joomla.getOptions = function (key, def) {
    // Load options if they not exists
    if (!Joomla.optionsStorage) {
      Joomla.loadOptions();
    }

    return Joomla.optionsStorage[key] !== undefined ? Joomla.optionsStorage[key] : def;
  };
  /**
   * Load new options from given options object or from Element
   *
   * @param  {Object|undefined}  options  The options object to load.
   * Eg {"com_foobar" : {"option1": 1, "option2": 2}}
   *
   * @since 3.7.0
   */


  Joomla.loadOptions = function (options) {
    // Load form the script container
    if (!options) {
      var elements = [].slice.call(document.querySelectorAll('.joomla-script-options.new'));
      var counter = 0;
      elements.forEach(function (element) {
        var str = element.text || element.textContent;
        var option = JSON.parse(str);

        if (option) {
          Joomla.loadOptions(option);
          counter += 1;
        }

        element.className = element.className.replace(' new', ' loaded');
      });

      if (counter) {
        return;
      }
    } // Initial loading


    if (!Joomla.optionsStorage) {
      Joomla.optionsStorage = options || {};
    } else if (options) {
      // Merge with existing
      [].slice.call(Object.keys(options)).forEach(function (key) {
        /**
         * If both existing and new options are objects, merge them with Joomla.extend().
         * But test for new option being null, as null is an object, but we want to allow
         * clearing of options with ...
         *
         * Joomla.loadOptions({'joomla.jtext': null});
         */
        if (options[key] !== null && _typeof(Joomla.optionsStorage[key]) === 'object' && _typeof(options[key]) === 'object') {
          Joomla.optionsStorage[key] = Joomla.extend(Joomla.optionsStorage[key], options[key]);
        } else {
          Joomla.optionsStorage[key] = options[key];
        }
      });
    }
  };
  /**
   * Method to replace all request tokens on the page with a new one.
   *
   * @param {String}  newToken  The token
   *
   * Used in Joomla Installation
   */


  Joomla.replaceTokens = function (newToken) {
    if (!/^[0-9A-F]{32}$/i.test(newToken)) {
      return;
    }

    var elements = [].slice.call(document.getElementsByTagName('input'));
    elements.forEach(function (element) {
      if (element.type === 'hidden' && element.value === '1' && element.name.length === 32) {
        element.name = newToken;
      }
    });
  };
  /**
   * USED IN: all list forms.
   *
   * Toggles the check state of a group of boxes
   *
   * Checkboxes must have an id attribute in the form cb0, cb1...
   *
   * @param {mixed}  checkbox The number of box to 'check', for a checkbox element
   * @param {string} stub     An alternative field name
   *
   * @return {boolean}
   */


  Joomla.checkAll = function (checkbox, stub) {
    if (!checkbox.form) {
      return false;
    }

    var currentStab = stub || 'cb';
    var elements = [].slice.call(checkbox.form.elements);
    var state = 0;
    elements.forEach(function (element) {
      if (element.type === checkbox.type && element.id.indexOf(currentStab) === 0) {
        element.checked = checkbox.checked;
        state += element.checked ? 1 : 0;
      }
    });

    if (checkbox.form.boxchecked) {
      checkbox.form.boxchecked.value = state;
      Joomla.Event.dispatch(checkbox.form.boxchecked, 'change');
    }

    return true;
  };
  /**
   * Render messages send via JSON
   * Used by some javascripts such as validate.js
   *
   * @param   {object}  messages JavaScript object containing the messages to render.
   *          Example:
   *          const messages = {
   *              "message": ["This will be a green message", "So will this"],
   *              "error": ["This will be a red message", "So will this"],
   *              "info": ["This will be a blue message", "So will this"],
   *              "notice": ["This will be same as info message", "So will this"],
   *              "warning": ["This will be a orange message", "So will this"],
   *              "my_custom_type": ["This will be same as info message", "So will this"]
   *          };
   * @param  {string} selector The selector of the container where the message will be rendered
   * @param  {bool}   keepOld  If we shall discard old messages
   * @param  {int}    timeout  The milliseconds before the message self destruct
   * @return  void
   */


  Joomla.renderMessages = function (messages, selector, keepOld, timeout) {
    var messageContainer;
    var typeMessages;
    var messagesBox;
    var title;
    var titleWrapper;
    var messageWrapper;
    var alertClass;

    if (typeof selector === 'undefined' || selector && selector === '#system-message-container') {
      messageContainer = document.getElementById('system-message-container');
    } else {
      messageContainer = document.querySelector(selector);
    }

    if (typeof keepOld === 'undefined' || keepOld && keepOld === false) {
      Joomla.removeMessages(messageContainer);
    }

    [].slice.call(Object.keys(messages)).forEach(function (type) {
      // Array of messages of this type
      typeMessages = messages[type];

      if (_typeof(window.customElements) === 'object' && typeof window.customElements.get('joomla-alert') === 'function') {
        messagesBox = document.createElement('joomla-alert');

        if (['notice', 'message', 'error', 'warning'].indexOf(type) > -1) {
          alertClass = type === 'notice' ? 'info' : type;
          alertClass = type === 'message' ? 'success' : alertClass;
          alertClass = type === 'error' ? 'danger' : alertClass;
          alertClass = type === 'warning' ? 'warning' : alertClass;
        } else {
          alertClass = 'info';
        }

        messagesBox.setAttribute('type', alertClass);
        messagesBox.setAttribute('dismiss', 'true');

        if (timeout && parseInt(timeout, 10) > 0) {
          messagesBox.setAttribute('autodismiss', timeout);
        }
      } else {
        // Create the alert box
        messagesBox = document.createElement('div'); // Message class

        if (['notice', 'message', 'error', 'warning'].indexOf(type) > -1) {
          alertClass = type === 'notice' ? 'info' : type;
          alertClass = type === 'message' ? 'success' : alertClass;
          alertClass = type === 'error' ? 'danger' : alertClass;
          alertClass = type === 'warning' ? 'warning' : alertClass;
        } else {
          alertClass = 'info';
        }

        messagesBox.className = "alert alert-".concat(alertClass); // Close button

        var buttonWrapper = document.createElement('button');
        buttonWrapper.setAttribute('type', 'button');
        buttonWrapper.setAttribute('data-dismiss', 'alert');
        buttonWrapper.className = 'close';
        buttonWrapper.innerHTML = '×';
        messagesBox.appendChild(buttonWrapper);
      } // Title


      title = Joomla.Text._(type); // Skip titles with untranslated strings

      if (typeof title !== 'undefined') {
        titleWrapper = document.createElement('h4');
        titleWrapper.className = 'alert-heading';
        titleWrapper.innerHTML = Joomla.Text._(type) ? Joomla.Text._(type) : type;
        messagesBox.appendChild(titleWrapper);
      } // Add messages to the message box


      typeMessages.forEach(function (typeMessage) {
        messageWrapper = document.createElement('div');
        messageWrapper.innerHTML = typeMessage;
        messagesBox.appendChild(messageWrapper);
      });
      messageContainer.appendChild(messagesBox);

      if (_typeof(window.customElements) !== 'object' && typeof window.customElements.get('joomla-alert') !== 'function') {
        if (timeout && parseInt(timeout, 10) > 0) {
          setTimeout(function () {
            Joomla.removeMessages(messageContainer);
          }, timeout);
        }
      }
    });
  };
  /**
   * Remove messages
   *
   * @param  {element} container The element of the container of the message
   * to be removed
   *
   * @return  {void}
   */


  Joomla.removeMessages = function (container) {
    var messageContainer;

    if (container) {
      messageContainer = container;
    } else {
      messageContainer = document.getElementById('system-message-container');
    }

    if (_typeof(window.customElements) === 'object' && window.customElements.get('joomla-alert')) {
      var alerts = [].slice.call(messageContainer.querySelectorAll('joomla-alert'));

      if (alerts.length) {
        alerts.forEach(function (alert) {
          alert.close();
        });
      }
    } else {
      // Empty container with a while for Chrome performance issues
      while (messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
      } // Fix Chrome bug not updating element height


      messageContainer.style.display = 'none';
      delete messageContainer.offsetHeight;
      messageContainer.style.display = '';
    }
  };
  /**
   * Treat AJAX errors.
   * Used by some javascripts such as sendtestmail.js and permissions.js
   *
   * @param   {object}  xhr         XHR object.
   * @param   {string}  textStatus  Type of error that occurred.
   * @param   {string}  error       Textual portion of the HTTP status.
   *
   * @return  {object}  JavaScript object containing the system error message.
   *
   * @since  3.6.0
   */


  Joomla.ajaxErrorsMessages = function (xhr, textStatus) {
    var msg = {};

    if (textStatus === 'parsererror') {
      // For jQuery jqXHR
      var buf = []; // Html entity encode.

      var encodedJson = xhr.responseText.trim(); // eslint-disable-next-line no-plusplus

      for (var i = encodedJson.length - 1; i >= 0; i--) {
        buf.unshift(['&#', encodedJson[i].charCodeAt(), ';'].join(''));
      }

      encodedJson = buf.join('');
      msg.error = [Joomla.Text._('JLIB_JS_AJAX_ERROR_PARSE').replace('%s', encodedJson)];
    } else if (textStatus === 'nocontent') {
      msg.error = [Joomla.Text._('JLIB_JS_AJAX_ERROR_NO_CONTENT')];
    } else if (textStatus === 'timeout') {
      msg.error = [Joomla.Text._('JLIB_JS_AJAX_ERROR_TIMEOUT')];
    } else if (textStatus === 'abort') {
      msg.error = [Joomla.Text._('JLIB_JS_AJAX_ERROR_CONNECTION_ABORT')];
    } else if (xhr.responseJSON && xhr.responseJSON.message) {
      // For vanilla XHR
      msg.error = ["".concat(Joomla.Text._('JLIB_JS_AJAX_ERROR_OTHER').replace('%s', xhr.status), " <em>").concat(xhr.responseJSON.message, "</em>")];
    } else if (xhr.statusText) {
      msg.error = ["".concat(Joomla.Text._('JLIB_JS_AJAX_ERROR_OTHER').replace('%s', xhr.status), " <em>").concat(xhr.statusText, "</em>")];
    } else {
      msg.error = [Joomla.Text._('JLIB_JS_AJAX_ERROR_OTHER').replace('%s', xhr.status)];
    }

    return msg;
  };
  /**
   * USED IN: administrator/components/com_cache/views/cache/tmpl/default.php
   * administrator/components/com_installer/views/discover/tmpl/default_item.php
   * administrator/components/com_installer/views/update/tmpl/default_item.php
   * administrator/components/com_languages/helpers/html/languages.php
   * libraries/joomla/html/html/grid.php
   *
   * @param  {boolean}  isitchecked  Flag for checked
   * @param  {node}     form         The form
   *
   * @return  {void}
   */


  Joomla.isChecked = function (isitchecked, form) {
    var newForm = form;

    if (typeof newForm === 'undefined') {
      newForm = document.getElementById('adminForm');
    } else if (typeof form === 'string') {
      newForm = document.getElementById(form);
    }

    newForm.boxchecked.value = isitchecked ? parseInt(newForm.boxchecked.value, 10) + 1 : parseInt(newForm.boxchecked.value, 10) - 1;
    Joomla.Event.dispatch(newForm.boxchecked, 'change'); // If we don't have a checkall-toggle, done.

    if (!newForm.elements['checkall-toggle']) {
      return;
    } // Toggle main toggle checkbox depending on checkbox selection


    var c = true;
    var i;
    var e;
    var n; // eslint-disable-next-line no-plusplus

    for (i = 0, n = newForm.elements.length; i < n; i++) {
      e = newForm.elements[i];

      if (e.type === 'checkbox' && e.name !== 'checkall-toggle' && !e.checked) {
        c = false;
        break;
      }
    }

    newForm.elements['checkall-toggle'].checked = c;
  };
  /**
   * USED IN: libraries/joomla/html/html/grid.php
   * In other words, on any reorderable table
   *
   * @param  {string}  order  The order value
   * @param  {string}  dir    The direction
   * @param  {string}  task   The task
   * @param  {node}    form   The form
   *
   * return  {void}
   */


  Joomla.tableOrdering = function (order, dir, task, form) {
    var newForm = form;

    if (typeof newForm === 'undefined') {
      newForm = document.getElementById('adminForm');
    } else if (typeof form === 'string') {
      newForm = document.getElementById(form);
    }

    newForm.filter_order.value = order;
    newForm.filter_order_Dir.value = dir;
    Joomla.submitform(task, newForm);
  };
  /**
   * USED IN: all over :)
   *
   * @param  {string}  id    The id
   * @param  {string}  task  The task
   * @param  {string}  form  The optional form
   *
   * @return {boolean}
   */


  Joomla.listItemTask = function (id, task) {
    var form = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var newForm = form;

    if (form !== null) {
      newForm = document.getElementById(form);
    } else {
      newForm = document.adminForm;
    }

    var cb = newForm[id];
    var i = 0;
    var cbx;

    if (!cb) {
      return false;
    } // eslint-disable-next-line no-constant-condition


    while (true) {
      cbx = newForm["cb".concat(i)];

      if (!cbx) {
        break;
      }

      cbx.checked = false;
      i += 1;
    }

    cb.checked = true;
    newForm.boxchecked.value = 1;
    Joomla.submitform(task, newForm);
    return false;
  };
  /**
   * Add Joomla! loading image layer.
   *
   * Used in: /administrator/components/com_installer/views/languages/tmpl/default.php
   *          /installation/template/js/installation.js
   *
   * @param   {String}       task           The task to do [load, show, hide] (defaults to show).
   * @param   {HTMLElement}  parentElement  The HTML element where we are appending the layer
   *          (defaults to body).
   *
   * @return  {HTMLElement}  The HTML loading layer element.
   *
   * @since  3.6.0
   */


  Joomla.loadingLayer = function (task, parentElement) {
    // Set default values.
    var newTask = task || 'show';
    var newParentElement = parentElement || document.body; // Create the loading layer (hidden by default).

    if (newTask === 'load') {
      // Prevent loading twice
      if (document.getElementById('loading-logo')) {
        return false;
      } // Gets the site base path


      var systemPaths = Joomla.getOptions('system.paths') || {};
      var basePath = systemPaths.root || '';
      var loadingDiv = document.createElement('div');
      loadingDiv.id = 'loading-logo'; // The loading layer CSS styles are JS hardcoded so they can be used without adding CSS.
      // Loading layer style and positioning.

      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '0';
      loadingDiv.style.left = '0';
      loadingDiv.style.width = '100%';
      loadingDiv.style.height = '100%';
      loadingDiv.style.opacity = '0.8';
      loadingDiv.style.filter = 'alpha(opacity=80)';
      loadingDiv.style.overflow = 'hidden';
      loadingDiv.style['z-index'] = '10000';
      loadingDiv.style.display = 'none';
      loadingDiv.style['background-color'] = '#fff'; // Loading logo positioning.

      loadingDiv.style['background-image'] = "url(\"".concat(basePath, "/media/system/images/ajax-loader.gif\")");
      loadingDiv.style['background-position'] = 'center';
      loadingDiv.style['background-repeat'] = 'no-repeat';
      loadingDiv.style['background-attachment'] = 'fixed';
      newParentElement.appendChild(loadingDiv);
    } else {
      // Show or hide the layer.
      if (!document.getElementById('loading-logo')) {
        Joomla.loadingLayer('load', newParentElement);
      }

      document.getElementById('loading-logo').style.display = newTask === 'show' ? 'block' : 'none';
    }

    return document.getElementById('loading-logo');
  };
  /**
   * Method to Extend Objects
   *
   * @param  {Object}  destination
   * @param  {Object}  source
   *
   * @return Object
   */


  Joomla.extend = function (destination, source) {
    var newDestination = destination;
    /**
     * Technically null is an object, but trying to treat the destination as one in this
     * context will error out.
     * So emulate jQuery.extend(), and treat a destination null as an empty object.
     */

    if (destination === null) {
      newDestination = {};
    }

    [].slice.call(Object.keys(source)).forEach(function (key) {
      newDestination[key] = source[key];
    });
    return destination;
  };
  /**
   * Method to perform AJAX request
   *
   * @param {Object} options   Request options:
   * {
   *    url:     'index.php', Request URL
   *    method:  'GET',       Request method GET (default), POST
   *    data:    null,        Data to be sent, see
   *                https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/send
   *    perform: true,        Perform the request immediately
   *              or return XMLHttpRequest instance and perform it later
   *    headers: null,        Object of custom headers, eg {'X-Foo': 'Bar', 'X-Bar': 'Foo'}
   *
   *    onBefore:  (xhr) => {}            // Callback on before the request
   *    onSuccess: (response, xhr) => {}, // Callback on the request success
   *    onError:   (xhr) => {},           // Callback on the request error
   * }
   *
   * @return XMLHttpRequest|Boolean
   *
   * @example
   *
   *   Joomla.request({
   *    url: 'index.php?option=com_example&view=example',
   *    onSuccess: (response, xhr) => {
   *     JSON.parse(response);
   *    }
   *   })
   *
   * @see    https://developer.mozilla.org/docs/Web/API/XMLHttpRequest
   */


  Joomla.request = function (options) {
    var xhr; // Prepare the options

    var newOptions = Joomla.extend({
      url: '',
      method: 'GET',
      data: null,
      perform: true
    }, options); // Set up XMLHttpRequest instance

    try {
      xhr = new XMLHttpRequest();
      xhr.open(newOptions.method, newOptions.url, true); // Set the headers

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('X-Ajax-Engine', 'Joomla!');

      if (newOptions.method !== 'GET') {
        var token = Joomla.getOptions('csrf.token', '');

        if (token) {
          xhr.setRequestHeader('X-CSRF-Token', token);
        }

        if (!newOptions.headers || !newOptions.headers['Content-Type']) {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
      } // Custom headers


      if (newOptions.headers) {
        [].slice.call(Object.keys(newOptions.headers)).forEach(function (key) {
          // Allow request without Content-Type
          // eslint-disable-next-line no-empty
          if (key === 'Content-Type' && newOptions.headers['Content-Type'] === 'false') {} else {
            xhr.setRequestHeader(key, newOptions.headers[key]);
          }
        });
      }

      xhr.onreadystatechange = function () {
        // Request not finished
        if (xhr.readyState !== 4) {
          return;
        } // Request finished and response is ready


        if (xhr.status === 200) {
          if (newOptions.onSuccess) {
            newOptions.onSuccess.call(window, xhr.responseText, xhr);
          }
        } else if (newOptions.onError) {
          newOptions.onError.call(window, xhr);
        }
      }; // Do request


      if (newOptions.perform) {
        if (newOptions.onBefore && newOptions.onBefore.call(window, xhr) === false) {
          // Request interrupted
          return xhr;
        }

        xhr.send(newOptions.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-unused-expressions,no-console
      window.console ? console.log(error) : null;
      return false;
    }

    return xhr;
  };
  /**
   * Loads any needed polyfill for web components and async load any web components
   *
   * Parts of the WebComponents method belong to The Polymer Project Authors. License http://polymer.github.io/LICENSE.txt
   *
   * @since   4.0.0
   */


  Joomla.WebComponents = function () {
    var wc = Joomla.getOptions('webcomponents'); // Return early

    if (!wc || !wc.length) {
      return;
    }

    var polyfillsLoaded = false;
    var whenLoadedFns = [];
    var allowUpgrades = false;
    var flushFn;

    var fireEvent = function fireEvent() {
      window.WebComponents.ready = true;
      document.dispatchEvent(new CustomEvent('WebComponentsReady', {
        bubbles: true
      })); // eslint-disable-next-line no-use-before-define

      loadWC();
    };

    var batchCustomElements = function batchCustomElements() {
      if (window.customElements && customElements.polyfillWrapFlushCallback) {
        customElements.polyfillWrapFlushCallback(function (flushCallback) {
          flushFn = flushCallback;

          if (allowUpgrades) {
            flushFn();
          }
        });
      }
    };

    var asyncReady = function asyncReady() {
      // eslint-disable-next-line no-use-before-define
      batchCustomElements(); // eslint-disable-next-line no-use-before-define

      ready();
    };

    var ready = function ready() {
      // bootstrap <template> elements before custom elements
      if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
        HTMLTemplateElement.bootstrap(window.document);
      }

      polyfillsLoaded = true; // eslint-disable-next-line no-use-before-define

      runWhenLoadedFns().then(fireEvent);
    };

    var runWhenLoadedFns = function runWhenLoadedFns() {
      allowUpgrades = false;

      var done = function done() {
        allowUpgrades = true;
        whenLoadedFns.length = 0; // eslint-disable-next-line no-unused-expressions

        flushFn && flushFn();
      };

      return Promise.all(whenLoadedFns.map(function (fn) {
        return fn instanceof Function ? fn() : fn;
      })).then(function () {
        done();
      }).catch(function (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    };

    window.WebComponents = window.WebComponents || {
      ready: false,
      _batchCustomElements: batchCustomElements,
      waitFor: function waitFor(waitFn) {
        if (!waitFn) {
          return;
        }

        whenLoadedFns.push(waitFn);

        if (polyfillsLoaded) {
          runWhenLoadedFns();
        }
      }
    };
    /* Check if ES6 then apply the shim */

    var checkES6 = function checkES6() {
      try {
        // eslint-disable-next-line no-new-func, no-new
        new Function('(a = 0) => a');
        return true;
      } catch (err) {
        return false;
      }
    };
    /* Load web components async */


    var loadWC = function loadWC() {
      if (wc && wc.length) {
        wc.forEach(function (component) {
          var el;

          if (component.match(/\.js/g)) {
            el = document.createElement('script');

            if (!checkES6()) {
              var es5; // Browser is not ES6!

              if (component.match(/\.min\.js/g)) {
                es5 = component.replace(/\.min\.js/g, '-es5.min.js');
              } else if (component.match(/\.js/g)) {
                es5 = component.replace(/\.js/g, '-es5.js');
              }

              el.src = es5;
            } else {
              el.src = component;
            }
          }

          if (el) {
            document.head.appendChild(el);
          }
        });
      }
    }; // Get the core.js src attribute


    var name = 'core.min.js';
    var script = document.querySelector("script[src*=\"".concat(name, "\"]"));

    if (!script) {
      name = 'core.js';
      script = document.querySelector("script[src*=\"".concat(name, "\"]"));
    }

    if (!script) {
      throw new Error('core(.min).js is not registered correctly!');
    } // Feature detect which polyfill needs to be imported.


    var polyfills = [];

    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force) {
      polyfills.push('sd');
    }

    if (!window.customElements || window.customElements.forcePolyfill) {
      polyfills.push('ce');
    }

    var needsTemplate = function () {
      // no real <template> because no `content` property (IE and older browsers)
      var t = document.createElement('template');

      if (!('content' in t)) {
        return true;
      } // broken doc fragment (older Edge)


      if (!(t.content.cloneNode() instanceof DocumentFragment)) {
        return true;
      } // broken <template> cloning (Edge up to at least version 17)


      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0;
    }(); // NOTE: any browser that does not have template or ES6 features
    // must load the full suite of polyfills.


    if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
      polyfills = ['sd-ce-pf'];
    }

    if (polyfills.length) {
      var newScript = document.createElement('script'); // Load it from the right place.

      var replacement = "media/vendor/webcomponentsjs/js/webcomponents-".concat(polyfills.join('-'), ".min.js");
      var mediaVersion = script.src.match(/\?.*/)[0];
      var base = Joomla.getOptions('system.paths');

      if (!base) {
        throw new Error('core(.min).js is not registered correctly!');
      }

      newScript.src = base.rootFull + replacement + (mediaVersion || ''); // if readyState is 'loading', this script is synchronous

      if (document.readyState === 'loading') {
        // make sure custom elements are batched whenever parser gets to the injected script
        newScript.setAttribute('onload', 'window.WebComponents._batchCustomElements()');
        document.write(newScript.outerHTML);
        document.addEventListener('DOMContentLoaded', ready);
      } else {
        newScript.addEventListener('load', asyncReady);
        newScript.addEventListener('error', function () {
          throw new Error("Could not load polyfill bundle".concat(base.rootFull + replacement));
        });
        document.head.appendChild(newScript);
      }
    } else {
      polyfillsLoaded = true;

      if (document.readyState === 'complete') {
        fireEvent();
      } else {
        // this script may come between DCL and load, so listen for both
        // and cancel load listener if DCL fires
        window.addEventListener('load', ready);
        window.addEventListener('DOMContentLoaded', function () {
          window.removeEventListener('load', ready);
          ready();
        });
      }
    }
  };
})(Joomla, document);
/**
 * Joomla! Custom events
 *
 * @since  4.0.0
 */


(function (window, Joomla) {
  'use strict';

  if (Joomla.Event) {
    return;
  }

  Joomla.Event = {};
  /**
   * Dispatch custom event.
   *
   * An event name convention:
   *     The event name has at least two part, separated ":", eg `foo:bar`.
   *     Where the first part is an "event supporter",
   *     and second part is the event name which happened.
   *     Which is allow us to avoid possible collisions with another scripts
   *     and native DOM events.
   *     Joomla! CMS standard events should start from `joomla:`.
   *
   * Joomla! events:
   *     `joomla:updated`  Dispatch it over the changed container,
   *      example after the content was updated via ajax
   *     `joomla:removed`  The container was removed
   *
   * @param {HTMLElement|string}  element  DOM element, the event target. Or the event name,
   * then the target will be a Window
   * @param {String|Object}       name     The event name, or an optional parameters in case
   * when "element" is an event name
   * @param {Object}              params   An optional parameters. Allow to send a custom data
   * through the event.
   *
   * @example
   *
   *   Joomla.Event.dispatch(myElement, 'joomla:updated', {for: 'bar', foo2: 'bar2'});
   *   // Will dispatch event to myElement
   *   or:
   *   Joomla.Event.dispatch('joomla:updated', {for: 'bar', foo2: 'bar2'});
   *   // Will dispatch event to Window
   *
   * @since   4.0.0
   */

  Joomla.Event.dispatch = function (element, name, params) {
    var newElement = element;
    var newName = name;
    var newParams = params;

    if (typeof element === 'string') {
      newParams = name;
      newName = element;
      newElement = window;
    }

    newParams = newParams || {};
    newElement.dispatchEvent(new CustomEvent(newName, {
      detail: newParams,
      bubbles: true,
      cancelable: true
    }));
  };
  /**
   * Once listener. Add EventListener to the Element and auto-remove it
   * after the event was dispatched.
   *
   * @param {HTMLElement}  element   DOM element
   * @param {String}       name      The event name
   * @param {Function}     callback  The event callback
   *
   * @since   4.0.0
   */


  Joomla.Event.listenOnce = function (element, name, callback) {
    var onceCallback = function onceCallback(event) {
      element.removeEventListener(name, onceCallback);
      return callback.call(element, event);
    };

    element.addEventListener(name, onceCallback);
  };
})(window, Joomla);
/**
 * Load any web components and any polyfills required
 */


document.addEventListener('DOMContentLoaded', Joomla.WebComponents);