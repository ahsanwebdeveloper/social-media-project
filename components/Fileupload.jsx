"use client";

import { useState } from "react";

export default function FileUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !title || !description) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onSuccess && onSuccess(data);
      alert("Upload successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto p-4 border rounded shadow">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Video Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        disabled={loading}
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}
