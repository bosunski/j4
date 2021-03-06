<?php
/**
 * Joomla! Content Management System
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Router;

defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Uri\Uri;

/**
 * Class to create and parse routes
 *
 * @since  1.5
 */
class AdministratorRouter extends Router
{
	/**
	 * Function to convert a route to an internal URI.
	 *
	 * @param   Uri   &$uri     The uri.
	 * @param   bool  $setVars  Set the parsed data in the internal
	 *                          storage for current-request-URLs
	 *
	 * @return  array
	 *
	 * @since   1.5
	 */
	public function parse(&$uri, $setVars = false)
	{
		return array();
	}

	/**
	 * Function to convert an internal URI to a route
	 *
	 * @param   string  $url  The internal URL
	 *
	 * @return  string  The absolute search engine friendly URL
	 *
	 * @since   1.5
	 */
	public function build($url)
	{
		// Create the URI object
		$uri = parent::build($url);

		// Get the path data
		$route = $uri->getPath();

		// Add basepath to the uri
		$uri->setPath(Uri::base(true) . '/' . $route);

		return $uri;
	}
}
