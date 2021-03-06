<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Image
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

namespace Joomla\CMS\Image\Filter;

defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Image\ImageFilter;
use Joomla\CMS\Log\Log;

Log::add('JImageFilterEdgedetect is deprecated, use Joomla\Image\Filter\Edgedetect instead.', Log::WARNING, 'deprecated');

/**
 * Image Filter class to add an edge detect effect to an image.
 *
 * @since       1.7.3
 * @deprecated  5.0  Use Joomla\Image\Filter\Edgedetect instead
 */
class Edgedetect extends ImageFilter
{
	/**
	 * Method to apply a filter to an image resource.
	 *
	 * @param   array  $options  An array of options for the filter.
	 *
	 * @return  void
	 *
	 * @since   1.7.3
	 * @deprecated  5.0  Use Joomla\Image\Filter\Edgedetect::execute() instead
	 */
	public function execute(array $options = array())
	{
		// Perform the edge detection filter.
		imagefilter($this->handle, IMG_FILTER_EDGEDETECT);
	}
}
