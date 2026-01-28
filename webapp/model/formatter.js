sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Retorna o ícone apropriado baseado no tipo de recurso
         * @param {string} sTipo - O tipo do recurso (Livro, Vídeo, Artigo)
         * @returns {string} - O caminho do ícone SAP
         */
        iconByType: function (sTipo) {
            var mIcons = {
                "Livro": "sap-icon://course-book",
                "Vídeo": "sap-icon://video",
                "Artigo": "sap-icon://document-text"
            };
            return mIcons[sTipo] || "sap-icon://document";
        },

        /**
         * Retorna a cor do estado baseado se é obrigatório ou não
         * @param {boolean} bObrigatorio - Se o recurso é obrigatório
         * @returns {string} - O estado de cor (Error, Success, None)
         */
        stateByObrigatorio: function (bObrigatorio) {
            return bObrigatorio ? "Error" : "Success";
        },

        /**
         * Retorna o texto formatado para obrigatório
         * @param {boolean} bObrigatorio - Se o recurso é obrigatório
         * @returns {string} - Texto "Obrigatório" ou "Opcional"
         */
        textoObrigatorio: function (bObrigatorio) {
            return bObrigatorio ? "Obrigatório" : "Opcional";
        },

        /**
         * Retorna o ícone de estado baseado se é obrigatório
         * @param {boolean} bObrigatorio - Se o recurso é obrigatório
         * @returns {string} - Ícone apropriado
         */
        iconStatusByObrigatorio: function (bObrigatorio) {
            return bObrigatorio ? "sap-icon://warning" : "sap-icon://sys-enter-2";
        },

        /**
         * Formata informação adicional baseada no tipo
         * @param {string} sTipo - O tipo do recurso
         * @param {object} oRecurso - O objeto recurso completo
         * @returns {string} - Informação formatada
         */
        infoAdicional: function (sTipo, anoPublicacao, paginas, duracao) {
            if (sTipo === "Livro" && anoPublicacao && paginas) {
                return anoPublicacao + " • " + paginas + " páginas";
            } else if (sTipo === "Vídeo" && duracao) {
                return "Duração: " + duracao;
            } else if (anoPublicacao) {
                return "Ano: " + anoPublicacao;
            }
            return "";
        },

        /**
         * Retorna a classe de highlight para o item
         * @param {boolean} bObrigatorio - Se o recurso é obrigatório
         * @returns {string} - Tipo de highlight
         */
        highlightByObrigatorio: function (bObrigatorio) {
            return bObrigatorio ? "Error" : "None";
        },

        /**
         * Formata o título da página de detalhe
         * @param {string} sTitulo - Título do recurso
         * @param {string} sTipo - Tipo do recurso
         * @returns {string} - Título formatado
         */
        tituloDetalhe: function (sTitulo, sTipo) {
            return sTitulo + " (" + sTipo + ")";
        },

        /**
         * Verifica se existe URL válida
         * @param {string} sUrl - URL do recurso
         * @returns {boolean} - True se existe URL
         */
        hasUrl: function (sUrl) {
            return !!sUrl && sUrl !== "";
        }
    };
});