// Plutajući WhatsApp gumb (donji desni kut) — otvara chat s unaprijed upisanom porukom.
const WHATSAPP_NUMBER = "385996600888";
const WHATSAPP_TEXT = "Pozdrav, zanima me ponuda Auto Čaki.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pišite nam na WhatsApp"
      title="Pišite nam na WhatsApp"
      className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-lg shadow-black/25 flex items-center justify-center transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C8.837 3 3.004 8.832 3.004 16c0 2.293.6 4.53 1.739 6.502L3 29l6.68-1.706A12.94 12.94 0 0 0 16.004 29C23.17 29 29 23.168 29 16S23.17 3 16.004 3Zm0 23.62c-1.957 0-3.876-.526-5.552-1.52l-.398-.236-3.964 1.012 1.058-3.865-.26-.41A10.57 10.57 0 0 1 5.38 16c0-5.858 4.766-10.622 10.624-10.622 5.857 0 10.62 4.764 10.62 10.622 0 5.857-4.763 10.62-10.62 10.62Zm5.826-7.953c-.32-.16-1.89-.932-2.183-1.039-.293-.106-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.186.213-.373.24-.693.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.895-1.779-2.215-.186-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.186.213-.32.32-.533.106-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.668 0 1.573 1.147 3.094 1.306 3.307.16.213 2.257 3.447 5.468 4.833.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.89-.773 2.157-1.519.267-.746.267-1.386.187-1.519-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </a>
  );
}
