"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Gambar dengan fallback: bila file tidak ada atau gagal dimuat, tampilkan panel navy berlabel.
export default function Photo({ image, sizes = "100vw", priority = false, position = "center", className = "" }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(!image?.src);

  useEffect(() => {
    // Error bisa terjadi sebelum hydration sehingga onError terlewat
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={`photo ${className}`}>
      {failed ? (
        <div className="photo-fallback" role="img" aria-label={image?.alt}>
          <span>{image?.label}</span>
        </div>
      ) : (
        <Image
          ref={ref}
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover", objectPosition: position }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
