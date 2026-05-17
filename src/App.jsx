import React, { useState } from 'react';
import { useGuestName } from './hooks/useGuestName';
import { useMusic } from './context/MusicContext';

// Section Components
import CoverScreen from './components/CoverScreen';
import Hero from './components/Hero';
import Quote from './components/Quote';
import Couple from './components/Couple';
import OurStory from './components/OurStory';
import Event from './components/Event';
import Gallery from './components/Gallery';
import WeddingGift from './components/WeddingGift';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import MusicButton from './components/MusicButton';

/**
 * App — Root component that assembles all sections of the wedding invitation.
 *
 * Flow:
 * 1. CoverScreen is shown first (blocks scrolling)
 * 2. User clicks "Buka Undangan" → cover slides up, music starts, scroll enabled
 * 3. All sections render below in order
 */
export default function App() {
  const guestName = useGuestName();
  const { play } = useMusic();
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    play(); // Start background music on user interaction

    // Enable scrolling on the body
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <div className={`font-sans antialiased text-text-main ${!isOpened ? 'overflow-hidden h-screen' : ''}`}>
      {/* Cover screen — fixed overlay */}
      <CoverScreen guestName={guestName} onOpen={handleOpenInvitation} />

      {/* Main content sections */}
      <Hero />
      <Quote />
      <Couple />
      <OurStory />
      <Event />
      <Gallery />
      <WeddingGift />
      <RSVP guestName={guestName} />
      <Footer />

      {/* Floating music button — only visible after opening */}
      <MusicButton visible={isOpened} />
    </div>
  );
}
