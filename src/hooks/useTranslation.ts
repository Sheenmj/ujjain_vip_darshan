import { useBookingStore } from '@/store/bookingStore';

const translations = {
  en: {
    // Header & Navigation
    title: "Government of Madhya Pradesh — Devasthan Management",
    portalName: "Ujjain VIP Darshan Booking",
    tagline: "Secure, Real-Time VIP Darshan & Slot Booking Portal",
    home: "Home",
    discover: "Discover Temples",
    myBookings: "My Bookings",
    staffScan: "Staff Scan",
    adminDash: "Admin Console",

    // Hero Section
    heroTitle: "Experience the Divine Grace of Mahakal",
    heroTitlePrefix: "Experience the",
    heroTitleHighlight: "Divine Grace",
    heroTitleSuffix: "of Mahakal",
    heroDesc: "A government-operated, secure VIP Darshan booking portal for the historic temples of Ujjain. Powered by high-speed slot reservation and secure UIDAI Aadhaar verification.",
    bookNow: "Book VIP Darshan Now",
    checkAvailability: "Check Availability",

    // Live Counters Section
    realTimeBooking: "Real-Time Seat Booking",
    liveCounter: "Live Ticket Availability",
    livePollingActive: "Live counters polling active",
    lastUpdated: "Last Updated",
    loading: "Loading...",
    highAvailability: "High Availability",
    limited: "Limited",
    fillingFast: "Filling Fast",
    slotsRemaining: "slots remaining",
    soldOut: "Sold Out",

    // Temple Showcase Section
    sacredDestinations: "Sacred Destinations",
    sacredTemples: "Sacred Temples of Ujjain",
    bookVipDarshan: "Book VIP Darshan",
    ujjainMP: "Ujjain, MP",

    // Temple Lore & History
    templeLore: "Temple Lore & Sacred History",
    deityIconography: "Deity Iconography & Worship",
    architecturalHeritage: "Architectural Heritage & Construction",
    period: "Period",
    style: "Style",
    visitorInstructions: "Visitor Instructions",
    visitingHours: "Visiting Hours",
    dressCodeConstraint: "Dress Code Requirement",
    strictRules: "Important Rules",
    vipTicketPricing: "VIP Ticket Pricing",
    perDevotee: "per Devotee",

    // Upcoming Festivals
    upcomingFestivals: "Upcoming Festival Calendar",
    festShravan: "Shravan Somvar Shivratri",
    festShravanDesc: "Quota multiplier: slots allocation increased by 150%",
    festNavratri: "Sharad Navratri Deepotsav",
    festNavratriDesc: "Special slot bookings open 15 days in advance",
    festHarihara: "Harihara Milan Mahotsav",
    festHariharaDesc: "Midnight special queue entry enabled for VIP passes",

    // DPDP Consent Modal
    dpdpTitle: "DPDP Act 2023 Consent Declaration",
    dpdpSubtitle: "Digital Personal Data Protection Compliance",
    dpdpBody: "To secure your VIP Temple Darshan reservation, the Devasthan Board utilizes Aadhaar e-KYC Verification managed under UIDAI regulations. We require your explicit consent under Section 6 of India's DPDP Act 2023.",
    dpdpDataMin: "Data Minimization: We only request and verify the last 4 digits of your Aadhaar card and do not store full identity document credentials at rest.",
    dpdpPurpose: "Purpose Limitation: Verification data is used solely to prevent black-market ticket hoarding and duplicate bookings.",
    dpdpDeletion: "Right to Deletion: Ephemeral ticket record metadata can be deleted from active indexes upon request after Darshan slots exit active verification dates.",
    decline: "Decline",
    agreeAuthorize: "Agree and Authorize",
    declineAlert: "Consent is required to make online VIP bookings. You may use offline ticketing counters at Ujjain railway station.",

    // Booking Wizard Steps
    step: "Step",
    selectTemple: "Select Temple",
    selectDateTime: "Select Date & Slot",
    devoteeDetails: "Devotee Details",
    verifyOtp: "Verify OTP",
    identityKyc: "e-KYC Verification",
    payment: "Payment & Checkout",
    confirmed: "Booking Confirmed",
    back: "Back",
    next: "Next & Continue",
    cancel: "Cancel",

    // Visitor Info
    rules: "Visiting Guidelines",
    dressCode: "Dress Code",
    hours: "Timings",
    address: "Location Address",
    price: "VIP Ticket Fee",
    auditLogs: "Audit Log Viewer",

    // Advisory Notice
    advisoryTitle: "Official Advisory & Fraud Warning",
    advisoryBody: "The Government of Madhya Pradesh and the Devasthan Management Board have not authorized any third-party agents, guides, or external websites to sell VIP Darshan tickets. All bookings must be made exclusively through this official portal or at authorized physical counters. Engaging with touts is illegal and will lead to strict legal action and ticket cancellation."
  },
  hi: {
    // Header & Navigation
    title: "मध्य प्रदेश सरकार — देवस्थान प्रबंधन",
    portalName: "उज्जैन वीआईपी दर्शन बुकिंग",
    tagline: "सुरक्षित, वास्तविक समय वीआईपी दर्शन और स्लॉट बुकिंग पोर्टल",
    home: "मुख्य पृष्ठ",
    discover: "मंदिर खोजें",
    myBookings: "मेरी बुकिंग",
    staffScan: "स्टाफ स्कैन",
    adminDash: "प्रशासन कंसोल",

    // Hero Section
    heroTitle: "महाकाल की दिव्य कृपा का अनुभव करें",
    heroTitlePrefix: "अनुभव करें",
    heroTitleHighlight: "दिव्य कृपा",
    heroTitleSuffix: "महाकाल की",
    heroDesc: "उज्जैन के ऐतिहासिक मंदिरों के लिए मध्य प्रदेश सरकार द्वारा संचालित एक सुरक्षित वीआईपी दर्शन बुकिंग पोर्टल। तीव्र स्लॉट आरक्षण और यूआईडीएआई आधार सत्यापन द्वारा संचालित।",
    bookNow: "अभी वीआईपी दर्शन बुक करें",
    checkAvailability: "उपलब्धता जांचें",

    // Live Counters
    realTimeBooking: "रियल-टाइम सीट बुकिंग",
    liveCounter: "लाइव टिकट उपलब्धता",
    livePollingActive: "लाइव काउंटर सक्रिय हैं",
    lastUpdated: "अंतिम अपडेट",
    loading: "लोड हो रहा है...",
    highAvailability: "अधिक उपलब्धता",
    limited: "सीमित",
    fillingFast: "तेजी से भर रहा है",
    slotsRemaining: "स्लॉट शेष",
    soldOut: "बुक हो चुका है",

    // Temple Showcase
    sacredDestinations: "पवित्र गंतव्य",
    sacredTemples: "उज्जैन के पवित्र मंदिर",
    bookVipDarshan: "वीआईपी दर्शन बुक करें",
    ujjainMP: "उज्जैन, म.प्र.",

    // Temple Lore
    templeLore: "मंदिर की पौराणिक कथा एवं पवित्र इतिहास",
    deityIconography: "देवता की मूर्ति विज्ञान एवं पूजा",
    architecturalHeritage: "वास्तुकला विरासत एवं निर्माण",
    period: "काल",
    style: "शैली",
    visitorInstructions: "दर्शनार्थी निर्देश",
    visitingHours: "दर्शन समय",
    dressCodeConstraint: "वस्त्र संहिता नियम",
    strictRules: "महत्वपूर्ण नियम",
    vipTicketPricing: "वीआईपी टिकट मूल्य",
    perDevotee: "प्रति श्रद्धालु",

    // Festivals
    upcomingFestivals: "आगामी त्योहार कैलेंडर",
    festShravan: "श्रावण सोमवार शिवरात्रि",
    festShravanDesc: "कोटा गुणक: स्लॉट आवंटन 150% बढ़ाया गया",
    festNavratri: "शरद नवरात्रि दीपोत्सव",
    festNavratriDesc: "विशेष स्लॉट बुकिंग 15 दिन पहले से खुलती है",
    festHarihara: "हरिहर मिलन महोत्सव",
    festHariharaDesc: "वीआईपी पास के लिए मध्यरात्रि विशेष प्रवेश",

    // DPDP Consent Modal
    dpdpTitle: "डीपीडीपी अधिनियम 2023 सहमति घोषणा",
    dpdpSubtitle: "डिजिटल व्यक्तिगत डेटा संरक्षण अनुपालन",
    dpdpBody: "आपके वीआईपी मंदिर दर्शन आरक्षण को सुरक्षित करने के लिए, देवस्थान बोर्ड यूआईडीएआई विनियमों के तहत प्रबंधित आधार ई-केवाईसी सत्यापन का उपयोग करता है। हमें भारत के डीपीडीपी अधिनियम 2023 की धारा 6 के तहत आपकी स्पष्ट सहमति चाहिए।",
    dpdpDataMin: "डेटा न्यूनीकरण: हम केवल आपके आधार कार्ड के अंतिम 4 अंकों का अनुरोध और सत्यापन करते हैं और पूर्ण पहचान दस्तावेज़ क्रेडेंशियल्स संग्रहीत नहीं करते।",
    dpdpPurpose: "उद्देश्य सीमा: सत्यापन डेटा का उपयोग केवल कालाबाज़ारी टिकट जमाखोरी और डुप्लिकेट बुकिंग रोकने के लिए किया जाता है।",
    dpdpDeletion: "हटाने का अधिकार: दर्शन स्लॉट सक्रिय सत्यापन तिथि के बाद अनुरोध पर टिकट रिकॉर्ड मेटाडेटा हटाया जा सकता है।",
    decline: "अस्वीकार करें",
    agreeAuthorize: "सहमत और अधिकृत करें",
    declineAlert: "ऑनलाइन वीआईपी बुकिंग के लिए सहमति आवश्यक है। आप उज्जैन रेलवे स्टेशन पर ऑफलाइन टिकट काउंटर का उपयोग कर सकते हैं।",

    // Booking Wizard
    step: "चरण",
    selectTemple: "मंदिर का चयन करें",
    selectDateTime: "तिथि और स्लॉट चुनें",
    devoteeDetails: "श्रद्धालु विवरण",
    verifyOtp: "ओटीपी सत्यापित करें",
    identityKyc: "ई-केवाईसी सत्यापन",
    payment: "भुगतान और चेकआउट",
    confirmed: "बुकिंग की पुष्टि हुई",
    back: "पीछे",
    next: "आगे बढ़ें",
    cancel: "रद्द करें",

    rules: "दर्शन के नियम",
    dressCode: "पोशाक संहिता",
    hours: "समय",
    address: "स्थान का पता",
    price: "वीआईपी टिकट शुल्क",
    auditLogs: "ऑडिट लॉग्स",

    advisoryTitle: "आधिकारिक सलाह और धोखाधड़ी की चेतावनी",
    advisoryBody: "मध्य प्रदेश सरकार और देवस्थान प्रबंधन बोर्ड ने किसी भी तीसरे पक्ष के एजेंट, गाइड या बाहरी वेबसाइटों को वीआईपी दर्शन टिकट बेचने के लिए अधिकृत नहीं किया है। सभी बुकिंग विशेष रूप से इस आधिकारिक पोर्टल या अधिकृत भौतिक काउंटरों पर की जानी चाहिए। दलालों के साथ जुड़ना अवैध है और इससे सख्त कानूनी कार्रवाई और टिकट रद्द कर दिया जाएगा।"
  },
  ta: {
    // Header & Navigation
    title: "மத்திய பிரதேச அரசு — தேவஸ்தான மேலாண்மை",
    portalName: "உஜ்ஜைனி விஐபி தரிசனம்",
    tagline: "பாதுகாப்பான விஐபி தரிசன முன்பதிவு போர்டல்",
    home: "முகப்பு",
    discover: "கோவில்கள்",
    myBookings: "எனது முன்பதிவுகள்",
    staffScan: "ஊழியர் ஸ்கேன்",
    adminDash: "நிர்வாகம்",

    // Hero Section
    heroTitle: "மகாகாலின் தெய்வீக அருளை அனுபவியுங்கள்",
    heroTitlePrefix: "அனுபவியுங்கள்",
    heroTitleHighlight: "தெய்வீக அருள்",
    heroTitleSuffix: "மகாகாலின்",
    heroDesc: "உஜ்ஜைனி வரலாற்று சிறப்புமிக்க கோவில்களுக்கான அரசு விஐபி தரிசன முன்பதிவு போர்டல்.",
    bookNow: "விஐபி தரிசனம் முன்பதிவு செய்",
    checkAvailability: "இடங்களை சரிபார்க்கவும்",

    // Live Counters
    realTimeBooking: "நிகழ்நேர இருக்கை முன்பதிவு",
    liveCounter: "தரிசன நேர முன்பதிவு",
    livePollingActive: "நிகழ்நேர காட்டிகள் செயலில் உள்ளன",
    lastUpdated: "கடைசி புதுப்பிப்பு",
    loading: "ஏற்றுகிறது...",
    highAvailability: "அதிக இடம் உள்ளது",
    limited: "குறைவான இடம்",
    fillingFast: "விரைவில் நிரம்புகிறது",
    slotsRemaining: "இடங்கள் உள்ளன",
    soldOut: "முழுமையாக முன்பதிவு செய்யப்பட்டது",

    // Temple Showcase
    sacredDestinations: "புனித தலங்கள்",
    sacredTemples: "உஜ்ஜைனியின் புனித கோவில்கள்",
    bookVipDarshan: "விஐபி தரிசனம் முன்பதிவு",
    ujjainMP: "உஜ்ஜைனி, ம.பி.",

    // Temple Lore
    templeLore: "கோவில் புராணம் மற்றும் புனித வரலாறு",
    deityIconography: "தெய்வ சிலை அமைப்பு மற்றும் வழிபாடு",
    architecturalHeritage: "கட்டிடக்கலை பாரம்பரியம் மற்றும் நிர்மாணம்",
    period: "காலம்",
    style: "பாணி",
    visitorInstructions: "பார்வையாளர் வழிகாட்டுதல்கள்",
    visitingHours: "தரிசன நேரம்",
    dressCodeConstraint: "ஆடை கட்டுப்பாடு",
    strictRules: "முக்கிய விதிகள்",
    vipTicketPricing: "விஐபி டிக்கெட் விலை",
    perDevotee: "ஒரு பக்தருக்கு",

    // Festivals
    upcomingFestivals: "திருவிழா காலண்டர்",
    festShravan: "சிராவண சோமவார் சிவராத்திரி",
    festShravanDesc: "கோட்டா பெருக்கி: இடங்கள் 150% அதிகரிக்கப்பட்டன",
    festNavratri: "சரத் நவராத்திரி தீபோத்சவம்",
    festNavratriDesc: "சிறப்பு முன்பதிவு 15 நாட்களுக்கு முன்பே திறக்கப்படும்",
    festHarihara: "ஹரிஹர மிலன் மகோத்சவம்",
    festHariharaDesc: "விஐபி பாஸ்களுக்கு நள்ளிரவு சிறப்பு நுழைவு",

    // DPDP Consent Modal
    dpdpTitle: "டிபிடிபி சட்டம் 2023 ஒப்புதல் அறிவிப்பு",
    dpdpSubtitle: "டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு இணக்கம்",
    dpdpBody: "உங்கள் விஐபி கோவில் தரிசன முன்பதிவைப் பாதுகாக்க, தேவஸ்தான வாரியம் UIDAI விதிமுறைகளின் கீழ் ஆதார் இ-கேஒய்சி சரிபார்ப்பைப் பயன்படுத்துகிறது. இந்தியாவின் டிபிடிபி சட்டம் 2023-ன் பிரிவு 6-ன் கீழ் உங்கள் வெளிப்படையான ஒப்புதல் தேவை.",
    dpdpDataMin: "தரவு குறைப்பு: உங்கள் ஆதார் அட்டையின் கடைசி 4 இலக்கங்களை மட்டுமே கோருகிறோம், முழு அடையாள ஆவணங்களைச் சேமிப்பதில்லை.",
    dpdpPurpose: "நோக்க வரம்பு: கருப்பு சந்தை டிக்கெட் பதுக்கல் மற்றும் நகல் முன்பதிவுகளைத் தடுக்க மட்டுமே சரிபார்ப்புத் தரவு பயன்படுத்தப்படுகிறது.",
    dpdpDeletion: "நீக்கும் உரிமை: தரிசன நேரம் முடிந்த பிறகு கோரிக்கையின் பேரில் டிக்கெட் பதிவுகளை நீக்கலாம்.",
    decline: "நிராகரி",
    agreeAuthorize: "ஒப்புக்கொள் மற்றும் அங்கீகரி",
    declineAlert: "ஆன்லைன் விஐபி முன்பதிவுக்கு ஒப்புதல் அவசியம். உஜ்ஜைனி ரயில் நிலையத்தில் ஆஃப்லைன் டிக்கெட் கவுண்டர்களைப் பயன்படுத்தலாம்.",

    // Booking Wizard
    step: "படி",
    selectTemple: "கோவிலைத் தேர்ந்தெடுக்கவும்",
    selectDateTime: "தேதியைத் தேர்ந்தெடுக்கவும்",
    devoteeDetails: "பக்தர்கள் விவரம்",
    verifyOtp: "OTP சரிபார்ப்பு",
    identityKyc: "இ-கேஒய்சி சரிபார்ப்பு",
    payment: "கட்டணம் செலுத்துதல்",
    confirmed: "முன்பதிவு உறுதி செய்யப்பட்டது",
    back: "பின்னால்",
    next: "அடுத்து",
    cancel: "ரத்து செய்",

    rules: "விதிமுறைகள்",
    dressCode: "ஆடை கட்டுப்பாடு",
    hours: "நேரம்",
    address: "முகவரி",
    price: "விஐபி கட்டணம்",
    auditLogs: "ஆடிட் பதிவுகள்",

    advisoryTitle: "அதிகாரப்பூர்வ ஆலோசனை மற்றும் மோசடி எச்சரிக்கை",
    advisoryBody: "மத்தியப் பிரதேச அரசு மற்றும் தேவஸ்தான நிர்வாகக் குழு எந்த மூன்றாம் தரப்பு முகவர்கள், வழிகாட்டிகள் அல்லது வெளிப்புற வலைத்தளங்களுக்கும் விஐபி தரிசன டிக்கெட்டுகளை விற்க அங்கீகாரம் வழங்கவில்லை. அனைத்து முன்பதிவுகளும் இந்த அதிகாரப்பூர்வ போர்டல் மூலமாகவோ அல்லது அங்கீகரிக்கப்பட்ட கவுண்டர்களிலோ மட்டுமே செய்யப்பட வேண்டும்."
  },
  te: {
    // Header & Navigation
    title: "మధ్యప్రదేశ్ ప్రభుత్వం — దేవస్థాన నిర్వహణ",
    portalName: "ఉజ్జయిని విఐపి దర్శనం",
    tagline: "సురక్షితమైన విఐపి దర్శన బుకింగ్ పోర్టల్",
    home: "హోమ్",
    discover: "ఆలయాలు",
    myBookings: "నా బుకింగ్స్",
    staffScan: "స్టాఫ్ స్కాన్",
    adminDash: "అడ్మిన్ ప్యానెల్",

    // Hero Section
    heroTitle: "మహాకాలుని దివ్య అనుభూతిని పొందండి",
    heroTitlePrefix: "అనుభవించండి",
    heroTitleHighlight: "దివ్య కృప",
    heroTitleSuffix: "మహాకాలుని",
    heroDesc: "ఉజ్జయిని చారిత్రాత్మక దేవాలయాల కొరకు ప్రభుత్వ విఐపి దర్శన బుకింగ్ పోర్టల్.",
    bookNow: "విఐపి దర్శనం బుక్ చేసుకోండి",
    checkAvailability: "అందుబాటును తనిఖీ చేయండి",

    // Live Counters
    realTimeBooking: "రియల్-టైం సీటు బుకింగ్",
    liveCounter: "లైవ్ టికెట్ల లభ్యత",
    livePollingActive: "లైవ్ కౌంటర్లు యాక్టివ్‌గా ఉన్నాయి",
    lastUpdated: "చివరి అప్‌డేట్",
    loading: "లోడ్ అవుతోంది...",
    highAvailability: "అధిక అందుబాటు",
    limited: "పరిమితం",
    fillingFast: "త్వరగా నిండుతోంది",
    slotsRemaining: "స్లాట్లు మిగిలి ఉన్నాయి",
    soldOut: "పూర్తయింది",

    // Temple Showcase
    sacredDestinations: "పవిత్ర గమ్యస్థానాలు",
    sacredTemples: "ఉజ్జయిని పవిత్ర ఆలయాలు",
    bookVipDarshan: "విఐపి దర్శనం బుక్ చేయండి",
    ujjainMP: "ఉజ్జయిని, మ.ప్ర.",

    // Temple Lore
    templeLore: "ఆలయ పురాణం మరియు పవిత్ర చరిత్ర",
    deityIconography: "దేవతా ప్రతిమా శాస్త్రం మరియు పూజ",
    architecturalHeritage: "వాస్తుశిల్ప వారసత్వం మరియు నిర్మాణం",
    period: "కాలం",
    style: "శైలి",
    visitorInstructions: "సందర్శకుల సూచనలు",
    visitingHours: "దర్శన సమయాలు",
    dressCodeConstraint: "దుస్తుల నియమావళి",
    strictRules: "ముఖ్యమైన నియమాలు",
    vipTicketPricing: "విఐపి టికెట్ ధర",
    perDevotee: "ఒక్కో భక్తునికి",

    // Festivals
    upcomingFestivals: "పండుగల క్యాలెండర్",
    festShravan: "శ్రావణ సోమవార శివరాత్రి",
    festShravanDesc: "కోటా గుణకం: స్లాట్ కేటాయింపు 150% పెంచబడింది",
    festNavratri: "శరన్నవరాత్రి దీపోత్సవం",
    festNavratriDesc: "ప్రత్యేక స్లాట్ బుకింగ్‌లు 15 రోజుల ముందు తెరవబడతాయి",
    festHarihara: "హరిహర మిలన్ మహోత్సవం",
    festHariharaDesc: "విఐపి పాస్‌ల కోసం అర్ధరాత్రి ప్రత్యేక ప్రవేశం",

    // DPDP Consent Modal
    dpdpTitle: "డిపిడిపి చట్టం 2023 సమ్మతి ప్రకటన",
    dpdpSubtitle: "డిజిటల్ వ్యక్తిగత డేటా రక్షణ సమ్మతి",
    dpdpBody: "మీ విఐపి ఆలయ దర్శన రిజర్వేషన్‌ను సురక్షితం చేయడానికి, దేవస్థాన బోర్డు UIDAI నిబంధనల ప్రకారం ఆధార్ ఇ-కేవైసి ధ్రువీకరణను ఉపయోగిస్తుంది. భారతదేశ డిపిడిపి చట్టం 2023 సెక్షన్ 6 ప్రకారం మీ స్పష్టమైన సమ్మతి అవసరం.",
    dpdpDataMin: "డేటా కుదింపు: మీ ఆధార్ కార్డ్ చివరి 4 అంకెలను మాత్రమే అభ్యర్థిస్తాము, పూర్తి గుర్తింపు పత్రాలను నిల్వ చేయము.",
    dpdpPurpose: "ఉద్దేశ్య పరిమితి: బ్లాక్ మార్కెట్ టికెట్ నిల్వ మరియు డూప్లికేట్ బుకింగ్‌లను నిరోధించడానికి మాత్రమే ధ్రువీకరణ డేటా ఉపయోగించబడుతుంది.",
    dpdpDeletion: "తొలగింపు హక్కు: దర్శన స్లాట్ గడువు తర్వాత అభ్యర్థన మేరకు టికెట్ రికార్డ్ మెటాడేటాను తొలగించవచ్చు.",
    decline: "తిరస్కరించు",
    agreeAuthorize: "అంగీకరించు మరియు అధికారం ఇవ్వు",
    declineAlert: "ఆన్‌లైన్ విఐపి బుకింగ్‌లకు సమ్మతి అవసరం. ఉజ్జయిని రైల్వే స్టేషన్‌లో ఆఫ్‌లైన్ టికెట్ కౌంటర్లను ఉపయోగించవచ్చు.",

    // Booking Wizard
    step: "దశ",
    selectTemple: "ఆలయాన్ని ఎంచుకోండి",
    selectDateTime: "తేదీ & సమయం",
    devoteeDetails: "భక్తుల వివరాలు",
    verifyOtp: "OTP వెరిఫికేషన్",
    identityKyc: "ఈ-కేవైసీ వెరిఫికేషన్",
    payment: "చెల్లింపు",
    confirmed: "బుకింగ్ ఖరారైంది",
    back: "వెనుకకు",
    next: "ముందుకు",
    cancel: "రద్దు",

    rules: "దర్శన నిబంధనలు",
    dressCode: "దుస్తుల నియమావళి",
    hours: "సమయం",
    address: "చిరునామా",
    price: "విఐపి టికెట్ ధర",
    auditLogs: "ఆడిట్ లాగ్స్",

    advisoryTitle: "అధికారిక సలహా మరియు మోసాల హెచ్చరిక",
    advisoryBody: "మధ్యప్రదేశ్ ప్రభుత్వం మరియు దేవస్థాన నిర్వహణ బోర్డు ఏ మూడవ పక్ష ఏజెంట్లు, గైడ్‌లు లేదా బాహ్య వెబ్‌సైట్‌లకు విఐపి దర్శన టిక్కెట్లను విక్రయించడానికి అనుమతి ఇవ్వలేదు. అన్ని బుకింగ్‌లు ఈ అధికారిక పోర్టల్ ద్వారా లేదా అధీకృత కౌంటర్లలో మాత్రమే చేయాలి."
  },
  gu: {
    // Header & Navigation
    title: "મધ્ય પ્રદેશ સરકાર — દેવસ્થાન વ્યવસ્થાપન",
    portalName: "ઉજ્જૈન વીઆઇપી દર્શન",
    tagline: "સુરક્ષિત વીઆઈપી દર્શન અને સ્લોટ બુકિંગ પોર્ટલ",
    home: "હોમ",
    discover: "મંદિર શોધો",
    myBookings: "મારી બુકિંગ",
    staffScan: "સ્ટાફ સ્કેન",
    adminDash: "એડમિન કન્સોલ",

    // Hero Section
    heroTitle: "મહાકાલની દિવ્ય કૃપાનો અનુભવ કરો",
    heroTitlePrefix: "અનુભવ કરો",
    heroTitleHighlight: "દિવ્ય કૃપા",
    heroTitleSuffix: "મહાકાલની",
    heroDesc: "ઉજ્જૈનના ઐતિહાસિક મંદિરો માટે સરકારી વીઆઈપી દર્શન બુકિંગ પોર્ટલ.",
    bookNow: "વીઆઈપી દર્શન બુક કરો",
    checkAvailability: "ઉપલબ્ધતા તપાસો",

    // Live Counters
    realTimeBooking: "રિયલ-ટાઇમ સીટ બુકિંગ",
    liveCounter: "લાઈવ ટિકિટ ઉપલબ્ધતા",
    livePollingActive: "લાઈવ કાઉન્ટર્સ સક્રિય છે",
    lastUpdated: "છેલ્લું અપડેટ",
    loading: "લોડ થઈ રહ્યું છે...",
    highAvailability: "ઉચ્ચ ઉપલબ્ધતા",
    limited: "મર્યાદિત",
    fillingFast: "ઝડપથી ભરાઈ રહ્યું છે",
    slotsRemaining: "સ્લોટ બાકી છે",
    soldOut: "હાઉસફુલ",

    // Temple Showcase
    sacredDestinations: "પવિત્ર સ્થળો",
    sacredTemples: "ઉજ્જૈનનાં પવિત્ર મંદિરો",
    bookVipDarshan: "વીઆઈપી દર્શન બુક કરો",
    ujjainMP: "ઉજ્જૈન, મ.પ્ર.",

    // Temple Lore
    templeLore: "મંદિરની પૌરાણિક કથા અને પવિત્ર ઇતિહાસ",
    deityIconography: "દેવતાની મૂર્તિવિજ્ઞાન અને પૂજા",
    architecturalHeritage: "સ્થાપત્ય વારસો અને નિર્માણ",
    period: "સમયગાળો",
    style: "શૈલી",
    visitorInstructions: "મુલાકાતી સૂચનાઓ",
    visitingHours: "દર્શન સમય",
    dressCodeConstraint: "વસ્ત્ર નિયમ",
    strictRules: "મહત્વપૂર્ણ નિયમો",
    vipTicketPricing: "વીઆઈપી ટિકિટ કિંમત",
    perDevotee: "પ્રતિ ભક્ત",

    // Festivals
    upcomingFestivals: "તહેવાર કેલેન્ડર",
    festShravan: "શ્રાવણ સોમવાર શિવરાત્રી",
    festShravanDesc: "કોટા ગુણાંક: સ્લોટ ફાળવણી 150% વધારાઈ",
    festNavratri: "શરદ નવરાત્રી દીપોત્સવ",
    festNavratriDesc: "વિશેષ સ્લોટ બુકિંગ 15 દિવસ અગાઉથી ખુલે છે",
    festHarihara: "હરિહર મિલન મહોત્સવ",
    festHariharaDesc: "વીઆઈપી પાસ માટે મધ્યરાત્રી વિશેષ પ્રવેશ",

    // DPDP Consent Modal
    dpdpTitle: "ડીપીડીપી અધિનિયમ 2023 સંમતિ ઘોષણા",
    dpdpSubtitle: "ડિજિટલ વ્યક્તિગત ડેટા સંરક્ષણ અનુપાલન",
    dpdpBody: "તમારા વીઆઈપી મંદિર દર્શન આરક્ષણને સુરક્ષિત કરવા, દેવસ્થાન બોર્ડ UIDAI નિયમો હેઠળ આધાર ઈ-કેવાયસી ચકાસણીનો ઉપયોગ કરે છે. ભારતના ડીપીડીપી અધિનિયમ 2023ની કલમ 6 હેઠળ તમારી સ્પષ્ટ સંમતિ જરૂરી છે.",
    dpdpDataMin: "ડેટા ન્યૂનીકરણ: અમે ફક્ત તમારા આધાર કાર્ડના છેલ્લા 4 અંકોની વિનંતી અને ચકાસણી કરીએ છીએ, સંપૂર્ણ ઓળખ દસ્તાવેજો સંગ્રહિત કરતા નથી.",
    dpdpPurpose: "હેતુ મર્યાદા: કાળા બજારની ટિકિટ સંગ્રહખોરી અને ડુપ્લિકેટ બુકિંગ રોકવા માટે જ ચકાસણી ડેટા વપરાય છે.",
    dpdpDeletion: "ડિલીટ કરવાનો અધિકાર: દર્શન સ્લોટ સમાપ્ત થયા પછી વિનંતી પર ટિકિટ રેકોર્ડ મેટાડેટા ડિલીટ કરી શકાય છે.",
    decline: "નકારો",
    agreeAuthorize: "સંમત અને અધિકૃત કરો",
    declineAlert: "ઓનલાઈન વીઆઈપી બુકિંગ માટે સંમતિ જરૂરી છે. તમે ઉજ્જૈન રેલવે સ્ટેશન પર ઑફલાઇન ટિકિટ કાઉન્ટરનો ઉપયોગ કરી શકો છો.",

    // Booking Wizard
    step: "પગલું",
    selectTemple: "મંદિર પસંદ કરો",
    selectDateTime: "તારીખ અને સ્લોટ પસંદ કરો",
    devoteeDetails: "ભક્તોની વિગતો",
    verifyOtp: "OTP વેરીફીકેશન",
    identityKyc: "ઇ-કેવાયસી વેરિફિકેશન",
    payment: "ચુકવણી",
    confirmed: "બુકિંગ કન્ફર્મ થયું",
    back: "પાછા",
    next: "આગળ વધો",
    cancel: "રદ કરો",

    rules: "દર્શનના નિયમો",
    dressCode: "ડ્રેસ કોડ",
    hours: "સમય",
    address: "સરનામું",
    price: "વીઆઈપી ટિકિટ ફી",
    auditLogs: "ઓડિટ લોગ",

    advisoryTitle: "સત્તાવાર સલાહ અને છેતરપિંડીની ચેતવણી",
    advisoryBody: "મધ્યપ્રદેશ સરકાર અને દેવસ્થાન મેનેજમેન્ટ બોર્ડે વીઆઇપી દર્શન ટિકિટ વેચવા માટે કોઈપણ તૃતીય-પક્ષ એજન્ટો, માર્ગદર્શિકાઓ અથવા બાહ્ય વેબસાઇટ્સને અધિકૃત કર્યા નથી. તમામ બુકિંગ ફક્ત આ સત્તાવાર પોર્ટલ દ્વારા અથવા અધિકૃત કાઉન્ટરો પર જ કરવાના રહેશે."
  }
};

export function useTranslation() {
  const language = useBookingStore((state) => state.language);
  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  return { t, language };
}
