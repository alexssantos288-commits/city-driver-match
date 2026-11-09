# INTEGRETY DRIVER — MVP 1

- [ ] Corrigir a prévia preservando o aplicativo existente

- [x] Banco de dados: perfis, papéis, motoristas, veículos, documentos, cidades/bairros, favoritos, solicitações, eventos, avaliações, notificações, auditoria, configurações (RLS em tudo)
- [x] Regras no servidor: criar solicitação, aceitar/recusar/orçar, confirmar, cancelar, expirar, avançar status, avaliar, aprovação admin, suspensão
- [x] Armazenamento privado de documentos do motorista
- [ ] Telas: /entrar, /cadastro, /recuperar-senha, /reset-password
- [ ] Área do passageiro: /passageiro, /passageiro/favoritos, /passageiro/viagens
- [ ] Marketplace /motoristas e perfil /motorista/:id
- [ ] Fluxo de solicitação em etapas
- [ ] Painel do motorista /painel-motorista (cadastro, veículo, documentos, disponibilidade, solicitações)
- [ ] Painel admin /admin (aprovação, usuários, cidades, configurações)
- [ ] Definir a primeira conta de administrador


## Avanço desta etapa

- [x] Painel administrativo inicial em `/admin`: análise e aprovação/reprovação de motoristas, análise de documentos já enviados, suspensão/reativação de usuários, cadastro/ativação de cidades e consulta de auditoria.
- [x] Registro da rota administrativa e das rotas de cadastro/veículo do motorista no roteador.
- [x] Navegação do painel do motorista para cadastro e veículo.
- [x] Envio do cadastro do motorista para análise usando a função de servidor `submit_driver_for_review`.
- [x] Correção da inicialização dos formulários do motorista para carregar dados existentes sem atualizar estado durante a renderização.

### Pendências técnicas para fechar o MVP

- [ ] Implementar envio dos arquivos de CNH, CRLV e demais documentos para o bucket privado e permitir pré-visualização segura pelo administrador.
- [ ] Validar a relação entre documentos enviados e aprovação final do motorista no ambiente Supabase.
- [ ] Completar telas de configurações da plataforma e fluxo inicial de criação/atribuição segura do primeiro administrador.
- [ ] Regenerar as rotas pelo TanStack Router e executar `npm run build`, `npm run lint` e testes no ambiente do projeto.
