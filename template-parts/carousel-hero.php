<div class="hero-carousel lower-grad">

    <div class="carousel_module owl-carousel owl-theme mb2">
        <?php $images = get_field('hero_carousel_images');
        if( $images ):
        foreach( $images as $image ): ?>
            <div class="carousel_module__item" style="background:url(<?php echo $image; ?>)"></div>
        <?php endforeach; endif; ?>
    </div>

    <div class="content-wrapper">
        <div class="container grid-gap cols-8-16">
            <div class="col">
            </div>
            <div class="col">
             </div>
        </div>
    </div>

</div><!-- hero carousel-->


<!--
<?php $term = get_queried_object();?>
<div class="slider-wrapper">
    <div class="slider-wrapper__content">
        <h1 class="heading heading__lg heading__light heading__caps">
            <?php if ( is_tax('company', $term) ) {
                echo $term->name;
            } else {
                the_title();
            } ?>
        </h1>
        <h2 class="heading heading__sm heading__light heading__alt">
            <?php if ( is_front_page() && is_home() ) {
              // Default homepage - empty
            } elseif ( is_singular( 'camps' ) ) {
              the_terms( $post->ID, 'destinations');
              } elseif ( is_singular( 'itineraries' ) ) {
              the_field('sub_headline');
            } elseif ( is_tax('company') ) {
              the_field('sub_headline', $term);
            } else {
              echo 'all else';
            }
            ?>
        </h2>
    </div>
    <div id="slider">
        <a href="#" class="control_next">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 19.5 40" style="enable-background:new 0 0 19.5 40;" xml:space="preserve">
                <path class="st0" d="M19.5,20L0,0c0,0,6,11,6,20S0,40,0,40L19.5,20z"/>
            </svg>
        </a>
        <a href="#" class="control_prev">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 19.5 40" style="enable-background:new 0 0 19.5 40;" xml:space="preserve">
                <path class="st0" d="M19.5,20L0,0c0,0,6,11,6,20S0,40,0,40L19.5,20z"/>
            </svg>
        </a>
        <?php
        $images = get_field('hero_carousel_images');
        if( $images ): ?>
            <ul>
            <?php foreach( $images as $image ): ?>
                <li>
                    <div class="slider-image" style="background:url(<?php echo $image; ?>)"></div>
                </li>
            <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>
</div>-->
