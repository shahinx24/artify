import "../style/slide.css";

const slideImages = [
  { id: 1, src: "/images/slide/Camlin-Logo.svg", alt: "Camlin" },
  { id: 2, src: "/images/slide/Faber-Logo.svg", alt: "Faber-Castell" },
  { id: 3, src: "/images/slide/Flair-Logo.svg", alt: "Flair Pens" },
  { id: 4, src: "/images/slide/DOMS_logo.svg", alt: "DOMS" },
];

export default function BrandSlider() {
  const logos = [...slideImages, ...slideImages, ...slideImages, ...slideImages];

  return (
    <div className="brand-slider">
      <div className="slide-track">
        {logos.map((image, index) => (
          <div key={index} className="brand-box">
            <img
              className="brand-logo"
              src={image.src}
              alt={image.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}