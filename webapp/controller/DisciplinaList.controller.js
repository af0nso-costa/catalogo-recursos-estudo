sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Fragment, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("brightstart.ips.ui5.controller.DisciplinaList", {
		formatter: formatter,

		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
		},

		onDisciplinaPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("resources");
			var sDisciplinaId = oContext.getProperty("id");

			this._oRouter.navTo("recursoList", {
				disciplinaId: sDisciplinaId
			});
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			var oAppModel = this.getOwnerComponent().getModel("appState");
			oAppModel.setProperty("/searchQuery", sQuery);
			this._applySearchFilter(sQuery);
		},

		onClearSearch: function () {
			this.byId("searchField").setValue("");
			this.getOwnerComponent().getModel("appState").setProperty("/searchQuery", "");
			this._applySearchFilter("");
		},

		_applySearchFilter: function (sQuery) {
			var oBinding = this.byId("disciplinaList").getBinding("items");
			if (!oBinding) {
				return;
			}

			var aFilters = [];
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new Filter({
					path: "recursos",
					test: function (aRecursos) {
						return aRecursos && aRecursos.some(function (oRecurso) {
							var sTitulo = (oRecurso.titulo || "").toLowerCase();
							var sDescricao = (oRecurso.descricao || "").toLowerCase();
							var sQueryLower = sQuery.toLowerCase();
							return sTitulo.indexOf(sQueryLower) > -1 || sDescricao.indexOf(sQueryLower) > -1;
						});
					}
				}));
			}
			oBinding.filter(aFilters);
		},

		onOpenAbout: function () {
			if (!this._oAboutDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "brightstart.ips.ui5.view.AboutDialog",
					controller: this
				}).then(function (oDialog) {
					this._oAboutDialog = oDialog;
					this.getView().addDependent(this._oAboutDialog);
					this._oAboutDialog.open();
				}.bind(this));
			} else {
				this._oAboutDialog.open();
			}
		},

		onCloseAbout: function () {
			if (this._oAboutDialog) {
				this._oAboutDialog.close();
			}
		}
	});
});
