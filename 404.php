<?php
/**
 * The template for displaying 404 pages
 *
 * @package oke
 */

get_header();
?>
<?php $errorBG = get_field("not_found_background_image", 'options');?>
<div class="fullscreen-panel" style="background:url(<?php echo $errorBG['url']; ?>);">
	<div>
		<h1 class="heading heading__xl">Sorry, it looks like we're a touch lost</h1>
		<p>Try returning <a href="<?php echo get_home_url(); ?>">home</a>, or <span class="search-trigger">searching</span> for a different page.</p>
	</div>
</div>
<?php
get_footer();
