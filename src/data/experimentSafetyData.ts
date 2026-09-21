/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Experiment Safety Center Registry
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Experiment-specific chemical hazard profiles, required PPE, safe
 *  handling precautions, spill protocols, and disposal procedures.
 *  100% scientifically conservative and aligned with actual lab reagents.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Language } from '../i18n/types';

export interface ChemicalHazardItem {
  chemical: string;
  hazard: string;
  icon: string;
}

export interface LocalizedSafetyProfile {
  ppe: string[];
  hazards: ChemicalHazardItem[];
  precautions: string[];
  spillGuidance: string[];
  disposal: string[];
}

export type ExperimentSafetyRegistry = Record<
  string, // experimentId
  Record<Language, LocalizedSafetyProfile>
>;

export const EXPERIMENT_SAFETY_DATA: ExperimentSafetyRegistry = {
  // ── 1. Acid-Base Titration (HCl vs NaOH) ──
  titration: {
    en: {
      ppe: [
        'Chemical Splash Goggles (EN 166 compliant)',
        'Nitrile Protective Gloves (resistant to dilute acids and bases)',
        '100% Cotton Laboratory Coat',
        'Fully enclosed leather or synthetic laboratory footwear',
      ],
      hazards: [
        {
          chemical: 'Hydrochloric Acid (0.1 M HCl)',
          hazard: 'Skin corrosive, severe eye irritant, acidic mist irritates respiratory tract.',
          icon: '⚠️',
        },
        {
          chemical: 'Sodium Hydroxide (0.1 M NaOH)',
          hazard: 'Strongly alkaline, corrosive to eyes and skin, slippery on touch, causes severe burns.',
          icon: '☠️',
        },
        {
          chemical: 'Phenolphthalein Indicator (0.1% in Ethanol)',
          hazard: 'Flammable solvent base; eye and mild skin irritant.',
          icon: '🔥',
        },
      ],
      precautions: [
        'Always use a rubber pipette filler bulb; NEVER pipette acid or alkali by mouth.',
        'Inspect the glass burette and stopcock for chips, hairline fractures, or leaks before mounting.',
        'Swirl the conical flask gently during titration to prevent acid droplet splashes.',
        'Wipe any liquid droplets from the external nozzle of the burette before taking readings.',
      ],
      spillGuidance: [
        'Acid Spill (HCl): Neutralize immediately with excess sodium bicarbonate powder until bubbling ceases, then wipe with damp absorbent paper.',
        'Alkali Spill (NaOH): Neutralize gently with dilute boric acid solution (5%), wipe clean, and rinse surface with running water.',
        'Skin Contact: Immediately flush affected skin area with running tap water for a minimum of 15 minutes. Report to instructor.',
      ],
      disposal: [
        'Titrated neutralization mixture (NaCl + H₂O at pH 6–8) can be safely flushed down the sink with running tap water.',
        'Unreacted stock acid or base must be neutralized to pH 7 before disposal.',
        'Rinse all glassware thoroughly with distilled water and leave inverted on drying racks.',
      ],
    },
    hi: {
      ppe: [
        'रासायनिक स्प्लैश गॉगल्स (आंखों की सुरक्षा हेतु)',
        'नाइट्राइल सुरक्षात्मक दस्ताने (अम्ल और क्षार प्रतिरोधी)',
        '100% सूती प्रयोगशाला कोट (लैब कोट)',
        'पूरी तरह ढके हुए जूते',
      ],
      hazards: [
        {
          chemical: 'हाइड्रोक्लोरिक अम्ल (0.1 M HCl)',
          hazard: 'त्वचा संक्षारक, आंखों में गंभीर जलन, वाष्प श्वसन मार्ग को उत्तेजित करती है।',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हाइड्रॉक्साइड (0.1 M NaOH)',
          hazard: 'प्रबल क्षारीय, त्वचा और आंखों के लिए संक्षारक, छूने पर फिसलनदार, गंभीर जलन पैदा करता है।',
          icon: '☠️',
        },
        {
          chemical: 'फेनोल्फथेलिन सूचक (0.1% अल्कोहल में)',
          hazard: 'ज्वलनशील विलायक आधार; आंखों और त्वचा में हल्की जलन।',
          icon: '🔥',
        },
      ],
      precautions: [
        'हमेशा रबर पिपेट बल्ब का उपयोग करें; मुंह से अम्ल या क्षार कभी न खींचें।',
        'ब्यूरेट और स्टॉपकॉक में किसी दरार या रिसाव की पहले से जांच कर लें।',
        'अनुमापन के दौरान फ्लास्क को हल्के हाथ से हिलाएं ताकि छींटे बाहर न गिरें।',
        'पाठ्यांक लेने से पहले ब्यूरेट की बाहरी नोक पर लगे तरल की बूंद को पोंछ लें।',
      ],
      spillGuidance: [
        'अम्ल रिसाव (HCl): बुदबुदाहट बंद होने तक सोडियम बाइकार्बोनेट डालकर उदासीन करें, फिर पोंछ लें।',
        'क्षार रिसाव (NaOH): तनु बोरिक अम्ल (5%) डालकर धीरे से उदासीन करें और पानी से धोएं।',
        'त्वचा संपर्क: प्रभावित क्षेत्र को कम से कम 15 मिनट तक बहते पानी से तुरंत धोएं।',
      ],
      disposal: [
        'अनुमापित उदासीन मिश्रण (pH 6-8) को बहते पानी के साथ सिंक में बहाया जा सकता है।',
        'बचे हुए स्टॉक अम्ल या क्षार को सिंक में डालने से पहले उदासीन करना आवश्यक है।',
        'सभी कांच के बर्तनों को आसुत जल से अच्छी तरह धोकर रैक पर उल्टा रखें।',
      ],
    },
    mr: {
      ppe: [
        'रासायनिक चष्मे (डोळ्यांच्या संरक्षणासाठी गॉगल्स)',
        'नायट्रिल संरक्षणात्मक हातमोजे (आम्ल व अल्क प्रतिरोधक)',
        '१००% सुती प्रयोगशाळा कोट (लॅब कोट)',
        'पूर्ण बंद पादत्राणे (शूज)',
      ],
      hazards: [
        {
          chemical: 'हायड्रोक्लोरिक आम्ल (0.1 M HCl)',
          hazard: 'त्वचेसाठी दाहक, डोळ्यांची जळजळ करणारे आणि वाफेमुळे श्वसनाला त्रास देणारे.',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हायड्रॉक्साइड (0.1 M NaOH)',
          hazard: 'तीव्र अल्कधर्मी, त्वचेला स्पर्श केल्यास बुळबुळीत लागणारे व गंभीर इजा करणारे.',
          icon: '☠️',
        },
        {
          chemical: 'फेनॉल्फथलीन दर्शक (अल्कोहोलमधील)',
          hazard: 'ज्वलनशील विद्रावक; डोळ्यांमध्ये जळजळ निर्माण करणारे.',
          icon: '🔥',
        },
      ],
      precautions: [
        'नेहमी रबरी पिपेट बल्बचा वापर करा; तोंडाने कधीही आम्ल किंवा अल्क ओढू नका.',
        'ब्युरेट किंवा कॉर्कला कोणतीही तडे किंवा गळती नाही ना याची खात्री करा.',
        'टायट्रेशन करताना शंकूपात्र हळुवार हलवा जेणेकरून थेंब बाहेर उडणार नाहीत.',
        'वाचन घेण्यापूर्वी ब्युरेटच्या टोकावरील थेंब स्वच्छ पुसून घ्या.',
      ],
      spillGuidance: [
        'आम्ल सांडल्यास (HCl): बुडबुडे येणे थांबेपर्यंत बेकिंग सोडा घालून उदासीनीकरण करा आणि पुसा.',
        'अल्क सांडल्यास (NaOH): सौम्य बोरिक आम्ल घालून पुसून घ्या आणि पाण्याने धुवा.',
        'त्वचेवर पडल्यास: ताबडतोब किमान १५ मिनिटे वाहत्या पाण्याखाली त्वचा स्वच्छ धुवा.',
      ],
      disposal: [
        'उदासीनीकरण झालेले द्रावण (pH ६-८) वाहत्या पाण्यासह सिंकमध्ये सोडले जाऊ शकते.',
        'उरलेले तीव्र आम्ल किंवा अल्क आधी उदासीन करूनच विल्हेवाट लावावी.',
        'काचेची भांडी डिस्टिल्ड वॉटरने धुवून वाळवण्यासाठी स्टँडवर उलटी ठेवा.',
      ],
    },
  },

  // ── 2. Law of Conservation of Mass ──
  conservation: {
    en: {
      ppe: [
        'Laboratory Safety Glasses with side shields',
        'Nitrile Gloves (impermeable to heavy metal salt solutions)',
        'Laboratory Coat',
        'Closed-toe Shoes',
      ],
      hazards: [
        {
          chemical: 'Barium Chloride Solution (5% BaCl₂)',
          hazard: 'Toxic if swallowed (Class 6.1 poison), harmful by inhalation, irritates eyes and skin.',
          icon: '☠️',
        },
        {
          chemical: 'Sodium Sulphate Solution (5% Na₂SO₄)',
          hazard: 'Low toxicity, mild eye and skin irritant in concentrated forms.',
          icon: '⚠️',
        },
        {
          chemical: 'Barium Sulphate Precipitate (BaSO₄)',
          hazard: 'Insoluble inorganic precipitate; avoid inhalation or ingestion of dried residue.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'Handle Barium Chloride with extreme caution; avoid direct contact or droplet splashes.',
        'Ensure the rubber cork is firmly and securely seated to prevent toxic solution leaks during inversion.',
        'Do not shake violently; gently invert the flask to avoid dislodging the ignition tube violently.',
        'Keep balance pan clean and dry; never place wet glassware directly on digital load cells.',
      ],
      spillGuidance: [
        'BaCl₂ Spill: Absorb immediately with chemical spill pillows or absorbent towels. Treat surface with dilute sodium sulphate to convert soluble barium into harmless insoluble BaSO₄ precipitate.',
        'Skin Exposure: Wash thoroughly with mild soap and running water for 15 minutes. Seek medical guidance if irritation persists.',
      ],
      disposal: [
        'CRITICAL: NEVER pour Barium salts down municipal drains! Barium is a regulated heavy metal pollutant.',
        'Collect all precipitate slurries (BaSO₄ + NaCl) into designated "Heavy Metal Waste — Barium" carboys.',
        'Seal waste bottles tightly and label with hazardous chemical waste tags.',
      ],
    },
    hi: {
      ppe: [
        'सुरक्षा चश्मा (साइड शील्ड सहित)',
        'नाइट्राइल दस्ताने (भारी धातु लवण प्रतिरोधी)',
        'प्रयोगशाला कोट (लैब कोट)',
        'बंद जूते',
      ],
      hazards: [
        {
          chemical: 'बेरियम क्लोराइड विलयन (5% BaCl₂)',
          hazard: 'निगलने पर अत्यधिक विषैला (Class 6.1 विष), त्वचा और आंखों में जलन उत्पन्न करता है।',
          icon: '☠️',
        },
        {
          chemical: 'सोडियम सल्फेट विलयन (5% Na₂SO₄)',
          hazard: 'कम विषाक्तता, हल्की जलन पैदा कर सकता है।',
          icon: '⚠️',
        },
        {
          chemical: 'बेरियम सल्फेट अवक्षेप (BaSO₄)',
          hazard: 'अघुलनशील अकार्बनिक अवक्षेप; सूखे अवशेष को अंदर लेने से बचें।',
          icon: '🛡️',
        },
      ],
      precautions: [
        'बेरियम क्लोराइड को अत्यंत सावधानी से संभालें; त्वचा संपर्क से बचें।',
        'फ्लास्क को उलटने से पहले सुनिश्चित करें कि रबर कॉर्क पूरी तरह वायुरोधी लगा हो।',
        'फ्लास्क को बहुत जोर से न हिलाएं, धीरे से पलटें ताकि ज्वलन नली कांच को न तोड़े।',
        'डिजिटल बैलेंस पर कभी भी गीला फ्लास्क न रखें।',
      ],
      spillGuidance: [
        'BaCl₂ रिसाव: सोखने वाले कागज से तुरंत पोंछें। सतह पर थोड़ा सोडियम सल्फेट डालें ताकि विषैला बेरियम अघुलनशील BaSO₄ में बदल जाए।',
        'त्वचा संपर्क: साबुन और बहते पानी से तुरंत 15 मिनट तक धोएं।',
      ],
      disposal: [
        'महत्वपूर्ण: बेरियम लवणों को कभी भी सीधे सिंक में न बहाएं! यह विषैली भारी धातु है।',
        'सभी अवक्षेप और घोल को "भारी धातु अपशिष्ट — बेरियम" कंटेनर में ही एकत्र करें।',
        'अपशिष्ट कंटेनर को अच्छी तरह सील करके लेबल लगाएं।',
      ],
    },
    mr: {
      ppe: [
        'सुरक्षा चष्मा (गॉगल्स)',
        'नायट्रिल हातमोजे (जड धातू प्रतिरोधक)',
        'प्रयोगशाळा कोट (लॅब कोट)',
        'बंद पादत्राणे',
      ],
      hazards: [
        {
          chemical: 'बेरियम क्लोराईड द्रावण (5% BaCl₂)',
          hazard: 'गिळल्यास अत्यंत विषारी (वर्ग ६.१ विष), डोळे आणि त्वचेची जळजळ करणारे.',
          icon: '☠️',
        },
        {
          chemical: 'सोडियम सल्फेट द्रावण (5% Na₂SO₄)',
          hazard: 'कमी विषारी, सौम्य जळजळ करू शकते.',
          icon: '⚠️',
        },
        {
          chemical: 'बेरियम सल्फेट पांढरा अवक्षेप (BaSO₄)',
          hazard: 'अविद्राव्य पांढरा घन पदार्थ; धूळ श्वसनात जाणे टाळा.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'बेरियम क्लोराईड काळजीपूर्वक हाताळा; थेट स्पर्श टाळा.',
        'फ्लास्क उलटा करण्यापूर्वी रबरी बुच घट्ट बसवले असल्याची खात्री करा.',
        'फ्लास्क खूप वेगाने हलवू नका; ज्वलन नळी आदळणार नाही याची काळजी घ्या.',
        'डिजिटल वजनकाट्यावर ओले पात्र कधीही ठेवू नका.',
      ],
      spillGuidance: [
        'BaCl₂ सांडल्यास: शोषक कागदाने पुसा. पृष्ठभागावर सोडियम सल्फेट टाकून विषारी बेरियम सुरक्षित अवक्षेपामध्ये बदला.',
        'त्वचेवर पडल्यास: भरपूर पाण्याने आणि साबणाने १५ मिनिटे स्वच्छ धुवा.',
      ],
      disposal: [
        'अतिशय महत्त्वाचे: बेरियम द्रावण कधीही साध्या सिंकमध्ये ओतू नका! ही घातक जड धातू आहे.',
        'सर्व अवक्षेप "जड धातू कचरा — बेरियम" या स्वतंत्र डब्यातच जमा करा.',
        'कचरा बाटल्या व्यवस्थित हवाबंद करून त्यावर लेबल लावा.',
      ],
    },
  },

  // ── 3. Zinc Acid Reaction ──
  'zinc-acid-reaction': {
    en: {
      ppe: [
        'Impact & Chemical Splash Resistant Safety Goggles',
        'Heat & Chemical Resistant Gloves',
        'Full Laboratory Coat',
        'Enclosed Shoes',
      ],
      hazards: [
        {
          chemical: 'Dilute Sulphuric Acid (1.0 M H₂SO₄)',
          hazard: 'Strongly acidic, corrosive, causes painful skin burns and permanent eye damage.',
          icon: '⚠️',
        },
        {
          chemical: 'Hydrogen Gas (H₂)',
          hazard: 'Extremely flammable and explosive gas when mixed with atmospheric air.',
          icon: '🔥',
        },
        {
          chemical: 'Granulated Zinc Metal (Zn)',
          hazard: 'Flammable solid in fine dust forms; reacts vigorously with mineral acids.',
          icon: '⚡',
        },
      ],
      precautions: [
        'Point the mouth of the test tube AWAY from yourself and laboratory peers at all times.',
        'Perform the burning matchstick test with extreme care; never look directly down into the tube orifice.',
        'Keep open flames and matchboxes at least 1 meter away from acid stock containers.',
        'Allow the reaction tube to cool on a wire stand; the zinc-acid redox reaction is mildly exothermic.',
      ],
      spillGuidance: [
        'Acid Spill: Sprinkle dry sand or sodium bicarbonate over the acid puddle until neutral, then sweep up into plastic waste bucket.',
        'Fire Incident: Extinguish flame immediately with a fire blanket or Class B/C CO₂ extinguisher.',
      ],
      disposal: [
        'Allow zinc pieces to completely react or retrieve unreacted granules with plastic tweezers, rinse with water, and recycle.',
        'Neutralize acidic zinc sulphate solution with dilute sodium carbonate, filter, and dispose of aqueous filtrate with running water.',
      ],
    },
    hi: {
      ppe: [
        'रसायन एवं प्रभाव प्रतिरोधी सुरक्षा चश्मा',
        'ऊष्मा एवं रसायन प्रतिरोधी दस्ताने',
        'प्रयोगशाला कोट (लैब कोट)',
        'बंद जूते',
      ],
      hazards: [
        {
          chemical: 'तनु सल्फ्यूरिक अम्ल (1.0 M H₂SO₄)',
          hazard: 'तीव्र संक्षारक, त्वचा पर छाले और आंखों को गंभीर नुकसान पहुंचा सकता है।',
          icon: '⚠️',
        },
        {
          chemical: 'हाइड्रोजन गैस (H₂)',
          hazard: 'हवा के साथ मिलने पर अत्यधिक ज्वलनशील और विस्फोटक गैस।',
          icon: '🔥',
        },
        {
          chemical: 'दानेदार जिंक धातु (Zn)',
          hazard: 'अम्लों के साथ तीव्र गति से अभिक्रिया करता है।',
          icon: '⚡',
        },
      ],
      precautions: [
        'परखनली का मुंह हमेशा अपने और सहपाठियों के चेहरे से दूर रखें।',
        'जलती तीली का परीक्षण बहुत सावधानी से करें; परखनली के अंदर सीधे न झांकें।',
        'अम्ल की बोतलों को माचिस और खुली लपटों से कम से कम 1 मीटर दूर रखें।',
        'अभिक्रिया ऊष्माक्षेपी होती है, इसलिए परखनली को सीधे हाथ से पकड़ने के बजाय स्टैंड पर रखें।',
      ],
      spillGuidance: [
        'अम्ल रिसाव: रेत या सोडियम बाइकार्बोनेट डालकर उदासीन करें, फिर सावधानी से साफ करें।',
        'आग लगने पर: अग्निशामक कंबल या CO₂ अग्निशामक का उपयोग करें।',
      ],
      disposal: [
        'बचे हुए जिंक के टुकड़ों को चिमटी से निकालकर पानी से धोएं और पुनः उपयोग हेतु रखें।',
        'जिंक सल्फेट के अम्लीय घोल को उदासीन करके ही पानी के साथ बहाएं।',
      ],
    },
    mr: {
      ppe: [
        'रासायनिक संरक्षणात्मक गॉगल्स',
        'उष्णतारोधक व रसायनरोधक हातमोजे',
        'सुती लॅब कोट',
        'बंद बूट',
      ],
      hazards: [
        {
          chemical: 'विरल सल्फ्यूरिक आम्ल (1.0 M H₂SO₄)',
          hazard: 'तीव्र आम्ल, त्वचेवर भाजल्यासारख्या जखमा आणि डोळ्यांना इजा करणारे.',
          icon: '⚠️',
        },
        {
          chemical: 'हायड्रोजन वायू (H₂)',
          hazard: 'अत्यंत ज्वलनशील आणि हवेच्या संपर्कात स्फोटक ठरणारा वायू.',
          icon: '🔥',
        },
        {
          chemical: 'दाणेदार जस्त (Zinc Granules)',
          hazard: 'आम्लासोबत वेगाने रासायनिक अभिक्रिया घडवून वायू मुक्त करणारा धातू.',
          icon: '⚡',
        },
      ],
      precautions: [
        'परीक्षानळीचे तोंड नेहमी स्वतःपासून आणि इतरांपासून दूर ठेवा.',
        'काडीने चाचणी करताना नळीच्या तोंडावर थेट पाहू नका; सावधगिरी बाळगा.',
        'आम्लाच्या बाटल्या खुल्या ज्योतीपासून आणि काडेपेटीपासून दूर ठेवा.',
        'अभिक्रिया उष्णता निर्माण करणारी असल्याने परीक्षानळी स्टँडवर ठेवा.',
      ],
      spillGuidance: [
        'आम्ल सांडल्यास: बेकिंग सोडा किंवा कोरडी वाळू टाकून उदासीनीकरण करा आणि पुसा.',
        'आग लागल्यास: फायर ब्लँकेट किंवा CO₂ अग्निशामक वापरा.',
      ],
      disposal: [
        'न विरघळलेले जस्ताचे तुकडे चिमट्याने काढून पाण्याने धुवून पुन्हा वापरण्यासाठी ठेवा.',
        'अम्लीय द्रावण उदासीन करून भरपूर पाण्यासह वाहून जाऊ द्या.',
      ],
    },
  },

  // ── 4. Viscosity by Ostwald Viscometer ──
  'viscosity-ostwald': {
    en: {
      ppe: ['Standard Laboratory Safety Glasses', 'Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Acetone (for capillary drying)',
          hazard: 'Highly flammable volatile liquid and vapor, eye irritant, causes central nervous system drowsiness.',
          icon: '🔥',
        },
        {
          chemical: 'Test Organic Liquid (e.g. Glycerol, Toluene, Ethanol)',
          hazard: 'Flammable vapor hazard, eye and skin defatting irritant.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'NEVER suck liquids up the viscometer capillary by direct mouth suction; use a specialized pipette bulb or rubber aspirator.',
        'The glass capillary is fragile; avoid bending or applying torque on the fragile arm of the U-tube.',
        'Keep acetone away from heaters, hot plates, or open sparks.',
      ],
      spillGuidance: [
        'Solvent Spill: Ventilate the area immediately, wipe with absorbent pads, and dispose of in flammable organic waste bin.',
      ],
      disposal: [
        'Collect organic solvent wastes in designated "Non-Halogenated Flammable Organic Waste" containers.',
        'Distilled water effluent may be safely poured down the sink.',
      ],
    },
    hi: {
      ppe: ['प्रयोगशाला सुरक्षा चश्मा', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'एसीटोन (केशिका सुखाने हेतु)',
          hazard: 'अत्यधिक ज्वलनशील वाष्पशील विलायक, आंखों में जलन, सिरदर्द उत्पन्न कर सकता है।',
          icon: '🔥',
        },
        {
          chemical: 'परीक्षण कार्बनिक द्रव',
          hazard: 'ज्वलनशील वाष्प, त्वचा में सूखापन और आंखों में जलन।',
          icon: '⚠️',
        },
      ],
      precautions: [
        'विस्कोमीटर में द्रव खींचने के लिए मुंह का उपयोग कभी न करें; रबर एस्पिरेटर या बल्ब का उपयोग करें।',
        'कांच की केशिका बहुत नाजुक होती है, उस पर अनावश्यक दबाव न डालें।',
        'एसीटोन को हीटर या खुली चिंगारी से दूर रखें।',
      ],
      spillGuidance: [
        'विलायक रिसाव: कमरे की खिड़कियां तुरंत खोलें, सोखने वाले कपड़े से पोंछें और ज्वलनशील कचरे के डिब्बे में डालें।',
      ],
      disposal: [
        'कार्बनिक विलायकों को "ज्वलनशील कार्बनिक अपशिष्ट" कंटेनर में ही डालें।',
        'आसुत जल को सीधे सिंक में बहाया जा सकता है।',
      ],
    },
    mr: {
      ppe: ['प्रयोगशाळा सुरक्षा गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'ॲसिटोन (नळी वाळवण्यासाठी)',
          hazard: 'अत्यंत ज्वलनशील बाष्पशील विद्रावक; डोळ्यांची जळजळ करणारे.',
          icon: '🔥',
        },
        {
          chemical: 'चाचणी सेंद्रिय द्रव (Organic Liquids)',
          hazard: 'ज्वलनशील बाष्प; त्वचेचा कोरडेपणा आणि जळजळ निर्माण करणारे.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'व्हिस्कोमीटरमध्ये द्रव वर ओढण्यासाठी तोंडाचा वापर कधीही करू नका; रबरी बल्ब वापरा.',
        'काचेची बारीक केशिका अत्यंत नाजूक असते, त्यावर जोर देऊ नका.',
        'ॲसिटोन उष्णतेच्या उपकरणांपासून आणि ठिणग्यांपासून दूर ठेवा.',
      ],
      spillGuidance: [
        'द्रावक सांडल्यास: त्वरित वायुवीजन करा, शोषक कापडाने पुसून सेंद्रिय कचऱ्याच्या डब्यात टाका.',
      ],
      disposal: [
        'सेंद्रिय विद्रावक "ज्वलनशील सेंद्रिय कचरा" या डब्यातच जमा करा.',
        'डिस्टिल्ड वॉटर सिंकमध्ये टाकले तरी चालते.',
      ],
    },
  },

  // ── 5. Water Hardness by EDTA ──
  'water-hardness-edta': {
    en: {
      ppe: ['Chemical Safety Glasses', 'Nitrile Gloves', 'Laboratory Coat', 'Enclosed Shoes'],
      hazards: [
        {
          chemical: 'Ammonia-Ammonium Chloride Buffer (pH 10)',
          hazard: 'Pungent ammoniacal fumes, corrosive to respiratory tract, causes burning of mucous membranes.',
          icon: '⚠️',
        },
        {
          chemical: 'Disodium EDTA Solution (0.01 M)',
          hazard: 'Low acute toxicity; mild irritant on prolonged skin or ocular contact.',
          icon: '🛡️',
        },
        {
          chemical: 'Eriochrome Black T Indicator (EBT)',
          hazard: 'Biological dye powder/solution; stains skin, causes mild eye irritation.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'Dispense ammonia buffer inside a fume cupboard or well-ventilated laboratory bench.',
        'Avoid inhaling vapors when opening the concentrated ammonia buffer bottle.',
        'Add only the specified 2–3 drops of EBT indicator to keep the endpoint sharp.',
      ],
      spillGuidance: [
        'Ammonia Buffer Spill: Neutralize with dilute hydrochloric or citric acid, ventilate bench, and mop with cold water.',
      ],
      disposal: [
        'The neutralized Ca/Mg-EDTA chelate complex has low toxicity and can be rinsed into the drain with running tap water.',
      ],
    },
    hi: {
      ppe: ['रासायनिक सुरक्षा चश्मा', 'नाइट्राइल दस्ताने', 'लैब कोट', 'बंद जूते'],
      hazards: [
        {
          chemical: 'अमोनिया-अमोनियम क्लोराइड बफर (pH 10)',
          hazard: 'तीखी अमोनिया गंध, श्वसन नली के लिए संक्षारक, श्लेष्मा झिल्ली में जलन।',
          icon: '⚠️',
        },
        {
          chemical: 'डाईसोडियम EDTA विलयन (0.01 M)',
          hazard: 'कम विषाक्तता; लंबे समय तक संपर्क में रहने पर त्वचा में हल्की जलन।',
          icon: '🛡️',
        },
        {
          chemical: 'एरियोक्रोम ब्लैक T सूचक (EBT)',
          hazard: 'त्वचा पर दाग छोड़ता है, आंखों में हल्की जलन।',
          icon: '⚠️',
        },
      ],
      precautions: [
        'अमोनिया बफर को अच्छी हवादार जगह पर ही खोलें और मापें।',
        'अमोनिया बफर की तीखी गंध को सीधे सूंघने से बचें।',
        'सूचक की केवल 2-3 बूंदें ही डालें।',
      ],
      spillGuidance: [
        'अमोनिया रिसाव: तनु साइट्रिक अम्ल या हल्के अम्ल से उदासीन करें और ठंडे पानी से पोंछें।',
      ],
      disposal: [
        'EDTA-कैल्शियम जटिल लवणों को पर्याप्त बहते पानी के साथ सिंक में बहाया जा सकता है।',
      ],
    },
    mr: {
      ppe: ['रासायनिक गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट', 'बंद बूट'],
      hazards: [
        {
          chemical: 'अमोनिया-अमोनियम क्लोराईड बफर (pH १०)',
          hazard: 'तीव्र अमोनियाचा वास, श्वसननलिकेला दाहक आणि डोळ्यांची जळजळ करणारा.',
          icon: '⚠️',
        },
        {
          chemical: 'डाईसोडियम EDTA द्रावण (0.01 M)',
          hazard: 'कमी विषारी; त्वचेवर सौम्य जळजळ करू शकते.',
          icon: '🛡️',
        },
        {
          chemical: 'एरियोक्रोम ब्लॅक T दर्शक (EBT)',
          hazard: 'त्वचेवर रंग सोडतो; डोळ्यांना त्रास देऊ शकतो.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'अमोनिया बफर हवा खेळती असलेल्या ठिकाणीच वापरा.',
        'बाटली उघडताना वाफ थेट नाकात जाणार नाही याची काळजी घ्या.',
        'दर्शकाचे फक्त २-३ थेंबच घाला.',
      ],
      spillGuidance: [
        'अमोनिया सांडल्यास: सौम्य सायट्रिक आम्ल किंवा विरल आम्ल टाकून थंड पाण्याने स्वच्छ करा.',
      ],
      disposal: [
        'टायट्रेशन झालेले EDTA द्रावण भरपूर पाण्यासह सिंकमध्ये सोडले जाऊ शकते.',
      ],
    },
  },

  // ── 6. Water Alkalinity ──
  'water-alkalinity': {
    en: {
      ppe: ['Chemical Splash Goggles', 'Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Standard Sulphuric Acid (0.02 N H₂SO₄)',
          hazard: 'Corrosive dilute mineral acid, causes skin burning and severe ocular damage.',
          icon: '⚠️',
        },
        {
          chemical: 'Alkaline Water Sample (OH⁻, CO₃²⁻, HCO₃⁻)',
          hazard: 'Caustic alkaline solution, slippery on touch, irritating to eyes.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'Handle acid titrant with care; use a funnel to fill the burette without airlocks.',
        'Continuous gentle swirling prevents local over-titration and premature color fading.',
      ],
      spillGuidance: [
        'Spills: Neutralize with sodium bicarbonate powder and wipe clean with damp towels.',
      ],
      disposal: [
        'Neutralized titration effluent (pH 6–8) can be flushed into the sink with running water.',
      ],
    },
    hi: {
      ppe: ['रासायनिक स्प्लैश गॉगल्स', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'सल्फ्यूरिक अम्ल (0.02 N H₂SO₄)',
          hazard: 'संक्षारक तनु अम्ल, त्वचा पर जलन और आंखों को नुकसान पहुंचा सकता है।',
          icon: '⚠️',
        },
        {
          chemical: 'क्षारीय जल का नमूना (OH⁻, CO₃²⁻, HCO₃⁻)',
          hazard: 'क्षारीय घोल, छूने पर फिसलनदार, आंखों में जलन।',
          icon: '⚠️',
        },
      ],
      precautions: [
        'अम्ल अनुमापक को सावधानी से संभालें; ब्यूरेट भरते समय कीप (फनल) का उपयोग करें।',
        'अनुमापन के दौरान फ्लास्क को लगातार हल्के हाथ से हिलाते रहें।',
      ],
      spillGuidance: [
        'रिसाव: सोडियम बाइकार्बोनेट डालकर उदासीन करें और पोंछ लें।',
      ],
      disposal: [
        'उदासीन घोल (pH 6-8) को बहते पानी के साथ सिंक में बहाया जा सकता है।',
      ],
    },
    mr: {
      ppe: ['रासायनिक गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'सल्फ्यूरिक आम्ल (0.02 N H₂SO₄)',
          hazard: 'सौम्य दाहक आम्ल, त्वचेची जळजळ आणि डोळ्यांना इजा करणारे.',
          icon: '⚠️',
        },
        {
          chemical: 'अल्कधर्मी पाण्याचा नमुना',
          hazard: 'बुळबुळीत अल्क द्रावण, डोळ्यांसाठी त्रासदायक.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'ब्युरेटमध्ये आम्ल भरताना फनेलचा काळजीपूर्वक वापर करा.',
        'टायट्रेशन करताना शंकूपात्र सतत हलवा जेणेकरून अचूक रंगबदल दिसेल.',
      ],
      spillGuidance: [
        'सांडल्यास: खाण्याचा सोडा टाकून उदासीन करा आणि पुसून घ्या.',
      ],
      disposal: [
        'उदासीन झालेले द्रावण वाहत्या पाण्यासोबत सिंकमध्ये टाका.',
      ],
    },
  },

  // ── 7. Water Acidity ──
  'water-acidity': {
    en: {
      ppe: ['Chemical Safety Goggles', 'Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Sodium Hydroxide Titrant (0.02 N NaOH)',
          hazard: 'Caustic base, irritates skin and eyes, causes slippery chemical burns.',
          icon: '☠️',
        },
        {
          chemical: 'Sodium Thiosulphate (N/10 Na₂S₂O₃)',
          hazard: 'Mild reducing agent; low toxicity.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'Avoid contact with standardized NaOH; wash hands thoroughly after dispensing.',
        'Swirl consistently during dropwise base addition near the phenolphthalein endpoint.',
      ],
      spillGuidance: [
        'Base Spill: Neutralize with dilute boric acid and flush with water.',
      ],
      disposal: [
        'Discharge neutralized aqueous solutions directly to municipal drains with water.',
      ],
    },
    hi: {
      ppe: ['सुरक्षा चश्मा', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'सोडियम हाइड्रॉक्साइड (0.02 N NaOH)',
          hazard: 'क्षारीय संक्षारक, त्वचा और आंखों में गंभीर जलन।',
          icon: '☠️',
        },
        {
          chemical: 'सोडियम थायोसल्फेट (N/10 Na₂S₂O₃)',
          hazard: 'कम विषाक्तता, सुरक्षित अपचायक।',
          icon: '🛡️',
        },
      ],
      precautions: [
        'NaOH के सीधे संपर्क से बचें; काम पूरा होने पर हाथ अच्छी तरह धोएं।',
        'अंतिम बिंदु के पास फ्लास्क को लगातार हिलाएं।',
      ],
      spillGuidance: [
        'क्षार रिसाव: हल्के बोरिक अम्ल से उदासीन करके पानी से धोएं।',
      ],
      disposal: [
        'उदासीन घोल को पानी के साथ सिंक में बहाएं।',
      ],
    },
    mr: {
      ppe: ['सुरक्षा गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'सोडियम हायड्रॉक्साइड (0.02 N NaOH)',
          hazard: 'दाहक अल्क, डोळे आणि त्वचेची जळजळ करणारे.',
          icon: '☠️',
        },
        {
          chemical: 'सोडियम थायोसल्फेट (N/10)',
          hazard: 'कमी विषारी सुरक्षित रसायन.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'NaOH हाताळताना काळजी घ्या; काम झाल्यावर हात स्वच्छ धुवा.',
        'अंतिम बिंदूजवळ शंकूपात्र सतत हलवा.',
      ],
      spillGuidance: [
        'अल्क सांडल्यास: सौम्य बोरिक आम्ल टाकून धुवून घ्या.',
      ],
      disposal: [
        'उदासीन द्रावण भरपूर पाण्यासह सिंकमध्ये सोडले जाऊ शकते.',
      ],
    },
  },

  // ── 8. Chloride Content by Mohr's Method ──
  'chloride-mohr-method': {
    en: {
      ppe: ['Chemical Splash Goggles', 'Nitrile Protective Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Silver Nitrate (0.02 N AgNO₃)',
          hazard: 'Severe oxidizer, causes indelible black silver stains on skin, corrosive to eyes.',
          icon: '☠️',
        },
        {
          chemical: 'Potassium Chromate (5% K₂CrO₄)',
          hazard: 'Toxic oxidizer and recognized carcinogen (H350i, H340); toxic to aquatic organisms.',
          icon: '☠️',
        },
      ],
      precautions: [
        'NEVER allow AgNO₃ to touch bare skin; black metallic silver stains persist for days.',
        'Handle Potassium Chromate with exceptional care; avoid creating aerosols or inhaling dust.',
        'Keep titration flask illuminated against a white tile for rapid detection of red Ag₂CrO₄.',
      ],
      spillGuidance: [
        'Silver Nitrate Spill: Wipe immediately with salt water (NaCl) to precipitate harmless AgCl, then clean with paper towels.',
        'Chromate Spill: Cover with sodium metabisulphite to reduce hexavalent chromium, then mop up into hazardous waste.',
      ],
      disposal: [
        'MANDATORY HEAVY METAL SEGREGATION: Do NOT pour silver or chromium wastes into the sink.',
        'Collect all titrated residues into the labeled "Heavy Metal Waste — Ag / Cr" container for recovery.',
      ],
    },
    hi: {
      ppe: ['रासायनिक स्प्लैश गॉगल्स', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'सिल्वर नाइट्रेट (0.02 N AgNO₃)',
          hazard: 'तीव्र ऑक्सीकारक, त्वचा पर काले जिद्दी दाग छोड़ता है, आंखों के लिए हानिकारक।',
          icon: '☠️',
        },
        {
          chemical: 'पोटेशियम क्रोमेट (5% K₂CrO₄)',
          hazard: 'विषैला ऑक्सीकारक और कैंसरकारी (कार्सिनोजेन) रसायन; जलीय जीवों के लिए विषैला।',
          icon: '☠️',
        },
      ],
      precautions: [
        'सिल्वर नाइट्रेट को सीधे त्वचा पर न लगने दें, यह त्वचा को तुरंत काला कर देता है।',
        'पोटेशियम क्रोमेट को अत्यधिक सावधानी से संभालें; इसकी बूंदों से बचें।',
        'लाल अवक्षेप को तुरंत पहचानने के लिए फ्लास्क के नीचे सफेद टाइल रखें।',
      ],
      spillGuidance: [
        'AgNO₃ रिसाव: तुरंत नमक का पानी (NaCl) डालकर AgCl बनाएं और पोंछ लें।',
        'क्रोमेट रिसाव: सोडियम मेटाबाइसल्फाइट डालकर अवशोषित करें और खतरनाक कचरे में डालें।',
      ],
      disposal: [
        'अनिवार्य: सिल्वर या क्रोमियम युक्त घोल को कभी भी सीधे सिंक में न बहाएं।',
        'सभी अवक्षेप को "भारी धातु अपशिष्ट — Ag / Cr" कंटेनर में ही एकत्र करें।',
      ],
    },
    mr: {
      ppe: ['रासायनिक गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'सिल्व्हर नायट्रेट (0.02 N AgNO₃)',
          hazard: 'त्वचेवर न निघणारे काळे डाग पाडणारे आणि डोळ्यांसाठी अत्यंत दाहक रसायन.',
          icon: '☠️',
        },
        {
          chemical: 'पोटॅशियम क्रोमेट (5% K₂CrO₄)',
          hazard: 'विषारी ऑक्सिडायझर आणि कर्करोगजन्य (कार्सिनोजेन) मानले जाणारे रसायन.',
          icon: '☠️',
        },
      ],
      precautions: [
        'सिल्व्हर नायट्रेट त्वचेला लागणार नाही याची दक्षता घ्या; हातावर काळे डाग पडतात.',
        'पोटॅशियम क्रोमेट अतिशय काळजीपूर्वक वापरा; थेट स्पर्श टाळा.',
        'अंतिम बिंदू अचूक दिसण्यासाठी फ्लास्कखाली पांढरी टाइल ठेवा.',
      ],
      spillGuidance: [
        'AgNO₃ सांडल्यास: मिठाचे पाणी (NaCl) टाकून AgCl चा अवक्षेप बनवा आणि पुसा.',
        'क्रोमेट सांडल्यास: विशेष रासायनिक कचऱ्याच्या डब्यातच गोळा करा.',
      ],
      disposal: [
        'अतिशय महत्त्वाचे: सिल्व्हर किंवा क्रोमियम कचरा कधीही साध्या सिंकमध्ये सोडू नका.',
        '"जड धातू कचरा — Ag / Cr" या विशेष भांड्यातच जमा करा.',
      ],
    },
  },

  // ── 9. Dissolved Oxygen by Winkler's Method ──
  'dissolved-oxygen-winkler': {
    en: {
      ppe: ['Chemical Splash Goggles', 'Heavy Duty Nitrile Gloves', 'Cotton Laboratory Coat'],
      hazards: [
        {
          chemical: 'Concentrated Sulphuric Acid (Conc. H₂SO₄)',
          hazard: 'Severely corrosive, reacts violently with water exothermically, destroys clothing and skin.',
          icon: '⚠️',
        },
        {
          chemical: 'Alkaline Potassium Iodide Reagent',
          hazard: 'Strongly alkaline, corrosive, produces hazardous aerosol mists.',
          icon: '⚠️',
        },
        {
          chemical: 'Manganous Sulphate (MnSO₄)',
          hazard: 'Harmful by ingestion and prolonged skin contact.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'Add Conc. H₂SO₄ down the inner neck of the BOD bottle slowly; never drop directly onto aqueous surface.',
        'Ensure the BOD bottle stopper is seated firmly without trapped air bubbles before inverting.',
      ],
      spillGuidance: [
        'Conc. Acid Spill: Cover with dry sodium bicarbonate powder slowly until fizzing stops, then mop up with wet rags.',
      ],
      disposal: [
        'Titrated solutions containing reduced iodide and tetrathionate may be diluted and flushed with copious water.',
      ],
    },
    hi: {
      ppe: ['रासायनिक स्प्लैश गॉगल्स', 'मजबूत नाइट्रील दस्ताने', 'सूती लैब कोट'],
      hazards: [
        {
          chemical: 'सांद्र सल्फ्यूरिक अम्ल (Conc. H₂SO₄)',
          hazard: 'अत्यधिक संक्षारक, पानी से मिलने पर तीव्र ऊष्मा छोड़ता है, कपड़ों और त्वचा को नष्ट करता है।',
          icon: '⚠️',
        },
        {
          chemical: 'क्षारीय पोटेशियम आयोडाइड अभिकर्मक',
          hazard: 'प्रबल क्षारीय, त्वचा और आंखों के लिए संक्षारक।',
          icon: '⚠️',
        },
        {
          chemical: 'मैंगनस सल्फेट (MnSO₄)',
          hazard: 'निगलने पर हानिकारक, लंबे संपर्क से जलन।',
          icon: '⚠️',
        },
      ],
      precautions: [
        'सांद्र H₂SO₄ को BOD बोतल की गर्दन के सहारे धीरे-धीरे डालें; सीधे ऊपर से न गिराएं।',
        'बोतल को हिलाने से पहले सुनिश्चित करें कि हवा का कोई बुलबुला न हो और कॉर्क कसा हो।',
      ],
      spillGuidance: [
        'सांद्र अम्ल रिसाव: बुदबुदाहट बंद होने तक धीरे-धीरे सोडियम बाइकार्बोनेट डालें और पोंछें।',
      ],
      disposal: [
        'अनुमापित घोल को पानी से तनु करके सिंक में बहाया जा सकता है।',
      ],
    },
    mr: {
      ppe: ['रासायनिक गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'संहत सल्फ्यूरिक आम्ल (Conc. H₂SO₄)',
          hazard: 'अतिशय दाहक, पाण्याशी संपर्क आल्यास तीव्र उष्णता निर्माण करणारे, त्वचेला भाजणारे.',
          icon: '⚠️',
        },
        {
          chemical: 'अल्कलाईन पोटॅशियम आयोडाईड',
          hazard: 'तीव्र अल्कधर्मी आणि डोळ्यांसाठी घातक रसायन.',
          icon: '⚠️',
        },
        {
          chemical: 'मॅंगनीज सल्फेट (MnSO₄)',
          hazard: 'गिळल्यास घातक, त्वचेची जळजळ करणारे.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'संहत सल्फ्यूरिक आम्ल बाटलीच्या मानेवरून हळूच सोडा; थेट मध्यभागी टाकू नका.',
        'BOD बाटलीचे बुच घट्ट बसवूनच बाटली उलटी-पालटी करा.',
      ],
      spillGuidance: [
        'संहत आम्ल सांडल्यास: बेकिंग सोडा हळूहळू टाकून उदासीनीकरण करा आणि पाण्याने धुवा.',
      ],
      disposal: [
        'टायट्रेशन झालेले द्रावण भरपूर पाण्यासह सिंकमध्ये सोडता येते.',
      ],
    },
  },

  // ── 10. Conductometric Titration ──
  'conductometric-titration': {
    en: {
      ppe: ['Safety Goggles', 'Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Hydrochloric Acid (0.1 N HCl)',
          hazard: 'Corrosive acid solution; eye and skin irritant.',
          icon: '⚠️',
        },
        {
          chemical: 'Sodium Hydroxide (0.1 N NaOH)',
          hazard: 'Caustic alkali; slippery and corrosive to skin.',
          icon: '☠️',
        },
      ],
      precautions: [
        'Handle the platinum conductivity cell with extreme care; never touch the delicate platinum black coating.',
        'Rinse the cell thoroughly with conductivity water between runs.',
      ],
      spillGuidance: ['Neutralize spills with sodium bicarbonate or boric acid.'],
      disposal: ['Neutralized effluent can be poured into sink with running tap water.'],
    },
    hi: {
      ppe: ['सुरक्षा चश्मा', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'हाइड्रोक्लोरिक अम्ल (0.1 N HCl)',
          hazard: 'संक्षारक अम्ल घोल; त्वचा और आंखों में जलन।',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हाइड्रॉक्साइड (0.1 N NaOH)',
          hazard: 'क्षारीय संक्षारक; त्वचा के लिए हानिकारक।',
          icon: '☠️',
        },
      ],
      precautions: [
        'प्लैटिनम चालकता सेल को अत्यधिक सावधानी से पकड़ें; प्लैटिनम ब्लैक कोटिंग को हाथ न लगाएं।',
        'उपयोग के बाद सेल को आसुत जल से अच्छी तरह धोएं।',
      ],
      spillGuidance: ['सोडियम बाइकार्बोनेट या बोरिक अम्ल से उदासीन करें।'],
      disposal: ['उदासीन घोल को पानी के साथ सिंक में बहाया जा सकता है।'],
    },
    mr: {
      ppe: ['सुरक्षा गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'हायड्रोक्लोरिक आम्ल (0.1 N HCl)',
          hazard: 'दाहक आम्ल द्रावण; डोळे व त्वचेची जळजळ करणारे.',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हायड्रॉक्साइड (0.1 N NaOH)',
          hazard: 'दाहक अल्क; त्वचेसाठी हानिकारक.',
          icon: '☠️',
        },
      ],
      precautions: [
        'प्लॅटिनम वाहकत्व सेल काळजीपूर्वक हाताळा; आतील कोटिंगला हात लावू नका.',
        'प्रयोगानंतर सेल शुद्ध पाण्याने स्वच्छ धुवा.',
      ],
      spillGuidance: ['बेकिंग सोडा किंवा बोरिक आम्लाने उदासीन करा.'],
      disposal: ['उदासीन द्रावण भरपूर पाण्यासह सिंकमध्ये टाका.'],
    },
  },

  // ── 11. pH-Metric Titration ──
  'ph-metric-titration': {
    en: {
      ppe: ['Safety Glasses', 'Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Hydrochloric Acid (0.1 M HCl)',
          hazard: 'Skin and eye irritant, acidic vapors.',
          icon: '⚠️',
        },
        {
          chemical: 'Sodium Hydroxide (0.1 M NaOH)',
          hazard: 'Caustic base, causes skin burns.',
          icon: '☠️',
        },
        {
          chemical: 'Standard Buffer Solutions (pH 4.00, pH 9.20)',
          hazard: 'Non-hazardous aqueous buffer salts.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'The fragile glass bulb of the pH electrode breaks easily; never drop the magnetic stir bar onto the bulb.',
        'Keep the electrode bulb immersed in distilled water or 3 M KCl storage solution when idle.',
      ],
      spillGuidance: ['Wipe acid/base spills with neutralizing absorbent towels.'],
      disposal: ['Neutralized titration mixtures may be washed into standard laboratory drainage.'],
    },
    hi: {
      ppe: ['सुरक्षा चश्मा', 'नाइट्राइल दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'हाइड्रोक्लोरिक अम्ल (0.1 M HCl)',
          hazard: 'त्वचा और आंखों में जलन पैदा करने वाला अम्ल।',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हाइड्रॉक्साइड (0.1 M NaOH)',
          hazard: 'क्षारीय संक्षारक, त्वचा पर जलन।',
          icon: '☠️',
        },
        {
          chemical: 'मानक बफर विलयन (pH 4.00, pH 9.20)',
          hazard: 'सुरक्षित अहानिकर बफर लवण।',
          icon: '🛡️',
        },
      ],
      precautions: [
        'pH इलेक्ट्रोड का कांच का बल्ब बहुत नाजुक होता है; चुंबकीय स्टिरर को बल्ब से टकराने न दें।',
        'काम न होने पर इलेक्ट्रोड बल्ब को हमेशा आसुत जल या KCl घोल में डुबो कर रखें।',
      ],
      spillGuidance: ['सोडियम बाइकार्बोनेट या पानी से साफ करें।'],
      disposal: ['उदासीन घोल को सिंक में बहाएं।'],
    },
    mr: {
      ppe: ['सुरक्षा गॉगल्स', 'नायट्रिल हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'हायड्रोक्लोरिक आम्ल (0.1 M HCl)',
          hazard: 'त्वचा आणि डोळ्यांची जळजळ करणारे आम्ल.',
          icon: '⚠️',
        },
        {
          chemical: 'सोडियम हायड्रॉक्साइड (0.1 M NaOH)',
          hazard: 'दाहक अल्क; त्वचेसाठी हानिकारक.',
          icon: '☠️',
        },
        {
          chemical: 'मानक बफर द्रावणे (pH ४.००, ९.२०)',
          hazard: 'अहानिकारक सुरक्षित बफर लवण.',
          icon: '🛡️',
        },
      ],
      precautions: [
        'pH इलेक्ट्रोडचा काचेचा बल्ब नाजूक असतो; मॅग्नेटिक स्टिरर त्यावर आदळू देऊ नका.',
        'वापरात नसताना इलेक्ट्रोड डिस्टिल्ड पाण्यात किंवा KCl द्रावणात बुडवून ठेवा.',
      ],
      spillGuidance: ['उदासीनीकरण करून कापडाने पुसा.'],
      disposal: ['उदासीन द्रावण सिंकमध्ये टाकून द्या.'],
    },
  },

  // ── 12. Acid Value of Vegetable Oil ──
  'acid-value-oil': {
    en: {
      ppe: ['Chemical Splash Goggles', 'Solvent Resistant Nitrile Gloves', 'Laboratory Coat'],
      hazards: [
        {
          chemical: 'Neutral Ethyl Alcohol (Ethanol 95%)',
          hazard: 'Highly flammable liquid and vapor, eye irritant.',
          icon: '🔥',
        },
        {
          chemical: 'Potassium Hydroxide in Alcohol (0.1 N KOH)',
          hazard: 'Corrosive and flammable caustic solution, causes severe eye burns.',
          icon: '☠️',
        },
      ],
      precautions: [
        'Warm the ethanol-oil mixture ONLY on a closed water bath; NEVER heat alcohol over an open flame.',
        'Keep alcohol reagent bottles tightly capped when not in use to avoid explosive vapor accumulation.',
      ],
      spillGuidance: [
        'Alcohol Spill: Eliminate ignition sources, ventilate area, absorb with paper towels, and place in metal flammable waste can.',
      ],
      disposal: [
        'Collect organic oil-alcohol waste mixtures in the "Non-Halogenated Solvent Waste" drum.',
      ],
    },
    hi: {
      ppe: ['रासायनिक स्प्लैश गॉगल्स', 'विलायक प्रतिरोधी दस्ताने', 'लैब कोट'],
      hazards: [
        {
          chemical: 'उदासीन एथिल अल्कोहल (एथेनॉल 95%)',
          hazard: 'अत्यधिक ज्वलनशील तरल और वाष्प, आंखों में जलन।',
          icon: '🔥',
        },
        {
          chemical: 'पोटेशियम हाइड्रॉक्साइड (0.1 N KOH)',
          hazard: 'संक्षारक एवं ज्वलनशील क्षारीय घोल, आंखों को गंभीर नुकसान।',
          icon: '☠️',
        },
      ],
      precautions: [
        'अल्कोहल और तेल के मिश्रण को केवल जल कुंड (Water Bath) में ही गर्म करें; खुली आग पर कभी न रखें।',
        'अल्कोहल की बोतल को हमेशा कसकर बंद रखें ताकि वाष्प न फैले।',
      ],
      spillGuidance: [
        'अल्कोहल रिसाव: आग के स्रोतों को तुरंत बुझाएं, खिड़कियां खोलें और सोखने वाले कपड़े से पोंछें।',
      ],
      disposal: [
        'तेल और अल्कोहल के घोल को "कार्बनिक विलायक अपशिष्ट" कंटेनर में ही डालें।',
      ],
    },
    mr: {
      ppe: ['रासायनिक गॉगल्स', 'विद्रावक-प्रतिरोधक हातमोजे', 'लॅब कोट'],
      hazards: [
        {
          chemical: 'न्यूट्रल इथाईल अल्कोहोल (९५% इथेनॉल)',
          hazard: 'अत्यंत ज्वलनशील द्रव आणि बाष्प; डोळ्यांची जळजळ करणारे.',
          icon: '🔥',
        },
        {
          chemical: 'पोटॅशियम हायड्रॉक्साइड (0.1 N KOH)',
          hazard: 'दाहक आणि ज्वलनशील अल्क द्रावण; डोळ्यांसाठी अत्यंत घातक.',
          icon: '☠️',
        },
      ],
      precautions: [
        'अल्कोहोल-तेल मिश्रण फक्त वॉटर बाथवर कोमट करा; उघड्या आगीवर कधीही गरम करू नका.',
        'अल्कोहोलची बाटली नेहमी घट्ट बंद ठेवा जेणेकरून वाफ पसरणार नाही.',
      ],
      spillGuidance: [
        'अल्कोहोल सांडल्यास: त्वरित ज्योती विझवा, हवा खेळती करा आणि शोषक कागदाने पुसा.',
      ],
      disposal: [
        'तेल व अल्कोहोलचे द्रावण "सेंद्रिय कचरा" कंटेनरमध्ये जमा करा.',
      ],
    },
  },
};

