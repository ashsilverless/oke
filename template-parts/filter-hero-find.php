<?php
$term = get_queried_object();
$heroImage = get_field('hero_background_image');?>
<!--<div class="scrolled-filter">
    <div class="container">
        <div class="col">
            <?php get_template_part("template-parts/type-filter"); ?>
        </div>
    </div>
</div>-->
<div class="hero hero__find h75 lower-grad"
    style="background-image: url(<?php echo $heroImage['url']; ?>); background-color: <?php echo $heroColor; ?>;">
    <div class="container">
        <div class="col">
            <div class="hero__content pr1 pl1">
                <div class="copy">
                    <h1 class="heading heading__lg heading__caps heading__light"><?php the_field('hero_heading');?></h1>
                    <p class=""><?php the_field('hero_copy');?></p>
                </div>

            </div>
        </div>
    </div>
</div>
<!--hero-->
