<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Répondre directement aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Charger la config
$config = include __DIR__ . '/../../../includes/config.php';

// Connexion DB
$conn = new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);
$conn->set_charset("utf8");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents("debug.txt", json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);

if (!isset($data['id']) || !isset($data['role'])) {
    echo json_encode(["success" => false, "message" => "Paramètres manquants"]);
    exit;
}

$id = intval($data['id']);
$role = $data['role'];

// Vérifier que le rôle est valide
if (!in_array($role, ['admin', 'user'])) {
    echo json_encode(["success" => false, "message" => "Rôle invalide"]);
    exit;
}

// ⚡️ Ici on utilise des `?` pour sécuriser la requête
$sql = "UPDATE users SET role = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $role, $id); 
// "s" = string pour role, "i" = integer pour id

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Rôle mis à jour"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur : " . $stmt->error]);
}

$stmt->close();
$conn->close();
