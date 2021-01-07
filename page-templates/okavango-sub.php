<?php
/**
 * ============== Template Name: Okavango Sub Page
 *
 * @package oke
 */
get_header();
$term = get_queried_object();?>

<!-- ******************* Hero ******************* -->
<?php get_template_part("template-parts/left-hero"); ?>
<div class="outer-wrapper mt3 mb3">
    <div class="container pl1 pr1 cols-14-10 cols-md-24">
        <div class="col">
            <?php
            if( have_rows('flexible_layout') ):
            while ( have_rows('flexible_layout') ) : the_row();

                if( get_row_layout() == 'text_module' ):?>
            <div class="text-module pr3 mb3 pr0-mob">
                <h3 class="heading heading__md heading__caps">
                    <?php the_sub_field('heading');?>
                </h3>
                <?php the_sub_field('copy');?>
            </div>


            <?php elseif( get_row_layout() == 'map_module' ):?>
            <div class="itinerary-map pr3 pr0-mob">
                <div class="map-outer-wrapper">

                    <div class="camp-map">
                        <div class="positioning-wrapper">
                            <img src="<?php echo get_template_directory_uri(); ?>/inc/img/master-mapv1.jpg" />
                            <!-- <div id="wipe" class="wipe"></div> -->
                            <?php get_template_part('template-parts/water-overlayv1');?>
                            <div id="Container" class="marker-wrapper">
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

        <?php elseif( get_row_layout() == 'single_image' ):
            $image = get_sub_field('image');
            ?>
            <div class="gallery gallery__single-image pr3 mb3 pr0-mob">
            <a href="<?php echo $image['url']; ?>" class="lightbox-gallery" alt="<?php echo $image['alt']; ?>"
                style="background-image: url(<?php echo $image['url']; ?>);">
                <!--<?php echo $image['caption']; ?>--></a>
            </div>

            <?php elseif( get_row_layout() == 'gallery_module' ):
                $images = get_sub_field('images');
                if( $images ): ?>
            <div class="gallery pr3 mb3">
                <?php foreach( $images as $image ): ?>
                <a href="<?php echo $image['url']; ?>" class="lightbox-gallery" alt="<?php echo $image['alt']; ?>"
                    style="background-image: url(<?php echo $image['url']; ?>);">
                    <!--<?php echo $image['caption']; ?>--></a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
            <?php elseif( get_row_layout() == 'number_counters' ):?>
            <?php if (get_sub_field('number_heading')):?>
            <div class="counter-copy pr3">
                <h2 class="heading heading__md heading__caps mb1"><?php the_sub_field('number_heading');?></h2>
                <?php endif;?>
                <?php the_sub_field('number_copy');?>
            </div>
            <div class="wrapper--number-counter pr3 mt3 mb3 pr0-mob">
                <?php if( have_rows('number_counter_item') ):
                    while ( have_rows('number_counter_item') ) : the_row();?>
                <div class="number-counter">
                    <div class="number-counter__number" data-count="<?php the_sub_field('total_number');?>">0</div>
                    <div class="number-counter__text">
                        <?php the_sub_field('number_text');?>
                    </div>
                </div>
                <?php endwhile; endif;?>
            </div>


            <?php elseif( get_row_layout() == 'carousel_module' ):?>
            <div class="carousel_module owl-carousel owl-theme mb3 pr3 pr0-mob">
                <?php
                    $images = get_sub_field('images');
                    if( $images ):
                    foreach( $images as $image ): ?>
                <div class="carousel_module__item" style="background:url(<?php echo $image; ?>)"></div>
                <?php endforeach; endif; ?>
            </div>

            <?php elseif( get_row_layout() == 'toggle_module' ):?>
            <?php if (get_sub_field('heading')):?>
            <div class="pr3">
                <h3 class="heading heading__md heading__caps mb1">
                    <?php the_sub_field('heading');?>
                </h3>
                <?php the_sub_field('intro');?>
            </div>
            <?php endif;?>

            <div class="toggle pr3 mb3 pr0-mob">
                <?php if( have_rows('items') ):
                    while ( have_rows('items') ) : the_row();?>
                <div class="toggle__item">
                    <p class="heading"><?php the_sub_field('heading');?>
                        <?php get_template_part("template-parts/arrow-large");?>
                    </p>
                    <div class="content <?php if (get_sub_field('image')) echo 'has-image';?>">
                        <div class="inner">
                            <?php if (get_sub_field('image')):
                                    $toggleImage = get_sub_field('image');?>
                            <div class="image" style="background:url(<?php echo $toggleImage; ?>)"></div>
                            <?php endif;?>
                            <?php the_sub_field('copy');?>
                            <?php if (get_sub_field('button_text')):?>
                            <a href="<?php the_sub_field('button_target');?>"
                                class="button button__standard"><?php the_sub_field('button_text');?></a>
                            <?php endif;?>
                        </div>

                    </div>
                </div>
                <?php endwhile; endif; ?>
            </div>
            <?php endif;
            endwhile; endif;?>
        </div>
        <!--col-->

        <div class="col">
            <div class="sub-menu-sticky">
                <?php get_template_part("template-parts/main-sidebar"); ?>
            </div>
        </div>
    </div>
</div>
<!--outer-wrapper-->

<?php get_template_part('template-parts/fullwidth-info-block');?>

<!--
<?php if( have_rows('call_to_action') ):
while( have_rows('call_to_action') ): the_row();
$ctaImage = get_sub_field('background_image');?>
<div class="cta cta--fullwidth" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container align-center pt5 pb3">
        <div class="col">
            <div class="content lg-narrow">
                <h3 class="heading heading__md heading__caps heading__light"><?php the_sub_field('heading');?></h3>
                <p><?php the_sub_field('content');?></p>
                <a href="<?php the_sub_field('button_target');?>"
                    class="button button__ghost"><?php the_sub_field('button_text');?></a>
            </div>
        </div>
    </div>
</div>

<?php endwhile; endif;?>
-->
<?php get_footer();?>
