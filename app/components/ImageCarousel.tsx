'use client'

import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageModal from './ImageModal'

interface ImageCarouselProps {
  images: { url: string; caption: string }[]
}

const PrevArrow = (props: any) => {
  const { onClick } = props
  return (
    <button
      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <ChevronLeft className="text-gray-800" />
    </button>
  )
}

const NextArrow = (props: any) => {
  const { onClick } = props
  return (
    <button
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <ChevronRight className="text-gray-800" />
    </button>
  )
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [modalImage, setModalImage] = useState<{ url: string; caption: string } | null>(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  }

  const openModal = (image: { url: string; caption: string }) => {
    setModalImage(image)
  }

  const closeModal = () => {
    setModalImage(null)
  }

  return (
    <div className="relative">
      {images.length === 1 ? (
        <div className="outline-none">
          <button
            onClick={() => openModal(images[0])}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
          >
            <img
              src={images[0].url}
              alt="Single attachment"
              className="w-full h-64 object-cover rounded-lg cursor-pointer"
            />
          </button>
          {images[0].caption && (
            <p className="mt-2 text-sm text-gray-600 text-center">{images[0].caption}</p>
          )}
        </div>
      ) : (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="outline-none">
              <button
                onClick={() => openModal(image)}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
              >
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                />
              </button>
              {image.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
              )}
            </div>
          ))}
        </Slider>
      )}
      {modalImage && (
        <ImageModal
          imageUrl={modalImage.url}
          caption={modalImage.caption}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

