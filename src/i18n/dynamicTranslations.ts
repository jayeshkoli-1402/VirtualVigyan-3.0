import type { Language } from './types';

/**
 * Dynamic string localization lookup.
 * Translates generated mistake strings, validation messages, and chemical alerts into Hindi & Marathi
 * without altering internal state machines or validation logic.
 */
const DYNAMIC_MESSAGES: Record<string, Record<Exclude<Language, 'en'>, string>> = {
  // Apparatus & drop zone validation
  "That doesn't go there — try the burette here.": {
    hi: 'यह वहां नहीं जाता — यहां ब्यूरेट लगाने का प्रयास करें।',
    mr: 'हे तिथे बसत नाही — येथे ब्युरेट लावण्याचा प्रयत्न करा.',
  },
  "That doesn't go there — the conical flask goes on the base.": {
    hi: 'यह वहां नहीं जाता — शंक्वाकार फ्लास्क आधार (base) पर रखा जाता है।',
    mr: 'हे तिथे बसत नाही — कॉनिकल फ्लास्क स्टँडच्या तळाशी (base) ठेवला जातो.',
  },
  'Place the HCl Stock bottle here on the bench first.': {
    hi: 'पहले HCl स्टॉक बोतल को यहां बेंच पर रखें।',
    mr: 'प्रथम HCl स्टॉक बाटली येथे बेंचवर ठेवा.',
  },
  'Only the pipette or indicator bottle can be used on the flask.': {
    hi: 'फ्लास्क पर केवल पिपेट या सूचक (इंडिकेटर) की बोतल का उपयोग किया जा सकता है।',
    mr: 'फ्लास्कवर फक्त पिपेट किंवा दर्शक (इंडिकेटर) बाटली वापरली जाऊ शकते.',
  },
  'Only the NaOH bottle can be used to fill the burette.': {
    hi: 'ब्यूरेट भरने के लिए केवल NaOH की बोतल का उपयोग किया जा सकता है।',
    mr: 'ब्युरेट भरण्यासाठी फक्त NaOH बाटली वापरली जाऊ शकते.',
  },
  'Drag the pipette here to draw acid.': {
    hi: 'अम्ल खींचने के लिए पिपेट को यहां खींचें।',
    mr: 'आम्ल ओढण्यासाठी पिपेट येथे आणा.',
  },
  "That item doesn't belong there.": {
    hi: 'वह वस्तु वहां नहीं रखी जा सकती।',
    mr: 'ती वस्तू तिथे ठेवता येत नाही.',
  },
  "That's not a valid drop zone.": {
    hi: 'यह एक मान्य स्थान नहीं है।',
    mr: 'हे योग्य स्थान नाही.',
  },
  'Place the HCl Stock bottle on the lab bench first before drawing with the pipette.': {
    hi: 'पिपेट से अम्ल खींचने से पहले HCl स्टॉक बोतल को लैब बेंच पर रखें।',
    mr: 'पिपेटने आम्ल ओढण्यापूर्वी HCl स्टॉक बाटली लॅब बेंचवर ठेवा.',
  },
  'Draw liquid into the pipette first — drag it to the HCl bottle and press to fill.': {
    hi: 'पहले पिपेट में द्रव भरें — इसे HCl बोतल पर खींचें और भरने के लिए छोड़ें।',
    mr: 'प्रथम पिपेटमध्ये द्रव भरा — ते HCl बाटलीवर ड्रॅग करा आणि भरण्यासाठी सोडा.',
  },
  'Pipette is already filled with 25 mL acid.': {
    hi: 'पिपेट पहले से ही 25 mL अम्ल से भरा हुआ है।',
    mr: 'पिपेट आधीच 25 mL आम्लाने भरलेले आहे.',
  },
  'Fill the burette with NaOH solution before beginning titration.': {
    hi: 'अनुमापन शुरू करने से पहले ब्यूरेट को NaOH विलयन से भरें।',
    mr: 'टायट्रेशन सुरू करण्यापूर्वी ब्युरेट NaOH द्रावणाने भरा.',
  },
  'No colour change has been observed yet — keep titrating until you see a colour shift.': {
    hi: 'अभी तक कोई रंग परिवर्तन नहीं देखा गया है — रंग बदलने तक अनुमापन जारी रखें।',
    mr: 'अद्याप कोणताही रंग बदल झालेला नाही — रंग बदलेपर्यंत टायट्रेशन सुरू ठेवा.',
  },
  'Volume added is far beyond equivalence! The endpoint was overshot.': {
    hi: 'जोड़ी गई मात्रा तुल्यता बिंदु से बहुत अधिक है! अंतिम बिंदु पार हो गया है।',
    mr: 'मिळवलेले प्रमाण समतुल्यतेपेक्षा खूप जास्त आहे! अंतिम बिंदू ओलांडला गेला आहे.',
  },
  'The burette stopcock is currently closed. Rotate the tap to begin liquid flow.': {
    hi: 'ब्यूरेट का स्टॉपकॉक वर्तमान में बंद है। द्रव प्रवाह शुरू करने के लिए नल घुमाएं।',
    mr: 'ब्युरेटचा स्टॉपकॉक सध्या बंद आहे. द्रव प्रवाह सुरू करण्यासाठी नळ फिरवा.',
  },

  // Conservation of Mass dynamic feedback
  'Place the Conical Flask on the bench first before pouring solutions.': {
    hi: 'घोल डालने से पहले शंक्वाकार फ्लास्क को बेंच पर रखें।',
    mr: 'द्रावण ओतण्यापूर्वी कॉनिकल फ्लास्क बेंचवर ठेवा.',
  },
  'Place the Ignition Tube on the stand before filling it with BaCl₂.': {
    hi: 'BaCl₂ भरने से पहले ज्वलन नली (इग्निशन ट्यूब) को स्टैंड पर रखें।',
    mr: 'BaCl₂ भरण्यापूर्वी ज्वलन नळी (इग्निशन ट्यूब) स्टँडवर ठेवा.',
  },
  'Fill the Ignition Tube with BaCl₂ solution before suspending it in the flask.': {
    hi: 'फ्लास्क में लटकाने से पहले ज्वलन नली को BaCl₂ घोल से भरें।',
    mr: 'फ्लास्कमध्ये लटकवण्यापूर्वी ज्वलन नळी BaCl₂ द्रावणाने भरा.',
  },
  'Suspend the filled Ignition Tube in the flask before sealing with the cork.': {
    hi: 'कॉर्क से सील करने से पहले भरी हुई ज्वलन नली को फ्लास्क में सावधानी से लटकाएं।',
    mr: 'कॉर्कने बंद करण्यापूर्वी भरलेली ज्वलन नळी फ्लास्कमध्ये काळजीपूर्वक लटकवा.',
  },
  'Seal the flask with the rubber cork before recording initial mass.': {
    hi: 'प्रारंभिक द्रव्यमान रिकॉर्ड करने से पहले फ्लास्क को रबर कॉर्क से सील करें।',
    mr: 'प्रारंभिक वस्तुमान नोंदवण्यापूर्वी फ्लास्क रबर कॉर्कने हवाबंद करा.',
  },
  'Record the initial mass on the balance before mixing the reactants.': {
    hi: 'अभिकारकों को मिलाने से पहले डिजिटल तराजू पर प्रारंभिक द्रव्यमान रिकॉर्ड करें।',
    mr: 'अभिक्रियाकारक मिसळण्यापूर्वी डिजिटल काट्यावर प्रारंभिक वस्तुमान नोंदवा.',
  },
  'Observe the precipitation reaction before taking the final mass.': {
    hi: 'अंतिम द्रव्यमान लेने से पहले अवक्षेपण अभिक्रिया का निरीक्षण करें।',
    mr: 'अंतिम वस्तुमान मोजण्यापूर्वी अवक्षेपण अभिक्रियेचे निरीक्षण करा.',
  },
  'Record the final mass on the balance before proceeding to calculations.': {
    hi: 'गणना पर आगे बढ़ने से पहले तराजू पर अंतिम द्रव्यमान रिकॉर्ड करें।',
    mr: 'गणनेकडे जाण्यापूर्वी डिजिटल काट्यावर अंतिम वस्तुमान नोंदवा.',
  },
  'This item cannot be placed here.': {
    hi: 'इस वस्तु को यहां नहीं रखा जा सकता।',
    mr: 'ही वस्तू येथे ठेवता येत नाही.',
  },

  // Reaction banners
  'Reaction Active • Vigorous Effervescence': {
    hi: 'अभिक्रिया सक्रिय • तीव्र बुदबुदाहट (झाग)',
    mr: 'अभिक्रिया सुरू आहे • तीव्र बुडबुडे',
  },
  'H₂ gas bubbles are rapidly evolving. Zinc dissolves forming ZnSO₄ solution.': {
    hi: 'H₂ गैस के बुलबुले तेजी से निकल रहे हैं। जिंक घुलकर ZnSO₄ घोल बना रहा है।',
    mr: 'H₂ वायूचे बुडबुडे वेगाने बाहेर पडत आहेत. जस्त विरघळून ZnSO₄ चे द्रावण तयार होत आहे.',
  },
  'POP Sound Observed • H₂ Gas Confirmed!': {
    hi: 'पॉप ध्वनि प्रेक्षित • H₂ गैस की पुष्टि हुई!',
    mr: 'पॉप आवाज ऐकू आला • H₂ वायूची खात्री झाली!',
  },
  'Hydrogen burns rapidly with a characteristic pop sound.': {
    hi: 'हाइड्रोजन अपनी विशिष्ट पॉप ध्वनि के साथ तेजी से जलती है।',
    mr: 'हायड्रोजन आपल्या वैशिष्ट्यपूर्ण पॉप आवाजासह वेगाने जळतो.',
  },
  'Viscometer Cleaned & Dried': {
    hi: 'विस्कोमीटर साफ और सुखाया गया',
    mr: 'व्हिस्कोमीटर स्वच्छ आणि सुकवला गेला',
  },
  'Chromic Acid Wash': {
    hi: 'क्रोमिक अम्ल द्वारा सफाई',
    mr: 'क्रोमिक आम्लाने धुणे',
  },
  'Ready For Acetone Rinse': {
    hi: 'एसीटोन से धोने के लिए तैयार',
    mr: 'अॅसिटोनने धुण्यासाठी तयार',
  },
  'Viscometer is thoroughly cleaned, dry, and ready for test liquid introduction.': {
    hi: 'विस्कोमीटर पूरी तरह से साफ, सूखा और परीक्षण द्रव डालने के लिए तैयार है।',
    mr: 'व्हिस्कोमीटर पूर्णपणे स्वच्छ, कोरडा आणि चाचणी द्रव टाकण्यासाठी तयार आहे.',
  },
  'Viscometer washed with chromic acid. Click below to drain it into the waste jar.': {
    hi: 'विस्कोमीटर को क्रोमिक अम्ल से धोया गया। इसे अपशिष्ट जार में निकालने के लिए नीचे क्लिक करें।',
    mr: 'व्हिस्कोमीटर क्रोमिक आम्लाने धुतला. कचरा भांड्यात काढण्यासाठी खाली क्लिक करा.',
  },
  'Chromic acid drained! Now pour Acetone into the broad limb to rinse and dry completely.': {
    hi: 'क्रोमिक अम्ल निकाल दिया गया! अब पूरी तरह सुखाने के लिए चौड़ी नली में एसीटोन डालें।',
    mr: 'क्रोमिक आम्ल काढले गेले! आता पूर्णपणे सुकवण्यासाठी रुंद नळीमध्ये अॅसिटोन टाका.',
  },
  'Capillary Flow Active • Stopwatch Running': {
    hi: 'केशिका प्रवाह सक्रिय • स्टॉपवॉच चालू है',
    mr: 'केशिका प्रवाह सुरू • स्टॉपवॉच चालू आहे',
  },
  'Viscometer Flow Measurement': {
    hi: 'विस्कोमीटर प्रवाह मापन',
    mr: 'व्हिस्कोमीटर प्रवाह मापन',
  },
  'Liquid A ready above Mark C. Start the stopwatch to begin timing.': {
    hi: 'द्रव A चिह्न C के ऊपर तैयार है। समय मापना शुरू करने के लिए स्टॉपवॉच चालू करें।',
    mr: 'द्रव A खूण C च्या वर तयार आहे. वेळ मोजण्यासाठी स्टॉपवॉच सुरू करा.',
  },
  'Water ready above Mark C. Start the stopwatch to begin timing.': {
    hi: 'आसुत जल चिह्न C के ऊपर तैयार है। समय मापना शुरू करने के लिए स्टॉपवॉच चालू करें।',
    mr: 'डिस्टिल्ड पाणी खूण C च्या वर तयार आहे. वेळ मोजण्यासाठी स्टॉपवॉच सुरू करा.',
  },
  'Drain Liquid A from viscometer before introducing distilled water.': {
    hi: 'आसुत जल डालने से पहले विस्कोमीटर से द्रव A को निकालें।',
    mr: 'डिस्टिल्ड पाणी टाकण्यापूर्वी व्हिस्कोमीटरमधून द्रव A बाहेर काढा.',
  },
  'Introduce distilled water into the broad limb.': {
    hi: 'चौड़ी नली में आसुत जल डालें।',
    mr: 'रुंद नळीमध्ये डिस्टिल्ड पाणी टाका.',
  },
  'Attach suction tube to capillary limb to draw water above Mark C.': {
    hi: 'पानी को चिह्न C के ऊपर खींचने के लिए केशिका नली पर सक्शन ट्यूब लगाएं।',
    mr: 'पाणी खूण C च्या वर ओढण्यासाठी केशिका नळीला सक्शन ट्यूब जोडा.',
  },
  'Start shaking / swirling the flask before titration.': {
    hi: 'अनुमापन से पहले फ्लास्क को हिलाना शुरू करें।',
    mr: 'टायट्रेशन करण्यापूर्वी फ्लास्क हलवणे सुरू करा.',
  },
  'Fill the Ignition Tube with BaCl₂ solution first before placing it in the flask.': {
    hi: 'फ्लास्क में रखने से पहले ज्वलन नली को BaCl₂ घोल से भरें।',
    mr: 'फ्लास्कमध्ये ठेवण्यापूर्वी ज्वलन नळी BaCl₂ द्रावणाने भरा.',
  },
  'Pour Na₂SO₄ solution into the flask first before suspending the tube.': {
    hi: 'नली लटकाने से पहले फ्लास्क में Na₂SO₄ का घोल डालें।',
    mr: 'नळी लटकवण्यापूर्वी फ्लास्कमध्ये Na₂SO₄ चे द्रावण ओता.',
  },
  'Suspend the filled Ignition Tube inside the flask before sealing.': {
    hi: 'सील करने से पहले भरी हुई ज्वलन नली को फ्लास्क के अंदर लटकाएं।',
    mr: 'हवाबंद करण्यापूर्वी भरलेली ज्वलन नळी फ्लास्कच्या आत लटकवा.',
  },
  'Seal the flask with the Rubber Cork before recording M₁. The system must be closed to verify mass conservation.': {
    hi: 'M₁ रिकॉर्ड करने से पहले फ्लास्क को रबर कॉर्क से सील करें। द्रव्यमान संरक्षण सत्यापित करने के लिए प्रणाली बंद होनी चाहिए।',
    mr: 'M₁ नोंदवण्यापूर्वी फ्लास्क रबर कॉर्कने हवाबंद करा. वस्तुमान संवर्धन पडताळण्यासाठी प्रणाली बंद असणे आवश्यक आहे.',
  },
  'Open System Warning: Flask must be hermetically corked to prevent mass exchange.': {
    hi: 'खुली प्रणाली चेतावनी: द्रव्यमान आदान-प्रदान रोकने के लिए फ्लास्क को कॉर्क से पूरी तरह सील किया जाना चाहिए।',
    mr: 'उघडी प्रणाली चेतावणी: वस्तुमानाची देवाणघेवाण रोखण्यासाठी फ्लास्क पूर्णपणे हवाबंद असणे आवश्यक आहे.',
  },
  'Observe the white precipitate formation before proceeding to record M₂.': {
    hi: 'M₂ रिकॉर्ड करने से पहले सफेद अवक्षेप के निर्माण का निरीक्षण करें।',
    mr: 'M₂ नोंदवण्यापूर्वी पांढऱ्या अवक्षेपाच्या निर्मितीचे निरीक्षण करा.',
  },

  // Apparatus & drop zone names
  'Conical Flask': { hi: 'शंक्वाकार फ्लास्क', mr: 'शंक्वाकार फ्लास्क' },
  'Ignition Tube': { hi: 'इग्निशन ट्यूब', mr: 'इग्निशन ट्यूब' },
  'Burette Stand': { hi: 'ब्यूरेट स्टैंड', mr: 'ब्युरेट स्टँड' },
  'Burette': { hi: 'ब्यूरेट', mr: 'ब्युरेट' },
  '50 mL Calibrated Burette': { hi: '50 mL कैलिब्रेटेड ब्यूरेट', mr: '50 mL कॅलिब्रेटेड ब्युरेट' },
  '50 mL Burette': { hi: '50 mL ब्यूरेट', mr: '50 mL ब्युरेट' },
  'Measuring Cylinder': { hi: 'मापक सिलेंडर', mr: 'मापक दंडगोलाकार भांडे' },
  '50 mL Measuring Cylinder': { hi: '50 mL मापक सिलेंडर', mr: '50 mL मापक दंडगोलाकार भांडे' },
  '100 mL Measuring Cylinder': { hi: '100 mL मापक सिलेंडर', mr: '100 mL मापक दंडगोलाकार भांडे' },
  'Digital Balance': { hi: 'डिजिटल तराजू', mr: 'डिजिटल वजनकाटा' },
  'Digital Analytical Balance': { hi: 'डिजिटल विश्लेषणात्मक तराजू', mr: 'डिजिटल विश्लेषणात्मक वजनकाटा' },
  'Analytical Balance': { hi: 'विश्लेषणात्मक तराजू', mr: 'विश्लेषणात्मक वजनकाटा' },
  'Rubber Cork': { hi: 'रबर कॉर्क', mr: 'रबर कॉर्क' },
  'Pipette': { hi: 'पिपेट', mr: 'पिपेट' },
  'HCl Stock': { hi: 'HCl स्टॉक', mr: 'HCl साठा' },
  'NaOH Reagent': { hi: 'NaOH अभिकर्मक', mr: 'NaOH अभिक्रियाकारक' },
  'Phenolphthalein': { hi: 'फेनोल्फथलीन', mr: 'फेनॉल्फथलीन' },
  'Phenolphthalein Indicator': { hi: 'फेनोल्फथलीन सूचक', mr: 'फेनॉल्फथलीन दर्शक' },
  'Phenol': { hi: 'फेनॉल', mr: 'फेनॉल' },
  'Methyl Orange': { hi: 'मिथाइल ऑरेंज', mr: 'मिथाईल ऑरेंज' },
  'Methyl Orange Indicator': { hi: 'मिथाइल ऑरेंज सूचक', mr: 'मिथाईल ऑरेंज दर्शक' },
  'MO': { hi: 'मिथाइल ऑरेंज', mr: 'मिथाईल ऑरेंज' },
  'Viscometer': { hi: 'विस्कोमीटर', mr: 'व्हिस्कोमीटर' },
  'Stopwatch': { hi: 'स्टॉपवॉच', mr: 'स्टॉपवॉच' },
  'Specific Gravity Bottle': { hi: 'विशिष्ट गुरुत्व बोतल', mr: 'विशिष्ट गुरुत्व बाटली' },
  'Chromic Acid': { hi: 'क्रोमिक अम्ल', mr: 'क्रोमिक आम्ल' },
  'Acetone': { hi: 'एसीटोन', mr: 'अॅसिटोन' },
  'Distilled Water': { hi: 'आसुत जल', mr: 'डिस्टिल्ड पाणी' },
  'Test Liquid A': { hi: 'परीक्षण द्रव A', mr: 'चाचणी द्रव A' },
  'Test Tube': { hi: 'परखनली', mr: 'परीक्षानळी' },
  'Zinc Granules': { hi: 'जिंक के दाने', mr: 'जस्ताचे तुकडे' },
  'Dilute H₂SO₄': { hi: 'तनु H₂SO₄', mr: 'विरल H₂SO₄' },
  'Burning Splinter': { hi: 'जलती हुई तीली', mr: 'जळती काडी' },
  'Hard Water Sample': { hi: 'कठोर जल नमूना', mr: 'कठीण पाण्याचा नमुना' },
  '50 mL Hard Water Sample': { hi: '50 mL कठोर जल नमूना', mr: '50 mL कठीण पाण्याचा नमुना' },
  '100 mL Water Sample': { hi: '100 mL जल नमूना', mr: '100 mL पाण्याचा नमुना' },
  'Water Sample (250 mL)': { hi: 'जल नमूना (250 mL)', mr: 'पाण्याचा नमुना (250 mL)' },
  'Alkaline H₂O': { hi: 'क्षारीय जल', mr: 'अल्कलाईन पाणी' },
  'River H₂O': { hi: 'नदी का जल', mr: 'नदीचे पाणी' },
  'Sample': { hi: 'नमूना', mr: 'नमुना' },
  'EDTA Solution': { hi: 'EDTA घोल', mr: 'EDTA द्रावण' },
  '0.01 M Standard EDTA Titrant': { hi: '0.01 M मानक EDTA अनुमापक', mr: '0.01 M प्रमाणित EDTA टायट्रंट' },
  '0.01 M EDTA': { hi: '0.01 M EDTA', mr: '0.01 M EDTA' },
  'EBT Indicator': { hi: 'EBT सूचक', mr: 'EBT दर्शक' },
  'Eriochrome Black T (EBT)': { hi: 'एरिओक्रोम ब्लैक T (EBT)', mr: 'एरिओक्रोम ब्लॅक T (EBT)' },
  'EBT': { hi: 'EBT', mr: 'EBT' },
  'Ammonia Buffer': { hi: 'अमोनिया बफर', mr: 'अमोनिया बफर' },
  'pH 10 Buffer (NH₄OH/NH₄Cl)': { hi: 'pH 10 बफर (NH₄OH/NH₄Cl)', mr: 'pH 10 बफर (NH₄OH/NH₄Cl)' },
  'pH 10 Buf': { hi: 'pH 10 बफर', mr: 'pH 10 बफर' },
  'Standard CaCl₂ (50 mL)': { hi: 'मानक CaCl₂ (50 mL)', mr: 'प्रमाणित CaCl₂ (50 mL)' },
  'Std CaCl₂': { hi: 'मानक CaCl₂', mr: 'प्रमाणित CaCl₂' },
  'Wash Bottle (Distilled Water)': { hi: 'वॉश बॉटल (आसुत जल)', mr: 'वॉश बॉटल (डिस्टिल्ड पाणी)' },
  'Wash Bottle (Distilled H₂O)': { hi: 'वॉश बॉटल (आसुत H₂O)', mr: 'वॉश बॉटल (डिस्टिल्ड H₂O)' },
  'Bunsen Burner (Boil Sample)': { hi: 'बुन्सेन बर्नर (नमूना उबालें)', mr: 'बुन्सेन बर्नर (नमुना उकळवा)' },
  'Tripod Stand & Wire Gauze': { hi: 'ट्राइपॉड स्टैंड और तार की जाली', mr: 'ट्रायपॉड स्टँड आणि तारेची जाळी' },
  'Tripod & Gauze': { hi: 'ट्राइपॉड और जाली', mr: 'ट्रायपॉड आणि जाळी' },
  'Burner': { hi: 'बर्नर', mr: 'बर्नर' },
  'Retort Stand': { hi: 'रिटॉर्ट स्टैंड', mr: 'रिटॉर्ट स्टँड' },
  '0.02 N H₂SO₄ Titrant': { hi: '0.02 N H₂SO₄ अनुमापक', mr: '0.02 N H₂SO₄ टायट्रंट' },
  '0.02 N H₂SO₄': { hi: '0.02 N H₂SO₄', mr: '0.02 N H₂SO₄' },
  '0.02 N NaOH Titrant': { hi: '0.02 N NaOH अनुमापक', mr: '0.02 N NaOH टायट्रंट' },
  '0.02 N NaOH': { hi: '0.02 N NaOH', mr: '0.02 N NaOH' },
  'N/10 Na₂S₂O₃ (Dechlorinator)': { hi: 'N/10 Na₂S₂O₃ (डिक्लोरिनेटर)', mr: 'N/10 Na₂S₂O₃ (डिक्लोरिनेटर)' },
  'Na₂S₂O₃': { hi: 'Na₂S₂O₃', mr: 'Na₂S₂O₃' },
  '0.1 M NaOH Titrant': { hi: '0.1 M NaOH अनुमापक', mr: '0.1 M NaOH टायट्रंट' },
  '0.1 M NaOH': { hi: '0.1 M NaOH', mr: '0.1 M NaOH' },
  'Digital pH Meter': { hi: 'डिजिटल pH मीटर', mr: 'डिजिटल pH मीटर' },
  'Magnetic Stirrer': { hi: 'चुंबकीय स्टिरर', mr: 'मॅग्नेटिक स्टिरर' },
  'Magnetic Stirrer & Teflon Bead': { hi: 'चुंबकीय स्टिरर और टेफ्लॉन बीड', mr: 'मॅग्नेटिक स्टिरर आणि टेफ्लॉन बीड' },
  '100 mL Reaction Beaker': { hi: '100 mL अभिक्रिया बीकर', mr: '100 mL अभिक्रिया बीकर' },
  'pH 4.00 Buffer': { hi: 'pH 4.00 बफर', mr: 'pH 4.00 बफर' },
  'pH 4.0': { hi: 'pH 4.0', mr: 'pH 4.0' },
  'pH 9.20 Buffer': { hi: 'pH 9.20 बफर', mr: 'pH 9.20 बफर' },
  'pH 9.2': { hi: 'pH 9.2', mr: 'pH 9.2' },
  'Unknown HCl Sample': { hi: 'अज्ञात HCl नमूना', mr: 'अज्ञात HCl नमुना' },
  'HCl Sample': { hi: 'HCl नमूना', mr: 'HCl नमुना' },
  'N/50 Na₂S₂O₃ Titrant': { hi: 'N/50 Na₂S₂O₃ अनुमापक', mr: 'N/50 Na₂S₂O₃ टायट्रंट' },
  'N/50 Na₂S₂O₃': { hi: 'N/50 Na₂S₂O₃', mr: 'N/50 Na₂S₂O₃' },
  '300 mL BOD Bottle': { hi: '300 mL BOD बोतल', mr: '300 mL BOD बाटली' },
  '250 mL Titration Flask': { hi: '250 mL अनुमापन फ्लास्क', mr: '250 mL टायट्रेशन फ्लास्क' },
  '2 mL MnSO₄ Solution': { hi: '2 mL MnSO₄ घोल', mr: '2 mL MnSO₄ द्रावण' },
  'MnSO₄': { hi: 'MnSO₄', mr: 'MnSO₄' },
  '2 mL Alkaline KI': { hi: '2 mL क्षारीय KI', mr: '2 mL अल्कलाईन KI' },
  'Alk. KI': { hi: 'क्षारीय KI', mr: 'अल्कलाईन KI' },
  'Conc. H₂SO₄ (Acidifier)': { hi: 'सांद्र H₂SO₄ (अम्लीयकारक)', mr: 'संहत H₂SO₄ (आम्लीकारक)' },
  'H₂SO₄': { hi: 'H₂SO₄', mr: 'H₂SO₄' },
  'Starch Indicator': { hi: 'स्टार्च सूचक', mr: 'स्टार्च दर्शक' },
  'Starch': { hi: 'स्टार्च', mr: 'स्टार्च' },
  'Digital Stopwatch (5 min Floc Settling)': { hi: 'डिजिटल स्टॉपवॉच (5 मिनट तलछट)', mr: 'डिजिटल स्टॉपवॉच (5 मिनिटे अवक्षेप)' },
  'Settling Timer': { hi: 'तलछट टाइमर', mr: 'सेटलिंग टाइमर' },
  '0.1 N NaOH Titrant': { hi: '0.1 N NaOH अनुमापक', mr: '0.1 N NaOH टायट्रंट' },
  '0.1 N NaOH': { hi: '0.1 N NaOH', mr: '0.1 N NaOH' },
  'Digital Conductivity Bridge': { hi: 'डिजिटल चालकता ब्रिज', mr: 'डिजिटल वाहकता ब्रिज' },
  'Water Bath (Equilibration)': { hi: 'जल ऊष्मक (संतुलन)', mr: 'वॉटर बाथ (संतुलन)' },
  'Water Bath (Warm Reflux)': { hi: 'जल ऊष्मक (गर्म रिफ्लक्स)', mr: 'वॉटर बाथ (उष्ण रिफ्लक्स)' },
  '100 mL Conductivity Vessel': { hi: '100 mL चालकता पात्र', mr: '100 mL वाहकता पात्र' },
  '10 mL Unknown HCl': { hi: '10 mL अज्ञात HCl', mr: '10 mL अज्ञात HCl' },
  'HCl': { hi: 'HCl', mr: 'HCl' },
  'Conductivity Water (40 mL)': { hi: 'चालकता जल (40 mL)', mr: 'वाहकता पाणी (40 mL)' },
  'Pure H₂O': { hi: 'शुद्ध जल', mr: 'शुद्ध पाणी' },
  '0.1 N Standard KOH Titrant': { hi: '0.1 N मानक KOH अनुमापक', mr: '0.1 N प्रमाणित KOH टायट्रंट' },
  '0.1 N KOH': { hi: '0.1 N KOH', mr: '0.1 N KOH' },
  '5.0 g Vegetable Oil Sample': { hi: '5.0 g वनस्पति तेल नमूना', mr: '5.0 g वनस्पती तेल नमुना' },
  'Oil Sample': { hi: 'तेल नमूना', mr: 'तेल नमुना' },
  'Neutral Ethanol (50 mL)': { hi: 'उदासीन एथेनॉल (50 mL)', mr: 'उदासीन इथेनॉल (50 mL)' },
  'Neutral EtOH': { hi: 'उदासीन EtOH', mr: 'उदासीन EtOH' },
  'Reaction Vessel': { hi: 'अभिक्रिया पात्र', mr: 'अभिक्रिया पात्र' },
  'Clamp': { hi: 'क्लैम्प', mr: 'क्लॅम्प' },
  'Base': { hi: 'आधार (Base)', mr: 'तळ (Base)' },
  'Burette Clamp': { hi: 'ब्यूरेट क्लैम्प', mr: 'ब्युरेट क्लॅम्प' },
  'Stand Base': { hi: 'स्टैंड का आधार', mr: 'स्टँडचा तळ' },
  'Drop Tube Here': { hi: 'नली को यहां डालें', mr: 'नळी येथे टाका' },
  'Place Ignition Tube': { hi: 'इग्निशन ट्यूब रखें', mr: 'इग्निशन ट्यूब ठेवा' },
  'Na₂SO₄ Bottle': { hi: 'Na₂SO₄ बोतल', mr: 'Na₂SO₄ बाटली' },
  'BaCl₂ Bottle': { hi: 'BaCl₂ बोतल', mr: 'BaCl₂ बाटली' },
  'Waste Jar': { hi: 'अपशिष्ट जार', mr: 'कचरा भांडे' },

  // Drop zone directives
  'Clamp Burette on Retort Stand': { hi: 'रिटॉर्ट स्टैंड पर ब्यूरेट लगाएं', mr: 'रिटॉर्ट स्टँडवर ब्युरेट लावा' },
  'Fill Burette with 0.01 M EDTA': { hi: 'ब्यूरेट में 0.01 M EDTA भरें', mr: 'ब्युरेटमध्ये 0.01 M EDTA भरा' },
  'Refill Burette with 0.01 M EDTA': { hi: 'ब्यूरेट को 0.01 M EDTA से पुनः भरें', mr: 'ब्युरेटमध्ये पुन्हा 0.01 M EDTA भरा' },
  'Place Flask under Burette': { hi: 'फ्लास्क को ब्यूरेट के नीचे रखें', mr: 'फ्लास्क ब्युरेटच्या खाली ठेवा' },
  'Into Conical Flask (Standardization)': { hi: 'शंक्वाकार फ्लास्क में (मानकीकरण)', mr: 'कॉनिकल फ्लास्कमध्ये (प्रमाणीकरण)' },
  'Into Conical Flask (Water Sample)': { hi: 'शंक्वाकार फ्लास्क में (जल नमूना)', mr: 'कॉनिकल फ्लास्कमध्ये (पाण्याचा नमुना)' },
  'Fill Burette with 0.02 N NaOH': { hi: 'ब्यूरेट में 0.02 N NaOH भरें', mr: 'ब्युरेटमध्ये 0.02 N NaOH भरा' },
  'Into Conical Flask': { hi: 'शंक्वाकार फ्लास्क में डालें', mr: 'कॉनिकल फ्लास्कमध्ये टाका' },
  'Fill Burette with 0.1 M NaOH': { hi: 'ब्यूरेट में 0.1 M NaOH भरें', mr: 'ब्युरेटमध्ये 0.1 M NaOH भरा' },
  'Fill Burette with N/50 Na₂S₂O₃': { hi: 'ब्यूरेट में N/50 Na₂S₂O₃ भरें', mr: 'ब्युरेटमध्ये N/50 Na₂S₂O₃ भरा' },
  'Place BOD Bottle': { hi: 'BOD बोतल रखें', mr: 'BOD बाटली ठेवा' },
  'Into BOD Bottle': { hi: 'BOD बोतल में डालें', mr: 'BOD बाटलीमध्ये टाका' },
  'Place Titration Flask': { hi: 'अनुमापन फ्लास्क रखें', mr: 'टायट्रेशन फ्लास्क ठेवा' },
  'Into Titration Flask': { hi: 'अनुमापन फ्लास्क में डालें', mr: 'टायट्रेशन फ्लास्कमध्ये टाका' },
  'Fill Burette with 0.1 N NaOH': { hi: 'ब्यूरेट में 0.1 N NaOH भरें', mr: 'ब्युरेटमध्ये 0.1 N NaOH भरा' },
  'Fill Burette with 0.1 N KOH': { hi: 'ब्यूरेट में 0.1 N KOH भरें', mr: 'ब्युरेटमध्ये 0.1 N KOH भरा' },
  'Place Flask on Workbench': { hi: 'फ्लास्क को बेंच पर रखें', mr: 'फ्लास्क बेंचवर ठेवा' },

  // Governing principles & reaction types
  'Governing Principle': { hi: 'मार्गदर्शक सिद्धांत', mr: 'मार्गदर्शक तत्त्व' },
  'Complexometric Titration': { hi: 'संकुलमितीय अनुमापन', mr: 'कॉम्प्लेक्सोमेट्रिक टायट्रेशन' },
  'Volumetric Neutralization': { hi: 'आयतनमितीय उदासीनीकरण', mr: 'आकारमान उदासीनीकरण' },
  'Iodometric Titration': { hi: 'आयोडोमेट्रिक अनुमापन', mr: 'आयोडोमेट्रिक टायट्रेशन' },
  'Conductance Neutralization': { hi: 'चालकता उदासीनीकरण', mr: 'वाहकता उदासीनीकरण' },
  'Potentiometric Acid-Base': { hi: 'विभवमितीय अम्ल-क्षार', mr: 'पोटेन्शिओमेट्रिक आम्ल-अम्लारी' },
  'Saponification / Neutralization': { hi: 'साबुनीकरण / उदासीनीकरण', mr: 'साबणीकरण / उदासीनीकरण' },
  'Reaction': { hi: 'अभिक्रिया', mr: 'अभिक्रिया' },

  // Calculation field labels
  'EDTA Vol. for 50 mL Std CaCl₂ (V₁ in mL, reference ≈ 20.0 mL)': {
    hi: '50 mL मानक CaCl₂ के लिए EDTA आयतन (V₁ in mL, संदर्भ ≈ 20.0 mL)',
    mr: '50 mL प्रमाणित CaCl₂ साठी EDTA आकारमान (V₁ in mL, संदर्भ ≈ 20.0 mL)',
  },
  'EDTA Vol. for 50 mL Water Sample (V₂ in mL, reference ≈ 15.0 mL)': {
    hi: '50 mL जल नमूने के लिए EDTA आयतन (V₂ in mL, संदर्भ ≈ 15.0 mL)',
    mr: '50 mL पाण्याच्या नमुन्यासाठी EDTA आकारमान (V₂ in mL, संदर्भ ≈ 15.0 mL)',
  },
  'Total Hardness of Water Sample (ppm CaCO₃ eq., reference ≈ 750 ppm)': {
    hi: 'जल नमूने की कुल कठोरता (ppm CaCO₃ तुल्य, संदर्भ ≈ 750 ppm)',
    mr: 'पाण्याच्या नमुन्याची एकूण कठीणता (ppm CaCO₃ सममूल्य, संदर्भ ≈ 750 ppm)',
  },
  'Methyl Orange Titre (Y in mL)': {
    hi: 'मिथाइल ऑरेंज अनुमापन मान (Y in mL)',
    mr: 'मिथाईल ऑरेंज टायट्रेशन वाचन (Y in mL)',
  },
  'Phenolphthalein Titre (Z in mL)': {
    hi: 'फेनोल्फथलीन अनुमापन मान (Z in mL)',
    mr: 'फेनॉल्फथलीन टायट्रेशन वाचन (Z in mL)',
  },
  'Mineral Acidity (ppm CaCO₃ eq.)': {
    hi: 'खनिज अम्लता (ppm CaCO₃ तुल्य)',
    mr: 'खनिज आम्लता (ppm CaCO₃ सममूल्य)',
  },
  'Total Acidity (ppm CaCO₃ eq.)': {
    hi: 'कुल अम्लता (ppm CaCO₃ तुल्य)',
    mr: 'एकूण आम्लता (ppm CaCO₃ सममूल्य)',
  },
  'Titre of N/50 Na₂S₂O₃ (V₂ in mL)': {
    hi: 'N/50 Na₂S₂O₃ का अनुमापन मान (V₂ in mL)',
    mr: 'N/50 Na₂S₂O₃ चे टायट्रेशन वाचन (V₂ in mL)',
  },
  'Dissolved Oxygen Concentration (ppm or mg/L)': {
    hi: 'घुलित ऑक्सीजन सांद्रता (ppm या mg/L)',
    mr: 'विद्राव्य ऑक्सिजन संहती (ppm किंवा mg/L)',
  },
  'Burette Reading of 0.1 N KOH (V in mL)': {
    hi: '0.1 N KOH की ब्यूरेट रीडिंग (V in mL)',
    mr: '0.1 N KOH चे ब्युरेट वाचन (V in mL)',
  },
  'Calculated Acid Value (mg KOH / g oil)': {
    hi: 'परिकलित अम्ल मान (mg KOH / g तेल)',
    mr: 'गणना केलेले आम्ल मूल्य (mg KOH / g तेल)',
  },
  '% Free Fatty Acids (% FFA as Oleic Acid)': {
    hi: '% मुक्त वसीय अम्ल (% FFA ऑलिक एसिड के रूप में)',
    mr: '% मुक्त फॅटी आम्ल (% FFA ओलिक आम्ल म्हणून)',
  },

  // Generic calculations & scoring headers
  'Initial Mass': { hi: 'प्रारंभिक द्रव्यमान', mr: 'प्रारंभिक वस्तुमान' },
  'Final Mass': { hi: 'अंतिम द्रव्यमान', mr: 'अंतिम वस्तुमान' },
  'Volume Added': { hi: 'मिलाया गया आयतन', mr: 'मिळवलेले आकारमान' },
  'Endpoint Volume': { hi: 'अंतिम बिंदु आयतन', mr: 'अंतिम बिंदू आकारमान' },
  'Stopcock Open': { hi: 'स्टॉपकॉक खुला', mr: 'स्टॉपकॉक उघडा' },
  'Stopcock Closed': { hi: 'स्टॉपकॉक बंद', mr: 'स्टॉपकॉक बंद' },
  'Procedure Order': { hi: 'प्रक्रिया क्रम', mr: 'प्रक्रिया क्रम' },
  'Technique': { hi: 'तकनीक', mr: 'तंत्र' },
  'Calculation Accuracy': { hi: 'गणना सटीकता', mr: 'गणना अचूकता' },
  'Endpoint Precision': { hi: 'अंतिम बिंदु सटीकता', mr: 'अंतिम बिंदू अचूकता' },
  'Total Score': { hi: 'कुल अंक', mr: 'एकूण गुण' },
  'Enter value...': { hi: 'मान दर्ज करें...', mr: 'मूल्य प्रविष्ट करा...' },

  // Chemical & Stoichiometry Inspector HUD
  'Chemical & Stoichiometry Engine': { hi: 'रासायनिक एवं रससमीकरणमिति इंजन', mr: 'रासायनिक आणि स्टॉइकिओमेट्री इंजिन' },
  'Live Reaction Diagnostics for': { hi: 'प्रत्यक्ष अभिक्रिया निदान:', mr: 'थेट अभिक्रिया विश्लेषण:' },
  'Total Volume': { hi: 'कुल आयतन', mr: 'एकूण आकारमान' },
  'Temperature': { hi: 'तापमान', mr: 'तापमान' },
  'pH Value': { hi: 'pH मान', mr: 'pH मूल्य' },
  'Precipitate': { hi: 'अवक्षेप (Precipitate)', mr: 'गाळ (Precipitate)' },
  'Acidic': { hi: 'अम्लीय', mr: 'आम्लीय' },
  'Alkaline': { hi: 'क्षारीय', mr: 'अल्कधर्मी' },
  'Neutral': { hi: 'उदासीन', mr: 'उदासीन' },
  'Dissolved & Reactive Species': { hi: 'घुलित एवं प्रतिक्रियाशील घटक', mr: 'विरघळलेले आणि अभिक्रियाशील घटक' },
  'Formula': { hi: 'सूत्र', mr: 'सूत्र' },
  'Species': { hi: 'घटक (Species)', mr: 'घटक (Species)' },
  'Moles (mol)': { hi: 'मोल (mol)', mr: 'मोल (mol)' },
  'Concentration (M)': { hi: 'सांद्रता (M)', mr: 'संहती (M)' },
  'Precipitates & Sediment': { hi: 'अवक्षेप एवं तलछट', mr: 'गाळ आणि साका' },
  'Substance': { hi: 'पदार्थ', mr: 'पदार्थ' },
  'Mass (g)': { hi: 'द्रव्यमान (g)', mr: 'वस्तुमान (g)' },
  'Color': { hi: 'रंग', mr: 'रंग' },
  'Reaction & Thermal Dynamics': { hi: 'अभिक्रिया एवं तापीय गतिकी', mr: 'अभिक्रिया आणि औष्णिक गतीशीलता' },
  'Reaction Enthalpy (ΔH)': { hi: 'अभिक्रिया एन्थैल्पी (ΔH)', mr: 'अभिक्रिया एन्थॅल्पी (ΔH)' },
  'Temperature Change (ΔT)': { hi: 'तापमान परिवर्तन (ΔT)', mr: 'तापमान बदल (ΔT)' },
  'Effervescence Rate': { hi: 'बुदबुदाहट दर (Effervescence)', mr: 'बुडबुड्यांचा वेग (Effervescence)' },
  'Hazard Warnings': { hi: 'सुरक्षा चेतावनियाँ', mr: 'सुरक्षा सूचना' },
  'Reagent Addition Playground': { hi: 'अभिकर्मक संवर्धन प्रयोग', mr: 'अभिकर्मक मिळवणे सराव' },
  'Select Chemical / Reagent': { hi: 'रसायन / अभिकर्मक चुनें', mr: 'रसायन / अभिकर्मक निवडा' },
  'Volume (mL)': { hi: 'आयतन (mL)', mr: 'आकारमान (mL)' },
  'Molarity (M)': { hi: 'मोलरता (M)', mr: 'मोलॅरिटी (M)' },
  'Add Chemical to Vessel': { hi: 'पात्र में रसायन मिलाएं', mr: 'पात्रात रसायन टाका' },
  'Exothermic': { hi: 'ऊष्माक्षेपी', mr: 'उष्णतामोचक' },
  'Endothermic': { hi: 'ऊष्माशोषी', mr: 'उष्णताशोषक' },
  'Step': { hi: 'चरण', mr: 'पायरी' },
  'Progress': { hi: 'प्रगति', mr: 'प्रगती' },
};

/**
 * Translates a dynamic message (validation feedback, toast, banner) to target language.
 */
export function translateDynamicMessage(message: string | null | undefined, language: Language): string {
  if (!message) return '';
  if (language === 'en') return message;

  // Exact lookup
  const exact = DYNAMIC_MESSAGES[message];
  if (exact && exact[language]) {
    return exact[language];
  }

  // Substring prefix checks
  for (const [key, translations] of Object.entries(DYNAMIC_MESSAGES)) {
    if (message.includes(key) && translations[language]) {
      return message.replace(key, translations[language]);
    }
  }

  // Fallback pattern matching for stopcock messages
  if (message.startsWith('Cannot open the stopcock yet — you still need to:')) {
    const missingPart = message.replace('Cannot open the stopcock yet — you still need to:', '').trim();
    if (language === 'hi') {
      return `अभी स्टॉपकॉक नहीं खोल सकते — आपको अभी भी यह करना है: ${missingPart}`;
    }
    if (language === 'mr') {
      return `अद्याप स्टॉपकॉक उघडू शकत नाही — आपल्याला अजूनही हे करणे आवश्यक आहे: ${missingPart}`;
    }
  }

  return message;
}
