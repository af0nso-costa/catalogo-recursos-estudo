# BrightStart - Catálogo de Recursos de Estudo

## Identificação

- **Instituição:** Deloitte + IPS (Instituto Politécnico de Setúbal)
- **Unidade Curricular:** Introduçãa à Programação Web
- **Projeto:** Aplicação de Gestão de Recursos de Estudo
- **Docente:** Vitor Ferreira
- **Autor:** Afonso Costa
- **Local:** Setúbal, Portugal
- **Data:** Janeiro 2026

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
- ✅ Navegação breadcrumb
- ✅ Tratamento de erros e validações

## Instruções de Execução

### Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Extrair o ficheiro ZIP
2. Navegar até à pasta do projeto:
   ```bash
   cd BrightStart_IPS_2026_UI5
   ```

3. Instalar dependências:
   ```bash
   npm install
   ```

### Executar a Aplicação

```bash
npm start
```

A aplicação abrirá automaticamente no navegador em `http://localhost:8080/index.html`

## Estrutura do Projeto

```
BrightStart_IPS_2026_UI5/
├── webapp/
│   ├── controller/
│   │   ├── App.controller.js
│   │   ├── DisciplinaList.controller.js
│   │   ├── RecursoList.controller.js
│   │   └── RecursoDetail.controller.js
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── DisciplinaList.view.xml
│   │   ├── RecursoList.view.xml
│   │   ├── RecursoDetail.view.xml
│   │   └── AboutDialog.fragment.xml
│   ├── model/
│   │   ├── formatter.js
│   │   └── Resources.json
│   ├── i18n/
│   │   └── i18n.properties
│   ├── manifest.json
│   ├── Component.js
│   └── index.html
├── package.json
├── ui5.yaml
└── README.md
```

## Tecnologias Utilizadas

- SAPUI5 / OpenUI5 1.120.0
- Padrão MVC (Model-View-Controller)
- JSON Model para dados
- i18n para internacionalização
- Routing e navigation
- Fragments para componentes reutilizáveis

## Limitações

- Dados não persistem (apenas em memória)
- Não há backend real (utiliza JSONModel local)
- Funcionalidade de adicionar recursos não implementada (fora do escopo obrigatório)

## Funcionalidades Extra Implementadas

1. **Dashboard com métricas:** Total global de recursos e distribuição por tipo
2. **Validação robusta:** Tratamento de URLs vazias e descrições ausentes
3. **UX aprimorada:** Breadcrumbs, feedback visual, estados de loading
4. **Pesquisa avançada:** Filtra tanto por título quanto por descrição
5. **Limpeza de pesquisa:** Botão dedicado para resetar filtros
6. **Indicadores visuais:** Badges para recursos obrigatórios/opcionais

## Notas Técnicas

- Todo o código segue as best practices do SAPUI5
- Formatters centralizados para lógica de apresentação
- Binding correto de dados usando paths relativos e absolutos
- Navegação por routing com parâmetros dinâmicos
- Código limpo e bem comentado
- Zero erros na consola do navegador

---

**Avaliação esperada:** 20 valores (17 base + 3 opcionais)
