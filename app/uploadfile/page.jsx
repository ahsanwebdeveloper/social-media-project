"use client";


import { useState } from "react";
import FileUpload from "../../components/Fileupload";
export default function UploadPage() {
  const [uploadedVideo, setUploadedVideo] = useState(null);

  return (
    <div className="p-4">
      <FileUpload onSuccess={(data) => console.log("Uploaded:", data)}/>

      {uploadedVideo && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">{uploadedVideo.title}</h2>
          <p>{uploadedVideo.description}</p>
          <video
            src={uploadedVideo.videoUrl}
            controls
            className="w-full h-auto mt-2 rounded"
          ></video>
          <img
            src={uploadedVideo.thumbnailUrl}
            alt="Thumbnail"
            className="mt-2 w-64 h-40 object-cover"
          />
        </div>
      )}
    </div>
  );
}
