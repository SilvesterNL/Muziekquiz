<?php

require "../REQUIRES/config.php";

$stmt = $con->prepare("DELETE FROM lobby WHERE lastactive < NOW() - INTERVAL 10 SECOND");
$stmt->execute();


?>