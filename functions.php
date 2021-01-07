<?php
/**
 * oke functions and definitions
 *
 * @package oke
 */

/****************************************************/
/*                       Hooks                       /
/****************************************************/

/* Enqueue scripts and styles */
add_action('wp_enqueue_scripts', 'oke_scripts');

/* Add Menus */
add_action('init', 'oke_custom_menu');

/* Dashboard Config */
add_action('wp_dashboard_setup', 'oke_dashboard_widget');

/* Dashboard Style */
add_action('admin_head', 'oke_custom_fonts');

/* Remove Default Menu Items */
add_action('admin_menu', 'oke_remove_menus');

/* Change Posts Columns */
add_filter('manage_posts_columns', 'oke_manage_columns');

/* Reorder Admin Menu */
add_filter('custom_menu_order', 'oke_reorder_menu');
add_filter('menu_order', 'oke_reorder_menu');

/* Remove Comments Link */
add_action('wp_before_admin_bar_render', 'oke_manage_admin_bar');


/****************************************************/
/*                     Functions                     /
/****************************************************/


//ADDED MICROTIME VERSION NUMBER FOR DEV --- REMOVE FOR LIVE
function oke_scripts() {
	wp_enqueue_style( 'oke-style', get_template_directory_uri() . '/style.css', array(), filemtime(get_template_directory() . '/style.css'), false);
	wp_enqueue_script( 'oke-core-js', get_template_directory_uri() . '/inc/js/compiled.js', array('jquery'), 1.1, true);
}

function oke_custom_menu() {
	register_nav_menus(array(
		'main-menu' => __( 'Main Menu' )
	));

	register_nav_menus(array(
		'secondary-menu' => __( 'Secondary Menu' )
	));

	register_nav_menus(array(
		'travel-advice-menu' => __( 'Travel Advice Menu' )
	));
	register_nav_menus(array(
		'footer-menu' => __( 'Footer Menu' )
	));
	register_nav_menus(array(
		'wildlife-menu' => __( 'Wildlife Menu' )
	));
}

function oke_dashboard_widget() {
	global $wp_meta_boxes;
	wp_add_dashboard_widget('custom_help_widget', 'Technical Support', 'oke_dashboard_help');
}

function oke_dashboard_help() {
	echo file_get_contents(__DIR__ . "/admin-settings/dashboard.html");
}

function oke_custom_fonts() {
	echo '<style type="text/css">' . file_get_contents(__DIR__ . "/admin-settings/style-admin.css") . '</style>';
}

// Enter custom JS TO ADMIN AREA
add_action( 'admin_print_scripts-post-new.php', 'banner_admin_script', 11 );
add_action( 'admin_print_scripts-post.php', 'banner_admin_script', 11 );

function banner_admin_script() {
    global $post_type;
    if ( $post_type == 'camps' )
        wp_enqueue_script( 'camps-script', get_template_directory_uri().'/admin-settings/admin.js', '', '', true ); // "TRUE" - ADDS JS TO FOOTER
}

if(function_exists('acf_add_options_page')) {
	acf_add_options_page(array(
		'page_title' 	=> 'Theme Settings',
		'menu_title'	=> 'Theme Settings',
		'menu_slug' 	=> 'site-general-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	acf_add_options_page(array(
		'page_title' 	=> 'Site-Wide CTA',
		'menu_title'	=> 'Site-Wide CTA',
		'menu_slug' 	=> 'site-wide-cta',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	acf_add_options_page(array(
		'page_title' 	=> 'Testimonials',
		'menu_title'	=> 'Testimonials',
		'menu_slug' 	=> 'testimonials',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	acf_add_options_page(array(
		'page_title' 	=> 'Sidebars',
		'menu_title'	=> 'Sidebars',
		'menu_slug' 	=> 'Sidebars',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
}

function oke_remove_menus(){
	remove_menu_page( 'edit-comments.php' ); //Comments
}

function oke_manage_columns($columns) {
	unset($columns["comments"]);
	return $columns;
}

function oke_reorder_menu() {
    return array(
		'index.php',                        // Dashboard
		'separator1',                       // --Space--
		'edit.php',                         // Posts
		'edit.php?post_type=page',          // Pages
		'upload.php',                       // Media
		'separator2',                       // --Space--
		'themes.php',                       // Appearance
		'plugins.php',                      // Plugins
		'users.php',                        // Users
		'tools.php',                        // Tools
		'options-general.php',              // Settings
		'wpcf7',                            // Contact Form 7
   );
}

function oke_manage_admin_bar(){
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu('comments');
}

/**= Add Custom Post Types and Taxonomies =**/

require_once ('custom-taxonomies.php');
require_once ('custom-post-types.php');

/* ADD CUSTOM RESPONSIVE IMAGE SIZES
================================================== */

function aw_custom_responsive_image_sizes($sizes, $size) {
  $width = $size[0];
  // blog posts
  if ( is_singular( 'post' ) ) {
    // half width images - medium size
    if ( $width === 600 ) {
      return '(min-width: 768px) 322px, (min-width: 576px) 255px, calc( (100vw - 30px) / 2)';
    }
    // full width images - large size
    if ( $width === 1024 ) {
      return '(min-width: 768px) 642px, (min-width: 576px) 510px, calc(100vw - 30px)';
    }
    // default to return if condition is not met
    return '(max-width: ' . $width . 'px) 100vw, ' . $width . 'px';
  }
  // default to return if condition is not met
  return '(max-width: ' . $width . 'px) 100vw, ' . $width . 'px';
}
add_filter('wp_calculate_image_sizes', 'aw_custom_responsive_image_sizes', 10 , 2);

 function manage_my_category_columns($columns)
{
 // only edit the columns on the current taxonomy
 if ( !isset($_GET['taxonomy']) || $_GET['taxonomy'] != 'category' )
 return $columns;

 // unset the description columns
 if ( $posts = $columns['description'] ){ unset($columns['description']); }

 return $columns;
}
add_filter('manage_edit-category_columns','manage_my_category_columns');

function is_post_type($type){
    global $wp_query;
    if($type == get_post_type($wp_query->post->ID))
        return true;
    return false;
}


/*
 * Add columns to itineraries post list
 */
function add_acf_columns ( $columns ) {
	return array_merge ( $columns, array (
	  'featured' => __ ( 'Featured' ),
	) );
  }
  add_filter ( 'manage_itineraries_posts_columns', 'add_acf_columns' );
 /*
 * Add columns to itinerary post list
 */
function itineraries_custom_column ( $column, $post_id ) {
	switch ( $column ) {
	  case 'featured':
		$featured = get_post_meta ( $post_id, 'featured', true );
		if ($featured == '1'){$featured = "<strong>Yes</strong>";}
		elseif ($featured == '0') {
			$featured = "No";}
		echo $featured;
		break;
	}
  }
  add_action ( 'manage_itineraries_posts_custom_column', 'itineraries_custom_column', 10, 2 );