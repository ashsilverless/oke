<?php
if( get_field('hero_type') == 'image' ):
	$heroImage = get_field('hero_background_image');
elseif ( get_field('hero_type') == 'color' ):
	$heroColor = get_field('hero_background_colour');
endif;
if( get_field('hero_type') !== 'slider'):?>

<div class="hero standard <?php the_field('hero_height');?>" style="background-image: url(<?php echo $heroImage['url']; ?>); background-color: <?php echo $heroColor; ?>;">
    <div class="container align-center">
		<div class="col lg-narrow">
		    <div class="hero__content">
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
