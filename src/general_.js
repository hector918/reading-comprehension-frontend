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
          var children = createElement(json[x][o]);
          root.append(children);
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

export {removeAllChild, createElement};