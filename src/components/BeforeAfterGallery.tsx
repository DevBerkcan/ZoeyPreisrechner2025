"use client";

import { useState } from "react";
import { Images, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Beispiel-Daten für Vorher-Nachher Bilder
// Diese können später durch echte Bilder ersetzt werden
const GALLERY_DATA: Record<string, { title: string; images: { before: string; after: string; description: string }[] }> = {
  "Oberlippe": {
    title: "Oberlippe - Ergebnisse",
    images: [
      { before: "/gallery/oberlippe-before-1.jpg", after: "/gallery/oberlippe-after-1.jpg", description: "Nach 6 Behandlungen" },
    ]
  },
  "Achseln": {
    title: "Achseln - Ergebnisse",
    images: [
      { before: "/gallery/achseln-before-1.jpg", after: "/gallery/achseln-after-1.jpg", description: "Nach 8 Behandlungen" },
    ]
  },
  "Bikinizone": {
    title: "Bikinizone - Ergebnisse",
    images: [
      { before: "/gallery/bikini-before-1.jpg", after: "/gallery/bikini-after-1.jpg", description: "Nach 6 Behandlungen" },
    ]
  },
  "Beine": {
    title: "Beine - Ergebnisse",
    images: [
      { before: "/gallery/beine-before-1.jpg", after: "/gallery/beine-after-1.jpg", description: "Nach 8 Behandlungen" },
    ]
  },
};


interface BeforeAfterGalleryProps {
  selectedAreas: string[];
}

const BeforeAfterGallery = ({ selectedAreas }: BeforeAfterGalleryProps) => {
  const [currentArea, setCurrentArea] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Finde passende Galerie für das ausgewählte Areal
  const getGalleryForArea = (area: string) => {
    // Suche nach Teil-Übereinstimmung im Arealnamen
    for (const [key, value] of Object.entries(GALLERY_DATA)) {
      if (area.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return null;
  };

  const handleOpenGallery = (area: string) => {
    setCurrentArea(area);
    setCurrentImageIndex(0);
  };

  const gallery = currentArea ? getGalleryForArea(currentArea) : null;

  if (selectedAreas.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 transition-colors">
          <Images size={16} />
          Ergebnisse zeigen
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Vorher / Nachher Ergebnisse</DialogTitle>
        </DialogHeader>

        {!currentArea ? (
          // Areal-Auswahl
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Wähle ein Areal, um Behandlungsergebnisse zu sehen:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {selectedAreas.map((area) => {
                const hasGallery = getGalleryForArea(area);
                return (
                  <button
                    key={area}
                    onClick={() => handleOpenGallery(area)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      hasGallery
                        ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium text-gray-800">{area}</span>
                    {hasGallery && (
                      <span className="block text-xs text-purple-600 mt-1">
                        Bilder verfügbar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Galerie-Ansicht
          <div className="py-4">
            <button
              onClick={() => setCurrentArea(null)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
            >
              <ChevronLeft size={16} />
              Zurück zur Auswahl
            </button>

            <h3 className="font-semibold text-lg mb-4">
              {gallery?.title || `${currentArea} - Ergebnisse`}
            </h3>

            {gallery ? (
              <div className="space-y-4">
                {/* Vorher/Nachher Vergleich */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 text-center">Vorher</p>
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      {gallery.images[currentImageIndex]?.before ? (
                        <img
                          src={gallery.images[currentImageIndex].before}
                          alt="Vorher"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Images size={40} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Bild wird noch hinzugefügt</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 text-center">Nachher</p>
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      {gallery.images[currentImageIndex]?.after ? (
                        <img
                          src={gallery.images[currentImageIndex].after}
                          alt="Nachher"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Images size={40} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Bild wird noch hinzugefügt</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  {gallery.images[currentImageIndex]?.description}
                </p>

                {/* Navigation wenn mehrere Bilder */}
                {gallery.images.length > 1 && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="py-2 text-sm text-gray-600">
                      {currentImageIndex + 1} / {gallery.images.length}
                    </span>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(gallery.images.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === gallery.images.length - 1}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Kein spezifisches Bildmaterial
              <div className="text-center py-8">
                <Images size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">
                  Für dieses Areal sind noch keine Bilder verfügbar.
                </p>
                <p className="text-sm text-gray-500">
                  Typische Ergebnisse: 80-90% dauerhafte Haarreduktion nach 6-8 Behandlungen.
                </p>
              </div>
            )}

            {/* Behandlungsinfo */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Behandlungsablauf</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 6-8 Behandlungen im Abstand von 4-6 Wochen</li>
                <li>• Erste Ergebnisse oft schon nach 2-3 Sitzungen</li>
                <li>• Dauerhafte Haarreduktion von 80-90%</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BeforeAfterGallery;
