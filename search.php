<?php
/**
 * The template for displaying search results pages
 *
 * @package oke
 */

get_header(); ?>

<!-- ******************* Hero Content ******************* -->
<?php $searchBG = get_field('search_background_image', 'options');?>
<div class="hero hero__search lower-grad" style="background-image: url(<?php echo $searchBG['url'];?>);">
    <div class="container pr1 pl1">
        <div class="col">
            <h2 class="heading heading__xl"><?php _e( 'Your search for', 'locale' ); ?> '<?php the_search_query(); ?>'
                returned <?php echo $wp_query->found_posts; ?> results</h2>
        </div>
    </div>
</div>

<!-- ******************* Hero Content END ******************* -->

<?php global $wp_query;?>

<div class="container cols-14-10 cols-md-24 pt3 pl1 pr1">
    <div class="col pr3">
        <?php $search_query = get_search_query(); ?>
        <?php $destTerms = get_terms( 'destinations',
			
			array(
                
                'hide_empty' => 0,
                'name__like' => $search_query,                
			));
            foreach ($destTerms as $destTerm):
                $destDesc = get_field('description', $destTerm);?>
        <div class="search-card">
            <h2 class="heading heading__md"><a
                    href="<?php echo get_term_link( $destTerm->slug, $destTerm->taxonomy ); ?>"><?php echo $destTerm->name;?></a>
            </h2>

            <p><?php echo wp_trim_words ($destDesc, $num_words = 50); ?></p>
            <a href="<?php echo get_term_link( $destTerm->slug, $destTerm->taxonomy ); ?>" class="read-more">Read
                More</a>


        </div>

        <?php endforeach;?>

        <?php if(have_posts()): while(have_posts()): the_post(); ?>


        <div class="search-card">
            <h2 class="heading heading__md"><a href="<?php echo get_permalink(); ?>"><?php the_title();  ?></a></h2>
            <?php $excerpt = wp_trim_words( get_field('short_description' ), $num_words = 50, $more = '...' );
			echo $excerpt;?>
            <p><?php the_excerpt(); ?></p>
            <a href="<?php the_permalink(); ?>" class="read-more">Read More</a>
        </div>
        <?php endwhile; endif; ?>
    </div>
    <div class="col">
        <h3 class="heading heading__md heading__caps mb1">Browse By Type</h3>
        <div class="container search-sidebar">
            <?php
			$typeterms = get_terms( array(
				'taxonomy' => 'type',
				'hide_empty' => false,
			) );
			foreach ($typeterms as $typeterm):?>
            <div class="col  search-sidebar__item">
                <?php $typeImage = get_field('banner_image', $typeterm);?>
                <a href="<?php echo get_term_link($typeterm->slug, $typeterm->taxonomy);?>" class="image-leader">
                    <div class="image" style="background:url(<?php echo $typeImage['url']; ?>);">
                        <h2 class="heading heading__sm heading__light heading__caps">
                            <?php echo $typeterm->name;?> Safaris
                        </h2>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
            </div>
            <?php endforeach;?>


        </div>

        <h3 class="heading heading__md heading__caps mb1">Browse By Focus</h3>
        <div class="container search-sidebar">
            <?php
			$typeterms = get_terms( array(
				'taxonomy' => 'focus',
				'hide_empty' => false,
			) );
			foreach ($typeterms as $typeterm):?>
            <div class="col search-sidebar__item">
                <?php $typeImage = get_field('banner_image', $typeterm);?>
                <a href="<?php echo get_term_link($typeterm->slug, $typeterm->taxonomy);?>" class="image-leader">
                    <div class="image" style="background:url(<?php echo $typeImage['url']; ?>);">
                        <h2 class="heading heading__sm heading__light heading__caps">
                            <?php echo $typeterm->name;?> Safaris
                        </h2>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
            </div>
            <?php endforeach;?>
        </div>
        <h3 class="heading heading__md heading__caps mb1">Browse By Region</h3>
        <div class="container search-sidebar">
            <?php $destTerms = get_terms(
			'destinations',
			array(
				'hide_empty' => 0
			));
		   foreach($destTerms as $destTerm) :
			   $heroImage = get_field('banner_image', $destTerm);
			   ?>
            <div class="col search-sidebar__item">
                <a href="<?php echo get_term_link( $destTerm->slug, $destTerm->taxonomy ); ?>" class="image-leader">
                    <div class="image" style="background:url(<?php echo $heroImage['url']; ?>);">
                        <h2 class="heading heading__sm heading__light heading__caps">
                            <?php echo $destTerm->name; ?>
                        </h2>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
            </div>
            <?php endforeach;?>
        </div>
    </div>
</div>

<?php get_footer(); ?>