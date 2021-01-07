<div class="filter-wrapper mockup-filter open">
    <div class="container pl1 pr1 cols-3-13-8 cols-sm-24">
        <div class="col">
            <?php if ( is_page_template( 'page-templates/accommodation.php' ) ) {?>
            <?php get_template_part('inc/img/small-map');?>
            <?php } else {}?>
        </div>
        <div class="col filter-main">
            <div class="filter-heading">
                <p class="heading__body heading__caps">Filter By:</p>
            </div>
            <div class="filter-by">
                <div class="filters__cost">
                    <p class="heading__body heading__sm heading__caps">COST</p>
                    <div class="col ">
                        <fieldset class="filter-group checkboxes">
                            <div class="form-check pretty p-default p-round">
                                <input type="checkbox" class="switch" id="low" value=".low">
                                <label class="form-check-label" for="low">$</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="switch" id="med" value=".med">
                                <label class="form-check-label" for="med">$$</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="switch" id="high" value=".high">
                                <label class="form-check-label" for="high">$$$</label>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div class="filters__focus">
                    <p class="heading__body heading__sm heading__caps">Focus</p>
                    <div class="col ">
                        <fieldset class="filter-group checkboxes">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="land" value=".land">
                                <label class="form-check-label" for="land">Land</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="water" value=".water">
                                <label class="form-check-label" for="water">Water</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="waterland" value=".water-land">
                                <label class="form-check-label" for="waterland">Water & Land</label>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="filters__type">
                    <p class="heading__sm heading__caps heading__body">Type</p>
                    <div class="col filter-type ">
                        <div class="checkboxes-wrapper">
                            <fieldset class="filter-group checkboxes">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="family" value=".family">
                                    <label class="form-check-label" for="family">Family</label>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="honeymoon" value=".honeymoon">
                                    <label class="form-check-label" for="honeymoon">Honeymoon</label>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="riding" value=".riding">
                                    <label class="form-check-label" for="riding">Riding</label>
                                </div>
                            </fieldset>
                        </div>
                        <div class="checkboxes-wrapper">
                            <fieldset class="filter-group checkboxes">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="mobile" value=".mobile">
                                    <label class="form-check-label" for="mobile">Mobile</label>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="walking" value=".walking">
                                    <label class="form-check-label" for="walking">Walking</label>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="specialistsafaris"
                                        value=".specialistsafaris">
                                    <label class="form-check-label" for="specialistsafaris">Specialist</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col water-level">
            <div class="water-filter-heading">
                <p class="heading__sm heading__caps heading__body">Water Level</p>
            </div>
            <div class="water-filter-cont">
                <div class="layer-buttons">
                    <div class="form-check layer-buttons__item low">
                        <input type="radio" class="form-check-input" id="materialInline1"
                            name="inlineMaterialRadiosExample">
                        <label class="form-check-label" for="materialInline1">Low</label>
                    </div>
                    <div class="form-check layer-buttons__item high">
                        <input type="radio" class="form-check-input" id="materialInline2"
                            name="inlineMaterialRadiosExample">
                        <label class="form-check-label" for="materialInline2">High</label>
                    </div>
                    <div class="form-check layer-buttons__item off active">
                        <input type="radio" class="form-check-input" id="materialInline3"
                            name="inlineMaterialRadiosExample" checked>
                        <label class="form-check-label" for="materialInline3">Off</label>
                    </div>
                </div>
                <div class="flood-button">
                    <a href="/the-okavango/land/" class="button button__standard button__flood">
                        About the Okavango Flood
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- ******************* Filter Trigger ******************* -->

    <div class="container hidden pl1 pr1 cols-8-16">


        <div class="col dark-filter">
            <span>Filters</span>
            <span class="close-filters"><input type="checkbox" class="switch" id="defaultUncheckedlow" checked>
                <label class="form-check-label" for="defaultUnchecked"></label></span>
        </div>
        <div class="col"></div>
    </div>
</div>