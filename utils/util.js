var util = require("./md5.js");
var aes = require("./aes.js");
//十六位十六进制数作为秘钥
var key = aes.CryptoJS.enc.Utf8.parse("2017082817430823");
//十六位十六进制数作为秘钥偏移量
var iv = aes.CryptoJS.enc.Utf8.parse("3280347182807102");
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};
const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join("-");
};
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// aes加密
const Encrypt = function(word) {
  var srcs = aes.CryptoJS.enc.Utf8.parse(word);
  var encrypted = aes.CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: aes.CryptoJS.mode.CBC,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
// 对象属性按字母排序
const objKeySort = obj => {
  var newkey = Object.keys(obj).sort();
  var newObj = {};
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]];
  }
  return newObj;
};
// MD5+key加密处理对象
const toEncryption = obj => {
  let mdData = "";
  let sortObject = objKeySort(obj);
  for (let x in sortObject) {
    mdData = mdData + x + "=" + sortObject[x] + "&";
  }
  mdData = mdData + "key=E02353AF68EBE70D507EB8BF362460B5";
  obj.sign = util.md5(mdData);
  obj.arguments = Encrypt(JSON.stringify(obj));
  console.log("请求参数", obj);
};
module.exports = {
  toEncryption,
  formatTime,
  formatDate,
  url:
    "release" === __wxConfig.envVersion
      ? "https://www.hyegm.com/cra/"
      : "http://119.61.21.185:15036/cra/"
};
console.log("envVersion", __wxConfig.envVersion);
