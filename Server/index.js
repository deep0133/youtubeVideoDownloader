const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const ytdl = require("ytdl-core");

const port = 5500;

// enabling CORS for some specific origins only.
let corsOptions = {
  origin : "*",
  method: ["GET","POST"],

}

// config:
app.use(cors());
app.use(express.json());

// end points:

// Route:1 home page :
app.get("/", async (req, res) => {
  console.log("welcome in home page:")
  
  res.send({status:true,msg:"Server is working:"})
});

//Route:2 fetch url of video and send quality of video :     BODY : { url:url}
app.post(`/video/data`, async (req, res) => {
  
  if(!req.body.url){
    console.log("url problem : "+req.body.url)
    return res.send({error:"url not found",status:false})
  }
  let url = req.body.url

  try {

    const videoId = await ytdl.getVideoID(url);
    const info = await ytdl.getBasicInfo(videoId);

    let qualityLabel = info.formats.map((val)=>{ 
      return {
        quality:val.qualityLabel?val.qualityLabel:null,
        itag:val.itag,
        mimeType:val.mimeType,
        sizeInByte:val.bitrate,
        audioQuality:val.audioQuality?val.audioQuality:null
      }})

    return res.send({ 
        status: true, 
        thumbnailUrl:info.videoDetails.thumbnail.thumbnails,
        videoUrl:info.videoDetails.video_url, 
        videoId:info.videoDetails.videoId,
        title:info.videoDetails.title, 
        timeInSecond:info.videoDetails.lengthSeconds, 
        quality: qualityLabel
    });

  } catch (err) {
    console.log("Error : "+err);
    return res.send({ status: false, err: err });
  }
});

//Route:3 :: Download video with selected format :   URL: {params: itag, type}    BODY : { url , titile}
app.get("/download/:itag/:id/:type", async (req, res) => {
  
  console.log("in download end point:")
  try{
    // let title = req.body.title.replace(/ /g,"_")       // song name
    const iTag = req.params.itag                      //  itag value
    const type = req.params.type                       // type : mp4, webm,audio
    const id = req.params.id                           // video url
    
    const url = `https://www.youtube.com/watch?v=${id}`
    //  `https://youtu.be/${id}`

    console.log(url," : "+type+" : "+iTag)

    await res.header("Content-Disposition", `attachment; filename=video.${type}`);
    await ytdl(url,{ filter: format => format.itag == iTag }).pipe(res);

  }
  catch(err){
    console.log("please follow the webpage and click button: "+err)
    res.send({status:false,msg:"Try Again"})
    res.end();
  }

});

// Server listening at port:5500
server.listen(port, () => {
  console.log(`running at localhost:${port}`);
});
