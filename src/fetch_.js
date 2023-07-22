const API = process.env.REACT_APP_API_URL;
let default_fetch_options = { 
  "Access-Control-Allow-Origin": "*" ,
  "Content-Type": "application/json",
};

function error_handle(error) {
  console.error(error);
}

function fetch_post(url, body, callback){
  body.method = "POST";
    body.headers = {
      ...body.headers, 
      ...default_fetch_options,
    }
  //add cookies when fired
  body.credentials = "include";
  fetch(url, body)
  .then((response) => response.json())
  .then((data) => {
    callback(data);
  })
  .catch(error => {
    error_handle(error);
    callback(false);
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
    callback(false);
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
    if(response.ok){
      return ret;
    }else {
      return false;
    }
  } catch (error) {
    error_handle(error);
    return false;
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
////////////////////////////////////
async function uploadFileCheckExists(fileHash){
  return await fetch_get_async(`${API}/pda/meta/${fileHash}`);
}

function uploadFile(files, callback){
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  const body  = {
    method: "POST",
    body: formData,
    headers : { 
      "Access-Control-Allow-Origin": "*" 
    }
  }
  fetch(`${API}/upload_files`, body)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    })
    .catch(error => {
      error_handle(error);
      callback({error});
    });
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
  uploadFileCheckExists, uploadFile,
  getLibrary,
};
export default entry;