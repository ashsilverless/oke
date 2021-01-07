<?php
/**
 * ============== Template Name: News Page
 *
 * @package oke
 */
get_header();
$term = get_queried_object();?>

<!-- ******************* Hero ******************* -->
<?php get_template_part("template-parts/left-hero"); ?>
<div class="outer-wrapper mt3">
    <div class="floating-heading"></div>
    <div class="container pr1 pl1 grid-gap cols-14-10 cols-md-24">
        <div class="col">
            <h1 class="heading heading__lg mt2"><?php the_field("news_main_headline"); ?></h1>

            <div class="wrapper-content">

                <div class="copy"><?php the_field("news_page_main_copy"); ?></div>

            </div>
        </div>
        <div class="col">
            <div class="sidebar mb5">
                <h4 class="heading heading__md heading__light heading__caps align-center mb1">Sign Up To Our Newsletter
                </h4>
                <div class="pb1">
                    <?php echo do_shortcode('[wd_hustle id="1" type="embedded"/]');?>

                    <div class="privacy-copy">
                        <p>We always respect your privacy and will not be sharing this information with any other
                            parties.
                            For more information, you can check our <a href="/privacy-policy">privacy policy</a> here.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="container cols-8 cols-md-12 cols-sm-24 pr1 pl1 grid-gap wrapper-news">
        <?php
            $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
            $query = new WP_Query( array(
            	'posts_per_page' => 9,
            	'paged' => $paged,
            	'category_name' => $category
            ) );
            if ( $query->have_posts() ): while ( $query->have_posts() ) : $query->the_post(); ?>
        <?php $image = get_field('banner_image');?>
        <div class="col item image-top">
            <div class="image" style="background: url(<?php echo $image; ?>)"><a href="<?php the_permalink(); ?>"></a>
            </div>
            <div class="content">
                <a href="<?php the_permalink(); ?>">
                    <h3 class="heading heading__md"><?php the_title(); ?></h3>
                </a>
                <p class="date"><?php echo get_the_date("jS F Y"); ?></p>
                <p><?php
echo wp_trim_words( get_the_content(), 40, '...' );
?></p>
                <a class="button button__standard" href="<?php the_permalink(); ?>">Read
                    More</a>
            </div>

        </div>
        <!--item-->
        <?php endwhile;?>

    </div>
    <!--wrapper-news-->
    <div class="container cols-auto pr1 pl1 grid-gap">
        <div class="col pagination">
            <?php echo paginate_links( array(
                        'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
                        'total'        => $query->max_num_pages,
                        'current'      => max( 1, get_query_var( 'paged' ) ),
                        'format'       => '?paged=%#%',
                        'show_all'     => false,
                        'type'         => 'plain',
                        'end_size'     => 1,
                        'mid_size'     => 1,
                        'prev_next'    => true,
                        'prev_text'    => sprintf( '<i class="fas fa-angle-left"></i>' ),
                        'next_text'    => sprintf( '<i class="fas fa-angle-right"></i>' ),
                        'add_args'     => false,
                        'add_fragment' => '',
                    ) );

    						?></div>
        <? wp_reset_postdata(); endif; ?>
    </div>
    <!--col-->

</div>
<!--outer-wrapper-->



<?php if( have_rows('call_to_action') ):
while( have_rows('call_to_action') ): the_row();
$ctaImage = get_sub_field('background_image');?>

<?php if (get_sub_field('background_image')):?>

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
<!--cta fullwidth-->
<?php endif;?>
<?php endwhile; endif;?>

<?php get_footer();?>