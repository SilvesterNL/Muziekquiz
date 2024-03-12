<?php
    ini_set("session.hash_function","sha512");
    session_start();

    ini_set("max_execution_time",500);


    
    $db_hosti = "localhost";
    $db_useri = "silvester_muziekquiz";
    $db_passi = "tAh4MjAyFCwe8a2xCkGw";
    $db_datai = "silvester_muziekquiz";

    $con = new mysqli($db_hosti,$db_useri,$db_passi,$db_datai);
?>