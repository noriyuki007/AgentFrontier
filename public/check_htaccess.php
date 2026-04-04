<?php
if (file_exists('.htaccess')) { echo ".htaccess EXISTS:\n"; echo file_get_contents('.htaccess'); } else { echo ".htaccess MISSING"; }
?>
