<?php

require "../REQUIRES/config.php";

$stmt = $con->prepare("UPDATE lobby SET lastactive = NOW()");
$stmt->execute();

?>