<div class="carousel_module owl-carousel owl-theme">
    <?php
                    $images = get_sub_field('images');
                    if( $images ):
                    foreach( $images as $image ): ?>
    <div class="carousel_module__item" style="background:url(<?php echo $image; ?>)"></div>
    <?php endforeach; endif; ?>
</div>