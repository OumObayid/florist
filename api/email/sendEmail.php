<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Gérer la requête OPTIONS (pré-vol)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Répondre avec un statut 200 OK pour valider les permissions
    http_response_code(200);
    exit();  // Arrêter l'exécution du script
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// Charger la configuration
$config = require '../config.php';

// Récupération des données envoyées en JSON
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si toutes les données nécessaires sont présentes
if (!isset($data['from'], $data['to'], $data['subject'], $data['message'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

// Création d'une instance de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuration du serveur SMTP
    $mail->isSMTP(); // Assure que l'email est envoyé en HTML
    $mail->CharSet = 'UTF-8'; // Définit l'encodage de l'email
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port       = $config['smtp_port'];

    // Paramètres de l'email
    $mail->setFrom($data['from']); // Expéditeur
    $mail->addAddress($data['to']); // Destinataire
    $mail->isHTML(true);
    $mail->Subject = $data['subject'];
    $mail->Body = $data['message'];
    // Envoi de l'email
    if ($mail->send()) {
        echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès !']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi de l\'email.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
}
