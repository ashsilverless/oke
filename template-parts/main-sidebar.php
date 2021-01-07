<div class="sticky">
    <?php if (is_page('land')) {?>   
    
        <?php if( have_rows('okavango_call_to_action', 'options') ):
            while( have_rows('okavango_call_to_action', 'options') ): the_row();
            $ctaImage = get_sub_field('background_image');?>
            <div class="cta cta--sidebar mb3" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
                <div class="container">
                    <div class="col">
                        <div class="content">
                            <h3 class="heading heading__md heading__caps heading__light"><?php the_sub_field('heading');?></h3>
                            <p><?php the_sub_field('copy');?></p>
                            <a href="<?php the_sub_field('button_target');?>"
                                class="button button__standard"><?php the_sub_field('button_text');?></a>
                        </div>
                    </div>
                </div>
            </div>
        
        <?php endwhile; endif;?>   
    
    <?php } elseif (is_page('concessions')) {?>
    
    <?php if( have_rows('concessions_call_to_action', 'options') ):
        while( have_rows('concessions_call_to_action', 'options') ): the_row();
        $ctaImage = get_sub_field('background_image');?>
        <div class="cta cta--sidebar mb3" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
            <div class="container">
                <div class="col">
                    <div class="content">
                        <h3 class="heading heading__md heading__caps heading__light"><?php the_sub_field('heading');?></h3>
                        <p><?php the_sub_field('copy');?></p>
                        <a href="<?php the_sub_field('button_target');?>"
                            class="button button__standard"><?php the_sub_field('button_text');?></a>
                    </div>
                </div>
            </div>
        </div>
    
    <?php endwhile; endif;?>    
        
    <?php }?>
    
    
    
    
    
    
    
<?php if (is_page( array('land', 'concessions'))) {?>



    <h2 class="heading heading__md heading__caps mb1">Concessions in The Okavango Delta</h2>
    <?php
$terms = get_terms( array(
'taxonomy' => 'destinations',
//'hide_empty' => false,
) );
//$number = 1;
foreach ($terms as $term):
$destinationImage = get_field('banner_image', $term);
$visibility = get_field('visible_as_concession', $term);
?>
    <div class="destination-summary__item mb1" style="<?php if ($visibility == 'no') {
        echo 'display:none';
    };?>">

        <a href="<?php echo $term_link = get_term_link( $term ); ?>">
            <h2 class="heading heading__xs heading__caps heading__body"><?php echo $term->name;?></h2>

            <div class="image" style="background:url(<?php echo $companyImage['url']; ?>);"></div>
            <?php the_field('short_description', $term);?>
        </a>
    </div>
    <?php
//$number++;
endforeach;?>
</div>
<?php } else {?>




<?php if( ! is_page( 'safari-planning' ) ) {?>

<?php if( have_rows('planning_call_to_action', 'options') ):
while( have_rows('planning_call_to_action', 'options') ): the_row();
$ctaImage = get_sub_field('background_image');?>

<div class="cta cta--sidebar" style="background-image: url(<?php echo $ctaImage['url']; ?>);">
    <div class="container">
        <div class="col">
            <div class="content">
                <h3 class="heading heading__md heading__caps heading__light"><?php the_sub_field('heading');?></h3>
                <p><?php the_sub_field('copy');?></p>
                <a href="<?php the_sub_field('button_target');?>"
                    class="button button__standard"><?php the_sub_field('button_text');?></a>
            </div>
        </div>
    </div>
</div>

<?php endwhile; endif;
}
?>
<?php
    wp_nav_menu(array(
    'theme_location'  => 'travel-advice-menu',
    'container_class' => 'adviceMenu'
    ));
}?>
