import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  url: string
  caption?: string
  id: string
}

export default function VideoPlayer({ url, caption, id }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => setIsMuted(video.muted)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
    }
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  const handleError = () => {
    setError('Error loading video. Please try again later.')
  }

  return (
    <div className="space-y-2">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          id={id}
          className="w-full h-full object-contain"
          src={url}
          onError={handleError}
        >
          Your browser does not support the video tag.
        </video>
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 text-red-800">
            {error}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-2 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            <Maximize2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {caption && <p className="text-sm text-gray-600 text-center">{caption}</p>}
    </div>
  )
}

