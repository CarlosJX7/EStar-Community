// Datos de ejemplo para el prototipo. Todas las asociaciones y personas son ficticias.

export const communities = [
  {
    id: "musica",
    name: "Amigos de la música",
    emoji: "🎵",
    color: "#7c3aed",
    members: 128,
    description: "Cantamos, tocamos y escuchamos música juntos. Todos son bienvenidos.",
    topics: ["Música", "Diversión"],
  },
  {
    id: "videojuegos",
    name: "Gamers tranquilos",
    emoji: "🎮",
    color: "#0369a1",
    members: 96,
    description: "Jugamos videojuegos sin prisa y sin presión. Compartimos trucos y risas.",
    topics: ["Juegos", "Amistad"],
  },
  {
    id: "cocina",
    name: "Cocina fácil",
    emoji: "🍳",
    color: "#c2410c",
    members: 74,
    description: "Recetas sencillas y seguras para cocinar paso a paso.",
    topics: ["Cocina", "Aprender"],
  },
  {
    id: "arte",
    name: "Taller de arte",
    emoji: "🎨",
    color: "#be185d",
    members: 61,
    description: "Dibujamos, pintamos y mostramos lo que creamos.",
    topics: ["Arte", "Creatividad"],
  },
  {
    id: "deporte",
    name: "Muévete con nosotros",
    emoji: "⚽",
    color: "#15803d",
    members: 83,
    description: "Deportes y juegos al aire libre, a nuestro ritmo.",
    topics: ["Deporte", "Salud"],
  },
  {
    id: "mascotas",
    name: "Amantes de las mascotas",
    emoji: "🐶",
    color: "#a16207",
    members: 109,
    description: "Hablamos de nuestras mascotas y compartimos fotos.",
    topics: ["Animales", "Amistad"],
  },
];

// Asociaciones reales de España. Datos de contacto tomados de sus webs oficiales (nov. 2026).
// Los logos son marca de cada entidad y se muestran sólo para identificarla.
export const associations = [
  {
    id: "down-espana",
    name: "Down España",
    logo: "/logos/down-espana.svg",
    description:
      "Federación que agrupa a asociaciones de síndrome de Down de todo el país. Apoya a las personas y a sus familias.",
    focus: ["Síndrome de Down", "Familias"],
    web: "https://www.sindromedown.org",
    email: "downespana@sindromedown.org",
    phone: "917 160 710",
    address: "C/ Machaquito 58, local 10, 28043 Madrid",
  },
  {
    id: "autismo-espana",
    name: "Autismo España",
    logo: "/logos/autismo-espana.svg",
    description:
      "Confederación de entidades de autismo. Defiende los derechos de las personas con TEA y de sus familias.",
    focus: ["Autismo (TEA)", "Derechos"],
    web: "https://autismo.org.es",
    email: "info@autismo.org.es",
    phone: "915 913 409",
    address: "C/ Garibay 7, 3º izq., 28007 Madrid",
  },
  {
    id: "asperger-espana",
    name: "Confederación Asperger España",
    logo: "/logos/asperger-espana.webp",
    description:
      "Trabaja por los derechos y la inclusión de las personas con síndrome de Asperger y otros TEA.",
    focus: ["Asperger / TEA", "Inclusión"],
    web: "https://www.asperger.es",
    phone: "91 786 10 22",
    phone2: "639 363 000",
    address: "C/ Bohonal 15-17, Madrid",
    hours: "Lunes a viernes, de 9:00 a 14:00",
  },
  {
    id: "plena-inclusion",
    name: "Plena inclusión España",
    logo: "/logos/plena-inclusion.png",
    description:
      "Confederación de organizaciones de personas con discapacidad intelectual o del desarrollo y sus familias.",
    focus: ["Discapacidad intelectual", "Lectura fácil"],
    web: "https://www.plenainclusion.org",
    email: "info@plenainclusion.org",
    phone: "91 556 74 13",
    address: "Avda. General Perón 32, 1ª planta, 28020 Madrid",
  },
  {
    id: "special-olympics",
    name: "Special Olympics España",
    logo: "/logos/special-olympics-espana.png",
    description:
      "Deporte y competiciones para personas con discapacidad intelectual, en todas las comunidades autónomas.",
    focus: ["Deporte", "Amistad"],
    web: "https://www.specialolympics.es",
    email: "info@specialolympics.es",
    address: "Pasaje Montserrat Isern 25-31, 08908 L'Hospitalet de Llobregat (Barcelona)",
  },
];

