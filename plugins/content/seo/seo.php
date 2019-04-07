<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Content.joomla
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 *
 *
 * <!-- Open Graph -->
<meta property="og:type" content="article"/>
<meta property="og:description" content="{{ $page->getExcerpt() }}"/>
<meta property="og:title" content="{{ $page->title ?  $page->title . ' | ' : '' }}{{ $page->siteName }}"/>
<meta property="og:site_name" content="{{ $page->siteName }}"/>
<meta property="og:image" content="{{ $page->cover_image ? $page->cover_image : $page->defaultImage }}" />
<meta property="og:image:type" content="{{ $page->meta->facebook->image->type }}" />
<meta property="og:image:width" content="{{ $page->meta->facebook->image->width }}" />
<meta property="og:image:height" content="{{ $page->meta->facebook->image->height }}" />
<meta property="og:url" content="{{ $page->getUrl() }}">

<meta property="og:locale" content="{{ $page->meta->facebook->locale ? $page->meta->facebook->locale : 'en_US' }}">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="{{ $page->meta->twitter->site }}">
<meta name="twitter:title" content="{{ $page->title ?  $page->title . ' | ' : '' }}{{ $page->siteName }}">
<meta name="twitter:creator" content="{{ $page->meta->twitter->creator }}">
<meta name="twitter:description" content="{{ $page->getExcerpt() }}">
<meta name="twitter:image:src" content="{{ $page->cover_image ? $page->cover_image : $page->defaultImage }}">
<meta name="twitter:domain" content="{{ $page->meta->twitter->domain }}">

 */

defined('_JEXEC') or die;

use Joomla\CMS\Document\HtmlDocument;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Language;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Table\CoreContent;
use Joomla\CMS\User\User;
use Joomla\CMS\Workflow\Workflow;
use Joomla\CMS\Workflow\WorkflowServiceInterface;
use Joomla\Component\Content\Administrator\Table\ArticleTable;
use Joomla\Component\Messages\Administrator\Model\MessageModel;
use Joomla\Component\Workflow\Administrator\Model\StagesModel;
use Joomla\Component\Workflow\Administrator\Table\StageTable;
use Joomla\Component\Workflow\Administrator\Table\WorkflowTable;
use Joomla\Utilities\ArrayHelper;
use Joomla\Component\Config\Administrator\Helper\ConfigHelper;
/**
 * Example Content Plugin
 *
 * @since  1.6
 */
class PlgContentSeo extends CMSPlugin
{
	/**
	 * Database Driver Instance
	 *
	 * @var    \Joomla\Database\DatabaseDriver
	 * @since  4.0.0
	 */
	protected $db;

	protected $config;
	private $language;

	public function onAfterLegacyMetaGeneration($context, $document, $item): HtmlDocument
	{
		$this->config = $this->getContentConfig();
		$this->language = $this->getLanguageConfig();
		$this->ogpg = (array)$item->metadata->get('ogpg');

		$this->setTwitterCards($document, $item)
			->setFacebookOgpg($document, $item)
			->addSchemaContext($document, $item)
			->setCanonicalURL($document, $item);

		return $document;
	}

	/**
	 * @param $document
	 * @param $item
	 *
	 * @return PlgContentSeo
	 *
	 * @since version
	 */
	protected function setTwitterCards(&$document, $item): self
	{
		/**
		<!-- This site is optimized with the Yoast SEO plugin v9.7 - https://yoast.com/wordpress/plugins/seo/ -->
		<link rel="canonical" href="https://bosunski.fun" />
		 *
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:description" content="Asdas asdasd" />
		<meta name="twitter:title" content="Hello world! - Testing Ground %" />
		<meta name="twitter:site" content="@bosunski" />
		<meta name="twitter:image" content="https://w5.test/wp-content/uploads/2019/03/Screenshot-2019-03-04-at-5.28.37-PM.png" />
		<meta name="twitter:creator" content="@bosunski" />
		<script type='application/ld+json'>{"@context":"https://schema.org","@type":"Person","url":"https://w5.test/","sameAs":["https://facebook.com/bosunski","https://linkedin.com/in/bosunski","https://twitter.com/bosunski"],"@id":"#person","name":"Bosunski"}</script>
		 */
		$uri = \Joomla\CMS\Uri\Uri::base();
		$document->setMetaData('twitter:card', "summary");
		if (!empty($this->ogpg['twitter_description']))
			$document->setMetaData('twitter:description', $this->ogpg['twitter_description']);

		if (!empty($this->ogpg['twitter_title']))
			$document->setMetaData('twitter:title', $this->ogpg['twitter_title']);

		$document->setMetaData('twitter:site', $this->getTwitterHandle());

		$image = $this->ogpg['twitter_image'] ?? null;

		if (!empty($this->ogpg['twitter_image']))
			$document->setMetaData('twitter:image', $uri . $image);

		$document->setMetaData('twitter:creator', $this->getTwitterHandle());
		$document->setMetaData('twitter:domain', "$uri");

		return $this;
	}

