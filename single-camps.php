<?php
/**
 * ============== Camp Page
 *
 * @package oke
 */
get_header();
while ( have_posts() ): the_post(); ?>

<!--HERO-->
<?php get_template_part("template-parts/carousel-hero"); ?>
<div class="outer-wrapper">
    <?php get_template_part("template-parts/floating-heading"); ?>
    <div class="container pr1 pl1 cols-14-10 cols-md-24">

        <div class="col pr3 pr0-mob">
            <div class="description camp truncate">
                <!--removed pl2-->
                <?php the_field('short_description');?>
                <?php the_field('description');?>
            </div>
            <!--======= Gallery=====-->
            <?php if( get_field('gallery') ): ?>
            <h4 class="heading heading__md heading__caps mt2">Gallery</h4>
            <div id="gallery" class="gallery mt1 mb5">

                <?php $images = get_field('gallery');
    				    if( $images ):
                        foreach( $images as $image ): $url = $image['url']; ?>
                <a href="<?php echo $image['url']; ?>" title="<?php echo $image['caption']; ?>"
                    style='background-image: url(<?php echo $url; ?>)'></a>
                <?php endforeach;
                    endif; ?>
                <button class="button button__standard button__standard--fixed-width" onclick="loadMore()">Load
                    more images</button>
            </div>

            <script>
            function loadMore() {
                var element = document.getElementById("gallery");
                element.classList.toggle("more");
            }
            </script>
            <?php endif; ?>
            <!--=========== MAP =============-->
            <?php if( have_rows('map_marker') ):
            while ( have_rows('map_marker') ) : the_row();
            $markerPositionVert = get_sub_field('distance_from_top');
            $markerPositionHoriz = get_sub_field('distance_from_left');
            if (get_sub_field('distance_from_top')) {?>


            <div class="itinerary-map">
                <h4 class="heading heading__md heading__caps mt2 mb1"> <?php the_title(); ?> On The Map</h4>
                <div class="map-outer-wrapper">

                    <div class="camp-map">
                        <div class="positioning-wrapper">
                            <img src="<?php echo get_template_directory_uri(); ?>/inc/img/master-mapv1.jpg" />
                            <!-- <div id="wipe" class="wipe"></div> -->
                            <?php get_template_part('template-parts/water-overlayv1');?>

                            <div id="Container" class="marker-wrapper">

                                <?php $mapImage = get_field('banner_image');
            					//Show cost as class
            					$safaricost = get_field('cost');
            					if ($safaricost < '1000'){
            					$safaricost = "low";
            					} elseif ($safaricost > '1000' && $safaricost < '2000'){
            					$safaricost = "medium";
            					} elseif ($safaricost > '2000'){
            					$safaricost = "high";
            					}
            					//Get focus as slug for class
            					$focus = get_the_terms($post->ID,'focus');
            					$focusslug = $focus[0];?>

                                <div class="marker mix <?php echo $focusslug->slug;?> <?php echo $safaricost;?>"
                                    style="top:<?php the_sub_field('distance_from_top');?>.000001%; left: <?php the_sub_field('distance_from_left');?>.000001%;">
                                    <div
                                        class="camp-map__card <?php if ( $markerPositionVert < 35 ) {echo 'high';};?> <?php if ( $markerPositionHoriz < 10 ) {echo 'left';};?> <?php if ( $markerPositionHoriz > 89 ) {echo 'right';};?>">
                                        <div class="inner">
                                            <?php echo $markerHigh;?>
                                            <div class="image"
                                                style="background-image: url(<?php echo $mapImage['url']; ?>);">
                                            </div>
                                            <h2 class="heading heading__sm"><?php the_title();?></h2>
                                        </div>
                                    </div>
                                    <!--card-->
                                </div>
                                <!--marker-->

                            </div>
                            <!--marker-wrapper-->
                        </div>
                        <!--posn-wrapper-->
                    </div>
                    <!--camp-map-->
                    <?php get_template_part('template-parts/map-features');?>
                </div>
            </div>
            <!--outer-wrapper-->
            <?php } endwhile; endif;?>
            <!--=========== FULL DESCRIPTION =============-->
            <?php get_template_part("template-parts/book-cta"); ?>

            <?php if( get_field('combines_well_with') ): ?>
            <h4 class="heading heading__md heading__caps mt2 mb1">Combines Well With</h4>
            <?php endif;?>

            <?php $post_objects = get_field('combines_well_with');

        if( $post_objects ): ?>
            <div class="container grid-gap equal-height cols-12 cols-sm-24 mb5">
                <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                <?php setup_postdata($post);

                $campImage = get_field('banner_image'); ?>
                <div class="col">
                    <div class="listing-item">
                        <div class="image" style="background:url(<?php echo $campImage['url']; ?>);">
                            <a href="<?php the_permalink(); ?>"></a>
                        </div>
                        <div class="item icons">
                            <div class="price-icon"><i class="fas fa-credit-card"></i></div>
                            <div class="price-text">From $<?php the_field('cost');?> per person</div> 
                        </div>
                        <div class="item icons">
                            <div class="place-icon"><i class="fas fa-map-marker-alt"></i></div>
                            <div class="place-text"><?php the_terms( $post->ID, 'destinations'); ?></div>
                        </div>

                        <div class="item">
                            <h3 class="heading"><?php the_title(); ?></h3><?php the_field('short_description');?>
                        </div>
                        <a href="<?php the_permalink(); ?>">Learn More</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php wp_reset_postdata();?>
            <?php endif;?>
        </div>
        <div class="col">
            <div class="sidebar mb5 mb0-mob">
                <?php $custom_terms = wp_get_post_terms($post->ID, 'company');?>
                <h2 class="heading heading__md heading__light heading__caps align-center">
                    <i class="fas fa-info info-panel"></i>
                    <?php the_title();?>
                </h2>
                <div class="detail-wrapper">
                    <ul>
                        <li><span class="title">Location</span>
                            <span class="detail container">
                                <div class="col">
                                    <?php the_terms( $post->ID, 'destinations', '<div>','', '</div>'); ?>
                                </div>
                            </span>
                        </li>
                        <li><span class="title">Rooms</span><span class="detail container">
                                <div class="col">
                                    <?php the_field('number_of_rooms');?>
                                </div>
                            </span>
                        </li>
                        <li><span class="title">Cost</span>
                            <span class="detail container">
                                <div class="col">
                                    From $<?php the_field('cost');?> per person
                                </div>
                            </span>
                        </li>
                        <li><span class="title">Activities</span><span class="detail activities">
                                <ul>
                                    <?php $terms = get_the_terms( $post->ID, 'activity' );
        if ($terms) {
            foreach($terms as $term) {
                $activityIcon = get_field('icon', $term)['url'];?>
                                    <li class="container cols-4-20">
                                        <div class="col pr1"><img src="<?php echo $activityIcon;?>" /></div>
                                        <div class="col"><?php echo $term->name;?></div>
                                    </li>
                                    <?php }
    }?>
                                </ul>

                            </span></li>
                        <li><span class="title">Child Policy</span><span class="detail container">
                                <div class="col">
                                    <?php the_field('child_policy');?>
                                </div>
                            </span>
                        </li>
                        <li><span class="title">Parent Company</span>
                            <span class="detail container">
                                <div class="col">
                                    <?php the_terms( $post->ID, 'company'); ?>
                                </div>
                            </span>
                        </li>




                    </ul>
                </div>

                <?php $current_id = get_the_ID();
