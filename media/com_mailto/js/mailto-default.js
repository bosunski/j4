/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
(function (window, document, Joomla) {
  'use strict';

  if (!Joomla || typeof Joomla.JText._ !== 'function') {
    throw new Error('core.js was not properly initialised');
  } // Selectors used by this script


  var closeSelector = '.close-mailto';
  /**
   * Register events
   */

  var onClick = function onClick(event) {
    event.preventDefault();
    window.close();
  };
  /**
   * Register events
   */


  var registerEvents = function registerEvents() {
    // Register the close click listener
    var closeElements = [].slice.call(document.querySelectorAll(closeSelector));

    if (closeElements.length) {
      closeElements.forEach(function (closeElement) {
        closeElement.addEventListener('click', onClick);
      });
    } // Cleanup


    document.removeEventListener('DOMContentLoaded', registerEvents);
  };

  document.addEventListener('DOMContentLoaded', registerEvents);
})(window, document, Joomla);