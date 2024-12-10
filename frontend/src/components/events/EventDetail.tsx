'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { Event } from '@/types/events';
import { getEvent } from '@/services/events';

interface EventDetailProps {
  id: string;
  initialEvent?: Event;
}

export default function EventDetail({ id, initialEvent }: EventDetailProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(initialEvent || null);
  const [isLoading, setIsLoading] = useState(!initialEvent);
  const [error, setError] = useState<string | null>(null);
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0]));

  useEffect(() => {
    if (!initialEvent) {
      const fetchEvent = async () => {
        try {
          setIsLoading(true);
          const data = await getEvent(id);
          if (!data) {
            throw new Error('Event not found');
          }
          setEvent(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id, initialEvent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div ref={ref} className="relative min-h-screen">
      <motion.div
        style={{ y, opacity }}
        className="fixed inset-0 -z-10"
      >
        {event.coverImage && (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </motion.div>

      <div className="relative z-10 pt-20 px-4 md:px-8">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center space-x-2 text-white hover:text-gray-200"
        >
          <FaArrowLeft /> <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{new Date(event.date).toLocaleDateString()}</span>
              <span className="text-gray-600">{event.location}</span>
            </div>
            <button className="text-red-500 hover:text-red-600">
              <FaHeart size={24} />
            </button>
          </div>
          <p className="text-gray-700 mb-8">{event.description}</p>
          
          {/* Add more event details as needed */}
        </motion.div>
      </div>
    </div>
  );
}
