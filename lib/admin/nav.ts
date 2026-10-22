// Stavke admin navigacije (bočna traka na računalu, stranica „Više“ na mobitelu).
export const ADMIN_NAV = [
  { href: "/admin", label: "Pregled", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/admin/vozila", label: "Vozila", icon: "M3 16l2-6c.4-1.2 1.4-2 2.7-2h8.6c1.3 0 2.3.8 2.7 2l2 6v3h-3m-12 0H3v-3m3 3a2 2 0 104 0m4 0a2 2 0 104 0" },
  { href: "/admin/upiti", label: "Upiti", icon: "M4 5h16v11H8l-4 4V5z" },
  { href: "/admin/klijenti", label: "Klijenti", icon: "M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6m13 9v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8" },
  { href: "/admin/obrada", label: "Obrada i štete", icon: "M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z" },
  { href: "/admin/kalkulator", label: "Kalkulator uvoza", icon: "M6 3h12v18H6zM9 7h6M9 11h2m2 0h2M9 15h2m2 0h2M9 18h2m2 0h2" },
  { href: "/admin/strani-oglasi", label: "Strani oglasi", icon: "M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 010 18M12 3a14 14 0 000 18" },
  { href: "/admin/prijevozi", label: "Prijevozi", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" },
  { href: "/admin/putni-nalozi", label: "Putni nalozi", icon: "M9 4H5v16h14V4h-4M9 4a3 3 0 006 0M9 4a3 3 0 016 0M8 11h8M8 15h5" },
  { href: "/admin/raspored", label: "Raspored", icon: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4" },
] as const;

// Donja traka na mobitelu: najčešće korištene stavke + „Više“.
export const ADMIN_TABS = [
  ADMIN_NAV[0],
  ADMIN_NAV[1],
  ADMIN_NAV[2],
  ADMIN_NAV[9],
  { href: "/admin/vise", label: "Više", icon: "M5 12h.01M12 12h.01M19 12h.01" },
] as const;
