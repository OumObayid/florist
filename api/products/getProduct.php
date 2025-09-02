header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Répondre aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Charger la config
$config = include __DIR__ . '/../../../config.php';
$secretKey = $config['key_secret'] ?? '';

// Récupérer le header Authorization
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

// Vérifier si le header correspond à la clé
if (!$authHeader || $authHeader !== "Bearer $secretKey") {
    http_response_code(401);
    echo json_encode(["error" => "Accès non autorisé"]);
    exit;
}


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

// Lecture des données envoyées
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

// Validation de l'ID
if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "L'ID fourni est invalide.",
    ]);
    mysqli_close($conn);
    exit;
}

// Requête pour récupérer le produit par ID
$query = "SELECT * FROM produits WHERE id = $id";
$result = mysqli_query($conn, $query);

if ($result) {
    $product = mysqli_fetch_assoc($result);
    if ($product) {
       

        // Réponse en cas de succès
        echo json_encode([
            "success" => true,
            "product" => $product,
        ]);
    } else {
        // Produit non trouvé
        echo json_encode([
            "success" => false,
            "message" => "Produit introuvable.",
        ]);
    }
} else {
    // Échec de la requête
    echo json_encode([
        "success" => false,
        "message" => "Échec de l'exécution de la requête : " . mysqli_error($conn),
    ]);
}

// Fermeture de la connexion
mysqli_close($conn);
?>
