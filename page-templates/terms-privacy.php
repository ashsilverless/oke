<?php
/**
 * ============== Template Name: Terms and Privacy
 *
 * @package oke
 */
get_header();?>

<!-- ******************* Hero Content ******************* -->

<?php get_template_part("template-parts/hero"); ?>

<!-- ******************* Hero Content END ******************* -->

<div class="container">
	
	<h1 class="heading heading__lg slow-fade mt2"><?php the_field("hero_heading"); ?></h1>
	
	<div class="wrapper-content">
		
		<div class="copy"><?php the_field("content"); ?></div>
	
	</div>

</div>

<?php get_footer();?>
