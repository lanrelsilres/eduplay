# Atualização 1.2 — 24/09/2026

Conclusão de cores, formas e palavras em diálogo central acessível, com ação de continuar e opção de rever. Escrita com exemplo SOL, passos e explicação para mediação. Sete testes passaram, incluindo abertura/fechamento da conclusão de palavras e limpeza do aviso ao reiniciar. Sintaxe JavaScript validada. Sem nova inspeção visual no navegador.

# Verificação da versão 1.1

Data: 24/09/2026. Sete testes automatizados passaram (`node --test tests/*.test.cjs`). Foram verificados 600 embaralhamentos e soluções nos tamanhos 2 × 2, 3 × 3 e 4 × 4, conservação das peças, reversibilidade e rejeição de dados inválidos. Dois testes executam os eventos reais de app.js em DOM mínimo simulado: tamanhos independentes, troca envolvendo a última peça, reinício após as três palavras, referência de escrita sem preenchimento e limpeza ao trocar de grupo. Sintaxe dos scripts verificada com Node.

Esta atualização não recebeu nova inspeção visual no navegador. Os testes com DOM simulado verificam comportamento, não renderização. Abaixo fica o registro da inspeção da versão anterior, que não deve ser atribuído aos novos tamanhos.

# Verificação da versão 1.0

Data: 24/09/2026. Verificação técnica do aplicativo, anterior à aplicação com a turma.

## Testes concluídos

- Cinco testes automatizados passaram com `node --test tests/engine.test.cjs`: composição e embaralhamento, 90 disposições alcançáveis por trocas, reversibilidade, condição de conclusão e rejeição de entradas inválidas.
- Sintaxe de `engine.js` e `app.js` verificada com Node.
- No navegador: seleção, cancelamento com Esc, conclusão do tabuleiro de cores, conclusão do tabuleiro de formas por teclado, cancelamento de reinício sem perda da partida.
- Palavras: resposta diferente permite nova tentativa; as três respostas corretas permitem avançar até a escrita.
- Escrita: entrada livre aceita sem correção; cancelamento da limpeza preserva o texto.
- Novo grupo reinicia tabuleiros e palavras e limpa a escrita.
- Guia e ficha de observação acessíveis por página local servida por HTTP.
- Inspeção visual da aplicação em tela de computador (1366 × 768) e estreita (390 × 844). Sem transbordamento horizontal na aplicação e no guia após ajuste.
- Nenhum aviso/erro de execução registrado pelo navegador nos fluxos inspecionados.
- Ferramentas opcionais WebMCP registradas e verificadas: consulta da atividade, navegação válida, rejeição de entradas inválidas e preservação do estado. A consulta não retorna a escrita da criança.

## Limites da verificação

A inspeção foi feita no navegador disponível neste ambiente, usando servidor local. A navegação automatizada para `file://` foi bloqueada pela política do navegador; não foi feita uma tentativa por outro meio. O pacote foi construído com referências relativas, scripts clássicos e recursos locais, sem chamadas de rede, para abrir diretamente no navegador. A abertura por duplo clique e o uso offline devem ser conferidos no computador da professora antes da turma.

Ainda não houve teste com os alunos, avaliação de aprendizagem, certificação de acessibilidade ou verificação no computador específico do CMEI. Esses resultados não devem ser inferidos dos testes técnicos.
