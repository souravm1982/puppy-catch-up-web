# Puppy Catch Up Web

A modern Next.js web application for connecting dog owners and organizing puppy playdates and meetups.

## Features

- 🐕 **User Registration**: Sign up to join the puppy community
- 📍 **Location-Based Search**: Find nearby dog owners and events
- 🗺️ **Interactive Maps**: View locations on an interactive map
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Next.js**: Built with modern React framework
- 🔧 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3.5
- **Maps**: React Leaflet
- **HTTP Client**: Axios
- **UI**: React 18.2.0

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
puppy-catch-up-web/
├── pages/
│   ├── _app.tsx          # App component with global styles
│   └── index.tsx         # Homepage with signup and nearby search
├── src/
│   ├── AddressAutocomplete.tsx  # Address input component
│   ├── NearbyForm.tsx           # Nearby users search form
│   ├── MapComponent.tsx         # Interactive map component
│   ├── SignupForm.tsx           # User registration form
│   └── types.ts                 # TypeScript type definitions
├── styles/
│   └── globals.css       # Global styles with Tailwind
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── postcss.config.js     # PostCSS configuration
```

## Features Implemented

### User Registration
- Form validation for user signup
- Address autocomplete functionality
- Demo data for offline functionality

### Nearby Search
- Search for nearby dog owners by location
- Interactive map display with markers
- Graceful error handling with demo data fallbacks

### Maps Integration
- React Leaflet for interactive maps
- Custom markers for user locations
- Server-side rendering compatibility

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Event creation and management
- [ ] Real-time messaging between users
- [ ] Photo sharing for pets
- [ ] Rating and review system
- [ ] Push notifications for nearby events
- [ ] Advanced search filters
- [ ] Social features and friend connections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
