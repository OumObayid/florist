<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$config = include __DIR__ . '/../../../includes/config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$nom = $_POST['nom'] ?? '';
$description = $_POST['description'] ?? '';
$image = $_FILES['image'] ?? null;

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "ID invalide"]);
    exit;
}

// Récupérer le chemin de l'ancienne image
$oldImagePath = null;
$stmt = $conn->prepare("SELECT image_path FROM categories WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($oldImagePath);
$stmt->fetch();
$stmt->close();

try {
    if ($image && $image['tmp_name']) {
        // Préparer le dossier d’upload
        $uploadDir = __DIR__ . '/../uploads/categories/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        // Déplacer la nouvelle image
        $imageName = time() . '_' . basename($image['name']);
        $imagePath = $uploadDir . $imageName;
        $imageDbPath = 'uploads/categories/' . $imageName;

        if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
            echo json_encode(["success" => false, "message" => "Erreur upload image"]);
            $conn->close();
            exit;
        }

        // Supprimer l'ancienne image si elle existe
        if ($oldImagePath) {
            $fullOldPath = __DIR__ . '/../' . $oldImagePath;
            if (file_exists($fullOldPath)) {
                @unlink($fullOldPath);
            }
        }

        // Mise à jour avec la nouvelle image
        $stmt = $conn->prepare("UPDATE categories SET nom=?, description=?, image_path=? WHERE id=?");
        $stmt->bind_param("sssi", $nom, $description, $imageDbPath, $id);
    } else {
        // Mise à jour sans changer l'image
        $stmt = $conn->prepare("UPDATE categories SET nom=?, description=? WHERE id=?");
        $stmt->bind_param("ssi", $nom, $description, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Catégorie mise à jour ✅"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour : " . $stmt->error]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Exception : " . $e->getMessage()]);
}

$conn->close();
