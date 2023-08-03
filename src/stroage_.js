import srv from './fetch_';
import {trans} from './general_';
import {addMessage} from './components/message-footer';
;
const [file_list_prefix, moving_gallery_prefix, library_documents_prefix] = ["files", "filehash", "moving_gallery_prefix", "library_documents_prefix"];

function error_handle(error) {
  console.error(error);
}
function check_string(){
  for(let item of arguments) if(typeof item !== 'string'){
    return false;
  }
  return true;
}
//use local storage as cache
/////////////////////////////////////////////////
function check_key_name(category, fileHash){
  let keyName = ""
  switch(category){
    case "image":
      keyName = `${file_list_prefix}-${fileHash}-image-history`;
    break;
    case "text":
      keyName = `${file_list_prefix}-${fileHash}-text-history`;
    break;
    case "comprehension":
      keyName = `${file_list_prefix}-${fileHash}-comprehension-history`;
    break;
    default:
      return false;
  }
  return keyName;
}

function setHistory(category, fileHash, subKeyName, item){
  const keyName = check_key_name(category, fileHash);
  if(!keyName) return false;
  // const item = {...data, timestamp: new Date()};
  try {
    let history = JSON.parse(localStorage.getItem(keyName));
    history[subKeyName] = item;
    localStorage.setItem(keyName, JSON.stringify(history));
  } catch (error) {
    localStorage.setItem(keyName, JSON.stringify({[subKeyName]: item}));
  }
}

function getHistory(category, fileHash){
  if(typeof fileHash !== 'string') return false;
  const keyName = check_key_name(category, fileHash);
  try {
    const history = JSON.parse(localStorage.getItem(keyName))
    return !history ? {} : history;
  } catch (error) {
    error_handle(error);
    return {};
  }
}

function deleteHistory(category, fileHash){
  const keyName = check_key_name(category, fileHash);
  localStorage.removeItem(keyName);
}

function pull_history(fileHash, category, question){
  const history = getFileDetail(fileHash, [category]);
  try{
    if(history[category][question]){
      return history[category][question];
    }
    return false;
  }catch(error){
    return false;
  }
}

function getFileDetail(fileHash, history_category = ['metaData']){
  const ret = {};
  if (check_string(fileHash) === false ) return false;
  for(let x of history_category){
    try {
      switch(x){
        case "metaData":
          ret[x] = JSON.parse(localStorage.getItem(`${file_list_prefix}-${fileHash}`));
        break;
        case "text": case "textToExplanation":
          ret['textToExplanation'] = getHistory('text', fileHash);
        break;
        case "image": case "textToImage":
          ret['textToImage'] = getHistory('image', fileHash);
        break;
        case "comprehension": case "textToComprehension":
          ret['textToComprehension'] = getHistory('comprehension', fileHash);
        break;
        default:
          error_handle('not recognize in get file detail:' + x);
      }
    } catch (error) {
      error_handle(error);
      continue;
    }
  }
  return ret;
}
////globe helper/////////////////////////////////////
function extractFromStructure(json, type){
  //json data are nested , extract data base on template, 
  const template = dataTemplate(type);
  if(!template){
    error_handle('history data template error.')
    return;
  }
  for(let key in template){
    template[key] = readPosition(template[key]);
  }
  return template;
  ////help below//////////////////////////
  function readPosition(path){
    let value = json;
    for (const key of path) value = value[key];
    return value;
  }
  function dataTemplate(type){
    switch(type){
      case "textToComprehension": return {
        q: ["q"],
        level: ['level'],
        is_share: ['is_share'],
        timestamp: ['timestamp'],
        comprehension_history_id: ['comprehension_history_id'],
        usage: ['usage'],
        anwser: ['result', 'choices', 0, 'message', 'content']
      }
      default: return undefined;
    }
  }
}

function getAllHistoryOrderByUnifyTime(fileHash) {
  //read all history about this filehash, and reorganized it to an array and order by timestamp
  const raw = getFileDetail(fileHash, ["comprehension", "image", "text"]);
  const ret = [];
  for (let catalog_key in raw)
    for (let content in raw[catalog_key]) {
      ret.push({
        ...extractFromStructure(raw[catalog_key][content], catalog_key),
        type: catalog_key,
      });
    }
  ret.sort((a, b) =>{
    return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()
    ? 1
    : -1
  });
  return ret;
}
/////////////////////////////////////////////////
function getDocuments(callback){
  try {
    let oldDataFromLC = JSON.parse(localStorage.getItem(moving_gallery_prefix));
    if(oldDataFromLC?.data && oldDataFromLC.data.popular && oldDataFromLC.data.collection){
      //if have old data
      if(new Date(oldDataFromLC.data.timestamp).getDate() !== new Date().getDate()){
        //refreah moving gallery every day
        callFetch();
      }else callback(oldDataFromLC);
    }else{
      //request new data from server
      callFetch();
    }
  } catch (error) {
    error_handle(error);
    callFetch();
  }
  function callFetch(){
    srv.getDocuments((res) => {
      try {
        if(res.error) throw res.error;
        localStorage.setItem(moving_gallery_prefix, JSON.stringify(res));
        callback(res);
      } catch (error) {
        error_handle(error);
        callback(false);
        addMessage(trans("get document"), trans("server error, try again later."), "error");
      }
    });
  }
}

