// Voice Narrations Data for Pixels of the Past
// Maps artifact IDs and scene world IDs to clean spoken narration text and pre-rendered WAV file paths.

export const VOICE_NARRATIONS = {
  // --- WORLD INTRODUCTIONS ---
  hub: {
    id: 'hub',
    title: 'Pixels of the Past',
    audioFile: '/audio/voice/voice_hub_intro.wav',
    text: 'Welcome, explorer, to Pixels of the Past. Cross the threshold into three monumental epochs of Indian antiquity: the brick citadels of Bronze Age Harappa, the classical sciences and sacred temples of the Gupta Dynasty, and the monumental court splendors of the Mughal Empire. Select your expedition.'
  },
  harappa: {
    id: 'harappa',
    title: 'Indus Valley Civilization • Harappan Citadel',
    audioFile: '/audio/voice/voice_harappa_intro.wav',
    text: 'You stand upon the ancient soil of the Indus Valley, circa 2600 BCE. Navigate the engineered brick avenues of this Bronze Age metropolis, inspect the bitumen-sealed Great Bath, ascend the fortified Citadel, and uncover the sacred relics of the river plains.'
  },
  gupta: {
    id: 'gupta',
    title: 'The Gupta Empire • Classical Golden Age',
    audioFile: '/audio/voice/voice_gupta_intro.wav',
    text: 'Welcome to the Golden Age of the Gupta Dynasty, fourth century CE. In this era of classical genius, astronomers calculated the cosmos, metallurgists forged rustless iron, and master sculptors chiselled timeless stone temples. Explore the imperial plaza, the Deogarh sanctum, and the halls of Nalanda.'
  },
  mughal: {
    id: 'mughal',
    title: 'The Mughal Empire • Imperial Realm',
    audioFile: '/audio/voice/voice_mughal_intro.wav',
    text: 'You have arrived in the imperial court of the Mughal Empire. Stroll through the quadripartite watercourses of the Charbagh, gaze upon the luminous white marble of the Taj Mahal, and survey the mighty red sandstone bastions where emperors governed an empire.'
  },

  // --- HARAPPAN ARTIFACTS ---
  lingam: {
    id: 'lingam',
    title: 'Lingam Stone Structure',
    audioFile: '/audio/voice/harappa_lingam.wav',
    text: 'Lingam Stone Structure. Polished conical stone object discovered in early Harappan urban layers, associated with ritual practices and symbolic veneration in the Indus Valley Civilization.'
  },
  pashupati: {
    id: 'pashupati',
    title: 'Pashupati Seal',
    audioFile: '/audio/voice/harappa_pashupati.wav',
    text: 'Pashupati Seal. Steatite seal depicting a horned three-faced deity seated in yogic posture, surrounded by wild animals including an elephant, tiger, rhinoceros, and buffalo. It is famously identified as Proto-Shiva.'
  },
  pottery: {
    id: 'pottery',
    title: 'Painted Terracotta Storage Jar',
    audioFile: '/audio/voice/harappa_pottery.wav',
    text: 'Painted Terracotta Storage Jar. Fine wheel-thrown red pottery jar coated with red slip and hand-painted with glossy black geometric motifs, pipal leaves, and peacock designs.'
  },
  dancing_girl: {
    id: 'dancing_girl',
    title: 'Bronze Dancing Girl',
    audioFile: '/audio/voice/harappa_dancing_girl.wav',
    text: 'Bronze Dancing Girl. A masterpiece lost-wax bronze figurine standing 10.5 centimeters tall, displaying a confident, natural posture with bangles stacked elegantly up her left arm.'
  },
  bullock: {
    id: 'bullock',
    title: 'Terracotta Bullock Cart',
    audioFile: '/audio/voice/harappa_bullock.wav',
    text: 'Terracotta Bullock Cart. Clay toy cart with solid wooden-style wheels pulled by a pair of humped zebu bullocks, illustrating advanced overland trade networks across the Indus basin.'
  },
  jewellery: {
    id: 'jewellery',
    title: 'Harappan Jewellery Hoard',
    audioFile: '/audio/voice/harappa_jewellery.wav',
    text: 'Harappan Jewellery Hoard. A dazzling hoard of long cylindrical carnelian, lapis lazuli, jasper, and agate beads, together with gold fillets and polished copper mirrors.'
  },

  // --- GUPTA EMPIRE ARTIFACTS ---
  gold_coin: {
    id: 'gold_coin',
    title: 'Gold Coin of Chandragupta II',
    audioFile: '/audio/voice/gupta_gold_coin.wav',
    text: 'Gold Coin of Chandragupta II. High-purity gold dinara coin depicting Emperor Chandragupta II Vikramaditya holding a bow and arrow, with Goddess Lakshmi seated on a lotus on the reverse.'
  },
  sarnath_buddha: {
    id: 'sarnath_buddha',
    title: 'Sarnath Seated Buddha',
    audioFile: '/audio/voice/gupta_sarnath_buddha.wav',
    text: 'Sarnath Seated Buddha. Chunar sandstone sculpture depicting Buddha delivering his first sermon in Dharmachakra Mudra, renowned for its tranquil expression and delicately carved halo drape.'
  },
  nalanda_buddha: {
    id: 'nalanda_buddha',
    title: 'Nalanda Sultanganj Bronze Buddha',
    audioFile: '/audio/voice/gupta_nalanda_buddha.wav',
    text: 'Nalanda Sultanganj Bronze Buddha. Over two-meter tall copper figurine cast using the lost-wax technique, demonstrating the extraordinary metallurgical prowess of Gupta period Nalanda artisans.'
  },
  varaha_relief: {
    id: 'varaha_relief',
    title: 'Varaha Avatar Rock Relief',
    audioFile: '/audio/voice/gupta_varaha_relief.wav',
    text: 'Varaha Avatar Rock Relief. Colossal rock-cut relief depicting Lord Vishnu as the wild boar Varaha rescuing Earth Goddess Bhudevi from the cosmic waters.'
  },
  sushruta_codex: {
    id: 'sushruta_codex',
    title: 'Sushruta Samhita Medical Codex',
    audioFile: '/audio/voice/gupta_sushruta_codex.wav',
    text: 'Sushruta Samhita Medical Codex. Ancient Sanskrit text on medicine and surgery written by Sushruta, detailing surgical rhinoplasty, cataract extraction, and over 120 specialized surgical instruments.'
  },
  aryabhatiya: {
    id: 'aryabhatiya',
    title: 'Aryabhatiya Astronomical Treatise',
    audioFile: '/audio/voice/gupta_aryabhatiya.wav',
    text: 'Aryabhatiya Astronomical Treatise. Pioneering mathematical and astronomical work by Aryabhata defining zero, pi calculated to four decimal places, and heliocentric planetary rotations.'
  },

  // --- MUGHAL EMPIRE ARTIFACTS ---
  peacock_throne: {
    id: 'peacock_throne',
    title: 'Peacock Throne',
    audioFile: '/audio/voice/mughal_peacock_throne.wav',
    text: 'Peacock Throne, or Takht-i Taus. The legendary jeweled throne of Emperor Shah Jahan crafted from solid gold encrusted with rubies, emeralds, pearls, and the fabled Koh-i-Noor diamond.'
  },
  kohinoor: {
    id: 'kohinoor',
    title: 'Koh-i-Noor Diamond',
    audioFile: '/audio/voice/mughal_kohinoor.wav',
    text: 'Koh-i-Noor Diamond. Legendary 186-carat diamond mined from Golconda, worn by Mughal emperors Babur, Shah Jahan, and Aurangzeb as a pinnacle of imperial majesty.'
  },
  padshahnama: {
    id: 'padshahnama',
    title: 'Padshahnama Illuminated Manuscript',
    audioFile: '/audio/voice/mughal_padshahnama.wav',
    text: 'Padshahnama Illuminated Manuscript. The official chronicle of Emperor Shah Jahan’s reign, decorated with exquisite gold-leaf miniature paintings detailing royal court durbars and monumental architecture.'
  },
  shamshir: {
    id: 'shamshir',
    title: 'Damascus Steel Shamshir Sword',
    audioFile: '/audio/voice/mughal_shamshir.wav',
    text: 'Damascus Steel Shamshir Sword. Curved ceremonial saber forged from watered Wootz steel with a gold-inlaid jade hilt belonging to Emperor Akbar the Great.'
  },
  jahangir_dagger: {
    id: 'jahangir_dagger',
    title: 'Jahangir Jade Dagger',
    audioFile: '/audio/voice/mughal_jahangir_dagger.wav',
    text: 'Jahangir Jade Dagger. Carved nephrite jade hilt dagger shaped like a horse head with rubies set in kundan gold wirework, crafted specifically for Emperor Jahangir.'
  },
  akbarnama: {
    id: 'akbarnama',
    title: 'Akbarnama Historical Chronicle',
    audioFile: '/audio/voice/mughal_akbarnama.wav',
    text: 'Akbarnama Historical Chronicle. Monumental three-volume official biography of Emperor Akbar written by court historian Abu\'l-Fazl, richly illustrated by over 49 royal miniature painters.'
  },

  // --- MONUMENT & ARCHITECTURAL DISCOVERY ---
  monument_taj_mahal: {
    id: 'monument_taj_mahal',
    title: 'Rauza-i-Munawwara • Taj Mahal',
    audioFile: '/audio/voice/monument_taj_mahal.wav',
    text: 'Before you stands the Rauza-i-Munawwara, the Luminous Tomb. Commissioned by Shah Jahan in pure Makrana white marble, its great bulbous dome and four minarets rise over the Yamuna, adorned with pietra dura inlays of lapis lazuli and carnelian.'
  },
  monument_humayun_tomb: {
    id: 'monument_humayun_tomb',
    title: "Imperial Necropolis of Humayun",
    audioFile: '/audio/voice/monument_humayun_tomb.wav',
    text: "The grand garden tomb of Emperor Humayun, raised by Empress Bega Begum. Forged from carved red Sikri sandstone and crowned with a double dome of white marble, this mausoleum established the classical Mughal imperial architecture."
  },
  monument_agra_fort: {
    id: 'monument_agra_fort',
    title: 'The Crimson Citadel of Agra',
    audioFile: '/audio/voice/monument_agra_fort.wav',
    text: 'The formidable bastions of Agra Fort, fortified by Akbar the Great with double ramparts of red sandstone. Behind these seventy-foot battlements, the imperial court held audience with emissaries from across the known world.'
  },
  monument_fatehpur_sikri: {
    id: 'monument_fatehpur_sikri',
    title: 'Buland Darwaza • Gate of Magnificence',
    audioFile: '/audio/voice/monument_fatehpur_sikri.wav',
    text: 'The monumental Buland Darwaza, towering fifty-four meters above the royal courts of Fatehpur Sikri. Commissioned by Emperor Akbar to celebrate the Gujarat campaign, it stands as the highest victory portal in all of Asia.'
  },
  monument_charbagh: {
    id: 'monument_charbagh',
    title: 'Charbagh • Fourfold Paradise Gardens',
    audioFile: '/audio/voice/monument_charbagh.wav',
    text: 'The sacred Charbagh water gardens. Four axial channels flow from a central marble reservoir, symbolizing the rivers of paradise and feeding geometric walkways of cypress, rosewater, and lotus.'
  },
  monument_iron_pillar: {
    id: 'monument_iron_pillar',
    title: 'Rustless Iron Pillar of Chandra',
    audioFile: '/audio/voice/monument_iron_pillar.wav',
    text: 'The sacred Garuda standard of King Chandragupta Vikramaditya. Forged from six tons of high-purity wrought iron in the fourth century, its Brahmi verses commemorate heroic deeds, while its ancient metallurgy has defied rust for sixteen hundred years.'
  },
  monument_dashavatara: {
    id: 'monument_dashavatara',
    title: 'Dashavatara Sanctum of Deogarh',
    audioFile: '/audio/voice/monument_dashavatara.wav',
    text: 'The panchayatana sanctum of Deogarh, dedicated to Lord Vishnu. Dating to the fifth century, this earliest surviving stone temple features masterfully sculpted panels of Sheshashayi Vishnu resting upon the serpent of eternity.'
  },
  monument_nalanda: {
    id: 'monument_nalanda',
    title: 'Nalanda Mahavihara • Ancient University',
    audioFile: '/audio/voice/monument_nalanda.wav',
    text: 'The sacred red-brick monasteries of Nalanda Mahavihara. Founded under royal Gupta patronage, this monastic university housed nine million manuscripts and taught ten thousand scholars of astronomy, logic, and medicine from across Asia.'
  },
  monument_dhamek_stupa: {
    id: 'monument_dhamek_stupa',
    title: 'Dhamek Stupa • Sarnath Deer Park',
    audioFile: '/audio/voice/monument_dhamek_stupa.wav',
    text: "The venerable Dhamek Stupa of Sarnath. Rebuilt during the Gupta Golden Age with carved floral friezes and geometric chevrons, marking the sacred ground where Gautama Buddha first set in motion the Wheel of the Law."
  },
  monument_great_bath: {
    id: 'monument_great_bath',
    title: 'The Great Bath • Indus Ritual Pool',
    audioFile: '/audio/voice/monument_great_bath.wav',
    text: "The monumental Great Bath of the high citadel. Carefully paved with precision-cut fired bricks and sealed watertight with natural bitumen, this four-thousand-year-old pool served the sacred cleansing rites of the Indus priesthood."
  },
  monument_granaries: {
    id: 'monument_granaries',
    title: 'Citadel Granaries • State Reserve Vaults',
    audioFile: '/audio/voice/monument_granaries.wav',
    text: 'The massive state granaries of the Citadel. Raised upon brick sleeper walls with recessed ventilation channels to prevent moisture, these monumental vaults safeguarded grain reserves for the vast Bronze Age metropolis.'
  },
  monument_citadel_stairs: {
    id: 'monument_citadel_stairs',
    title: 'Citadel Grand Processional Stairway',
    audioFile: '/audio/voice/monument_citadel_stairs.wav',
    text: 'The grand processional staircase of the Citadel. Broad fired-brick ramps ascend from the bustling Lower Town to the elevated administrative citadel and ceremonial plazas above.'
  },

  // --- BUTTON UI CUES ---
  ui_mughal: { id: 'ui_mughal', title: 'World Selected', audioFile: '/audio/voice/ui_mughal.wav', text: 'Mughal Empire.' },
  ui_gupta: { id: 'ui_gupta', title: 'World Selected', audioFile: '/audio/voice/ui_gupta.wav', text: 'Gupta Dynasty.' },
  ui_harappa: { id: 'ui_harappa', title: 'World Selected', audioFile: '/audio/voice/ui_harappa.wav', text: 'Harappan Civilization.' },
  ui_grid: { id: 'ui_grid', title: 'Mode Selected', audioFile: '/audio/voice/ui_grid.wav', text: 'Physics Test Arena.' },
  ui_daylight: { id: 'ui_daylight', title: 'Environment', audioFile: '/audio/voice/ui_daylight.wav', text: 'Daylight Mode.' },
  ui_midnight: { id: 'ui_midnight', title: 'Environment', audioFile: '/audio/voice/ui_midnight.wav', text: 'Midnight Mode.' },
  ui_reset: { id: 'ui_reset', title: 'Player', audioFile: '/audio/voice/ui_reset.wav', text: 'Resetting position.' },
  ui_hub: { id: 'ui_hub', title: 'Navigation', audioFile: '/audio/voice/ui_hub.wav', text: 'Returning to Hub.' }
};
