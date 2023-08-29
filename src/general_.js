import CryptoJS from 'crypto-js';

/////////////////////////////////////////////////
function removeAllChild(node){
  if(!node || !node.childNodes) return false;
  for(let x of node.childNodes){
    node.removeChild(x);
  }
}

function createElement(json){
  const root = document.createElement(json['tagname_'] || "div");
  for(var x in json)
  {
    switch(x)
    {
      case "tagname_":
        //ignore 
      break;
      case "childs_":
        for(var o in json[x])
        {
          //if json[x][o] === json object than create element, else just append
          if(json[x][o].constructor === ({}).constructor){
            var children = createElement(json[x][o]);
            root.append(children);
          }else{
            root.append(json[x][o]);
          } 
        }
      break;
      case "innerHTML":case "innerText":case "textContent":
        root[x]=json[x];
      break;
      case "event_":
        for(let ev in json[x])
        {
          root.addEventListener(ev,json[x][ev],true);
        }
      break;
      // case "export_":
      //   root.export[json[x]] = root['self'];
      // break;
      default :
        root.setAttribute(x,json[x]);
      break;
    }
  }
  return root;
}

function loadingIcon(){
  return <div className="fa-1x loading-icon-h"><i className="fas fa-circle-notch fa-pulse"></i></div>;
}
////this is callback version of createFileHash//////////
// function createHash(file, callback){
//   var reader = new FileReader();
//   reader.onload = function (evt) {
//     const hash = CryptoJS.SHA256(arrayBufferToWordArray(evt.target.result)).toString();
//     callback(hash);
//     ///////////////////////////////
//     function arrayBufferToWordArray(ab) {
//       var i8a = new Uint8Array(ab);
//       var a = [];
//       for (var i = 0; i < i8a.length; i += 4) {
//         a.push((i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | (i8a[i + 3]));
//       }
//       return CryptoJS.lib.WordArray.create(a, i8a.length);
//     }
//   };
//   reader.readAsArrayBuffer(file);
// }

function setDeepJsonValue(json, level, deepValue){
  var ret = json;
  for(let idx in level){
    if(ret[level[idx]] === undefined) ret[level[idx]] = {};
    if(Number(idx) === (level.length -1)){
      ret[level[idx]] = deepValue;
    } 
    ret = ret[level[idx]];
  }
  return json;
}
function createPasswordHash(str){
  const hashDigest = CryptoJS.SHA256(str);
  return hashDigest.toString();
}

function createHashFromStr(str){
  return CryptoJS.MD5(str, { outputLength: 8 }).toString();
}

function createFileHash(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function (evt) {
      const hash = CryptoJS.SHA256(arrayBufferToWordArray(evt.target.result)).toString();
      resolve(hash);
    };
    reader.onerror = function (evt) {
      reject(evt.target.error);
    };
    reader.readAsArrayBuffer(file);

    ///////////////////////////////
    function arrayBufferToWordArray(ab) {
      var i8a = new Uint8Array(ab);
      var a = [];
      for (var i = 0; i < i8a.length; i += 4) {
        a.push((i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | (i8a[i + 3]));
      }
      return CryptoJS.lib.WordArray.create(a, i8a.length);
    }
  });
}
///////////////////////////////////
function throttle(fn, wait) {
  let lastCall = Date.now() - wait;
  return function() {
    let now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      fn.apply(this, arguments);
    }
  };
}
///////////////////////////////////
function trans(str, translation){
  try {
    if(translation[str]) return translation[str];
    
  } catch (error) {
    return str;
  }
  return str;
}
/////////////////////////////////////
var setfileHash_ = undefined;
function change_setFileHash(func){
  setfileHash_ = func;
}
function setFileHash(filehash){
  if(setfileHash_){
    setfileHash_(filehash);
  } 
}
/////////////////////////////////////

export {
  removeAllChild, 
  createElement, 
  trans, 
  createFileHash,
  createPasswordHash,
  loadingIcon,
  change_setFileHash, setFileHash,
  createHashFromStr,
  throttle,
  setDeepJsonValue
};