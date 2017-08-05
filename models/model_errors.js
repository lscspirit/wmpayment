"use strict";

/**
 * A generic class that represent validation errors in a model
 */
export default class ModelErrors {
  constructor() {
    /**
     * Property errors map
     * @type {Object<String, Array<String>>}
     */
    this._errors = {};
  }

  //
  // Accessors
  //

  /**
   * Return all errors
   *
   * @example
   * // returns { name: ["must be longer than 3 characters"],
   * //           age: ["must be an integer"] }
   * model_error.errors;
   * @return {Object<String, Array<String>>} a property to error messages map
   */
  get errors() {
    return this._errors;
  }

  //
  // Public Methods
  //

  /**
   * Return whether the is any error
   * @return {Boolean} true if there is one or more errors; false otherwise
   */
  hasError() {
    return Object.keys(this._errors).length > 0;
  }

  /**
   * Add an error message to a property
   *
   * @param {String} property property name
   * @param {String} message  error message
   */
  add(property, message) {
    const msgs = this._errors[property];
    if (msgs) {
      msgs.push(message);
    } else {
      this._errors[property] = [message];
    }
  }

  /**
   * Return all error messages for a property
   *
   * @param  {String} property property name
   * @return {Array<String>} an array of error messages
   */
  propertyErrors(property) {
    return this._errors[property] || [];
  }
}