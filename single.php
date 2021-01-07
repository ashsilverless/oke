<?php
/**
 * The template for displaying all single posts
 *
 * @package oke
 */
get_header();
if (have_posts()) : while (have_posts()) : the_post();
$heroImage = get_field('banner_image'); ?>

<!-- ******************* Hero Content ******************* -->

<div class="hero left-hero lower-grad h75" style="background-image: url(<?php echo $heroImage; ?>);">
    <div class="container pr1 pl1 cols-24 left-hero__container">
        <div class="col pb5">

            <h1 class="heading heading__lg heading__caps heading__light slow-fade mb0"><?php the_title();  ?>
            </h1>

        </div>
    </div>
</div>
<!--hero standard-->

<!-- ******************* Hero Content END ******************* -->

<div class="container cols-14-10 cols-md-24 pr1 pl1 mt3">
    <div class="col pr3 mb3 pr0-mob">
        <div class="description camp mb3">
            <?php the_content(); ?>
        </div>
        <div class="post-links">
            <div>
                <?php $next_post = get_adjacent_post(false, '', true);
				if(!empty($next_post)) {
				echo '<a href="' . get_permalink($next_post->ID) . '" title="' . $next_post->post_title . '"> <i class="fas fa-angle-left"></i>' . $next_post->post_title . '</a>'; }?>
            </div>
            <div>
                <?php $next_post = get_adjacent_post(false, '', false);
				if(!empty($next_post)) {
				echo '<a href="' . get_permalink($next_post->ID) . '" title="' . $next_post->post_title . '"> ' . $next_post->post_title . '<i class="fas fa-angle-right"></i></a>'; }?>
            </div>
        </div>
    </div>
    <div class="col mt1">
        <h2 class="heading heading__md mb1">Featured Itineraries</h2>
        <?php 
        $args = array(
            'numberposts'    => -1,
            'post_type'        => 'itineraries',
            'meta_key'        => 'featured',
            'meta_value'    => '1'
        );
        $the_query = new WP_Query( $args );?>
        <?php if( $the_query->have_posts() ): ?>
            <?php while( $the_query->have_posts() ) : $the_query->the_post(); ?>
                <div class="safari-summary">
                    <?php $safariImage = get_field('banner_image');?>
                    <div class="image" style="background:url(<?php echo $safariImage['url']; ?>);">
                        <a href="<?php the_permalink($safari_id); ?>"></a>
                        <h2 class="heading heading__sm heading__light"><?php the_title(); ?></h2>
                    </div>
                    <div class="meta">
                        <div class="nights"><i class="fas fa-moon"></i><?php the_field('number_of_nights'); ?> Nights
                        </div>
                        <div class="cost"><i class="fas fa-credit-card"></i>From $<?php the_field('cost'); ?></div>
                    </div><!--meta-->
                    <!--<div class="safari-summary">
                        <?php $safari_id = get_the_ID();
                        if( get_field('daily_activity', $safari_id) ) { while(has_sub_field('daily_activity', $safari_id)) {
                            $post_objects = get_sub_field('daily_camp', $safari_id);
                            if( $post_objects ):
                                $post = $post_objects;
                                setup_postdata( $post ); ?>
                                <div class="camps__item"><?php the_title(); ?></div>
                            <?php wp_reset_postdata();
                        endif; }} ?>
                    </div>-->
                    <a href="<?php the_permalink($safari_id); ?>" class="button">View Safari</a>
                </div>
            <?php endwhile; ?>
        <?php endif; ?>
        <?php wp_reset_query();?>
    </div>
    <!--col-->
    </div>
<?php endwhile; endif; ?>
<?php get_footer(); ?>