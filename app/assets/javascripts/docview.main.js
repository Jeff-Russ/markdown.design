 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        docview.main.js    part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.~/

 LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy   */

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require etc/shared
//= require doc/docview_funcs
//= require doc/docview_topbar
//= require etc/oscon

"use strict";

// to fix navbar hiding of content when linking to spot in page:
window.addEventListener("hashchange", function () {
    scrollBy(0, -62);
});

$(document).ready(function () {

    window.on_screen_console(false, false); // here you can toggle osc settings.

    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         INITIALIZE GLOBAL VARIABLES */
    window.hasToc = true;  // eventually we will want this off for some pages.
    window.jQtocAnchors = $('#toc').find('a[href^="#"]'); // sidebar <a>-> headers
    window.topOffset = $('#topbar').height();          // height of topbar
    window.jQtocFollowBtn = $('#toc-follow-btn');
    window.jQtocBtn = $('#toc-btn');
    if ($('#hide_toc').attr('data-bool') === "true") {
        window.hide_toc = true;
        window.tocFollow = true;
        window.jQtocFollowBtn.addClass("on");
        window.showToc = true;
        window.jQtocFollowBtn.addClass("on");
    } else {
        window.hide_toc = false;
        window.tocFollow = false;
        window.jQtocFollowBtn.removeClass("on");
        window.showToc = false;
        window.jQtocFollowBtn.removeClass("on");
        window.onTocShowBtnClick();
        window.tocFollowBtnState();
    }

    window.topOffsetInit();
    if (!window.HomeUrl) {
        window.HomeUrl = "http://www.jeffruss.com/";
    }

    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         ADD HOME URL AND LOGO */
    window.HomeUrl = $('#home-url').comments().html();
    $('.home-url').attr('href', window.HomeUrl);
    var logoUrl = $('#logo-url').comments().html();
    if (!logoUrl) {
        logoUrl = "https://s3.amazonaws.com/jeffruss/img/JR_20px_wide.png";
    }
    $('.logo-url').attr('src', logoUrl);

     /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         FORMERLY "onPageLoad"  */
    // initial load from url hash
    if (window.location.hash) {
        if (window.location.hash === "#undefined") {
            window.location.hash = '';
            location.reload();
        } else {
            window.jQtopViewElem = $(decodeURIComponent(window.location.hash));
        }
    } else {
        // initial load without url hash
        var $firstSection;
        if ($('.section').size() > 0) {
            $firstSection = $('.section').first();
            window.jQtopViewElem = $firstSection;
        } else if ($('h2').size() > 0) {
            $firstSection = $('h2').first();
            window.jQtopViewElem = $firstSection;
        }
    }

    window.determineSection();
    window.updateTopbar();

    // true should be window.showToc
    if (true) {
        var tocFollowSetting = window.tocFollow;
        window.tocFollow = true; // temporarily make true
        window.updateToc();
        window.tocFollow = tocFollowSetting; // restore setting
    }

/*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.
         CONFIG TO DEVICE AND WINDOW SIZE*/
    function onWindowResize() {
        if (!window.isMobile && $(window).width() >= 800 && window.hasToc) {
            if (window.hide_toc === false) {
                window.showToc = true;
            }
        } else {
            window.showToc = false;
            window.toggleSidebar();
        }
    }

    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         CONFIG TO DEVICE AND WINDOW */
    onWindowResize(); // call once on load
    $(window).resize(onWindowResize()); // and add handler for resizing of window

    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         ADD HANDLERS */
    $(window).on("scroll", window.findNewPosition);
    window.jQtocAnchors.on('click', window.onTocClick);
    window.jQtocFollowBtn.on('click', window.onTocFollowBtnClick);
    if (window.hasToc) {
        window.jQtocBtn.on('click', window.onTocShowBtnClick);
    }
    /*_~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
         SET UP MODAL MENUS */
    window.populateModalMenus();

}); // END DOCUMENT READY

