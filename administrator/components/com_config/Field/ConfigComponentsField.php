<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_config
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Config\Administrator\Field;

defined('JPATH_BASE') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Language\Text;
use Joomla\Utilities\ArrayHelper;

\JFormHelper::loadFieldClass('List');

/**
 * Text Filters form field.
 *
 * @since  3.7.0
 */
class ConfigComponentsField extends \JFormFieldList
{
	/**
	 * The form field type.
	 *
	 * @var		string
	 * @since	3.7.0
	 */
	public $type = 'ConfigComponents';

	/**
	 * Method to get a list of options for a list input.
	 *
	 * @return	array  An array of JHtml options.
	 *
	 * @since   3.7.0
	 */
	protected function getOptions()
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true)
			->select('name AS text, element AS value')
			->from('#__extensions')
			->where('enabled >= 1')
			->where('type =' . $db->quote('component'));

		$items = $db->setQuery($query)->loadObjectList();

		if ($items)
		{
			$lang = Factory::getLanguage();

			foreach ($items as &$item)
			{
				// Load language
				$extension = $item->value;

				if (File::exists(JPATH_ADMINISTRATOR . '/components/' . $extension . '/config.xml'))
				{
					$source = JPATH_ADMINISTRATOR . '/components/' . $extension;
					$lang->load("$extension.sys", JPATH_ADMINISTRATOR, null, false, true)
					|| $lang->load("$extension.sys", $source, null, false, true);

					// Translate component name
					$item->text = Text::_($item->text);
				}
				else
				{
					$item = null;
				}
			}

			// Sort by component name
			$items = ArrayHelper::sortObjects(array_filter($items), 'text', 1, true, true);
		}

		// Merge any additional options in the XML definition.
		$options = array_merge(parent::getOptions(), $items);

		return $options;
	}
}
