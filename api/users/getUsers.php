<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Exécution de la requête pour récupérer les utilisateurs
$query = "SELECT * FROM users";
$result = mysqli_query($conn, $query);

// Vérification du résultat de la requête
if ($result) {
    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Liste des utilisateurs récupérée avec succès.',
        'users' => $users
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'exécution de la requête : ' . mysqli_error($conn)
    ]);
}

// Fermeture de la connexion à la base de données
mysqli_close($conn);
