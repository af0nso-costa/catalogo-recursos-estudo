sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("brightstart.ips.ui5.controller.RecursoList", {
		formatter: formatter,

		/**
		 * Inicialização do controlador
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("recursoList").attachPatternMatched(this._onPatternMatched, this);
		},

		/**
		 * Handler quando a rota é ativada
		 * @param {sap.ui.base.Event} oEvent - Evento de pattern matched
		 * @private
		 */
		_onPatternMatched: function (oEvent) {
			var sDisciplinaId = oEvent.getParameter("arguments").disciplinaId;
			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			var oDisciplina = aDisciplinas.find(function (d) {
				return d.id === sDisciplinaId;
			});

			if (oDisciplina) {
				this.getView().setModel(new JSONModel(oDisciplina), "disciplina");
				this._sDisciplinaId = sDisciplinaId;

				var sQuery = this.getOwnerComponent().getModel("appState").getProperty("/searchQuery");
				if (sQuery) {
					this._applySearchFilter(sQuery);
				}
			} else {
				this.onNavBack();
			}
		},

		/**
		 * Navega de volta para lista de disciplinas
		 */
		onNavBack: function () {
			this._oRouter.navTo("disciplinaList");
		},

		/**
		 * Navega para detalhes do recurso
		 * @param {sap.ui.base.Event} oEvent - Evento de pressionar item
		 */
		onRecursoPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("disciplina");
			var sRecursoId = oContext.getProperty("id");

			this._oRouter.navTo("recursoDetail", {
				disciplinaId: this._sDisciplinaId,
				recursoId: sRecursoId
			});
		},

		/**
		 * Filtra recursos baseado no termo de pesquisa
		 * @param {sap.ui.base.Event} oEvent - Evento de pesquisa
		 */
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			this.getOwnerComponent().getModel("appState").setProperty("/searchQuery", sQuery);
			this._applySearchFilter(sQuery);
		},

		/**
		 * Limpa a pesquisa
		 */
		onClearSearch: function () {
			this.byId("searchField").setValue("");
			this.getOwnerComponent().getModel("appState").setProperty("/searchQuery", "");
			this._applySearchFilter("");
		},

		/**
		 * Aplica filtro de pesquisa na lista de recursos
		 * @param {string} sQuery - Termo de pesquisa
		 * @private
		 */
		_applySearchFilter: function (sQuery) {
			var oBinding = this.byId("recursosList").getBinding("items");
			if (!oBinding) {
				return;
			}

			var aFilters = [];
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new Filter({
					filters: [
						new Filter("titulo", FilterOperator.Contains, sQuery),
						new Filter("descricao", FilterOperator.Contains, sQuery)
					],
					and: false
				}));
			}
			oBinding.filter(aFilters);
		}
	});
});
