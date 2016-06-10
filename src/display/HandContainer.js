/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function HandContainer() {
		this.Container_constructor();

		/**
		 * @protected
		 * @type {gbjs.Sortable}
		 */
		this.sortable = new gbjs.Sortable(this);
	}


	var p = createjs.extend(HandContainer, createjs.Container);

	/**
	 * Deal card
	 * @return {[type]} [description]
	 */
	p.dealCard = function() {
		// body...
	}

	gbjs.HandContainer = createjs.promote(HandContainer, "Container");

})();