// Eventos reales de inclusión en España. Cada uno enlaza a la fuente donde se verificó (nov. 2026).
// date / endDate: AAAA-MM-DD. unconfirmed: fechas publicadas por un agregador, aún sin programa oficial.
export const events = [
  {
    id: "carrera-down-2024",
    title: "XIV Carrera Down Madrid",
    emoji: "🏃",
    date: "2024-10-13",
    place: "Parque Juan Carlos I, Madrid",
    organizer: "Down Madrid",
    communityId: "deporte",
    description:
      "Más de 3.400 personas corrieron por la inclusión de las personas con discapacidad intelectual. Por primera vez, la mayoría fueron mujeres.",
    sourceName: "Discapnet",
    sourceUrl: "https://discapnet.es/noticia/mas-de-3400-corredores-participaron-en-la-xiv-carrera-down-madrid",
  },
  {
    id: "diputados-2025",
    title: "Diputados por un día",
    emoji: "🗳️",
    date: "2025-12-03",
    place: "Asamblea de Madrid",
    organizer: "Plena inclusión Madrid",
    description:
      "Más de 100 personas con discapacidad intelectual o del desarrollo hablaron desde los escaños para pedir más autonomía, transporte y empleo. Fue en el Día Internacional de las Personas con Discapacidad.",
    sourceName: "Plena inclusión Madrid",
    sourceUrl: "https://plenainclusionmadrid.org/wp-content/uploads/2025/11/251128_CP_DiputadosporUnDia.pdf",
  },
  {
    id: "familias-zaragoza-2025",
    title: "25º Encuentro Nacional de Familias de personas con síndrome de Down",
    emoji: "👨‍👩‍👧",
    date: "2025-12-05",
    endDate: "2025-12-08",
    place: "Zaragoza",
    organizer: "Down España y Up&Down Zaragoza",
    description:
      "Más de 600 personas de toda España compartieron experiencias y participaron en conferencias y talleres.",
    sourceName: "Turismo de Zaragoza",
    sourceUrl: "https://www.zaragoza.es/sede/portal/turismo/es-util/servicio/noticia/detail/345815",
  },
  {
    id: "autismo-congreso-2026",
    title: "Premio Amigo del Autismo en el Congreso",
    emoji: "💙",
    date: "2026-03-23",
    place: "Congreso de los Diputados, Madrid",
    organizer: "Autismo España",
    description:
      "Acto de entrega del premio a Mediaset España por dar visibilidad al autismo. Fue justo antes del Día Mundial de Concienciación sobre el Autismo (2 de abril).",
    sourceName: "Nota de prensa de Mediaset España",
    sourceUrl: "https://files.mediaset.es/file/2026/03/23/premio-amigo-del-autismo-a-mediaset-espana-cp-pdf_da39.pdf",
  },
  {
    id: "capacidades-2026",
    title: "XVII Carrera de las Capacidades",
    emoji: "🎽",
    date: "2026-05-31",
    place: "Madrid, Barcelona, Sevilla, Valencia y Málaga",
    organizer: "Fundación Adecco",
    communityId: "deporte",
    description:
      "Una carrera para apoyar la inclusión de las personas con discapacidad. El año anterior participaron 4.300 corredores, con y sin discapacidad.",
    sourceName: "Nota de prensa de Fundación Adecco",
    sourceUrl: "https://fundacionadecco.org/wp-content/uploads/2026/04/280426_CARRERA-CAPACIDADES.pdf",
  },
  {
    id: "special-olympics-tarragona-2026",
    title: "Jocs Special Olympics Tarragona 2026",
    emoji: "🏅",
    date: "2026-10-09",
    endDate: "2026-10-12",
    place: "Tarragona",
    organizer: "Special Olympics Catalunya y Ayuntamiento de Tarragona",
    communityId: "deporte",
    description:
      "Más de 1.000 deportistas con discapacidad intelectual compitieron en nueve deportes. Terminó con una ceremonia de clausura llena de emoción.",
    sourceName: "Diari de Tarragona",
    sourceUrl: "https://www.diaridetarragona.com/deportes/272941/tarraco-arena-da-finalizados-special-olympics-2026.html",
  },
  {
    id: "inclus-2026",
    title: "Inclús: Festival Internacional de Cine y Discapacidad (14ª edición)",
    emoji: "🎬",
    date: "2026-11-21",
    endDate: "2026-12-01",
    place: "Barcelona",
    organizer: "Associació Inclús",
    communityId: "arte",
    description:
      "Festival de cine con películas y cortos sobre la discapacidad, vistos desde otro punto de vista. Se entregan premios por categorías.",
    sourceName: "Festhome",
    sourceUrl: "https://filmmakers.festhome.com/festival/753",
  },
  {
    id: "talavera-2026",
    title: "Semana de la Discapacidad de Talavera",
    emoji: "🎭",
    date: "2026-11-26",
    endDate: "2026-12-13",
    place: "Talavera de la Reina (Toledo)",
    organizer: "Ayuntamiento de Talavera de la Reina",
    communityId: "arte",
    unconfirmed: true,
    description:
      "Cada año, en torno al 3 de diciembre, hay marcha inclusiva, talleres adaptados y un ballet inclusivo. Las fechas de 2026 aún no tienen programa oficial.",
    sourceName: "Festivales de España",
    sourceUrl: "https://www.festivalesdeespana.com/festival/semana-de-la-discapacidad-talavera-de-la-reina",
  },
];

