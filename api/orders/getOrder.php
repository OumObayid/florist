<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/../../../includes/config.php';

$conn = new mysqli($config['db_host'],$config['db_user'],$config['db_pass'],$config['db_name']);
$conn->set_charset("utf8");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success"=>false,"message"=>"Erreur connexion DB"]);
    exit;
}

$order_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if(!$order_id){
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Order ID manquant"]);
    exit;
}

$res = $conn->query("SELECT * FROM orders WHERE id=$order_id");
$order = $res->fetch_assoc();
if(!$order){
    http_response_code(404);
    echo json_encode(["success"=>false,"message"=>"Commande non trouvée"]);
    exit;
}

$items_res = $conn->query("SELECT * FROM order_items WHERE order_id=$order_id");
$items = [];
while($item = $items_res->fetch_assoc()){
    $items[] = $item;
}
$order['items'] = $items;

echo json_encode($order);
?>
