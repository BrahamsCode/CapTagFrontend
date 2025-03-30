"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Por favor, selecciona una imagen")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card
      className={`border-2 border-dashed rounded-xl transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
      }`}
    >
      <CardContent
        className="flex flex-col items-center justify-center p-16 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ImageIcon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">Arrastra y suelta tu imagen aquí</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Sube cualquier imagen o documento para comenzar a añadir anotaciones y comentarios visuales
        </p>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Seleccionar imagen
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </CardContent>
    </Card>
  )
}

