/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function () {
  var batchMenu = document.getElementById('batch-menu-id');
  var batchCopyMove = document.getElementById('batch-copy-move');
  var batchSelector;

  var onChange = function onChange() {
    if (batchSelector.value !== 0 || batchSelector.value !== '') {
      batchCopyMove.style.display = 'block';
    } else {
      batchCopyMove.style.display = 'none';
    }
  };

  var onSelect = function onSelect() {
    if (batchMenu) {
      batchSelector = batchMenu;
    }

    if (batchCopyMove) {
      batchSelector.addEventListener('change', onChange);
    } // Cleanup


    document.removeEventListener('DOMContentLoaded', onSelect, true);
  }; // Document loaded


  document.addEventListener('DOMContentLoaded', onSelect, true);
})();