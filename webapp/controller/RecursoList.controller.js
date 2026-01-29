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
			
			// Buscar disciplina pelo ID
			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			
			var oDisciplina = aDisciplinas.find(function (d) {
				return d.id === sDisciplinaId;
			});

			if (oDisciplina) {
				// Criar modelo local para a disciplina
				var oDisciplinaModel = new JSONModel(oDisciplina);
				this.getView().setModel(oDisciplinaModel, "disciplina");
				
				// Armazenar ID para navegação posterior
				this._sDisciplinaId = sDisciplinaId;

				// Restaurar pesquisa se existir
				var oAppModel = this.getOwnerComponent().getModel("appState");
				var sQuery = oAppModel.getProperty("/searchQuery");
				if (sQuery) {
					this._applySearchFilter(sQuery);
				}
			} else {
				// Disciplina não encontrada, voltar
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
		 * Aplica filtro de pesquisa na lista de recursos
		 * @param {string} sQuery - Termo de pesquisa
		 * @private
		 */
		_applySearchFilter: function (sQuery) {
			var oList = this.byId("recursosList");
			var oBinding = oList.getBinding("items");

			if (!oBinding) {
				return;
			}

			var aFilters = [];
			
			if (sQuery && sQuery.length > 0) {
				// Pesquisa estendida: título E descrição (Nível B)
				var oFilterTitle = new Filter("titulo", FilterOperator.Contains, sQuery);
				var oFilterDesc = new Filter("descricao", FilterOperator.Contains, sQuery);
				
				var oCombinedFilter = new Filter({
					filters: [oFilterTitle, oFilterDesc],
					and: false
				});

				aFilters.push(oCombinedFilter);
			}

			oBinding.filter(aFilters);
		}
	});
});
