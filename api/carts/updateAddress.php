<?php
// En-têtes CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Connexion à la base de données
$config = include __DIR__ . '/../../../includes/config.php';

// Vérifier la connexion
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
    exit;
}

// Récupérer les données envoyées en POST
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si les données nécessaires sont présentes
if (isset($data['userId']) && isset($data['newAddress'])) {
    $userId = $data['userId'];
    $newAddress = $conn->real_escape_string($data['newAddress']); // Sécurisation de l'adresse pour éviter les injections

    // Préparer la requête SQL pour mettre à jour l'adresse
    $sql = "UPDATE users SET address = '$newAddress' WHERE id = $userId";

    // Exécuter la requête
    if (mysqli_query($conn, $sql)) {
        // Réponse JSON en cas de succès
        echo json_encode(["success" => true, "message" => "Adresse mise à jour avec succès"]);
    } else {
        // Réponse en cas d'erreur lors de l'exécution
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour de l'adresse"]);
    }
} else {
    // Si les paramètres sont manquants
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
}

// Fermer la connexion à la base de données
$conn->close();

