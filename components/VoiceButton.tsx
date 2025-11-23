"use client";

import { useState } from "react";
import { useVoiceRecording } from "@/lib/hooks/use-voice-recording";
import { motion } from "framer-motion";

export function VoiceButton() {
  const { isRecording, startRecording, stopRecording, audioBlob, error } =
    useVoiceRecording();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSubmitAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      // Handle transcribed text
      console.log("Transcription:", data.text);
    } catch (err) {
      console.error("Error submitting audio:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={handleToggleRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition-all ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            : "bg-sacred-purple-600 hover:bg-sacred-purple-700 text-white shadow-lg"
        }`}
        animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRecording ? "⏹" : "🎤"}
      </motion.button>

      {isRecording && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sacred-purple-600 font-semibold animate-pulse">
            Recording...
          </p>
        </motion.div>
      )}

      {audioBlob && !isRecording && (
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={handleSubmitAudio}
            disabled={isProcessing}
            className="px-6 py-2 bg-sacred-teal-600 hover:bg-sacred-teal-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Submit"}
          </button>
        </motion.div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">
          Error: {error.message}
        </p>
      )}
    </div>
  );
}
