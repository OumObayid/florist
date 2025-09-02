<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Checkpoint A - début du script


// Répondre aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Charger la config
$config = include __DIR__ . '/../../../includes/config.php';

// Connexion DB avec mysqli
$conn = new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Forcer charset UTF-8
$conn->set_charset("utf8mb4");

// Requête pour obtenir les catégories
$query = "SELECT id, nom, description, image_path FROM categories";

// Préparer la requête
$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur préparation requête: " . $conn->error
    ]);
    $conn->close();
    exit;
}

// Exécuter la requête
$stmt->execute();

// Récupérer le résultat
$result = $stmt->get_result();
if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur exécution requête: " . $stmt->error
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

// Préparer tableau des catégories
$categories = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['image_path'])) {
        // Transformer le chemin en URL complète
        $row['image'] = $config['base_url_api'] . '/' . $row['image_path'];
    } else {
        $row['image'] = null;
    }
    unset($row['image_path']); // on ne renvoie pas la colonne brute
    $categories[] = $row;
}



// Préparer réponse
$response = [
    "success" => true,
    "message" => "Catégories récupérées avec succès",
    "categories" => $categories
];

// JSON sécurisé
$json = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur encodage JSON : " . json_last_error_msg()
    ]);
    exit;
}

echo $json;

// Libérer et fermer
$stmt->close();
$conn->close();
