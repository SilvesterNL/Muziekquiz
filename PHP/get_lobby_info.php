<?php
session_start();
require "../REQUIRES/config.php";

$lobbycode = $_SESSION['lobbycode'];

header('Content-Type: application/json');

$sql = "SELECT username FROM users WHERE lobbycode = ?";
$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "s", $lobbycode);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$players = [];
while ($row = mysqli_fetch_assoc($result)) {
    $players[] = $row['username'];
}

echo json_encode($players);
?>