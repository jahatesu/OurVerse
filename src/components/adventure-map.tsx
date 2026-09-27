"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

type TravelMemory = {
  id: string;
  placeName: string;
  country: string;
  latitude: number;
  longitude: number;
  dateVisited: string;
  description: string;
  favoriteMemory?: string;
  photo?: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
};

type PlaceChoice = { placeName: string; country: string; latitude: number; longitude: number };
const STORAGE_KEY = "ourverse-shared-travel-memories-v1";
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

function readSavedMemories(): TravelMemory[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    return raw.filter((item): item is TravelMemory => {
      const valid = !!item && typeof item === "object" &&
        typeof item.id === "string" && typeof item.placeName === "string" &&
        typeof item.country === "string" && Number.isFinite(item.latitude) &&
        Number.isFinite(item.longitude) && item.latitude >= -90 && item.latitude <= 90 &&
        item.longitude >= -180 && item.longitude <= 180 &&
        typeof item.dateVisited === "string" && typeof item.description === "string" &&
        typeof item.createdAt === "string" && typeof item.updatedAt === "string" &&
        (item.photo === undefined || item.photo === null || typeof item.photo === "string") &&
        (item.favoriteMemory === undefined || typeof item.favoriteMemory === "string") &&
        (item.photos === undefined || Array.isArray(item.photos));
      if (!valid || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).map((item) => ({ ...item, photos: Array.isArray(item.photos) ? item.photos.filter((photo: unknown) => typeof photo === "string") : [] }));
  } catch {
    return [];
  }
}

function formattedVisitDate(value: string) {
  if (!value) return "Date not added";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

async function compressTravelPhoto(file: File): Promise<string> {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) { image.close(); throw new Error("This photo could not be prepared. Try another image."); }
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const encode = (type: string, quality: number) => new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("This photo could not be compressed. Try another image.")), type, quality);
  });
  let blob = await encode("image/webp", 0.78);
  const type = blob.type === "image/webp" ? "image/webp" : "image/jpeg";
  let quality = 0.78;
  if (type === "image/jpeg" && blob.type !== "image/jpeg") blob = await encode(type, quality);
  while (blob.size > 350 * 1024 && quality > 0.56) {
    quality -= 0.08;
    blob = await encode(type, quality);
  }
  if (blob.size > 500 * 1024) throw new Error("This image is still too large after compression. Please choose a smaller photo.");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("This photo could not be saved."));
    reader.onerror = () => reject(new Error("This photo could not be saved."));
    reader.readAsDataURL(blob);
  });
}

