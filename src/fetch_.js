const API = process.env.REACT_APP_API_URL;
let default_fetch_options = { 
  "Access-Control-Allow-Origin": "*" ,
  "Content-Type": "application/json",
};

function error_handle(error) {
  console.error(error);
}

function fetch_post(url, fetchOptions, callback){
  fetchOptions.method = "POST";
  fetchOptions.headers = { 
    ...default_fetch_options,
    ...fetchOptions.headers
  }
  if(fetchOptions.headers['Content-Type'] === "delete")
    delete fetchOptions.headers['Content-Type'];
  //add cookies when fired
  fetchOptions.credentials = "include";
  fetch(url, fetchOptions)
  .then((response) => response.json())
  .then((data) => {
    callback(data);
  })
  .catch(error => {
    error_handle(error);
    callback(error);
  });
}

function fetch_get(url, callback){
  const body = {
    method: "GET",
    headers: {
      ...default_fetch_options,
    },
    credentials: "include",
  }
  fetch(url, body)
  .then((response) => response.json())
  .then((data) => {
    callback(data);
  })
  .catch(error => {
    error_handle(error);
    callback(error);
  });
}
async function fetch_get_async(url){
  try {
    const body = {
      method: "GET",
      headers: {
        ...default_fetch_options,
      },
      credentials: "include",
    };
    const response = await fetch(url, body);
    const ret = await response.json();
    return ret;
  } catch (error) {
    error_handle(error);
    return error;
  }
}
async function fetch_post_async(url, body){
  try {
    body.method = "POST";
    body.headers = {
      ...body.headers, 
      ...default_fetch_options,
    }
    //add cookies when fired
    body.credentials = "include";
    const res = await fetch(url, body);
    if(res.ok){
      const ret = await res.json();
      return ret;
    }else{
      return false;
    }
  } catch (error) {
    error_handle(error);
    return false;
  }
  
}
//// login potion/////////////////////////////////////
function checkLoginFunction(callback){
  fetch(`${API}/login/available`)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    })
    .catch(error => {
      error_handle(error);
      callback(false);
    });
}
function checkUserID(userId, callback){
  const body = {
    body: JSON.stringify({userId}),
  }
  fetch_post(`${API}/login/check_userID`, body, callback)
}
function UserRegister(form, callback){
  const body = {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch_post(`${API}/login/register`, body, callback);
}
function UserLogin(form, callback){
  const body = {
    body: JSON.stringify(form),
  }
  fetch_post(`${API}/login/login`, body, callback);
}
function UserLogout(callback){
  fetch_get(`${API}/login/logout`, (data) => {
    callback(data);
  })
}
function checkLoginStatus(callback){
  fetch_get(`${API}/login/check_login_status`, (data) => {
    callback(data);
  })
}
////language/////////////////////////////////////
function getLanguages(callback){
  fetch_get(`${API}/languages/all_languages`, (data) => {
    callback(data);
  });
}
function getLanguageFile(filename, callback){
  fetch_get(`${API}/languages/change_language/${filename}`, callback);
}
/////////////////////////////////////////////////
function getDocuments(callback){
  fetch_get(`${API}/pda/list`, (data) => {
    callback(data);
  });
}

function getLibrary(callback){
  fetch_get(`${API}/luda/library`, (data) => {
    callback(data);
  });
}
////////////////////////////////////
async function downloadFile (fileHash, callback){
  fetch_get(`${API}/pda/${fileHash}`, callback);
}
////////////////////////////////////
async function uploadFileCheckExists(fileHash){
  return await fetch_get_async(`${API}/pda/meta/${fileHash}`);
}

function uploadFile(files, callback){

  const formData = new FormData();
  
  for(let file of files) formData.append("files", file);
  const body  = {
    body: formData,
    headers: {"Content-Type": "delete"}
  }
  fetch_post(`${API}/upload_files`, body, callback);
  /* result example
    {
      "result":"success",
      "fileHash":"0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef",
      "message":"Successfully uploaded"
    }
  */
}
/////////////////////////////////////////////////
const entry = { 
  checkLoginFunction, checkUserID, 
  UserRegister, UserLogin, UserLogout, checkLoginStatus,
  getLanguages, getLanguageFile,
  getDocuments,
  pdfThumbnailPrefix:`${API}/pda/pdf_thumbnail`,
  uploadFileCheckExists, uploadFile, downloadFile,
  getLibrary,
};
export default entry;