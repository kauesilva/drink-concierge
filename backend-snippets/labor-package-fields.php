<?php
/**
 * Suporte a pacotes de "Mão de obra" (labor-only) — cobrados por hora.
 *
 * 1) MIGRATION — adicionar colunas em `pacotes`:
 *
 *   ALTER TABLE pacotes
 *     ADD COLUMN valor_hora DECIMAL(10,2) NULL,
 *     ADD COLUMN minimo_horas INT NULL,
 *     ADD COLUMN inclui_montagem TINYINT(1) NOT NULL DEFAULT 0,
 *     ADD COLUMN horas_montagem INT NULL,
 *     ADD COLUMN permite_hora_extra TINYINT(1) NOT NULL DEFAULT 0,
 *     ADD COLUMN valor_hora_extra DECIMAL(10,2) NULL;
 *
 * 2) Atualizar os endpoints `add_package`, `update_package` e `get_packages`
 *    para ler/gravar esses campos. Exemplo (substitua no switch($action) do api_v2.php):
 */

// ============= add_package =============
case 'add_package': {
    $body = json_decode(file_get_contents('php://input'), true);
    $parceiroId = (int)($body['parceiro_id'] ?? 0);
    $categoria  = $body['categoria_servico'] ?? null;

    // Limite: apenas 1 pacote de mão de obra por parceiro
    if ($categoria === 'mao-de-obra') {
        $stmt = $pdo->prepare(
            "SELECT COUNT(*) FROM pacotes WHERE parceiro_id = ? AND categoria_servico = 'mao-de-obra'"
        );
        $stmt->execute([$parceiroId]);
        if ((int)$stmt->fetchColumn() >= 1) {
            http_response_code(400);
            echo json_encode(['error' => 'Você já possui um pacote de mão de obra.']);
            exit;
        }
    }

    $stmt = $pdo->prepare(
        "INSERT INTO pacotes (
            parceiro_id, nome, descricao, duracao_horas, preco_por_pessoa,
            minimo_pessoas, maximo_pessoas, itens, drinks, categoria_servico,
            cobertura, tipos_evento, foto_capa, galeria,
            valor_hora, minimo_horas, inclui_montagem, horas_montagem,
            permite_hora_extra, valor_hora_extra
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $parceiroId,
        $body['nome'],
        $body['descricao'] ?? null,
        (float)($body['duracao_horas'] ?? 0),
        (float)($body['preco_por_pessoa'] ?? 0),
        (int)($body['minimo_pessoas'] ?? 0),
        $body['maximo_pessoas'] ?? null,
        json_encode($body['itens'] ?? []),
        json_encode($body['drinks'] ?? []),
        $categoria,
        json_encode($body['cobertura'] ?? []),
        json_encode($body['tipos_evento'] ?? []),
        $body['foto_capa'] ?? null,
        json_encode($body['galeria'] ?? []),
        isset($body['valor_hora']) ? (float)$body['valor_hora'] : null,
        isset($body['minimo_horas']) ? (int)$body['minimo_horas'] : null,
        (int)($body['inclui_montagem'] ?? 0),
        isset($body['horas_montagem']) ? (int)$body['horas_montagem'] : null,
        (int)($body['permite_hora_extra'] ?? 0),
        isset($body['valor_hora_extra']) ? (float)$body['valor_hora_extra'] : null,
    ]);
    echo json_encode(['id' => (int)$pdo->lastInsertId(), 'message' => 'ok']);
    exit;
}

// ============= update_package =============
case 'update_package': {
    $body = json_decode(file_get_contents('php://input'), true);
    $pacoteId = (int)($body['pacote_id'] ?? 0);

    // Se mudar para mão de obra, garantir que não tem outro
    if (($body['categoria_servico'] ?? null) === 'mao-de-obra') {
        $stmt = $pdo->prepare(
            "SELECT COUNT(*) FROM pacotes p
             JOIN pacotes me ON me.id = ?
             WHERE p.parceiro_id = me.parceiro_id
               AND p.categoria_servico = 'mao-de-obra'
               AND p.id <> me.id"
        );
        $stmt->execute([$pacoteId]);
        if ((int)$stmt->fetchColumn() >= 1) {
            http_response_code(400);
            echo json_encode(['error' => 'Você já possui um pacote de mão de obra.']);
            exit;
        }
    }

    $stmt = $pdo->prepare(
        "UPDATE pacotes SET
            nome = COALESCE(?, nome),
            descricao = ?,
            duracao_horas = ?,
            preco_por_pessoa = ?,
            minimo_pessoas = ?,
            maximo_pessoas = ?,
            itens = ?,
            drinks = ?,
            categoria_servico = ?,
            cobertura = ?,
            tipos_evento = ?,
            foto_capa = ?,
            galeria = ?,
            valor_hora = ?,
            minimo_horas = ?,
            inclui_montagem = ?,
            horas_montagem = ?,
            permite_hora_extra = ?,
            valor_hora_extra = ?
         WHERE id = ?"
    );
    $stmt->execute([
        $body['nome'] ?? null,
        $body['descricao'] ?? null,
        (float)($body['duracao_horas'] ?? 0),
        (float)($body['preco_por_pessoa'] ?? 0),
        (int)($body['minimo_pessoas'] ?? 0),
        $body['maximo_pessoas'] ?? null,
        json_encode($body['itens'] ?? []),
        json_encode($body['drinks'] ?? []),
        $body['categoria_servico'] ?? null,
        json_encode($body['cobertura'] ?? []),
        json_encode($body['tipos_evento'] ?? []),
        $body['foto_capa'] ?? null,
        json_encode($body['galeria'] ?? []),
        isset($body['valor_hora']) ? (float)$body['valor_hora'] : null,
        isset($body['minimo_horas']) ? (int)$body['minimo_horas'] : null,
        (int)($body['inclui_montagem'] ?? 0),
        isset($body['horas_montagem']) ? (int)$body['horas_montagem'] : null,
        (int)($body['permite_hora_extra'] ?? 0),
        isset($body['valor_hora_extra']) ? (float)$body['valor_hora_extra'] : null,
        $pacoteId,
    ]);
    echo json_encode(['message' => 'ok']);
    exit;
}

/**
 * 3) Em `get_packages` / `get_company_packages`, basta incluir as novas colunas
 *    no SELECT — o frontend já lê: valor_hora, minimo_horas, inclui_montagem,
 *    horas_montagem, permite_hora_extra, valor_hora_extra.
 */
