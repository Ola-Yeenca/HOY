'use client';

import { motion } from 'framer-motion';
import { RocketLaunchIcon, LightBulbIcon, ScaleIcon } from '@heroicons/react/24/outline';

const visionData = [
  {
    icon: LightBulbIcon,
    title: 'Our Vision',
    description: 'To revolutionize the fashion industry by creating a seamless bridge between traditional craftsmanship and cutting-edge technology.'
  },
  {
    icon: RocketLaunchIcon,
    title: 'Our Mission',
    description: 'To empower young fashion enthusiasts with tools and platforms that enable them to express their creativity and reach global audiences.'
  },
  {
    icon: ScaleIcon,
    title: 'Our Values',
    description: 'Innovation, sustainability, inclusivity, and excellence in everything we do.'
  }
];

const VisionSection = () => {
  return (
    <section id="vision" className="py-24 bg-coffee-bean text-white-plum">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gold">Our Purpose</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Driving innovation and creativity in the fashion industry through technology and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visionData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-coffee-bean/50 backdrop-blur-sm p-8 rounded-lg border border-dark-gray hover:border-gold transition-all duration-300"
            >
              <item.icon className="w-12 h-12 text-gold mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gold">{item.title}</h3>
              <p className="text-white-plum/90">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
