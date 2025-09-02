<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Répondre aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../../includes/config.php';

$conn = new mysqli($config['db_host'],$config['db_user'],$config['db_pass'],$config['db_name']);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success"=>false,"message"=>"Erreur connexion DB"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['id']) || !isset($data['status'])){
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Données invalides"]);
    exit;
}

$stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
$stmt->bind_param("si",$data['status'],$data['id']);
$stmt->execute();
$stmt->close();

echo json_encode(["success"=>true,"message"=>"Statut mis à jour"]);
?>
