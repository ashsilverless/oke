<?php
/**
 * ============== Itinerary Page
 *
 * @package oke
 */
get_header();
while ( have_posts() ): the_post(); ?>
<!--HERO-->
<?php get_template_part("template-parts/carousel-hero"); ?>
<div class="outer-wrapper">
    <?php get_template_part("template-parts/floating-heading"); ?>
    <div class="container pr1 pl1 mb5 cols-14-10 cols-md-24">

        <div class="col pr3 pr0-mob mb3">
            <div class="description safari mb3 truncate">
                <?php the_field('description');?>
            </div>
            <div class="safari-itinerary">
                <!--DAILY REPEATER-->
                <?php if( have_rows('daily_activity') ): while( have_rows('daily_activity') ): the_row();
            $post_object = get_sub_field('heading');
            if( $post_object ):
                $post = $post_object;
                setup_postdata( $post ); ?>
                <div class="safari-itinerary__item">
                    <p class="heading">
                        <?php the_sub_field('heading');?>
                        <?php the_title(); ?>
                        <?php get_template_part("template-parts/arrow-large"); ?>
                    </p>
                    <div class="content">
                        <?php if (get_sub_field('image')):?>
                        <img src="<?php the_sub_field('image');?>" />
                        <?endif;?>
                        <?php the_sub_field('description');?>
                        <?php get_template_part("template-parts/daily-carousel"); ?>
                    </div>
                </div>
                <?php wp_reset_postdata();
            endif;
                endwhile; endif;?>
                <h3 class="mapview heading heading__md heading__caps mt3 mb1">Map View</h3>
                <div class="itinerary-map">
                    <?php get_template_part("template-parts/itinerary-map"); ?>
                </div>
            </div>
            <!--main-->
            <?php get_template_part("template-parts/book-cta"); ?>
            <?php if( get_field('extensions') ): ?>
            <h3 class="heading heading__md heading__caps mt3 mb1">Extensions to this safari</h3>
            <?php endif;?>
            <?php $post_objects = get_field('extensions');
                if( $post_objects ): ?>






            <div class="container grid-gap equal-height cols-12 cols-sm-24">
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
            <div class="sidebar">

                <h2 class="heading heading__md heading__light heading__caps align-center"><i
                        class="fas fa-info info-panel"></i><?php the_title();?></h4>
                    <div class="detail-wrapper">
                        <ul>
                            <li><span class="title">Duration</span><span class="detail">
                                    <?php the_field('number_of_nights');?> Nights</span></li>
                            <!-- <li><span class="title">Type </span><span class="detail">
                                <?php the_terms( $post->ID, 'type' , '<div>','', '</div>'); ?></span></li> -->
                            <li><span class="title">Cost</span><span class="detail">From $
                                    <?php the_field('cost');?> per person</span></li>
                            <li><span class="title">Activities</span><span class="detail activities">
                                    <ul>
                                        <?php if( have_rows('daily_activity') ):
                                            while( have_rows('daily_activity') ):
                                            the_row();
                                            $post_object = get_sub_field('daily_camp');
                                            if( $post_object):
                                            $post = $post_object;?>
                                        <?php $terms = wp_get_post_terms( $post->ID, array( 'activity') ); ?>
                                        <?php foreach ( $terms as $term ) :
                                                $activityIcon = get_field('icon', $term)['url'];?>
                                        <li class="container cols-4-20 activity"
                                            data-activity="<?php echo $term->name;?>">
                                            <div class="col pr1"><img src="<?php echo $activityIcon;?>" /></div>
                                            <div class="col"><?php echo $term->name;?></div>
                                        </li>
                                        <?php endforeach; ?>
                                        <?php wp_reset_postdata(); endif; endwhile; endif;?>
                                    </ul>
                                </span></li>
                        </ul>
                    </div>
                    <div class="destination-summary">
                        <div class="heading">Destinations</div>
                        <?php if( have_rows('daily_activity') ):
                                while( have_rows('daily_activity') ):
                                the_row();
                                $post_object = get_sub_field('daily_camp');
                                if( $post_object):
                                $post = $post_object;?>
                        <?php $terms = wp_get_post_terms( $post->ID, array( 'destinations') ); ?>
                        <?php foreach ( $terms as $term ) : ?>
                        <div class="destination-summary__item single-destination" data-destination="<?=$term->name;?>">
                            <a href="/destinations/<?=$term->slug;?>"><?=$term->name;?></a>
                        </div>
                        <?php endforeach; ?>
                        <?php wp_reset_postdata(); endif; endwhile; endif;?>
                    </div>

                    <p class="heading__light heading__caps align-center mb1">Featured Properties</p>


                    <div class="camp-summary">
                        <?php if( have_rows('daily_activity') ):
        while( have_rows('daily_activity') ):
        the_row();
        $post_object = get_sub_field('daily_camp');
        if( $post_object):
    // override $post
    $post = $post_object;
    setup_postdata( $post);
    $campImage = get_field('banner_image');
    ?>
                        <?php $campID = $campImage['id'];?>
                        <div class="camp-summary__item repeater" data-camp="<?=$campID;?>">

                            <div class="image">
                                <a href="<?php the_permalink(); ?>" class="div-link"><img
                                        src="<?php echo esc_url($campImage['url']); ?>"
                                        alt="<?php echo esc_attr($campImage['alt']); ?>" /></a>
                                <h2 class="heading heading__sm heading__light">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>

                            </div>
                            <div class="see-more">See More</div>
                            <div class="expanding-panel">
                                <?php the_field('short_description');?>
                                <a href="<?php the_permalink(); ?>" class="button">View
                                    <?php the_title(); ?></a>
                            </div>
                        </div>
                        <?php wp_reset_postdata(); endif;
endwhile; endif;?>

                    </div>
                    <!--camp-summary-->
            </div>
            <!--sidebar-->
        </div>
        <?php endwhile;?>
    </div>
    <!--outer-wrapper-->
    <?php get_footer();?>