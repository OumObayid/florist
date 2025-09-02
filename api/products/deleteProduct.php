<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Répondre directement aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Charger la config
$config = include __DIR__ . '/../../../includes/config.php';

// Connexion DB
$conn = new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);
$conn->set_charset("utf8");

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Lecture de l'ID envoyé via DELETE
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id > 0) {
    // Récupérer le chemin de l'image avant suppression
    $imagePath = null;
    $stmt = $conn->prepare("SELECT image_path FROM produits WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagePath);
    $stmt->fetch();
    $stmt->close();

    // Supprimer l'image du dossier si elle existe
    if ($imagePath) {
        $fullPath = __DIR__ . '/../' . $imagePath; // adapte le chemin relatif si besoin
        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }

    // Supprimer le produit dans la base
    $stmt = $conn->prepare("DELETE FROM produits WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Suppression réussie"]);
    } else {
        echo json_encode(["success" => false, "message" => "Échec de la suppression ou produit introuvable."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "ID non fourni ou invalide."]);
}

$conn->close();
?>
