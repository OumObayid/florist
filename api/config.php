<?php

function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Ignorer les commentaires
        list($key, $value) = explode('=', $line, 2);
        putenv("$key=$value");
    }
}

// Charger les variables d'environnement
loadEnv(__DIR__ . '/.env');

// Accéder aux variables d'environnement
$config = [
    // Configuration SMTP
    'smtp_host' => getenv('SMTP_HOST'),
    'smtp_user' => getenv('SMTP_USER'),
    'smtp_pass' => getenv('SMTP_PASS'),
    'smtp_secure' => getenv('SMTP_SECURE'),
    'smtp_port' => getenv('SMTP_PORT'),

    // Configuration IMAP
    'imap_host' => getenv('IMAP_HOST'),
    'imap_port' => getenv('IMAP_PORT'),
    'imap_secure' => getenv('IMAP_SECURE'),
    'imap_folder' => getenv('IMAP_FOLDER'),
    'imap_user' => getenv('IMAP_USER'),
    'imap_pass' => getenv('IMAP_PASS'),

    // Configuration Base de données
    'db_host' => getenv('DB_HOST'),
    'db_name' => getenv('DB_NAME'),
    'db_user' => getenv('DB_USER'),
    'db_pass' => getenv('DB_PASS'),
    'db_charset' => getenv('DB_CHARSET') ?: 'utf8mb4', // valeur par défaut
];

return $config;
