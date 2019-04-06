/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
Joomla = window.Joomla || {};

(function (Joomla) {
  'use strict';

  var installPackageButtonId = 'installbutton_package';
  document.addEventListener('DOMContentLoaded', function () {
    Joomla.submitbuttonpackage = function () {
      var form = document.getElementById('adminForm'); // do field validation

      if (form.install_package.value === '') {
        alert(Joomla.JText._('PLG_INSTALLER_PACKAGEINSTALLER_NO_PACKAGE'), true);
      } else {
        Joomla.displayLoader();
        form.installtype.value = 'upload';
        form.submit();
      }
    };

    Joomla.submitbuttonfolder = function () {
      var form = document.getElementById('adminForm'); // do field validation

      if (form.install_directory.value === '') {
        alert(Joomla.JText._('PLG_INSTALLER_FOLDERINSTALLER_NO_INSTALL_PATH'), true);
      } else {
        Joomla.displayLoader();
        form.installtype.value = 'folder';
        form.submit();
      }
    };

    Joomla.submitbuttonurl = function () {
      var form = document.getElementById('adminForm'); // do field validation

      if (form.install_url.value === '' || form.install_url.value === 'http://' || form.install_url.value === 'https://') {
        alert(Joomla.JText._('PLG_INSTALLER_URLINSTALLER_NO_URL'), true);
      } else {
        Joomla.displayLoader();
        form.installtype.value = 'url';
        form.submit();
      }
    };

    Joomla.submitbutton4 = function () {
      var form = document.getElementById('adminForm'); // do field validation

      if (form.install_url.value === '' || form.install_url.value === 'http://' || form.install_url.value === 'https://') {
        alert(Joomla.JText._('COM_INSTALLER_MSG_INSTALL_ENTER_A_URL'), true);
      } else {
        Joomla.displayLoader();
        form.installtype.value = 'url';
        form.submit();
      }
    };

    Joomla.submitbuttonUpload = function () {
      var form = document.getElementById('uploadForm'); // do field validation

      if (form.install_package.value === '') {
        alert(Joomla.JText._('COM_INSTALLER_MSG_INSTALL_PLEASE_SELECT_A_PACKAGE'), true);
      } else {
        Joomla.displayLoader();
        form.submit();
      }
    };

    Joomla.displayLoader = function () {
      var loading = document.getElementById('loading');

      if (loading) {
        loading.style.display = 'block';
      }
    };

    var loading = document.getElementById('loading');
    var installer = document.getElementById('installer-install');

    if (loading && installer) {
      loading.style.top = parseInt(installer.offsetTop - window.pageYOffset, 10);
      loading.style.left = 0;
      loading.style.width = '100%';
      loading.style.height = '100%';
      loading.style.display = 'none';
      loading.style.marginTop = '-10px';
    }

    document.getElementById(installPackageButtonId).addEventListener('click', function (event) {
      event.preventDefault();
      Joomla.submitbuttonpackage();
    });
  });
})(Joomla);

document.addEventListener('DOMContentLoaded', function () {
  if (typeof FormData === 'undefined') {
    document.querySelector('#legacy-uploader').style.display = 'block';
    document.querySelector('#uploader-wrapper').style.display = 'none';
    return;
  }

  var dragZone = document.querySelector('#dragarea');
  var fileInput = document.querySelector('#install_package');
  var loading = document.querySelector('#loading');
  var button = document.querySelector('#select-file-button');
  var returnUrl = document.querySelector('#installer-return').value;
  var token = document.querySelector('#installer-token').value;
  var uploadUrl = 'index.php?option=com_installer&task=install.ajax_upload';

  if (returnUrl) {
    uploadUrl += "&return=".concat(returnUrl);
  }

  button.addEventListener('click', function () {
    fileInput.click();
  });
  fileInput.addEventListener('change', function () {
    Joomla.submitbuttonpackage();
  });
  dragZone.addEventListener('dragenter', function (event) {
    event.preventDefault();
    event.stopPropagation();
    dragZone.classList.add('hover');
    return false;
  }); // Notify user when file is over the drop area

  dragZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    event.stopPropagation();
    dragZone.classList.add('hover');
    return false;
  });
  dragZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    event.stopPropagation();
    dragZone.classList.remove('hover');
    return false;
  });
  dragZone.addEventListener('drop', function (event) {
    event.preventDefault();
    event.stopPropagation();
    dragZone.classList.remove('hover');
    var files = event.target.files || event.dataTransfer.files;

    if (!files.length) {
      return;
    }

    var file = files[0];
    var data = new FormData();
    data.append('install_package', file);
    data.append('installtype', 'upload');
    data.append(token, 1);
    loading.style.display = 'block';
    Joomla.request({
      url: uploadUrl,
      method: 'POST',
      perform: true,
      data: data,
      headers: {
        'Content-Type': 'false'
      },
      onSuccess: function onSuccess(response) {
        var res = JSON.parse(response);

        if (!res.success) {
          // eslint-disable-next-line no-console
          console.log(res.message, res.messages);
        } // Always redirect that can show message queue from session


        if (res.data.redirect) {
          window.location.href = res.data.redirect;
        } else {
          window.location.href = 'index.php?option=com_installer&view=install';
        }
      },
      onError: function onError(error) {
        loading.style.display = 'none';
        alert(error.statusText);
      }
    });
  });
});