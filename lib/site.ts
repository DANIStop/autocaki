// Podaci o firmi na jednom mjestu — koriste ih metapodaci, sitemap, JSON-LD i footer.
export const SITE = {
  url: "https://www.autocaki.com",
  name: "Auto Čaki",
  phone: "+385996600888",
  phoneDisplay: "+385 99 660 0888",
  email: "info@autocaki.com",
  street: "Ulica Božidara Magovca 109",
  city: "Zagreb",
  country: "HR",
  postalCode: "10010",
  lat: 45.7695846,
  lon: 16.0002844,
  instagram: "https://instagram.com/autocaki.hr",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Ulica Božidara Magovca 109, Zagreb"),
} as const;