// filter to allow query of acf sub field
function my_posts_where( $where ) {
	$where = str_replace("meta_key = 'daily_activity_$", "meta_key LIKE 'daily_activity_%", $where);
	return $where;
}
add_filter('posts_where', 'my_posts_where');
$args = array(
	'numberposts'	=> -1,
	'post_type'		=> 'itineraries',
	'meta_query'	=> array(
		'relation'		=> 'OR',
		array(
			'key'		=> 'daily_activity_$_daily_camp',
			'compare'	=> '=',
			'value'		=> $current_id,
		),
	)
);
$the_query = new WP_Query( $args );?>
                <?php if( $the_query->have_posts() ):?>
                <h4 class="heading heading__xs heading__light heading__caps mb1">Safaris Featuring This Property:</h4>
                <?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>

                <div class="safari-summary">
                    <?php $safariImage = get_field('banner_image');?>
                    <div class="image" style="background:url(<?php echo $safariImage['url']; ?>);">
                        <a href="<?php the_permalink(); ?>"></a>
                        <h2 class="heading heading__sm heading__light"><?php the_title(); ?></h2>
                    </div>
                    <div class="meta">
                        <div class="nights"><i class="fas fa-moon"></i><?php the_field('number_of_nights'); ?> Nights
                        </div>
                        <div class="cost"><i class="fas fa-credit-card"></i>From $<?php the_field('cost'); ?></div>
                    </div>
                    <!--meta-->
                    <!--<div class="safari-summary">
                        <?php $safari_id = get_the_ID();
                        if( get_field('daily_activity', $safari_id) ) { while(has_sub_field('daily_activity', $safari_id)) {
                            $post_objects = get_sub_field('daily_camp', $safari_id);
                            if( $post_objects ):
                                $post = $post_objects;
                                setup_postdata( $post ); ?>
                                <div class="camps__item"><?php the_title(); ?></div>
                            <?php endif; }} ?>
                    </div>-->
                    <a href="<?php the_permalink($safari_id); ?>" class="button">View Safari</a>
                </div>
                <?php endwhile; endif;
	            wp_reset_query();?>
            </div>
        </div>
    </div>
</div>

<?php endwhile;?>
</div>
<!--outer wrapper-->
<?php get_footer();?>