function getLibrary(callback){
  try {
    try {
      //pulling history library in localstroage
      const libraryFromLC = JSON.parse(localStorage.getItem(library_documents_prefix));
      console.log("reading library from localstorage");
      callback(libraryFromLC);
      return
    } catch (error) {
      //if parse go south remove problem data;
      localStorage.removeItem(library_documents_prefix);
    }
    //read library from server
    srv.getLibrary((res) => {
      //plug res back to localstroage if return data
      if(res.data) localStorage.setItem(library_documents_prefix, JSON.stringify(res));
      callback(res);
    });
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}

function addDocumentToUser(filehash, callback){
  try {
    srv.addDocumentToUser(filehash, (res) => {
      try {
        //receive from Local stroage
        const libraryFromLC = JSON.parse(localStorage.getItem(library_documents_prefix));
        if(res.data) {
          libraryFromLC.data.push(res.data);
          localStorage.setItem(library_documents_prefix, JSON.stringify(libraryFromLC));
        }
      } catch (error) {
        if(res.error){
          localStorage.removeItem(library_documents_prefix);
        }else{
          localStorage.setItem(library_documents_prefix, JSON.stringify({data: [res.data]}));
        }
        error_handle(error);
      }
      callback(res);
    });
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}

function UserLogout(callback){
  try {
    srv.UserLogout((res) => {
      if(res.data) {
        //remove user data if user was logout
        console.log("called stroage logout")
        const userHistoryFileHash = JSON.parse(localStorage.getItem(library_documents_prefix)).data;
        localStorage.removeItem(library_documents_prefix);
        userHistoryFileHash.forEach((el) => {
          deleteHistory("comprehension",el.filehash);
          deleteHistory("text",el.filehash);
          deleteHistory("image",el.filehash);
        });
      }
      callback(res);
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
//////////////////////////////////////////
function questionToReadingComprehension(fileHash, q, level, callback){
  try {
    if (check_string(fileHash, q) === false ) return false;
    const subKeyName = `${q}-${level}`;
    const history = pull_history(fileHash, 'comprehension', subKeyName);
    
    if(history !== false){
      callback(history);
      return;
    } 
    srv.question_to_reading_comprehension(fileHash, q, level, (res) => {
      
      //if res success
      if(res.data) setHistory("comprehension", fileHash, `${q}-${level}`, res.data);
      callback(res);
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
function textToExplanation(fileHash, q, callback){
  try {
    //pull history
    srv.text_to_explanation(fileHash, q, (res) => {
      //
      console.log(res);
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
function getAllHistoryFromFileHash(filehash, callback){
  try {
    //const history = getHistory("comprehension", filehash);
    srv.get_all_history_from_fileHash(filehash, (res) => {
      if(res.data){
        for(let type in res.data) for(let item of res.data[type])
        {
          setHistory(type, item.filehash, `${item.q}-${item.level}`, item);
        }
      }
      callback(res);
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
function userToggleReadingComprehensionShare(item, callback){
  try {
    const {comprehension_history_id, is_share, q, level, fileHash} = item;
    srv.userToggleReadingComprehensionShare(comprehension_history_id, is_share, (res) => {
      if(res.data){
        const subKeyName = `${q}-${level}`;
        const history = getHistory('comprehension', fileHash)[subKeyName];

        history['is_share'] = is_share;
        setHistory('comprehension', fileHash, subKeyName, history);

        callback(res);
      }else callback(false);
      
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
//////////////////////////////////////////
const wrapper = {
  getFileDetail,
  getDocuments,
  getLibrary,
  UserLogout,
  addDocumentToUser,
  questionToReadingComprehension,
  getAllHistoryFromFileHash,
  userToggleReadingComprehensionShare,
  getAllHistoryOrderByUnifyTime,
  textToExplanation
}

export default wrapper;