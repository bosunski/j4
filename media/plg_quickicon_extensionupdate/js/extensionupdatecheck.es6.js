/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
// Ajax call to get the update status of the installed extensions
(() => {
  'use strict'; // Add a listener on content loaded to initiate the check

  document.addEventListener('DOMContentLoaded', () => {
    if (Joomla.getOptions('js-extensions-update')) {
      const options = Joomla.getOptions('js-extensions-update');

      const update = (type, text) => {
        const link = document.getElementById('plg_quickicon_extensionupdate');
        const linkSpans = [].slice.call(link.querySelectorAll('span.j-links-link'));

        if (link) {
          link.classList.add(type);
        }

        if (linkSpans.length) {
          linkSpans.forEach(span => {
            span.innerHTML = text;
          });
        }
      };

      Joomla.request({
        url: `${options.ajaxUrl}&eid=0&skip=700`,
        method: 'GET',
        data: '',
        perform: true,
        onSuccess: response => {
          const updateInfoList = JSON.parse(response);

          if (Array.isArray(updateInfoList)) {
            if (updateInfoList.length === 0) {
              // No updates
              update('success', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPTODATE'));
            } else {
              const messages = {
                warning: [`<div class="message-alert">
  ${Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPDATEFOUND_MESSAGE').replace('%s', `<span class="badge badge-pill badge-danger">${updateInfoList.length}</span>`)}
  <button type="button" class="btn btn-sm btn-primary" onclick="document.location='${options.url}'">
    ${Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPDATEFOUND_BUTTON')}
  </button>
</div>`]
              }; // Render the message

              Joomla.renderMessages(messages); // Scroll to page top

              window.scrollTo(0, 0);
              update('warning', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPDATEFOUND').replace('%s', `<span class="badge badge-light">${updateInfoList.length}</span>`));
            }
          } else {
            // An error occurred
            update('danger', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_ERROR'));
          }
        },
        onError: () => {
          // An error occurred
          update('danger', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_ERROR'));
        }
      });
    }
  });
})();