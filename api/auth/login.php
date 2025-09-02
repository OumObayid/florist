<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Répondre directement aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Charger la config depuis config.php
$config = include __DIR__ . '/../../../includes/config.php';

// Connexion DB avec mysqli
$conn = new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Lire les données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si toutes les données nécessaires sont présentes
if (!isset($data['email'], $data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

// Nettoyage / préparation
$email    = trim($data["email"]);
$password = $data["password"];

// Préparer la requête pour récupérer l’utilisateur
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erreur préparation requête: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
    exit;
}

$user = $result->fetch_assoc();

// Vérifier le mot de passe
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
    exit;
}

// Succès
echo json_encode([
    'success' => true,
    'message' => 'Connexion réussie',
    'user' => $user
]);

$stmt->close();
$conn->close();
