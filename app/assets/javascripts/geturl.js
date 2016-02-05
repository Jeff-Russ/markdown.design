 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        geturl.js          part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.~/
LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy  */

"use strict";

window.geturlInit = function () {

    $('#geturl-submit-btn').on('click', function () {

        var source = $('input[name=geturl-source-radio]:checked').val(),
            view = $('input[name=geturl-view-radio]:checked').val() || "show_toc",
            mdd = 'http://www.markdown.design/',
            output;

        if (source === "amazon_s3") {
            var bucket = $('#geturl-bucket').val(),
                s3path = $('#geturl-s3path').val();

            if (bucket === '' || s3path === '') {
                output = "ENTER BOTH BUCKET AND PATH";
            } else {
                switch (view) {
                case 'show_toc':
                    output = mdd + '?docs=' + bucket + '/' + s3path;
                    break;
                case 'hide_toc':
                    output = mdd + '?doch=' + bucket + '/' + s3path;
                    break;
                case 'top':
                    output = mdd + '?pages=' + bucket + '/' + s3path;
                    break;
                case 'full':
                    output = mdd + "?full=" + bucket + '/' + s3path;
                    break;
                }
            }
            if (output.endsWith('.md')) {
                output = window.removeExtension(output);
            }
        } else if (source === "github_readme") {
            var ghUser = $('#geturl-gh-user').val(),
                ghRepo = $('#geturl-gh-repo').val();

            if (ghUser === '' || ghRepo === '') {
                output = "ENTER BOTH USER AND REPO";
            } else {
                switch (view) {
                case 'show_toc':
                    output = mdd + '?ghrm=' + ghUser + '/' + ghRepo;
                    break;
                case 'hide_toc':
                    output = mdd + '?doch&ghrm=' + ghUser + '/' + ghRepo;
                    break;
                case 'top':
                    output = mdd + '?pages&ghrm=' + ghUser + '/' + ghRepo;
                    break;
                case 'full':
                    output = mdd + "?full&ghrm=" + ghUser + '/' + ghRepo;
                    break;
                }
            }
        }

        $('#geturl-output').attr('href', output);
        $('#geturl-output').text(output);
    });
};