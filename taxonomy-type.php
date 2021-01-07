<?php
/**
 * The template for displaying type taxonomy
 *
 * @package ode
 */
get_header();
$term = get_queried_object();?>

<!--HERO-->

<?php get_template_part("template-parts/filter-hero-type"); ?>

<div class="outer-wrapper">
    <?php get_template_part("template-parts/type-filter"); ?>
    <div class="container cols-14 cols-md-24 pl1 pr1">
        <div class="col description safari mt2">
            <?php the_field('overview', $term);?> 
        </div>       
    </div>
    
    <div id="Container" class="filter-wrapper">
        <div class="fail-message"><span>No items were found matching the selected filters</span></div>
        <div class="container pr1 pl1">
            <div class="col">
                <h3 class="heading heading__md heading__caps mt2 mb2 options">Your Safari Options</h3>
            </div>

            <!--<?php
            $featured_posts = get_field('featured_safaris', $term);
            if( $featured_posts ): ?>
                <?php foreach( $featured_posts as $post ): 
                    setup_postdata($post); ?>
                    <div class="col">
                        
                        <div class="safari-options">
                                        <div class="container cols-10-14">
                                            <div class="col">
                                                <div class="image" style="background:url(<?php echo $safariImage['url']; ?>);">
                                                    <a href="<?php the_permalink(); ?>"></a>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="meta">
                                                    <div class="item"><i class="fas fa-moon"></i><?php the_field('number_of_nights');?>
                                                        Nights</div>
                                                    <div class="item"><i class="fas fa-credit-card"></i>From $<?php the_field('cost');?>
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
                <?php endforeach; ?>
                <?php wp_reset_postdata(); ?>
            <?php endif; ?>-->


            <?php
      $args = array(
        'post_type' => 'itineraries',
        'tax_query' => array(
            array (
                'taxonomy' => 'type',
                'field' => 'slug',
                'terms' => $term->slug,
            )
        ),
        'meta_key'			=> 'featured',
        'orderby'			=> 'meta_value',
        'order'				=> 'DESC',


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
        //Get cost as class
        $safaricost = get_field('cost');
        if ($safaricost < '1000'){
        $safaricost = "low";
        } elseif ($safaricost > '1000' && $safaricost < '2000'){
        $safaricost = "medium";
        } elseif ($safaricost > '2000'){
        $safaricost = "high";
        }
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
                class="col mix <?php if( get_field('featured_itinerary') ) {echo "featured-itinerary";}?> <?php echo $focus_string;?> <?php echo $safariduration;?> <?php echo $safaricost;?> <?php echo $featured; ?> <?php
                $seasons = wp_get_post_terms( $post->ID, 'season' );
                foreach($seasons as $season) {
                  $season = $season->name;
                  $season = str_replace(' ', '', $season);
                  $season  = strtolower($season);
                  echo $season . ' ';
                }?>
                <?php
                $types = wp_get_post_terms( $post->ID, 'type' );
                foreach($types as $type) {
                $type = $type->name;
                $type = str_replace(' ', '', $type);
                $type  = strtolower($type);
                echo $type . ' ';
                }?>">
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
                                <div class="featured-flash">
                                    Featured
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
<?php get_footer();?>
