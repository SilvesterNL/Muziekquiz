<?php
    ini_set("session.hash_function","sha512");
    session_start();

    ini_set("max_execution_time",500);


    
    $db_hosti = "localhost";
    $db_useri = "root";
    $db_passi = "";
    $db_datai = "muziekquiz";

    $con = new mysqli($db_hosti,$db_useri,$db_passi,$db_datai);
?>