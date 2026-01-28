sap.ui.define([
    "catalogo/recursos/estudo/controller/BaseController",
    "catalogo/recursos/estudo/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, FilterOperator, Fragment, JSONModel) {
    "use strict";

    return BaseController.extend("catalogo.recursos.estudo.controller.Lista", {
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the controller is instantiated.
         * @public
         */
        onInit: function () {
            // Set view model for UI state
            var oViewModel = new JSONModel({
                busy: false,
                totalRecursos: 0
            });
            this.setModel(oViewModel, "listView");

            // Create panels after a small delay to ensure model is loaded
            setTimeout(function() {
                this._createDisciplinePanels();
            }.bind(this), 100);
        },
        
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler for search field
         * @param {sap.ui.base.Event} oEvent the search event
         * @public
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("titulo", FilterOperator.Contains, sQuery),
                        new Filter("descricao", FilterOperator.Contains, sQuery),
                        new Filter("autor", FilterOperator.Contains, sQuery),
                        new Filter("tipo", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            // Apply filter to all lists in panels
            var oView = this.getView();
            var aLists = oView.findAggregatedObjects(true, function(oControl) {
                return oControl.isA("sap.m.List") && oControl.getId().includes("recursosList");
            });

            aLists.forEach(function(oList) {
                var oBinding = oList.getBinding("items");
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
            });
        },

        /**
         * Event handler when a resource item is pressed
         * @param {sap.ui.base.Event} oEvent the press event
         * @public
         */
        onRecursoPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sRecursoPath = oContext.getPath();
            
            // Get discipline name and resource index
            var aDisciplinas = this.getModel().getProperty("/Disciplinas");
            var sDisciplina = "";
            var iRecursoIndex = -1;

            // Find discipline and resource index
            for (var i = 0; i < aDisciplinas.length; i++) {
                var aRecursos = aDisciplinas[i].recursos;
                for (var j = 0; j < aRecursos.length; j++) {
                    var sPath = "/Disciplinas/" + i + "/recursos/" + j;
                    if (sPath === sRecursoPath) {
                        sDisciplina = aDisciplinas[i].nome;
                        iRecursoIndex = j;
                        break;
                    }
                }
                if (iRecursoIndex !== -1) break;
            }

            // Navigate to detail page
            this.getRouter().navTo("detalhe", {
                disciplina: encodeURIComponent(sDisciplina),
                recursoIndex: iRecursoIndex
            });
        },

        /**
         * Event handler to open About dialog
         * @public
         */
        onOpenAboutDialog: function () {
            var oView = this.getView();

            // Create dialog lazily
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "catalogo.recursos.estudo.view.fragments.About",
                    controller: this
                }).then(function (oDialog) {
                    // Connect dialog to the root view of this component
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        /**
         * Event handler to close About dialog
         * @public
         */
        onCloseAboutDialog: function () {
            this.byId("aboutDialog").close();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Creates panels for each discipline dynamically
         * @private
         */
        _createDisciplinePanels: function () {
            var oView = this.getView();
            var oModel = this.getModel();
            
            // Debug: verificar se o modelo existe
            if (!oModel) {
                console.error("Modelo não encontrado!");
                return;
            }

            var aDisciplinas = oModel.getProperty("/Disciplinas");
            
            // Debug: verificar se os dados existem
            if (!aDisciplinas || aDisciplinas.length === 0) {
                console.error("Disciplinas não encontradas no modelo!");
                console.log("Dados do modelo:", oModel.getData());
                return;
            }

            console.log("A criar painéis para", aDisciplinas.length, "disciplinas");

            var oContainer = oView.byId("disciplinasContainer");
            
            // Limpar container
            oContainer.destroyItems();

            // Criar um painel para cada disciplina
            aDisciplinas.forEach(function (oDisciplina, index) {
                var oPanel = new sap.m.Panel({
                    expandable: true,
                    expanded: true,
                    width: "auto",
                    headerToolbar: new sap.m.OverflowToolbar({
                        content: [
                            new sap.m.Title({
                                text: oDisciplina.nome,
                                level: "H2"
                            }),
                            new sap.m.ToolbarSpacer(),
                            new sap.m.Text({
                                text: oDisciplina.descricao || ""
                            }).addStyleClass("sapUiTinyMarginEnd")
                        ]
                    }),
                    content: [
                        new sap.m.List({
                            items: {
                                path: "/Disciplinas/" + index + "/recursos",
                                sorter: {
                                    path: "obrigatorio",
                                    descending: true
                                },
                                template: new sap.m.ObjectListItem({
                                    type: "Active",
                                    title: "{titulo}",
                                    intro: {
                                        parts: [
                                            {path: 'tipo'},
                                            {path: 'anoPublicacao'},
                                            {path: 'paginas'},
                                            {path: 'duracao'}
                                        ],
                                        formatter: formatter.infoAdicional
                                    },
                                    icon: {
                                        path: 'tipo',
                                        formatter: formatter.iconByType
                                    },
                                    iconDensityAware: false,
                                    highlight: {
                                        path: 'obrigatorio',
                                        formatter: formatter.highlightByObrigatorio
                                    },
                                    attributes: [
                                        new sap.m.ObjectAttribute({
                                            text: {
                                                parts: [
                                                    {path: 'i18n>/autor'},
                                                    {path: 'autor'}
                                                ],
                                                formatter: function(sLabel, sAutor) {
                                                    return sLabel + ": " + sAutor;
                                                }
                                            }
                                        })
                                    ],
                                    firstStatus: new sap.m.ObjectStatus({
                                        text: {
                                            path: 'obrigatorio',
                                            formatter: formatter.textoObrigatorio
                                        },
                                        state: {
                                            path: 'obrigatorio',
                                            formatter: formatter.stateByObrigatorio
                                        },
                                        icon: {
                                            path: 'obrigatorio',
                                            formatter: formatter.iconStatusByObrigatorio
                                        }
                                    }),
                                    press: this.onRecursoPress.bind(this)
                                })
                            },
                            noDataText: "{i18n>noResults}",
                            mode: "SingleSelectMaster"
                        })
                    ]
                }).addStyleClass("sapUiResponsiveMargin");

                oContainer.addItem(oPanel);
                console.log("Painel criado para:", oDisciplina.nome);
            }, this);
            
            console.log("Todos os painéis criados com sucesso!");
        }
    });
});