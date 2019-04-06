/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function (Joomla, document) {
  'use strict';
  /**
   * Check if HTML5 localStorage enabled on the browser
   *
   * @since   4.0.0
   */

  Joomla.localStorageEnabled = function () {
    var test = 'joomla-cms';

    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }; // eslint-disable-next-line no-new


  new window.MetisMenu('#menu');

  var closest = function closest(element, selector) {
    var matchesFn;
    var parent; // find vendor prefix

    ['matches', 'msMatchesSelector'].some(function (fn) {
      if (typeof document.body[fn] === 'function') {
        matchesFn = fn;
        return true;
      }

      return false;
    }); // Traverse parents

    while (element) {
      parent = element.parentElement;

      if (parent && parent[matchesFn](selector)) {
        return parent;
      } // eslint-disable-next-line no-param-reassign


      element = parent;
    }

    return null;
  };

  var wrapper = document.getElementById('wrapper');
  var sidebar = document.getElementById('sidebar-wrapper');
  var menuToggleIcon = document.getElementById('menu-collapse-icon'); // Set the initial state of the sidebar based on the localStorage value

  if (Joomla.localStorageEnabled()) {
    var sidebarState = localStorage.getItem('atum-sidebar');

    if (sidebarState === 'open' || sidebarState === null) {
      wrapper.classList.remove('closed');
      menuToggleIcon.classList.remove('fa-toggle-off');
      menuToggleIcon.classList.add('fa-toggle-on');
      localStorage.setItem('atum-sidebar', 'open');
    } else {
      wrapper.classList.add('closed');
      menuToggleIcon.classList.remove('fa-toggle-on');
      menuToggleIcon.classList.add('fa-toggle-off');
      localStorage.setItem('atum-sidebar', 'closed');
    }
  } // If the sidebar doesn't exist, for example, on edit views, then remove the "closed" class


  if (!sidebar) {
    wrapper.classList.remove('closed');
  }

  if (sidebar && !sidebar.getAttribute('data-hidden')) {
    // Sidebar
    var menuToggle = document.getElementById('menu-collapse');
    var firsts = [].slice.call(sidebar.querySelectorAll('.collapse-level-1')); // Apply 2nd level collapse

    firsts.forEach(function (first) {
      var seconds = [].slice.call(first.querySelectorAll('.collapse-level-1'));
      seconds.forEach(function (second) {
        if (second) {
          second.classList.remove('collapse-level-1');
          second.classList.add('collapse-level-2');
        }
      });
    });

    var menuClose = function menuClose() {
      sidebar.querySelector('.collapse').classList.remove('in');
    }; // Toggle menu


    menuToggle.addEventListener('click', function () {
      wrapper.classList.toggle('closed');
      menuToggleIcon.classList.toggle('fa-toggle-on');
      menuToggleIcon.classList.toggle('fa-toggle-off');
      var listItems = [].slice.call(document.querySelectorAll('.main-nav > li'));
      listItems.forEach(function (item) {
        item.classList.remove('open');
      });
      var elem = document.querySelector('.child-open');

      if (elem) {
        elem.classList.remove('child-open');
      } // Save the sidebar state


      if (Joomla.localStorageEnabled()) {
        if (wrapper.classList.contains('closed')) {
          localStorage.setItem('atum-sidebar', 'closed');
        } else {
          localStorage.setItem('atum-sidebar', 'open');
        }
      }
    });
    /**
     * Sidebar Nav
     */

    var allLinks = [].slice.call(wrapper.querySelectorAll('a.no-dropdown, a.collapse-arrow'));
    var currentUrl = window.location.href.toLowerCase();
    var mainNav = document.getElementById('menu');
    var menuParents = [].slice.call(mainNav.querySelectorAll('li.parent > a'));
    var subMenusClose = [].slice.call(mainNav.querySelectorAll('li.parent .close')); // Set active class

    allLinks.forEach(function (link) {
      if (currentUrl === link.href) {
        link.classList.add('active'); // Auto Expand Levels

        if (!link.parentNode.classList.contains('parent')) {
          var firstLevel = closest(link, '.collapse-level-1');
          var secondLevel = closest(link, '.collapse-level-2');
          if (firstLevel) firstLevel.parentNode.classList.add('active');
          if (firstLevel) firstLevel.classList.add('in');
          if (secondLevel) secondLevel.parentNode.classList.add('active');
          if (secondLevel) secondLevel.classList.add('in');
        }
      }
    }); // Child open toggle

    var openToggle = function openToggle(event) {
      var menuItem = event.currentTarget.parentNode;

      if (menuItem.tagName.toLowerCase() === 'span') {
        menuItem = event.currentTarget.parentNode.parentNode;
      }

      if (menuItem.classList.contains('open')) {
        mainNav.classList.remove('child-open');
        menuItem.classList.remove('open');
      } else {
        var siblings = [].slice.call(menuItem.parentNode.children);
        siblings.forEach(function (sibling) {
          sibling.classList.remove('open');
        });
        wrapper.classList.remove('closed');
        mainNav.classList.add('child-open');

        if (menuItem.parentNode.classList.contains('main-nav')) {
          menuItem.classList.add('open');
        }
      }
    };

    menuParents.forEach(function (parent) {
      parent.addEventListener('click', openToggle);
      parent.addEventListener('keyup', openToggle);
    }); // Menu close

    subMenusClose.forEach(function (subMenu) {
      subMenu.addEventListener('click', function () {
        var menuChildsOpen = [].slice.call(mainNav.querySelectorAll('.open'));
        menuChildsOpen.forEach(function (menuChild) {
          menuChild.classList.remove('open');
        });
        mainNav.classList.remove('child-open');
      });
    }); // Accessibility

    var allLiEls = [].slice.call(sidebar.querySelectorAll('ul[role="menubar"] li'));
    allLiEls.forEach(function (liEl) {
      // We care for enter and space
      liEl.addEventListener('keyup', function (e) {
        if (e.keyCode === 32 || e.keyCode === 13) {
          e.target.querySelector('a').click();
        }
      });
    });

    if (Joomla.localStorageEnabled()) {
      if (localStorage.getItem('adminMenuState') === 'true') {
        menuClose();
      }
    }
  }
})(window.Joomla, document);