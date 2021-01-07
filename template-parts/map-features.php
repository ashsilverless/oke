<?php if ( is_page_template( 'page-templates/accommodation.php' ) ) {?>
<div class="popup-image wrapper">
    <div class="open trigger"><i class="fas fa-map-marked-alt"></i></div>
    <div class="profile-image reveal">
        <?php get_template_part('inc/img/small-map');?>
        <div class="close-trigger"><i class="far fa-times-circle"></i></div>
    </div>
</div>
<?php } else {}?>

<div class="overlay-filter">
    <div class="layer-buttons">
        <p>Water Level</p>
        <div class="form-check form-check-inline layer-buttons__item low">
            <input type="radio" class="form-check-input" id="low" name="inlineMaterialRadiosExample">
            <label class="form-check-label" for="low">Low</label>
        </div>
        <div class="form-check form-check-inline layer-buttons__item high">
            <input type="radio" class="form-check-input" id="high" name="inlineMaterialRadiosExample">
            <label class="form-check-label" for="high">High</label>
        </div>
        <div class="form-check form-check-inline layer-buttons__item off active">
            <input type="radio" class="form-check-input" id="off" name="inlineMaterialRadiosExample" checked>
            <label class="form-check-label" for="off">Off</label>
        </div>
    </div>
    <div>
        <a href="/the-okavango/land/" class="button button__waterlevel button__flood">About the Okavango
            Flood</a>
    </div>
</div>