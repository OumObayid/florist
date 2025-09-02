<?php
// En-têtes CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Connexion à la base de données
$config = include __DIR__ . '/../../../includes/config.php';

// Vérifier la connexion
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID manquant.']);
    exit;
}

$userId = intval($data['userId']);

// Requête SQL pour supprimer tous les articles du panier de l'utilisateur
$query = "DELETE FROM carts WHERE user_id = $userId";

if (mysqli_query($conn, $query)) {
    echo json_encode(['success' => true, 'message' => 'Panier vidé avec succès.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression du panier.']);
}

// Fermeture de la connexion
mysqli_close($conn);


