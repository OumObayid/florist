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

$data = json_decode(file_get_contents("php://input"), true);

// Récupérer l'ID de l'utilisateur passé en paramètre
$userId = isset($data['userId']) ? intval($data['userId']) : 0;

// Si aucun ID utilisateur n'est fourni, renvoyer une erreur
if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "L'ID utilisateur est invalide ou manquant",
        "items" => []
    ]);
    exit;
}

// Récupérer les articles du panier de l'utilisateur
$query = "
    SELECT ci.id AS id, ci.produit_id AS productId, p.image_path AS image, p.nom AS nom, ci.quantity AS quantity, p.prix AS prix
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN produits p ON ci.produit_id = p.id
    WHERE c.user_id = $userId";

$result = mysqli_query($conn, $query);

// Vérifier si la requête a réussi
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des articles du panier"
    ]);
    exit;
}

// Organiser les résultats en tableau
$cartItems = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Forcer les types numériques
    $row['id'] = (int)$row['id'];
    $row['productId'] = (int)$row['productId'];
    $row['quantity'] = (int)$row['quantity'];
    $row['prix'] = (float)$row['prix']; // prix peut contenir décimales

    // Préfixer l'image avec base_url_api
    if (!empty($row['image'])) {
        $row['image'] = $config['base_url_api'] . '/' . $row['image'];
    } else {
        $row['image'] = null;
    }

    $cartItems[] = $row;
}

// Retourner les articles du panier avec un message de succès
echo json_encode([
    "success" => true,
    "message" => "Articles récupérés avec succès",
    "items" => $cartItems
]);

mysqli_close($conn);
