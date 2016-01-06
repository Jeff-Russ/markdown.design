// This jQuery plugin will gather the comments within
// the current jQuery collection, returning all the
// comments in a new jQuery collection.
//
// NOTE: Comments are wrapped in DIV tags.

jQuery.fn.comments = function( blnDeep ){
	var blnDeep = (blnDeep || false);
	var jComments = $( [] );
	// Loop over each node to search its children for
	// comment nodes and element nodes (if deep search).
	this.each(
		function( intI, objNode ){
			var objChildNode = objNode.firstChild;
			var strParentID = $( this ).attr( "id" );
			// Keep looping over the top-level children
			// while we have a node to examine.
			while (objChildNode){
				// Check to see if this node is a comment.
				if (objChildNode.nodeType === 8){
					// We found a comment node. Add it to
					// the nodes collection wrapped in a
					// DIV (as we may have HTML).
					jComments = jComments.add(
						"<div rel='" + strParentID + "'>" +
						objChildNode.nodeValue +
						"</div>"
						);
				} else if (
					blnDeep &&
					(objChildNode.nodeType === 1)
					) {
					// Traverse this node deeply.
					jComments = jComments.add(
						$( objChildNode ).comments( true )
						);
				}
				// Move to the next sibling.
				objChildNode = objChildNode.nextSibling;
			}
		}
		);
	// Return the jQuery comments collection.
	return( jComments );
};

// THIS MAY NOT WORK (NOT BY ME):
// jQuery extension call "callback" after scrolling stops for "timout" ms.
// $.fn.scrollEnd = function(callback, timeout) {          
// 	$(this).scroll(function(){
// 		var $this = $(this);
// 		if ($this.data('scrollTimeout')) {
// 			clearTimeout($this.data('scrollTimeout'));
// 		}
// 		$this.data('scrollTimeout', setTimeout(callback,timeout));
// 	});
// };
