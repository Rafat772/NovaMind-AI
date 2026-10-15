/**
 * Voice and Speech Utilities for NovaMind AI
 * Includes Text-to-Speech (TTS) and Speech-to-Text (STT) Dictation helpers.
 */

let currentUtterance = null;

export const cleanMarkdownForSpeech = (markdown) => {
  if (!markdown) return "";
  return markdown
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold and italics
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove citation tags like [Source: filename, Page X]
    .replace(/\[Source:[^\]]+\]/gi, "")
    // Remove blockquotes and list markers
    .replace(/^>\s+/gm, "")
    .replace(/^[\*\-\+]\s+/gm, "")
    // Normalize whitespace
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
};

export const speakText = (text, { onStart, onEnd, onError }) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = cleanMarkdownForSpeech(text);
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = "en-US";

  // Pick best available English voice
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
  ) || voices.find((v) => v.lang.startsWith("en"));

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  return new SpeechRecognition();
};
