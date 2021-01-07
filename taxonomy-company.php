<?php
/**
 * The template for displaying COMPANY taxonomy
 *
 * @package ode
 */
get_header();
$term = get_queried_object();?>

<!--HERO-->
<?php get_template_part("template-parts/company-hero"); ?>
<!--BODY-->
<div class="container pr1 pl1 cols-14">
    <div class="col mb2">
        <h2 class="heading heading__md heading__caps mt2 mb2"><?php echo $term->name;?> Camps In the Okavango Delta</h2>

        <div id="moretext" class="description safari mb1 truncate">
            <?php the_field('description', $term);?>
        </div>

    </div>
</div>
<div class="container pr1 pl1 cols-24">

    <div class="col">
        <div class="camp-summary full-width mb5">
            <?php
                $args = array(
                    'post_type' => 'camps',
                    'tax_query' => array(
                    'relation' => 'AND',
                        array(
                            'taxonomy' => 'company',
                            'field' => 'slug',
                            'terms' => array( $term->slug )
                        ),
                    )
                );
                $query = new WP_Query( $args );

                if ( $query->have_posts() ): while ( $query->have_posts() ):
                $query->the_post();
                $campImage = get_field('banner_image');?>
            <div class="safari-options camp-summary__item">
                <div class="container cols-10-14">

                    <div class="col">
                        <div class="image" style="background:url(<?php echo $campImage['url']; ?>);">
                            <a href="<?php the_permalink(); ?>"></a>
                        </div>
                    </div>
                    <div class="col">

                        <div class="meta">
                            <div class="item"><i class="fas fa-credit-card"></i> From $<?php the_field('cost');?> per person
                            </div>
                            <div class="item"><i
                                    class="fas fa-map-marker-alt"></i><?php the_terms( $post->ID, 'destinations'); ?>
                            </div>
                        </div>


                        <div class="description">
                            <h2 class="heading heading__md"><?php the_title(); ?></h2>
                            <?php the_field('short_description');?>
                        </div>

                        <div class="container cols">
                            <div class="col">
                                <a href="<?php the_permalink(); ?>" class="button">View <?php the_title(); ?></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <?php endwhile; endif;?>

        </div>
    </div>
</div>

<!-- ******************* Map Component ******************* -->
<div class="container pl1 pr1 cols-14">
    <div class="col map">
        <h4 class="heading heading__md heading__caps mt2 mb2"><?php echo $term->name;?> Locations</h4>
        <div class="itinerary-map">
            <div class="map-outer-wrapper">
                <div class="camp-map">
                    <div class="positioning-wrapper">
                        <img src="<?php echo get_template_directory_uri(); ?>/inc/img/master-mapv1.jpg" />
                        <?php get_template_part('template-parts/water-overlayv1');?>

                        <div id="Container" class="marker-wrapper">
                            <?php if ( $query->have_posts() ): while ( $query->have_posts() ):
                        $query->the_post();
    					$mapImage = get_field('banner_image');?>

                            <?php if( have_rows('map_marker') ):
    					while ( have_rows('map_marker') ) : the_row();
    					$markerPositionVert = get_sub_field('distance_from_top');
    					$markerPositionHoriz = get_sub_field('distance_from_left');?>
                        <?php if (get_sub_field('distance_from_top')) {?>
                            <div class="marker mix"
                                style="top:<?php the_sub_field('distance_from_top', $term);?>.000001%; left: <?php the_sub_field('distance_from_left', $term);?>.000001%;">
                                <div
                                    class="camp-map__card <?php if ( $markerPositionVert < 35 ) {echo 'high';};?> <?php if ( $markerPositionHoriz < 10 ) {echo 'left';};?> <?php if ( $markerPositionHoriz > 89 ) {echo 'right';};?>">
                                    <div class="inner">
                                        <?php echo $markerHigh;?>
                                        <div class="image"
                                            style="background-image: url(<?php echo $mapImage['url']; ?>);"></div>
                                        <h2 class="heading heading__sm"><?php the_title();?></h2>
                                        <div class="meta">
                                            <span>Family Safari</span>
                                            <span><i class="fas fa-credit-card"></i>From
                                                $<?php the_field('cost'); ?></span>
                                        </div>
                                        <a href="<?php the_permalink();?>">Learn more</a>
                                    </div>
                                </div>
                                <!--card-->
                            </div>
                            <!--marker-->
                            <?php }
                        endwhile; endif;?>
                            <?php wp_reset_postdata();
    				endwhile; endif;?>
                        </div>
                        <!--marker-wrapper-->
                    </div>
                    <!--posn-wrapper-->
                </div>
                <!--camp-map-->
                <?php get_template_part('template-parts/map-features');?>
            </div>
            <!--outer-wrapper-->
        </div>
    </div>
</div><?php wp_reset_query();?>
<!-- ******************* Itineraries ******************* -->
<?php
$tax_slug = $term->slug;
$args = array(
    'post_type' => 'itineraries',
    'posts_per_page' => -1,
    'order' => 'DESC',
    'tax_query' => array(
        'relation' => 'AND',
        array(
            'taxonomy' => 'company',
            'field' => 'slug',
            'terms' => $tax_slug
        )
     ),

);
$the_query = new WP_Query( $args );?>
<?php if( $the_query->have_posts() ):;?>
<div class="container cols-24">
    <div class="col">
        <h4 class="heading heading__md heading__caps align-center mt2 mb2">Safaris Featuring <?php echo $term->name;?></h4>
        <div class="camp-summary full-width">

                <?php $i=1;//Add increment to allow camp IDs to be unqiue within itineraries
                while ( $the_query->have_posts() ) : $the_query->the_post(); ?>

                <div class="safari-options">
                    <div class="container cols-10-14">
                        <div class="col">
                            <?php $safariImage = get_field('banner_image');?>
                            <div class="image" style="background:url(<?php echo $safariImage['url']; ?>);"></div>
                        </div>
                        <div class="col">
                            <div class="meta">
                                <div class="item"><i class="fas fa-moon"></i><?php the_field('number_of_nights');?> Nights
                                </div>
                                <div class="item"><i class="fas fa-credit-card"></i>From $<?php the_field('cost');?></div>
                            </div>
                            <div class="description">
                                <h2 class="heading heading__md"><?php the_title(); ?></h2>
                                <?php the_field('short_description',  $safari_id);?>
                            </div>
                            <div class="safari-includes">
                                <span class="title col">Includes</span>
                                <?php $safari_id = get_the_ID();
                                if( get_field('daily_activity', $safari_id) ) { while(has_sub_field('daily_activity', $safari_id)) {
                                $post_objects = get_sub_field('daily_camp', $safari_id);
                                if( $post_objects ):
                                $post = $post_objects;
                                setup_postdata( $post );?>
                                <a href="<?php the_permalink(); ?>" class="location-repeater" data-destination="safari- <?=$post_objects->ID;?>-<?=$i;?>">
                                    <?php the_title(); ?><span>, </span>
                                </a>
                                <?php
                                endif; }
                                $i++;
                                } ?>
                            </div>
                            <a href="<?php the_permalink($safari_id); ?>" class="button">Learn More</a>
                        </div>
                    </div>
                </div>

            <?php endwhile; endif; wp_reset_query();?>

        </div><!--camp-summary-->
    </div>
</div>

<?php get_footer();?>
