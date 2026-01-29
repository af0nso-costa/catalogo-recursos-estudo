sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Fragment, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("brightstart.ips.ui5.controller.RecursoList", {
		formatter: formatter,

		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("recursoList").attachPatternMatched(this._onPatternMatched, this);
		},

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

		onNavBack: function () {
			this._oRouter.navTo("disciplinaList");
		},

		onRecursoPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("disciplina");
			var sRecursoId = oContext.getProperty("id");

			this._oRouter.navTo("recursoDetail", {
				disciplinaId: this._sDisciplinaId,
				recursoId: sRecursoId
			});
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			this.getOwnerComponent().getModel("appState").setProperty("/searchQuery", sQuery);
			this._applySearchFilter(sQuery);
		},

		onClearSearch: function () {
			this.byId("searchField").setValue("");
			this.getOwnerComponent().getModel("appState").setProperty("/searchQuery", "");
			this._applySearchFilter("");
		},

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
		},

		onOpenAddRecurso: function () {
			if (!this._oAddRecursoDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "brightstart.ips.ui5.view.fragments.AddRecursoDialog",
					controller: this
				}).then(function (oDialog) {
					this._oAddRecursoDialog = oDialog;
					this.getView().addDependent(this._oAddRecursoDialog);
					this._initNewRecursoModel();
					this._oAddRecursoDialog.open();
				}.bind(this));
			} else {
				this._initNewRecursoModel();
				this._oAddRecursoDialog.open();
			}
		},

		_initNewRecursoModel: function () {
			var oNewRecursoModel = new JSONModel({
				titulo: "",
				tipo: "Livro",
				descricao: "",
				url: "",
				obrigatorio: true
			});
			this.getView().setModel(oNewRecursoModel, "newRecurso");
		},

		onSaveRecurso: function () {
			var oNewRecurso = this.getView().getModel("newRecurso").getData();
			
			// Validação
			if (!oNewRecurso.titulo || oNewRecurso.titulo.trim() === "") {
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("recursoAddError"));
				return;
			}

			// Gerar ID único para o novo recurso
			var sNewId = "recurso-" + Date.now();
			oNewRecurso.id = sNewId;

			// Adicionar recurso ao modelo resources global
			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			var oDisciplina = aDisciplinas.find(function (d) {
				return d.id === this._sDisciplinaId;
			}.bind(this));
			
			if (oDisciplina) {
				oDisciplina.recursos.push(oNewRecurso);
				oResourceModel.setProperty("/Disciplinas", aDisciplinas);
				
				// Atualizar o modelo local da disciplina
				var oDisciplinaModel = this.getView().getModel("disciplina");
				oDisciplinaModel.setProperty("/recursos", oDisciplina.recursos);
			}

			// Atualizar estatísticas
			this._updateStatistics();

			// Fechar dialog e mostrar mensagem de sucesso
			this._oAddRecursoDialog.close();
			MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("recursoAdded"));
		},

		_updateStatistics: function () {
			var oResourceModel = this.getOwnerComponent().getModel("resources");
			var aDisciplinas = oResourceModel.getProperty("/Disciplinas");
			var iTotalResources = 0;
			var oResourcesByType = {
				livro: 0,
				video: 0,
				artigo: 0
			};

			aDisciplinas.forEach(function (oDisciplina) {
				if (oDisciplina.recursos) {
					iTotalResources += oDisciplina.recursos.length;
					oDisciplina.recursos.forEach(function (oRecurso) {
						if (oRecurso.tipo === "Livro") {
							oResourcesByType.livro++;
						} else if (oRecurso.tipo === "Vídeo") {
							oResourcesByType.video++;
						} else if (oRecurso.tipo === "Artigo") {
							oResourcesByType.artigo++;
						}
					});
				}
			});

			var oAppModel = this.getOwnerComponent().getModel("appState");
			oAppModel.setProperty("/totalResources", iTotalResources);
			oAppModel.setProperty("/resourcesByType", oResourcesByType);
		},

		onCancelAddRecurso: function () {
			this._oAddRecursoDialog.close();
		}
	});
});
