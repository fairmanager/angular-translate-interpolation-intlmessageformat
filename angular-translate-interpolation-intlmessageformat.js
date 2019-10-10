/*!
 * angular-translate - v2.18.1 - 2018-05-19
 * 
 * Copyright (c) 2018 The angular-translate team, Pascal Precht; Licensed MIT
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["intl-messageformat"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("intl-messageformat"));
  } else {
    factory(root["IntlMessageFormat"]);
  }
}(this, function (IntlMessageFormat) {

angular.module('pascalprecht.translate')

/**
 * @ngdoc property
 * @name pascalprecht.translate.TRANSLATE_IMF_INTERPOLATION_CACHE
 * @requires TRANSLATE_IMF_INTERPOLATION_CACHE
 *
 * @description
 * Uses IntlMessageFormat.js to interpolate strings against some values.
 */
.constant('TRANSLATE_IMF_INTERPOLATION_CACHE', '$translateIntlMessageFormatInterpolation')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateIntlMessageFormatInterpolationProvider
 *
 * @description
 * Configurations for $translateIntlMessageFormatInterpolation
 */
.provider('$translateIntlMessageFormatInterpolation', $translateIntlMessageFormatInterpolationProvider);

function $translateIntlMessageFormatInterpolationProvider() {

  'use strict';

  /**
   * @ngdoc object
   * @name pascalprecht.translate.$translateIntlMessageFormatInterpolation
   * @requires pascalprecht.translate.TRANSLATE_IMF_INTERPOLATION_CACHE
   *
   * @description
   * Uses IntlMessageFormat.js to interpolate strings against some values.
   *
   * Be aware to configure a proper sanitization strategy.
   *
   * See also:
   * * {@link pascalprecht.translate.$translateSanitization}
   * * {@link https://github.com/SlexAxton/intl-messageformat.js}
   *
   * @return {object} $translateIntlMessageFormatInterpolation Interpolator service
   */
  this.$get = ['$translateSanitization', '$cacheFactory', 'TRANSLATE_IMF_INTERPOLATION_CACHE', function ($translateSanitization, $cacheFactory, TRANSLATE_IMF_INTERPOLATION_CACHE) {
    return $translateIntlMessageFormatInterpolation($translateSanitization, $cacheFactory, TRANSLATE_IMF_INTERPOLATION_CACHE);
  }];

}

function $translateIntlMessageFormatInterpolation($translateSanitization, $cacheFactory, TRANSLATE_IMF_INTERPOLATION_CACHE) {

  'use strict';

  var $translateInterpolator = {},
      $cache = $cacheFactory.get(TRANSLATE_IMF_INTERPOLATION_CACHE),
      $identifier = 'messageformat';

  if (!$cache) {
    // create cache if it doesn't exist already
    $cache = $cacheFactory(TRANSLATE_IMF_INTERPOLATION_CACHE);
  }

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateIntlMessageFormatInterpolation#setLocale
   * @methodOf pascalprecht.translate.$translateIntlMessageFormatInterpolation
   *
   * @description
   * Sets current locale (this is currently not use in this interpolation).
   *
   * @param {string} locale Language key or locale.
   */
  $translateInterpolator.setLocale = function (locale) {};

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateIntlMessageFormatInterpolation#getInterpolationIdentifier
   * @methodOf pascalprecht.translate.$translateIntlMessageFormatInterpolation
   *
   * @description
   * Returns an identifier for this interpolation service.
   *
   * @returns {string} $identifier
   */
  $translateInterpolator.getInterpolationIdentifier = function () {
    return $identifier;
  };

  /**
   * @deprecated will be removed in 3.0
   * @see {@link pascalprecht.translate.$translateSanitization}
   */
  $translateInterpolator.useSanitizeValueStrategy = function (value) {
    $translateSanitization.useStrategy(value);
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateIntlMessageFormatInterpolation#interpolate
   * @methodOf pascalprecht.translate.$translateIntlMessageFormatInterpolation
   *
   * @description
   * Interpolates given string against given interpolate params using IntlMessageFormat.js.
   *
   * @returns {string} interpolated string.
   */
  $translateInterpolator.interpolate = function (string, interpolationParams, context, sanitizeStrategy) {
    interpolationParams = interpolationParams || {};
    interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy);

    var compiledFunction = $cache.get('mf:' + string);

    // if given string wasn't compiled yet, we do so now and never have to do it again
    if (!compiledFunction) {

      // Ensure explicit type if possible
      // IntlMessageFormat checks the actual type (i.e. for amount based conditions)
      for (var key in interpolationParams) {
        if (interpolationParams.hasOwnProperty(key)) {
          // ensure number
          var number = parseInt(interpolationParams[key], 10);
          if (angular.isNumber(number) && ('' + number) === interpolationParams[key]) {
            interpolationParams[key] = number;
          }
        }
      }

      //compiledFunction = $mf.compile(string);
      compiledFunction = new IntlMessageFormat.IntlMessageFormat(string).format;
      $cache.put('mf:' + string, compiledFunction);
    }

    var interpolatedText = compiledFunction(interpolationParams);
    return $translateSanitization.sanitize(interpolatedText, 'text', sanitizeStrategy);
  };

  return $translateInterpolator;
}

$translateIntlMessageFormatInterpolation.displayName = '$translateIntlMessageFormatInterpolation';
return 'pascalprecht.translate';

}));
