sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Retorna o ícone apropriado baseado no tipo de recurso
		 * @param {string} tipo - Tipo do recurso (Livro, Vídeo, Artigo)
		 * @returns {string} - Nome do ícone SAP
		 */
		iconByType: function (tipo) {
			if (!tipo) {
				return "sap-icon://document";
			}
			
			switch (tipo.toLowerCase()) {
				case "livro":
					return "sap-icon://book";
				case "vídeo":
				case "video":
					return "sap-icon://video";
				case "artigo":
					return "sap-icon://document-text";
				default:
					return "sap-icon://document";
			}
		},

		/**
		 * Retorna o estado visual baseado no campo obrigatório
		 * @param {boolean} obrigatorio - Se o recurso é obrigatório
		 * @returns {string} - Estado do ObjectStatus (Success, Warning, etc)
		 */
		stateByObrigatorio: function (obrigatorio) {
			return obrigatorio ? "Error" : "Success";
		},

		/**
		 * Retorna o texto formatado para obrigatório/opcional
		 * @param {boolean} obrigatorio - Se o recurso é obrigatório
		 * @returns {string} - Texto formatado
		 */
		formatObrigatorio: function (obrigatorio) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return obrigatorio 
				? resourceBundle.getText("recursoObrigatorio") 
				: resourceBundle.getText("recursoOpcional");
		},

		/**
		 * Retorna o ícone para o estado obrigatório
		 * @param {boolean} obrigatorio - Se o recurso é obrigatório
		 * @returns {string} - Nome do ícone
		 */
		iconByObrigatorio: function (obrigatorio) {
			return obrigatorio ? "sap-icon://alert" : "sap-icon://information";
		},

		/**
		 * Retorna a cor do ícone baseado no tipo
		 * @param {string} tipo - Tipo do recurso
		 * @returns {string} - Classe CSS de cor
		 */
		colorByType: function (tipo) {
			if (!tipo) {
				return "";
			}
			
			switch (tipo.toLowerCase()) {
				case "livro":
					return "sapUiPositiveElement";
				case "vídeo":
				case "video":
					return "sapUiCriticalElement";
				case "artigo":
					return "sapUiNeutralElement";
				default:
					return "";
			}
		},

		/**
		 * Valida se URL existe e não está vazia
		 * @param {string} url - URL do recurso
		 * @returns {boolean} - True se URL é válida
		 */
		hasValidUrl: function (url) {
			return url && url.trim() !== "";
		},

		/**
		 * Retorna descrição ou texto de fallback
		 * @param {string} descricao - Descrição do recurso
		 * @returns {string} - Descrição ou texto padrão
		 */
		formatDescription: function (descricao) {
			if (!descricao || descricao.trim() === "") {
				var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
				return resourceBundle.getText("noDescription");
			}
			return descricao;
		},

		/**
		 * Formata contador de recursos por disciplina
		 * @param {array} recursos - Array de recursos
		 * @returns {string} - Texto formatado
		 */
		formatResourceCount: function (recursos) {
			if (!recursos || !Array.isArray(recursos)) {
				return "0 recursos";
			}
			
			var count = recursos.length;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return resourceBundle.getText("disciplinaResources", [count]);
		},

		/**
		 * Retorna o tipo do item da lista baseado no tipo de recurso
		 * @param {string} tipo - Tipo do recurso
		 * @returns {string} - Tipo do ListItem
		 */
		listItemType: function (tipo) {
			return "Navigation";
		},

		/**
		 * Formata o título do tipo de recurso
		 * @param {string} tipo - Tipo do recurso
		 * @returns {string} - Título formatado do tipo
		 */
		formatTipoTitle: function (tipo) {
			if (!tipo) {
				return "";
			}
			
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (tipo.toLowerCase()) {
				case "livro":
					return resourceBundle.getText("tipoLivro");
				case "vídeo":
				case "video":
					return resourceBundle.getText("tipoVideo");
				case "artigo":
					return resourceBundle.getText("tipoArtigo");
				default:
					return tipo;
			}
		},

		/**
		 * Retorna visibilidade do botão de URL
		 * @param {string} url - URL do recurso
		 * @returns {boolean} - True se deve mostrar botão
		 */
		showUrlButton: function (url) {
			return this.hasValidUrl(url);
		}
	};
});
