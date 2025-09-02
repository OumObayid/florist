<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$config = include __DIR__ . '/../../../includes/config.php';

$conn = new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

$nom          = $_POST['nom'] ?? '';
$description  = $_POST['description'] ?? '';
$prix         = isset($_POST['prix']) ? (float) $_POST['prix'] : 0;
$categorie_id = isset($_POST['categorie_id']) ? (int) $_POST['categorie_id'] : 0;
$image        = $_FILES['image'] ?? null;

if (empty($nom) || empty($description) || $prix <= 0 || $categorie_id <= 0 || !$image) {
    echo json_encode(["success" => false, "message" => "Tous les champs sont requis."]);
    $conn->close();
    exit;
}

$uploadDir = __DIR__ . '/../uploads/products/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

$imageName   = time() . '_' . basename($image['name']);
$imagePath   = $uploadDir . $imageName;
$imageDbPath = 'uploads/products/' . $imageName;

if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
    echo json_encode(["success" => false, "message" => "Erreur upload image"]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("INSERT INTO produits (nom, description, prix, categorie_id, image_path) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur préparation requête : " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("ssdis", $nom, $description, $prix, $categorie_id, $imageDbPath);

if ($stmt->execute()) {
    $newId = $conn->insert_id;

    // 🔹 Récupérer le nom de la catégorie
    $catStmt = $conn->prepare("SELECT nom FROM categories WHERE id = ?");
    $catStmt->bind_param("i", $categorie_id);
    $catStmt->execute();
    $catResult = $catStmt->get_result();
    $catRow = $catResult->fetch_assoc();
    $categorie_nom = $catRow['nom'] ?? '';

    echo json_encode([
        "success" => true,
        "message" => "Produit ajouté avec succès.",
        "product" => [
            "id"            => $newId,
            "nom"           => $nom,
            "description"   => $description,
            "prix"          => $prix,
            "categorie_id"  => (string) $categorie_id,
            "categorie_nom" => $categorie_nom,
            "image"         => $config['base_url_api'] . '/' . $imageDbPath
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $catStmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Erreur insertion : " . $stmt->error]);
}

$stmt->close();
$conn->close();
