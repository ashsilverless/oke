<?php
/**
 * ============== Destinations Page
 *
 * @package oke
 */
get_header();
$term = get_queried_object();?>

<!-- ******************* Hero ******************* -->
<?php get_template_part("template-parts/left-hero"); ?>

<div class="outer-wrapper mt3">
    <div class="container pr1 pl1 cols-14-10 cols-md-24">
        <div class="col pr2">
            <div class="description camp">
                <?php the_field('description', $term);?>
            </div>
            <h3 class="heading heading__md heading__caps mt2 mb1">Accommodation in this Area</h3>

            <div class="container grid-gap equal-height cols-12 cols-md-24">
                <?php
                $args = array(
                    'post_type' => 'camps',
                    'tax_query' => array(
                    'relation' => 'AND',
                        array(
                            'taxonomy' => 'destinations',
                            'field' => 'slug',
                            'terms' => array( $term->slug )
                        ),
                    )
                );
                $query = new WP_Query( $args );
                if ( $query->have_posts() ): while ( $query->have_posts() ):
                $query->the_post();
                $campImage = get_field('banner_image');?>

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
                <!--item-->
                <?php endwhile; endif;?>
            </div>
            <!--camp-summary-->

        </div>
        <!--col-->
        <div class="col">
            <?php if( have_rows('concessions_call_to_action', 'options') ):
            while( have_rows('concessions_call_to_action', 'options') ): the_row();
            $ctaImage = get_sub_field('background_image');?>
            <div class="cta cta--sidebar mb3" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
                <div class="container">
                    <div class="col">
                        <div class="content">
                            <h3 class="heading heading__md heading__caps heading__light"><?php the_sub_field('heading');?></h3>
                            <p><?php the_sub_field('copy');?></p>
                            <a href="<?php the_sub_field('button_target');?>"
                                class="button button__standard"><?php the_sub_field('button_text');?></a>
                            </div>
                        </div>
                    </div>
                </div>
                
            <?php endwhile; endif;?>            
            
            <h3 class="heading heading__md heading__caps mb1">Other Areas To Explore</h3>
            <?php
            $catID = get_queried_object_id();
            $destterms = get_terms( array(
                'taxonomy' => 'destinations',
                'hide_empty' => true,
                'exclude' => $catID
            ) );
            foreach ($destterms as $destterm):
                $visibility = get_field('visible_as_concession', $destterm);?>

            <div class="destination-summary__item mb1" style="<?php if ($visibility == 'no') {
                echo 'display:none';
            };?>">
                <a href="<?php echo get_term_link($destterm->slug, $destterm->taxonomy);?>">
                    <h2 class="heading heading__xs heading__caps heading__body"><?php echo $destterm->name;?></h2>

                    <div class="image" style="background:url(<?php echo $companyImage['url']; ?>);"></div>

                </a>
            </div>
            <?php endforeach;?>
        </div>
        <!--col-->

    </div>
</div>
<!--outer-wrapper-->

<?php get_footer();?>
