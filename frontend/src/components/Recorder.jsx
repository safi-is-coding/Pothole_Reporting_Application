import React, { useRef, useState } from 'react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import './Recorder.css'; // optional: separate CSS file

const Recorder = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('');
  const [videoBlob, setVideoBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  const showToast = (msg, type = "success") => {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "bottom",
      position: "center",
      style: {
        background: type === "success" ? "#28a745" : "#dc3545"
      }
    }).showToast();
  };

  const startRecording = async () => {
    try {
      const constraints = {
        video: { facingMode: { exact: "environment" } },
        audio: true,
      };
      let mediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        showToast("Back camera not available. Using default camera", "error");
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;

      const recorder = new MediaRecorder(mediaStream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        videoRef.current.src = URL.createObjectURL(blob);
        videoRef.current.srcObject = null;
        videoRef.current.controls = true;
        videoRef.current.play();
        setStatus('Recording complete.');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setStatus('Recording...');
    } catch {
      showToast("Camera access denied", "error");
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  };

  const uploadVideo = async () => {
    if (!videoBlob) return showToast("No video to upload.", "error");

    try {
      setStatus("Getting location...");
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(p => res(p.coords), () => rej("Location denied"))
      );

      const formData = new FormData();
      formData.append("video", videoBlob, "pothole.webm");
      formData.append("latitude", pos.latitude);
      formData.append("longitude", pos.longitude);
      formData.append("accuracy", pos.accuracy);
      formData.append("timestamp", new Date().toISOString());

      setStatus("Uploading...");

      const res = await fetch("https://pothole-recording-backend.vercel.app/api/v1/pothole", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        showToast("Upload successful!");
        setStatus("Upload complete.");
      } else {
        showToast("Upload failed", "error");
        setStatus("Upload failed.");
      }
    } catch (err) {
      showToast("Upload failed", "error");
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="container">
      <h4>Welcome!</h4>
      <video ref={videoRef} autoPlay muted />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={uploadVideo} disabled={!videoBlob} style={{ backgroundColor: "slateblue" }}>
        Upload Video
      </button>
      <p className="status">{status}</p>
    </div>
  );
};

export default Recorder;