// Personas ficticias que "responden" en el chat de demostración.
export const demoPeople = [
  { name: "Lucía", emoji: "🦋" },
  { name: "Mateo", emoji: "🦁" },
  { name: "Sofía", emoji: "🌻" },
  { name: "Diego", emoji: "🐢" },
];

export const demoReplies = [
  "¡Hola! Qué bueno verte por aquí 😊",
  "¡Me gusta eso! ¿Y a ti?",
  "Yo también quiero ir 🎉",
  "¡Qué divertido!",
  "Gracias por contarnos 💛",
  "¿Quieres ser mi amigo?",
];

// Frases rápidas: ayudan a quien le cuesta escribir.
export const quickPhrases = [
  "👋 ¡Hola!",
  "😊 Me alegra estar aquí",
  "👍 Me gusta",
  "❓ ¿Me ayudas?",
  "🎉 ¡Yo voy!",
  "💛 Gracias",
];

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function parts(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

// "13 de octubre de 2024" o "5 al 8 de diciembre de 2025"
export function formatRange(date, endDate) {
  const a = parts(date);
  if (!endDate) return `${a.d} de ${MONTHS[a.m]} de ${a.y}`;
  const b = parts(endDate);
  if (a.y === b.y && a.m === b.m) return `${a.d} al ${b.d} de ${MONTHS[b.m]} de ${b.y}`;
  if (a.y === b.y) return `${a.d} de ${MONTHS[a.m]} al ${b.d} de ${MONTHS[b.m]} de ${b.y}`;
  return `${a.d} de ${MONTHS[a.m]} de ${a.y} al ${b.d} de ${MONTHS[b.m]} de ${b.y}`;
}

// Fecha de hoy (local) como AAAA-MM-DD, para saber si un evento ya pasó.
export function todayISO() {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

export function isPast(event, today = todayISO()) {
  return (event.endDate || event.date) < today;
}

// Portales de ayudas y recursos. Todas las URL se comprobaron en nov. 2026.
// kind: "oficial" = organismo público · "entidad" = entidad de referencia del sector (no es del Estado).
export const portalTabs = [
  { id: "asociaciones", label: "Asociaciones", emoji: "🤝" },
  { id: "ayudas", label: "Ayudas", emoji: "💶" },
  { id: "empleo", label: "Empleo", emoji: "💼" },
  { id: "derechos", label: "Derechos y apoyo", emoji: "⚖️" },
];

export const portals = {
  ayudas: {
    intro:
      "Estas son las páginas oficiales para pedir ayudas. Muchas piden antes el certificado de discapacidad, así que empieza por ahí. Los requisitos y las cantidades cambian: confírmalos siempre en el portal.",
    items: [
      {
        id: "grado",
        emoji: "📄",
        name: "Certificado de discapacidad",
        org: "Imserso",
        kind: "oficial",
        description:
          "Es el documento que reconoce tu grado de discapacidad y abre la puerta a muchas ayudas. Lo tramita tu comunidad autónoma; en Ceuta y Melilla, el Imserso.",
        url: "https://imserso.es/autonomia-personal-dependencia/grado-de-discapacidad",
        first: true,
      },
      {
        id: "dependencia",
        emoji: "🧑‍🦽",
        name: "Dependencia: ayuda en el día a día",
        org: "Imserso · SAAD",
        kind: "oficial",
        description:
          "Si necesitas apoyo para las tareas diarias, puedes pedir que te reconozcan la situación de dependencia y recibir servicios o ayudas.",
        url: "https://imserso.es/autonomia-personal-dependencia/sistema-autonomia-atencion-dependencia-saad",
      },
      {
        id: "pnc",
        emoji: "💶",
        name: "Pensión no contributiva por invalidez",
        org: "Imserso",
        kind: "oficial",
        description:
          "Una pensión para personas con una discapacidad alta que no pueden cobrar una pensión normal y tienen pocos ingresos.",
        url: "https://imserso.es/pnc-prestaciones-subvenciones/pnc-invalidez",
      },
      {
        id: "pspd",
        emoji: "🧾",
        name: "Prestaciones sociales y económicas",
        org: "Imserso",
        kind: "oficial",
        description: "Otras ayudas económicas y sociales para personas con discapacidad. Aquí ves cuáles hay y dónde pedirlas.",
        url: "https://imserso.es/pnc-prestaciones-subvenciones/prestaciones-sociales-economicas-personas-discapacidad",
      },
      {
        id: "imv",
        emoji: "🏠",
        name: "Ingreso Mínimo Vital",
        org: "Seguridad Social",
        kind: "oficial",
        description:
          "Una ayuda mensual para hogares con muy pocos ingresos. En esta web puedes simular si te corresponde y hacer la solicitud.",
        url: "https://imv.seg-social.es/",
      },
      {
        id: "beneficios",
        emoji: "📚",
        name: "Todas las ayudas, en un solo sitio",
        org: "Ministerio de Derechos Sociales",
        kind: "oficial",
        description: "Una guía del Ministerio con los beneficios y ayudas económicas para personas con discapacidad.",
        url: "https://www.dsca.gob.es/es/derechos-sociales/discapacidad/beneficios-y-ayudas-economicas",
      },
    ],
  },
  empleo: {
    intro: "Aquí puedes buscar trabajo, formarte y recibir apoyo para empezar.",
    items: [
      {
        id: "sepe",
        emoji: "🏛️",
        name: "Servicio Público de Empleo Estatal",
        org: "SEPE",
        kind: "oficial",
        description: "Es la oficina de empleo pública. Puedes apuntarte como demandante de empleo y consultar prestaciones.",
        url: "https://www.sepe.es/HomeSepe",
      },
      {
        id: "inserta",
        emoji: "🔎",
        name: "Inserta Empleo",
        org: "Fundación ONCE",
        kind: "entidad",
        description: "Ayuda a personas con discapacidad a formarse y a encontrar trabajo en empresas.",
        url: "https://www.insertaempleo.es/",
      },
      {
        id: "fonce",
        emoji: "🎓",
        name: "Fundación ONCE",
        org: "Fundación ONCE",
        kind: "entidad",
        description: "Programas de formación, empleo y accesibilidad para personas con discapacidad.",
        url: "https://www.fundaciononce.es/es",
      },
      {
        id: "dsca-empleo",
        emoji: "📋",
        name: "Empleo y discapacidad",
        org: "Ministerio de Derechos Sociales",
        kind: "oficial",
        description: "Información oficial sobre tus derechos y las medidas para trabajar con una discapacidad.",
        url: "https://www.dsca.gob.es/es/derechos-sociales/discapacidad/empleo",
      },
    ],
  },
  derechos: {
    intro: "Información clara sobre tus derechos, trámites y dónde pedir apoyo.",
    items: [
      {
        id: "linea024",
        emoji: "💛",
        name: "Línea 024: si te sientes muy mal",
        org: "Ministerio de Sanidad",
        kind: "oficial",
        description:
          "Si te sientes muy triste o solo, o piensas en hacerte daño, llama al 024. Es gratis, confidencial y atiende las 24 horas. Si hay una emergencia, llama al 112.",
        url: "https://www.sanidad.gob.es/linea024/home.htm",
        phone: "024",
        urgent: true,
      },
      {
        id: "derechos",
        emoji: "⚖️",
        name: "Derechos de las personas con discapacidad",
        org: "Ministerio de Derechos Sociales",
        kind: "oficial",
        description: "Qué derechos tienes y qué leyes te protegen.",
        url: "https://www.dsca.gob.es/es/derechos-sociales/discapacidad/derechos-personas-discapacidad",
      },
      {
        id: "oadis",
        emoji: "🗣️",
        name: "Oficina de Atención a la Discapacidad",
        org: "Real Patronato sobre Discapacidad",
        kind: "oficial",
        description: "Atiende quejas y consultas si crees que no se han respetado tus derechos.",
        url: "https://www.rpdiscapacidad.gob.es/organismos/oadis.htm",
      },
      {
        id: "rpd",
        emoji: "🏛️",
        name: "Real Patronato sobre Discapacidad",
        org: "Organismo público",
        kind: "oficial",
        description: "Organismo del Estado que impulsa la inclusión y la accesibilidad.",
        url: "https://www.rpdiscapacidad.gob.es/",
      },
      {
        id: "pag",
        emoji: "🧭",
        name: "Punto de Acceso General",
        org: "Administración General del Estado",
        kind: "oficial",
        description: "La puerta de entrada a los trámites y servicios de la Administración del Estado.",
        url: "https://administracion.gob.es/",
      },
      {
        id: "cermi",
        emoji: "🤲",
        name: "CERMI",
        org: "Comité Español de Representantes de Personas con Discapacidad",
        kind: "entidad",
        description: "Agrupa a las organizaciones de personas con discapacidad y defiende sus derechos.",
        url: "https://www.cermi.es/",
      },
      {
        id: "discapnet",
        emoji: "💻",
        name: "Discapnet",
        org: "Fundación ONCE",
        kind: "entidad",
        description: "Portal con noticias, guías, empleo y recursos para personas con discapacidad.",
        url: "https://www.discapnet.es/",
      },
    ],
  },
};

// Perfil: opciones y valores por defecto.
export const bloodGroups = ["No lo sé", "A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

export const emptyProfile = {
  name: "",
  nickname: "",
  birthDate: "",
  phone: "",
  address: "",
  bloodGroup: "No lo sé",
  allergies: "",
  medications: "",
  conditions: "",
  healthCard: "",
  doctor: "",
  howToHelp: "",
  contacts: [{ name: "", relation: "", phone: "" }],
};

export const MAX_CONTACTS = 3;
