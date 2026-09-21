/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Contextual "Why?" Educational Knowledge Base
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Provides concise, scientifically accurate educational rationales
 *  for critical laboratory steps across all experiments.
 *  100% read-only educational layer — zero impact on experiment engine.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Language } from '../i18n/types';

export interface StepWhyExplanation {
  conceptTitle: string;
  explanation: string;
}

export type ExperimentWhyRegistry = Record<
  string, // experimentId
  Record<
    string, // stepId
    Record<Language, StepWhyExplanation>
  >
>;

export const EXPERIMENT_WHY_DATA: ExperimentWhyRegistry = {
  // ── Acid-Base Titration (Titration) ──
  titration: {
    SETUP_STAND: {
      en: {
        conceptTitle: 'Vertical Alignment & Parallax Prevention',
        explanation: 'Clamping the burette strictly vertical and aligning the flask tip prevents reading parallax errors and prevents titrant drops from splashing onto the flask walls.',
      },
      hi: {
        conceptTitle: 'लंबवत संरेखण एवं लंबन त्रुटि निवारण',
        explanation: 'ब्यूरेट को बिल्कुल सीधा क्लैंप करने से पाठ्यांक में लंबन (पैरालैक्स) त्रुटि नहीं होती और अनुमापक की बूंदें फ्लास्क की दीवारों पर व्यर्थ नहीं चिपकतीं।',
      },
      mr: {
        conceptTitle: 'उभे संरेखन आणि लंबन त्रुटी प्रतिबंध',
        explanation: 'ब्युरेट अगदी सरळ उभी लावल्याने वाचनातील लंबन (parallax) त्रुटी टळते आणि द्रावणाचे थेंब पात्राच्या भिंतीवर उडण्यापासून वाचतात.',
      },
    },
    MEASURE_ACID: {
      en: {
        conceptTitle: 'Volumetric Precision with Pipette',
        explanation: 'Using a calibrated volumetric pipette delivers an exact 25.0 mL aliquot with high precision, far surpassing graduated beakers or cylinders for quantitative analysis.',
      },
      hi: {
        conceptTitle: 'पिपेट द्वारा आयतनी परिशुद्धता',
        explanation: 'अंशांकित वॉल्यूमेट्रिक पिपेट का उपयोग सटीक 25.0 mL नमूना लेने के लिए किया जाता है, जो सामान्य बीकर या सिलेंडर की तुलना में कहीं अधिक परिशुद्ध होता है।',
      },
      mr: {
        conceptTitle: 'पिपेटद्वारे अचूक मापन',
        explanation: 'अचूक २५.० mL नमुना मोजण्यासाठी कॅलिब्रेटेड पिपेट वापरली जाते, जी साध्या बीकरपेक्षा परिमाणात्मक विश्लेषणात अत्यंत उच्च अचूकता देते.',
      },
    },
    FILL_BURETTE: {
      en: {
        conceptTitle: 'Rinsing & Air Bubble Removal',
        explanation: 'Rinsing the burette with NaOH solution prevents dilution from residual droplet water. Expelling air bubbles from the nozzle ensures every dispensed drop is counted accurately.',
      },
      hi: {
        conceptTitle: 'धुलाई एवं हवा के बुलबुले निकालना',
        explanation: 'ब्यूरेट को NaOH विलयन से खंगालने से अवशिष्ट पानी के कारण तनुकरण नहीं होता। नोजल से हवा का बुलबुला हटाने से ब्यूरेट का प्रत्येक पाठ्यांक सटीक रहता है।',
      },
      mr: {
        conceptTitle: 'विद्रावाने धुणे आणि हवेचे बुडबुडे काढणे',
        explanation: 'ब्युरेट आधी NaOH ने विसळल्याने आतील पाण्याचे थेंब द्रावण विरल करत नाहीत. नोजलमधील हवेचा बुडबुडा काढल्याने प्रत्येक थेंबाचे अचूक मोजमाप होते.',
      },
    },
    ADD_INDICATOR: {
      en: {
        conceptTitle: 'Indicator Concentration & Endpoint Sharpness',
        explanation: 'Phenolphthalein is a weak organic acid itself. Adding only 2 drops prevents the indicator from consuming extra titrant, ensuring a sharp, distinct pink color shift at pH 8.2–10.0.',
      },
      hi: {
        conceptTitle: 'सूचक की सांद्रता एवं तीक्ष्ण अंतिम बिंदु',
        explanation: 'फेनोल्फथेलिन स्वयं एक दुर्बल कार्बनिक अम्ल है। केवल 2 बूंदें डालने से सूचक स्वयं अनुमापक की खपत नहीं करता और pH 8.2-10.0 पर सटीक गुलाबी रंग परिवर्तन मिलता है।',
      },
      mr: {
        conceptTitle: 'दर्शकाचे प्रमाण आणि अचूक अंतिम बिंदू',
        explanation: 'फेनॉल्फथलीन स्वतः एक सौम्य आम्ल असते. फक्त २ थेंब वापरल्याने दर्शक स्वतः अल्क वापरत नाही आणि pH ८.२–१०.० दरम्यान नेमका गुलाबी रंग बदल मिळतो.',
      },
    },
    TITRATING: {
      en: {
        conceptTitle: 'Dropwise Addition Near Equivalence Point',
        explanation: 'Near the stoichiometric endpoint, a single drop changes the pH exponentially by several units. Continuous swirling ensures instantaneous reagent mixing before adding the next drop.',
      },
      hi: {
        conceptTitle: 'समतुल्यता बिंदु के निकट बूंद-बूंद अनुमापन',
        explanation: 'तुल्यता बिंदु के पास सिर्फ एक बूंद pH में बहुत बड़ा बदलाव लाती है। फ्लास्क को लगातार हिलाने से हर बूंद का तुरंत पूर्ण मिश्रण और सटीक अंतिम बिंदु सुनिश्चित होता है।',
      },
      mr: {
        conceptTitle: 'अंतिम बिंदूजवळ थेंब-थेंब द्रावण घालणे',
        explanation: 'तुल्यता बिंदूजवळ एका थेंबानेही pH वेगाने बदलतो. शंकूपात्र सतत हलवल्याने प्रत्येक थेंब तात्काळ मिसळतो आणि अंतिम बिंदू पुढे जात नाही.',
      },
    },
  },

  // ── Law of Conservation of Mass ──
  conservation: {
    SETUP_FLASK: {
      en: {
        conceptTitle: 'Separation of Reactants Before Mixing',
        explanation: 'Sodium sulphate is placed at the bottom of the conical flask while keeping it strictly separate from the ignition tube to prevent premature chemical reaction before weighing.',
      },
      hi: {
        conceptTitle: 'मिश्रण से पूर्व अभिकारकों का पृथक्करण',
        explanation: 'सोडियम सल्फेट को फ्लास्क के तल में रखा जाता है ताकि तौलने से पहले यह बेरियम क्लोराइड के संपर्क में न आए और समय से पहले अभिक्रिया न हो।',
      },
      mr: {
        conceptTitle: 'मिसळण्यापूर्वी अभिकारके वेगळी ठेवणे',
        explanation: 'वजन करण्यापूर्वी कोणतीही रासायनिक अभिक्रिया घडू नये म्हणून सोडियम सल्फेट द्रावण फ्लास्कच्या तळाशी वेगळे ठेवले जाते.',
      },
    },
    FILL_TUBE: {
      en: {
        conceptTitle: 'Isolated Ignition Tube Chamber',
        explanation: 'Filling barium chloride into a narrow ignition tube creates an isolated micro-reservoir that can be suspended cleanly without spilling into the surrounding solution.',
      },
      hi: {
        conceptTitle: 'पृथक ज्वलन नली प्रकोष्ठ',
        explanation: 'संकीर्ण ज्वलन नली में बेरियम क्लोराइड भरने से एक सुरक्षित पात्र बनता है जिसे फ्लास्क में बिना गिरे आसानी से लटकाया जा सकता है।',
      },
      mr: {
        conceptTitle: 'स्वतंत्र ज्वलन नळी कक्ष',
        explanation: 'बारीक ज्वलन नळीत बेरियम क्लोराईड भरल्याने सुरक्षित कक्ष तयार होतो, जो बाहेरील द्रावणात न सांडता फ्लास्कमध्ये लटकवता येतो.',
      },
    },
    SEAL_FLASK: {
      en: {
        conceptTitle: 'Airtight Closed System',
        explanation: 'The Law of Conservation of Mass strictly applies to a closed system. The airtight rubber cork prevents any atmospheric exchange, evaporation, or aerosol droplet loss.',
      },
      hi: {
        conceptTitle: 'वायुरोधी बंद निकाय (Closed System)',
        explanation: 'द्रव्यमान संरक्षण का नियम केवल बंद निकाय पर लागू होता है। रबर कॉर्क हवा के आदान-प्रदान, वाष्पीकरण और बूंदों की हानि को पूरी तरह रोकता है।',
      },
      mr: {
        conceptTitle: 'हवाबंद प्रणाली (Closed System)',
        explanation: 'वस्तुमान अक्षय्यतेचा नियम बंद प्रणालीवर लागू होतो. रबरी बुच बाहेरील हवेची देवाणघेवाण, बाष्पीभवन आणि द्रवाचे कण उडून जाणे पूर्णपणे थांबवते.',
      },
    },
    MIX_REACTANTS: {
      en: {
        conceptTitle: 'Chemical Precipitation Without Mass Change',
        explanation: 'Tilting the sealed flask causes Ba²⁺ and SO₄²⁻ ions to precipitate as insoluble BaSO₄. In a sealed vessel, the rearrangement of chemical bonds produces zero net mass deviation.',
      },
      hi: {
        conceptTitle: 'द्रव्यमान परिवर्तन रहित रासायनिक अवक्षेपण',
        explanation: 'फ्लास्क को उलटने से Ba²⁺ और SO₄²⁻ आयन मिलकर अघुलनशील BaSO₄ का सफेद अवक्षेप बनाते हैं। बंद पात्र में रासायनिक बंध पुनर्व्यवस्थित होते हैं, द्रव्यमान नहीं बदलता।',
      },
      mr: {
        conceptTitle: 'वस्तुमान बदल न होता रासायनिक अवक्षेपण',
        explanation: 'पात्र उलटल्याने Ba²⁺ आणि SO₄²⁻ एकत्र येऊन अविद्राव्य BaSO₄ चा पांढरा अवक्षेप बनतो. बंद पात्रात रासायनिक बंध बदलतात, पण एकूण वस्तुमान स्थिर राहते.',
      },
    },
  },

  // ── Zinc Acid Reaction ──
  'zinc-acid-reaction': {
    'add-zinc': {
      en: {
        conceptTitle: 'High Surface Area of Granulated Zinc',
        explanation: 'Granulated zinc provides a rough, high-surface-area crystalline geometry, accelerating the heterogeneous redox reaction rate compared to a solid metal sheet.',
      },
      hi: {
        conceptTitle: 'दानेदार जिंक का उच्च पृष्ठीय क्षेत्रफल',
        explanation: 'दानेदार जिंक का खुरदुरा और बड़ा पृष्ठीय क्षेत्रफल ठोस धातु की तुलना में अम्ल के साथ रेडॉक्स अभिक्रिया की गति को काफी तेज कर देता है।',
      },
      mr: {
        conceptTitle: 'दाणेदार जस्ताचे मोठे पृष्ठभागीय क्षेत्रफळ',
        explanation: 'दाणेदार जस्ताचे पृष्ठभागीय क्षेत्रफळ मोठे असल्याने भरीव धातूच्या तुकड्यापेक्षा आम्लासोबतची रासायनिक अभिक्रिया वेगाने घडते.',
      },
    },
    'add-acid': {
      en: {
        conceptTitle: 'Single Displacement Redox Mechanism',
        explanation: 'Zinc has a higher oxidation potential than hydrogen (E° = -0.76 V). Zn oxidizes into Zn²⁺ ions while H⁺ from H₂SO₄ is reduced into gaseous H₂ molecules.',
      },
      hi: {
        conceptTitle: 'एकल विस्थापन रेडॉक्स क्रियाविधि',
        explanation: 'जिंक की विद्युत रासायनिक सक्रियता हाइड्रोजन से अधिक है। Zn ऑक्सीकृत होकर Zn²⁺ बनाता है और H⁺ अपचयित होकर H₂ गैस में परिवर्तित हो जाता है।',
      },
      mr: {
        conceptTitle: 'विस्थापन रेडॉक्स प्रक्रिया',
        explanation: 'जस्ताची रासायनिक क्रियाशीलता हायड्रोजनपेक्षा जास्त असल्याने जस्त H⁺ चे रूपांतर H₂ वायूमध्ये करून स्वतः विरघळते.',
      },
    },
    'test-gas': {
      en: {
        conceptTitle: 'Explosive Combustion of Hydrogen (POP Test)',
        explanation: 'Hydrogen gas is highly flammable. When ignited with atmospheric oxygen (2H₂ + O₂ → 2H₂O), rapid localized thermal expansion produces the distinctive acoustic "pop" sound.',
      },
      hi: {
        conceptTitle: 'हाइड्रोजन का तीव्र दहन ("पॉप" ध्वनि)',
        explanation: 'हाइड्रोजन अत्यंत ज्वलनशील गैस है। हवा की ऑक्सीजन के साथ जलने पर (2H₂ + O₂ → 2H₂O) अचानक हुए ऊष्मीय प्रसार से तेज "पॉप" की आवाज उत्पन्न होती है।',
      },
      mr: {
        conceptTitle: 'हायड्रोजनचे ज्वलन ("पॉप" आवाज चाचणी)',
        explanation: 'हायड्रोजन अतिशय ज्वलनशील वायू आहे. हवेतील ऑक्सिजनसोबत पेट घेताना (2H₂ + O₂ → 2H₂O) जलद प्रसरणामुळे वैशिष्ट्यपूर्ण "पॉप" असा आवाज येतो.',
      },
    },
  },

  // ── Ostwald Viscometer ──
  'viscosity-ostwald': {
    'clean-viscometer': {
      en: {
        conceptTitle: 'Surface Tension & Capillary Cleanliness',
        explanation: 'Trace oil or grease inside the capillary alters contact angle and capillary surface tension, introducing massive laminar flow-time errors.',
      },
      hi: {
        conceptTitle: 'पृष्ठ तनाव एवं केशिका की स्वच्छता',
        explanation: 'केशिका के अंदर चिकनाई या तेल के हल्के निशान भी संपर्क कोण और पृष्ठ तनाव को बिगाड़ देते हैं, जिससे प्रवाह समय में भारी त्रुटि आ जाती है।',
      },
      mr: {
        conceptTitle: 'पृष्ठताण आणि केशिकेची स्वच्छता',
        explanation: 'केशिकेच्या आत तेलकट डाग राहिल्यास पृष्ठताण आणि संपर्क कोन बदलतो, ज्यामुळे द्रवाच्या प्रवाहाच्या वेळेत मोठी चूक होऊ शकते.',
      },
    },
    'suck-liquid': {
      en: {
        conceptTitle: 'Meniscus Relaxation Above Timing Mark',
        explanation: 'Drawing liquid slightly above mark A allows transient liquid turbulence to subside before timing commences at steady gravitational laminar flow.',
      },
      hi: {
        conceptTitle: 'निशान A से ऊपर द्रव स्थिरीकरण',
        explanation: 'द्रव को निशान A से थोड़ा ऊपर खींचने से प्रवाह शुरू होने से पहले भंवर या अशांति समाप्त हो जाती है और गुरुत्वीय लामिनार प्रवाह स्थिर हो जाता है।',
      },
      mr: {
        conceptTitle: 'खूण A च्या वर द्रव स्थिर करणे',
        explanation: 'द्रव खूण A च्या वर ओढल्याने प्रवाह सुरू होण्यापूर्वी द्रवामधील कंपने थांबतात आणि गुरुत्वाकर्षणाचा प्रवाह नियमित होतो.',
      },
    },
    'time-flow-water': {
      en: {
        conceptTitle: "Poiseuille's Relative Calibration",
        explanation: "Ostwald's method eliminates apparatus geometry constants by comparing the sample flow time directly against high-purity water at identical temperature.",
      },
      hi: {
        conceptTitle: 'प्वाज़ुली का सापेक्ष अंशांकन',
        explanation: 'ओस्टवाल्ड विधि में उपकरण के ज्यामितीय नियतांकों की गणना करने की आवश्यकता नहीं होती क्योंकि नमूने की तुलना सीधे समान तापमान पर शुद्ध जल से की जाती है।',
      },
      mr: {
        conceptTitle: 'पॉइझुलीचे सापेक्ष कॅलिब्रेशन',
        explanation: 'ओस्टवाल्ड पद्धतीत उपकरणाचे आकारमान मोजण्याची गरज नसते, कारण एकाच तापमानाला पाण्याचा प्रवाह वेळ मोजून सापेक्ष तुलना केली जाते.',
      },
    },
  },

  // ── Water Hardness by EDTA ──
  'water-hardness-edta': {
    'add-buffer': {
      en: {
        conceptTitle: 'Optimal pH 10 Buffer for Chelate Stability',
        explanation: 'EDTA forms stable stoichiometric 1:1 chelates with Ca²⁺ and Mg²⁺ specifically at pH 9.5–10.0. Lower pH causes EDTA protonation, while higher pH precipitates Mg(OH)₂.',
      },
      hi: {
        conceptTitle: 'चिलेट स्थिरता हेतु pH 10 बफर',
        explanation: 'EDTA केवल pH 9.5-10.0 पर ही Ca²⁺ और Mg²⁺ के साथ स्थिर 1:1 संकुल बनाता है। कम pH पर EDTA निष्प्रभावी हो जाता है और अधिक pH पर Mg(OH)₂ अवक्षेपित हो जाता है।',
      },
      mr: {
        conceptTitle: 'स्थिरतेसाठी pH १० बफर द्रावण',
        explanation: 'EDTA केवळ pH ९.५–१०.० दरम्यानच Ca²⁺ आणि Mg²⁺ सोबत स्थिर संकुल बनवतो. कमी pH ला EDTA निष्प्रभ ठरतो आणि जास्त pH ला मॅग्नेशियम वेगळे होते.',
      },
    },
    'add-ebt': {
      en: {
        conceptTitle: 'Metallo-Indicator Competition Mechanism',
        explanation: 'Eriochrome Black T binds loosely with Mg²⁺ ions to form an unstable wine-red complex. When EDTA titrant extracts all free and bound metal ions, EBT returns to its free sky-blue form.',
      },
      hi: {
        conceptTitle: 'धातु-सूचक प्रतिस्पर्धा क्रियाविधि',
        explanation: 'एरियोक्रोम ब्लैक T (EBT) धातु आयनों के साथ एक अस्थायी वाइन-लाल संकुल बनाता है। जब EDTA सारे धातु आयन खींच लेता है, तो EBT अपने मूल आसमानी नीले रूप में आ जाता है।',
      },
      mr: {
        conceptTitle: 'धातू-दर्शक रासायनिक स्पर्धा',
        explanation: 'EBT दर्शक धातू आयनांशी जुळून तात्पुरता वाइन-लाल रंग देतो. EDTA ने सर्व धातू आयन काढून घेतल्यावर मुक्त EBT चा मूळ आकाशी निळा रंग परत येतो.',
      },
    },
    fill_burette: {
      en: {
        conceptTitle: 'Standardized Chelating Titrant',
        explanation: 'Filling the burette with standardized disodium EDTA ensures calibrated molar chelation of alkaline earth divalent cations in solution.',
      },
      hi: {
        conceptTitle: 'मानकीकृत चिलेटिंग अनुमापक',
        explanation: 'ब्यूरेट में मानक डाईसोडियम EDTA भरने से जल में उपस्थित कैल्शियम और मैग्नीशियम आयनों का सटीक मोलर अनुमापन संभव होता है।',
      },
      mr: {
        conceptTitle: 'प्रमाणित चिलेटिंग द्रावण',
        explanation: 'ब्युरेटमध्ये प्रमाणित EDTA भरल्याने पाण्यातील कॅल्शियम आणि मॅग्नेशियम आयनांचे अचूक रासायनिक मोजमाप होते.',
      },
    },
  },

  // ── Water Alkalinity ──
  'water-alkalinity': {
    'phenolphthalein-titration': {
      en: {
        conceptTitle: 'Neutralization to pH 8.3 (P Endpoint)',
        explanation: 'Phenolphthalein pink discharge indicates complete neutralization of hydroxide (OH⁻) and half of carbonate (CO₃²⁻ → HCO₃⁻) at equivalence pH ~8.3.',
      },
      hi: {
        conceptTitle: 'pH 8.3 पर उदासीनीकरण (P अंतिम बिंदु)',
        explanation: 'फेनोल्फथेलिन का गुलाबी रंग गायब होना यह दर्शाता है कि समस्त हाइड्रोक्साइड (OH⁻) और आधा कार्बोनेट (CO₃²⁻ → HCO₃⁻) pH 8.3 पर उदासीन हो चुका है।',
      },
      mr: {
        conceptTitle: 'pH ८.३ ला उदासीनीकरण (P अंतिम बिंदू)',
        explanation: 'फेनॉल्फथलीनचा गुलाबी रंग नाहीसा होणे म्हणजे सर्व OH⁻ आणि निम्मे कार्बोनेट (CO₃²⁻ चे HCO₃⁻ मध्ये) pH ८.३ ला उदासीनीकरण झाले आहे.',
      },
    },
    'methyl-orange-titration': {
      en: {
        conceptTitle: 'Total Alkalinity Endpoint to pH 4.5 (M Endpoint)',
        explanation: 'Methyl orange turns light pink when all residual bicarbonate (HCO₃⁻) ions are protonated into carbonic acid (H₂CO₃) at pH ~4.5, yielding total alkalinity.',
      },
      hi: {
        conceptTitle: 'कुल क्षारीयता अंतिम बिंदु pH 4.5 (M अंतिम बिंदु)',
        explanation: 'मिथाइल ऑरेंज का गुलाबी होना यह दर्शाता है कि सभी बाइकार्बोनेट (HCO₃⁻) आयन कार्बोनिक अम्ल में बदल चुके हैं, जिससे कुल क्षारीयता प्राप्त होती है।',
      },
      mr: {
        conceptTitle: 'एकूण अल्कधर्मीयता अंतिम बिंदू pH ४.५ (M अंतिम बिंदू)',
        explanation: 'मिथाईल ऑरेंज फिकट गुलाबी होणे म्हणजे सर्व बायकार्बोनेट (HCO₃⁻) चे कार्बोनिक आम्लात रूपांतर झाले असून एकूण अल्कधर्मीयता मोजली गेली आहे.',
      },
    },
  },

  // ── Water Acidity ──
  'water-acidity': {
    'sample-prep': {
      en: {
        conceptTitle: 'Dechlorination with Sodium Thiosulphate',
        explanation: 'Residual municipal chlorine bleaches organic pH indicators (methyl orange and phenolphthalein). Adding thiosulphate destroys free chlorine without altering acidity.',
      },
      hi: {
        conceptTitle: 'सोडियम थायोसल्फेट द्वारा क्लोरीन विमुक्तीकरण',
        explanation: 'पानी में मौजूद क्लोरीन सूचकों का रंग उड़ा देती है। थायोसल्फेट की एक बूंद बिना अम्लता बदले अवशिष्ट क्लोरीन को पूरी तरह नष्ट कर देती है।',
      },
      mr: {
        conceptTitle: 'थायोसल्फेटने क्लोरीन नष्ट करणे',
        explanation: 'पाण्यातील उरलेला क्लोरीन दर्शकांचा रंग उडवतो. थायोसल्फेटचा थेंब पाण्याचा pH न बदलता क्लोरीन नष्ट करतो.',
      },
    },
    'part-a-titration': {
      en: {
        conceptTitle: 'Mineral Acidity Neutralization (pH 3.7–4.4)',
        explanation: 'Methyl orange measures strong mineral acids (HCl, H₂SO₄) derived from industrial effluents or acid mine drainage, which neutralize below pH 4.5.',
      },
      hi: {
        conceptTitle: 'खनिज अम्लता उदासीनीकरण (pH 3.7-4.4)',
        explanation: 'मिथाइल ऑरेंज तीव्र खनिज अम्लों (HCl, H₂SO₄) को मापता है जो औद्योगिक प्रदूषण से आते हैं और pH 4.5 से नीचे उदासीन होते हैं।',
      },
      mr: {
        conceptTitle: 'खनिज आम्लता उदासीनीकरण (pH ३.७–४.४)',
        explanation: 'मिथाईल ऑरेंज तीव्र खनिज आम्लांचे (उदा. सल्फ्यूरिक, हायड्रोक्लोरिक) प्रमाण मोजतो, जे pH ४.५ च्या खाली पूर्ण उदासीन होतात.',
      },
    },
  },

  // ── Chloride Content by Mohr's Method ──
  'chloride-mohr-method': {
    'pipette-sample': {
      en: {
        conceptTitle: 'pH Control (6.5–9.0) in Argentometric Titration',
        explanation: 'Chloride-free Na₂CO₃ buffers the solution in the neutral pH 6.5–9.0 range. In acidic media, chromate indicator converts to dichromate; in alkaline media, Ag₂O precipitates.',
      },
      hi: {
        conceptTitle: 'अर्जेन्टोमेट्रिक अनुमापन में pH नियंत्रण (6.5-9.0)',
        explanation: 'Na₂CO₃ विलयन को उदासीन pH पर रखता है। अम्लीय माध्यम में क्रोमेट डाइक्रोमेट में बदल जाता है और अत्यधिक क्षारीय माध्यम में सिल्वर ऑक्साइड अवक्षेपित हो जाता है।',
      },
      mr: {
        conceptTitle: 'pH नियंत्रण (६.५ ते ९.०)',
        explanation: 'द्रावण उदासीन ठेवणे आवश्यक आहे, कारण आम्लामध्ये क्रोमेट दर्शक निकामी होतो आणि अल्कधर्मी द्रावणात सिल्व्हर ऑक्साईडचा अवक्षेप येतो.',
      },
    },
    'titrate-ag': {
      en: {
        conceptTitle: 'Fractional Precipitation & Solubility Products',
        explanation: 'AgCl precipitates first because its solubility product (Ksp = 1.8 × 10⁻¹⁰) is satisfied before silver chromate. The reddish-brown Ag₂CrO₄ appears only when all Cl⁻ is exhausted.',
      },
      hi: {
        conceptTitle: 'प्रभाजी अवक्षेपण एवं विलेयता गुणनफल (Ksp)',
        explanation: 'AgCl पहले अवक्षेपित होता है क्योंकि इसका Ksp कम होता है। लाल-भूरा Ag₂CrO₄ केवल तभी बनता है जब विलयन के सारे क्लोराइड आयन समाप्त हो जाते हैं।',
      },
      mr: {
        conceptTitle: 'टप्प्याटप्प्याने अवक्षेपण (Solubility Product Ksp)',
        explanation: 'AgCl आधी अवक्षेपित होतो. जेव्हा पात्रातील सर्व क्लोराईड संपतात, तेव्हाच लालसर-तपकिरी Ag₂CrO₄ तयार होऊन अंतिम बिंदू दिसतो.',
      },
    },
  },

  // ── Dissolved Oxygen by Winkler's Method ──
  'dissolved-oxygen-winkler': {
    'fill-sample': {
      en: {
        conceptTitle: 'Bubble-Free Overflow Sampling',
        explanation: 'Filling the BOD bottle to overflow without turbulence or trapped bubbles prevents atmospheric oxygen from dissolving and artificially inflating the DO reading.',
      },
      hi: {
        conceptTitle: 'बिना बुलबुले जल भरना',
        explanation: 'BOD बोतल को बिना बुलबुलों के लबालब भरने से वायुमंडलीय ऑक्सीजन पानी में नहीं घुलती और पाठ्यांक में कृत्रिम वृद्धि नहीं होती।',
      },
      mr: {
        conceptTitle: 'बुडबुडे न येता नमुना भरणे',
        explanation: 'BOD बाटलीत हवेचा एकही बुडबुडा न ठेवता काठोकाठ पाणी भरल्याने बाहेरील हवेतील ऑक्सिजन पाण्यात विरघळत नाही.',
      },
    },
    'oxygen-fixation': {
      en: {
        conceptTitle: 'Chemical Fixation of Volatile Oxygen',
        explanation: 'Dissolved O₂ rapidly oxidizes white Mn(OH)₂ into brown basic manganic oxide [MnO(OH)₂], chemically locking volatile oxygen into a stable non-volatile precipitate.',
      },
      hi: {
        conceptTitle: 'घुलित ऑक्सीजन का रासायनिक स्थिरीकरण',
        explanation: 'घुलित ऑक्सीजन सफेद Mn(OH)₂ को भूरे मैंगनीज हाइड्रॉक्साइड में ऑक्सीकृत कर देती है, जिससे अस्थिर ऑक्सीजन स्थायी अवक्षेप में बंध जाती है।',
      },
      mr: {
        conceptTitle: 'ऑक्सिजनचे रासायनिक स्थिरीकरण',
        explanation: 'पाण्यातील ऑक्सिजन पांढऱ्या Mn(OH)₂ चे रूपांतर तपकिरी अवक्षेपामध्ये करतो, ज्यामुळे वायू स्वरूपातील ऑक्सिजन रासायनिकदृष्ट्या सुरक्षित होतो.',
      },
    },
    'acidification': {
      en: {
        conceptTitle: 'Stoichiometric Liberation of Free Iodine',
        explanation: 'Concentrated sulphuric acid dissolves the brown precipitate, allowing quadrivalent manganese to oxidize iodide ions into free iodine in exact stoichiometric equivalence to dissolved O₂.',
      },
      hi: {
        conceptTitle: 'मुक्त आयोडीन का समतुल्य निष्कासन',
        explanation: 'सांद्र सल्फ्यूरिक अम्ल भूरे अवक्षेप को घोलता है और आयोडाइड को मुक्त आयोडीन (I₂) में बदल देता है, जिसकी मात्रा घुलित O₂ के बिल्कुल समान होती है।',
      },
      mr: {
        conceptTitle: 'मुक्त आयोडीन निर्मिती',
        explanation: 'सल्फ्यूरिक आम्ल तपकिरी अवक्षेप विरघळवते आणि पाण्यातील ऑक्सिजनच्या प्रमाणात नेमकी मुक्त आयोडीन तयार होते.',
      },
    },
  },

  // ── Conductometric Titration ──
  'conductometric-titration': {
    'setup-vessel': {
      en: {
        conceptTitle: 'Thermal Equilibration (25°C)',
        explanation: 'Electrolytic conductance has a high temperature coefficient (~2% increase per °C). Maintaining a constant 25°C water bath prevents thermal conductance drift.',
      },
      hi: {
        conceptTitle: 'तापीय स्थिरीकरण (25°C)',
        explanation: 'विद्युत अपघट्य चालकता तापमान पर अत्यधिक निर्भर करती है (प्रति °C ~2% वृद्धि)। 25°C पर स्थिर रखने से तापमान के कारण चालकता में भटकाव नहीं होता।',
      },
      mr: {
        conceptTitle: 'तापमान स्थिरता (२५°C)',
        explanation: 'विद्युत वाहकत्व तापमानानुसार दर अंशाला ~२% बदलते. २५°C तापमान स्थिर ठेवल्याने आलेखात तापमानविषयक त्रुटी येत नाहीत.',
      },
    },
    'titrate-naoh': {
      en: {
        conceptTitle: 'Ionic Mobility Differential (V-Curve Minimum)',
        explanation: 'Highly mobile H⁺ ions (mobility 350) are replaced by slower Na⁺ ions (mobility 50), causing conductance to fall sharply until the equivalence point, after which excess OH⁻ (mobility 198) causes a steep rise.',
      },
      hi: {
        conceptTitle: 'आयनिक गतिशीलता अंतर (V-वक्र न्यूनतम)',
        explanation: 'अत्यधिक गतिशील H⁺ आयनों का स्थान कम गतिशील Na⁺ आयन ले लेते हैं, जिससे चालकता न्यूनतम बिंदु तक गिरती है। उसके बाद अतिरिक्त OH⁻ के कारण चालकता फिर तेजी से बढ़ती है।',
      },
      mr: {
        conceptTitle: 'आयनिक गतीमधील फरक (V-आकार आलेख)',
        explanation: 'वेगाने धावणारे H⁺ आयन मंद Na⁺ आयनांनी बदलले जातात, ज्यामुळे वाहकत्व तुल्यता बिंदूपर्यंत वेगाने खाली येते आणि नंतर अतिरिक्त OH⁻ मुळे पुन्हा वाढते.',
      },
    },
  },

  // ── pH-Metric Titration ──
  'ph-metric-titration': {
    'calibrate-4': {
      en: {
        conceptTitle: 'Glass Electrode Nernstian Offset Calibration',
        explanation: 'Standardizing with pH 4.00 buffer adjusts the pH meter for asymmetric potential and zero-point offset of the glass electrode.',
      },
      hi: {
        conceptTitle: 'ग्लास इलेक्ट्रोड नर्न्स्ट ऑफसेट अंशांकन',
        explanation: 'pH 4.00 बफर से मानकीकरण करने से ग्लास इलेक्ट्रोड की असममित क्षमता और शून्य-बिंदु ऑफसेट सही रूप से समायोजित हो जाते हैं।',
      },
      mr: {
        conceptTitle: 'काच इलेक्ट्रोडचे नर्न्स्ट कॅलिब्रेशन',
        explanation: 'pH ४.०० बफरने कॅलिब्रेट केल्याने काच इलेक्ट्रोडमधील शून्य-बिंदू त्रुटी निघून जाते आणि मीटर योग्य पाठ्यांक देतो.',
      },
    },
    'calibrate-9': {
      en: {
        conceptTitle: 'Two-Point Slope Standardization',
        explanation: 'A two-point calibration with pH 9.20 buffer establishes the true Nernstian response slope (ideal 59.16 mV/pH unit at 25°C) across both acidic and alkaline spans.',
      },
      hi: {
        conceptTitle: 'दो-बिंदु प्रवणता (Slope) मानकीकरण',
        explanation: 'pH 9.20 बफर के साथ दूसरा अंशांकन अम्लीय और क्षारीय दोनों क्षेत्रों में सटीक नर्न्स्ट ढलान (59.16 mV/pH) स्थापित करता है।',
      },
      mr: {
        conceptTitle: 'दोन-बिंदू स्लोप प्रमाणीकरण',
        explanation: 'pH ९.२० बफर वापरल्याने आम्ल व अल्क दोन्ही श्रेणींमध्ये मीटरचा योग्य प्रतिसाद (५९.१६ mV/pH) निश्चित होतो.',
      },
    },
    'titrate-naoh': {
      en: {
        conceptTitle: 'Logarithmic Equivalence Inflection',
        explanation: 'Because pH is logarithmic [-log[H⁺]], the depletion of the final micromoles of H⁺ causes an abrupt 7-unit pH surge within a fraction of a drop at equivalence.',
      },
      hi: {
        conceptTitle: 'लघुगणकीय समतुल्यता उछाल',
        explanation: 'चूंकि pH लघुगणकीय [-log[H⁺]] होता है, इसलिए तुल्यता बिंदु पर अंतिम H⁺ आयनों के समाप्त होते ही केवल एक बूंद में pH में 7 इकाइयों का तीव्र उछाल आता है।',
      },
      mr: {
        conceptTitle: 'लघुगणकीय (Logarithmic) तीव्र बदल',
        explanation: 'pH हे लॉग स्केलवर असल्याने तुल्यता बिंदूवर शेवटचे H⁺ संपताच अवघ्या एका थेंबात pH मध्ये ७ युनिट्सची मोठी उडी दिसते.',
      },
    },
  },

  // ── Acid Value of Vegetable Oil ──
  'acid-value-oil': {
    'add-alcohol': {
      en: {
        conceptTitle: 'Selective Solubilization of Free Fatty Acids',
        explanation: 'Neutral ethanol selectively dissolves unbonded free fatty acids from the viscous oil matrix while leaving bulky triglyceride ester bonds intact without saponification.',
      },
      hi: {
        conceptTitle: 'मुक्त वसीय अम्लों का चयनात्मक विलेयीकरण',
        explanation: 'उदासीन एथेनॉल तेल में से केवल मुक्त वसीय अम्लों को घोलता है और मुख्य ट्राइग्लिसराइड एस्टर को बिना साबुनीकरण के सुरक्षित रखता है।',
      },
      mr: {
        conceptTitle: 'फॅटी ॲसिड विरघळवणे',
        explanation: 'न्यूट्रल अल्कोहोल तेलातील फक्त मुक्त फॅटी ॲसिडला विरघळवतो, ज्यामुळे मुख्य तेलाचे विघटन न होता अचूक टायट्रेशन होते.',
      },
    },
    'warm-and-cool': {
      en: {
        conceptTitle: 'Homogeneous Solution Phase Before Titration',
        explanation: 'Gentle warming on a water bath dissolves long-chain fatty acid aggregates. Cooling to room temperature prevents volatile alcohol evaporation during KOH titration.',
      },
      hi: {
        conceptTitle: 'अनुमापन से पूर्व समांगी विलयन निर्माण',
        explanation: 'जल कुंड में हल्का गर्म करने से लंबी श्रृंखला वाले वसीय अम्ल पूरी तरह घुल जाते हैं, और ठंडा करने से अनुमापन के दौरान अल्कोहल वाष्पीकृत नहीं होता।',
      },
      mr: {
        conceptTitle: 'एकजीव द्रावण आणि बाष्पीभवन प्रतिबंध',
        explanation: 'कोमट केल्याने फॅटी ॲसिड पूर्ण विरघळते, आणि थंड केल्याने टायट्रेशन दरम्यान अल्कोहोल उडून जात नाही.',
      },
    },
  },
};

/**
 * Retrieve contextual WHY explanation for an experiment step.
 * Returns null if no explanation exists (in which case button must not show).
 */
export function getStepWhyExplanation(
  experimentId: string,
  stepId: string,
  lang: Language
): StepWhyExplanation | null {
  const expData = EXPERIMENT_WHY_DATA[experimentId];
  if (!expData) return null;

  const stepData = expData[stepId];
  if (!stepData) return null;

  return stepData[lang] || stepData['en'] || null;
}
