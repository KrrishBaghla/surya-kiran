# Planet Textures

This directory contains texture files for the solar system visualization.

## Current Status
The texture files are currently placeholders. For a production application, you would want to replace these with actual planet surface textures.

## Required Textures
- sun.jpg - Sun surface texture
- mercury.jpg - Mercury surface texture  
- venus.jpg - Venus surface texture
- earth_day.jpg - Earth day side texture
- mars.jpg - Mars surface texture
- jupiter.jpg - Jupiter surface texture
- saturn.jpg - Saturn surface texture
- saturn_rings.png - Saturn's rings texture
- uranus.jpg - Uranus surface texture
- neptune.jpg - Neptune surface texture
- moon.jpg - Moon surface texture
- rock.jpg - Asteroid/rock texture

## Fallback Behavior
The application includes fallback mechanisms:
1. If local textures fail to load, it will use solid colors
2. For the Sun, there's a fallback to an external texture
3. All planets have color fallbacks defined in the code

## Adding Real Textures
To add real planet textures:
1. Download high-quality planet surface images
2. Convert them to JPG format (512x512 or 1024x1024 recommended)
3. Place them in this directory with the exact filenames listed above
4. The application will automatically use them
