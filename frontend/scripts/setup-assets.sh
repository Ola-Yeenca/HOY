#!/bin/bash

# Create necessary directories
mkdir -p public/images/gallery
mkdir -p public/videos

# Download placeholder images
for i in {1..8}
do
  curl -o "public/images/gallery/moment-$i.jpg" "https://source.unsplash.com/random/800x600/?event&sig=$i"
done

# Download a placeholder video
curl -o "public/videos/cta-background.mp4" "https://assets.mixkit.co/videos/preview/mixkit-people-dancing-at-a-party-4344-large.mp4"

echo "Assets downloaded successfully!"
