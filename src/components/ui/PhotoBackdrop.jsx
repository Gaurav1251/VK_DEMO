/**
 * A photo filling its (relative) parent, tinted with the brand blue so white text stays readable.
 * `fade`: "side" (default) keeps the left dark for text; "soft" tints evenly and lets more photo through.
 */
export default function PhotoBackdrop({ src, position = 'center', fade = 'side' }) {
  const overlays = {
    // Text on the left, photo showing on the right (page headers, banners)
    side: 'linear-gradient(90deg, rgba(5,31,77,0.96) 0%, rgba(7,43,104,0.84) 45%, rgba(11,61,145,0.38) 100%)',
    // Even tint with the photo clearly visible (full-screen backgrounds behind a card)
    soft: 'linear-gradient(135deg, rgba(5,31,77,0.88) 0%, rgba(11,61,145,0.62) 50%, rgba(5,31,77,0.85) 100%)',
  };
  const overlay = overlays[fade] || overlays.side;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0" style={{ background: overlay }} />
    </div>
  );
}
