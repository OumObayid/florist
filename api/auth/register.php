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

if (
    empty($data["lastname"]) ||
    empty($data["firstname"]) ||
    empty($data["phone"]) ||
    empty($data["email"]) ||
    empty($data["password"])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Tous les champs sont requis"]);
    exit;
}

// Nettoyage / préparation
$lastname  = trim($data["lastname"]);
$firstname = trim($data["firstname"]);
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

$default_role = "user"; 
// Insertion utilisateur
$sql = "INSERT INTO users (lastname, firstname, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $lastname, $firstname, $phone, $email, $password, $default_role);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Utilisateur enregistré avec succès"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur enregistrement utilisateur"]);
}

$stmt->close();
$conn->close();
