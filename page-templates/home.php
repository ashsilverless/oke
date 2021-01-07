<?php
/**
 * ============== Template Name: Home Page
 *
 * @package oke
 */
get_header();?>

<!--HERO-->
<?php get_template_part("template-parts/home-hero"); ?>
<!--OVERVIEW-->

<div id="explore" class="container cols-offset3-18 cols-md-24 boxed-content mt5 pl1 pr1">
    <?php if( have_rows('overview_block') ):
    while( have_rows('overview_block') ): the_row(); ?>
    <div class="col content">
        <?php get_template_part('template-parts/panel-icon');?>
        <h2 class="heading heading__lg">
            <?php the_sub_field('heading');?>
        </h2>
    </div>
</div>
<div class="container cols-offset3-18 cols-md-24 boxed-content last mb5 pl1 pr1">
    <div class="col">
        <div class="container cols-16-8 cols-md-24">
            <div class="col content boxed-content--right-border">
                <p class="brand-font"><?php the_sub_field('copy');?></p>
                <a href="<?php the_sub_field('button_target');?>"
                    class="button button__standard button__standard--fixed-width">
                    <?php the_sub_field('button_text');?>
                </a>
            </div>
            <div class="col content map-link">
                <a href="/accommodation">
                    <?php $thisicon = get_sub_field( 'view_map_icon')["url"];
                    $thisicon   = explode("/wp-content/", $thisicon)[1];?>
                    <?php echo file_get_contents("./wp-content/" . $thisicon, FILE_USE_INCLUDE_PATH); ?>
                </a>
            </div>
        </div>
        <div class="container cols-8 leader cols-sm-24">
            <?php if( have_rows('leader') ):
            while( have_rows('leader') ): the_row();
            $leaderImage = get_sub_field('image');?>
            <div class="col boxed-content--right-border">
                <div class="leader__item">
                    <div class="image" style="background-image: url(<?php echo $leaderImage['url']; ?>);">
                        <a href="<?php the_sub_field('button_target');?>"></a>
                    </div>
                    <div class="content">
                        <h3 class="heading heading__lg inline-icon">
                            <sup>The</sup>
                            <?php the_sub_field('heading');?>
                            <?php $thisicon = get_sub_field( 'icon')["url"];
                           $thisicon   = explode("/wp-content/", $thisicon)[1];?>
                            <?php echo file_get_contents("./wp-content/" . $thisicon, FILE_USE_INCLUDE_PATH); ?>
                        </h3>
                        <p><?php the_sub_field('copy');?></p>
                        <a href="<?php the_sub_field('button_target');?>" class="button button__standard">
                            <?php the_sub_field('button_text');?>
                        </a>
                    </div>
                </div>
            </div>
            <?php endwhile; endif;?>
        </div>
    </div>
</div>
<?php endwhile; endif;?>

<!--SAFARI OPTIONS-->

