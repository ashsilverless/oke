<?php
/**
 * ============== Template Name: Find A Safari Page
 *
 * @package oke
 */
get_header();?>

<!--HERO-->
<?php $postid = get_the_ID(); ?>
<?php
if( get_field('hero_type') == 'image' ):
	$heroImage = get_field('hero_background_image');
elseif ( get_field('hero_type') == 'color' ):
	$heroColor = get_field('hero_background_colour');
endif;
if( get_field('hero_type') !== 'slider'):?>

<div class="hero left-hero <?php the_field('hero_height');?>" style="background-image: url(<?php echo $heroImage['url']; ?>); background-color: <?php echo $heroColor; ?>;">
    <div class="container align-center">
		<div class="col lg-narrow">
		    <div class="mb3">
                <h1 class="heading heading__lg heading__caps heading__light slow-fade">
                    <?php the_field('hero_heading');?>
                </h1>
				<p class="heading__light heading__sm">
					<?php the_field('hero_copy');?>
				</p>
		    </div>
		</div>
	</div>
</div><!--hero standard-->

<?php endif;?>


<div class="outer-wrapper">
    <?php get_template_part("template-parts/type-filter"); ?>
    <!--<?php get_template_part("template-parts/filtered-result"); ?>-->


    <div id="Container" class="filter-wrapper">
        <div class="fail-message">
            <p>No safaris were found matching your selected filters.</p>
            <p>Leaving the safari Types section open will increase the results and show a variety of classic safari itineraries. </p>
            <p>Please <a href="/enquire">contact us</a> to craft a personalised itinerary</p>
        </div>
        <div class="container pr1 pl1">
            <div class="col">
                <h3 class="heading heading__md heading__caps mt2 mb2 options">Your Safari Options</h3>
            </div>

            <?php
      $args = array(
        'post_type' => 'itineraries',
        'meta_key' => 'featured',
        'orderby' => 'meta_value_num',
        'order' => 'DESC'

/*          'tax_query' => array(
          'relation' => 'AND',
              array(
                  'taxonomy' => 'type',
                  'field' => 'slug',
                  'terms' => array( $term->slug )
              ),
          )*/
      );
      $query = new WP_Query( $args );

        if ( $query->have_posts() ): while ( $query->have_posts() ):$query->the_post();
        $post_id = get_the_ID();
        //Show cost as class
        $safaricost = get_field('cost', $post_id);
        $safaricost = str_replace( ',', '', $safaricost );
        if( have_rows('cost_filters_safaris', 'options') ):
        while ( have_rows('cost_filters_safaris', 'options') ) : the_row();
            if ($safaricost > get_sub_field('low_from') && $safaricost < get_sub_field('low_to')){
                $safaricost = "low";
            } elseif ($safaricost > get_sub_field('mid_from') && $safaricost < get_sub_field('mid_to')){
                $safaricost = "med";
            } else {
                $safaricost = "high";
            }
        endwhile; endif;
        //Get duration as class
        $safariduration = get_field('number_of_nights');
        if ($safariduration < '4'){
        $safariduration = "one-to-three";
        } elseif ($safariduration > '3' && $safariduration < '7'){
        $safariduration = "four-to-six";
        } elseif ($safariduration > '6' && $safariduration < '10'){
        $safariduration = "seven-to-nine"; 
        } elseif ($safariduration > '9' ){
        $safariduration = "more-than-nine";
        }
        //$season = get_the_terms($post->ID,'season');
        //$season_string = join(' ',wp_list_pluck($season, 'slug'));
        // $focusslug = $focus[0];
        $safariImage = get_field('banner_image');
        $featured = get_field('featured');
        if ($featured == '1'){$featured = "featured";}
        ?>


            <div
                class="col mix <?php echo $focus_string;?> <?php echo $safariduration;?> <?php echo $safaricost;?> <?php echo $featured; ?> <?php
                $seasons = get_the_terms( $post->ID, 'season' );
                foreach($seasons as $season) {
                  $season = $season->name;
                  $season = str_replace(' ', '', $season);
                  $season  = strtolower($season);
                  echo $season . ' ';
                }?>
                    <?php
                $types = get_the_terms( $post->ID, 'type' );
                foreach($types as $type) {
                $type = $type->name;
                $type = str_replace(' ', '', $type);
                $type  = strtolower($type);
                echo $type . ' ';
                }
                ?>">
                <div class="safari-options">
                    <div class="container cols-10-14 cols-md-24">
                        <div class="col">
                            <div class="image" style="background:url(<?php echo $safariImage['url']; ?>);">
                                <a href="<?php the_permalink(); ?>"></a>
                            </div>
                        </div>
                        <div class="col">
                            <div class="meta">
                                <div class="item"><i class="fas fa-moon"></i><?php the_field('number_of_nights');?>
                                    Nights</div>
                                <div class="item"><i class="fas fa-credit-card"></i>From $<?php the_field('cost');?> per person
                                </div>
                            </div>
                            <div class="description">
                                <h2 class="heading heading__md"><?php the_title(); ?></h2>
                                <?php the_field('short_description');?>
                            </div>
                            <div class="safari-includes">
                                <span class="title col">Includes: </span>
                                <span class="col camp-includes">
                                    <?php if( have_rows('daily_activity') ): while( have_rows('daily_activity') ): the_row();
                             $dailycamp = get_sub_field('daily_camp');?>

                                    <span class="repeater"><?php echo esc_html( get_the_title($dailycamp) );?></span>
                                    <?php endwhile; endif;?>

                                </span>

                            </div>
                            <a href="<?php the_permalink(); ?>" class="button">Learn More</a>
                        </div>

                    </div>
                </div>
            </div>
            <?php endwhile; endif;?>
        </div>
    </div>
</div>
<!--outer wrapper-->
<!--<div class="filter-footer fullwidth">
    <h3 class="heading heading__md heading__caps heading__light">X Safaris Match Your Criteria</h3>
    <a href="#page">Adjust my filter</a>
</div>-->
<!--
<div class="container pr1 pl1 mt5 mb5">
    <div class="col">
        <?php
                if( have_rows('safari_type_cta', 'options') ):
                while( have_rows('safari_type_cta', 'options') ): the_row();
                $ctaImage = get_sub_field('background_image');?>
        <div class="cta bespoke" style="background:url(<?php echo $ctaImage['url']; ?>);">
            <h4 class="heading heading__md heading__light heading__caps heading__center">
                <?php the_sub_field('heading');?></h4>
            <?php the_sub_field('copy');?>
            <?php $ctaform = get_sub_field('form');
                       if( $ctaform ):
                         foreach( $ctaform as $p ): // variable must NOT be called $post (IMPORTANT)
                           $cf7_id= $p->ID;
                           echo do_shortcode( '[contact-form-7 id="'.$cf7_id.'" ]' );
                         endforeach;
                       endif; ?>

            <?php endwhile; endif; ?>


        </div>
    </div>
</div>
-->
<?php get_footer();?>
