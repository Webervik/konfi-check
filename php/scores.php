<?php
// Konfi-Check — Score API
// Auf Hostinger hochladen nach: /public_html/konfi-check/api/scores.php
// Dann in js/app.js die SCORE_API-URL anpassen.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Datenbank-Verbindung ----
// Diese Werte im Hostinger-Dashboard unter "Datenbanken" ablesen:
$db_host = 'localhost';
$db_name = 'DEIN_DB_NAME';
$db_user = 'DEIN_DB_USER';
$db_pass = 'DEIN_DB_PASSWORT';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler']);
    exit;
}

// Tabelle anlegen falls noch nicht vorhanden
$pdo->exec("CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gruppe VARCHAR(60) NOT NULL,
    thema VARCHAR(40) NOT NULL,
    punkte INT NOT NULL,
    gesamt INT NOT NULL,
    erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// ---- Score speichern (POST) ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    $name   = trim(substr($body['name']   ?? '', 0, 50));
    $gruppe = trim(substr($body['gruppe'] ?? '', 0, 60));
    $thema  = trim(substr($body['thema']  ?? '', 0, 40));
    $punkte = (int)($body['punkte']  ?? 0);
    $gesamt = (int)($body['gesamt']  ?? 1);

    if (!$name || !$gruppe || !$thema || $gesamt < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Daten']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO scores (name, gruppe, thema, punkte, gesamt) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $gruppe, $thema, $punkte, $gesamt]);

    echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

// ---- Scores abrufen (GET) ----
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $aktion = $_GET['aktion'] ?? 'liste';

    if ($aktion === 'liste') {
        // Letzte 100 Einträge, neueste zuerst
        $stmt = $pdo->query("SELECT name, gruppe, thema, punkte, gesamt, erstellt_am
                             FROM scores
                             ORDER BY erstellt_am DESC
                             LIMIT 100");
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['scores' => $scores]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Methode nicht erlaubt']);
