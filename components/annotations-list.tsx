"use client"

import { Trash2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Annotation } from "@/types/annotations"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AnnotationsListProps {
  annotations: Annotation[]
  onDelete: (id: string) => void
}

export default function AnnotationsList({ annotations, onDelete }: AnnotationsListProps) {
  if (annotations.length === 0) {
    return (
      <div className="text-center p-8 border rounded-xl bg-muted/20">
        <div className="w-12 h-12 rounded-full bg-muted/50 mx-auto flex items-center justify-center mb-3">
          <MessageCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No hay anotaciones. Haz clic en "Añadir anotación" para comenzar.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-4">
      <div className="space-y-4">
        {annotations.map((annotation, index) => (
          <Card key={annotation.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                  {index + 1}
                </div>
                <h3 className="font-medium">Anotación {index + 1}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(annotation.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <p className="text-sm">{annotation.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

