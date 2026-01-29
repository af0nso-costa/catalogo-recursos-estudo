sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"../model/formatter"
], function (Controller, JSONModel, MessageBox, formatter) {
	"use strict";

	return Controller.extend("brightstart.ips.ui5.controller.RecursoDetail", {
		formatter: formatter,

		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("recursoDetail").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			this._sDisciplinaId = oArgs.disciplinaId;
			this._sRecursoId = oArgs.recursoId;

			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			var oDisciplina = aDisciplinas.find(function (d) {
				return d.id === oArgs.disciplinaId;
			});

			if (oDisciplina) {
				var oRecurso = oDisciplina.recursos.find(function (r) {
					return r.id === oArgs.recursoId;
				});

				if (oRecurso) {
					var oOldModel = this.getView().getModel("recurso");
					if (oOldModel) {
						oOldModel.destroy();
					}
					this.getView().setModel(new JSONModel(oRecurso), "recurso");
				} else {
					this._showErrorAndNavigate("errorNotFound", this.onNavBack.bind(this));
				}
			} else {
				this._showErrorAndNavigate("errorNotFound", function () {
					this._oRouter.navTo("disciplinaList");
				}.bind(this));
			}
		},

		_showErrorAndNavigate: function (sMessageKey, fnCallback) {
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText(sMessageKey);
			MessageBox.error(sMessage, {
				onClose: fnCallback
			});
		},

		onNavBack: function () {
			this._oRouter.navTo("recursoList", {
				disciplinaId: this._sDisciplinaId
			});
		},

		onOpenUrl: function () {
			var sUrl = this.getView().getModel("recurso").getProperty("/url");
			if (sUrl && sUrl.trim() !== "") {
				window.open(sUrl, "_blank");
			} else {
				var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("noUrl");
				MessageBox.warning(sMessage);
			}
		}
	});
});
