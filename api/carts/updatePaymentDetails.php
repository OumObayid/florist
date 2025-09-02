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

// Initialisation de la réponse par défaut
$response = [
    "success" => false,
    "message" => "Erreur inconnue.",
];

// Récupérer les données envoyées en POST (en JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si toutes les données nécessaires sont présentes
if (isset($data['userId'], $data['cardNumber'], $data['cardHolderName'], $data['cardExpiryDate'], $data['cardCvv'])) {
    $userId = intval($data['userId']); // Assurez-vous que l'ID utilisateur est un entier
    $cardNumber = mysqli_real_escape_string($conn, $data['cardNumber']);
    $cardHolderName = mysqli_real_escape_string($conn, $data['cardHolderName']);
    $cardCvv = mysqli_real_escape_string($conn, $data['cardCvv']);

    // Vérification et conversion de cardExpiryDate (YYYY-MM => YYYY-MM-DD)
    $cardExpiryDate = $data['cardExpiryDate']; // Récupération brute
    if (preg_match('/^\d{4}-\d{2}$/', $cardExpiryDate)) { // Vérifie le format YYYY-MM
        $cardExpiryDate = $cardExpiryDate . "-01"; // Ajoute le premier jour du mois
    } else {
        $response['message'] = "Format de date d'expiration invalide.";
        echo json_encode($response);
        exit;
    }
    
    $cardExpiryDate = mysqli_real_escape_string($conn, $cardExpiryDate);

    // Mettre à jour les informations dans la base de données
    $query = "UPDATE users SET 
                card_number = '$cardNumber', 
                card_holder_name = '$cardHolderName', 
                card_expiry_date = '$cardExpiryDate', 
                card_cvv = '$cardCvv'
              WHERE id = $userId";

    if (mysqli_query($conn, $query)) {
        $response['success'] = true;
        $response['message'] = "Les détails de la carte ont été mis à jour avec succès.";
    } else {
        $response['message'] = "Erreur SQL lors de la mise à jour des détails de la carte : " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Données utilisateur ou carte invalides ou manquantes.";
}

// Retourner la réponse JSON
echo json_encode($response);

// Fermer la connexion à la base de données
mysqli_close($conn);
?>
