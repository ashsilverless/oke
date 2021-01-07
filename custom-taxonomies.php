<?php
/*
// ========= Custom Taxonomies - Destination ============
*/

add_action( 'init', 'taxonomy_destination', 0 );
add_action( 'init', 'taxonomy_type', 0 );
add_action( 'init', 'taxonomy_focus', 0 );
add_action( 'init', 'taxonomy_company', 0 );
add_action( 'init', 'taxonomy_activity', 0 );
add_action( 'init', 'taxonomy_season', 0 );

// ====== Destination
function taxonomy_destination() {

    $labels = array(
        'name'              => _x( 'Destinations', 'taxonomy general name' ),
        'singular_name'     => _x( 'Destination', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Destination'   ),
        'all_items'         => __( 'All Destinations'     ),
        'parent_item'       => __( 'Parent Destination'   ),
        'parent_item_colon' => __( 'Parent Destination:'  ),
        'edit_item'         => __( 'Edit Destination'     ),
        'update_item'       => __( 'Update Destination'   ),
        'add_new_item'      => __( 'Add New Destination'  ),
        'new_item_name'     => __( 'New Destination Name' ),
        'menu_name'         => __( '- Destinations'         )
    );

    register_taxonomy( 'destinations', array( 'camps' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'destinations', 'hierarchical' => true )
    ));
}

// ====== Type
function taxonomy_type() {

    $labels = array(
        'name'              => _x( 'Types', 'taxonomy general name' ),
        'singular_name'     => _x( 'Type', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Types'   ),
        'all_items'         => __( 'All Types'     ),
        'parent_item'       => __( 'Parent Type'   ),
        'parent_item_colon' => __( 'Parent Type:'  ),
        'edit_item'         => __( 'Edit Type'     ),
        'update_item'       => __( 'Update Type'   ),
        'add_new_item'      => __( 'Add New Type'  ),
        'new_item_name'     => __( 'New Type Name' ),
        'menu_name'         => __( '- Types'         )
    );

    register_taxonomy( 'type', array( 'camps', 'itineraries' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'type', 'hierarchical' => false )
    ));
}

// ====== Focus
function taxonomy_focus() {

    $labels = array(
        'name'              => _x( 'Focus', 'taxonomy general name' ),
        'singular_name'     => _x( 'Focus', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Focus'   ),
        'all_items'         => __( 'All Focus'     ),
        'parent_item'       => __( 'Parent Focus'   ),
        'parent_item_colon' => __( 'Parent Focus:'  ),
        'edit_item'         => __( 'Edit Focus'     ),
        'update_item'       => __( 'Update Focus'   ),
        'add_new_item'      => __( 'Add New Focus'  ),
        'new_item_name'     => __( 'New Focus Name' ),
        'menu_name'         => __( '- Focus'         )
    );

    register_taxonomy( 'focus', array( 'camps', 'itineraries' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'focus', 'hierarchical' => false )
    ));
}

// ====== Company
function taxonomy_company() {

    $labels = array(
        'name'              => _x( 'Company', 'taxonomy general name' ),
        'singular_name'     => _x( 'Company', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Companies'   ),
        'all_items'         => __( 'All Companies'     ),
        'parent_item'       => __( 'Parent Company'   ),
        'parent_item_colon' => __( 'Parent Company:'  ),
        'edit_item'         => __( 'Edit Company'     ),
        'update_item'       => __( 'Update Company'   ),
        'add_new_item'      => __( 'Add New Company'  ),
        'new_item_name'     => __( 'New Company Name' ),
        'menu_name'         => __( '- Companies'         )
    );

    register_taxonomy( 'company', array( 'camps', 'itineraries' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'company', 'hierarchical' => false )
    ));
}

// ====== Activity
function taxonomy_activity() {

    $labels = array(
        'name'              => _x( 'Activity', 'taxonomy general name' ),
        'singular_name'     => _x( 'Activity', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Activities'   ),
        'all_items'         => __( 'All Activities'     ),
        'parent_item'       => __( 'Parent Activity'   ),
        'parent_item_colon' => __( 'Parent Activity:'  ),
        'edit_item'         => __( 'Edit Activity'     ),
        'update_item'       => __( 'Update Activity'   ),
        'add_new_item'      => __( 'Add New Activity'  ),
        'new_item_name'     => __( 'New Activity Name' ),
        'menu_name'         => __( '- Activities'         )
    );

    register_taxonomy( 'activity', array( 'camps' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'activity', 'hierarchical' => false )
    ));
}

// ====== Seasons
function taxonomy_season() {

    $labels = array(
        'name'              => _x( 'Seasons', 'taxonomy general name' ),
        'singular_name'     => _x( 'Season', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Seasons'   ),
        'all_items'         => __( 'All Seasons'     ),
        'parent_item'       => __( 'Parent Season'   ),
        'parent_item_colon' => __( 'Parent Season:'  ),
        'edit_item'         => __( 'Edit Season'     ),
        'update_item'       => __( 'Update Season'   ),
        'add_new_item'      => __( 'Add New Season'  ),
        'new_item_name'     => __( 'New Season Name' ),
        'menu_name'         => __( '- Seasons'         )
    );

    register_taxonomy( 'season', array( 'itineraries' ), array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'season', 'hierarchical' => true )
    ));
}
