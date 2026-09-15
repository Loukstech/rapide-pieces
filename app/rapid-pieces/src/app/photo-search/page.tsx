'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, X, Scan, Search, Car, Wrench, CheckCircle, Loader2, Lightbulb } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BottomActionBar from '@/components/BottomActionBar';
import { useToast } from '@/components/Toast';

interface IdentifiedPart {
  name: string;
  category: string;
  confidence: number;
  compatibleVehicles: string[];
  estimatedPrice: string;
}

export default function PhotoSearchPage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentifiedPart | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setMode('camera');
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast('Impossible d\'accéder à la caméra. Utilisez l\'upload.', 'error');
      setMode(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        stopCamera();
        analyzeImage();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setMode('upload');
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: IdentifiedPart[] = [
        { name: 'Plaquettes de frein avant', category: 'Freinage', confidence: 94, compatibleVehicles: ['Toyota Corolla 2014-2019', 'Toyota Camry 2012-2017'], estimatedPrice: '35 000 - 55 000 FCFA' },
        { name: 'Filtre à huile moteur', category: 'Filtration', confidence: 87, compatibleVehicles: ['Toyota Corolla 2014-2019', 'Toyota RAV4 2013-2018'], estimatedPrice: '8 000 - 15 000 FCFA' },
        { name: 'Disque de frein avant', category: 'Freinage', confidence: 91, compatibleVehicles: ['Honda Civic 2016-2021', 'Honda Accord 2013-2017'], estimatedPrice: '30 000 - 50 000 FCFA' },
      ];
      setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setAnalyzing(false);
    }, 2500);
  };

  const reset = () => {
    setPhoto(null);
    setMode(null);
    setResult(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">Recherche par photo</h1>
            <p className="text-[10px] text-gray-400">AI Part Finder</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Mode selection */}
        {!mode && !photo && (
          <>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Identifiez votre pièce</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                Photographiez une pièce automobile et notre IA identifiera la référence, les véhicules compatibles et les prix.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={startCamera}
                className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all">
                <Camera className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Prendre une photo</h3>
                <p className="text-xs text-gray-400 mt-1">Utiliser la caméra</p>
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all">
                <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Importer une photo</h3>
                <p className="text-xs text-gray-400 mt-1">Depuis la galerie</p>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

            {/* Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Conseils pour une meilleure identification</h3>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Photo nette et bien éclairée</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> La pièce doit être visible en entier</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Si possible, montrez la référence gravée</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Évitez les photos floues ou sombres</li>
              </ul>
            </div>
          </>
        )}

        {/* Camera view */}
        {mode === 'camera' && !photo && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-2xl overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-2xl m-4 pointer-events-none" />
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" /> Caméra active
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold py-3 rounded-xl">
                Annuler
              </button>
              <button onClick={capturePhoto} className="flex-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" /> Capturer
              </button>
            </div>
          </div>
        )}

        {/* Photo preview + analyzing */}
        {photo && (
          <div className="space-y-4">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
              <img src={photo} alt="Pièce photographiée" className="w-full h-64 object-contain bg-gray-100 dark:bg-slate-700" />
              <button onClick={reset} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">
                <X className="w-4 h-4" />
              </button>
            </div>

            {analyzing && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 text-center">
                <Loader2 className="w-10 h-10 text-purple-500 mx-auto mb-3 animate-spin" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Analyse en cours...</h3>
                <p className="text-xs text-gray-500">L&apos;IA identifie la pièce</p>
              </div>
            )}

            {/* Result */}
            {result && !analyzing && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">Pièce identifiée !</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full ml-auto">
                      {result.confidence}% confiance
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{result.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Catégorie: {result.category}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Véhicules compatibles</h4>
                    <div className="space-y-1">
                      {result.compatibleVehicles.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                          <Car className="w-4 h-4 text-blue-500" /> {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Prix estimé</h4>
                    <p className="text-lg font-bold text-red-600">{result.estimatedPrice}</p>
                  </div>
                </div>
              </div>
            )}

            {result && !analyzing && (
              <BottomActionBar>
                <button onClick={reset} className="py-3 px-5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl text-center text-sm">
                  Nouvelle photo
                </button>
                <Link href="/requests/new" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center text-sm">
                  Demander cette pièce
                </Link>
              </BottomActionBar>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
