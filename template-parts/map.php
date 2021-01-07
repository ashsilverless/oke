<?php
	
	$marker  = get_field("map_marker", "options");
	$contact = get_field("contact_info", "options");
		
	$points = array(
		'type' => 'Feature',
		'geometry' => array(
			'type' => 'Point',
			'coordinates' => array(
				floatval($marker["latitude"]),
				floatval($marker["longitude"])
			)
		),
		'properties' => array(
			'address'    => $contact["address"],
			'phone'      => $contact["telephone"],
			'email'      => $contact["email"]
		)
	);
?>

<div class="map-wrapper">
	<div id='bell-map-contact' points='<?php echo json_encode($points);?>'></div>
</div>