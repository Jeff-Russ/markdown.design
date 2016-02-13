 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        pageview_funcs.js  part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.~/

LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy  */

"use strict";

//  TOGGLE TOPBAR SPACING  ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~
window.toggleTopbarSpacing = function () {

    if (window.desktopMode) {

        $('.LL-7').addClass('LL-9').removeClass('LL-7');
        $('.LR-7').addClass('LC-9').removeClass('LR-7');
        $('.CL-7').addClass('CL-9').removeClass('CL-7');
        $('.CC-7').addClass('CC-9').removeClass('CC-7');
        $('.CR-7').addClass('CR-9').removeClass('CR-7');
        $('.RL-7').addClass('RC-9').removeClass('RL-7');
        $('.RR-7').addClass('RR-9').removeClass('RR-7');

    } else {

        $('.LL-9').addClass('LL-7').removeClass('LL-9');
        $('.LC-9').addClass('LR-7').removeClass('LC-9');
        $('.CL-9').addClass('CL-7').removeClass('CL-9');
        $('.CC-9').addClass('CC-7').removeClass('CC-9');
        $('.CR-9').addClass('CR-7').removeClass('CR-9');
        $('.RC-9').addClass('RL-7').removeClass('RC-9');
        $('.RR-9').addClass('RR-7').removeClass('RR-9');
    }
};

//  TOGGLE TOPBAR POSITION - FIXED / ABSOLUTE  ~._.~~._.~~._.~~._.~~._.~~._.~~._
window.onToggleTopbarBtnClick = function () {

    window.debug(window.topbarFixed);
    if (window.topbarFixed === true) {
        $('#topbar').addClass('absolute').removeClass('fixed');
        $('.topbtn-greenwell').addClass('absolute').removeClass('fixed');
        $('#toggle-topbar-img').css('opacity', '.4');
        window.topbarFixed = false;
        $("html, body").animate({scrollTop: $(document).scrollTop() + window.topOffset}, 300);
    } else {
        $('#topbar').addClass('fixed').removeClass('absolute');
        $('.topbtn-greenwell').addClass('fixed').removeClass('absolute');
        $('#toggle-topbar-img').css('opacity', '.9');
        window.topbarFixed = true;
        $("html, body").animate({scrollTop: -window.topOffset}, 300);
    }
};


/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.
         CONFIG TO DEVICE AND WINDOW SIZE*/
window.onResize = function () {
    if (!window.isMobile && $(window).width() >= 630) {
        window.desktopMode = true;
    } else {
        window.desktopMode = false;
    }
    window.toggleTopbarSpacing();
};