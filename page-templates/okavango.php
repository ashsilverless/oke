<?php
/**
 * ============== Template Name: Okavango
 *
 * @package oke
 */
get_header();?>

<!-- ******************* Hero ******************* -->
<?php if( have_rows('hero') ): while( have_rows('hero') ): the_row();
 $heroImage = get_sub_field('background_image');?>
<div class="hero left-hero lower-grad h75" style="background-image: url(<?php echo $heroImage['url']; ?>);">
    <div class="container pr1 pl1 cols-14 cols-md-24 left-hero__container">
        <div class="col pb5">
            <!--removed pl3-->
            <h1 class="heading heading__herolg heading__caps heading__light slow-fade mb0">
                <?php the_sub_field('heading');?>
            </h1>
            <p class="heading__light heading__sm">
                <?php the_sub_field('sub_heading');?>
            </p>
        </div>
    </div>
</div>
<?php endwhile; endif;?>



<div class="cta cta__dark-text">
    <div class="container cols-14-10 cols-md-24 pt5 pb5 pr1 pl1">
        <div class="col">
            <div class="content">
                <!--removed pl3-->
                <h3 class="heading heading__md heading__caps"><?php the_field('oka_sub_heading');?></h3>
                <div class="description camp truncate">
                    <p><?php the_field('intro_para');?></p>
                    <?php the_field('full_description');?>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="container grid-gap cols-8 cols-xl-12 cols-sm-24 pr1 pl1">
    <?php if( have_rows('image_panels') ):
while( have_rows('image_panels') ): the_row();
$panelImage = get_sub_field('image');?>
    <div class="col listing-item leader mb5">
        <a class="leader__image" style="background-image: url(<?php echo $panelImage['url']; ?>);"
            href="<?php the_sub_field('target_link');?>"></a>
        <div class="content pb1 pt1 pl2 pr2">
            <h3 class="heading heading__md inline-icon leader__heading">
                <!--<sup>The</sup>-->
                <span class="heading__caps"><?php the_sub_field('heading');?></span>
            </h3>
            <p><?php the_sub_field('copy');?></p>
            <a href="<?php the_sub_field('target_link');?>" class="button button__standard">Read More</a>
        </div>
    </div>
    <?php endwhile; endif;?>
</div>

<?php if( have_rows('fw_info_blocke') ):
while( have_rows('fw_info_blocke') ): the_row();
$fullwidthImage = get_sub_field('background_imagee');?>
<div class="fullwidth-info-block" style="background-image: url(<?php echo $fullwidthImage['url']; ?>);">
    <div class="container cols-offset3-18 last mb5 pt5">
        <div class="col">
            <div class="container boxed-content last cols-16-8 cols-sm-24">
                <div class="col info-panel vvvvvvv">
                    <!--<?php if( have_rows('info_panel') ):
                while( have_rows('info_panel') ): the_row(); ?>-->
                    <div class="heading-wrapper">
                        <?php get_template_part('template-parts/panel-icon');?>
                        <h3 class="heading heading__md">
                            <?php the_sub_field('title');?>
                        </h3>
                    </div>
                    <div class="content">
                        <p><?php the_sub_field('copy');?></p>
                        <a href="<?php the_sub_field('button_target');?>" class="button button__standard">
                            <?php the_sub_field('button_text');?>
                        </a>
                    </div>
                    <!--<?php endwhile; endif;?>-->
                </div>

            </div>
        </div>
    </div>
</div>
<!--fullwidth-info-block-->
<?php endwhile; endif;?>
<?php get_template_part('template-parts/fullwidth-info-block');?>
<!--
<?php if( have_rows('lower_call_to_action') ):
while( have_rows('lower_call_to_action') ): the_row();
$ctaImage = get_sub_field('background_image');?>
<div class="cta cta--fullwidth cta__dark-overlay <?php the_sub_field('background_align');?>"
    style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container cols-12 pl1 pt5 pb3">
        <div class="col">
            <div class="content">
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