	/**
	 * @param $document
	 * @param $item
	 *
	 * @return PlgContentSeo
	 *
	 * @since version
	 */
	protected function setFacebookOgpg(&$document, $item): self
	{
		/**
		<meta property="og:locale" content="en_US" />
		<meta property="og:type" content="article" />
		<meta property="og:title" content="Hello world! - Testing Ground %" />
		<meta property="og:description" content="Asdas asdasd" />
		<meta property="og:url" content="https://bosunski.fun" />
		<meta property="og:site_name" content="Testing Ground" />
		<meta property="article:publisher" content="https://facebook.com/bosunski" />
		<meta property="article:section" content="Uncategorized" />
		<meta property="article:published_time" content="2019-03-12T15:09:48+00:00" />
		<meta property="article:modified_time" content="2019-03-24T13:08:41+00:00" />
		<meta property="og:updated_time" content="2019-03-24T13:08:41+00:00" />
		<meta property="og:image" content="https://w5.test/wp-content/uploads/2019/03/Screenshot-2019-03-04-at-5.28.37-PM-1024x348.png" />
		<meta property="og:image:secure_url" content="https://w5.test/wp-content/uploads/2019/03/Screenshot-2019-03-04-at-5.28.37-PM-1024x348.png" />
		<meta property="og:image:width" content="1024" />
		<meta property="og:image:height" content="348" />
		 */

		$document->setMetaData('og:type', "article");
		$document->setMetaData('og:locale', $this->language->site);

		$document->setMetaData('og:title', $this->ogpg['facebook_title'] ?? $item->title);
		$document->setMetaData('og:description', $this->ogpg['og_description'] ?? $item->metadesc);
		$document->setMetaData('og:url', "https://bosunski.fun");
		$document->setMetaData('og:url', "https://bosunski.fun");
		$document->setMetaData('og:site_name', Factory::getApplication()->get('sitename'));
		$document->setMetaData('article:publisher', $this->getFacebookLink());
//		$document->setMetaData('article:section', $item->category);
		$document->setMetaData('article:published_time', $item->publish_up);
		$document->setMetaData('article:published_time', $item->modified);
		$document->setMetaData('og:updated_time', $item->modified);

		$image = $this->ogpg['og_image'] ?? null;

		$uri = \Joomla\CMS\Uri\Uri::base();

		$document->setMetaData('og:image', $uri . $image);
		$document->setMetaData('og:image:secure_url', $uri . $image);

		if ($image) {
			$document->setMetaData('og:image:height', 348);
			$document->setMetaData('og:image:width', 1024);
		}


		return $this;
	}

	protected function setCanonicalURL(HtmlDocument &$document, $item): self
	{
		if (isset($this->ogpg['canonical_url']))
			$document->setMetaData('canonical', $this->ogpg['canonical_url']);
		else
			$document->setMetaData('canonical', Route::_(''));

		return $this;
	}

	/**
	 *
	 * @return stdClass
	 *
	 * @since version
	 */
	protected function getContentConfig(): stdClass
	{
		$query = $this->db->getQuery(true);

		$query->select('params')
			->from('#__extensions')
			->where('name=' . $query->quote('com_content'));
		$this->db->setQuery($query);

		$results = $this->db->loadColumn();

		return json_decode($results[0]);
	}

	/**
	 *
	 * @return stdClass
	 *
	 * @since version
	 */
	protected function getLanguageConfig(): stdClass
	{
		$query = $this->db->getQuery(true);

		$query->select('params')
			->from('#__extensions')
			->where('name=' . $query->quote('com_languages'));
		$this->db->setQuery($query);

		$results = $this->db->loadColumn();

		return json_decode($results[0]);
	}

	/**
	 * @param HtmlDocument $document
	 *
	 * @return PlgContentSeo
	 *
	 * @since version
	 */
	protected function addSchemaContext(HtmlDocument &$document, $item): self
	{
		$document->addScriptDeclaration($this->getSchemaScript(), 'application/ld+json');

		return $this;
	}

	/**
	 *
	 * @return string
	 *
	 * @since version
	 */
	protected function getSchemaScript(): string
	{
		$host = \Joomla\CMS\Uri\Uri::base();

		$aliases = [];

		if ($fbLink = $this->getFacebookLink()) {
			$aliases[] = $fbLink;
		}

		if ($handle = $this->getTwitterHandle()) {
			$aliases[] = "https://twitter.com/" . str_replace("@", '', $handle);
		}

		$jsonLD = [];

		$jsonLD['@context'] = 'https://schema.org';
		$jsonLD['@type'] = $this->config->site_type ?? '';
		$jsonLD['@url'] = $host;
		$jsonLD['sameAs'] = $aliases;
		$jsonLD['@id'] = "#person";
		$jsonLD['@name'] = $this->config->owner_name ?? Factory::getApplication()->get('sitename') ?? '';

		return json_encode($jsonLD);
	}

	/**
	 *
	 * @return string
	 *
	 * @since version
	 */
	private function getTwitterHandle()
	{
		return isset($this->config->twitter_handle) ? "@" . $this->config->twitter_handle : null;
	}

	/**
	 *
	 * @return string
	 *
	 * @since version
	 */
	private function getFacebookLink()
	{
		return $this->config->facebook ?? null;
	}
}
