<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Répondre aux requêtes préflight OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include __DIR__ . '/../../../includes/config.php';

$conn = new mysqli($config['db_host'],$config['db_user'],$config['db_pass'],$config['db_name']);
$conn->set_charset("utf8");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success"=>false,"message"=>"Erreur connexion DB"]);
    exit;
}

// Lire le JSON envoyé par Angular
$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
if(!$user_id){
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"User ID manquant"]);
    exit;
}

$base_url_api = rtrim($config['base_url_api'], '/'); // éviter les doubles //

$orders = [];
$res = $conn->query("SELECT * FROM orders WHERE user_id=$user_id ORDER BY created_at DESC");
while($row = $res->fetch_assoc()){
    $order_id = $row['id'];

    // Récupérer les items avec infos produit
    $items_res = $conn->query("
        SELECT oi.id, oi.product_id, oi.quantity, oi.price,
               p.nom AS product_nom, p.image_path AS product_image
        FROM order_items oi
        JOIN produits p ON oi.product_id = p.id
        WHERE oi.order_id = $order_id
    ");

    $items = [];
    while($item = $items_res->fetch_assoc()){
        // Ajouter l’URL complète de l’image
        if (!empty($item['product_image'])) {
            $item['product_image'] = $base_url_api . '/' . ltrim($item['product_image'], '/');
        }
        $items[] = $item;
    }

    $row['items'] = $items;
    $orders[] = $row;
}

// Réponse JSON
echo json_encode([
    "success" => true,
    "orders" => $orders
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
