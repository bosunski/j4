/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('jform_title');
  title.dpOldValue = title.value;
  title.addEventListener('change', event => {
    const label = document.getElementById('jform_label');
    const changedTitle = event.currentTarget;

    if (changedTitle.dpOldValue === label.value) {
      label.value = changedTitle.value;
    }

    changedTitle.dpOldValue = changedTitle.value;
  });
});