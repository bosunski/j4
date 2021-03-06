<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_installer
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

HTMLHelper::_('behavior.multiselect');

$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));
?>
<div id="installer-manage" class="clearfix">
	<form action="<?php echo Route::_('index.php?option=com_installer&view=manage'); ?>" method="post" name="adminForm" id="adminForm">
		<div class="row">
			<div id="j-sidebar-container" class="col-md-2">
				<?php echo $this->sidebar; ?>
			</div>
			<div class="col-md-10">
				<div id="j-main-container" class="j-main-container">
					<?php if ($this->showMessage) : ?>
						<?php echo $this->loadTemplate('message'); ?>
					<?php endif; ?>
					<?php if ($this->ftp) : ?>
						<?php echo $this->loadTemplate('ftp'); ?>
					<?php endif; ?>
					<?php echo LayoutHelper::render('joomla.searchtools.default', array('view' => $this)); ?>
					<?php if (empty($this->items)) : ?>
						<div class="alert alert-warning">
							<?php echo JText::_('COM_INSTALLER_MSG_MANAGE_NOEXTENSION'); ?>
						</div>
					<?php else : ?>
					<table class="table" id="manageList">
						<caption id="captionTable" class="sr-only">
							<?php echo Text::_('COM_INSTALLER_MANAGE_TABLE_CAPTION'); ?>, <?php echo Text::_('JGLOBAL_SORTED_BY'); ?>
						</caption>
						<thead>
							<tr>
								<td style="width:1%" class="text-center">
									<?php echo HTMLHelper::_('grid.checkall'); ?>
								</td>
								<th scope="col" style="width:1%" class="text-center">
									<?php echo HTMLHelper::_('searchtools.sort', 'JSTATUS', 'status', $listDirn, $listOrder); ?>
								</th>
								<th scope="col">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_NAME', 'name', $listDirn, $listOrder); ?>
								</th>
								<th scope="col" style="width:10%">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_LOCATION', 'client_translated', $listDirn, $listOrder); ?>
								</th>
								<th scope="col" style="width:10%">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_TYPE', 'type_translated', $listDirn, $listOrder); ?>
								</th>
								<th scope="col" style="width:10%" class="d-none d-md-table-cell">
									<?php echo Text::_('JVERSION'); ?>
								</th>
								<th scope="col" style="width:10%" class="d-none d-md-table-cell">
									<?php echo Text::_('JDATE'); ?>
								</th>
								<th scope="col" style="width:10%" class="d-none d-md-table-cell">
									<?php echo Text::_('JAUTHOR'); ?>
								</th>
								<th scope="col" style="width:5%" class="d-none d-md-table-cell">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_FOLDER', 'folder_translated', $listDirn, $listOrder); ?>
								</th>
								<th scope="col" class="d-none d-md-table-cell">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_PACKAGE_ID', 'package_id', $listDirn, $listOrder); ?>
								</th>
								<th scope="col" style="width:1%" class="d-none d-md-table-cell">
									<?php echo HTMLHelper::_('searchtools.sort', 'COM_INSTALLER_HEADING_ID', 'extension_id', $listDirn, $listOrder); ?>
								</th>
							</tr>
						</thead>
						<tbody>
						<?php foreach ($this->items as $i => $item) : ?>
							<tr class="row<?php echo $i % 2; if ($item->status == 2) echo ' protected'; ?>">
								<td class="text-center">
									<?php echo HTMLHelper::_('grid.id', $i, $item->extension_id); ?>
								</td>
								<td class="text-center">
									<?php if (!$item->element) : ?>
									<strong>X</strong>
									<?php else : ?>
										<?php echo HTMLHelper::_('manage.state', $item->status, $i, $item->status < 2, 'cb'); ?>
									<?php endif; ?>
								</td>
								<th scope="row">
									<label for="cb<?php echo $i; ?>">
										<span class="bold hasTooltip" title="<?php echo HTMLHelper::_('tooltipText', $item->name, $item->description, 0); ?>">
											<?php echo $item->name; ?>
										</span>
									</label>
								</th>
								<td>
									<?php echo $item->client_translated; ?>
								</td>
								<td>
									<?php echo $item->type_translated; ?>
								</td>
								<td class="d-none d-md-table-cell">
									<?php echo @$item->version != '' ? $item->version : '&#160;'; ?>
								</td>
								<td class="d-none d-md-table-cell">
									<?php echo @$item->creationDate != '' ? $item->creationDate : '&#160;'; ?>
								</td>
								<td class="d-none d-md-table-cell">
									<span class="editlinktip hasTooltip" title="<?php echo HTMLHelper::_('tooltipText', Text::_('COM_INSTALLER_AUTHOR_INFORMATION'), $item->author_info, 0); ?>">
										<?php echo @$item->author != '' ? $item->author : '&#160;'; ?>
									</span>
								</td>
								<td class="d-none d-md-table-cell">
									<?php echo $item->folder_translated; ?>
								</td>
								<td class="d-none d-md-table-cell">
									<?php echo $item->package_id ?: '&#160;'; ?>
								</td>
								<td class="d-none d-md-table-cell">
									<?php echo $item->extension_id; ?>
								</td>
							</tr>
						<?php endforeach; ?>
						</tbody>
					</table>

					<?php // load the pagination. ?>
					<?php echo $this->pagination->getListFooter(); ?>

					<?php endif; ?>
					<input type="hidden" name="task" value="">
					<input type="hidden" name="boxchecked" value="0">
					<?php echo HTMLHelper::_('form.token'); ?>
				</div>
			</div>
		</div>
	</form>
</div>
