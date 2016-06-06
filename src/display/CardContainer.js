/**
 * @module CardContainer
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function CardContainer(imageOrUri) {
		this.Container_constructor();
	}


	var p = createjs.extend(CardContainer, createjs.Container);

	gbjs.CardContainer = createjs.promote(CardContainer, "Container");

})();