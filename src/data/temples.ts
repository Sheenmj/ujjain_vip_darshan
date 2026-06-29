export const temples = [
  {
    id: "mahakaleshwar",
    name: "Mahakaleshwar Jyotirlinga",
    slug: "mahakaleshwar-jyotirlinga",
    templeImage: "/temples/mahakaleshwar.png",
    deityImage: "/deities/shiva.png",
    deity: {
      name: "Lord Shiva (Mahakal)",
      description: "Mahakaleshwar Jyotirlinga is one of the twelve Jyotirlingas, shrines which are said to be the most sacred abodes of Lord Shiva. The deity is 'Swayambhu' (self-manifested), deriving currents of power (Shakti) from within itself. The temple is famous for its unique 'Bhasma Aarti', a daily ritual where the deity is worshipped with sacred ash.",
      iconography: "The Shiva Lingam at Mahakaleshwar is Dakshinamurti, facing south. This is a unique feature among the 12 Jyotirlingas, symbolizing the lord of death and time.",
      primaryFestivals: ["Maha Shivratri", "Sawan Somvar", "Kartik Mela", "Harihara Milan"]
    },
    history: {
      foundingPeriod: "Pre-historic / Reconstructed 12th Century CE",
      architecturalStyle: "Maratha, Bhumija and Chalukya",
      historicalBackground: "The temple complex was destroyed by Iltutmish during his raid of Ujjain in 1234-35 CE. The present structure was rebuilt by the Scindias (Maratha general Ranoji Shinde) in 1734 CE. Over the centuries, Maratha rulers made significant contributions to the temple's maintenance.",
      heritageListing: "State Protected Monument / Under Archaeological Survey of India (ASI) Supervision"
    },
    visitingInfo: {
      hours: "4:00 AM - 11:00 PM Daily",
      dressCode: "Traditional Indian Attire mandatory for Garbhagriha entry (Saree/Salwar-suit for women, Dhoti-Kurta for men). Casual western wear is restricted beyond the outer barricades.",
      rules: [
        "Mobile phones, cameras, and leather items are strictly prohibited.",
        "Devotees must maintain silence and queue discipline.",
        "Special queue passes must be printed or shown on mobile screens at Gate 4."
      ],
      address: "Jaisinghpura, Ujjain, Madhya Pradesh 456006"
    },
    vipDarshanInfo: {
      description: "Priority queue bypass with direct access to the Nandi Hall and Garbhagriha close-up viewing, accompanied by a temple priest (Panda) for special Archana.",
      duration: "15-20 minutes total transit time",
      price: 250, // Rs. 250 per devotee
      specialBenefits: [
        "Direct fast-track gate entry (Gate No. 1 / VIP Gate)",
        "Complimentary Mahakal Dry Fruit Prasad pouch",
        "Assisted Archana and flower offerings at the inner sanctum",
        "Seating space in Nandi Hall for 10 minutes post-darshan"
      ]
    }
  },
  {
    id: "harsiddhi",
    name: "Harsiddhi Mata Temple",
    slug: "harsiddhi-mata-temple",
    templeImage: "/temples/harsiddhi.png",
    deityImage: "/deities/durga.png",
    deity: {
      name: "Goddess Harsiddhi (Durga)",
      description: "One of the 51 sacred Shaktipeeths of India. According to Shiv Purana, this is the spot where the elbow of Goddess Sati fell when Shiva performed the Tandava. The goddess is also worshipped as the kuldevi (patron deity) of legendary King Vikramaditya.",
      iconography: "The temple features the self-manifested idol of Goddess Harsiddhi painted in dark vermillion, flanked by idols of Mahalakshmi and Mahasaraswati.",
      primaryFestivals: ["Sharad Navratri", "Chaitra Navratri", "Deepotsav (Lighting of 1100 lamps)"]
    },
    history: {
      foundingPeriod: "Ancient / Reconstructed 18th Century CE",
      architecturalStyle: "Maratha Architecture with traditional rock-cut pillars",
      historicalBackground: "The temple holds legendary status as King Vikramaditya's primary shrine. He is said to have offered his head 11 times to the goddess, who restored him each time. The massive lamp towers (Deepstambhas) in the courtyard are iconic landmarks of Ujjain, erected by Maratha rulers in the 1700s.",
      heritageListing: "Ancient Monument under MP State Archaeology"
    },
    visitingInfo: {
      hours: "5:00 AM - 10:00 PM Daily",
      dressCode: "Decent/Modest clothing. No explicit restrictions but traditional attire is highly appreciated.",
      rules: [
        "Do not touch the ancient Deepstambhas.",
        "Photography is prohibited inside the inner sanctum.",
        "Footwear must be deposited at the outer gate counters."
      ],
      address: "Near Shipra River, Harsiddhi Marg, Ujjain, Madhya Pradesh 456006"
    },
    vipDarshanInfo: {
      description: "Front-row queue slot for the evening lamp-lighting ceremony and direct viewing access to the goddess.",
      duration: "10-15 minutes",
      price: 150,
      specialBenefits: [
        "Priority standing slot for the iconic evening Deepa Aarti",
        "Special vermillion and coconut prasad box",
        "Assisted coconut offering at the sacrificial altar"
      ]
    }
  },
  {
    id: "kalbhairav",
    name: "Kaal Bhairav Temple",
    slug: "kaal-bhairav-temple",
    templeImage: "/temples/kalbhairav.png",
    deityImage: "/deities/bhairav.png",
    deity: {
      name: "Lord Kaal Bhairav",
      description: "Kaal Bhairav is a fierce manifestation of Lord Shiva associated with annihilation. In Ujjain, Kaal Bhairav is worshipped as the guardian deity of the city. A unique custom here is the offering of liquor (Madira) to the deity, which is poured into a saucer and placed near the idol's mouth, where it is visibly absorbed.",
      iconography: "The deity is depicted with a silver face, carrying a trident, and accompanied by his mount, the dog.",
      primaryFestivals: ["Bhairav Ashtami", "Maha Shivratri", "Sawan Somvar"]
    },
    history: {
      foundingPeriod: "Ancient / Modern structure by King Bhadrasen",
      architecturalStyle: "Temple structure with traditional dome styling",
      historicalBackground: "Mentioned extensively in the Avanti Khanda of Skanda Purana. The original ancient temple is believed to have been built by King Bhadrasen. The current temple reflects repairs and expansions done by the Maratha general Mahadji Scindia after his victory over the Rohillas in the late 18th century.",
      heritageListing: "Protected Heritage Site of Madhya Pradesh"
    },
    visitingInfo: {
      hours: "6:00 AM - 10:00 PM Daily",
      dressCode: "Modest casuals or traditional attire.",
      rules: [
        "Liquor offerings must only be purchased from government-authorized vendors outside.",
        "Children must be closely supervised due to heavy crowds in narrow corridors.",
        "Beware of unauthorized agents offering fast-track access."
      ],
      address: "Jail Road, Bhairav Garh, Ujjain, Madhya Pradesh 456003"
    },
    vipDarshanInfo: {
      description: "Direct entry to the front steps of the inner cella, ensuring zero wait time during peak hours.",
      duration: "10 minutes",
      price: 100,
      specialBenefits: [
        "Separate express queue bypass",
        "Direct receipt and distribution of devotee's liquor offerings by the head priest",
        "Raksha Sutra (sacred black thread) tying and Vibhuti prasad"
      ]
    }
  }
];
