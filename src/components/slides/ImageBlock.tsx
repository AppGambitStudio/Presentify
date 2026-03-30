interface ImageBlockProps { url: string; alt: string; fit?: "cover" | "contain"; }

export function ImageBlock({ url, alt, fit = "cover" }: ImageBlockProps) {
  return (
    <div className="w-full h-full min-h-[200px] rounded-xl overflow-hidden">
      <img src={url} alt={alt} className="w-full h-full" style={{ objectFit: fit }} />
    </div>
  );
}
