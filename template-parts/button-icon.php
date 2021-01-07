<div class="button-icon">
    <?php $thisicon = get_sub_field( 'icon')["url"];
    $thisicon   = explode("/wp-content/", $thisicon)[1];?>
    <?php echo file_get_contents("./wp-content/" . $thisicon, FILE_USE_INCLUDE_PATH); ?>
</div>
