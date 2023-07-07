const API = process.env.REACT_APP_API_URL;
let default_fetch_options = { 
  "Access-Control-Allow-Origin": "*" ,
  "Content-Type": "application/json",
};
function error_handle(error) {
  console.error(error);
}
function fetch_post(url, body, callback){
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
    method: "POST",
    body: JSON.stringify({userId}),
    headers: {
      ...default_fetch_options,
    },
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
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch_post(`${API}/login/access`, body, callback);
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
function getDocuments(type, callback){
  const body = {
    method: "POST",
    body: JSON.stringify(type),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch_post(`${API}/pda/list`, body, (data) => {
    callback(data);
  });
}
/////////////////////////////////////////////////
const entry = { 
  checkLoginFunction, checkUserID, UserRegister,
  getLanguages, getLanguageFile,
  getDocuments,
  pdfThumbnailPrefix:`${API}/pda/pdf_thumbnail`,
};
export default entry;