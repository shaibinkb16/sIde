import ace from 'ace-builds/src-noconflict/ace';

ace.define('ace/theme/custom', ['require', 'exports', 'module', 'ace/lib/dom'], function (require, exports, module) {
    exports.isDark = false;
    exports.cssClass = 'ace-custom';
    exports.cssText = `
        .ace-custom .ace_keyword {
            color: #0000FF; /* Blue for keywords */
        }
        .ace-custom .ace_function {
            color: #FF4500; /* Orange for functions */
        }
        .ace-custom .ace_support.ace_function {
            color: #32CD32; /* Lime for built-in functions */
        }
        .ace-custom .ace_variable {
            color: #2E8B57; /* Green for variables */
        }
        .ace-custom .ace_string {
            color: #A52A2A; /* Brown for strings */
        }
        .ace-custom .ace_comment {
            color: #708090; /* Gray for comments */
        }
    `;
    var dom = require('ace/lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass);
});
