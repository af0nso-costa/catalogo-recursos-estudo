sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"../model/formatter"
], function (Controller, JSONModel, MessageBox, formatter) {
	"use strict";

	return Controller.extend("brightstart.ips.ui5.controller.RecursoDetail", {
		formatter: formatter,

		/**
		 * Inicialização do controlador
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("recursoDetail").attachPatternMatched(this._onPatternMatched, this);
		},

		/**
		 * Handler quando a rota é ativada
		 * @param {sap.ui.base.Event} oEvent - Evento de pattern matched
		 * @private
		 */
		_onPatternMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var sDisciplinaId = oArgs.disciplinaId;
			var sRecursoId = oArgs.recursoId;
			
			// Armazenar IDs para navegação
			this._sDisciplinaId = sDisciplinaId;
			this._sRecursoId = sRecursoId;

			// Buscar recurso
			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			
			var oDisciplina = aDisciplinas.find(function (d) {
				return d.id === sDisciplinaId;
			});

			if (oDisciplina) {
				var oRecurso = oDisciplina.recursos.find(function (r) {
					return r.id === sRecursoId;
				});

				if (oRecurso) {
					// Criar modelo local para o recurso
					var oRecursoModel = new JSONModel(oRecurso);
					this.getView().setModel(oRecursoModel, "recurso");
				} else {
					// Recurso não encontrado
					MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("errorNotFound"), {
						onClose: function () {
							this.onNavBack();
						}.bind(this)
					});
				}
			} else {
				// Disciplina não encontrada
				MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("errorNotFound"), {
					onClose: function () {
						this._oRouter.navTo("disciplinaList");
					}.bind(this)
				});
			}
		},

		/**
		 * Navega de volta para lista de recursos
		 */
		onNavBack: function () {
			this._oRouter.navTo("recursoList", {
				disciplinaId: this._sDisciplinaId
			});
		},

		/**
		 * Abre URL do recurso em nova aba
		 */
		onOpenUrl: function () {
			var oRecursoModel = this.getView().getModel("recurso");
			var sUrl = oRecursoModel.getProperty("/url");

			// Validação defensiva (Nível C)
			if (sUrl && sUrl.trim() !== "") {
				window.open(sUrl, "_blank");
			} else {
				var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("noUrl");
				MessageBox.warning(sMessage);
			}
		}
	});
});
