<?php
/**
 * The template for displaying the footer
 * @package oke
 */
?>

</main>
<?php
if( get_field('select_call_to_action_type') == 'page' ) {
  if( have_rows('on-page_cta') ):
    while( have_rows('on-page_cta') ): the_row();
        $ctaImage = get_sub_field('background_image');?>
<div class="cta cta__site-wide" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container cols-offset3-18 last pl1 pr1">
        <div class="col">
            <h1 class="heading heading__md heading__caps heading__light slow-fade"><?php the_sub_field('heading');?>
            </h1>
            <p class="heading heading__light heading__body"><?php the_sub_field('copy');?></p>
            <a href="<?php the_sub_field('button_target');?>" class="button"><?php the_sub_field('button_text');?></a>
        </div>
    </div>
</div>
<!--cta fullwidth-->
<?php endwhile; endif;?>

<?php } else {?>

<?php if( have_rows('site-wide_cta', 'options') ):
            while( have_rows('site-wide_cta', 'options') ): the_row();
            $ctaImage = get_sub_field('background_image');?>
<div class="cta cta__site-wide" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container cols-offset3-18 last pl1 pr1">
        <div class="col">
            <h1 class="heading heading__md heading__caps heading__light slow-fade"><?php the_sub_field('heading');?>
            </h1>
            <p class="heading heading__light heading__body"><?php the_sub_field('copy');?></p>
            <a href="<?php the_sub_field('button_target');?>" class="button"><?php the_sub_field('button_text');?></a>
        </div>
    </div>
</div>
<!--cta fullwidth-->
<?php endwhile; endif;?>



<?php }?>

<footer class="footer">
    <div class="container pr1 pl1 cols-4-6-1-3-11 cols-md-12 cols-sm-24">
        <div class="col">
            <div class="footer-logo">
                <a href="<?php echo site_url(  ); ?>">
                    <?php get_template_part('inc/img/ode', 'logo-top');?>
                    <?php get_template_part('inc/img/ode', 'logo-bottom');?>
                </a>
            </div>
            <?php if( have_rows('contact_info', 'options') ):
            while( have_rows('contact_info', 'options') ): the_row(); ?>
            <p><?php the_sub_field('phone');?><br />
                <a href="mailto:<?php the_sub_field('email');?>" class="inline"><?php the_sub_field('email');?></a>
            </p>
            <?php endwhile; endif;?>
            <div class="social">
                <?php if( have_rows('social_media', 'option') ):
                while( have_rows('social_media', 'option') ): the_row(); ?>
                <a href="<?php the_sub_field('url'); ?>">
                    <i class="fab fa-<?php the_sub_field('label'); ?>"></i>
                </a>
                <?php endwhile; endif; ?>
            </div>
        </div>
        <div class="col">
            <h3 class="heading mb1 heading__sm heading__caps heading__light mb0">Join Our Newsletter</h3>
            <?php echo do_shortcode('[wd_hustle id="1" type="embedded"/]');?>
        </div>
        <div class="col"></div>
        <div class="col">
            <h3 class="heading mb1 heading__sm heading__caps heading__light mb0">Links</h3>
            <div class="footer-nav">
                <?php wp_nav_menu(array(
                'theme_location'  => 'main-menu',
                'container_class' => 'footer-main'
                ));?>
            </div>
            <div class="footer-nav mt1">
                <?php wp_nav_menu(array(
                'theme_location'  => 'footer-menu',
                'container_class' => 'footer-sub'
                ));?>
            </div>
            <div class="footer-nav mt1">
                <ul class="menu">
                    <li><a href="<?php echo home_url() . '/terms-conditions'; ?>">Terms & Conditions</a></li>
                    <li><a href="<?php echo home_url() . '/privacy-policy'; ?>">Privacy</a></li>
                </ul>
            </div>
        </div>
        <div class="col">
            <h3 class="heading mb1 heading__sm heading__caps heading__light mb0">Accreditation</h3>
            <div class="accred">
                <?php if( have_rows('accreditation','options') ): ?>
                <?php while( have_rows('accreditation','options') ): the_row();?>
                <div class="accred__logo">
                    <a href="<?php the_sub_field('accreditation_link');?>">
                        <img src="<?php the_sub_field('accreditation_image'); ?>" alt="" /></a>
                </div>
                <?php endwhile; ?>
                <?php endif; ?>

            </div>
        </div>
    </div>






    <!--<div class="col">
        <div class="container cols-6-12-6">
            <div class="col">

            </div>
            <div class="col">

            </div>
            <div class="col">


            </div>
        </div>
    </div>
    <div class="col pr3">

    </div>-->






</footer>
<div class="socket">
    <div class="container cols-4-20 cols-sm-12 pl1">
        <div class="col oke">
            <a href="https://silverless.co.uk">
                <?php get_template_part('inc/img/silverless', 'logo');?>
            </a>
        </div>
        <div class="col colophon">
            &copy; <?php echo date ('Y');?> <?php the_field('trading_information', 'options');?>
        </div>
    </div>
</div>
</div><!-- #page -->
<?php wp_footer(); ?>
</body>

</html>