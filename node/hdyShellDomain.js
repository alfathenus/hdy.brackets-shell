//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
         maxerr: 50, node: true */
(function() {
    "use strict";

    var _domainManager,
        child;

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory;
                       if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd, cwd, isWin) {

        var spawn = require('child_process').spawn,
            splitarps = require('splitargs'),
            args,
            enddir = cwd,
            tempdir;

        cmd = cmd.trim();

        // Are we changing directories?  If so we need
        // to handle that in a special way.
        if (cmd.slice(0, 3).toLowerCase() === "cd " ||
            cmd.slice(0, 3).toLowerCase() === "cd.") {

            try {
                process.chdir(cwd);
                tempdir = cmd.substring(2).trim();
                process.chdir(tempdir);
                enddir = process.cwd();
            }
            catch (e) {}

        }

        // clearing the console with clear or clr?
        if ((cmd.toLowerCase() === "clear" && !isWin) ||
            (cmd.toLowerCase() === "cls" && isWin)) {

            _domainManager.emitEvent("hdyShellDomain", "clear");

        }

        args = splitarps(cmd);
        if (args.length === 0) {
            args = [];
        }

        if (isWin) {
            cmd = 'cmd.exe';
            args.unshift('/c');
        }
        else {
            cmd = 'sh';
            args.unshift('-c');
        }

        child = spawn(cmd, args, { cwd: cwd, env: process.env });

        child.stdout.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stdout", [data.toString()]);
        });

        child.stderr.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stderr", [data.toString()]);
        });

        child.on("close", function () {
            _domainManager.emitEvent("hdyShellDomain", "close", [enddir]);
        });

        child.on("exit", function () {
            //_domainManager.emitEvent("hdyShellDomain", "close", [enddir]);
        });

    }

    function _kill() {

        if (child != null) {
            child.kill();
        }
    }

    /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
    function _init(domainManager) {

        if (!domainManager.hasDomain("hdyShellDomain")) {
            domainManager.registerDomain("hdyShellDomain", {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "kill", // command name
            _kill, // command handler function
            true, // isAsync
            "Kill the current executing process",
            []
        );

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "execute", // command name
            _execute, // command handler function
            true, // isAsync
            "Execute the given command and return the results to the UI",
            [{
                name: "cmd",
                type: "string",
                description: "The command to be executed"
            },
            {
                name: "cwd",
                type: "string",
                description: "Directory in which the command is executed"
            },
            {
                name: "isWin",
                type: "Boolean",
                description: "Is Windows System ?"
            }]
        );

        domainManager.registerEvent("hdyShellDomain",
                                    "stdout",
                                    [{name: "data", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "stderr",
                                    [{name: "err", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "close",
                                    [{name: "enddir", type: "string"}]);

        _domainManager = domainManager;
    }

    exports.init = _init;

}());
