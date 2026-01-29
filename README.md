# BrightStart - Catálogo de Recursos de Estudo

## Identificação

- **Instituição:** Deloitte
- **Unidade Curricular:** Introduçãa à Programação Web
- **Projeto:** Aplicação de Gestão de Recursos de Estudo
- **Docente:** Vitor Ferreira
- **Autor:** Afonso Costa
- **Local:** Setúbal, Portugal
- **Data:** Janeiro, 2026

## Descrição

Aplicação SAPUI5 que permite aos estudantes consultar materiais de estudo organizados por disciplina (livros, vídeos, artigos). A aplicação disponibiliza funcionalidades de pesquisa, visualização de detalhes e navegação entre ecrãs.

## Funcionalidades Implementadas

### Requisitos Obrigatórios (Base)
- ✅ Lista de disciplinas com painéis organizados
- ✅ Barra de pesquisa global (filtra por título e descrição)
- ✅ Página de detalhe com ObjectHeader
- ✅ Diálogo "Sobre" implementado como fragment
- ✅ Internacionalização (i18n) completa
- ✅ Formatters para ícones e cores
- ✅ Routing completo (Lista → Disciplina → Detalhe)

### Funcionalidades Opcionais (Dia Extra - +3 valores)
- ✅ **Nível A:** Total de recursos por disciplina
- ✅ **Nível B:** Pesquisa estendida à descrição
- ✅ **Nível C:** Validação defensiva dos dados (URLs vazias, descrições ausentes)

### Funcionalidades Extra
- ✅ Contador global de recursos no topo
- ✅ Indicação visual de obrigatório/opcional
- ✅ Botão "Limpar Pesquisa"
- ✅ Ícones personalizados por tipo de recurso
- ✅ Tratamento de erros e validações

### Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- npm ou yarn

### Executar a Aplicação

```bash
npm install 
npm start
```

A aplicação abrirá automaticamente no navegador em `http://localhost:8080/index.html`

## Limitações

- Dados não persistem (apenas em memória)
- Não há backend real (utiliza JSONModel local)
- Funcionalidade de adicionar recursos não implementada (fora do escopo obrigatório)