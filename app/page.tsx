"use client"

import { useState } from "react"
import ImageAnnotator from "@/components/image-annotator"
import ImageUploader from "@/components/image-uploader"
import AnnotationsSidebar from "@/components/annotations-sidebar"
import { Button } from "@/components/ui/button"
import type { Annotation } from "@/types/annotations"
import { PlusCircle } from "lucide-react"

export default function Home() {
  const [image, setImage] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [isAnnotating, setIsAnnotating] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setAnnotations([])
  }

  const handleSaveAnnotation = (annotation: Annotation) => {
    setAnnotations([...annotations, annotation])
    setIsAnnotating(false)
  }

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((ann) => ann.id !== id))
    if (activeAnnotation === id) {
      setActiveAnnotation(null)
    }
  }

  const handleAnnotationHover = (id: string | null) => {
    setActiveAnnotation(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Sistema de Anotación de Documentos
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Sube imágenes, marca áreas específicas y añade comentarios para comunicar cambios o errores de forma visual.
          </p>

          {!image ? (
            <div className="max-w-xl mx-auto">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Documento</h2>
                  <div className="flex gap-3">
                    <Button onClick={() => setIsAnnotating(true)} disabled={isAnnotating} className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Añadir anotación
                    </Button>
                    <Button onClick={() => setImage(null)} variant="outline">
                      Cambiar imagen
                    </Button>
                  </div>
                </div>

                <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg">
                  <ImageAnnotator
                    imageUrl={image}
                    annotations={annotations}
                    isAnnotating={isAnnotating}
                    onSaveAnnotation={handleSaveAnnotation}
                    onCancelAnnotation={() => setIsAnnotating(false)}
                    activeAnnotation={activeAnnotation}
                    onAnnotationHover={handleAnnotationHover}
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <AnnotationsSidebar
                  annotations={annotations}
                  onDelete={handleDeleteAnnotation}
                  activeAnnotation={activeAnnotation}
                  onAnnotationHover={handleAnnotationHover}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

