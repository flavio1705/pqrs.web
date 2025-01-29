import { RefObject } from 'react'

interface AudioMessageProps {
  audioLink: string | null;
  audioRef: RefObject<HTMLAudioElement>;
}

export default function AudioMessage({ audioLink, audioRef }: AudioMessageProps) {
  if (!audioLink) {
    return <p className="text-red-500">Audio file not available</p>;
  }

  return (
    <div className="bg-purple-50 p-4 rounded-lg">
      <audio ref={audioRef} controls className="w-full">
        <source src={audioLink} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

