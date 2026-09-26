# EduPlay

Aplicação educativa em HTML, CSS e JavaScript para explorar cores, formas, palavras e escrita com a mediação de uma educadora. Desenvolvida para o projeto de Atividade Extensionista II de Nilton Cezar dos Santos Junior, com materiais pedagógicos fornecidos pela professora Eliane.

## Executar

Abra `dist/index.html` no Chrome ou Edge. Não há instalação, dependências de execução, backend, conta ou conexão obrigatória. Todos os arquivos de `dist` precisam permanecer juntos. Se estiver usando o pacote da professora, extraia o ZIP antes de abrir `index.html`.

Para servir por HTTP, opcionalmente use `python -m http.server 8765 --directory dist` e abra `http://localhost:8765`. O diretório `dist` também pode ser servido por uma hospedagem estática.

## Atividades

- **Cores:** organizar peças em tabuleiros 2 × 2, 3 × 3 (padrão) ou 4 × 4 por meio de trocas.
- **Formas:** a mesma mecânica, classificando círculo, triângulo, quadrado e, no tamanho 4 × 4, losango.
- **Palavras:** associar três cores aos seus nomes, com leitura mediada e botão Reiniciar palavras sempre disponível.
- **Minha escrita:** experimentar letras no teclado, sem correção ou pontuação automática.

`dist/guia-professora.html` contém instruções de aplicação e ficha de observação imprimível. As peças são selecionáveis por mouse, toque ou teclado (Tab e Enter/Espaço). Esc cancela a seleção. A rodada pode ser reiniciada e a troca de grupo limpa toda a sessão.

## Regras e estrutura

Cada tamanho n × n tem n peças de cada categoria e n guias fixas abaixo das colunas. O tamanho 2 × 2 usa azul e amarelo; 3 × 3 acrescenta vermelho; 4 × 4 acrescenta verde. Toda troca entre duas posições móveis é permitida. A vitória exige todas as peças corretamente alinhadas; o embaralhamento nunca inicia concluído. Mudar o tamanho reinicia apenas o tabuleiro atual. Cada atividade mantém seu tamanho, inclusive na troca de grupo.

| Arquivo | Responsabilidade |
| --- | --- |
| `dist/index.html` | Estrutura semântica e controles. |
| `dist/styles.css` | Apresentação, foco visível e adaptação de tela. |
| `dist/engine.js` | Embaralhamento, validação, troca e condição de conclusão. |
| `dist/app.js` | Estado de sessão, interações, atividades e janelas de ajuda. |
| `dist/guia-professora.html` e `dist/guide.css` | Orientações e ficha para observação. |
| `tests/engine.test.cjs` | Testes das regras, sem bibliotecas adicionais. |

## Verificar as regras

Com Node.js instalado, execute na raiz:

```sh
node --test tests/*.test.cjs
node --check dist/engine.js
node --check dist/app.js
```

Os testes verificam contagens, embaralhamento, reversibilidade, entradas inválidas e solução de 600 tabuleiros nos três tamanhos, todas as seis disposições 2 × 2 e eventos de reinício de palavras em DOM simulado. Eles não medem aprendizagem. Os fluxos visuais devem ser testados também no computador usado pela turma.

## Dados e limites

Não há analytics, cookies, armazenamento persistente, formulários enviados ou coleta de identificação. O estado fica somente em memória e desaparece ao recarregar a página. Evite inserir nomes ou dados pessoais no campo de escrita. Eventuais registros da oficina devem ficar separados do repositório público.

O jogo não diagnostica, não avalia alfabetização e não substitui mediação pedagógica. Os símbolos de apoio tornam a organização por cor acessível por mais de uma pista; resolver esse modo não comprova reconhecimento isolado de cores. A atividade digital não reproduz os efeitos motores da manipulação física de tampinhas.

Há integração opcional com `document.modelContext`, quando disponível: consultar a atividade e navegar entre atividades. Ela não expõe o texto digitado nem resolve o jogo e é ignorada por navegadores comuns.

## Publicação no GitHub

Publique esta pasta de código como repositório do projeto. Inclua `dist`, `tests`, `README.md` e `VERIFICACAO.md`; não inclua documentos acadêmicos, listas de alunos, autorizações ou fotos identificáveis. O ZIP de código preparado na pasta Entrega já separa esses materiais. A publicação na conta GitHub do aluno depende da definição do repositório e de acesso à conta.


## Histórico e autoria

Proposta entregue em 18/07/2026 às 17h22; levantamento com Eliane em 03/09/2026, conforme informações do aluno; implementação desta versão em 24/09/2026. Aplicação prevista para 25/09/2026 e entrega acadêmica em 26/09/2026. Resultados da turma serão registrados após a aplicação.

Atividade principal adaptada do material “Planejamento Pedagógico Jogo das Linhas Coloridas”, fornecido por Eliane. As atividades complementares mantêm o vínculo com os objetivos de leitura, escrita, formas e cores da proposta aprovada. Não foram incorporadas fotografias dos materiais pedagógicos ao aplicativo.
