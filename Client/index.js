let data = [];

async function getFormate() {

  document.getElementById("loader").style.display = "block"
//   const backendUrl = "http://localhost:5500/video/data";
  const backendUrl = "https://ytdownloader-backend.herokuapp.com/video/data";
  let renderQuality = document.getElementById("renderQuality");

  // Clear all previous data:
  renderQuality.innerHTML = ""
  document.getElementById("thumbnail").src = null;
  document.getElementById("title").innerText = "";

  var inputbox = await document.getElementById("inputBox");
  const videoUrl = inputbox.value;

  let data = {
    url: videoUrl,
  };

  let response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  response = await response.json();

  document.getElementById("loader").style.display = "none"
  document.getElementById("showQuality").style.display = "block"

  if (response.status) {
    document.getElementById("title").innerText = response.title;
    document.getElementById("thumbnail").src = response.thumbnailUrl[0].url;

    

    for (let i = 0; i < response.quality.length; i++) {
      const element = await response.quality[i];

      let mimeType = await element.mimeType.split(/;/);
      mimeType = await mimeType[0].split("/");

      renderQuality.innerHTML += `<a href='http://localhost:5500/download/${element.itag}/${response.videoId}/${mimeType[1]}' target='_blank' itag='${element.itag}' type='${mimeType[1]}' id='${i}'  url='${response.videoId}'  
       class='col flex justify-content-between align-items-center' style='max-width: fit-content; border-radius: 9px; padding: 10px 18px;margin-right: 10px;margin-bottom: 15px; cursor:pointer;background:${element.audioQuality?"#ff4564":"#45c1ff"};'>
      <span class='qaulity_number text-white d-flex justify-content-center align-items-center' style='font-weight: bolder;'>${
        element.quality ? element.quality : ""
      }</span>
      <div class='d-flex text-center' style='font-weight: bolder; color: #956e6e;'>
        <span class='logo me-1'>
        ${
          mimeType[0] == "audio"
            ? `<svg style='width:20px; color:#cbb4c4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' />
          </svg>
          `
            : element.audioQuality
            ? `<svg style='width:20px; color:#cbb4c4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'>
      <path stroke-linecap='round' d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' />
        </svg>`
            : `<svg style='width:20px; color:gray ' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409' />
          </svg>
          `
        }
                        
        </span>
        <span style='color:${mimeType[0] == "audio" ? "#cbb4c4" : element.audioQuality ? "#cbb4c4":"gray"};' >${mimeType[1]}</span>
      </div>
      <span class='text-center text-white d-flex justify-content-center align-items-center' style='font-weight: bolder;'> ${(
        element.sizeInByte * 0.000001
      ).toPrecision(3)} MB</span>
    </a>`;
    }
  }

  return false;
}

const downloadVidoeB = async (id) => {

  const urlId  =  await document.getElementById(id).getAttribute("url")
  const type  = await document.getElementById(id).getAttribute("type")
  const itag  = await document.getElementById(id).getAttribute("itag")
  
  const backendUrl = await `https://ytdownloader-backend.herokuapp.com/download/${itag}/${urlId}/${type}`;

  let response = await fetch(backendUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

};
