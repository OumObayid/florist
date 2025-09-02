<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$config = include __DIR__ . '/../../../includes/config.php';

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

// Récupérer les données JSON de la requête
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['itemId']) || !isset($data['quantity'])) {
    echo json_encode([
        "success" => false,
        "message" => "Données manquantes. Assurez-vous de transmettre itemId et quantity."
    ]);
    exit;
}

// Conversion en int
$itemId = intval($data['itemId']);
$newQuantity = intval($data['quantity']);

// Préparer la requête sécurisée
$stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
$stmt->bind_param("ii", $newQuantity, $itemId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Quantité mise à jour avec succès."]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la mise à jour de la quantité ou aucun changement effectué."
    ]);
}

$stmt->close();
$conn->close();
?>
