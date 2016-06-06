/**
 * @module Info
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * Static class holding library specific information such as the version and buildDate of
	 * the library.
	 * @class Info
	 **/
	var i = gbjs.Info = gbjs.Info || {};

	/**
	 * The version string for this release.
	 * @property version
	 * @type String
	 * @static
	 **/
	i.version = /*=version*/""; // injected by build process

	/**
	 * The build date for this release in UTC format.
	 * @property buildDate
	 * @type String
	 * @static
	 **/
	i.buildDate = /*=date*/""; // injected by build process

})();