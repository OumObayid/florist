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

// Récupérer les données envoyées en POST
$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data['userId'] ?? 0);
$productId = intval($data['productId'] ?? 0);
$quantity = intval($data['quantity'] ?? 0);

// Vérifier que les paramètres nécessaires sont fournis
if (!$userId || !$productId || !$quantity) {
    echo json_encode(["success" => false, "message" => "Données incomplètes"]);
    exit();
}

// Vérifier si un panier existe déjà pour cet utilisateur
$stmt = $conn->prepare("SELECT id FROM carts WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$cart = $result->fetch_assoc();
$stmt->close();

// Si le panier n'existe pas, on en crée un nouveau
if (!$cart) {
    $stmt = $conn->prepare("INSERT INTO carts (user_id) VALUES (?)");
    $stmt->bind_param("i", $userId);
    if ($stmt->execute()) {
        $cartId = $stmt->insert_id;
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du panier"]);
        exit();
    }
    $stmt->close();
} else {
    $cartId = $cart['id'];
}

// Vérifier si le produit est déjà dans le panier
$stmt = $conn->prepare("SELECT id, quantity FROM cart_items WHERE cart_id = ? AND produit_id = ?");
$stmt->bind_param("ii", $cartId, $productId);
$stmt->execute();
$result = $stmt->get_result();
$item = $result->fetch_assoc();
$stmt->close();

if ($item) {
    // Mettre à jour la quantité si le produit est déjà dans le panier
    $newQuantity = $item['quantity'] + $quantity;
    $stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
    $stmt->bind_param("ii", $newQuantity, $item['id']);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour de la quantité"]);
        exit();
    }
    $stmt->close();
} else {
    // Ajouter le produit au panier
    $stmt = $conn->prepare("INSERT INTO cart_items (cart_id, produit_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $cartId, $productId, $quantity);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout du produit au panier"]);
        exit();
    }
    $stmt->close();
}

// Récupérer les informations de l'article ajouté pour renvoyer une réponse détaillée
$stmt = $conn->prepare("SELECT ci.id, p.nom, ci.quantity
                        FROM cart_items ci
                        JOIN produits p ON ci.produit_id = p.id
                        WHERE ci.cart_id = ? AND ci.produit_id = ?");
$stmt->bind_param("ii", $cartId, $productId);
$stmt->execute();
$result = $stmt->get_result();
$addedItem = $result->fetch_assoc();
$stmt->close();

if ($addedItem) {
    echo json_encode([
        "success" => true,
        "item" => [
            "id" => $addedItem['id'],
            "nom" => $addedItem['nom'],
            "quantity" => $addedItem['quantity']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la récupération des informations du produit"]);
}

// Fermer la connexion
$conn->close();
