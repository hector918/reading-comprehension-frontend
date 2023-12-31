const API = process.env.REACT_APP_API_URL;
let default_fetch_options = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function error_handle(error) {
  console.error(error);
}

function fetch_post(url, fetchOptions, callback, method = 'POST') {
  fetchOptions.method = method;
  fetchOptions.headers = {
    ...default_fetch_options,
    ...fetchOptions.headers
  }
  if (fetchOptions.headers['Content-Type'] === "delete")
    delete fetchOptions.headers['Content-Type'];
  //add cookies before fire
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
function fetch_patch(url, fetchOptions, callback) {
  fetch_post(url, fetchOptions, callback, 'PATCH');
}
function fetch_put(url, fetchOptions, callback) {
  fetch_post(url, fetchOptions, callback, 'PUT');
}

function fetch_get(url, callback) {
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
      callback({ error: "fetch error" });
    });
}
function fetch_delete(url, callback) {
  const body = {
    method: "DELETE",
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
      callback({ error: "fetch error" });
    });
}

async function fetch_get_async(url) {
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
async function fetch_post_async(url, body) {
  try {
    body.method = "POST";
    body.headers = {
      ...body.headers,
      ...default_fetch_options,
    }
    //add cookies when fired
    body.credentials = "include";
    const res = await fetch(url, body);
    return res;
  } catch (error) {
    error_handle(error);
    return false;
  }
}
async function fetch_get_async_without_credential(url) {
  try {
    const fetch_options = {
      method: 'GET',
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }

    const response = await fetch(url, fetch_options);
    if (response.status !== 200) throw new Error(response.statusText);
    let text = await response.text();
    return text;
  } catch (error) {
    error_handle(error);
    return error;
  }
}
//// login potion/////////////////////////////////////
function checkLoginFunction(callback) {
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
function checkUserID(userId, callback) {
  const body = {
    body: JSON.stringify({ userId }),
  }
  fetch_post(`${API}/login/check_userID`, body, callback)
}
function UserRegister(form, callback) {
  const body = {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch_post(`${API}/login/register`, body, callback);
}
function UserLogin(form, callback) {
  const body = {
    body: JSON.stringify(form)
  }
  fetch_post(`${API}/login/login`, body, callback);
}
function UserLogout(callback) {
  fetch_get(`${API}/login/logout`, (data) => {
    callback(data);
  })
}
function checkLoginStatus(callback) {
  fetch_get(`${API}/login/check_login_status`, (data) => {
    callback(data);
  })
}

function UpdateUserProfile(body, callback) {
  fetch_put(`${API}/login/update_user_setting`, { body: JSON.stringify(body) }, (data) => {
    callback(data);
  })
}
function userLoginWithThirdParty(idToken, callback) {
  const body = { body: JSON.stringify({ idToken }) };
  fetch_post(`${API}/login/user_third_party_login`, body, (data) => {
    callback(data);
  });
}
////language/////////////////////////////////////
function getLanguages(callback) {
  fetch_get(`${API}/languages/all_languages`, (data) => {
    callback(data);
  });
}
function getLanguageFile(filename, callback) {
  fetch_get(`${API}/languages/change_language/${filename}`, callback);
}
/////////////////////////////////////////////////
function getDocuments(callback) {
  fetch_get(`${API}/pda/list`, (data) => {
    callback(data);
  });
}

function getLibrary(callback) {
  fetch_get(`${API}/luda/library`, (data) => {
    callback(data);
  });
}
function addDocumentToUser(filehash, callback) {
  const body = { body: JSON.stringify({ filehash }) };
  fetch_post(`${API}/luda/addDocumentToUser`, body, callback);
}
function userToggleReadingComprehensionShare(comprehension_history_id, is_share, callback) {
  const body = JSON.stringify({ comprehension_history_id, is_share });
  fetch_patch(`${API}/luda/updateReadingComprehensionShareState`, { body }, callback);
}
function userToggleTextToExplainationShare(text_explaination_history_id, is_share, callback) {
  const body = JSON.stringify({ text_explaination_history_id, is_share });
  fetch_patch(`${API}/luda/updateTextToExplainationShareState`, { body }, callback);
}
////////////////////////////////////
async function downloadFile(fileHash, callback) {
  fetch_get(`${API}/pda/${fileHash}`, callback);
}
////////////////////////////////////
async function uploadFileCheckExists(fileHash) {
  return await fetch_get_async(`${API}/pda/meta/${fileHash}`);
}

function uploadFile(files, callback) {
  const formData = new FormData();
  for (let file of files) formData.append("files", file);
  const body = {
    body: formData,
    headers: { "Content-Type": "delete" }
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
function get_all_history_from_fileHash(fileHash, callback) {
  fetch_get(`${API}/pda/chathistory/${fileHash}`, callback);
}
/////////////////////////////////////////////////
function text_to_explanation(fileHash, q, language, callback) {
  const fetch_options = {
    body: JSON.stringify({ q, fileHash, language })
  }
  fetch_post(`${API}/ra/text`, fetch_options, callback);
}
function question_to_reading_comprehension(fileHash, q, level, callback) {
  const fetch_options = {
    body: JSON.stringify({ q, fileHash, level }),
  };
  fetch_post(`${API}/rc`, fetch_options, callback);
  /* result example
  {
    "id":"chatcmpl-7FtdtwCgRUMg6nEx64M0RPrNOpZJc","object":"chat.completion",
    "created":1684023165,
    "model":"gpt-3.5-turbo-0301",
    "usage":{
      "prompt_tokens":2023,
      "completion_tokens":28,
      "total_tokens":2051
    },
    "choices":[{
      "message":{
        "role":"assistant",
        "content":"The story is about an old fisherman who has gone 84 days without catching a fish and his journey to catch a giant marlin."
      },
      "finish_reason":"stop",
      "index":0
    }]}
  */
}
async function chatting_to_openai(body, stream_callback, signal) {
  try {
    const response = await fetch_post_async(`${API}/cwo/openai/SSE`, { body: JSON.stringify(body), signal });
    if (!response.body) return;
    //pick up server sent event
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      var { value, done } = await reader.read();
      if (done) { return }
      //some times the response from server will stack together, use \n on the server to separate each response and reduce it back to original data
      const parsed = value.split("\n").filter(el => el !== undefined && el !== "");
      stream_callback(parsed);
    }
  } catch (error) {
    console.error(error);
    stream_callback(error);
  }
}

async function insertNewPrompt(type, title, prompt, linkslist, callback) {
  const body = { body: JSON.stringify({ type, title, prompt, linkslist }) };
  fetch_post(`${API}/prompt/new`, body, callback);
}

async function deletePrompt(prompt_id, callback) {
  fetch_delete(`${API}/prompt/${prompt_id}`, callback);
}

async function readPrompts(callback) {
  fetch_get(`${API}/prompt/`, callback);
}
/////////////////////////////////////////////////
const entry = {
  fetch_get_async, fetch_get_async_without_credential,
  chatting_to_openai,
  checkLoginFunction, checkUserID,
  UserRegister, UserLogin, UserLogout,
  checkLoginStatus, UpdateUserProfile,
  userLoginWithThirdParty,
  getLanguages, getLanguageFile,
  getDocuments,
  pdfThumbnailPrefix: `${API}/pda/pdf_thumbnail`,
  pdfLinkPrefix: `${API}/pda`,
  uploadFileCheckExists, uploadFile, downloadFile,
  getLibrary,
  addDocumentToUser,
  question_to_reading_comprehension,
  text_to_explanation,
  get_all_history_from_fileHash,
  userToggleReadingComprehensionShare,
  userToggleTextToExplainationShare,
  insertNewPrompt, readPrompts, deletePrompt,
};

export default entry;