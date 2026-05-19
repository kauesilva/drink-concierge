<?php
/**
 * SNIPPET DE REFERÊNCIA — NÃO É EXECUTADO PELO LOVABLE.
 *
 * Endpoint a ser colado dentro do switch ($action) de api_v2.php.
 * Ele recebe um pedido de orçamento vinculado a um parceiro específico,
 * grava o lead no banco e envia um email direto para o bartender.
 *
 * Frontend chama: POST {API_BASE}?action=send_quick_quote
 *
 * Body JSON esperado:
 * {
 *   "parceiro_id":        int,
 *   "nome_cliente":       string,
 *   "whatsapp":           string,
 *   "email":              string,
 *   "tipo_evento":        string,
 *   "quantidade_pessoas": int,
 *   "data_evento":        "YYYY-MM-DD",
 *   "cidade":             string,
 *   "estado":             "UF",
 *   "observacoes":        string|null
 * }
 *
 * Responde:
 *   200 { "id": <lead_id>, "message": "..." }
 *   400 { "error": "..." }
 *   403 { "error": "Parceiro indisponível" }
 *   500 { "error": "..." }
 *
 * REQUISITOS NO BANCO: nenhuma alteração de schema. Usa a tabela `leads`
 * que já existe (mesma estrutura usada por create_lead).
 */

// ====== COLE DAQUI PARA BAIXO DENTRO DO switch ($action) ======
case 'send_quick_quote': {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    // 1) Validação básica
    $required = [
        'parceiro_id', 'nome_cliente', 'whatsapp', 'email',
        'tipo_evento', 'quantidade_pessoas', 'data_evento',
        'cidade', 'estado',
    ];
    foreach ($required as $f) {
        if (empty($input[$f]) && $input[$f] !== 0 && $input[$f] !== '0') {
            http_response_code(400);
            echo json_encode(['error' => "Campo obrigatório: $f"]);
            exit;
        }
    }
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit;
    }

    $parceiroId = (int) $input['parceiro_id'];

    // 2) Carrega o parceiro e checa se está ativo
    $stmt = $pdo->prepare("SELECT id, nome, nome_empresa, email, ativo
                             FROM parceiros WHERE id = ? LIMIT 1");
    $stmt->execute([$parceiroId]);
    $parceiro = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$parceiro) {
        http_response_code(404);
        echo json_encode(['error' => 'Parceiro não encontrado']);
        exit;
    }
    if ((int) $parceiro['ativo'] !== 1) {
        http_response_code(403);
        echo json_encode(['error' => 'Parceiro indisponível']);
        exit;
    }

    $parceiroNome  = $parceiro['nome_empresa'] ?: $parceiro['nome'];
    $parceiroEmail = $parceiro['email'];

    // 3) Insere o lead
    $insert = $pdo->prepare("INSERT INTO leads
        (parceiro_id, tipo_evento, quantidade_pessoas, cidade, estado,
         data_evento, nome_cliente, whatsapp, email, observacoes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'novo')");
    $insert->execute([
        $parceiroId,
        $input['tipo_evento'],
        (int) $input['quantidade_pessoas'],
        $input['cidade'],
        strtoupper(substr($input['estado'], 0, 2)),
        $input['data_evento'],
        $input['nome_cliente'],
        $input['whatsapp'],
        $input['email'],
        $input['observacoes'] ?? null,
    ]);
    $leadId = (int) $pdo->lastInsertId();

    // 4) Envia email para o parceiro
    $assunto = "Novo pedido de orçamento — {$input['nome_cliente']}";
    $painelUrl = 'https://drink-concierge.lovable.app/parceiro/painel/leads';

    $obs = htmlspecialchars($input['observacoes'] ?? '—', ENT_QUOTES, 'UTF-8');
    $nome = htmlspecialchars($input['nome_cliente'], ENT_QUOTES, 'UTF-8');
    $wpp = htmlspecialchars($input['whatsapp'], ENT_QUOTES, 'UTF-8');
    $mail = htmlspecialchars($input['email'], ENT_QUOTES, 'UTF-8');
    $tipo = htmlspecialchars($input['tipo_evento'], ENT_QUOTES, 'UTF-8');
    $cid = htmlspecialchars($input['cidade'], ENT_QUOTES, 'UTF-8');
    $est = htmlspecialchars(strtoupper($input['estado']), ENT_QUOTES, 'UTF-8');
    $dt  = htmlspecialchars($input['data_evento'], ENT_QUOTES, 'UTF-8');
    $qtd = (int) $input['quantidade_pessoas'];

    $body = "
      <div style='font-family:Arial,sans-serif;color:#1a1a1a;max-width:560px;'>
        <h2 style='color:#0d0d0d;margin:0 0 12px;'>Novo pedido de orçamento</h2>
        <p>Olá <strong>{$parceiroNome}</strong>,</p>
        <p>Você recebeu um novo pedido de orçamento pela plataforma:</p>
        <table cellpadding='6' style='border-collapse:collapse;font-size:14px;'>
          <tr><td><strong>Cliente</strong></td><td>{$nome}</td></tr>
          <tr><td><strong>WhatsApp</strong></td><td>{$wpp}</td></tr>
          <tr><td><strong>Email</strong></td><td>{$mail}</td></tr>
          <tr><td><strong>Tipo de evento</strong></td><td>{$tipo}</td></tr>
          <tr><td><strong>Pessoas</strong></td><td>{$qtd}</td></tr>
          <tr><td><strong>Data</strong></td><td>{$dt}</td></tr>
          <tr><td><strong>Local</strong></td><td>{$cid} / {$est}</td></tr>
          <tr><td valign='top'><strong>Mensagem</strong></td><td>{$obs}</td></tr>
        </table>
        <p style='margin-top:20px;'>
          <a href='{$painelUrl}' style='background:#d4af37;color:#0d0d0d;
             padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;'>
             Abrir no meu painel
          </a>
        </p>
        <p style='color:#888;font-size:12px;margin-top:24px;'>
          Lead #{$leadId} — enviado por drink-concierge.lovable.app
        </p>
      </div>
    ";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Drink Concierge <no-reply@bartenderstore.com.br>\r\n";
    $headers .= "Reply-To: {$input['nome_cliente']} <{$input['email']}>\r\n";

    @mail($parceiroEmail, $assunto, $body, $headers);
    // Se mail() não for confiável, troque pelo bloco PHPMailer abaixo.

    echo json_encode([
        'id'      => $leadId,
        'message' => 'Pedido enviado ao parceiro com sucesso',
    ]);
    exit;
}

/* ========== Alternativa com PHPMailer + SMTP ==========
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';

$mailer = new PHPMailer(true);
$mailer->isSMTP();
$mailer->Host       = 'smtp.SEU_PROVEDOR.com';
$mailer->SMTPAuth   = true;
$mailer->Username   = 'SEU_USUARIO';
$mailer->Password   = 'SUA_SENHA';
$mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mailer->Port       = 587;
$mailer->CharSet    = 'UTF-8';
$mailer->setFrom('no-reply@bartenderstore.com.br', 'Drink Concierge');
$mailer->addReplyTo($input['email'], $input['nome_cliente']);
$mailer->addAddress($parceiroEmail, $parceiroNome);
$mailer->isHTML(true);
$mailer->Subject = $assunto;
$mailer->Body    = $body;
$mailer->send();
========================================================= */
