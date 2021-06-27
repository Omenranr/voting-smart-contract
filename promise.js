const fetch = require("node-fetch")

fetch("https://api.github.com/zen")
.then(result =>
    console.log(result.body))
.catch(err =>
    console.log(err))


function returnString() {
    return "Hello"
}

returnString().split("e")


function myfunction(callback) {
    callback()
}

function callbackfunction() {
    console.log("this is a callback function")
}

myfunction(callbackfunction)