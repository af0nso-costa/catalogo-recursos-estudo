sap.ui.define([], function () {
	"use strict";

	return {
		iconByType: function (tipo) {
			if (!tipo) {
				return "sap-icon://document";
			}
			
			switch (tipo.toLowerCase()) {
				case "livro":
					return "sap-icon://course-book";
				case "vídeo":
				case "video":
					return "sap-icon://video";
				case "artigo":
					return "sap-icon://document-text";
				default:
					return "sap-icon://document";
			}
		},

		stateByObrigatorio: function (obrigatorio) {
			return obrigatorio ? "Error" : "Success";
		},

		formatObrigatorio: function (obrigatorio) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return obrigatorio 
				? resourceBundle.getText("recursoObrigatorio") 
				: resourceBundle.getText("recursoOpcional");
		},

		iconByObrigatorio: function (obrigatorio) {
			return obrigatorio ? "sap-icon://alert" : "sap-icon://information";
		},

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

		hasValidUrl: function (url) {
			if (!url || typeof url !== 'string') {
				return false;
			}
			return url.trim() !== "";
		},

		hasInvalidUrl: function (url) {
			if (!url || typeof url !== 'string') {
				return true;
			}
			return url.trim() === "";
		},

		formatDescription: function (descricao) {
			if (!descricao || descricao.trim() === "") {
				var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
				return resourceBundle.getText("noDescription");
			}
			return descricao;
		},

		formatResourceCount: function (recursos) {
			if (!recursos || !Array.isArray(recursos)) {
				return "0 recursos";
			}
			
			var count = recursos.length;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return resourceBundle.getText("disciplinaResources", [count]);
		},

		listItemType: function (tipo) {
			return "Navigation";
		},

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

		showUrlButton: function (url) {
			return this.hasValidUrl(url);
		}
	};
});
