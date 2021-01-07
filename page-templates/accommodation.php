<?php
/**
 * ============== Template Name: Accommodation
 *
 * @package oke
 */
get_header();?>

<!-- ******************* Map Filters ******************* -->

<?php get_template_part("template-parts/accom-map-filter"); ?>


<!-- ******************* Map Component ******************* -->

<?php get_template_part("template-parts/map-component"); ?>

<div class="outer-wrapper mt5 mb3">
    <div class="container pr1 pl1 cols-14-10 cols-sm-24">
        <div class="col pr3">
            <div class="leading-copy">
                <?php the_field('leading_copy_paragraph');?>
            </div>
            <div class="mb3">
                <?php the_field('page_copy');?>
            </div>

            <!--cta focus-->
        </div>
        <div class="col">
            <h4 class="heading heading__md heading__caps heading__body mb1">Our Travel Partners</h4>
            <div class="company-summary toggle-wrapper">
                <?php
			$terms = get_terms( array(
			    'taxonomy' => 'company'
			) );
			$number = 1;
			foreach ($terms as $term):
			$companyImage = get_field('banner_image', $term);
			?>
                <div class="company-summary__item">
                    <input class="toggle" id="id-<?php echo $number;?>" type="checkbox" />
                    <div class="header">
                        <label class="group" for="id-<?php echo $number;?>">
                            <h2 class="heading heading__xs heading__caps heading__body"><?php echo $term->name;?></h2>
                            <?php get_template_part("template-parts/arrow-large"); ?>
                        </label>
                    </div>
                    <div class="body hideable">
                        <div class="image" style="background:url(<?php echo $companyImage['url']; ?>);">
                            <a href="<?php echo $term_link = get_term_link( $term ); ?>"></a>
                        </div>
                        <?php the_field('short_description', $term);?>
                        <a href="<?php echo $term_link = get_term_link( $term ); ?>" class="button"><span>View
                                All</span>ACCOMMODATION</a>
                    </div>
                </div>
                <?php
			$number++;
			endforeach;?>
            </div>
            <!--company-sidebar-->
        </div>
    </div>
</div>
<!--outer wrapper-->
<?php get_footer();?>