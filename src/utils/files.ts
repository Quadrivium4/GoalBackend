import "dotenv"
import {v2 as cloudinary } from "cloudinary"

//const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export interface TFile {
    public_id: string,
    name: string,
    url: string

}

const saveFile = async(file): Promise<TFile> =>{
    console.log("saving file.. " + file.name);
    const b64 = Buffer.from(file.data).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
   // console.log({dataURI, b64, mimetype: file.mimetype, name: file.name})
   try {
     const result = await cloudinary.uploader.upload(dataURI);
     console.log(result);
    return {
        url: result.url,
        name: file.name,
        public_id: result.public_id
    }
   } catch (error) {
    console.log("cloudinary error", error)
   }
   
}
const deleteFile = async(file: TFile) =>{
    console.log("deleting file", file);
    if(file.public_id){
        await cloudinary.uploader.destroy(file.public_id);
    }else{
        console.log("no public id in deleting file...")
    }
    
}
// const saveFiles = async(files)=>{
//     console.log("saving multiple files", {files})
//     const promises = [];
//     for (const file of files) {
//         promises.push(saveFile(file));
        
//     }
//     const results = await Promise.all(promises);
//     console.log({results});
//     return results;
// }
// const getFile = async(id)=>{
//     let cursor; 
//     if (id) cursor = bucket.actions.find({_id: new ObjectId(id)});
//     else {
//         cursor = bucket.actions.find({});
//     }
//     const values = await cursor.toArray();
//     return values
// }

// const downloadFile = async(req, res) =>{
//     console.log({params: req.params})
//     let id = req.params.id;

//     let stream = await bucket.actions.openDownloadStream(new ObjectId(id));
//     stream.on("error",(err)=>{
//         return res.send({err: err.message})
//     })
//     return stream.pipe(res);
// }



export {
    saveFile,
    deleteFile
}
