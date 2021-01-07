<div class="filter-header">
    <form class="controls" id="Filters">
        <div class="rotated-label">Filter</div>
        <div class="filter-header__wrapper">
            <div class="container pl1 pr1">
                <div class="col filter-header__item">
                    <fieldset class="filter-group checkboxes">
                        <h4 class="heading heading__body heading__sm heading__caps">COST</h4>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="switch" id="low" value=".low">
                            <label class="form-check-label" for="low">$</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="switch" id="med" value=".med">
                            <label class="form-check-label" for="med">$$</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="switch" id="high" value=".high">
                            <label class="form-check-label" for="high">$$$</label>
                        </div>
                    </fieldset>
                </div>
                <div class="col filter-header__item">
                    <fieldset class="filter-group checkboxes">
                        <h4 class="heading heading__body heading__sm heading__caps">TYPES</h4>
                        <div class="split-group">
                            <div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="family" value=".family">
                                    <label class="form-check-label" for="family">Family</label>
                                </div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="honeymoon" value=".honeymoon">
                                    <label class="form-check-label" for="honeymoon">Honeymoon</label>
                                </div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="mobile" value=".mobile">
                                    <label class="form-check-label" for="mobile">Mobile</label>
                                </div>
                            </div>
                            <div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="riding" value=".riding">
                                    <label class="form-check-label" for="riding">Riding</label>
                                </div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="specialist" value=".specialist">
                                    <label class="form-check-label" for="specialist">Specialist</label>
                                </div>
                                <div class="checkboxes-wrapper">
                                    <input type="checkbox" class="form-check-input" id="walking" value=".walking">
                                    <label class="form-check-label" for="walking">Walking</label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="col filter-header__item">
                    <fieldset class="filter-group checkboxes">
                        <h4 class="heading heading__body heading__sm heading__caps">Season</h4>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="jan-mar" value=".jan-mar">
                            <label class="form-check-label" for="jan-mar">Jan - Mar</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="apr-jun" value=".apr-jun">
                            <label class="form-check-label" for="apr-jun">Apr - Jul</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="jul-oct" value=".jul-oct">
                            <label class="form-check-label" for="jul-oct">Aug - Oct</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="nov-dec" value=".nov-dec">
                            <label class="form-check-label" for="nov-dec">Nov - Dec</label>
                        </div>
                    </fieldset>
                </div>
                <div class="col filter-header__item">
                    <fieldset class="filter-group checkboxes">
                        <h4 class="heading heading__body heading__sm heading__caps">Nights</h4>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="one-to-three" value=".one-to-three">
                            <label class="form-check-label" for="one-to-three">1 - 3</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="four-to-six" value=".four-to-six">
                            <label class="form-check-label" for="four-to-six">4 - 6</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="seven-to-nine" value=".seven-to-nine">
                            <label class="form-check-label" for="seven-to-nine">7 - 9</label>
                        </div>
                        <div class="checkboxes-wrapper">
                            <input type="checkbox" class="form-check-input" id="more-than-nine" value=".more-than-nine">
                            <label class="form-check-label" for="more-than-nine">10+</label>
                        </div> 
                    </fieldset>
                </div>
                <div class="col results">
                    <div class="filtered-result">
                    <h3 class="heading heading__md heading__caps align-center"><span id="filter-count"></span> Safaris Match Your Criteria</h3>
                    </div>
                    <button id="Reset" class="filter-reset">Clear Filters</button>
                </div>
            </div>
        </div>
    </form>
    <div class ="container filter-switch">
        <div class="col dark-filter">
            <span>Filters</span>
            <span class="close-filters">
                <input type="checkbox" class="switch filter-switcher" id="defaultUncheckedlow" checked="">
                <label class="form-check-label" for="defaultUnchecked"></label>
            </span>
        </div>
        <div class="col dark-filter featured">
            <span>Featured Safaris</span>
            <span class="close-filters">
                <input type="checkbox" class="feature_switch" id="feat_switch">
                <label class="form-check-label" for="feat_switch"></label>
            </span>
        </div>
    </div>

</div>
