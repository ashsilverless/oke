<?php
$term = get_queried_object();
$heroImage = get_field('banner_image', $term);?>
<div class="hero hero__find h75 lower-grad"
    style="background-image: url(<?php echo $heroImage['url']; ?>); background-color: <?php echo $heroColor; ?>;">
    <div class="container cols">
        <div class="col">
            <div class="hero__content">
                <div class="copy">
                    <h1 class="heading heading__lg heading__caps heading__light"><?php echo $term->name;?> Safaris</h1>
                    <p><?php echo wp_trim_words( term_description($term_id, $term), 30 ); ?></p>
                </div>
            </div>
        </div>
    </div>
</div>
<!--hero-->
