<?php
/**
 * Header
 *
 * @package oke
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.typekit.net/ypi6ffg.css">
    <!--TYPEKIT INJECT-->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
        integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css" />
    <link rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.0/mapbox-gl-geocoder.css"
        type="text/css" />
    <link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon.ico" type="image/x-icon" />

	<!-- Global site tag (gtag.js) - Google Analytics -->

	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-74193652-1"></script>

	<script>

	  window.dataLayer = window.dataLayer || [];

	  function gtag(){dataLayer.push(arguments);}

	  gtag('js', new Date());

	  gtag('config', 'UA-74193652-1');

	</script>
	
    <?php wp_head(); ?>

</head>

<body id="body" <?php body_class(); ?>>
    <div id="search-overlay" class="search-wrapper">
        <div>
            <div class="container cols-8 cols-sm-24 pr1 pl1">
                <div class="col">
                    <div class="logo">
                        <a href="<?php echo get_home_url(); ?>">
                            <?php get_template_part('inc/img/ode', 'logo-top');?>
                            <?php get_template_part('inc/img/ode', 'logo-bottom');?>
                        </a>
                    </div>
                    <div class="search-nav">
                        <?php wp_nav_menu(array(
                        'theme_location'  => 'main-menu',
                        'container_class' => 'mainMenu'
                        ));?>
                    </div>
                </div>
                <div class="col">
                    <form role="search" method="get" class="main-search-form" action="<?php echo home_url('/'); ?>">
                        <input id="search-input" name="s" type="search" value="<?php echo get_search_query(); ?>"
                            placeholder="<?php echo esc_attr_x('Search', 'placeholder'); ?>" />
                        <input type="submit" class="search-submit" value="&#xf002;" />
                    </form>
                </div>
                <div class="col">
                    <div class="close-search"><i class="fas fa-window-close"></i>Close</div>
                </div>
            </div>
        </div>
    </div>
    <!--search-wrapper-->
    <div id="page" class="site-wrapper">
        <header id="intersectTest">
            <div class="container pl1 pr1 cols-3-11-2-8  cols-md-24">
                <div class="col">
                    <div class="logo">
                        <a href="<?php echo get_home_url(); ?>">
                            <?php get_template_part('inc/img/ode', 'logo-top');?>
                            <?php get_template_part('inc/img/ode', 'logo-bottom');?>
                        </a>
                        <a class="toggle-btn"><i class="fa fa-bars"></i></a>
                    </div>
                </div>
                <div class="col nav-main">
                    <nav id="nav">
                        <div class="mobile-home"><a href="<?php echo get_home_url(); ?>"><i class="fas fa-home"></i></a>
                        </div>
                        <?php
                            wp_nav_menu(array(
                            'theme_location'  => 'secondary-menu',
                            'container_class' => 'secondaryMenu'
                            ));

                            wp_nav_menu(array(
                            'theme_location'  => 'main-menu',
                            'container_class' => 'mainMenu'
                            ));
                        ?>
                    </nav>
                    <div class="hidden-search">
                        <form role="search" method="get" class="main-search-form" action="<?php echo home_url('/'); ?>">
                            <input id="search-input" name="s" type="search" value="<?php echo get_search_query(); ?>"
                                placeholder="<?php echo esc_attr_x('Search', 'placeholder'); ?>" />
                            <input type="submit" class="search-submit" value="&#xf002;" />
                        </form>
                    </div>
                    <div class="hidden-contact">
                        <?php if( have_rows('contact_info', 'options') ):
                            while( have_rows('contact_info', 'options') ): the_row(); ?>
                        <a href="mailto:<?php the_sub_field("email"); ?>"><?php the_sub_field("email"); ?></a>
                        <a href="tel:<?php the_sub_field("phone"); ?>"><?php the_sub_field("phone"); ?></a>
                        <?php endwhile; endif;?>
                        <div class="enquire-button">
                            <a href="/enquire" class="button button__enquire">Contact</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="search-trigger">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                <div class="col">
                    <div class="contact">
                        <?php if( have_rows('contact_info', 'options') ):
                            while( have_rows('contact_info', 'options') ): the_row(); ?>
                        <a href="mailto:<?php the_sub_field("email"); ?>"><?php the_sub_field("email"); ?></a>
                        <a href="tel:<?php the_sub_field("phone"); ?>"><?php the_sub_field("phone"); ?></a>
                        <?php endwhile; endif;?>
                        <div class="enquire-button">
                            <a href="/enquire" class="button button__enquire">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <main>
            <!--closes in footer.php-->