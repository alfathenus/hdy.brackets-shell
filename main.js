/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit         = brackets.getModule("utils/AppInit"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        $icon           = $("<a class='hdy-shell-icon' href='#'> </a>")
                            .attr("title", "Shell")
                            .appendTo($("#main-toolbar .buttons"));

    AppInit.appReady(function () {

        ExtensionUtils.loadStyleSheet(module, "shellPanel.css");
        var commandShell = require('shellPanel');
        $icon.on('click', commandShell.toggle);

    });

});