<div class="container cols-offset3-18 cols-md-24 boxed-content last mb5 mt5 pl1 pr1">
    <?php if( have_rows('safari_options_block') ):
    while( have_rows('safari_options_block') ): the_row(); ?>
    <div class="col content">
        <?php get_template_part('template-parts/panel-icon');?>
        <h2 class="heading heading__lg">
            <?php the_sub_field('heading');?>
        </h2>
    </div>
    <div class="col">
        <div class="container cols pl1 pr1">
            <div class="col content">
                <p class="brand-font"><?php the_sub_field('copy');?></p>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="tabs-wrapper">
            <div class="tabs-header">
                <ul>
                    <?php if( have_rows('slides') ):
                    	$row = 1;
                    	while( have_rows('slides') ): the_row(); ?>
                    <li class="tab-trigger <?php if($row == 1) {echo 'active';}?>" data="0">
                        <span>
                            <?php get_template_part('template-parts/button-icon');?>
                            <p><?php the_sub_field('heading');?></p>
                        </span>
                    </li>
                    <?php $row++; endwhile; endif;?>
                </ul>
            </div>
            <!--tabs header-->
            <div class="tabs-body">
                <div class="owl-carousel tabs">
                    <?php if( have_rows('slides') ): while( have_rows('slides') ): the_row();
                        $optionsImage = get_sub_field('image');
                        $typeterm = get_sub_field('button_target');?>
                    <div class="item">
                        <div class="container cols-16-8 cols-sm-24">
                            <div class="col content">
                                <h2 class="heading heading__md">
                                    <?php the_sub_field('heading');?>
                                </h2>
                                <p class="mt1"><?php the_sub_field('copy');?></p>
                                <a href="<?php echo esc_url( get_term_link( $typeterm ) );?>"
                                    class="button button__large button__large--fixed-width">
                                    <span>Read more about</span>
                                    <?php the_sub_field('button_text');?>
                                </a>
                            </div>
                            <!--content-->
                            <div class="col">
                                <div class="image" style="background-image: url(<?php echo $optionsImage['url']; ?>);">
                                    <a href="<?php echo esc_url( get_term_link( $typeterm ) );?>"></a>
                                </div>
                            </div>
                            <!--image-->
                        </div>
                        <div class="container">
                            <div class="col content border-top">
                                <h3 class="heading heading__sm heading__emphasis mb1">Featured
                                    <?php the_sub_field('heading');?> safaris:</h3>
                                <div class="container grid-gap cols-8 cols-sm-24">
                                    <?php $post_objects = get_sub_field('featured_safaris');
                                    if( $post_objects ): ?>
                                    <?php foreach( $post_objects as $post):?>
                                    <?php setup_postdata($post);
                                            $leadercardimage = get_field('banner_image');?>
                                    <div class="col">
                                        <div class="leader-card small">
                                            <a href="<?php the_permalink(); ?>">
                                                <div class="banner-image"
                                                    style="background-image: url(<?php echo $leadercardimage['url']; ?>);">
                                                </div>
                                                <div class="content">
                                                    <p><?php the_field('number_of_nights'); ?> night</p>
                                                    <p><?php the_title(); ?></p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                    <?php wp_reset_postdata();?>
                                    <?php endif;?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endwhile; endif;?>
                </div>
            </div>
            <!--tabs body-->
        </div>
        <!--tabs-wrapper-->
    </div>
    <?php endwhile; endif;?>
    <!--safari options block-->
</div>
<!--safari options block-->

<?php get_template_part('template-parts/fullwidth-info-block');?>

<!--Accommodation-->

<div class="container cols-offset3-18 cols-md-24 boxed-content mt5 pl1 pr1">
    <?php if( have_rows('accommodation_block') ):
    while( have_rows('accommodation_block') ): the_row(); ?>
    <div class="col content">
        <?php get_template_part('template-parts/panel-icon');?>
        <h2 class="heading heading__lg">
            <?php the_sub_field('heading');?>
        </h2>
    </div>
</div>
<div class="container cols-offset3-18 cols-md-24 boxed-content last mb5 pl1 pr1">
    <div class="col">
        <div class="container cols-24">
            <div class="col content last">
                <p class="brand-font"><?php the_sub_field('copy');?></p>
            </div>
            <div class="col last"></div>
        </div>
        <div class="container cols-8 leader cols-sm-24">
            <?php if( have_rows('leader') ):
            while( have_rows('leader') ): the_row();
            $leaderImage = get_sub_field('image');
            $focusterm = get_sub_field('button_target');?>
            <div class="col boxed-content--right-border last">
                <div class="leader__item">
                    <div class="image" style="background-image: url(<?php echo $leaderImage['url']; ?>);">
                        <a href="<?php echo esc_url( get_term_link( $focusterm ) );?>"></a>
                    </div>
                    <div class="content">
                        <h3 class="heading heading__md">
                            <?php the_sub_field('heading');?>
                            <sup><span>Properties</span></sup>
                        </h3>
                        <p><?php the_sub_field('copy');?></p>
                        <a href="<?php echo esc_url( get_term_link( $focusterm ) );?>" class="button button__standard">
                            <?php the_sub_field('button_text');?>
                        </a>
                    </div>
                </div>
            </div>
            <?php endwhile; endif;?>
        </div>
        <div class="col content align-center text-center">
            <a href="<?php the_sub_field('button_target');?>"
                class="button button__large button__large--fixed-width centered">
                <span>View all</span>
                <?php the_sub_field('button_text');?>
            </a>
        </div>
    </div>
</div>
<?php endwhile; endif;?>

<?php get_footer();?>