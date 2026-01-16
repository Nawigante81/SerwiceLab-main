export const mockMethods = [
  {
    code: "inpost_weekend",
    name: "InPost Paczka w Weekend",
    type: "locker",
    price_pln: 14.99,
    eta: "Sobota/Niedziela",
    featured: true,
  },
  {
    code: "inpost_locker_standard",
    name: "InPost Paczkomat® 24/7 (odbiór w punkcie)",
    type: "locker",
    price_pln: 12.49,
    eta: "1-2 dni robocze",
  },
  {
    code: "inpost_courier_standard",
    name: "InPost Kurier (dostawa na adres)",
    type: "courier",
    price_pln: 16.99,
    eta: "1-2 dni robocze",
  },
];

export const mockPoints = [
  {
    point_id: "WAW01A",
    name: "Paczkomat WAW01A",
    address: "ul. Marszałkowska 1, Warszawa",
    lat: 52.2297,
    lng: 21.0122,
    type: "locker",
    hours: "24/7",
    description: "Przy wejściu do budynku.",
    image_url: null,
  },
  {
    point_id: "WAW02B",
    name: "PaczkoPunkt WAW02B",
    address: "ul. Chmielna 10, Warszawa",
    lat: 52.2291,
    lng: 21.0105,
    type: "partner",
    hours: "Pn-Pt 9:00-19:00",
    description: "Sklep spożywczy, wejście od strony ulicy.",
    image_url: null,
  },
  {
    point_id: "WAW03C",
    name: "Paczkomat WAW03C",
    address: "al. Jana Pawła II 20, Warszawa",
    lat: 52.2321,
    lng: 21.0045,
    type: "locker",
    hours: "24/7",
    description: "Przy parkingu podziemnym.",
    image_url: null,
  },
];

export const mockTracking = {
  tracking_number: "INPOST123456789",
  status: "created",
  history: [
    { status: "created", description: "Przesyłka utworzona", timestamp: new Date().toISOString() },
  ],
};
