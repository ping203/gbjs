/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/*
	 * @class Container
	 * @extends Container
	 * @constructor
	 **/
	function Container() {
		this.Container_constructor();
	}


	var p = createjs.extend(Container, createjs.Container);

	gbjs.Container = createjs.promote(Container, "Container");

})();