<?php
/**
 * The template for displaying the footer
 * @package oke
 */
?>

</main>

<footer class="footer">
    <div class="container cols-4-10-4-6">
                <div class="col">
                    <div class="footer-logo">
                        <a href="#">
                            <?php get_template_part('inc/img/ode', 'logo-top');?>
                            <?php get_template_part('inc/img/ode', 'logo-bottom');?>
                        </a>
                    </div>
                </div>
                <div class="col">
                <h3 class="heading heading__sm heading__caps heading__light mb0">Contact</h3>
                    <?php echo do_shortcode('[contact-form-7 id="11" title="Contact form 1"]');?>
                    <?php if( have_rows('contact_info', 'options') ):
                    while( have_rows('contact_info', 'options') ): the_row(); ?>
                    <p class="mb2 mt0"><?php the_sub_field('address');?></p>
                    <p><?php the_sub_field('phone');?><br/>
                    <a href="mailto:<?php the_sub_field('email');?>" class="inline"><?php the_sub_field('email');?></a></p>
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
                    <h3 class="heading heading__sm heading__caps heading__light mb0">Stay In Touch</h3>
                    <p class="mt0">for the latest news and specials</p>
                    <?php echo do_shortcode('[contact-form-7 id="11" title="Contact form 1"]');?>
                </div>
                <div class="col">
                </div>
    </div>
    <div class="container cols-4-20">
        <div class="col oke">
    		<a href="https://silverless.co.uk">
        				<?php get_template_part('inc/img/silverless', 'logo');?>
                    </a>
    	</div>
        <div class="col colophon">
                    &copy; Okavango Delta Explorations <?php echo date ('Y');?>
            <div class="mandatory">
    				    <a href="<?php echo home_url() . '/terms-conditions'; ?>">Terms & Conditions</a>
                        <span class="divider">|</span>
                        <a href="<?php echo home_url() . '/privacy-policy'; ?>">Privacy</a>
    		</div>
    	</div>

    </div>

</footer>

</div><!-- #page -->
<?php wp_footer(); ?>
</body>
</html>
