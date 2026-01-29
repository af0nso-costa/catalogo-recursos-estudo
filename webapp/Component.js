sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("brightstart.ips.ui5.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * Inicialização do componente
		 */
		init: function () {
			// Chamada ao init da classe pai
			UIComponent.prototype.init.apply(this, arguments);

			// Criar modelo para controle de estado da aplicação
			var oAppModel = new JSONModel({
				searchQuery: "",
				totalResources: 0,
				resourcesByType: {
					livro: 0,
					video: 0,
					artigo: 0
				}
			});
			this.setModel(oAppModel, "appState");

			// Inicializar o router
			this.getRouter().initialize();

			// Calcular estatísticas após o modelo estar disponível
			var oResourceModel = this.getModel("resources");
			if (oResourceModel) {
				oResourceModel.attachRequestCompleted(this._calculateStatistics.bind(this));
			}
		},

		/**
		 * Calcula estatísticas dos recursos
		 * @private
		 */
		_calculateStatistics: function () {
			var oResourceModel = this.getModel("resources");
			var oAppModel = this.getModel("appState");

			if (!oResourceModel) {
				return;
			}

			var aDisciplinas = oResourceModel.getProperty("/Disciplinas") || [];
			var iTotalResources = 0;
			var oResourcesByType = {
				livro: 0,
				video: 0,
				artigo: 0
			};

			aDisciplinas.forEach(function (oDisciplina) {
				var aRecursos = oDisciplina.recursos || [];
				iTotalResources += aRecursos.length;

				aRecursos.forEach(function (oRecurso) {
					var sTipo = (oRecurso.tipo || "").toLowerCase();
					if (sTipo === "livro") {
						oResourcesByType.livro++;
					} else if (sTipo === "vídeo" || sTipo === "video") {
						oResourcesByType.video++;
					} else if (sTipo === "artigo") {
						oResourcesByType.artigo++;
					}
				});
			});

			oAppModel.setProperty("/totalResources", iTotalResources);
			oAppModel.setProperty("/resourcesByType", oResourcesByType);
		}
	});
});
