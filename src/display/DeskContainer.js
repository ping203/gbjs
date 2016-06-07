/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function DeskContainer() {
		this.Container_constructor();
	}


	var p = createjs.extend(DeskContainer, createjs.Container);


	gbjs.DeskContainer = createjs.promote(DeskContainer, "Container");

})();