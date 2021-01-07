<?php
/**
 * The template for displaying type taxonomy
 *
 * @package ode
 */
get_header();
$term = get_queried_object();?>

<!--HERO-->

<?php get_template_part("template-parts/carousel-hero"); ?>

<div class="container cols-offset3-18">
<div class="col">

<div class="pt10">
    <h3><?php echo $term->name;?></h3>      
    <p>Description: <?php echo term_description($term_id, $term);?></p>
    <?php $banner = get_field('banner_image', $term);?>
    <img src="<?php echo $banner['url'];?>"/>

</div>

<?php
    $args = array(
        'post_type' => 'itineraries',
        'tax_query' => array(
        'relation' => 'AND',
            array(
                'taxonomy' => 'type',
                'field' => 'slug',
                'terms' => array( $term->slug )
            ),
        )
    );
    $query = new WP_Query( $args );

    if ( $query->have_posts() ): while ( $query->have_posts() ):
    $query->the_post();

       the_title();
       the_field('cost');
       echo ' Nights:';
       the_field('number_of_nights');
       the_field('short_description');
       if( have_rows('daily_activity') ): while( have_rows('daily_activity') ): the_row();
       $dailycamp = get_sub_field('daily_camp');
       echo $dailycamp->post_title;
       endwhile; endif;


    endwhile; endif;

?>

<?php get_footer();?>
