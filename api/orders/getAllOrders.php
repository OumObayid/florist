<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include __DIR__ . '/../../../includes/config.php';

$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
$conn->set_charset("utf8");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Eviter les doubles slashs
$base_url_api = rtrim($config['base_url_api'] ?? '', '/');

$orders = [];
$res = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
if (!$res) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la lecture des commandes"]);
    exit;
}

while ($row = $res->fetch_assoc()) {
    $order_id = (int)$row['id'];

    // Récupérer les items et infos produit (image path brut)
    $items_res = $conn->query("
        SELECT oi.id, oi.product_id, oi.quantity, oi.price,
               p.nom AS product_nom, p.image_path AS product_image
        FROM order_items oi
        JOIN produits p ON oi.product_id = p.id
        WHERE oi.order_id = $order_id
    ");

    $items = [];
    if ($items_res) {
        while ($item = $items_res->fetch_assoc()) {
            // Préfixer l'URL de l'image côté PHP, en évitant les doubles '/'
            if (!empty($item['product_image'])) {
                $item['product_image'] = $base_url_api . '/' . ltrim($item['product_image'], '/');
            }
            $items[] = $item;
        }
    }

    $row['items'] = $items;
    $orders[] = $row;
}

// Réponse JSON
echo json_encode([
    "success" => true,
    "orders" => $orders
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit;
