 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        pageview.main.js   part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~./

LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy  */

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require page/pageview_funcs
//= require etc/geturl
//= require etc/shared
//= require etc/oscon

"use strict";

window.topbarFixed = true; // default setting

$(document).ready(function () {

    window.on_screen_console(false, false); // here you can toggle osc settings.

    // CONFIG TO DEVICE AND WINDOW
    window.onResize(); // call once on load

    // ADD HANDLERS
    window.topOffsetInit();
    $(window).resize(window.onResize()); // and add handler for resizing of window
    $('#toggle-topbar-btn').on('click', window.onToggleTopbarBtnClick);
    window.geturlInit();

    // ADD HOME URL AND LOGO
    window.HomeUrl = $('#home-url').comments().html();
    $('.home-url').attr('href', window.HomeUrl);

});
