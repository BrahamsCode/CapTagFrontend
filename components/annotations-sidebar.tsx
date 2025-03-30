"use client"

import { Trash2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Annotation } from "@/types/annotations"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AnnotationsSidebarProps {
  annotations: Annotation[]
  onDelete: (id: string) => void
  activeAnnotation: string | null
  onAnnotationHover: (id: string | null) => void
}

export default function AnnotationsSidebar({
  annotations,
  onDelete,
  activeAnnotation,
  onAnnotationHover,
}: AnnotationsSidebarProps) {
  if (annotations.length === 0) {
    return (
      <div className="sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Anotaciones</h2>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">0 items</span>
        </div>

        <div className="text-center p-8 border rounded-xl bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-muted/50 mx-auto flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay anotaciones. Haz clic en "Añadir anotación" para comenzar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Anotaciones</h2>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
          {annotations.length} {annotations.length === 1 ? "item" : "items"}
        </span>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
        <div className="space-y-4">
          {annotations.map((annotation, index) => (
            <Card
              key={annotation.id}
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                activeAnnotation === annotation.id ? "ring-2" : ""
              }`}
              style={{
                borderColor: annotation.color || "#ff6b6b",
                ...(activeAnnotation === annotation.id ? { ringColor: annotation.color || "#ff6b6b" } : {}),
              }}
              onMouseEnter={() => onAnnotationHover(annotation.id)}
              onMouseLeave={() => onAnnotationHover(null)}
            >
              <div
                className="px-4 py-2 flex items-center justify-between text-white"
                style={{ backgroundColor: annotation.color || "#ff6b6b" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-bold"
                    style={{ color: annotation.color || "#ff6b6b" }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-medium">Anotación {index + 1}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(annotation.id)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <p
                  className={`text-sm ${annotation.textFormat?.includes("bold") ? "font-bold" : ""} ${
                    annotation.textFormat?.includes("italic") ? "italic" : ""
                  } ${annotation.textFormat?.includes("underline") ? "underline" : ""}`}
                >
                  {annotation.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

