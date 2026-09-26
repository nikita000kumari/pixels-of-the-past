# Automated Voice Generator Script for Pixels of the Past
# Generates offline .wav speech audio files using Windows Speech Synthesis

param(
    [string]$OutputDir = "$PSScriptRoot\..\public\audio\voice",
    [string]$VoiceName = "Microsoft Zira Desktop"
)

Add-Type -AssemblyName System.Speech

if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$installed = $synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }

Write-Host "Available voices: $($installed -join ', ')"

if ($installed -contains $VoiceName) {
    $synth.SelectVoice($VoiceName)
    Write-Host "Using voice: $VoiceName"
} else {
    Write-Host "Voice $VoiceName not found, using default voice: $($synth.Voice.Name)"
}

$synth.Rate = 0
$synth.Volume = 100

$voiceLines = @{
    # World Introductions
    "voice_hub_intro" = "Welcome to Pixels of the Past. Journey through thousands of years of Indian history across the ancient bronze age Harappa, the classical Gupta Golden Age, and the magnificent Mughal Empire. Choose a world to begin your exploration."
    "voice_harappa_intro" = "Entering the Indus Valley Civilization at Harappa, dating back to 2600 BCE. Explore the elevated Citadel, the brick-paved Great Bath, the massive public granaries, and the meticulously planned urban lower town."
    "voice_gupta_intro" = "Entering the Gupta Empire, the classical Golden Age of ancient India. Here, mathematics, astronomy, metallurgy, and sculpture reached monumental heights. Inspect the rust-resistant Iron Pillar, Dashavatara temple, and the famed university of Nalanda."
    "voice_mughal_intro" = "Entering the Mughal Empire, renowned for breathtaking Persian-inspired architecture and royal patronage. Walk through the symmetrical Charbagh water gardens, gaze upon the white marble Taj Mahal, and uncover legendary treasures like the Peacock Throne."
    
    # Harappan Artifacts
    "harappa_lingam" = "Lingam Stone Structure. Polished conical stone object discovered in early Harappan urban layers, associated with ritual practices and symbolic veneration in the Indus Valley Civilization."
    "harappa_pashupati" = "Pashupati Seal. Steatite seal depicting a horned three-faced deity seated in yogic posture, surrounded by wild animals including an elephant, tiger, rhinoceros, and buffalo. It is famously identified as Proto-Shiva."
    "harappa_pottery" = "Painted Terracotta Storage Jar. Fine wheel-thrown red pottery jar coated with red slip and hand-painted with glossy black geometric motifs, pipal leaves, and peacock designs."
    "harappa_dancing_girl" = "Bronze Dancing Girl. A masterpiece lost-wax bronze figurine standing 10.5 centimeters tall, displaying a confident, natural posture with bangles stacked elegantly up her left arm."
    "harappa_bullock" = "Terracotta Bullock Cart. Clay toy cart with solid wooden-style wheels pulled by a pair of humped zebu bullocks, illustrating advanced overland trade networks across the Indus basin."
    "harappa_jewellery" = "Harappan Jewellery Hoard. A dazzling hoard of long cylindrical carnelian, lapis lazuli, jasper, and agate beads, together with gold fillets and polished copper mirrors."

    # Gupta Artifacts
    "gupta_gold_coin" = "Gold Coin of Chandragupta the Second. High-purity gold dinara coin depicting Emperor Chandragupta the Second Vikramaditya holding a bow and arrow, with Goddess Lakshmi seated on a lotus on the reverse."
    "gupta_sarnath_buddha" = "Sarnath Seated Buddha. Chunar sandstone sculpture depicting Buddha delivering his first sermon in Dharmachakra Mudra, renowned for its tranquil expression and delicately carved halo drape."
    "gupta_nalanda_buddha" = "Nalanda Sultanganj Bronze Buddha. Over two-meter tall copper figurine cast using the lost-wax technique, demonstrating the extraordinary metallurgical prowess of Gupta period Nalanda artisans."
    "gupta_varaha_relief" = "Varaha Avatar Rock Relief. Colossal rock-cut relief depicting Lord Vishnu as the wild boar Varaha rescuing Earth Goddess Bhudevi from the cosmic waters."
    "gupta_sushruta_codex" = "Sushruta Samhita Medical Codex. Ancient Sanskrit text on medicine and surgery written by Sushruta, detailing surgical rhinoplasty, cataract extraction, and over 120 specialized surgical instruments."
    "gupta_aryabhatiya" = "Aryabhatiya Astronomical Treatise. Pioneering mathematical and astronomical work by Aryabhata defining zero, pi calculated to four decimal places, and heliocentric planetary rotations."

    # Mughal Artifacts
    "mughal_peacock_throne" = "Peacock Throne, or Takht-i Taus. The legendary jeweled throne of Emperor Shah Jahan crafted from solid gold encrusted with rubies, emeralds, pearls, and the fabled Koh-i-Noor diamond."
    "mughal_kohinoor" = "Koh-i-Noor Diamond. Legendary 186-carat diamond mined from Golconda, worn by Mughal emperors Babur, Shah Jahan, and Aurangzeb as a pinnacle of imperial majesty."
    "mughal_padshahnama" = "Padshahnama Illuminated Manuscript. The official chronicle of Emperor Shah Jahan's reign, decorated with exquisite gold-leaf miniature paintings detailing royal court durbars and monumental architecture."
    "mughal_shamshir" = "Damascus Steel Shamshir Sword. Curved ceremonial saber forged from watered Wootz steel with a gold-inlaid jade hilt belonging to Emperor Akbar the Great."
    "mughal_jahangir_dagger" = "Jahangir Jade Dagger. Carved nephrite jade hilt dagger shaped like a horse head with rubies set in kundan gold wirework, crafted specifically for Emperor Jahangir."
    "mughal_akbarnama" = "Akbarnama Historical Chronicle. Monumental three-volume official biography of Emperor Akbar written by court historian Abu'l-Fazl, richly illustrated by over 49 royal miniature painters."

    # Monument Voice Triggers
    "monument_taj_mahal" = "Approaching the Taj Mahal Complex, the iconic white marble wonder of the Mughal Empire."
    "monument_humayun_tomb" = "Entering Humayun's Tomb, the monumental red sandstone garden tomb of Delhi."
    "monument_agra_fort" = "Approaching Agra Fort, the mighty red sandstone fortress of the Mughal emperors."
    "monument_fatehpur_sikri" = "Entering Fatehpur Sikri and the grand Buland Darwaza, the monumental victory gate."
    "monument_charbagh" = "Walking through the Charbagh Water Gardens, the quadripartite paradise gardens."
    "monument_iron_pillar" = "Arriving at the Iron Pillar of Delhi, an ancient metallurgical marvel that has defied rust for sixteen centuries."
    "monument_dashavatara" = "Approaching the Dashavatara Temple of Deogarh, one of the earliest standing stone temples of the Gupta era."
    "monument_nalanda" = "Entering Nalanda University, the illustrious ancient Buddhist center of wisdom and learning."
    "monument_dhamek_stupa" = "Arriving at Dhamek Stupa in Sarnath, commemorating Lord Buddha's first sermon."
    "monument_great_bath" = "Entering The Great Bath of Mohenjo-daro, the ancient world's earliest public bath and ritual pool."
    "monument_granaries" = "Approaching the Great Granaries, massive air-cooled grain stores of the Indus civilization."
    "monument_citadel_stairs" = "Ascending the Citadel Grand Staircase, connecting the lower township to the high citadel."

    # Button Click & Navigation Voice Lines
    "ui_mughal" = "Mughal Empire."
    "ui_gupta" = "Gupta Dynasty."
    "ui_harappa" = "Harappan Civilization."
    "ui_grid" = "Physics Test Arena."
    "ui_daylight" = "Daylight Mode."
    "ui_midnight" = "Midnight Mode."
    "ui_reset" = "Resetting position."
    "ui_hub" = "Returning to Hub."
    "ui_voice_on" = "Voice Narrator Enabled."
    "ui_voice_off" = "Voice Narrator Muted."
}

Write-Host "Generating $($voiceLines.Count) narration audio files in: $OutputDir"

foreach ($key in $voiceLines.Keys) {
    $outPath = Join-Path $OutputDir "$key.wav"
    if (!(Test-Path $outPath)) {
        Write-Host "  -> Synthesizing $key.wav..."
        $synth.SetOutputToWaveFile($outPath)
        $synth.Speak($voiceLines[$key])
    } else {
        Write-Host "  [Exists] $key.wav"
    }
}

$synth.Dispose()
Write-Host "All voice audio files up to date!" -ForegroundColor Green
