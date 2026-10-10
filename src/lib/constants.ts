/**
 * Información institucional de Angel Gym.
 * ⚠️ La dirección, teléfonos y horarios son PLACEHOLDERS: reemplázalos por los datos reales.
 */
export const GYM = {
  name: "Angel Gym",
  instagram: "angelgymleon",
  instagramUrl: "https://instagram.com/angelgymleon",
  whatsapp: "524770000000", // formato internacional sin "+"
  whatsappDisplay: "477 000 0000",
  email: "hola@angelgym.mx",
};

export const BRANCHES = [
  {
    id: "leon-centro",
    name: "Angel Gym León",
    address: "Blvd. Adolfo López Mateos 1234, Col. Centro",
    city: "León, Gto. C.P. 37000",
    // Coordenadas aproximadas de León, Gto. — reemplazar por las de la sucursal
    lat: 21.1236,
    lng: -101.68,
  },
];

/** Horario semanal. Índice 0 = domingo (igual que Date#getDay). */
export const WEEK_HOURS: { day: string; open: number; close: number }[] = [
  { day: "Domingo", open: 8, close: 14 },
  { day: "Lunes", open: 5, close: 23 },
  { day: "Martes", open: 5, close: 23 },
  { day: "Miércoles", open: 5, close: 23 },
  { day: "Jueves", open: 5, close: 23 },
  { day: "Viernes", open: 5, close: 22 },
  { day: "Sábado", open: 7, close: 15 },
];

export const NAV_LINKS = [
  { href: "#planes", label: "Planes" },
  { href: "#registro", label: "Registro" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#sucursal", label: "Sucursal" },
  { href: "#horarios", label: "Horarios" },
];
