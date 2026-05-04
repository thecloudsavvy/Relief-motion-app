'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoDialogProps {
  videoUrl: string;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
}

export function VideoDialog({ videoUrl, title, description, trigger }: VideoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={
        (trigger as React.ReactElement) || (
          <Button variant="outline" className="w-full">
            <PlayCircle size={16} className="mr-2" /> Watch Video
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black/95 border-slate-800">
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <DialogTitle className="text-slate-100">{title}</DialogTitle>
          {description && <DialogDescription className="text-slate-400 mt-1">{description}</DialogDescription>}
        </div>
        <div className="aspect-video w-full relative">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
}
