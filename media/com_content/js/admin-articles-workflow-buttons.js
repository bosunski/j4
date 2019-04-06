/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
Joomla = window.Joomla || {};
/**
 * Method that switches a given class to the following elements of the element provided
 *
 * @param {HTMLElement}  element    The reference element
 * @param {string}       className  The class name to be toggled
 */

Joomla.toggleAllNextElements = function (element, className) {
  var getNextSiblings = function getNextSiblings(el) {
    var siblings = [];
    /* eslint-disable no-cond-assign,no-param-reassign */

    do {
      siblings.push(el);
    } while ((el = el.nextElementSibling) !== null);
    /* eslint-enable no-cond-assign,no-param-reassign */


    return siblings;
  };

  var followingElements = getNextSiblings(element);

  if (followingElements.length) {
    followingElements.forEach(function (elem) {
      if (elem.classList.contains(className)) {
        elem.classList.remove(className);
      } else {
        elem.classList.add(className);
      }
    });
  }
};

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var dropDownBtn = document.getElementById('toolbar-dropdown-status-group');
    var publishBtn = dropDownBtn.getElementsByClassName('button-publish')[0];
    var unpublishBtn = dropDownBtn.getElementsByClassName('button-unpublish')[0];
    var archiveBtn = dropDownBtn.getElementsByClassName('button-archive')[0];
    var trashBtn = dropDownBtn.getElementsByClassName('button-trash')[0];
    var articleList = document.querySelector('#articleList');
    var modal = document.getElementById('stageModal');
    var modalcontent = document.getElementById('stageModal-content');
    var modalbutton = document.getElementById('stage-submit-button-id');
    var buttonDataSelector = 'data-submit-task';
    var articleListRows = [];
    var publishBool = false;
    var unpublishBool = false;
    var archiveBool = false;
    var trashBool = false;
    var countChecked = 0;

    if (articleList) {
      articleListRows = [].slice.call(articleList.querySelectorAll('tbody tr'));
    } // TODO: remove jQuery dependency, when we have a new modal script


    window.jQuery(modal).on('hide.bs.modal', function () {
      modalcontent.innerHTML = '';
    });

    function checkTransition(e, task) {
      // Let's check for n:1 connections
      var transitions = Joomla.getOptions('articles.transitions')[task];
      var availableTrans = {};
      var showModal = false;

      if (transitions === undefined) {
        return;
      }

      if (articleListRows.length) {
        articleListRows.forEach(function (el) {
          var checkedBox = el.querySelectorAll('input[type=checkbox]')[0];

          if (checkedBox.checked) {
            var parentTr = checkedBox.closest('tr');
            var stage = parseInt(parentTr.getAttribute('data-stage_id'), 10);
            var workflow = parseInt(parentTr.getAttribute('data-workflow_id'), 10);
            availableTrans[checkedBox.value] = [];

            if (transitions[workflow] === undefined) {
              return;
            }

            var k = 0; // Collect transitions

            if (transitions[workflow][-1] !== undefined) {
              for (var j = 0; j < transitions[workflow][-1].length; j += 1) {
                if (transitions[workflow][-1][j].to_stage_id !== stage) {
                  availableTrans[checkedBox.value][k] = transitions[workflow][-1][j];
                  k += 1;
                }
              }
            }

            if (transitions[workflow][stage] !== undefined) {
              for (var _j = 0; _j < transitions[workflow][stage].length; _j += 1) {
                if (transitions[workflow][stage][_j].to_stage_id !== stage) {
                  availableTrans[checkedBox.value][k] = transitions[workflow][stage][_j];
                  k += 1;
                }
              }
            }

            if (availableTrans[checkedBox.value].length > 1) {
              showModal = true;
            } else {
              delete availableTrans[checkedBox.value];
            }
          }
        });
      }

      if (showModal) {
        e.stopPropagation();
        var articles = Joomla.getOptions('articles.items');
        var html = '';
        modalbutton.setAttribute(buttonDataSelector, "articles.".concat(task));
        Object.keys(availableTrans).forEach(function (id) {
          if (articles["article-".concat(id)] !== undefined) {
            html += '<div class="form-group col-md-6">';
            html += "<label for=\"publish_transitions_".concat(id, "\">").concat(articles["article-".concat(id)], "</label>");
            html += "<select id=\"publish_transitions_".concat(id, "\" class=\"custom-select\" name=\"publish_transitions[").concat(id, "]\">");
            Object.keys(availableTrans[id]).forEach(function (key) {
              html += "<option value=\"".concat(availableTrans[id][key].value, "\">").concat(availableTrans[id][key].text, "</option>");
            });
            html += '</select>';
            html += '</div>';
            html += '</div>';
          }
        });
        modalcontent.innerHTML = html; // TODO: remove jQuery dependency, when we have a new modal script

        window.jQuery(modal).modal();
      }
    }

    publishBtn.addEventListener('click', function (e) {
      if (e.target.classList.contains('disabled')) {
        e.stopPropagation();
        Joomla.renderMessages({
          error: [Joomla.JText._('COM_CONTENT_ERROR_CANNOT_PUBlISH')]
        });
      } else {
        checkTransition(e, 'publish');
      }
    });
    unpublishBtn.addEventListener('click', function (e) {
      if (e.target.classList.contains('disabled')) {
        e.stopPropagation();
        Joomla.renderMessages({
          error: [Joomla.JText._('COM_CONTENT_ERROR_CANNOT_UNPUBlISH')]
        });
      } else {
        checkTransition(e, 'unpublish');
      }
    });
    archiveBtn.addEventListener('click', function (e) {
      if (e.target.classList.contains('disabled')) {
        e.stopPropagation();
        Joomla.renderMessages({
          error: [Joomla.JText._('COM_CONTENT_ERROR_CANNOT_ARCHIVE')]
        });
      } else {
        checkTransition(e, 'archive');
      }
    });
    trashBtn.addEventListener('click', function (e) {
      if (e.target.classList.contains('disabled')) {
        e.stopPropagation();
        Joomla.renderMessages({
          error: [Joomla.JText._('COM_CONTENT_ERROR_CANNOT_TRASH')]
        });
      } else {
        checkTransition(e, 'trash');
      }
    });

    function setOrRemDisabled(btn, set) {
      if (set) {
        btn.classList.remove('disabled');
      } else {
        btn.classList.add('disabled');
      }
    } // disable or enable Buttons of transitions depending on the boolean variables


    function disableButtons() {
      setOrRemDisabled(publishBtn, publishBool);
      setOrRemDisabled(unpublishBtn, unpublishBool);
      setOrRemDisabled(archiveBtn, archiveBool);
      setOrRemDisabled(trashBtn, trashBool);
    } // check for common attributes for which the conditions for a transition are possible or not
    // and save this information in a boolean variable.


    function checkForAttributes(row) {
      publishBool = row.getAttribute('data-condition-publish') > 0 && (countChecked === 0 || publishBool);
      unpublishBool = row.getAttribute('data-condition-unpublish') > 0 && (countChecked === 0 || unpublishBool);
      archiveBool = row.getAttribute('data-condition-archive') > 0 && (countChecked === 0 || archiveBool);
      trashBool = row.getAttribute('data-condition-trash') > 0 && (countChecked === 0 || trashBool);
    } // listen to click event to get selected rows


    if (articleList) {
      articleList.addEventListener('click', function () {
        articleListRows.forEach(function (el) {
          var checkedBox = el.querySelectorAll('input[type=checkbox]')[0];

          if (checkedBox.checked) {
            var parentTr = checkedBox.closest('tr');
            checkForAttributes(parentTr);
            countChecked += 1;
          }
        });
        disableButtons();
        countChecked = 0;
      });
    }
  });
})();