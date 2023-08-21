import srv from './fetch_';
import {trans} from './general_';
import {addMessage} from './components/message-footer';
;
const [file_list_prefix, moving_gallery_prefix, library_documents_prefix] = ["files", "moving_gallery_prefix", "library_documents_prefix"];

const [chatting_list_index, chatting_thread] = ["chatting_lists", "chat_hash_prefix"];

function error_handle(error) {
  console.warn(error);
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
  try {
    for(let key in template){
      template[key] = readPosition(template[key]);
    }
  } catch (error) {
    console.error('reading from local stroage:', type, json, template, error);
    throw error; 
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
      case "textToExplanation": return {
        q: ["q"],
        is_share: ['is_share'],
        timestamp: ['timestamp'],
        text_explaination_history_id: ['text_explaination_history_id'],
        usage: ['usage'],
        anwser: ['result', 'choices', 0, 'message', 'content'],
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
      try {
        ret.push({
          ...extractFromStructure(raw[catalog_key][content], catalog_key),
          type: catalog_key,
        });
      } catch (error) {
        continue;
      }
    }
  ret.sort((a, b) =>{
    return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()
    ? 1
    : -1
  });
  return ret;
}
/////////////////////////////////////////////////
function uploadPDF(file, callback){
  try {
    srv.uploadFile(file, (res) => {
      console.log(res);
      try {
        //if readable from local storage, add to local storage
        const libraryFromLC = JSON.parse(localStorage.getItem(library_documents_prefix));
        libraryFromLC.data.push(res);
        localStorage.setItem(library_documents_prefix, JSON.stringify(libraryFromLC));
      } catch (error) {
        //create a new set, and add to local storage
        localStorage.setItem(library_documents_prefix, JSON.stringify({data: [res]}));
      }
      callback(res);
    });
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
function getDocuments(callback){
  try {
    let oldDataFromLC = JSON.parse(localStorage.getItem(moving_gallery_prefix));
    if(oldDataFromLC?.data){
      //if have old data
      if(new Date(oldDataFromLC.timestamp).getDate() !== new Date().getDate()){
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
        res.timestamp = new Date().getDate();
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
        let userHistoryFileHash = localStorage.getItem(library_documents_prefix);
        if(userHistoryFileHash){
          userHistoryFileHash = JSON.parse(userHistoryFileHash).data;
          localStorage.removeItem(library_documents_prefix);
          userHistoryFileHash.forEach((el) => {
            deleteHistory("comprehension", el.filehash);
            deleteHistory("text", el.filehash);
            deleteHistory("image", el.filehash);
          });
        } 
      }
      callback(res);
    })
  } catch (error) {
    error_handle(error);
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

    const subKeyName = q;
    //pull history
    const history = pull_history(fileHash, 'textToExplanation', subKeyName);
    if(history !== false){
      callback(history);
      return;
    }
    //read from server
    srv.text_to_explanation(fileHash, q, (res) => {
      if(res.data) setHistory('text', fileHash, q, res.data);
      callback(res);
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
          //reading comprehension have level, else dosn't
          if(item.level){
            setHistory(type, item.filehash, `${item.q}-${item.level}`, item);
          }else{
            setHistory(type, item.filehash, item.q, item);
          }
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
        const history = getHistory('comprehension', fileHash);
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
function userToggleTextToExplainationShare(item, callback){
  try {
    const {text_explaination_history_id, is_share, q, level, fileHash} = item;
    srv.userToggleTextToExplainationShare(text_explaination_history_id, is_share, (res) => {
      if(res.data){
        const subKeyName = `${q}-${level}`;
        const history = getHistory('text', fileHash);
        history['is_share'] = is_share;
        setHistory('text', fileHash, subKeyName, history);

        callback(res);
      }else callback(false);
    })
  } catch (error) {
    error_handle(error);
    callback(false);
  }
}
///for chatting//////////////////////////////
const saveChat = (threadHash, model, question, messages, response) => {
  //chatting_list_index, chatting_thread
  const threadKeyName = chatting_thread + threadHash;
  try {
    const history = JSON.parse(localStorage.getItem(chatting_list_index));
    if(history[threadHash] !== undefined){
      //exists
      try {
        //insert into chatting thread
        const topic = JSON.parse(localStorage.getItem(threadKeyName));
        topic.push(threadTemplate());
        localStorage.setItem(threadKeyName, JSON.stringify(topic));
      } catch (error) {
        error_handle(error);
        initThread();
      }
    }else{
      //if not exists
      updateList(history);
      initThread();
    }
  } catch (error) {
    error_handle(error);
    updateList();
    initThread();
  }
  //////////helper/////////////////////////
  function updateList(history = undefined){
    if(history !== undefined){
      history[threadHash] ={
        model,
        threadHash, 
        question, 
        timestamp: new Date().getTime()
      }
    }else{
      history = {[threadHash]: {
        model,
        threadHash, 
        question, 
        timestamp: new Date().getTime()
      }};
    }
    
    localStorage.setItem(chatting_list_index, JSON.stringify(history));
  }
  //
  function initThread(){
    localStorage.setItem(threadKeyName, JSON.stringify([threadTemplate()]));
  }
  //
  function threadTemplate(){
    return {
      threadHash, 
      question, 
      messages,
      response,
      timestamp: new Date().getTime()
    };
  }
}
const readThreadsAsArray = () => {
  try {
    const history = Object.values(JSON.parse(localStorage.getItem(chatting_list_index)));
    return Array.isArray(history)? history: [];
  } catch (error) {
    error_handle(error);
    return [];
  }
}

const readThread = (threadHash) => {
  try {
    const thread = JSON.parse(localStorage.getItem(chatting_thread + threadHash));
    return thread;
  } catch (error) {
    error_handle(error);
    return [];
  }
}
const clearAllThreads = () => {
  const threads = readThreadsAsArray();
  threads.forEach(el => {
    removeThread(el.threadHash);
  })
  localStorage.removeItem(chatting_list_index)
}
const removeThread = (threadHash) => {
  try {
    localStorage.removeItem(chatting_thread + threadHash);
    return true;
  } catch (error) {
    error_handle(error);
    return false;
  }
}
//////////////////////////////////////////
const wrapper = {
  getFileDetail,
  uploadPDF,
  getDocuments,
  getLibrary,
  UserLogout,
  addDocumentToUser,
  questionToReadingComprehension,
  getAllHistoryFromFileHash,
  userToggleReadingComprehensionShare,
  getAllHistoryOrderByUnifyTime,
  textToExplanation,
  userToggleTextToExplainationShare,
  //for chatting///////////////////
  saveChat, readThreadsAsArray, readThread,
  clearAllThreads, removeThread
}

export default wrapper;