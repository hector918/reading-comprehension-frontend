// <!-- <script src="https://unpkg.com/pdfjs-dist@2/build/pdf.js"></script>
// <script src="https://unpkg.com/pdfjs-dist@2/build/pdf.worker.js"></script> -->
// const cdn_pdfjs_link = '//mozilla.github.io/pdf.js/build/pdf.js';
// const cdn_pdfjs_worker_link = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

////hector build jun/01/2023 //////////////////////////
async function extractTextAndImageFromPDF(url){
  let PDFJS = window['pdfjs-dist/build/pdf'];
  if(PDFJS === undefined) await init();
  PDFJS = window['pdfjs-dist/build/pdf'];
  if(PDFJS === undefined) throw new Error("pdfjs not found");
  if(url.trim() === "") return false;
  const pdf = await PDFJS.getDocument(url).promise;
  const ret = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    ret.push(await parsePage(page));
  }
  return ret;
  ////////////////////////////////////////////
  async function parsePage(page){
    const imgs = [];
    const {fnArray, argsArray} = await page.getOperatorList();
    argsArray.forEach(async (arg, i) => {
      if(fnArray[i] === PDFJS.OPS.paintImageXObject) {
        try {
          let img = await page.objs.get(arg[0]);
          imgs.push(img);
        } catch (error) {
          console.log(error);
        }
      }
    });
    const text = await page.getTextContent();
    return {imgs, text};
  }
  
}
async function init(callback){
  if(window['pdfjs-dist/build/pdf']){
    if (callback) callback();
    return;
  } 
  const cdn_pdfjs_link = `${window.location.origin}/pdf.js`;
  const cdn_pdfjs_worker_link = `${window.location.origin}/pdf.worker.js`;
  const script = document.createElement('script');
  script.src = cdn_pdfjs_link;
  script.async = true;
  script.onload = () => {
    window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = cdn_pdfjs_worker_link;
    if (callback) callback();
  };
  document.body.appendChild(script);
}
export {extractTextAndImageFromPDF, init};