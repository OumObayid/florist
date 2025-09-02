<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

// Récupération JSON envoyé
$input = json_decode(file_get_contents("php://input"), true);

if (
    isset($input['id'], $input['firstname'], $input['lastname'], $input['email'], $input['phone'],$input['address'])
) {
    $id        = intval($input['id']);
    $firstname = trim($input['firstname']);
    $lastname  = trim($input['lastname']);
    $email     = trim($input['email']);
    $phone     = trim($input['phone']);
    $address     = trim($input['address']);

    // --- UPDATE USER ---
    $sql = "UPDATE users 
               SET firstname=?, lastname=?, email=?,  phone=? , address=?
             WHERE id=?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(["success" => false, "message" => "Erreur préparation : " . $conn->error]);
        exit;
    }
    $stmt->bind_param("sssssi", $firstname, $lastname, $email, $phone, $address, $id);

    if ($stmt->execute()) {
        $stmt->close();

        // --- SELECT USER COMPLET ---
        $sql2 = "SELECT * FROM users WHERE id=?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("i", $id);
        $stmt2->execute();
        $result = $stmt2->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                "success" => true,
                "user" => $user
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            echo json_encode(["success" => false, "message" => "Utilisateur non trouvé"]);
        }
        $stmt2->close();
    } else {
        echo json_encode(["success" => false, "message" => "Erreur update : " . $stmt->error]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Champs requis manquants"]);
}

$conn->close();