/**
 * Retrieve localized safety information for an experiment.
 * Falls back safely to general chemistry lab safety if specific config is absent.
 */
export function getExperimentSafetyInfo(
  experimentId: string,
  lang: Language
): LocalizedSafetyProfile {
  const expData = EXPERIMENT_SAFETY_DATA[experimentId];
  if (expData && expData[lang]) {
    return expData[lang];
  }
  if (expData && expData['en']) {
    return expData['en'];
  }

  // General fallback safety profile
  const fallbackProfiles: Record<Language, LocalizedSafetyProfile> = {
    en: {
      ppe: [
        'Standard Laboratory Safety Glasses',
        'Protective Nitrile Gloves',
        'Cotton Laboratory Coat',
        'Enclosed Shoes',
      ],
      hazards: [
        {
          chemical: 'Laboratory Reagents',
          hazard: 'Always treat unknown chemicals as potentially hazardous and corrosive.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'Check glassware for chips and cracks before assembly.',
        'Never pipette liquids by mouth; use an appropriate safety aspirator.',
        'Wash hands thoroughly before leaving the laboratory.',
      ],
      spillGuidance: [
        'Notify your laboratory instructor immediately upon any chemical breakage or spill.',
        'Flush skin contact areas with running water for 15 minutes.',
      ],
      disposal: [
        'Dispose of chemical residues into designated laboratory waste containers as directed.',
      ],
    },
    hi: {
      ppe: [
        'मानक प्रयोगशाला सुरक्षा चश्मा',
        'सुरक्षात्मक नाइट्रील दस्ताने',
        'सूती प्रयोगशाला कोट (लैब कोट)',
        'बंद जूते',
      ],
      hazards: [
        {
          chemical: 'प्रयोगशाला अभिकर्मक',
          hazard: 'सभी रसायनों को संभावित रूप से संक्षारक मानकर सावधानी से कार्य करें।',
          icon: '⚠️',
        },
      ],
      precautions: [
        'उपकरण लगाने से पहले कांच के बर्तनों में दरारों की जांच करें।',
        'मुंह से कभी पिपेट न करें; रबर बल्ब का उपयोग करें।',
        'प्रयोगशाला छोड़ने से पहले हाथ अच्छी तरह साबुन से धोएं।',
      ],
      spillGuidance: [
        'रसायन गिरने या कांच टूटने पर तुरंत अपने शिक्षक को सूचित करें।',
        'त्वचा पर गिरने पर 15 मिनट तक बहते पानी से धोएं।',
      ],
      disposal: [
        'रसायनों को शिक्षक के निर्देशानुसार निर्दिष्ट अपशिष्ट पात्रों में ही डालें।',
      ],
    },
    mr: {
      ppe: [
        'मानक प्रयोगशाळा सुरक्षा गॉगल्स',
        'नायट्रिल संरक्षणात्मक हातमोजे',
        'सुती लॅब कोट',
        'बंद बूट',
      ],
      hazards: [
        {
          chemical: 'प्रयोगशाळा रसायने',
          hazard: 'सर्व रसायने काळजीपूर्वक व सावधगिरीने हाताळा.',
          icon: '⚠️',
        },
      ],
      precautions: [
        'काचेची भांडी वापरण्यापूर्वी तडे नाहीत ना याची खात्री करा.',
        'तोंडाने कधीही पिपेट करू नका; रबरी बल्ब वापरा.',
        'प्रयोगशाळेबाहेर पडण्यापूर्वी हात स्वच्छ धुवा.',
      ],
      spillGuidance: [
        'काच फुटल्यास किंवा रसायन सांडल्यास त्वरित शिक्षकांना सांगा.',
        'त्वचेवर पडल्यास १५ मिनिटे वाहत्या पाण्याखाली स्वच्छ धुवा.',
      ],
      disposal: [
        'रासायनिक कचरा नियुक्त केलेल्या डब्यातच जमा करा.',
      ],
    },
  };

  return fallbackProfiles[lang] || fallbackProfiles['en'];
}
