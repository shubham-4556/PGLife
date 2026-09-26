"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const go = (next: number) => setIndex((next + images.length) % images.length);

  return (
    <div className="relative bg-charcoal">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {images.map((src, position) => (
          <Image
            key={src}
            src={src}
            alt={position === index ? alt : ""}
            aria-hidden={position !== index}
            fill
            priority={position === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-300 ${
              position === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <FaChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <FaChevronRight aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {images.map((src, position) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Show image ${position + 1}`}
                aria-current={position === index}
                className={`h-2.5 rounded-full transition-all ${
                  position === index ? "w-6 bg-brand" : "w-2.5 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
