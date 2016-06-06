/**
 * @module ChairContainer
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/*
	 * @class ChairContainer
	 * @extends Container
	 * @constructor
	 **/
	function ChairContainer() {
		this.Container_constructor();

	}


	var p = createjs.extend(ChairContainer, createjs.Container);


	gbjs.ChairContainer = createjs.promote(ChairContainer, "Container");

})();