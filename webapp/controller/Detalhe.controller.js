sap.ui.define([
    "catalogo/recursos/estudo/controller/BaseController",
    "catalogo/recursos/estudo/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, formatter, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("catalogo.recursos.estudo.controller.Detalhe", {
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the controller is instantiated.
         * @public
         */
        onInit: function () {
            // Create view model
            var oViewModel = new JSONModel({
                busy: false,
                disciplina: ""
            });
            this.setModel(oViewModel, "detalheView");

            // Register route matched handler
            var oRouter = this.getRouter();
            oRouter.getRoute("detalhe").attachPatternMatched(this._onRouteMatched, this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler when URL is opened
         * @public
         */
        onOpenUrl: function () {
            var oContext = this.getView().getBindingContext();
            if (oContext) {
                var sUrl = oContext.getProperty("url");
                if (sUrl) {
                    sap.m.URLHelper.redirect(sUrl, true);
                } else {
                    MessageToast.show("URL não disponível");
                }
            }
        },

        /**
         * Toggle full screen mode
         * @public
         */
        handleFullScreen: function () {
            var oPage = this.byId("detalhePage");
            oPage.setShowFooter(false);
        },

        /**
         * Exit full screen mode
         * @public
         */
        handleExitFullScreen: function () {
            var oPage = this.byId("detalhePage");
            oPage.setShowFooter(true);
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @param {string} sDisciplina - Discipline name
         * @param {string} sRecursoIndex - Resource index
         * @private
         */
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sDisciplina = decodeURIComponent(oArgs.disciplina);
            var sRecursoIndex = oArgs.recursoIndex;

            // Update view model
            this.getModel("detalheView").setProperty("/disciplina", sDisciplina);

            // Find the correct path
            var oModel = this.getModel();
            var aDisciplinas = oModel.getProperty("/Disciplinas");
            var sPath = null;

            for (var i = 0; i < aDisciplinas.length; i++) {
                if (aDisciplinas[i].nome === sDisciplina) {
                    sPath = "/Disciplinas/" + i + "/recursos/" + sRecursoIndex;
                    break;
                }
            }

            if (sPath) {
                this.getView().bindElement({
                    path: sPath,
                    events: {
                        dataRequested: function () {
                            this.getModel("detalheView").setProperty("/busy", true);
                        }.bind(this),
                        dataReceived: function () {
                            this.getModel("detalheView").setProperty("/busy", false);
                        }.bind(this)
                    }
                });
            } else {
                // Navigate to not found page if resource doesn't exist
                this.getRouter().getTargets().display("notFound");
            }
        }
    });
});