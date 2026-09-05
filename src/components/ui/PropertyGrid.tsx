'use client'
import { useState } from 'react'
import Link from 'next/link'
import './PropertyGrid.css'

interface Property {
  image: string
  name: string
  location: string
  status: string
  type: string
  price: string
  link?: string
}

const properties: Property[] = [
  {
    image: '/canopus-magha.png',
    name: 'Kanopus Magha',
    location: 'Guduvanchery, Chennai',
    status: 'Ongoing',
    type: 'Residential Plots',
    price: '₹25L onwards',
  },
  {
    image: '/regalia.png',
    name: 'OmShakthy Regalia',
    location: 'Avadi, Chennai',
    status: 'Ongoing',
    type: 'Gated Community',
    price: '₹32L onwards',
    link: '/regalia',
  },
  {
    image: '/elite-grand.png',
    name: 'Elite Grand',
    location: 'Thirumullaivoyal, Chennai',
    status: 'Ongoing',
    type: 'Premium Plots',
    price: '₹28L onwards',
  },
  {
    image: '/mathura.png',
    name: 'OmShakthy Mathura',
    location: 'Tambaram, Chennai',
    status: 'Sold',
    type: 'Residential Plots',
    price: 'Sold Out',
  },
  {
    image: '/property-5.png',
    name: 'Kanopus Mithila',
    location: 'Vandalur, Chennai',
    status: 'Sold',
    type: 'Gated Community',
    price: 'Sold Out',
  },
  {
    image: '/property-6.png',
    name: 'Industrial Park',
    location: 'Sriperumbudur, Chennai',
    status: 'Sold',
    type: 'Industrial',
    price: 'Sold Out',
  },
]

const PropertyGrid = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="property-section" id="property-grid" data-snap="true">
      <div className="property-list">
        {properties.map((property, i) => (
          <div
            key={property.name}
            className={`property-item ${activeIndex === i ? 'active' : ''} ${property.status === 'Sold' ? 'sold' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <Link className="property-item__link" href={property.link || '/projects'}>
              <div className="property-item__img">
                <img src={property.image} alt={property.name} loading="lazy" />
                <div className="property-item__gradient" />
              </div>

              {/* Always-visible info block — status tag stays on screen
                  whether the card is collapsed or expanded, instead of the
                  old rotated label that only appeared on hover and
                  vanished the moment a card became active. */}
              <div className="property-item__info">
                <p className={`property-item__status property-item__status--${property.status === 'Sold' ? 'sold' : 'ongoing'}`}>
                  <span className="property-item__status-dot" />
                  {property.status}
                </p>
                <h4 className="property-item__name">{property.name}</h4>
                <p className="property-item__location">
                  <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.4" />
                  </svg>
                  {property.location}
                </p>

                {/* Extra detail — only when expanded, so collapsed strips
                    stay uncluttered like the reference. */}
                {property.status === 'Sold' ? (
                  <span className="property-item__badge">Sold Out</span>
                ) : (
                  <span className="property-item__price">{property.price}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* View More CTA */}
      <div className="property-cta">
        <a href="/projects" className="property-cta__btn">View More</a>
      </div>
    </section>
  )
}

export default PropertyGrid
