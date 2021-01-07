<?php if( have_rows('fw_info_block') ):
while( have_rows('fw_info_block') ): the_row();
$fullwidthImage = get_sub_field('background_image');?>
<div class="fullwidth-info-block" style="background-image: url(<?php echo $fullwidthImage['url']; ?>);">
    <div class="container cols-offset3-18 cols-sm-24 last mb5 pt5  pl1 pr1">
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