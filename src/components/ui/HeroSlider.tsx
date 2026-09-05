'use client'
import { useState, useEffect } from 'react'
import './HeroSlider.css'

const slides = [
  { image: '/hero-new-3.png', title: 'OmShakthy Regalia' },
  { image: '/hero-slide-9.png', title: 'Elite Apartments' },
  { image: '/hero-slide-3.png', title: 'Elite Grand' },
  { image: '/hero-slide-1.png', title: 'OmShakthy Santha' },
  { image: '/hero-slide-8.png', title: 'Elite Apartments' },
  { image: '/hero-slide-2.png', title: 'Kanopus Magha' },
  { image: '/hero-new-2.png', title: 'Premium Living' },
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [started, setStarted] = useState(false)

  // Wait for intro to complete before starting the slideshow
  useEffect(() => {
    // If intro is already gone (e.g. hot reload), start immediately
    if (!document.querySelector('.intro-section')) {
      setStarted(true)
      return
    }
    const onIntroComplete = () => setStarted(true)
    window.addEventListener('introComplete', onIntroComplete)
    return () => window.removeEventListener('introComplete', onIntroComplete)
  }, [])

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setPrev(current)
      setCurrent((c) => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [current, started])

  const nextIndex = (current + 1) % slides.length

  return (
    <section className="hero-slider" id="hero" data-snap="true">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slider__slide ${
            i === current ? 'hero-slider__slide--active' : ''
          } ${i === prev ? 'hero-slider__slide--prev' : ''}`}
        >
          <img src={slide.image} alt={slide.title} style={{ objectPosition: ['/hero-slide-9.png', '/hero-slide-8.png'].includes(slide.image) ? 'center 35%' : 'center 20%' }} />
        </div>
      ))}

      {/* Overlay */}
      <div className="hero-slider__overlay" />

      {/* Content */}
      {slides[current].title && (
        <div className="hero-slider__content" key={current}>
          <h1 className="hero-slider__title">{slides[current].title}</h1>
          <a href="/projects" className="hero-slider__cta">Explore Projects</a>
        </div>
      )}

      {/* Next slide thumbnail — bottom right */}
      <div
        className="hero-slider__thumbnail"
        onClick={() => {
          setPrev(current)
          setCurrent(nextIndex)
        }}
      >
        <img src={slides[nextIndex].image} alt="Next" />
      </div>

      {/* Dots */}
      <div className="hero-slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-slider__dot ${i === current ? 'hero-slider__dot--active' : ''}`}
            onClick={() => { setPrev(current); setCurrent(i) }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
