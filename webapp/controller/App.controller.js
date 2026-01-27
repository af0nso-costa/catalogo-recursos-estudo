sap.ui.define([
    "catalogo/recursos/estudo/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("catalogo.recursos.estudo.controller.App", {
        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });
});