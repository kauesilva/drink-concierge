<?php
/**
 * Snippet de referência para o fluxo de aprovação de parceiros no api.php.
 *
 * Convenção do campo `ativo` na tabela `parceiros`:
 *   0 = pendente (default ao cadastrar)
 *   1 = ativo (aprovado, aparece no público)
 *   2 = rejeitado (não aparece, mas registro mantido)
 *
 * =====================================================
 * 1) Garantir default no cadastro
 * =====================================================
 *
 * No handler `register` (criação de parceiro):
 *
 *   INSERT INTO parceiros (..., ativo) VALUES (..., 0);
 *
 * E enviar email ao admin avisando da nova solicitação:
 *
 *   @mail('admin@seudominio.com',
 *     "[Meu Bartender] Novo parceiro aguardando aprovação",
 *     "Nome: {$nome}\nEmail: {$email}\nWhatsApp: {$whatsapp}\n\nAcesse o painel admin para aprovar.",
 *     "From: no-reply@seudominio.com\r\n");
 *
 * =====================================================
 * 2) Filtrar `ativo = 1` em TODAS as rotas públicas
 * =====================================================
 *
 *   list_companies      → adicionar WHERE ativo = 1
 *   get_public_partner  → adicionar AND ativo = 1
 *   get_profile (público) → adicionar AND ativo = 1
 *   send_quick_quote    → validar SELECT id FROM parceiros WHERE id = ? AND ativo = 1, senão 403
 *   matching de leads (create_lead) → SELECT ... WHERE ativo = 1
 *
 * IMPORTANTE: NÃO filtrar `ativo` em rotas autenticadas do próprio parceiro
 * (get_profile com token, update_profile, packages do dono). O parceiro
 * pendente precisa conseguir editar o cadastro.
 *
 * =====================================================
 * 3) Novos handlers admin
 * =====================================================
 */

// --- admin_list_partners -----------------------------
case 'admin_list_partners': {
    require_admin_token(); // valide o token do admin
    $stmt = $pdo->query("
        SELECT id, nome, email, whatsapp, tipo, nome_empresa, sobre,
               foto_capa, cidade_base, estado, avaliacao, total_avaliacoes,
               ativo, areas_atendidas, categorias_servico, criado_em, atualizado_em
        FROM parceiros
        ORDER BY (ativo = 0) DESC, criado_em DESC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$r) {
        $r['areas_atendidas'] = $r['areas_atendidas'] ? json_decode($r['areas_atendidas'], true) : [];
        $r['categorias_servico'] = $r['categorias_servico'] ? json_decode($r['categorias_servico'], true) : [];
        $r['ativo'] = (int)$r['ativo'];
    }
    echo json_encode($rows);
    exit;
}

// --- admin_set_partner_status ------------------------
case 'admin_set_partner_status': {
    require_admin_token();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $parceiroId = (int)($input['parceiro_id'] ?? 0);
    $ativo = (int)($input['ativo'] ?? -1);
    if (!$parceiroId || !in_array($ativo, [0, 1, 2], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Parâmetros inválidos']);
        exit;
    }
    $stmt = $pdo->prepare('UPDATE parceiros SET ativo = ?, atualizado_em = NOW() WHERE id = ?');
    $stmt->execute([$ativo, $parceiroId]);

    // notificar o parceiro
    $infoStmt = $pdo->prepare('SELECT nome, email FROM parceiros WHERE id = ?');
    $infoStmt->execute([$parceiroId]);
    $info = $infoStmt->fetch(PDO::FETCH_ASSOC);
    if ($info && !empty($info['email'])) {
        if ($ativo === 1) {
            $subject = '[Meu Bartender] Seu cadastro foi aprovado!';
            $body = "Olá {$info['nome']},\n\nSeu cadastro foi aprovado. Seu perfil já está visível no marketplace e você pode receber solicitações de orçamento.\n\nAcesse seu painel para revisar perfil e pacotes.";
        } elseif ($ativo === 2) {
            $subject = '[Meu Bartender] Atualização sobre seu cadastro';
            $body = "Olá {$info['nome']},\n\nInfelizmente seu cadastro não foi aprovado neste momento. Para mais informações entre em contato com nossa equipe.";
        } else {
            $subject = '[Meu Bartender] Seu cadastro está em análise';
            $body = "Olá {$info['nome']},\n\nSeu cadastro voltou para análise. Em breve daremos retorno.";
        }
        @mail($info['email'], $subject, $body, "From: no-reply@seudominio.com\r\n");
    }

    echo json_encode(['message' => 'ok']);
    exit;
}

// --- admin_list_coverage_requests --------------------
case 'admin_list_coverage_requests': {
    require_admin_token();
    $stmt = $pdo->query("
        SELECT id, nome, whatsapp, email, cidade, estado, created_at AS criado_em
        FROM coverage_requests
        ORDER BY created_at DESC
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/**
 * =====================================================
 * 4) Helper sugerido
 * =====================================================
 *
 * function require_admin_token() {
 *   $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
 *   $token = preg_replace('/^Bearer\\s+/', '', $hdr);
 *   // valide $token contra a tabela admin_tokens (ou JWT)
 *   if (!is_valid_admin_token($token)) {
 *     http_response_code(401);
 *     echo json_encode(['error' => 'Não autorizado']);
 *     exit;
 *   }
 * }
 */
