"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { Annotation } from "@/types/annotations"
import { v4 as uuidv4 } from "uuid"
import { AlertCircle, Check, X, Bold, Italic, Underline } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ImageAnnotatorProps {
  imageUrl: string
  annotations: Annotation[]
  isAnnotating: boolean
  onSaveAnnotation: (annotation: Annotation) => void
  onCancelAnnotation: () => void
  activeAnnotation: string | null
  onAnnotationHover: (id: string | null) => void
}

export default function ImageAnnotator({
  imageUrl,
  annotations,
  isAnnotating,
  onSaveAnnotation,
  onCancelAnnotation,
  activeAnnotation,
  onAnnotationHover,
}: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [description, setDescription] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#ff6b6b")
  const [textFormat, setTextFormat] = useState<string[]>([])
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)

  const colors = [
    { value: "#ff6b6b", label: "Rojo" },
    { value: "#f8a5c2", label: "Rosa" },
    { value: "#63c5da", label: "Azul" },
    { value: "#88d8b0", label: "Verde" },
    { value: "#ffcc5c", label: "Amarillo" },
    { value: "#b19cd9", label: "Púrpura" },
    { value: "#6c757d", label: "Gris" },
  ]

  // Load image and set canvas dimensions
  useEffect(() => {
    const image = new Image()
    image.src = imageUrl
    image.crossOrigin = "anonymous"
    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl
      }
      setImageLoaded(true)

      if (canvasRef.current) {
        const canvas = canvasRef.current
        canvas.width = image.width
        canvas.height = image.height

        // Draw the image on the canvas
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(image, 0, 0)
          drawAnnotations(ctx)
        }
      }
    }
  }, [imageUrl, annotations])

  // Redraw canvas when annotations change or active annotation changes
  useEffect(() => {
    if (canvasRef.current && imageLoaded) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const image = new Image()
        image.src = imageUrl
        image.crossOrigin = "anonymous"
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
          drawAnnotations(ctx)
        }
      }
    }
  }, [annotations, imageLoaded, activeAnnotation])

  const drawAnnotations = (ctx: CanvasRenderingContext2D) => {
    annotations.forEach((annotation, index) => {
      const isActive = activeAnnotation === annotation.id

      // Draw rectangle
      ctx.beginPath()
      ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height)
      ctx.strokeStyle = annotation.color || "#ff6b6b"
      ctx.lineWidth = isActive ? 3 : 2
      ctx.stroke()

      // Fill with semi-transparent color
      ctx.fillStyle = `${annotation.color}33` || "#ff6b6b33"
      ctx.fill()

      // Add number label
      const labelSize = 20
      const labelX = annotation.x + 5
      const labelY = annotation.y + 5

      ctx.beginPath()
      ctx.arc(labelX + labelSize / 2, labelY + labelSize / 2, labelSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = annotation.color || "#ff6b6b"
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.font = "bold 12px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText((index + 1).toString(), labelX + labelSize / 2, labelY + labelSize / 2)
    })

    // Draw current rectangle if annotating
    if (isAnnotating && rect && rect.width > 5 && rect.height > 5) {
      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.strokeStyle = selectedColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill with semi-transparent color
      ctx.fillStyle = `${selectedColor}33`
      ctx.fill()
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotating) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    setStartPoint({ x, y })
    setRect({ x, y, width: 0, height: 0 })
    setIsDrawing(true)
    setShowAnnotationForm(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotating || !isDrawing || !startPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / canvasRect.width
    const scaleY = canvas.height / canvasRect.height

    const x = (e.clientX - canvasRect.left) * scaleX
    const y = (e.clientY - canvasRect.top) * scaleY

    // Calculate rectangle dimensions
    const width = x - startPoint.x
    const height = y - startPoint.y

    // Set rectangle with correct coordinates (handle negative width/height)
    const newRect = {
      x: width < 0 ? x : startPoint.x,
      y: height < 0 ? y : startPoint.y,
      width: Math.abs(width),
      height: Math.abs(height),
    }

    setRect(newRect)

    // Redraw canvas
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const image = new Image()
      image.src = imageUrl
      image.crossOrigin = "anonymous"
      image.onload = () => {
        ctx.drawImage(image, 0, 0)
        drawAnnotations(ctx)
      }
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && rect && rect.width > 5 && rect.height > 5) {
      setShowAnnotationForm(true)
    }
    setIsDrawing(false)
  }

  const handleSave = () => {
    if (!rect) return

    const newAnnotation: Annotation = {
      id: uuidv4(),
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      description,
      color: selectedColor,
      textFormat: textFormat,
      number: annotations.length + 1,
    }

    onSaveAnnotation(newAnnotation)
    setRect(null)
    setStartPoint(null)
    setDescription("")
    setTextFormat([])
    setShowAnnotationForm(false)
  }

  const handleCancel = () => {
    setRect(null)
    setStartPoint(null)
    setDescription("")
    setTextFormat([])
    setShowAnnotationForm(false)
    onCancelAnnotation()
  }

  const handleAnnotationClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnnotating) return

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / canvasRect.width
    const scaleY = canvas.height / canvasRect.height

    const x = (e.clientX - canvasRect.left) * scaleX
    const y = (e.clientY - canvasRect.top) * scaleY

    // Check if click is inside any annotation
    for (let i = annotations.length - 1; i >= 0; i--) {
      const ann = annotations[i]
      if (x >= ann.x && x <= ann.x + ann.width && y >= ann.y && y <= ann.y + ann.height) {
        onAnnotationHover(ann.id)
        return
      }
    }

    onAnnotationHover(null)
  }

  return (
    <div className="relative">
      {isAnnotating && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Dibuja un rectángulo para marcar el área
        </div>
      )}

      <div className="relative border rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl || "/placeholder.svg"}
          alt="Imagen para anotar"
          className="max-w-full invisible absolute"
        />
        <canvas
          ref={canvasRef}
          className={`max-w-full ${isAnnotating ? "cursor-crosshair" : "cursor-default"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleAnnotationClick}
        />
      </div>

      {showAnnotationForm && rect && (
        <Card
          className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 border-2 shadow-lg animate-in fade-in-50 zoom-in-95 duration-300"
          style={{ borderColor: selectedColor }}
        >
          <div className="p-3 text-white flex justify-between items-center" style={{ backgroundColor: selectedColor }}>
            <div className="font-medium flex items-center gap-2">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-bold"
                style={{ color: selectedColor }}
              >
                {annotations.length + 1}
              </span>
              Nueva anotación
            </div>
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`w-5 h-5 rounded-sm transition-all ${
                    selectedColor === color.value ? "ring-2 ring-white" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <ToggleGroup
                type="multiple"
                className="justify-start border-b pb-2"
                value={textFormat}
                onValueChange={setTextFormat}
              >
                <ToggleGroupItem value="bold" aria-label="Negrita">
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Cursiva">
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Subrayado">
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Textarea
              placeholder="Describe el cambio o error que debe corregirse..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                textFormat.includes("bold") ? "font-bold" : ""
              } ${textFormat.includes("italic") ? "italic" : ""} ${
                textFormat.includes("underline") ? "underline" : ""
              }`}
              autoFocus
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel} size="sm" className="gap-1">
                <X className="h-3 w-3" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!description.trim()}
                size="sm"
                className="gap-1"
                style={{
                  backgroundColor: selectedColor,
                  borderColor: selectedColor,
                }}
              >
                <Check className="h-3 w-3" />
                Guardar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

