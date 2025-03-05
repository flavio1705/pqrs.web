'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, ChangeEvent } from 'react'
import { format } from 'date-fns'
import { AlertCircle, ChevronDown, ChevronUp, Copy, Edit, FileText, MapPin, Save, Clock, User, Calendar, Loader2, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import AudioMessage from './AudioMessage'
import ImageCarousel from './ImageCarousel'
import { FileList } from './FileList'
import Timeline from './Timeline'
import Map from './Map'
import { Status } from './Status'
import { MetadataCard } from './MetadataCard'
import ErrorBoundary from './ErrorBoundary'
import VideoPlayer from './VideoPlayer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { StatusGravity } from './StatusGravity'

interface Attachment {
  type: 'audio' | 'image' | 'document' | 'text' | 'video'
  mediaId: string
  caption: string
  url: string
  name?: string
  content?: string
}

interface Location {
  latitude: number
  longitude: number
  address: string
}

interface Update {
  date: string
  content: string
  type?: 'image' | 'audio' | 'document' | 'video' | 'text'
}

interface PQRS {
  id: number
  type: string
  details: string
  attachments: string
  is_anonymous: number
  identifier: string
  gravity_level : 'Baja' | 'Media' | 'Alta'
  gravity_explanation : string
  phone_number: string
  subject: string
  location: string
  tracking_number: string
  timestamp: string
  created_at: string
  updated_at: string
  status?: 'pending' | 'in-progress' | 'resolved' | 'closed'
  updates: Update[]
}

interface AudioTranscription {
  [key: string]: {
    transcription: string | null;
    isTranscribing: boolean;
    isEditing: boolean;
  }
}

const getUpdateEmoji = (type?: string) => {
  switch (type) {
    case 'image': return '🖼️'
    case 'audio': return '🎵'
    case 'document': return '📄'
    case 'video': return '🎥'
    default: return '📅'
  }
}

export default function PQRSDetail() {
  const { id } = useParams()
  const [pqrs, setPQRS] = useState<PQRS | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audioTranscriptions, setAudioTranscriptions] = useState<AudioTranscription>({})
  const [copied, setCopied] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPQRS, setEditedPQRS] = useState<PQRS | null>(null)
  const router = useRouter();

  useEffect(() => {
    async function fetchPQRSDetail() {
      if (!id) {
        setError('No PQRS ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/pqrs/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }

        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data received or empty object returned')
        }
        console.log(data, 'data');

        setPQRS(data)
        setEditedPQRS(data)
      } catch (err) {
        console.error('Error in fetchPQRSDetail:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPQRSDetail()
  }, [id])

  async function requestTranscription(audioUrl: string, mediaId: string) {
    setAudioTranscriptions(prev => ({
      ...prev,
      [mediaId]: { ...prev[mediaId], isTranscribing: true }
    }))
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()
      setAudioTranscriptions(prev => ({
        ...prev,
        [mediaId]: {
          ...prev[mediaId],
          transcription: data.text,
          isTranscribing: false
        }
      }))
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setError('Failed to transcribe audio')
      setAudioTranscriptions(prev => ({
        ...prev,
        [mediaId]: { ...prev[mediaId], isTranscribing: false }
      }))
    }
  }


  const copyTrackingNumber = () => {
    if (pqrs) {
      navigator.clipboard.writeText(pqrs.tracking_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEdit = (mediaId: string) => {
    setAudioTranscriptions(prev => ({
      ...prev,
      [mediaId]: { ...prev[mediaId], isEditing: true }
    }))
  }

  const handleSave = (mediaId: string, editedTranscription: string) => {
    setAudioTranscriptions(prev => ({
      ...prev,
      [mediaId]: {
        ...prev[mediaId],
        transcription: editedTranscription,
        isEditing: false
      }
    }))
  }


  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPQRS(pqrs)
  };


  const handleSavePQRS = async () => {
    if (!editedPQRS) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/pqrs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPQRS),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      setPQRS(editedPQRS);
      setIsEditing(false);
      router.refresh()
    } catch (err) {
      console.error('Error updating PQRS:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };



  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof PQRS) => {
    if (editedPQRS) {
      setEditedPQRS({ ...editedPQRS, [field]: e.target.value });
    }
  };

  const handleSelectChange = (value: string, field: keyof PQRS) => {
    if (editedPQRS) {
      setEditedPQRS({ ...editedPQRS, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!pqrs) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No PQRS found</AlertDescription>
      </Alert>
    )
  }


  const attachments: Attachment[] = pqrs?.attachments ? JSON.parse(pqrs.attachments || '[]') : []
  const textAttachment = attachments.find(att => att.type === 'text')
  const location: Location | null = pqrs.location ? JSON.parse(pqrs.location) : null

  const imageAttachments = attachments.filter(att => att.type === 'image')
  const documentAttachments = attachments.filter(att => att.type === 'document')
  const audioAttachments = attachments.filter(att => att.type === 'audio')
  const videoAttachments = attachments.filter(att => att.type === 'video')

  const timelineItems = [
    {
      date: pqrs.created_at,
      title: 'PQRS Created',
      description: `${pqrs.type} submitted by ${pqrs.is_anonymous ? 'Anonymous' : pqrs.identifier}`
    },
    ...(pqrs.updates || []).map(update => ({
      date: update.date,
      title: 'Update',
      description: update.content
    })),
    {
      date: pqrs.updated_at,
      title: 'Last Updated',
      description: 'PQRS details were last modified'
    }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{pqrs.tracking_number}</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyTrackingNumber}
                        className="h-8 w-8 hover:bg-gray-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy tracking number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {copied && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Copied!
                  </Badge>
                )}
              </div>
              <p className="text-lg text-gray-600">Title: {pqrs.subject}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(pqrs.created_at), 'PPP')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  {pqrs.is_anonymous ? 'Anonymous' : pqrs.identifier}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Status status={pqrs?.status || 'pending'} />
              {!isEditing && (
                <Button
                  onClick={handleStartEdit}
                  variant="secondary"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">Information generated by artificial intelligence</h2>
              </div>
              <StatusGravity status={pqrs?.gravity_level || 'Baja'} />
              <p className="text-lg text-gray-600">Explanation of gravity: {pqrs.gravity_explanation}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Enhanced Details Section */}
            <Collapsible
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                </div>
                {isDetailsOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <div className="p-6">
                  <ScrollArea className="h-[400px] rounded-md">
                    <div className="prose prose-sm max-w-none space-y-6">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div>
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                value={editedPQRS?.subject || ''}
                                onChange={(e) => handleInputChange(e, 'subject')}
                              />
                            </div>
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select value={editedPQRS?.status || 'pending'} onValueChange={(value) => handleSelectChange(value, 'status')}>
                                <SelectTrigger>
                                  <SelectValue placeholder={editedPQRS?.status || 'pending'} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="details">Details</Label>
                            <Textarea
                              id="details"
                              value={editedPQRS?.details || ''}
                              onChange={(e) => handleInputChange(e, 'details')}
                              className="resize-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pqrs?.subject && (
                            <p className="text-lg font-semibold">{pqrs.subject}</p>
                          )}
                          {pqrs?.details && pqrs.details.split('\n\n').map((detail, index) => (
                            <p key={index} className="text-gray-600">{detail}</p>
                          ))}
                          {!pqrs?.subject && !pqrs?.details && <p className="text-gray-400">No subject or details provided.</p>}
                          {!pqrs?.subject && pqrs?.details && <p className="text-gray-400">No subject provided.</p>}
                          {pqrs?.subject && !pqrs?.details && <p className="text-gray-400">No details provided.</p>}
                        </div>
                      )}
                      {pqrs.updates?.map((update, index) => (
                        <div key={index} className="border-t pt-4">
                          <p className="text-sm text-gray-500 mb-2">
                            {getUpdateEmoji(update.type)} Actualización {format(new Date(update.date), 'dd/MM/yyyy')}:
                          </p>
                          <p className="text-gray-600">{update.content}</p>
                          {update.type && update.type !== "text" && (
                            <p className="text-sm text-gray-500 mt-2">
                              {getUpdateEmoji(update.type)} Se agregó un archivo
                            </p>
                          )}
                        </div>

                      ))}
                      {textAttachment?.content && (
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500 mb-2">📝 Información Adicional:</p>
                          <p className="text-gray-600">{textAttachment.content}</p>
                        </div>
                      )}
                      {isEditing && (
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button onClick={handleSavePQRS} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {location && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{location.address}</p>
                  <div className="rounded-lg overflow-hidden border">
                    <Map latitude={location.latitude} longitude={location.longitude} />
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Attachments Section */}

            {attachments.length > 0 && (
              <Collapsible
              open={isAttachmentsOpen}
              onOpenChange={setIsAttachmentsOpen}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                </div>
                {isAttachmentsOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <div className="p-6 space-y-8">
                  {imageAttachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        Images
                        <Badge variant="secondary" className="ml-2">
                          {imageAttachments.length}
                        </Badge>
                      </h4>
                      <ImageCarousel images={imageAttachments} />
                    </div>
                  )}

                  {documentAttachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        Documents
                        <Badge variant="secondary" className="ml-2">
                          {documentAttachments.length}
                        </Badge>
                      </h4>
                      <FileList files={documentAttachments} />
                    </div>
                  )}

                  {audioAttachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        Audio
                        <Badge variant="secondary" className="ml-2">
                          {audioAttachments.length}
                        </Badge>
                      </h4>
                      <div className="space-y-6">
                        {audioAttachments.map((attachment) => (
                          <div key={attachment.mediaId} className="bg-gray-50 rounded-lg p-4">
                            <AudioMessage audioLink={attachment.url} />
                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                onClick={() => requestTranscription(attachment.url, attachment.mediaId)}
                                disabled={audioTranscriptions[attachment.mediaId]?.isTranscribing}
                                variant="secondary"
                                className="w-full"
                              >
                                {audioTranscriptions[attachment.mediaId]?.isTranscribing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Transcribing...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Transcribe Audio
                                  </>
                                )}
                              </Button>
                            </div>
                            {audioTranscriptions[attachment.mediaId]?.transcription && (
                              <div className="mt-4 bg-white rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-sm text-gray-900">Transcription</h5>
                                  {audioTranscriptions[attachment.mediaId]?.isEditing ? (
                                    <Button
                                      onClick={() => handleSave(
                                        attachment.mediaId,
                                        audioTranscriptions[attachment.mediaId]?.transcription || ''
                                      )}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Save
                                    </Button>
                                  ) : (
                                    <Button onClick={() => handleEdit(attachment.mediaId)} variant="ghost" size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                                {audioTranscriptions[attachment.mediaId]?.isEditing ? (
                                  <textarea
                                    value={audioTranscriptions[attachment.mediaId]?.transcription || ''}
                                    onChange={(e) => setAudioTranscriptions(prev => ({
                                      ...prev,
                                      [attachment.mediaId]: {
                                        ...prev[attachment.mediaId],
                                        transcription: e.target.value
                                      }
                                    }))}
                                    className="w-full p-3 border rounded-md text-sm min-h-[100px]"
                                    placeholder="Edit transcription..."
                                  />
                                ) : (
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {audioTranscriptions[attachment.mediaId]?.transcription}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {videoAttachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        Videos
                        <Badge variant="secondary" className="ml-2">
                          {videoAttachments.length}
                        </Badge>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videoAttachments.map((attachment) => (
                          <div key={attachment.mediaId} className="max-w-md mx-auto w-full">
                            <VideoPlayer
                              url={attachment.url}
                              caption={attachment.caption}
                              id={`video-${attachment.mediaId}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            <MetadataCard
              title="Status Information"
              description="Current state and timeline of the PQRS"
              items={[
                {
                  label: 'Current Status',
                  value: <Status status={pqrs?.status || 'pending'} />
                },
                {
                  label: 'Created',
                  value: (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {format(new Date(pqrs.created_at), 'PPP')}
                    </div>
                  )
                },
                {
                  label: 'Last Updated',
                  value: (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {format(new Date(pqrs.updated_at), 'PPP')}
                    </div>
                  )
                },
                {
                  label: 'Type',
                  value: (
                    <Badge variant="outline" className="font-normal">
                      {pqrs.type}
                    </Badge>
                  )
                },
              ]}
            />

            <MetadataCard
              title="Contact Information"
              description="Submitter details and contact methods"
              items={[
                {
                  label: 'Submitted By',
                  value: (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {pqrs.is_anonymous ? 'Anonymous' : pqrs.identifier}
                    </div>
                  )
                },
                {
                  label: 'Phone Number',
                  value: pqrs.phone_number || 'Not provided'
                },
              ]}
            />

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h3>
                <Timeline items={timelineItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}