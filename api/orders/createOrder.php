<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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

// Connexion DB
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
$conn->set_charset("utf8");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Lire les données POST
$data = json_decode(file_get_contents("php://input"), true);
if (
    !$data || !isset(
        $data['user_id'], 
        $data['items'], 
        $data['payment_mode'],
        $data['card_number'], 
        $data['card_expiry_date'], 
        $data['card_holder_name'], 
        $data['card_cvv']
    )
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

// Calcul du total
$total = 0;
foreach ($data['items'] as $item) {
    if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Données d'article invalides"]);
        exit;
    }
    $total += $item['quantity'] * $item['price'];
}

// Création commande
$stmt = $conn->prepare("INSERT INTO orders (user_id,total,payment_mode,status) VALUES (?,?,?,?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête orders : ".$conn->error]);
    exit;
}
$status = "pending";
$stmt->bind_param("idss", $data['user_id'], $total, $data['payment_mode'], $status);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

// Insertion order_items (reste inchangé)
foreach ($data['items'] as $item) {
    $stmt = $conn->prepare("INSERT INTO order_items (order_id,product_id,quantity,price) VALUES (?,?,?,?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur préparation order_items : ".$conn->error]);
        exit;
    }
    $stmt->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $item['price']);
    $stmt->execute();
    $stmt->close();
}

// Mettre à jour les infos paiement
$stmt = $conn->prepare("
    UPDATE users 
    SET card_number = ?, card_expiry_date = ?, card_holder_name = ?, card_cvv = ? 
    WHERE id = ?
");
if ($stmt) {
    $stmt->bind_param(
        "ssssi", 
        $data['card_number'], 
        $data['card_expiry_date'], 
        $data['card_holder_name'], 
        $data['card_cvv'], 
        $data['user_id']
    );
    $stmt->execute();
    $stmt->close();
}

// Vider le panier
$stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ?");
if ($stmt) {
    $stmt->bind_param("i", $data['user_id']);
    $stmt->execute();
    $stmt->close();
}

// Préparer les items avec product_name et product_image pour le JSON
$itemsForResponse = array_map(function($item) {
    return [
        'product_id' => $item['product_id'],
        'quantity' => $item['quantity'],
        'price' => $item['price'],
        'product_name' => $item['product_name'] ?? null,
        'product_image' => $item['product_image'] ?? null,
    ];
}, $data['items']);

// Réponse JSON
echo json_encode([
    "success" => true,
    "order" => [
        "id" => $order_id,
        "user_id" => $data['user_id'],
        "total" => $total,
        "payment_mode" => $data['payment_mode'],
        "status" => $status,
        "items" => $itemsForResponse
    ]
]);
?>
