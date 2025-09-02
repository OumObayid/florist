<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Répondre directement aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

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

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Vérifier si une requête POST est envoyée
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$nom = $_POST['nom'] ?? '';
$description = $_POST['description'] ?? '';
$prix = isset($_POST['prix']) ? floatval($_POST['prix']) : null;
$categorie_id = isset($_POST['categorie_id']) ? intval($_POST['categorie_id']) : null;
$image = $_FILES['image'] ?? null;

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "ID manquant ou invalide"]);
    exit;
}

// Récupérer le chemin de l'ancienne image
$oldImagePath = null;
$stmt = $conn->prepare("SELECT image_path FROM produits WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($oldImagePath);
$stmt->fetch();
$stmt->close();

try {
    if ($image && $image['tmp_name']) {
        // Préparer le dossier d’upload
        $uploadDir = __DIR__ . '/../uploads/products/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        // Déplacer la nouvelle image
        $imageName = time() . '_' . basename($image['name']);
        $imagePath = $uploadDir . $imageName;
        $imageDbPath = 'uploads/products/' . $imageName;

        if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
            echo json_encode(["success" => false, "message" => "Erreur upload image"]);
            $conn->close();
            exit;
        }

        // Supprimer l'ancienne image si elle existe
        if ($oldImagePath) {
            $fullOldPath = __DIR__ . '/../' . $oldImagePath; // adapter le chemin relatif si nécessaire
            if (file_exists($fullOldPath)) {
                @unlink($fullOldPath);
            }
        }

        // Mise à jour avec la nouvelle image
        $stmt = $conn->prepare("UPDATE produits SET nom=?, description=?, prix=?, categorie_id=?, image_path=? WHERE id=?");
        $stmt->bind_param("ssdssi", $nom, $description, $prix, $categorie_id, $imageDbPath, $id);
    } else {
        // Mise à jour sans changer l'image
        $stmt = $conn->prepare("UPDATE produits SET nom=?, description=?, prix=?, categorie_id=? WHERE id=?");
        $stmt->bind_param("ssdii", $nom, $description, $prix, $categorie_id, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Produit mis à jour ✅"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour : " . $stmt->error]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Exception : " . $e->getMessage()]);
}

$conn->close();
?>
