<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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

// Requête SQL avec jointure
$query = "SELECT p.id, p.nom, p.description, p.prix, p.categorie_id, 
                 c.nom AS categorie_nom, p.image_path
          FROM produits p
          INNER JOIN categories c ON p.categorie_id = c.id";

$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur récupération produits: " . $conn->error
    ]);
    $conn->close();
    exit;
}

// Préparer tableau des produits
$products = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['image_path'])) {
        $row['image'] = $config['base_url_api'] . '/' . $row['image_path'];
    } else {
        $row['image'] = null;
    }
    unset($row['image_path']); // on ne renvoie pas la colonne brute
    $products[] = $row;
}

echo json_encode([
    "success" => true,
    "message" => "Produits récupérés avec succès",
    "dataProd" => $products
],JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$conn->close();
