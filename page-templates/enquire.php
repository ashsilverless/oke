<?php
/**
 * ============== Template Name: Enquire Page
 *
 * @package oke
 */
get_header();
$term = get_queried_object();?>

<!-- ******************* Hero ******************* -->
<?php get_template_part("template-parts/left-hero"); ?>
<div class="outer-wrapper">
    <?php get_template_part("template-parts/floating-heading"); ?>
    <div class="container pr1 pl1 grid-gap cols-14-10 cols-md-24">

        <div class="col">
            <div class="container cols-24 pt3 pb3">
                <div class="col">
                    <?php the_field('copy');?>
                </div>
            </div>
            <div class="container cols-12 pb3">
                <div class="col">
                    <?php if( have_rows('contact_info', 'options') ):
                    while( have_rows('contact_info', 'options') ): the_row(); ?>

                    <p><strong>Telephone:</strong><br />
                        <?php the_sub_field('phone');?></p>
                    <p><strong>Email:</strong><br /><?php the_sub_field('email');?></p>
                    <?php endwhile; endif;?>
                    <?php if( have_rows('contact_info', 'options') ):
                    while( have_rows('contact_info', 'options') ): the_row(); ?>
                    <p><strong>Address:</strong><br />Okavango Delta Explorations<br />
                        <?php the_sub_field('address');?></p>
                    <?php endwhile; endif;?>
                </div>
                <div class="col">

                </div>
            </div>


        </div>
        <div class="col">
            <div class="sidebar mb5">
                <h4 class="heading heading__md heading__light heading__caps align-center mb1">Contact Us</h4>
                <div class="pb3">
                    <?php echo do_shortcode('[contact-form-7 id="489" title="Enquire Page Form"]');?>
                </div>
            </div>
        </div>
    </div>
</div>
<!--outer-wrapper-->

<?php if( have_rows('fw_info_blocke') ):
while( have_rows('fw_info_blocke') ): the_row();
$fullwidthImage = get_sub_field('background_imagee');?>
<div class="fullwidth-info-block" style="background-image: url(<?php echo $fullwidthImage['url']; ?>);">
    <div class="container cols-offset3-18 cols-sm-24 last mb5 pt5 pl1 pr1">
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
                        <a href="<?php the_sub_field('button_target');?>"
                            class="button button__standard button__standard--fixed-width">
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

<!--
<?php if( have_rows('call_to_action') ):
while( have_rows('call_to_action') ): the_row();
$ctaImage = get_sub_field('background_image');?>

<?php if (get_sub_field('background_image')):?>
<div class="cta cta--fullwidth" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container pr1 pl1 cols-10 pt5 pb7">
        <div class="col enquire">
            <div class="owl-carousel testimonials">
                <?php if( have_rows('testimonial', 'options') ): while( have_rows('testimonial', 'options') ): the_row();?>
                <div>
                    <?php the_sub_field('copy');?>
                    <p>
                        <?php the_sub_field('attribute');?>
                    </p>
                </div>
                <?php endwhile; endif;?>
            </div>
        </div>
    </div>
</div>
<?php endif;?>
<?php endwhile; endif;?>
-->

<?php get_footer();?>