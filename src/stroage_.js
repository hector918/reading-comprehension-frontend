import CryptoJS from 'crypto-js';
import srv from './fetch_';
import {addMessage} from './components/message-footer';
;
const [fileTable, file_list_prefix, moving_gallery_prefix, library_documents_prefix] = ["files", "filehash", "moving_gallery_prefix", "library_documents_prefix"];

function error_handle(error) {
  console.log(error);
  // alert(error);
}
function check_string(){
  for(let item of arguments) if(typeof item !== 'string'){
    return false;
  }
  return true;
}

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
function setHistory(category, fileHash, subKeyName, data){
  const keyName = check_key_name(category, fileHash);
  if(!keyName) return false;
  const item = {...data, timestamp: new Date()};
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
// function pull_history(fileHash, category, question){
//   const history = getFileDetail(fileHash, [category]);
//   try{
//     if(history[category][question]){
//       return history[category][question].data;
//     }
//     return false;
//   }catch(error){
//     return false;
//   }
// }
/////////////////////////////////////////////////

// function getFileDetail(fileHash, history_category = ['metaData']){
//   const ret = {};
//   if (check_string(fileHash) === false ) return false;
//   for(let x of history_category){
//     try {
//       switch(x){
//         case "metaData":
//           ret[x] = JSON.parse(localStorage.getItem(`${file_list_prefix}-${fileHash}`));
//         break;
//         case "comprehension": case "image": case "text":
//           ret[x] = getHistory(x, fileHash);
//         break;
//         case "textToExplanation":
//           ret['textToExplanation'] = getHistory('text', fileHash);
//         break;
//         case "textToImage":
//           ret['textToImage'] = getHistory('image', fileHash);
//         break;
//         case "textToComprehension":
//           ret['textToComprehension'] = getHistory('comprehension', fileHash);
//         break;
//         default:
//           error_handle('not recognize in get file detail:' + x);
//       }
//     } catch (error) {
//       error_handle(error);
//       continue;
//     }
//   }
//   return ret;
// }
function uploadDocument(file){
  // if(res.error !== undefined) {
  //   throw new Error("upload failed");
  // }else if(res.data.fileHash.length === 64) {
  //   let files_table = localStorage.getItem(fileTable);
  //   try {
  //     files_table = JSON.parse(files_table);
  //     if(!files_table.includes(res.data.fileHash)){
  //       files_table.push(res.data.fileHash);
  //     }
  //     localStorage.setItem(fileTable, JSON.stringify(files_table));
  //   } catch (error) {
  //     error_handle(error);
  //     localStorage.setItem(fileTable, JSON.stringify([res.data.fileHash]));
  //   }
  //   // localStorage.setItem(`${file_list_prefix}-${res.data.fileHash}`, fileObjToString(files.files[0]));
  //   callback(res);
  // }
}
function getDocuments(callback){
  try {
    let oldDataFromLC = JSON.parse(localStorage.getItem(moving_gallery_prefix));
    if(oldDataFromLC.data.popular && oldDataFromLC.data.collection){
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
    console.error(error);
    callFetch();
  }
  function callFetch(){
    srv.getDocuments((res) => {
      try {
        localStorage.setItem(moving_gallery_prefix, JSON.stringify(res));
        callback(res);
      } catch (error) {
        error_handle(error);
        callback(false);
      }
    });
  }
}

function getLibrary(callback){
  try {
    try {
      //pulling history library in localstroage
      const libraryFromLC = JSON.parse(localStorage.getItem(library_documents_prefix));
      console.log("reading from lc")
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
        
        console.error(error);
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

        localStorage.removeItem(library_documents_prefix);
      }
      callback(res);
    })
  } catch (error) {
    console.error(error);
    callback(false);
  }
}

const wrapper = {
  // getFileDetail
  getDocuments,
  getLibrary,
  UserLogout,
  addDocumentToUser,
}

export default wrapper;