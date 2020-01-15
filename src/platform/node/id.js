"use strict"
const Uint64BE = require("int64-buffer").Uint64BE
/* sumeet - reaxt native crypto available only via rn-nodiefy hack*/

/*


 const randomBytes = require("crypto").randomBytes
 module.exports = () => {
 let value = new Uint64BE(randomBytes(8))
 console.debug(`symAPMDEBUG dd-trace Created New Id ${value.toString()}`)
 return value
 }

 */
function randomFixedInteger (length) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1))
}

module.exports = () => {
  let value = new Uint64BE(randomFixedInteger(8))
  // console.debug(`symAPMDEBUG dd-trace Created New Id ${value.toString()}`)
  return value
}
/* sumeet END*/

