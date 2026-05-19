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
import Rsvp from './components/Rsvp';
import Footer from './components/Footer';
import MusicButton from './components/MusicButton';
import QRCodeModal from './components/QRCodeModal';

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

  // QR Code modal state managed at root level
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeId, setQrCodeId] = useState(null);
  const [qrGuestName, setQrGuestName] = useState('');
  const [qrGuestCount, setQrGuestCount] = useState('1');

  const handleOpenInvitation = () => {
    setIsOpened(true);
    play(); // Start background music on user interaction

    // Enable scrolling on the body
    document.body.classList.remove('overflow-hidden');
  };

  /**
   * Triggers the display of the QR code modal ticket.
   * @param {{ qrCodeId: string, guestName: string, guestCount: string }} details
   */
  const handleRSVPSuccess = ({ qrCodeId, guestName, guestCount }) => {
    setQrCodeId(qrCodeId);
    setQrGuestName(guestName);
    setQrGuestCount(guestCount);
    setShowQRModal(true);
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
      <Rsvp guestName={guestName} onRSVPSuccess={handleRSVPSuccess} />
      <Footer />

      {/* Floating music button — only visible after opening */}
      <MusicButton visible={isOpened} />

      {/* QR Code Modal — full screen root level rendering */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        qrCodeId={qrCodeId}
        guestName={qrGuestName}
        guestCount={qrGuestCount}
      />
    </div>
  );
}
