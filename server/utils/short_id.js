"use strict";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a Base32 short id
 * @param  {Number} [size=6] the size of the id
 * @return {String} short id
 */
export default function generateShortId(size = 10) {
  let shortId = '';
  for (var i = 0; i < size; i++) {
    shortId += CHARACTERS.charAt(Math.floor(Math.random() * 32));
  }
  return shortId;
}