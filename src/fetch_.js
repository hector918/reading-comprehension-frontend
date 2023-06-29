const API = process.env.REACT_APP_API_URL;
let default_fetch_options = { 
  "Access-Control-Allow-Origin": "*" ,
  "Content-Type": "application/json"
};
function error_handle(error) {
  console.log(error);
}
/////////////////////////////////////////////////
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
function getDocuments(type, callback){
  const body = {
    method: "POST",
    body: JSON.stringify(type),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch(`${API}/pda/list`, body)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      callback(data);
    })
    .catch(error => {
      error_handle(error);
      callback(false);
    });
}
/////////////////////////////////////////////////
const entry = { 
  checkLoginFunction,
  getDocuments,
  pdfThumbnailPrefix:`${API}/pda/pdf_thumbnail`,
};
export default entry;