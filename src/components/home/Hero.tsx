
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const heroSlides = [
  {
    title: "Timeless Elegance",
    subtitle: "Discover our exquisite collection of handcrafted jewellery",
    image: "https://images.unsplash.com/photo-1611591437268-c96582786b12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cta: "Explore Collection"
  },
  {
    title: "Radiant Diamonds",
    subtitle: "Brilliant-cut stones that capture light and imagination",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cta: "View Diamonds"
  },
  {
    title: "Artisanal Craftsmanship",
    subtitle: "Meticulously crafted pieces with unparalleled attention to detail",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cta: "Our Process"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div 
          className={`max-w-2xl transition-all duration-700 ${
            isTransitioning ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {slide.subtitle}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-black hover:bg-gold hover:text-white premium-transition px-8 py-3 rounded-md"
          >
            <span>{slide.cta}</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-10" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
