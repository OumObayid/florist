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

// Récupération des données de la requête
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si itemId est présent dans la requête
if (empty($data['itemId'])) {
    echo json_encode(["success" => false, "message" => "Données manquantes : itemId requis."]);
    exit;
}

$itemId = $data['itemId'];

// Vérification de l'existence du panier pour cet item
$stmt = $conn->prepare("SELECT cart_id FROM cart_items WHERE id = ?");
$stmt->bind_param("i", $itemId);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $cart = $result->fetch_assoc();
    $cartId = $cart['cart_id'];
    $stmt->close();

    // Supprimer l'article
    $deleteStmt = $conn->prepare("DELETE FROM cart_items WHERE id = ?");
    $deleteStmt->bind_param("i", $itemId);
    $deleteStmt->execute();
    $deleteStmt->close();

    // Vérifier si le panier est vide après suppression
    $checkStmt = $conn->prepare("SELECT COUNT(*) AS itemCount FROM cart_items WHERE cart_id = ?");
    $checkStmt->bind_param("i", $cartId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $itemCount = $checkResult->fetch_assoc()['itemCount'];
    $checkStmt->close();

    // Si le panier est vide, supprimer également le panier
    if ($itemCount == 0) {
        $deleteCartStmt = $conn->prepare("DELETE FROM carts WHERE id = ?");
        $deleteCartStmt->bind_param("i", $cartId);
        $deleteCartStmt->execute();
        $deleteCartStmt->close();
    }

    echo json_encode(["success" => true, "message" => "Produit supprimé du panier"]);
} else {
    echo json_encode(["success" => false, "message" => "Article non trouvé dans le panier."]);
}

$conn->close();
