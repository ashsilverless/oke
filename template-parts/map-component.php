<!--=========== global =============-->
<div id="map-outer-wrapper" class="map-outer-wrapper open">
    <div class="camp-map">
        <div class="positioning-wrapper">
            <img src="<?php echo get_template_directory_uri(); ?>/inc/img/master-mapv1.jpg" />
            <div id="wipe" class="wipe"></div>
            <?php get_template_part('template-parts/water-overlayv1');?>

            <div id="Container" class="marker-wrapper">
                <?php
				$args = array(
				  'post_type'   => 'camps',
				 );

				$camps = new WP_Query( $args );
				if( $camps->have_posts() ) : while( $camps->have_posts() ) : $camps->the_post();
					$mapImage = get_field('banner_image');
					//Show cost as class
                    $safaricost = get_field('cost', $post_id);
                    $safaricost = str_replace( ',', '', $safaricost );
                    if( have_rows('cost_filters_camps', 'options') ):
                    while ( have_rows('cost_filters_camps', 'options') ) : the_row();
                        if ($safaricost > get_sub_field('low_from') && $safaricost < get_sub_field('low_to')){
                            $safaricost = "low";
                        } elseif ($safaricost > get_sub_field('mid_from') && $safaricost < get_sub_field('mid_to')){
                            $safaricost = "med";
                        } else {
                            $safaricost = "high";
                        }
                    endwhile; endif;
					//Get focus as slug for class
					$focus = get_the_terms($post->ID,'focus');
                    $focusslug = $focus[0];
                    ?>

                <?php if( have_rows('map_marker') ):
					while ( have_rows('map_marker') ) : the_row();
					$markerPositionVert = get_sub_field('distance_from_top');
					$markerPositionHoriz = get_sub_field('distance_from_left');?>
                    <?php if (get_sub_field('distance_from_top')) {?>
                        <div class="marker mix <?php 
                        if (get_the_terms( $post->ID, 'type' )){
                        $types = get_the_terms( $post->ID, 'type' );
                            foreach($types as $type) {
                            $type = $type->name;
                            $type = str_replace(' ', '', $type);
                            $type  = strtolower($type);
                            echo $type . ' ';
                            }
                        }
                        echo $focusslug->slug;
                        echo ' '. $safaricost;?>" style="top:<?php the_sub_field('distance_from_top');?>.001%; left: <?php the_sub_field('distance_from_left');?>.001%;">
                            <div
                                class="camp-map__card <?php if ( $markerPositionVert < 35 ) {echo 'high';};?> <?php if ( $markerPositionHoriz < 10 ) {echo 'left';};?> <?php if ( $markerPositionHoriz > 89 ) {echo 'right';};?>">
                                <div class="inner">
                                    <?php echo $markerHigh;?>
                                    <?php $medImage = $mapImage['sizes']['medium'];?>
                                    <a href="<?php the_permalink();?>" class="image" style="background-image: url(<?php echo $medImage;?>);"></a>
                                    <h2 class="heading heading__sm"><?php the_title();?></h2>
                                    </h2>

                                    <div class="meta">
                                        <span><?php echo $focusslug->name;?></span>
                                        <span><i class="fas fa-credit-card"></i> From $<?php the_field('cost'); ?></span>
                                    </div>
                                    <a href="<?php the_permalink();?>">Learn more</a>
                                </div>
                            </div>
                            <!--card-->
                        </div>
                        <!--marker-->
                    <?php }?>
                <?php endwhile; endif;?>
                <?php wp_reset_postdata();
				endwhile; endif;?>
            </div>
            <!--marker-wrapper-->
        </div>
        <!--posn-wrapper-->
    </div>
    <!--camp-map-->

</div>
<!--outer-wrapper-->
