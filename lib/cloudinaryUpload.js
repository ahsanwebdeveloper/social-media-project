export async function uploadToCloudinary(file, type) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log("Cloud Name:", cloudName);
  console.log("Upload Preset:", uploadPreset);
  console.log("File to upload:", file);

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars missing");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // formData.append("folder", "my_videos"); // optional

  for (const pair of formData.entries()) {
    console.log("FormData:", pair[0], pair[1]);
  }

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Upload failed");
  }

  console.log("Upload successful:", data);
  return data;
}


