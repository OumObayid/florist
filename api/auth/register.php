<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Répondre directement aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
// Charger la config depuis config.php
$config = include __DIR__ . '/../config.php';

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

if (
    empty($data["last_name"]) ||
    empty($data["first_name"]) ||
    empty($data["phone"]) ||
    empty($data["email"]) ||
    empty($data["password"])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Tous les champs sont requis"]);
    exit;
}

// Nettoyage / préparation
$last_name  = trim($data["last_name"]);
$first_name = trim($data["first_name"]);
$phone      = trim($data["phone"]);
$email      = trim($data["email"]);
$password   = password_hash($data["password"], PASSWORD_BCRYPT);

// Vérifier si email déjà utilisé
$sql_check = "SELECT id FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email déjà utilisé"]);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// Insertion utilisateur
$sql = "INSERT INTO users (last_name, first_name, phone, email, password_hash) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $last_name, $first_name, $phone, $email, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Utilisateur enregistré avec succès"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur enregistrement utilisateur"]);
}

$stmt->close();
$conn->close();
