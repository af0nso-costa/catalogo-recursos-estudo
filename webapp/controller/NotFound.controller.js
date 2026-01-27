sap.ui.define([
    "catalogo/recursos/estudo/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("catalogo.recursos.estudo.controller.NotFound", {

        /**
         * Navigates to the list page when the link is pressed
         * @public
         */
        onNavBack: function () {
            this.getRouter().navTo("lista");
        }
    });
});