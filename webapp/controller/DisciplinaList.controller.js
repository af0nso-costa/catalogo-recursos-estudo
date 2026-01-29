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

		/**
		 * Inicialização do controlador
		 */
		onInit: function () {
			// Referência ao router
			this._oRouter = this.getOwnerComponent().getRouter();
		},

		/**
		 * Navega para a lista de recursos da disciplina selecionada
		 * @param {sap.ui.base.Event} oEvent - Evento de pressionar item
		 */
		onDisciplinaPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("resources");
			var sDisciplinaId = oContext.getProperty("id");

			this._oRouter.navTo("recursoList", {
				disciplinaId: sDisciplinaId
			});
		},

		/**
		 * Filtra recursos baseado no termo de pesquisa
		 * @param {sap.ui.base.Event} oEvent - Evento de pesquisa
		 */
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			
			// Atualizar modelo de estado
			var oAppModel = this.getOwnerComponent().getModel("appState");
			oAppModel.setProperty("/searchQuery", sQuery);

			this._applySearchFilter(sQuery);
		},

		/**
		 * Limpa a pesquisa
		 */
		onClearSearch: function () {
			var oSearchField = this.byId("searchField");
			oSearchField.setValue("");

			var oAppModel = this.getOwnerComponent().getModel("appState");
			oAppModel.setProperty("/searchQuery", "");

			this._applySearchFilter("");
		},

		/**
		 * Aplica filtro de pesquisa em todas as disciplinas
		 * @param {string} sQuery - Termo de pesquisa
		 * @private
		 */
		_applySearchFilter: function (sQuery) {
			var oList = this.byId("disciplinaList");
			var oBinding = oList.getBinding("items");

			if (!oBinding) {
				return;
			}

			var aFilters = [];
			
			if (sQuery && sQuery.length > 0) {
				// Filtrar disciplinas que tenham recursos matching
				var oFilter = new Filter({
					path: "recursos",
					test: function (aRecursos) {
						if (!aRecursos || aRecursos.length === 0) {
							return false;
						}

						// Verifica se algum recurso match o termo
						return aRecursos.some(function (oRecurso) {
							var sTitulo = (oRecurso.titulo || "").toLowerCase();
							var sDescricao = (oRecurso.descricao || "").toLowerCase();
							var sQueryLower = sQuery.toLowerCase();

							return sTitulo.indexOf(sQueryLower) > -1 || 
							       sDescricao.indexOf(sQueryLower) > -1;
						});
					}
				});

				aFilters.push(oFilter);
			}

			oBinding.filter(aFilters);
		},

		/**
		 * Abre o diálogo "Sobre"
		 */
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

		/**
		 * Fecha o diálogo "Sobre"
		 */
		onCloseAbout: function () {
			if (this._oAboutDialog) {
				this._oAboutDialog.close();
			}
		}
	});
});
