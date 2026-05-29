<?php
/**
 * Snippet de referência para `register_coverage_request` no api.php.
 *
 * 1) Criar tabela no MySQL:
 *
 * CREATE TABLE coverage_requests (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   nome VARCHAR(120) NOT NULL,
 *   whatsapp VARCHAR(20) NOT NULL,
 *   email VARCHAR(160) NOT NULL,
 *   cidade VARCHAR(120) NOT NULL,
 *   estado CHAR(2) NOT NULL,
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 *
 * 2) Handler em api.php (dentro do switch de actions):
 */

case 'register_coverage_request': {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $nome = trim($input['nome'] ?? '');
    $whatsapp = trim($input['whatsapp'] ?? '');
    $email = trim($input['email'] ?? '');
    $cidade = trim($input['cidade'] ?? '');
    $estado = strtoupper(substr(trim($input['estado'] ?? ''), 0, 2));

    if (!$nome || !$whatsapp || !$email || !$cidade || !$estado) {
        http_response_code(400);
        echo json_encode(['error' => 'Campos obrigatórios ausentes']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO coverage_requests (nome, whatsapp, email, cidade, estado) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$nome, $whatsapp, $email, $cidade, $estado]);
    $id = (int)$pdo->lastInsertId();

    // Opcional: notificar admin por email
    $adminEmail = 'admin@seudominio.com';
    @mail(
        $adminEmail,
        "[Meu Bartender] Nova solicitação de cobertura - {$cidade}/{$estado}",
        "Nome: {$nome}\nWhatsApp: {$whatsapp}\nEmail: {$email}\nCidade: {$cidade}/{$estado}\n",
        "From: no-reply@seudominio.com\r\n"
    );

    echo json_encode(['id' => $id, 'message' => 'ok']);
    exit;
}
