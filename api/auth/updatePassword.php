<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

if (!isset($data['userId'], $data['oldPassword'], $data['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Paramètres manquants"]);
    exit;
}

$userId = intval($data['userId']);
$oldPassword = $data['oldPassword'];
$newPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);

// Vérifier l'ancien mot de passe
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result || !password_verify($oldPassword, $result['password'])) {
    echo json_encode(["success" => false, "message" => "Ancien mot de passe incorrect"]);
    exit;
}

// Mettre à jour le mot de passe
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $newPassword, $userId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Mot de passe mis à jour"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}

$stmt->close();
$conn->close();
