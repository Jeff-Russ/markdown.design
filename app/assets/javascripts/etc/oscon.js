 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        oscon.js           part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.~~/

LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy   */

"use strict";

var html = "<style>"
        + "  .#ocbg { background-color:black; width:100%; }"
        + "  .fixupl{ position:fixed; left:0%; top:0%; height:100%;"
        + "           z-index:9999; }"
        + "  .l-con { width:65%; border:1px solid white; }"
        + "  .r-cons{ position:fixed; left:75%;width:25%; height:25%;"
        + "           border:1px solid white; }"
        + "</style>"
        + "<div id='ocbg' class='fixupl'style='visibility:hidden; "
        + "                      pointer-events:none; opacity:1;'>"
        + "</div>"
        + "<div id='on_screen_console' style='pointer-events:none;"
        + "     visibility: hidden; position: fixed; z-index: 9999; "
        + "     text-shadow: 2px 2px black; color:#EEF; font-weight:100;"
        + "     font-family: Monaco, Courier New, monospace; font-size: 12px;'>"
        + "  <div id='left_console' class='l-con fixupl'</div>"
        + "  <div id='right_console_1' class='r-cons' style='top:0%;'></div>"
        + "  <div id='right_console_2' class='r-cons' style='top:25%;'></div>"
        + "  <div id='right_console_3' class='r-cons' style='top:50%;'></div>"
        + "  <div id='right_console_4' class='r-cons' style='top:75%;'></div>"
        + "</div>";
var pnt_evts = false, on_screen_console_bool, show_on_screen_console_bool;

//========== FUNCTION NEEDED LOCALLY  ==========================================

// NEEDED: var on_screen_console_bool;
// Enables console with arg of true. Messages will not be visible from this call
// but key mappings will. Press `s (backtick-s) to make visible (show).
// `h to hide, `d to disble, `e to enable, `c to clear.

// make console messages visible:
function show_on_screen_console(bool) {
    show_on_screen_console_bool = bool;
    window.log(show_on_screen_console_bool);
    if (bool) {
        $('#on_screen_console').css('visibility', 'visible');
    } else {
        $('#on_screen_console').css('visibility', 'hidden');
    }
}

//========== ON SCREEN CONSOLE TOGGLE ========================================

// Put this in document ready. window.on_screen_console(true, true); fully enables
// window.on_screen_console(true, false); enables but hides.
window.on_screen_console = function (run, show) {
    on_screen_console_bool = run;
    if (on_screen_console_bool) {
        $('#on_screen_console').remove();
        $('#ocbg').remove();
        $("body").append(html);
        var greet = "ON SCREEN CONSOLE: `d to disable, `e to enable, s to show, "
                + "h to hide, ` c to clear, f to call passed function";
        window.log(greet);
        window.oscon_keys(true);
    } else {
        $('#on_screen_console').remove();
        $('#ocbg').remove();
        // but don't disable ocs_keys in case user turns back on
    }
    if (arguments.length === 2) {
        show_on_screen_console(show);
    }
};


//========== ON SCREEN CONSOLE TOOLS ===========================================

// log a newline followed by a non urgent message:
window.log = function (string) {
    if (on_screen_console_bool) {
        $('#left_console').append("<br />js: " + string);
    }
};
// set (replace) text on right pane:
window.log1 = function (string) {
    if (on_screen_console_bool) {
        $('#right_console_1').html("<br />" + string);
    }
};
// set (replace) text on right pane:
window.log2 = function (string) {
    if (on_screen_console_bool) {
        $('#right_console_2').html("<br />" + string);
    }
};
// set (replace) text on right pane:
window.log3 = function (string) {
    if (on_screen_console_bool) {
        $('#right_console_3').html("<br />" + string);
    }
};
// set (replace) text on right pane:
window.log4 = function (string) {
    if (on_screen_console_bool) {
        $('#right_console_4').html("<br />" + string);
    }
};
// log a newline followed by a warning message:
window.warn = function (string) {
    if (on_screen_console_bool) {
        $('#left_console').append("<br />js warning: " + string + "<br />");
    }
};
// log a newline followed by a error message:
window.err = function (string) {
    if (on_screen_console_bool) {
        $('#left_console').append("<br />js error: " + string + "<br />");
    }
};
// append a message without insertion of a newline. Prepended with a space:
window.update = function (string) {
    if (on_screen_console_bool) {
        $('#left_console').append(" " + string);
    }
};
// append a message without insertion of a newline. Not repended with a space:
window.type = function (string) {
    if (on_screen_console_bool) {
        $('#left_console').append(string);
    }
};
// print a newline followed by a horiz. rule type thingo:
window.hr = function () {
    $('#left_console').append("<br />________________________________________");
};
// print a newline followed by a bar-looking thing:
window.bar = function () {
    $('#left_console').append("<br /><br />========================================");
};
// print a line break:
window.br = function () {
    $('#left_console').append("<br /><br />");
};
// print two line breaks:
window.br2 = function () {
    $('#left_console').append("<br />");
};