export function AdventureMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const mapLoadedRef = useRef(false);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceChoice | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [placeResults, setPlaceResults] = useState<PlaceChoice[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);
  const selectedMemory = memories.find((memory) => memory.id === selectedId) || null;
  const deletingMemory = memories.find((memory) => memory.id === deleteId) || null;

  useEffect(() => {
    setMemories(readSavedMemories());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memories)); } catch {}
  }, [memories, storageReady]);

  useEffect(() => {
    let disposed = false;
    let instance: MapLibreMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const setup = async () => {
      if (!mapContainer.current) return;
      try {
        const maplibre = await import("maplibre-gl");
        if (disposed || !mapContainer.current) return;
        maplibre.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        const style = MAPTILER_KEY
          ? `https://api.maptiler.com/maps/streets-v4-dark/style.json?key=${encodeURIComponent(MAPTILER_KEY)}`
          : "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
        instance = new maplibre.Map({
          container: mapContainer.current,
          style,
          center: [8, 18],
          zoom: 1.35,
          minZoom: 1.2,
          maxZoom: 18,
          attributionControl: false,
          canvasContextAttributes: { antialias: true },
        });
        mapRef.current = instance;
        instance.addControl(new maplibre.NavigationControl({ showCompass: false, showZoom: true }), "top-right");
        instance.addControl(new maplibre.AttributionControl({ compact: true }), "bottom-right");
        instance.once("load", () => {
          if (!disposed) { mapLoadedRef.current = true; setMapReady(true); setMapError(""); }
        });
        instance.on("error", () => {
          if (!disposed && !mapLoadedRef.current) setMapError("The map tiles could not load. Check your connection and refresh the page.");
        });
        resizeObserver = new ResizeObserver(() => instance?.resize());
        resizeObserver.observe(mapContainer.current);
      } catch {
        if (!disposed) setMapError("The map could not be started in this browser.");
      }
    };
    void setup();
    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapLoadedRef.current = false;
      instance?.remove();
      mapRef.current = null;
    };
  }, []);

  const moveToMemory = useCallback((memory: TravelMemory) => {
    setSelectedId(memory.id);
    setEditorOpen(false);
  }, []);

  useEffect(() => {
    if (!mapReady || !selectedId) return;
    const map = mapRef.current;
    if (!map) return;
    const memory = memories.find((item) => item.id === selectedId);
    if (!memory) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const camera = { center: [memory.longitude, memory.latitude] as [number, number], zoom: Math.max(map.getZoom(), 5.5) };
    if (reduced) map.jumpTo(camera);
    else map.flyTo({ ...camera, speed: 0.8, curve: 1.25, essential: false });
  }, [mapReady, selectedId, memories]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    let cancelled = false;
    void import("maplibre-gl").then((maplibre) => {
      if (cancelled || mapRef.current !== map) return;
      for (const memory of memories) {
        const element = document.createElement("button");
        element.type = "button";
        element.className = `adventure-memory-marker${memory.id === selectedId ? " is-selected" : ""}${memory.id === freshId ? " is-fresh" : ""}`;
        element.setAttribute("aria-label", `Shared memory: ${memory.placeName}, ${memory.country}`);
        element.title = `${memory.placeName}, ${memory.country}`;
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          moveToMemory(memory);
        });
        markersRef.current.push(new maplibre.Marker({ element, anchor: "bottom" })
          .setLngLat([memory.longitude, memory.latitude])
          .addTo(map));
      }
    });
    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [memories, selectedId, freshId, mapReady, moveToMemory]);

  useEffect(() => {
    if (!freshId) return;
    const timer = window.setTimeout(() => setFreshId(null), 2600);
    return () => window.clearTimeout(timer);
  }, [freshId]);

  const resetEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setPlaceQuery("");
    setSelectedPlace(null);
    setVisitDate("");
    setDescription("");
    setPlaceResults([]);
    setSearchError("");
    setPhoto(null);
    setPhotoError("");
    setStorageError("");
  };

  const startNewMemory = () => {
    setSelectedId(null);
    setEditingId(null);
    setPlaceQuery("");
    setSelectedPlace(null);
    setVisitDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setPlaceResults([]);
    setSearchError("");
    setPhoto(null);
    setPhotoError("");
    setStorageError("");
    setEditorOpen(true);
  };

  const startEditMemory = (memory: TravelMemory) => {
    setEditingId(memory.id);
    setPlaceQuery(`${memory.placeName}, ${memory.country}`);
    setSelectedPlace({ placeName: memory.placeName, country: memory.country, latitude: memory.latitude, longitude: memory.longitude });
    setVisitDate(memory.dateVisited);
    setDescription(memory.description);
    setPhoto(memory.photo || null);
    setPhotoError("");
    setStorageError("");
    setPlaceResults([]);
    setSearchError("");
    setSelectedId(null);
    setEditorOpen(true);
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setPhotoError("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setPhotoError("That photo is too large to prepare here. Please choose one under 30 MB.");
      return;
    }
    setProcessingPhoto(true);
    setPhotoError("");
    try {
      setPhoto(await compressTravelPhoto(file));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "This photo could not be prepared.");
    } finally {
      setProcessingPhoto(false);
    }
  };

  const commitMemories = (next: TravelMemory[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError("");
      setMemories(next);
      return true;
    } catch {
      setStorageError("There isn't enough browser storage for this photo. Remove a photo or choose a smaller image, then save again.");
      return false;
    }
  };

  const searchPlaces = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = placeQuery.trim();
    if (!query) return;
    setSearching(true);
    setSearchError("");
    setPlaceResults([]);
    try {
      let choices: PlaceChoice[];
      if (MAPTILER_KEY) {
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${encodeURIComponent(MAPTILER_KEY)}&limit=5&language=en`);
        if (!response.ok) throw new Error("Search is temporarily unavailable. Try again.");
        const data = await response.json();
        choices = (data.features || []).flatMap((feature: any) => {
          const center = feature.center;
          if (!Array.isArray(center) || center.length < 2) return [];
          const country = (feature.context || []).find((part: any) => String(part.id).startsWith("country"))?.text || feature.place_name?.split(",").slice(-1)[0]?.trim() || "";
          return [{ placeName: feature.text || feature.place_name?.split(",")[0] || query, country, longitude: Number(center[0]), latitude: Number(center[1]) }];
        });
      } else {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Search is temporarily unavailable. Try again.");
        const data = await response.json();
        choices = (data || []).map((result: any) => {
          const address = result.address || {};
          const placeName = address.city || address.town || address.village || address.municipality || result.name || query;
          return { placeName, country: address.country || "", longitude: Number(result.lon), latitude: Number(result.lat) };
        }).filter((place: PlaceChoice) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
      }
      setPlaceResults(choices);
      if (!choices.length) setSearchError("No matching places found. Try adding a nearby city or country.");
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Place search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const saveMemory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlace || !visitDate.trim() || !description.trim() || processingPhoto) return;
    const timestamp = new Date().toISOString();
    setStorageError("");
    if (editingId) {
      const next = memories.map((memory) => memory.id === editingId ? {
        ...memory,
        ...selectedPlace,
        dateVisited: visitDate,
        description: description.trim(),
        photo,
        updatedAt: timestamp,
      } : memory);
      if (!commitMemories(next)) return;
      setSelectedId(editingId);
      resetEditor();
      window.setTimeout(() => {
        const updated = memories.find((memory) => memory.id === editingId);
        if (updated) moveToMemory({ ...updated, ...selectedPlace, dateVisited: visitDate, description: description.trim(), photo, updatedAt: timestamp });
      }, 0);
      return;
    }
    setSaving(true);
    const memory: TravelMemory = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `travel-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...selectedPlace,
      dateVisited: visitDate,
      description: description.trim(),
      favoriteMemory: "",
      photo,
      photos: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    if (!commitMemories([...memories, memory])) { setSaving(false); return; }
    setSelectedId(memory.id);
    setFreshId(memory.id);
    setEditorOpen(false);
    resetEditor();
    setSaving(false);
    window.setTimeout(() => moveToMemory(memory), 0);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setMemories((current) => current.filter((memory) => memory.id !== deleteId));
    if (selectedId === deleteId) setSelectedId(null);
    setDeleteId(null);
  };

  const placeSearchForm = (editing: boolean) => (
    <form className="travel-search-form" onSubmit={searchPlaces}>
      <label htmlFor="travel-place-query">WHERE WERE WE?</label>
      <div className="travel-search-row">
        <input id="travel-place-query" value={placeQuery} onChange={(event) => { setPlaceQuery(event.target.value); setSelectedPlace(null); }} placeholder="City, Country" required />
        <button type="submit" disabled={searching || !placeQuery.trim()}>{searching ? "searching…" : "find place"}</button>
      </div>
      <small className="travel-attribution">Location search by {MAPTILER_KEY ? "MapTiler" : "OpenStreetMap Nominatim"}.</small>
      {searchError && <p className="travel-form-error" role="status">{searchError}</p>}
      {placeResults.length > 0 && <div className="travel-place-results" role="group" aria-label="Choose a matching place">
        {placeResults.map((place, index) => <button type="button" key={`${place.latitude}-${place.longitude}-${index}`} className={selectedPlace === place ? "is-chosen" : ""} onClick={() => { setSelectedPlace(place); setPlaceQuery([place.placeName, place.country].filter(Boolean).join(", ")); setPlaceResults([]); }}>
          <span>{place.placeName}{place.country ? `, ${place.country}` : ""}</span><small>{place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}</small>
        </button>)}
      </div>}
      {editing && selectedPlace && <small className="travel-selected-location">Selected location: {selectedPlace.placeName}{selectedPlace.country ? `, ${selectedPlace.country}` : ""}</small>}
    </form>
  );

  const editor = editorOpen && (
    <section className="travel-memory-form">
      <div className="travel-form-heading"><span>{editingId ? "A MEMORY WE'VE SAVED" : "A NEW PAGE FOR OUR JOURNAL"}</span><button type="button" aria-label="Close memory form" onClick={resetEditor}>×</button></div>
      {placeSearchForm(!!editingId)}
      <form className="travel-memory-details" onSubmit={saveMemory}>
        <label htmlFor="travel-visit-date">WHEN WERE WE THERE?</label>
        <input id="travel-visit-date" type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required />
        <label htmlFor="travel-memory-description">WHAT DO WE REMEMBER?</label>
        <textarea id="travel-memory-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Write a little piece of this memory…" rows={3} required maxLength={600} />
        <div className="travel-photo-section">
          <label>A LITTLE PIECE OF THAT DAY</label>
          <p>Add a photo that brings this place back to us.</p>
          {photo && <figure className="travel-photo-polaroid travel-photo-preview">
            <img src={photo} alt="Selected photo for this shared travel memory" />
            <figcaption>{selectedPlace?.placeName || "a little piece of that day"}</figcaption>
          </figure>}
          <div className="travel-photo-actions">
            <label className="travel-photo-add" htmlFor="travel-photo-upload">{photo ? "replace photo" : "+ add a photo"}</label>
            {photo && <button type="button" onClick={() => { setPhoto(null); setPhotoError(""); }}>remove photo</button>}
          </div>
          <input id="travel-photo-upload" className="travel-photo-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={processingPhoto} />
          {processingPhoto && <small role="status">tucking your photo into the scrapbook…</small>}
          {photoError && <small className="travel-form-error" role="status">{photoError}</small>}
        </div>
        {storageError && <p className="travel-form-error" role="alert">{storageError}</p>}
        <div className="travel-form-actions"><button type="button" onClick={resetEditor}>cancel</button><button type="submit" disabled={!selectedPlace || !visitDate || !description.trim() || saving || processingPhoto}>{editingId ? "save this memory ♡" : "pin this memory ♡"}</button></div>
      </form>
    </section>
  );

  const memoryPreview = selectedMemory && !editorOpen && (
    <article className="travel-memory-preview" aria-label={`Shared travel memory: ${selectedMemory.placeName}`}>
      {selectedMemory.photo ? <figure className="travel-photo-polaroid travel-memory-photo">
        <img src={selectedMemory.photo} alt={`A photo from ${selectedMemory.placeName}${selectedMemory.country ? `, ${selectedMemory.country}` : ""}`} />
        <figcaption>{selectedMemory.placeName}{selectedMemory.country ? `, ${selectedMemory.country}` : ""}<small>{formattedVisitDate(selectedMemory.dateVisited)}</small></figcaption>
      </figure> : <>
        <div><small>PLACE</small><h2>{selectedMemory.placeName}{selectedMemory.country ? `, ${selectedMemory.country}` : ""}</h2></div>
        <div><small>DATE</small><p>{formattedVisitDate(selectedMemory.dateVisited)}</p></div>
      </>}
      <div><small>WHAT WE REMEMBER</small><p>{selectedMemory.description}</p></div>
      {selectedMemory.favoriteMemory?.trim() && <div className="travel-favorite-memory"><small>FAVORITE MEMORY</small><p>“{selectedMemory.favoriteMemory}”</p></div>}
      <div className="travel-memory-actions"><button type="button" onClick={() => startEditMemory(selectedMemory)}>edit memory</button><button type="button" onClick={() => setDeleteId(selectedMemory.id)}>delete memory</button></div>
    </article>
  );

  return (
    <section className="adventure-experience">
      <header className="section-heading">
        <span className="eyebrow">PLACES THAT BECAME PART OF US</span>
        <h1>Our Adventure Map</h1>
        <p>Every pin is somewhere we found ourselves together.</p>
      </header>
      <p className="adventure-description">This map holds the places we've actually been together — the cities, little corners of the world, and adventures that became part of our story.</p>
      <div className="adventure-map-frame">
        <div className="adventure-map-vignette" aria-hidden="true" />
        <div ref={mapContainer} className="adventure-map-canvas" role="application" aria-label="Interactive world map of places Janna and Josh have visited together" />
        {!mapReady && !mapError && <div className="adventure-map-loading" role="status">opening our little atlas…</div>}
        {mapError && <div className="adventure-map-error" role="status">{mapError}</div>}
        {memories.length > 0 && <span className="adventure-map-legend"><i aria-hidden="true" /> memories made together</span>}
      </div>
      <div className="adventure-map-meta">
        <span>Only places we've shared belong here. ♡</span>
        <strong>places together · {memories.length}</strong>
      </div>

      {memories.length === 0 && !editorOpen && <div className="adventure-empty-state">
        <p>Our map is still waiting for its first memory.</p>
        <small>When we've stood somewhere in the world together, we'll leave a little piece of us here.</small>
        <button type="button" onClick={startNewMemory}>+ pin our first memory</button>
      </div>}
      {editor && <div className="travel-form-shell">{editor}</div>}
      {memoryPreview && <div className="travel-preview-shell">{memoryPreview}</div>}

      <section className="travel-index" aria-labelledby="travel-index-heading">
        <header><div><h2 id="travel-index-heading">PLACES WE'VE BEEN TOGETHER</h2><p>Little pieces of the world that became part of us.</p></div>
          {memories.length > 0 && <button type="button" onClick={startNewMemory}>+ pin a memory</button>}
        </header>
        {memories.length > 0 ? <ol>{memories.map((memory, index) => <li key={memory.id}>
          <button type="button" onClick={() => moveToMemory(memory)} aria-label={`Show shared memory at ${memory.placeName}, ${memory.country}`}>
            <span className="travel-index-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="travel-index-place">{memory.placeName}{memory.country ? `, ${memory.country}` : ""}<small>{formattedVisitDate(memory.dateVisited)}</small></span>
            <span className="travel-index-arrow" aria-hidden="true">↗</span>
          </button>
        </li>)}</ol> : <div className="travel-index-empty">No shared places have been pinned yet.</div>}
      </section>

      {deletingMemory && <div className="travel-confirm-backdrop" role="presentation">
        <section className="travel-delete-confirm" role="alertdialog" aria-modal="true" aria-labelledby="travel-delete-title" aria-describedby="travel-delete-copy">
          <h2 id="travel-delete-title">Remove this place from our adventure map?</h2>
          <p id="travel-delete-copy">This only removes the saved memory from OurVerse.</p>
          <div><button type="button" onClick={() => setDeleteId(null)}>Cancel</button><button type="button" onClick={confirmDelete}>Remove memory</button></div>
        </section>
      </div>}
    </section>
  );
}
