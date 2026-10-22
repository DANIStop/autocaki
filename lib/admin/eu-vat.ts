// Standardne stope PDV-a u EU (%), za pretvorbu bruto → neto cijene u kalkulatoru uvoza.
// Vrijednost se u kalkulatoru uvijek može ručno promijeniti — provjeriti prije stvarne kupnje.
export const EU_COUNTRIES: { code: string; name: string; vat: number }[] = [
  { code: "DE", name: "Njemačka", vat: 19 },
  { code: "AT", name: "Austrija", vat: 20 },
  { code: "IT", name: "Italija", vat: 22 },
  { code: "BE", name: "Belgija", vat: 21 },
  { code: "NL", name: "Nizozemska", vat: 21 },
  { code: "FR", name: "Francuska", vat: 20 },
  { code: "SI", name: "Slovenija", vat: 22 },
  { code: "ES", name: "Španjolska", vat: 21 },
  { code: "LU", name: "Luksemburg", vat: 17 },
  { code: "DK", name: "Danska", vat: 25 },
  { code: "SE", name: "Švedska", vat: 25 },
  { code: "CZ", name: "Češka", vat: 21 },
  { code: "PL", name: "Poljska", vat: 23 },
  { code: "SK", name: "Slovačka", vat: 23 },
  { code: "HU", name: "Mađarska", vat: 27 },
  { code: "PT", name: "Portugal", vat: 23 },
  { code: "IE", name: "Irska", vat: 23 },
  { code: "FI", name: "Finska", vat: 25.5 },
  { code: "RO", name: "Rumunjska", vat: 21 },
  { code: "BG", name: "Bugarska", vat: 20 },
  { code: "GR", name: "Grčka", vat: 24 },
  { code: "EE", name: "Estonija", vat: 24 },
  { code: "LV", name: "Latvija", vat: 21 },
  { code: "LT", name: "Litva", vat: 21 },
  { code: "CY", name: "Cipar", vat: 19 },
  { code: "MT", name: "Malta", vat: 18 },
  { code: "HR", name: "Hrvatska", vat: 25 },
];

export const HR_VAT = 25;
