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

$nom         = $_POST['nom'] ?? '';
$description = $_POST['description'] ?? '';
$image       = $_FILES['image'] ?? null;

if (empty($nom) || empty($description) || !$image) {
    echo json_encode(["success" => false, "message" => "Tous les champs sont requis."]);
    $conn->close();
    exit;
}

$uploadDir = __DIR__ . '/../uploads/categories/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

$imageName   = time() . '_' . basename($image['name']);
$imagePath   = $uploadDir . $imageName;
$imageDbPath = 'uploads/categories/' . $imageName;

if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
    echo json_encode(["success" => false, "message" => "Erreur upload image"]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("INSERT INTO categories (nom, description, image_path) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur préparation requête : " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("sss", $nom, $description, $imageDbPath);

if ($stmt->execute()) {
    $newId = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Catégorie ajoutée avec succès.",
        "categorie" => [
            "id"          => $newId,
            "nom"         => $nom,
            "description" => $description,
            "image"       => $config['base_url_api'] . '/' . $imageDbPath
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} else {
    echo json_encode(["success" => false, "message" => "Erreur insertion : " . $stmt->error]);
}

$stmt->close();
$conn->close();
