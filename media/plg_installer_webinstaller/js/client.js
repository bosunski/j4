/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
if (!window.jQuery) {
  throw new Error('WebInstaller plugin requires jQuery');
}

if (!Joomla) {
  throw new Error('Joomla API is not properly initialised');
}

(function (window, document, Joomla, jQuery) {
  'use strict';

  var webInstallerOptions = {
    view: 'dashboard',
    id: 0,
    ordering: '',
    list: 0,
    options: Joomla.getOptions('plg_installer_webinstaller', {})
  };
  var instance;

  var WebInstaller =
  /*#__PURE__*/
  function () {
    function WebInstaller() {
      _classCallCheck(this, WebInstaller);
    }

    _createClass(WebInstaller, [{
      key: "initialise",
      value: function initialise() {
        webInstallerOptions.loaded = 1;
        Joomla.loadingLayer('load', document.getElementById('web'));
        var cancelButton = document.getElementById('uploadform-web-cancel');
        cancelButton.addEventListener('click', function () {
          document.getElementById('uploadform-web').classList.add('hidden'); // jQuery('#jed-container').slideDown(300);

          if (webInstallerOptions.list && document.querySelector('.list-view')) {
            document.querySelector('.list-view').click();
          }
        });
        this.loadweb("".concat(webInstallerOptions.options.base_url, "index.php?format=json&option=com_apps&view=dashboard"));
        this.clickforlinks();
      }
    }, {
      key: "loadweb",
      value: function loadweb(url) {
        var _this = this;

        if (!url) {
          return false;
        }

        var pattern1 = new RegExp(webInstallerOptions.options.base_url);
        var pattern2 = new RegExp('^index.php');

        if (!(pattern1.test(url) || pattern2.test(url))) {
          window.open(url, '_blank');
          return false;
        }

        var requestUrl = "".concat(url, "&product=").concat(webInstallerOptions.options.product, "&release=").concat(webInstallerOptions.options.release, "&dev_level=").concat(webInstallerOptions.options.dev_level, "&list=").concat(webInstallerOptions.list ? 'list' : 'grid', "&lang=").concat(webInstallerOptions.options.language);

        if (webInstallerOptions.ordering !== '' && document.getElementById('com-apps-ordering').value) {
          webInstallerOptions.ordering = document.getElementById('com-apps-ordering').value;
          requestUrl += "&ordering=".concat(webInstallerOptions.ordering);
        } // jQuery('html, body').animate({ scrollTop: 0 }, 0);


        WebInstaller.showLoadingLayer(); // @todo convert to vanilla, requires more functionality in Joomla.request

        jQuery.ajax({
          url: requestUrl,
          dataType: 'json',
          cache: true,
          timeout: 20000,
          success: function success(response) {
            if (document.getElementById('web-loader')) {
              document.getElementById('web-loader').classList.add('hidden');
            }

            var jedContainer = document.getElementById('jed-container');
            jedContainer.innerHTML = response.data.html;
            document.getElementById('com-apps-searchbox').addEventListener('keypress', function (event) {
              if (event.which === 13) {
                _this.initiateSearch();
              }
            });
            document.getElementById('search-extensions').addEventListener('click', function () {
              _this.initiateSearch();
            });
            document.getElementById('search-reset').addEventListener('click', function () {
              var searchBox = document.getElementById('com-apps-searchbox');
              searchBox.value = '';

              _this.initiateSearch();
            });
            var orderingSelect = document.getElementById('com-apps-ordering');

            if (orderingSelect) {
              orderingSelect.addEventListener('change', function () {
                var index = orderingSelect.selectedIndex;
                webInstallerOptions.ordering = orderingSelect.options[index].value;

                _this.installfromwebajaxsubmit();
              });
            }

            if (webInstallerOptions.options.installfrom_url !== '') {
              WebInstaller.installfromweb(webInstallerOptions.options.installfrom_url);
            }
          },
          fail: function fail() {
            if (document.getElementById('web-loader')) {
              document.getElementById('web-loader').classList.add('hidden');
              document.getElementById('web-loader-error').classList.remove('hidden');
            }
          },
          complete: function complete() {
            var installAtField = document.getElementById('joomlaapsinstallatinput');

            if (installAtField) {
              installAtField.value = webInstallerOptions.options.installat_url;
            }

            _this.clickforlinks();

            WebInstaller.clicker();

            if (webInstallerOptions.view !== 'extension') {
              [].slice.call(document.querySelectorAll('div.load-extension')).forEach(function (element) {
                element.addEventListener('click', function (event) {
                  event.preventDefault();

                  _this.processLinkClick(element.getAttribute('data-url'));
                });
                element.setAttribute('href', '#');
              });
            }

            if (webInstallerOptions.view === 'extension') {
              var installExtensionButton = document.getElementById('install-extension');
              var installExtensionFromExternalButton = document.getElementById('install-extension-from-external');

              if (installExtensionButton) {
                installExtensionButton.addEventListener('click', function () {
                  WebInstaller.installfromweb(installExtensionButton.getAttribute('data-downloadurl'), installExtensionButton.getAttribute('data-name'));
                });
              }

              if (installExtensionFromExternalButton) {
                // @todo Migrate this handler's confirm to a CE dialog
                installExtensionFromExternalButton.addEventListener('click', function () {
                  var redirectUrl = installExtensionFromExternalButton.getAttribute('data-downloadurl');
                  var redirectConfirm = window.confirm(Joomla.JText._('PLG_INSTALLER_WEBINSTALLER_REDIRECT_TO_EXTERNAL_SITE_TO_INSTALL').replace('[SITEURL]', redirectUrl));

                  if (redirectConfirm !== true) {
                    return;
                  }

                  document.getElementById('adminForm').setAttribute('action', redirectUrl);
                  document.querySelector('input[name=task]').setAttribute('disabled', true);
                  document.querySelector('input[name=install_directory]').setAttribute('disabled', true);
                  document.querySelector('input[name=install_url]').setAttribute('disabled', true);
                  document.querySelector('input[name=installtype]').setAttribute('disabled', true);
                  document.querySelector('input[name=filter_search]').setAttribute('disabled', true);
                  document.getElementById('adminForm').submit();
                });
              }
            }

            if (webInstallerOptions.list && document.querySelector('.list-view')) {
              document.querySelector('.list-view').click();
            }

            WebInstaller.hideLoadingLayer();
          },
          error: function error(request) {
            var errorContainer = document.getElementById('web-loader-error');
            var loaderContainer = document.getElementById('web-loader');

            if (request.responseText && errorContainer) {
              errorContainer.innerHTML = request.responseText;
            }

            if (loaderContainer) {
              loaderContainer.classList.add('hidden');
              errorContainer.classList.remove('hidden');
            }
          }
        });
        return true;
      }
    }, {
      key: "clickforlinks",
      value: function clickforlinks() {
        var _this2 = this;

        [].slice.call(document.querySelectorAll('a.transcode')).forEach(function (element) {
          var ajaxurl = element.getAttribute('href');
          element.addEventListener('click', function (event) {
            event.preventDefault();

            _this2.processLinkClick(ajaxurl);
          });
          element.setAttribute('href', '#');
        });
      }
    }, {
      key: "initiateSearch",
      value: function initiateSearch() {
        webInstallerOptions.view = 'dashboard';
        this.installfromwebajaxsubmit();
      }
    }, {
      key: "installfromwebajaxsubmit",
      value: function installfromwebajaxsubmit() {
        var tail = "&view=".concat(webInstallerOptions.view);

        if (webInstallerOptions.id) {
          tail += "&id=".concat(webInstallerOptions.id);
        }

        if (document.getElementById('com-apps-searchbox').value) {
          var value = encodeURI(document.getElementById('com-apps-searchbox').value.toLowerCase().replace(/ +/g, '_').replace(/[^a-z0-9-_]/g, '').trim());
          tail += "&filter_search=".concat(value);
        }

        if (webInstallerOptions.ordering !== '' && document.getElementById('com-apps-ordering').value) {
          webInstallerOptions.ordering = document.getElementById('com-apps-ordering').value;
        }

        if (webInstallerOptions.ordering) {
          tail += "&ordering=".concat(webInstallerOptions.ordering);
        }

        this.loadweb("".concat(webInstallerOptions.options.base_url, "index.php?format=json&option=com_apps").concat(tail));
      }
    }, {
      key: "processLinkClick",
      value: function processLinkClick(url) {
        var pattern1 = new RegExp(webInstallerOptions.options.base_url);
        var pattern2 = new RegExp('^index.php');

        if (pattern1.test(url) || pattern2.test(url)) {
          webInstallerOptions.view = url.replace(/^.+[&?]view=(\w+).*$/, '$1');

          if (webInstallerOptions.view === 'dashboard') {
            webInstallerOptions.id = 0;
          } else if (webInstallerOptions.view === 'category') {
            webInstallerOptions.id = url.replace(/^.+[&?]id=(\d+).*$/, '$1');
          }

          this.loadweb(webInstallerOptions.options.base_url + url);
        } else {
          this.loadweb(url);
        }
      }
    }], [{
      key: "showLoadingLayer",
      value: function showLoadingLayer() {
        Joomla.loadingLayer('show', document.getElementById('web'));
      }
    }, {
      key: "hideLoadingLayer",
      value: function hideLoadingLayer() {
        Joomla.loadingLayer('hide', document.getElementById('web'));
      }
    }, {
      key: "clicker",
      value: function clicker() {
        if (document.querySelector('.grid-view')) {
          document.querySelector('.grid-view').addEventListener('click', function () {
            webInstallerOptions.list = 0;
            document.querySelector('.list-container').classList.add('hidden');
            document.querySelector('.grid-container').classList.remove('hidden');
            document.getElementById('btn-list-view').classList.remove('active');
            document.getElementById('btn-grid-view').classList.remove('active');
          });
        }

        if (document.querySelector('.list-view')) {
          document.querySelector('.list-view').addEventListener('click', function () {
            webInstallerOptions.list = 1;
            document.querySelector('.grid-container').classList.add('hidden');
            document.querySelector('.list-container').classList.remove('hidden');
            document.getElementById('btn-grid-view').classList.remove('active');
            document.getElementById('btn-list-view').classList.add('active');
          });
        }
      }
      /**
       * @param {string} installUrl
       * @param {string} name
       * @returns {boolean}
       * @todo Migrate this function's alert to a CE dialog
       */

    }, {
      key: "installfromweb",
      value: function installfromweb(installUrl) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!installUrl) {
          alert(Joomla.JText._('PLG_INSTALLER_WEBINSTALLER_CANNOT_INSTALL_EXTENSION_IN_PLUGIN'));
          return false;
        }

        var installUrlField = document.getElementById('install_url');
        var uploadUrlContainer = document.getElementById('uploadform-web-url');
        installUrlField.value = installUrl;
        uploadUrlContainer.innerHTML = installUrl;

        if (name) {
          var nameElement = document.getElementById('uploadform-web-name');
          nameElement.innerHTML = name;
          document.getElementById('uploadform-web-name-label').classList.remove('hidden');
        } else {
          document.getElementById('uploadform-web-name-label').classList.add('hidden');
        } // jQuery('#jed-container').slideUp(300);


        document.getElementById('uploadform-web').classList.remove('hidden');
        return true;
      }
    }]);

    return WebInstaller;
  }();

  document.addEventListener('DOMContentLoaded', function () {
    var initialiser = function initialiser() {
      var installerTabs = document.getElementById('myTab'); // Need to wait for the CE to have inserted the tabs list

      if (installerTabs.firstElementChild.tagName !== 'UL') {
        setTimeout(initialiser, 50);
        return;
      }

      var link = installerTabs.querySelector('#tab-web'); // Abort if the IFW tab cannot be found

      if (!link) {
        return;
      }

      if (webInstallerOptions.options.installfromon) {
        link.click();
      }

      if (link.hasAttribute('active')) {
        if (!instance) {
          instance = new WebInstaller();
          instance.initialise();
        }
      }

      if (webInstallerOptions.options.installfrom_url !== '') {
        link.click();
      }

      link.addEventListener('joomla.tab.shown', function () {
        if (!instance) {
          instance = new WebInstaller();
          instance.initialise();
        }
      });
    };

    setTimeout(initialiser, 50);
  });
})(window, document, Joomla, window.jQuery);