// clear console:
window.clear_on_screen_console = function () {
    window.on_screen_console(true, show_on_screen_console_bool);
};



//========== ON SCREEN CONSOLE KEY COMBOS =======================================

// missing numbers: 10-12,14,15,21-26,28-31,41-44,49,58-64,
//                  94,95,108,124-143,146-185,193-218
var map = {
    "8": false, // backspace
    "9": false, // tab
    "13": false, // enter
    "16": false, // shift
    "17": false, // ctrl
    "18": false, // alt
    "19": false, // pausebreak
    "20": false, // capslock
    "27": false, // escape
    "32": false, // space
    "33": false, // pageup
    "34": false, // pagedown
    "35": false, // end
    "36": false, // home
    "37": false, // left
    "38": false, // up
    "39": false, // right
    "40": false, // donw
    "45": false, // ins
    "46": false, // del
    "48": false, // 0
    "49": false, // 1
    "50": false, // 2
    "51": false, // 3
    "52": false, // 4
    "53": false, // 5
    "54": false, // 6
    "55": false, // 7
    "56": false, // 8
    "57": false, // 9
    "65": false, // a
    "66": false, // b
    "67": false, // c
    "68": false, // d
    "69": false, // e
    "70": false, // f
    "71": false, // h
    "72": false, // g
    "73": false, // i
    "74": false, // j
    "75": false, // k
    "76": false, // l
    "77": false, // m
    "78": false, // n
    "79": false, // o
    "80": false, // p
    "81": false, // q
    "82": false, // r
    "83": false, // s
    "84": false, // t
    "85": false, // u
    "86": false, // v
    "87": false, // w
    "88": false, // x
    "89": false, // y
    "90": false, // z
    "91": false, // left_window
    "92": false, // right_window
    "93": false, // select
    "96": false, // #pad 0
    "97": false, // #pad 1
    "98": false, // #pad 2
    "99": false, // #pad 3
    "100": false, // #pad 4
    "101": false, // #pad 5
    "102": false, // #pad 6
    "103": false, // #pad 7
    "104": false, // #pad 8
    "105": false, // #pad 9
    "106": false, // mult
    "107": false, // add
    "109": false, // subt
    "110": false, // dec_pnt
    "111": false, // divide
    "112": false, // f1
    "113": false, // f2
    "114": false, // f3
    "115": false, // f4
    "116": false, // f5
    "117": false, // f6
    "118": false, // f7
    "119": false, // f8
    "120": false, // f9
    "121": false, // f10
    "122": false, // f11
    "123": false, // f12
    "144": false, // numlock
    "145": false, // scrolllock
    "186": false, // semicolon
    "187": false, // equalsign
    "188": false, // comma
    "189": false, // dash
    "190": false, // period
    "191": false, // forwardslash
    "192": false, // backtick
    "219": false, // openbracket
    "220": false, // backslash
    "221": false, // closebraket
    "222": false  // singlequote
};

// Key combinations: back-tick (`) and a letter
// Call with true to enable key listening
window.oscon_keys = function (arg) {

    var bool, func, wehavefunc;

    if (typeof(arg) === "boolean") {
        bool = arg;
    } else {
        // if (typeof v === "function")
        bool = true;
        wehavefunc = true;
        func = arg;
    }

    if (bool) {
        $(document).unbind('keydown');
        $(document).unbind('keyup');

        $(document).keydown(function (e) {
            var keyCode = e.keyCode.toString();

            if (map.hasOwnProperty(keyCode)) {

                map[keyCode] = true;

                if (map["192"] && map["83"]) {
                    show_on_screen_console(true);        // ( `s ) show
                }
                if (map["192"] && map["68"]) {
                    window.on_screen_console(false);     // ( `d ) disable
                }
                if (map["192"] && map["69"]) {
                    window.on_screen_console(true);      // ( `e ) enable
                }
                if (on_screen_console_bool && show_on_screen_console_bool) {

                    if (map["72"]) {
                        show_on_screen_console(false);   // h hide
                    }
                    if (map["67"]) {
                        window.clear_on_screen_console(); // c clear
                    }
                    if (wehavefunc && map["70"]) {
                        func();                           // f call function arg
                    }
                    if (map["77"]) {
                        if (pnt_evts === false) {
                            $('#on_screen_console').attr('pointer-events', "auto");
                            $('#ocbg').attr('pointer-events', "auto");
                            window.log("Mouse Enabled");
                            pnt_evts = true;
                        } else if (pnt_evts === true) {
                            $('#on_screen_console').attr('pointer-events', "none");
                            $('#ocbg').attr('pointer-events', "auto");
                            window.log("Mouse Disabled");
                            pnt_evts = false;
                        }
                    }
                }
            }
        }).keyup(function (e) {
            var keyCode = e.keyCode.toString();
            if (map.hasOwnProperty(keyCode)) {
                map[keyCode] = false;
            }
        // e.stop();
        });
    } else {
        $(document).unbind('keydown');
        $(document).unbind('keyup');
    }
};