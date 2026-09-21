import type { Language } from './types';

export interface StepTranslation {
  title: string;
  instruction: string;
  doGuidance?: string;
  dontGuidance?: string;
  dynamicInstructions?: Record<string, string>;
}

export interface ExperimentTranslation {
  title: string;
  description: string;
  steps: Record<string, StepTranslation>;
}

export const EXPERIMENT_TRANSLATIONS: Record<string, Record<Language, ExperimentTranslation>> = {
  // ── Acid-Base Titration (Titration) ──
  'titration': {
    en: {
      title: 'Acid-Base Titration (HCl vs NaOH)',
      description: 'Determine the unknown concentration of hydrochloric acid using standardized sodium hydroxide solution.',
      steps: {
        'SELECT': {
          title: 'Select Experiment',
          instruction: 'Select Acid-Base Titration to begin.',
        },
        'SETUP_STAND': {
          title: 'Mount Apparatus',
          instruction: 'Drag the burette onto the clamp and the conical flask onto the base of the retort stand.',
          doGuidance: 'Align the burette vertically and center the flask directly below the tip.',
          dontGuidance: 'Do not drop the flask without securing the burette clamp first.',
        },
        'MEASURE_ACID': {
          title: 'Measure HCl Acid',
          instruction: 'Drag the HCl Stock bottle onto the lab bench first. Then drag the pipette onto the HCl bottle to draw acid.',
          doGuidance: 'Always place stock bottles stably on the bench before drawing liquids.',
          dontGuidance: 'Never pipette directly from an unstabilized reagent bottle.',
          dynamicInstructions: {
            'place_hcl': 'Drag the HCl Stock bottle from the toolbox onto the lab bench first.',
            'draw_acid': 'Drag the Pipette onto the placed HCl Stock bottle to draw 25 mL acid.',
            'dispense_acid': 'Drag the filled Pipette onto the Conical Flask to dispense 25 mL HCl.',
          },
        },
        'FILL_BURETTE': {
          title: 'Fill Burette with NaOH',
          instruction: 'Drag the NaOH reagent bottle onto the top of the mounted burette to fill it.',
          doGuidance: 'Fill to the 0.00 mL line ensuring no air bubbles are trapped in the nozzle.',
          dontGuidance: 'Do not overfill past the top graduation mark.',
        },
        'ADD_INDICATOR': {
          title: 'Add Phenolphthalein',
          instruction: 'Drag the indicator dropper bottle onto the flask to add phenolphthalein.',
          doGuidance: 'Add exactly 2 drops of indicator into the acid solution.',
          dontGuidance: 'Do not add excess indicator as it will alter the stoichiometric titration point.',
        },
        'TITRATING': {
          title: 'Titrate to Endpoint',
          instruction: 'Rotate the tap valve handle (click or drag) to open the burette tap and adjust titration flow.',
          doGuidance: 'Swirl the flask continuously while titrating near the suspected endpoint.',
          dontGuidance: 'Do not leave the stopcock fully open when close to the color change.',
        },
        'ENDPOINT_MARKED': {
          title: 'Endpoint Marked',
          instruction: 'You have marked the endpoint. Click "Proceed to Calculation" to complete your calculation.',
        },
        'CALCULATION': {
          title: 'Calculate Concentration',
          instruction: 'Use your recorded endpoint volume to calculate the unknown HCl concentration.',
        },
        'RESULTS': {
          title: 'Results & Scoring',
          instruction: 'Review your score and feedback.',
        },
      },
    },
    hi: {
      title: 'अम्ल-क्षार अनुमापन (HCl बनाम NaOH)',
      description: 'मानकीकृत सोडियम हाइड्रॉक्साइड विलयन का उपयोग करके हाइड्रोक्लोरिक अम्ल की अज्ञात सांद्रता ज्ञात करें।',
      steps: {
        'SELECT': {
          title: 'प्रयोग चुनें',
          instruction: 'शुरू करने के लिए अम्ल-क्षार अनुमापन का चयन करें।',
        },
        'SETUP_STAND': {
          title: 'उपकरण स्थापित करें',
          instruction: 'ब्यूरेट को क्लैंप पर और शंक्वाकार फ्लास्क को स्टैंड के आधार पर खींचें।',
          doGuidance: 'ब्यूरेट को लंबवत रूप से संरेखित करें और फ्लास्क को नोजल के ठीक नीचे रखें।',
          dontGuidance: 'क्लैंप सुरक्षित किए बिना उपकरण न छोड़ें।',
        },
        'MEASURE_ACID': {
          title: 'HCl अम्ल मापें',
          instruction: 'पहले HCl स्टॉक बोतल को लैब बेंच पर रखें। फिर अम्ल लेने के लिए पिपेट को HCl बोतल पर ले जाएं।',
          doGuidance: 'तरल खींचने से पहले स्टॉक बोतल को हमेशा बेंच पर स्थिर रखें।',
          dontGuidance: 'अस्थिर बोतल से सीधे पिपेट करने का प्रयास न करें।',
          dynamicInstructions: {
            'place_hcl': 'पहले टूलबॉक्स से HCl स्टॉक बोतल को लैब बेंच पर रखें।',
            'draw_acid': '25 mL अम्ल लेने के लिए पिपेट को रखी गई HCl स्टॉक बोतल पर खींचें।',
            'dispense_acid': '25 mL HCl डालने के लिए भरी हुई पिपेट को शंक्वाकार फ्लास्क पर खींचें।',
          },
        },
        'FILL_BURETTE': {
          title: 'ब्यूरेट में NaOH भरें',
          instruction: 'ब्यूरेट भरने के लिए NaOH अभिकर्मक बोतल को स्थापित ब्यूरेट के शीर्ष पर खींचें।',
          doGuidance: '0.00 mL निशान तक भरें और सुनिश्चित करें कि नोजल में हवा का बुलबुला न हो।',
          dontGuidance: 'शीर्ष निशान से अधिक न भरें।',
        },
        'ADD_INDICATOR': {
          title: 'फेनोल्फथेलिन सूचक डालें',
          instruction: 'फेनोल्फथेलिन डालने के लिए सूचक ड्रॉपर बोतल को फ्लास्क पर खींचें।',
          doGuidance: 'अम्ल विलयन में सूचक की ठीक 2 बूंदें डालें।',
          dontGuidance: 'अतिरिक्त सूचक न डालें क्योंकि इससे अंतिम बिंदु बदल सकता है।',
        },
        'TITRATING': {
          title: 'अंतिम बिंदु तक अनुमापन करें',
          instruction: 'ब्यूरेट टैप खोलने और द्रव प्रवाह नियंत्रित करने के लिए वाल्व हैंडल घुमाएं।',
          doGuidance: 'अनुमापन के दौरान फ्लास्क को लगातार धीरे-धीरे हिलाते रहें।',
          dontGuidance: 'रंग परिवर्तन के करीब होने पर स्टॉपकॉक को पूरी तरह खुला न छोड़ें।',
        },
        'ENDPOINT_MARKED': {
          title: 'अंतिम बिंदु चिह्नित',
          instruction: 'आपने अंतिम बिंदु चिह्नित कर लिया है। गणना पूरी करने के लिए "गणना पर आगे बढ़ें" पर क्लिक करें।',
        },
        'CALCULATION': {
          title: 'सांद्रता की गणना करें',
          instruction: 'अज्ञात HCl सांद्रता की गणना करने के लिए अपने दर्ज किए गए आयतन का उपयोग करें।',
        },
        'RESULTS': {
          title: 'परिणाम एवं अंक',
          instruction: 'अपने अंक और मार्गदर्शन की समीक्षा करें।',
        },
      },
    },
    mr: {
      title: 'आम्ल-अम्लारी अनुमापन (HCl विरुद्ध NaOH)',
      description: 'प्रमाणित सोडियम हायड्रॉक्साइड द्रावणाचा वापर करून हायड्रोक्लोरिक आम्लाची अज्ञात संहती निश्चित करा.',
      steps: {
        'SELECT': {
          title: 'प्रयोग निवडा',
          instruction: 'सुरू करण्यासाठी आम्ल-अम्लारी अनुमापन निवडा.',
        },
        'SETUP_STAND': {
          title: 'उपकरणे जोडा',
          instruction: 'ब्युरेट क्लॅम्पवर आणि शंकूपात्र स्टँडच्या तळावर ओढा.',
          doGuidance: 'ब्युरेट सरळ रेषेत ठेवा आणि शंकूपात्र ब्युरेटच्या तोंडाखाली मध्यभागी ठेवा.',
          dontGuidance: 'क्लॅम्प घट्ट केल्याशिवाय उपकरणे सैल सोडू नका.',
        },
        'MEASURE_ACID': {
          title: 'HCl आम्ल मोजा',
          instruction: 'आधी HCl स्टॉक बाटली लॅब बेंचवर ठेवा. नंतर आम्ल घेण्यासाठी पिपेट HCl बाटलीवर ओढा.',
          doGuidance: 'द्रव घेण्यापूर्वी बाटली नेहमी बेंचवर स्थिर ठेवा.',
          dontGuidance: 'अस्थिर बाटलीतून थेट पिपेट भरू नका.',
          dynamicInstructions: {
            'place_hcl': 'आधी टूलबॉक्समधून HCl स्टॉक बाटली लॅब बेंचवर ठेवा.',
            'draw_acid': '25 mL आम्ल घेण्यासाठी पिपेट ठेवलेल्या HCl बाटलीवर ओढा.',
            'dispense_acid': '25 mL HCl ओतण्यासाठी भरलेली पिपेट शंकूपात्रावर ओढा.',
          },
        },
        'FILL_BURETTE': {
          title: 'ब्युरेटमध्ये NaOH भरा',
          instruction: 'ब्युरेट भरण्यासाठी NaOH अभिकर्मक बाटली ब्युरेटच्या वरच्या तोंडावर ओढा.',
          doGuidance: '0.00 mL खूणेपर्यंत भरा आणि नोजलमध्ये हवेचा बुडबुडा राहणार नाही याची खात्री करा.',
          dontGuidance: 'वरच्या खुणेपेक्षा जास्त भरू नका.',
        },
        'ADD_INDICATOR': {
          title: 'फेनॉल्फथलीन दर्शक घाला',
          instruction: 'फेनॉल्फथलीन घालण्यासाठी ड्रॉपर बाटली शंकूपात्रावर ओढा.',
          doGuidance: 'द्रावणात दर्शकाचे बरोबर २ थेंब घाला.',
          dontGuidance: 'जास्त दर्शक घालू नका, यामुळे अंतिम बिंदू बदलू शकतो.',
        },
        'TITRATING': {
          title: 'अंतिम बिंदूपर्यंत अनुमापन करा',
          instruction: 'ब्युरेट टॅप उघडण्यासाठी आणि प्रवाह नियंत्रित करण्यासाठी व्हॉल्व्ह फिरवा.',
          doGuidance: 'रंगबदल जवळ आल्यावर शंकूपात्र हळूहळू गोलाकार हलवत रहा.',
          dontGuidance: 'रंग बदलताना टॅप पूर्ण उघडा ठेवू नका.',
        },
        'ENDPOINT_MARKED': {
          title: 'अंतिम बिंदू नोंदवला',
          instruction: 'तुम्ही अंतिम बिंदू नोंदवला आहे. गणना करण्यासाठी "गणनेकडे जा" वर क्लिक करा.',
        },
        'CALCULATION': {
          title: 'संहतीची गणना करा',
          instruction: 'अज्ञात HCl संहती काढण्यासाठी नोंदवलेल्या मूल्यांचा वापर करा.',
        },
        'RESULTS': {
          title: 'निकाल आणि गुण',
          instruction: 'आपले गुण आणि मार्गदर्शनाचे पुनरावलोकन करा.',
        },
      },
    },
  },

  // ── Conservation of Mass ──
  'conservation': {
    en: {
      title: 'Law of Conservation of Mass',
      description: 'Verify that the total mass of reactants equals the total mass of products in a closed precipitation reaction.',
      steps: {
        'SELECT': { title: 'Select Experiment', instruction: 'Select the Conservation of Mass experiment to begin.' },
        'SETUP_FLASK': { title: 'Set Up Flask', instruction: 'Place the Conical Flask on the bench, then pour Na₂SO₄ solution into it.' },
        'PLACE_TUBE_ON_STAND': { title: 'Place Tube on Stand', instruction: 'Drag the Ignition Tube from the toolbox onto the Test Tube Stand.' },
        'FILL_TUBE': { title: 'Fill Ignition Tube', instruction: 'Drag the BaCl₂ bottle onto the Ignition Tube to fill it with BaCl₂ solution.' },
        'SUSPEND_TUBE': { title: 'Suspend Tube in Flask', instruction: 'Drag the filled Ignition Tube into the Conical Flask to suspend it inside.' },
        'SEAL_FLASK': { title: 'Seal Flask', instruction: 'Drag the Rubber Cork onto the Conical Flask to seal it airtight.' },
        'WEIGH_INITIAL': { title: 'Weigh Initial Mass (M₁)', instruction: 'Click or drag the sealed flask onto the Digital Balance to record the initial mass M₁.' },
        'MIX_REACTANTS': { title: 'Mix Reactants', instruction: 'Click "Invert Flask to Mix" to tilt the flask and mix BaCl₂ with Na₂SO₄.' },
        'OBSERVE': { title: 'Observe Precipitate', instruction: 'Observe the white precipitate of BaSO₄ forming. Click "Continue" when done.' },
        'WEIGH_FINAL': { title: 'Weigh Final Mass (M₂)', instruction: 'Click or drag the flask onto the Digital Balance to record the final mass M₂.' },
        'CALCULATION': { title: 'Calculate Deviation', instruction: 'Use your recorded M₁ and M₂ values to calculate ΔM and Deviation %.' },
        'RESULTS': { title: 'Results', instruction: 'Review your score and feedback.' },
      },
    },
    hi: {
      title: 'द्रव्यमान संरक्षण का नियम',
      description: 'सत्यापित करें कि एक बंद अवक्षेपण अभिक्रिया में अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होता है।',
      steps: {
        'SELECT': { title: 'प्रयोग चुनें', instruction: 'शुरू करने के लिए द्रव्यमान संरक्षण प्रयोग का चयन करें।' },
        'SETUP_FLASK': { title: 'फ्लास्क तैयार करें', instruction: 'शंक्वाकार फ्लास्क को बेंच पर रखें, फिर उसमें Na₂SO₄ विलयन डालें।' },
        'PLACE_TUBE_ON_STAND': { title: 'नली स्टैंड पर रखें', instruction: 'टूलबॉक्स से ज्वलन नली (Ignition Tube) को परखनली स्टैंड पर रखें।' },
        'FILL_TUBE': { title: 'ज्वलन नली भरें', instruction: 'BaCl₂ विलयन भरने के लिए BaCl₂ बोतल को ज्वलन नली पर खींचें।' },
        'SUSPEND_TUBE': { title: 'नली फ्लास्क में लटकाएं', instruction: 'भरी हुई ज्वलन नली को फ्लास्क के अंदर सुरक्षित रूप से लटकाएं।' },
        'SEAL_FLASK': { title: 'फ्लास्क सील करें', instruction: 'फ्लास्क को वायुरोधी बनाने के लिए उस पर रबर कॉर्क लगाएं।' },
        'WEIGH_INITIAL': { title: 'प्रारंभिक द्रव्यमान (M₁) मापें', instruction: 'प्रारंभिक द्रव्यमान M₁ दर्ज करने के लिए सील किए गए फ्लास्क को डिजिटल बैलेंस पर रखें।' },
        'MIX_REACTANTS': { title: 'अभिकारकों को मिलाएं', instruction: 'BaCl₂ और Na₂SO₄ को मिलाने के लिए "मिश्रित करने के लिए फ्लास्क को उलटें" पर क्लिक करें।' },
        'OBSERVE': { title: 'अवक्षेप का अवलोकन करें', instruction: 'BaSO₄ का सफेद अवक्षेप बनते हुए देखें। पूरा होने पर "जारी रखें" पर क्लिक करें।' },
        'WEIGH_FINAL': { title: 'अंतिम द्रव्यमान (M₂) मापें', instruction: 'अंतिम द्रव्यमान M₂ दर्ज करने के लिए फ्लास्क को डिजिटल बैलेंस पर रखें।' },
        'CALCULATION': { title: 'अंतर की गणना करें', instruction: 'ΔM और विचलन % की गणना करने के लिए अपने दर्ज मानों का उपयोग करें।' },
        'RESULTS': { title: 'परिणाम', instruction: 'अपने अंक और प्रदर्शन की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'वस्तुमान अक्षय्यतेचा नियम',
      description: 'एका बंद रासायनिक अवक्षेपण अभिक्रियेमध्ये अभिकारकांचे एकूण वस्तुमान उत्पादितांच्या एकूण वस्तुमानाइतकेच असते हे सिद्ध करा.',
      steps: {
        'SELECT': { title: 'प्रयोग निवडा', instruction: 'सुरू करण्यासाठी वस्तुमान अक्षय्यता प्रयोग निवडा.' },
        'SETUP_FLASK': { title: 'शंकूपात्र मांडा', instruction: 'शंकूपात्र बेंचवर ठेवा, नंतर त्यात Na₂SO₄ चे द्रावण ओता.' },
        'PLACE_TUBE_ON_STAND': { title: 'नळी स्टँडवर ठेवा', instruction: 'टूलबॉक्समधून ज्वलन नळी परीक्षानळी स्टँडवर ठेवा.' },
        'FILL_TUBE': { title: 'ज्वलन नळी भरा', instruction: 'BaCl₂ द्रावण भरण्यासाठी BaCl₂ बाटली ज्वलन नळीवर ओढा.' },
        'SUSPEND_TUBE': { title: 'नळी पात्रात लटकवा', instruction: 'भरलेली ज्वलन नळी शंकूपात्रात काळजीपूर्वक लटकवा.' },
        'SEAL_FLASK': { title: 'पात्र हवाबंद करा', instruction: 'शंकूपात्र हवाबंद करण्यासाठी त्यावर रबरी बुच बसवा.' },
        'WEIGH_INITIAL': { title: 'सुरुवातीचे वस्तुमान (M₁) मोजा', instruction: 'सुरुवातीचे वस्तुमान M₁ नोंदवण्यासाठी पात्र डिजिटल बॅलन्सवर ठेवा.' },
        'MIX_REACTANTS': { title: 'अभिकारक मिसळा', instruction: 'द्रावणे मिसळण्यासाठी "मिश्रणासाठी फ्लास्क उलटा करा" वर क्लिक करा.' },
        'OBSERVE': { title: 'अवक्षेप पहा', instruction: 'तयार झालेला BaSO₄ चा पांढरा अवक्षेप पहा. पूर्ण झाल्यावर "पुढे सुरू ठेवा" वर क्लिक करा.' },
        'WEIGH_FINAL': { title: 'अंतिम वस्तुमान (M₂) मोजा', instruction: 'अंतिम वस्तुमान M₂ नोंदवण्यासाठी पात्र पुन्हा बॅलन्सवर ठेवा.' },
        'CALCULATION': { title: 'फरकाची गणना करा', instruction: 'ΔM आणि टक्केवारी फरक काढण्यासाठी नोंदवलेल्या मूल्यांचा वापर करा.' },
        'RESULTS': { title: 'निकाल', instruction: 'आपले गुण आणि मूल्यमापन तपासा.' },
      },
    },
  },

  // ── Zinc Acid Reaction ──
  'zinc-acid-reaction': {
    en: {
      title: 'Action of Dilute Acid on Zinc',
      description: 'Observe the evolution of hydrogen gas when dilute sulphuric acid reacts with granulated zinc metal.',
      steps: {
        'add-zinc': { title: 'Add Zinc Granules', instruction: 'Drag granulated zinc metal into the test tube.' },
        'add-acid': { title: 'Add Dilute Acid', instruction: 'Carefully add dilute sulphuric acid to the zinc granules.' },
        'observe-gas': { title: 'Observe Gas Evolution', instruction: 'Observe effervescence and bubble formation indicating H₂ gas.' },
        'test-gas': { title: 'Burning Splinter Test', instruction: 'Bring a burning matchstick to the mouth of the tube to hear the characteristic "pop" sound.' },
      },
    },
    hi: {
      title: 'जिंक पर तनु अम्ल की क्रिया',
      description: 'जब दानेदार जिंक धातु तनु सल्फ्यूरिक अम्ल के साथ अभिक्रिया करती है तो हाइड्रोजन गैस के निकलने का अवलोकन करें।',
      steps: {
        'add-zinc': { title: 'जिंक के टुकड़े डालें', instruction: 'परखनली में दानेदार जिंक धातु के टुकड़े डालें।' },
        'add-acid': { title: 'तनु अम्ल डालें', instruction: 'जिंक के टुकड़ों पर सावधानीपूर्वक तनु सल्फ्यूरिक अम्ल डालें।' },
        'observe-gas': { title: 'गैस निकलने का अवलोकन करें', instruction: 'H₂ गैस निकलने का संकेत देने वाले बुलबुले और बुदबुदाहट देखें।' },
        'test-gas': { title: 'जलती तीली से परीक्षण', instruction: '"पॉप" ध्वनि सुनने के लिए जलती हुई तीली परखनली के मुंह के पास लाएं।' },
      },
    },
    mr: {
      title: 'जस्त (Zinc) वर विरल आम्लाची अभिक्रिया',
      description: 'विरल सल्फ्यूरिक आम्लाची जस्ताच्या तुकड्यांशी अभिक्रिया होऊन हायड्रोजन वायू मुक्त होताना पहा.',
      steps: {
        'add-zinc': { title: 'जस्ताचे तुकडे घाला', instruction: 'परीक्षानळीमध्ये जस्ताचे (Zinc) तुकडे टाका.' },
        'add-acid': { title: 'विरल आम्ल घाला', instruction: 'जस्ताच्या तुकड्यांवर काळजीपूर्वक विरल सल्फ्यूरिक आम्ल घाला.' },
        'observe-gas': { title: 'वायूचे बुडबुडे पहा', instruction: 'हायड्रोजन (H₂) वायू मुक्त झाल्यामुळे येणारे बुडबुडे पहा.' },
        'test-gas': { title: 'जळत्या काडीने चाचणी', instruction: '"पॉप" असा वैशिष्ट्यपूर्ण आवाज ऐकण्यासाठी जळती काडी नळीच्या तोंडाजवळ आणा.' },
      },
    },
  },

  // ── Determination of Viscosity (Ostwald Viscometer) ──
  'viscosity-ostwald': {
    en: {
      title: "Determination of Viscosity by Ostwald's Viscometer",
      description: 'Measure the flow time of a liquid and determine its coefficient of viscosity relative to water.',
      steps: {
        'clean-viscometer': { title: 'Clean Viscometer', instruction: 'Rinse and dry the Ostwald viscometer with distilled water and acetone.' },
        'fill-water': { title: 'Pipette Water', instruction: 'Pipette exactly 10 mL of distilled water into the wider bulb of the viscometer.' },
        'suck-liquid': { title: 'Suction to Mark A', instruction: 'Apply gentle suction to draw water above mark A and allow it to equilibrate.' },
        'time-flow-water': { title: 'Measure Water Flow Time', instruction: 'Start the stopwatch as the meniscus passes Mark A and stop at Mark B.' },
        'fill-sample': { title: 'Pipette Test Liquid', instruction: 'Pipette 10 mL of the sample liquid into the clean, dried viscometer.' },
        'time-flow-sample': { title: 'Measure Liquid Flow Time', instruction: 'Record the flow time for the test liquid between Mark A and Mark B.' },
        'calculate': { title: 'Calculate Relative Viscosity', instruction: 'Calculate the viscosity of the liquid using the relative viscosity formula.' },
      },
    },
    hi: {
      title: "ओस्टवाल्ड विस्कोमीटर द्वारा श्यानता निर्धारण",
      description: 'द्रव के प्रवाह समय को मापें और जल के सापेक्ष इसका श्यानता गुणांक ज्ञात करें।',
      steps: {
        'clean-viscometer': { title: 'विस्कोमीटर साफ करें', instruction: 'ओस्टवाल्ड विस्कोमीटर को आसुत जल और एसीटोन से धोकर सुखाएं।' },
        'fill-water': { title: 'जल डालें', instruction: 'विस्कोमीटर के चौड़े बल्ब में ठीक 10 mL आसुत जल पिपेट से डालें।' },
        'suck-liquid': { title: 'निशान A तक खींचें', instruction: 'जल को निशान A से ऊपर खींचें और स्थिर होने दें।' },
        'time-flow-water': { title: 'जल प्रवाह समय मापें', instruction: 'जैसे ही मेनिस्कस निशान A से गुजरे स्टॉपवॉच शुरू करें और निशान B पर रोकें।' },
        'fill-sample': { title: 'परीक्षण द्रव डालें', instruction: 'साफ, सूखे विस्कोमीटर में 10 mL परीक्षण द्रव पिपेट करें।' },
        'time-flow-sample': { title: 'द्रव प्रवाह समय मापें', instruction: 'निशान A और निशान B के बीच परीक्षण द्रव का प्रवाह समय दर्ज करें।' },
        'calculate': { title: 'सापेक्ष श्यानता की गणना करें', instruction: 'सापेक्ष श्यानता सूत्र का उपयोग करके द्रव की श्यानता ज्ञात करें।' },
      },
    },
    mr: {
      title: "ओस्टवाल्ड व्हिस्कोमीटरद्वारे स्निग्धता (Viscosity) निश्चित करणे",
      description: 'द्रवाचा प्रवाह वेळ मोजा आणि पाण्याचा संदर्भ घेऊन स्निग्धता गुणांक निश्चित करा.',
      steps: {
        'clean-viscometer': { title: 'व्हिस्कोमीटर स्वच्छ करा', instruction: 'ओस्टवाल्ड व्हिस्कोमीटर डिस्टिल्ड वॉटर आणि ॲसिटोनने धुवून वाळवा.' },
        'fill-water': { title: 'पाणी भरा', instruction: 'व्हिस्कोमीटरच्या रुंद भागात पिपेटने बरोबर 10 mL पाणी घाला.' },
        'suck-liquid': { title: 'खूण A पर्यंत वर ओढा', instruction: 'पाणी खूण A च्या वर ओढून घ्या आणि स्थिर होऊ द्या.' },
        'time-flow-water': { title: 'पाण्याचा प्रवाह वेळ मोजा', instruction: 'पाणी खूण A वरून निघताच स्टॉपवॉच सुरू करा आणि खूण B ला थांबवा.' },
        'fill-sample': { title: 'चाचणी द्रव भरा', instruction: 'कोरड्या व्हिस्कोमीटरमध्ये 10 mL चाचणी द्रव घाला.' },
        'time-flow-sample': { title: 'द्रवाचा प्रवाह वेळ मोजा', instruction: 'खूण A ते खूण B दरम्यान चाचणी द्रवाचा प्रवाह वेळ नोंदवा.' },
        'calculate': { title: 'स्निग्धतेची गणना करा', instruction: 'सूत्राचा वापर करून द्रवाच्या स्निग्धतेची गणना करा.' },
      },
    },
  },

  // ── Hardness of Water by EDTA Method ──
  'water-hardness-edta': {
    en: {
      title: 'Determination of Water Hardness by EDTA Method',
      description: 'Determine total, temporary, and permanent hardness of a water sample by complexometric titration with EDTA.',
      steps: {
        'pipette-sample': { title: 'Pipette Water Sample', instruction: 'Pipette 50 mL of the water sample into a conical flask.' },
        'add-buffer': { title: 'Add Ammonia Buffer', instruction: 'Add 5 mL of NH₄Cl-NH₄OH buffer to maintain the pH at 10.0.' },
        'add-ebt': { title: 'Add EBT Indicator', instruction: 'Add 2–3 drops of Eriochrome Black T indicator; the solution turns wine red.' },
        'fill-burette': { title: 'Fill Burette with EDTA', instruction: 'Fill the burette with 0.01 M standard EDTA solution up to the 0.00 mL mark.' },
        'titrate': { title: 'Titrate to Sky Blue', instruction: 'Titrate with EDTA solution until the wine red color turns distinctly sky blue.' },
        'calculate': { title: 'Calculate Total Hardness', instruction: 'Calculate total hardness in ppm of CaCO₃ equivalent.' },
      },
    },
    hi: {
      title: 'EDTA विधि द्वारा जल की कठोरता ज्ञात करना',
      description: 'EDTA के साथ संकुलमितीय अनुमापन द्वारा जल के नमूने की कुल, अस्थायी और स्थायी कठोरता ज्ञात करें।',
      steps: {
        'pipette-sample': { title: 'जल का नमूना लें', instruction: 'शंक्वाकार फ्लास्क में पिपेट से 50 mL जल का नमूना डालें।' },
        'add-buffer': { title: 'अमोनिया बफर डालें', instruction: 'pH 10.0 बनाए रखने के लिए 5 mL NH₄Cl-NH₄OH बफर विलयन डालें।' },
        'add-ebt': { title: 'EBT सूचक डालें', instruction: 'एरियोक्रोम ब्लैक टी (EBT) की 2-3 बूंदें डालें; विलयन वाइन लाल हो जाएगा।' },
        'fill-burette': { title: 'ब्यूरेट में EDTA भरें', instruction: 'ब्यूरेट में 0.01 M मानक EDTA विलयन 0.00 mL निशान तक भरें।' },
        'titrate': { title: 'आसमानी नीले रंग तक अनुमापन करें', instruction: 'EDTA के साथ तब तक अनुमापन करें जब तक वाइन लाल रंग बदलकर स्पष्ट आसमानी नीला न हो जाए।' },
        'calculate': { title: 'कुल कठोरता की गणना करें', instruction: 'CaCO₃ समतुल्य के ppm में कुल कठोरता की गणना करें।' },
      },
    },
    mr: {
      title: 'EDTA पद्धतीने पाण्याचा कठीणपणा निश्चित करणे',
      description: 'EDTA सह अनुमापन करून पाण्याच्या नमुन्याचा एकूण, तात्पुरता आणि कायमस्वरूपी कठीणपणा निश्चित करा.',
      steps: {
        'pipette-sample': { title: 'पाण्याचा नमुना घ्या', instruction: 'शंकूपात्रात 50 mL पाण्याचा नमुना पिपेटने घ्या.' },
        'add-buffer': { title: 'अमोनिया बफर घाला', instruction: 'pH 10.0 राखण्यासाठी 5 mL अमोनिया बफर द्रावण घाला.' },
        'add-ebt': { title: 'EBT दर्शक घाला', instruction: 'EBT दर्शकाचे २-३ थेंब घाला; द्रावणाचा रंग वाइन रेड होईल.' },
        'fill-burette': { title: 'ब्युरेटमध्ये EDTA भरा', instruction: 'ब्युरेटमध्ये 0.01 M EDTA द्रावण 0.00 mL खुणेपर्यंत भरा.' },
        'titrate': { title: 'आकाशी निळ्या रंगापर्यंत अनुमापन करा', instruction: 'द्रावणाचा रंग वाइन रेड वरून आकाशी निळा होईपर्यंत अनुमापन करा.' },
        'calculate': { title: 'एकूण कठीणपणा मोजा', instruction: 'CaCO₃ च्या संदर्भाने ppm मध्ये एकूण कठीणपणाची गणना करा.' },
      },
    },
  },

  // ── Determination of Alkalinity of Water ──
  'water-alkalinity': {
    en: {
      title: 'Determination of Alkalinity of Water',
      description: 'Determine phenolphthalein (P) and methyl orange (M) alkalinity and identify the presence of OH⁻, CO₃²⁻, and HCO₃⁻ ions.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with H₂SO₄', instruction: 'Drag the 0.02 N H₂SO₄ bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup-flask': { title: '3. Place Flask', instruction: 'Place the clean 250 mL conical flask beneath the clamped burette.' },
        'add-sample': { title: '4. Add 100 mL Water Sample', instruction: 'Pipette 100 mL of the alkaline water sample into the conical flask.' },
        'phenolphthalein-titration': { title: '5. Phenolphthalein Endpoint (P)', instruction: 'Add 1–2 drops phenolphthalein (turns pink). Start shaking / swirling the flask before titration, then open the burette cork to titrate drop-by-drop with N/50 H₂SO₄ until pink disappears at A ≈ 4.2 mL. Close the stopcock and click Continue when observed.' },
        'methyl-orange-titration': { title: '6. Methyl Orange Endpoint (M)', instruction: 'Add 2–3 drops methyl orange into the same flask (turns yellow). Start shaking / swirling the flask before titration, then open/rotate the burette cork to continue titration with H₂SO₄ until yellow changes to light pink at total titre A + B ≈ 12.8 mL (B ≈ 8.6 mL). Close the stopcock and click Continue when observed.' },
        'calculation': { title: '7. Calculations & Ions', instruction: 'Calculate phenolphthalein alkalinity, methyl orange alkalinity, and determine alkalinity-causing ions.' },
        'results': { title: '8. Score Breakdown', instruction: 'Review your laboratory precision and scoring evaluation.' },
      },
    },
    hi: {
      title: 'जल की क्षारीयता ज्ञात करना',
      description: 'फेनोल्फथेलिन (P) और मिथाइल ऑरेंज (M) क्षारीयता ज्ञात करें तथा OH⁻, CO₃²⁻ और HCO₃⁻ आयनों की पहचान करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में H₂SO₄ भरें', instruction: '0.02 N H₂SO₄ की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup-flask': { title: '3. फ्लास्क रखें', instruction: 'साफ 250 mL शंक्वाकार फ्लास्क को क्लैंप की गई ब्यूरेट के नीचे रखें।' },
        'add-sample': { title: '4. 100 mL जल का नमूना डालें', instruction: 'शंक्वाकार फ्लास्क में पिपेट से 100 mL क्षारीय जल का नमूना डालें।' },
        'phenolphthalein-titration': { title: '5. फेनोल्फथेलिन अंतिम बिंदु (P)', instruction: '1-2 बूंद फेनोल्फथेलिन डालें (गुलाबी रंग होगा)। फ्लास्क को हिलाते हुए N/50 H₂SO₄ से बूंद-बूंद अनुमापन करें जब तक कि गुलाबी रंग गायब न हो जाए (A ≈ 4.2 mL)।' },
        'methyl-orange-titration': { title: '6. मिथाइल ऑरेंज अंतिम बिंदु (M)', instruction: 'उसी फ्लास्क में 2-3 बूंद मिथाइल ऑरेंज डालें (पीला रंग होगा)। N/50 H₂SO₄ से अनुमापन जारी रखें जब तक पीला रंग हल्के गुलाबी में न बदल जाए (कुल ≈ 12.8 mL)।' },
        'calculation': { title: '7. गणना एवं आयन निर्धारण', instruction: 'फेनोल्फथेलिन क्षारीयता, कुल क्षारीयता और उत्तरदायी आयनों की गणना करें।' },
        'results': { title: '8. अंक विवरण', instruction: 'अपनी प्रयोगशाला सटीकता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'पाण्याची अल्कधर्मीयता (Alkalinity) निश्चित करणे',
      description: 'फेनॉल्फथलीन (P) आणि मिथाईल ऑरेंज (M) अल्कधर्मीयता निश्चित करा आणि OH⁻, CO₃²⁻, HCO₃⁻ आयन ओळखा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये H₂SO₄ भरा', instruction: '0.02 N H₂SO₄ बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup-flask': { title: '3. शंकूपात्र ठेवा', instruction: 'स्वच्छ 250 mL शंकूपात्र ब्युरेटखाली ठेवा.' },
        'add-sample': { title: '4. 100 mL पाण्याचा नमुना घाला', instruction: 'शंकूपात्रात पिपेटने 100 mL पाण्याचा नमुना घाला.' },
        'phenolphthalein-titration': { title: '5. फेनॉल्फथलीन अंतिम बिंदू (P)', instruction: '१-२ थेंब फेनॉल्फथलीन घाला (गुलाबी रंग होईल). शंकूपात्र हलवत N/50 H₂SO₄ ने गुलाबी रंग नाहीसा होईपर्यंत (A ≈ 4.2 mL) थेंब-थेंब अनुमापन करा.' },
        'methyl-orange-titration': { title: '6. मिथाईल ऑरेंज अंतिम बिंदू (M)', instruction: 'त्याच पात्रात २-३ थेंब मिथाईल ऑरेंज घाला (पिवळा रंग होईल). पिवळा रंग फिकट गुलाबी होईपर्यंत (एकूण ≈ 12.8 mL) अनुमापन सुरू ठेवा.' },
        'calculation': { title: '7. गणना आणि आयन शोधणे', instruction: 'फेनॉल्फथलीन आणि मिथाईल ऑरेंज अल्कधर्मीयता मोजा आणि कारणीभूत आयन निश्चित करा.' },
        'results': { title: '8. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि गुण तपासा.' },
      },
    },
  },

  // ── Acidity of Water Sample ──
  'water-acidity': {
    en: {
      title: 'Acidity of Water Sample',
      description: 'Determine methyl orange acidity (mineral acidity) and phenolphthalein acidity (total acidity) using standardized sodium hydroxide.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with NaOH', instruction: 'Drag the 0.02 N NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup-flask': { title: '3. Place Flask', instruction: 'Place the clean conical flask beneath the clamped burette.' },
        'sample-prep': { title: '4. Add 100 mL Water & Dechlorinate', instruction: 'Add 100 mL water sample and add 1 drop N/10 Na₂S₂O₃ to destroy residual chlorine.' },
        'part-a-titration': { title: '5. Part A — Methyl Orange Acidity', instruction: 'Add methyl orange (turns red). Titrate drop-by-drop with N/50 NaOH until red turns to yellow at Y = 2.4 mL.' },
        'part-b-titration': { title: '6. Part B — Total Acidity', instruction: 'Add phenolphthalein. Titrate with N/50 NaOH until faint pink persists for 30 seconds at Z = 5.4 mL.' },
        'calculation': { title: '7. Calculations & Viva', instruction: 'Calculate methyl orange acidity and total phenolphthalein acidity in ppm (mg/L CaCO₃ equivalent).' },
        'results': { title: '8. Score Breakdown', instruction: 'Review your laboratory accuracy and answers.' },
      },
    },
    hi: {
      title: 'जल के नमूने की अम्लता ज्ञात करना',
      description: 'मानकीकृत सोडियम हाइड्रॉक्साइड का उपयोग करके मिथाइल ऑरेंज अम्लता (खनिज अम्लता) और कुल फेनोल्फथेलिन अम्लता ज्ञात करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में NaOH भरें', instruction: '0.02 N NaOH की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup-flask': { title: '3. फ्लास्क रखें', instruction: 'साफ शंक्वाकार फ्लास्क को क्लैंप की गई ब्यूरेट के नीचे रखें।' },
        'sample-prep': { title: '4. 100 mL जल का नमूना डालें एवं क्लोरीन हटाएं', instruction: '100 mL जल का नमूना डालें और अवशिष्ट क्लोरीन हटाने के लिए 1 बूंद N/10 Na₂S₂O₃ डालें।' },
        'part-a-titration': { title: '5. भाग A — मिथाइल ऑरेंज अम्लता', instruction: 'मिथाइल ऑरेंज डालें (लाल रंग होगा)। N/50 NaOH से तब तक अनुमापन करें जब तक लाल रंग बदलकर पीला न हो जाए (Y = 2.4 mL)।' },
        'part-b-titration': { title: '6. भाग B — कुल अम्लता', instruction: 'फेनोल्फथेलिन डालें। N/50 NaOH से तब तक अनुमापन करें जब तक हल्का गुलाबी रंग 30 सेकंड तक बना न रहे (Z = 5.4 mL)।' },
        'calculation': { title: '7. गणना एवं प्रश्नोत्तर', instruction: 'मिथाइल ऑरेंज अम्लता और कुल अम्लता की गणना CaCO₃ समतुल्य के ppm में करें।' },
        'results': { title: '8. अंक विवरण', instruction: 'अपनी प्रयोगशाला सटीकता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'पाण्याच्या नमुन्याची आम्लता निश्चित करणे',
      description: 'सोडियम हायड्रॉक्साइडचा वापर करून मिथाईल ऑरेंज आम्लता (खनिज आम्लता) आणि फेनॉल्फथलीन एकूण आम्लता निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये NaOH भरा', instruction: '0.02 N NaOH बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup-flask': { title: '3. शंकूपात्र ठेवा', instruction: 'स्वच्छ शंकूपात्र ब्युरेटखाली ठेवा.' },
        'sample-prep': { title: '4. 100 mL नमुना घाला आणि क्लोरीन काढा', instruction: '100 mL पाण्याचा नमुना घाला आणि उर्वरित क्लोरीन नष्ट करण्यासाठी 1 थेंब N/10 Na₂S₂O₃ घाला.' },
        'part-a-titration': { title: '5. भाग A — मिथाईल ऑरेंज आम्लता', instruction: 'मिथाईल ऑरेंज घाला (लाल रंग होईल). N/50 NaOH सह लाल रंग पिवळा होईपर्यंत (Y = 2.4 mL) अनुमापन करा.' },
        'part-b-titration': { title: '6. भाग B — एकूण आम्लता', instruction: 'फेनॉल्फथलीन घाला. फिकट गुलाबी रंग ३० सेकंद टिकेपर्यंत (Z = 5.4 mL) अनुमापन करा.' },
        'calculation': { title: '7. गणना आणि प्रश्नोत्तरे', instruction: 'CaCO₃ च्या संदर्भाने ppm मध्ये दोन्ही आम्लता मोजा.' },
        'results': { title: '8. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि गुण तपासा.' },
      },
    },
  },

  // ── Chloride Content by Mohr's Method ──
  'chloride-mohr-method': {
    en: {
      title: "Chloride Content by Mohr's Method",
      description: 'Estimate chloride ion concentration in a water sample by argentometric titration against standardized AgNO₃ using K₂CrO₄ indicator.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with AgNO₃', instruction: 'Drag the 0.02 N AgNO₃ bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup-flask': { title: '3. Place Flask', instruction: 'Place the clean 250 mL conical flask beneath the clamped burette.' },
        'pipette-sample': { title: '4. Add 10 mL Water Sample', instruction: 'Pipette 10 mL of the water sample into the flask. Add a pinch of chloride-free Na₂CO₃.' },
        'add-chromate': { title: '5. Add K₂CrO₄ Indicator', instruction: 'Add 3–4 drops of 5% potassium chromate indicator. Note the bright yellow color.' },
        'titrate-ag': { title: '6. Titrate with AgNO₃', instruction: 'Titrate drop-by-drop with 0.02 N AgNO₃ until a permanent reddish-brown Ag₂CrO₄ precipitate appears at 8.2 mL.' },
        'calculation': { title: '7. Calculations & Viva', instruction: 'Calculate the chloride content in mg/L (ppm) using the burette reading.' },
        'results': { title: '8. Score Breakdown', instruction: 'Review your precipitation titration accuracy and answers.' },
      },
    },
    hi: {
      title: 'मोहर विधि द्वारा क्लोराइड की मात्रा ज्ञात करना',
      description: 'पोटेशियम क्रोमेट सूचक का उपयोग करके मानक सिल्वर नाइट्रेट (AgNO₃) के विरुद्ध जल के नमूने में क्लोराइड आयनों का निर्धारण करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में AgNO₃ भरें', instruction: '0.02 N AgNO₃ की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup-flask': { title: '3. फ्लास्क रखें', instruction: 'साफ 250 mL शंक्वाकार फ्लास्क को क्लैंप की गई ब्यूरेट के नीचे रखें।' },
        'pipette-sample': { title: '4. 10 mL जल का नमूना डालें', instruction: 'फ्लास्क में 10 mL जल का नमूना डालें। थोड़ी मात्रा में क्लोराइड-मुक्त Na₂CO₃ मिलाएं।' },
        'add-chromate': { title: '5. K₂CrO₄ सूचक डालें', instruction: '5% पोटेशियम क्रोमेट सूचक की 3-4 बूंदें डालें। चमकीला पीला रंग देखें।' },
        'titrate-ag': { title: '6. AgNO₃ से अनुमापन करें', instruction: '0.02 N AgNO₃ के साथ तब तक अनुमापन करें जब तक कि 8.2 mL पर स्थायी ईंट जैसा लाल-भूरा Ag₂CrO₄ अवक्षेप न आ जाए।' },
        'calculation': { title: '7. गणना एवं प्रश्नोत्तर', instruction: 'ब्यूरेट पाठ्यांक का उपयोग करके क्लोराइड की मात्रा mg/L (ppm) में ज्ञात करें।' },
        'results': { title: '8. अंक विवरण', instruction: 'अपनी अवक्षेपण अनुमापन सटीकता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'मोहर पद्धतीने क्लोराईडचे प्रमाण निश्चित करणे',
      description: 'पोटॅशियम क्रोमेट दर्शकाचा वापर करून 0.02 N सिल्व्हर नायट्रेट (AgNO₃) सह पाण्याच्या नमुन्यातील क्लोराईडचे प्रमाण निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये AgNO₃ भरा', instruction: '0.02 N AgNO₃ बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup-flask': { title: '3. शंकूपात्र ठेवा', instruction: 'स्वच्छ 250 mL शंकूपात्र ब्युरेटखाली ठेवा.' },
        'pipette-sample': { title: '4. 10 mL पाण्याचा नमुना घाला', instruction: 'पात्रात 10 mL पाण्याचा नमुना घ्या. चिमूटभर क्लोराईड-मुक्त Na₂CO₃ घाला.' },
        'add-chromate': { title: '5. K₂CrO₄ दर्शक घाला', instruction: '५% पोटॅशियम क्रोमेट दर्शकाचे ३-४ थेंब घाला. पिवळा रंग पहा.' },
        'titrate-ag': { title: '6. AgNO₃ सह अनुमापन करा', instruction: '0.02 N AgNO₃ सह विटेसारखा लालसर-तपकिरी Ag₂CrO₄ अवक्षेप येईपर्यंत (8.2 mL) अनुमापन करा.' },
        'calculation': { title: '7. गणना आणि प्रश्नोत्तरे', instruction: 'क्लोराईडचे प्रमाण mg/L (ppm) मध्ये मोजा.' },
        'results': { title: '8. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि गुण तपासा.' },
      },
    },
  },

  // ── Dissolved Oxygen by Winkler's Method ──
  'dissolved-oxygen-winkler': {
    en: {
      title: "Dissolved Oxygen by Winkler's Method",
      description: 'Determine dissolved oxygen (DO) content in a water sample using Winkler iodometric titration with sodium thiosulphate.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with Thiosulphate', instruction: 'Drag the N/50 Na₂S₂O₃ bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup': { title: '3. Place BOD Bottle', instruction: 'Place the 300 mL BOD incubation bottle on the laboratory bench.' },
        'fill-sample': { title: '4. Fill 250 mL Sample (No Bubbles)', instruction: 'Carefully fill 250 mL water sample into the BOD bottle. Avoid trapping any air bubbles.' },
        'oxygen-fixation': { title: '5. Add MnSO₄ & Alkaline KI', instruction: 'Add 2 mL MnSO₄ and 2 mL alkaline KI. Stopper and shake. A brown precipitate of basic manganic oxide forms.' },
        'acidification': { title: '6. Acidify with Conc. H₂SO₄', instruction: 'Add 2 mL concentrated H₂SO₄. The brown precipitate dissolves completely, liberating free golden-brown iodine.' },
        'transfer-titrate': { title: '7. Transfer & Titrate with Thiosulphate', instruction: 'Transfer 100 mL of liberated I₂ solution into the conical flask. Titrate with N/50 Na₂S₂O₃ until straw yellow, add starch (turns dark blue), and continue to colorless endpoint at 7.8 mL.' },
        'calculation': { title: '8. Calculations & Viva', instruction: 'Calculate the dissolved oxygen (DO) concentration in ppm (mg/L).' },
        'results': { title: '9. Score Breakdown', instruction: 'Review your iodometric titration accuracy and evaluation.' },
      },
    },
    hi: {
      title: 'विंकलर विधि द्वारा घुलित ऑक्सीजन (DO) ज्ञात करना',
      description: 'सोडियम थायोसल्फेट के साथ विंकलर आयोडोमेट्रिक अनुमापन द्वारा जल के नमूने में घुलित ऑक्सीजन की सांद्रता ज्ञात करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में थायोसल्फेट भरें', instruction: 'N/50 Na₂S₂O₃ की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup': { title: '3. BOD बोतल रखें', instruction: '300 mL BOD बोतल को लैब बेंच पर रखें।' },
        'fill-sample': { title: '4. 250 mL नमूना भरें (बिना बुलबुले)', instruction: 'BOD बोतल में सावधानी से 250 mL जल का नमूना भरें। हवा का कोई बुलबुला न रहने दें।' },
        'oxygen-fixation': { title: '5. MnSO₄ और क्षारीय KI डालें', instruction: '2 mL MnSO₄ और 2 mL क्षारीय KI डालें। बोतल बंद करके हिलाएं; भूरा अवक्षेप बनेगा।' },
        'acidification': { title: '6. सांद्र H₂SO₄ से अम्लीकृत करें', instruction: '2 mL सांद्र H₂SO₄ डालें। भूरा अवक्षेप घुलकर सुनहरी-भूरी मुक्त आयोडीन छोड़ेगा।' },
        'transfer-titrate': { title: '7. स्थानांतरित करें और थायोसल्फेट से अनुमापन करें', instruction: '100 mL आयोडीन घोल फ्लास्क में लें। N/50 Na₂S₂O₃ से हल्के पीले रंग तक अनुमापन करें, स्टार्च डालें (गहरा नीला रंग), और रंगहीन होने तक अनुमापन जारी रखें (7.8 mL)।' },
        'calculation': { title: '8. गणना एवं प्रश्नोत्तर', instruction: 'घुलित ऑक्सीजन (DO) की सांद्रता mg/L (ppm) में ज्ञात करें।' },
        'results': { title: '9. अंक विवरण', instruction: 'अपनी प्रयोगशाला सटीकता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'विंकलर पद्धतीने विरघळलेला ऑक्सिजन (DO) मोजणे',
      description: 'सोडियम थायोसल्फेटसह आयोडोमेट्रिक अनुमापन करून पाण्यातील विरघळलेल्या ऑक्सिजनचे प्रमाण निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये थायोसल्फेट भरा', instruction: 'N/50 Na₂S₂O₃ बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup': { title: '3. BOD बाटली ठेवा', instruction: '300 mL BOD बाटली लॅब बेंचवर ठेवा.' },
        'fill-sample': { title: '4. 250 mL नमुना भरा (बुडबुडे न येता)', instruction: 'BOD बाटलीत काळजीपूर्वक 250 mL पाण्याचा नमुना भरा. हवेचे बुडबुडे राहणार नाहीत याची खात्री करा.' },
        'oxygen-fixation': { title: '5. MnSO₄ आणि अल्कलाईन KI घाला', instruction: '२ mL MnSO₄ आणि २ mL अल्कलाईन KI घाला. बुच लावून हलवा; तपकिरी अवक्षेप तयार होईल.' },
        'acidification': { title: '6. सल्फ्यूरिक आम्ल घाला', instruction: '२ mL संहत H₂SO₄ घाला. तपकिरी अवक्षेप विरघळून मुक्त आयोडीन तयार होईल.' },
        'transfer-titrate': { title: '7. द्रावण घ्या आणि अनुमापन करा', instruction: '100 mL द्रावण शंकूपात्रात घ्या. N/50 थायोसल्फेटने अनुमापन करा, स्टार्च घाला (निळा रंग), आणि रंगहीन होईपर्यंत (7.8 mL) अनुमापन पूर्ण करा.' },
        'calculation': { title: '8. गणना आणि प्रश्नोत्तरे', instruction: 'विरघळलेल्या ऑक्सिजनचे (DO) प्रमाण mg/L (ppm) मध्ये मोजा.' },
        'results': { title: '9. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि गुण तपासा.' },
      },
    },
  },

  // ── Conductometric Titration (HCl vs NaOH) ──
  'conductometric-titration': {
    en: {
      title: 'Conductometric Titration (HCl vs NaOH)',
      description: 'Determine the concentration of hydrochloric acid by conductometric titration using standard sodium hydroxide solution.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with NaOH', instruction: 'Drag the 0.1 N NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup-vessel': { title: '3. Equilibrate Vessel', instruction: 'Drag the conductivity beaker into the water bath to ensure temperature equilibration at 25°C.' },
        'add-acid-water': { title: '4. Add Acid & Pure Water', instruction: 'Add 10 mL HCl sample followed by 40 mL conductivity water into the beaker.' },
        'initial-conductance': { title: '5. Record Initial Conductance', instruction: 'Conductivity cell is immersed. Observe high initial conductance (~8.40 mS/cm) due to highly mobile H⁺ ions.' },
        'titrate-naoh': { title: '6. Add NaOH Incrementally', instruction: 'Add 0.1 N NaOH drop-by-drop. Conductance steadily decreases to a minimum (2.10 mS/cm) at 10.0 mL, then increases sharply.' },
        'calculation': { title: '7. Calculations & Graph', instruction: 'Calculate the normality and concentration of HCl from the V-curve minimum intersection point.' },
        'results': { title: '8. Final Score & Viva', instruction: 'Review your laboratory performance and scoring evaluation.' },
      },
    },
    hi: {
      title: 'चालकतामितीय अनुमापन (HCl बनाम NaOH)',
      description: 'मानक सोडियम हाइड्रॉक्साइड विलयन का उपयोग करके चालकतामितीय अनुमापन द्वारा हाइड्रोक्लोरिक अम्ल की सांद्रता ज्ञात करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में NaOH भरें', instruction: '0.1 N NaOH की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup-vessel': { title: '3. बीकर तैयार करें', instruction: '25°C पर तापमान स्थिर करने के लिए चालकता बीकर को जल कुंड में रखें।' },
        'add-acid-water': { title: '4. अम्ल और शुद्ध जल डालें', instruction: 'बीकर में 10 mL HCl का नमूना और 40 mL चालकता जल डालें।' },
        'initial-conductance': { title: '5. प्रारंभिक चालकता दर्ज करें', instruction: 'अत्यधिक गतिशील H⁺ आयनों के कारण उच्च प्रारंभिक चालकता (~8.40 mS/cm) दर्ज करें।' },
        'titrate-naoh': { title: '6. NaOH धीरे-धीरे डालें', instruction: '0.1 N NaOH की बूंदें डालें। चालकता घटकर 10.0 mL पर न्यूनतम (2.10 mS/cm) हो जाएगी, फिर तेजी से बढ़ेगी।' },
        'calculation': { title: '7. गणना एवं ग्राफ', instruction: 'V-आकार वक्र के न्यूनतम प्रतिच्छेदन बिंदु से HCl की सामान्यता और सांद्रता की गणना करें।' },
        'results': { title: '8. अंतिम अंक एवं प्रश्नोत्तर', instruction: 'अपनी प्रयोगशाला कार्यकुशलता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'वाहकत्वमितीय अनुमापन (HCl विरुद्ध NaOH)',
      description: 'प्रमाणित सोडियम हायड्रॉक्साइडचा वापर करून वाहकत्वमितीय अनुमापनाद्वारे हायड्रोक्लोरिक आम्लाची संहती निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये NaOH भरा', instruction: '0.1 N NaOH बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup-vessel': { title: '3. पात्र स्थिर करा', instruction: '२५°C तापमान राखण्यासाठी वाहकत्व बीकर जलकुंडात ठेवा.' },
        'add-acid-water': { title: '4. आम्ल आणि शुद्ध पाणी घाला', instruction: 'बीकरमध्ये 10 mL HCl नमुना आणि 40 mL शुद्ध पाणी घाला.' },
        'initial-conductance': { title: '5. सुरुवातीचे वाहकत्व मोजा', instruction: 'गतिशील H⁺ आयनांमुळे सुरुवातीचे जास्त वाहकत्व (~8.40 mS/cm) नोंदवा.' },
        'titrate-naoh': { title: '6. NaOH थेंब-थेंब घाला', instruction: '0.1 N NaOH घाला. वाहकत्व कमी होऊन 10.0 mL ला सर्वात कमी (2.10 mS/cm) होईल आणि नंतर वेगाने वाढेल.' },
        'calculation': { title: '7. गणना आणि आलेख', instruction: 'V-आकाराच्या आलेखावरून HCl ची नॉर्मॅलिटी आणि संहती काढा.' },
        'results': { title: '8. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि गुण तपासा.' },
      },
    },
  },

  // ── pH-Metric Titration (Acid–Base) ──
  'ph-metric-titration': {
    en: {
      title: 'pH-Metric Titration (Acid–Base)',
      description: 'Determine the strength of an unknown hydrochloric acid solution using a standardized pH meter and glass electrode.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with NaOH', instruction: 'Drag the 0.1 M NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'setup-beaker': { title: '3. Setup Stirrer & Beaker', instruction: 'Drag the 100 mL reaction beaker onto the magnetic stirrer plate beneath the burette.' },
        'calibrate-4': { title: '4. Calibrate pH 4 Buffer', instruction: 'Add pH 4.00 buffer to standardize the glass electrode. Check pH meter display.' },
        'calibrate-9': { title: '5. Calibrate pH 9.2 Buffer', instruction: 'Rinse with distilled water and calibrate at pH 9.20. The instrument is now standardized.' },
        'add-hcl': { title: '6. Add 20 mL HCl Sample', instruction: 'Add 20 mL unknown HCl into the clean beaker on the stirrer. Note initial acidic pH.' },
        'titrate-naoh': { title: '7. Titrate with 0.1 M NaOH', instruction: 'Titrate with 0.1 M NaOH while stirring. Observe the sharp pH jump from ~3.5 to ~10.5 at the 20.0 mL equivalence point.' },
        'calculation': { title: '8. Calculations & Viva', instruction: 'Calculate the normality and concentration strength of the unknown HCl solution.' },
        'results': { title: '9. Score Breakdown', instruction: 'Review your potentiometric titration precision and answers.' },
      },
    },
    hi: {
      title: 'pH-मितीय अनुमापन (अम्ल-क्षार)',
      description: 'मानकीकृत pH मीटर और ग्लास इलेक्ट्रोड का उपयोग करके अज्ञात हाइड्रोक्लोरिक अम्ल विलयन की सांद्रता ज्ञात करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में NaOH भरें', instruction: '0.1 M NaOH की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'setup-beaker': { title: '3. स्टिरर और बीकर लगाएं', instruction: '100 mL बीकर को चुंबकीय स्टिरर प्लेट पर ब्यूरेट के नीचे रखें।' },
        'calibrate-4': { title: '4. pH 4 बफर से अंशांकन करें', instruction: 'ग्लास इलेक्ट्रोड को मानकीकृत करने के लिए pH 4.00 बफर डालें। pH मीटर डिस्प्ले जांचें।' },
        'calibrate-9': { title: '5. pH 9.2 बफर से अंशांकन करें', instruction: 'आसुत जल से धोएं और pH 9.20 पर अंशांकित करें। उपकरण अब मानकीकृत है।' },
        'add-hcl': { title: '6. 20 mL HCl का नमूना डालें', instruction: 'स्टिरर पर रखे साफ बीकर में 20 mL अज्ञात HCl डालें। प्रारंभिक अम्लीय pH दर्ज करें।' },
        'titrate-naoh': { title: '7. 0.1 M NaOH से अनुमापन करें', instruction: 'हिलाते हुए 0.1 M NaOH से अनुमापन करें। 20.0 mL तुल्यता बिंदु पर pH का ~3.5 से ~10.5 तक का तीव्र उछाल देखें।' },
        'calculation': { title: '8. गणना एवं प्रश्नोत्तर', instruction: 'अज्ञात HCl विलयन की सामान्यता और सांद्रता सामर्थ्य की गणना करें।' },
        'results': { title: '9. अंक विवरण', instruction: 'अपनी प्रयोगशाला परिशुद्धता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'pH-मितीय अनुमापन (आम्ल-अम्लारी)',
      description: 'प्रमाणित pH मीटर आणि काच इलेक्ट्रोडचा वापर करून अज्ञात हायड्रोक्लोरिक आम्ल द्रावणाची संहती निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये NaOH भरा', instruction: '0.1 M NaOH बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'setup-beaker': { title: '3. स्टिरर आणि बीकर ठेवा', instruction: '100 mL अभिक्रिया बीकर चुंबकीय स्टिररवर ब्युरेटखाली ठेवा.' },
        'calibrate-4': { title: '4. pH 4 बफरने कॅलिब्रेट करा', instruction: 'काच इलेक्ट्रोड प्रमाणित करण्यासाठी pH 4.00 बफर घाला. pH मीटर डिस्प्ले तपासा.' },
        'calibrate-9': { title: '5. pH 9.2 बफरने कॅलिब्रेट करा', instruction: 'डिस्टिल्ड पाण्याने धुवा आणि pH 9.20 वर कॅलिब्रेट करा. उपकरण आता प्रमाणित झाले आहे.' },
        'add-hcl': { title: '6. 20 mL HCl नमुना घाला', instruction: 'बीकरमध्ये 20 mL अज्ञात HCl घाला. सुरुवातीचा आम्लीय pH नोंदवा.' },
        'titrate-naoh': { title: '7. 0.1 M NaOH सह अनुमापन करा', instruction: 'द्रावण ढवळत 0.1 M NaOH घाला. 20.0 mL ला pH मध्ये ~3.5 वरून ~10.5 असा होणारा मोठा बदल पहा.' },
        'calculation': { title: '8. गणना आणि प्रश्नोत्तरे', instruction: 'अज्ञात HCl द्रावणाची नॉर्मॅलिटी आणि संहती निश्चित करा.' },
        'results': { title: '9. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि अचूकता तपासा.' },
      },
    },
  },

  // ── Acid Value of Vegetable Oil ──
  'acid-value-oil': {
    en: {
      title: 'Acid Value of Vegetable Oil',
      description: 'Determine the acid value (free fatty acid content) of a commercial vegetable oil sample by volumetric titration with KOH.',
      steps: {
        'setup-stand': { title: '1. Mount Burette', instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.' },
        'fill-burette': { title: '2. Fill Burette with 0.1 N KOH', instruction: 'Drag the 0.1 N KOH bottle to the top of the burette to fill it up to the 0.0 mL mark.' },
        'place-flask': { title: '3. Place Flask', instruction: 'Place the clean conical flask on the laboratory bench beneath the clamped burette.' },
        'weigh-oil': { title: '4. Add 5.0 g Oil Sample', instruction: 'Weigh and transfer 5.0 g of vegetable oil sample into the conical flask.' },
        'add-alcohol': { title: '5. Add 50 mL Neutral Alcohol', instruction: 'Add 50 mL neutral ethyl alcohol to dissolve free fatty acids.' },
        'warm-and-cool': { title: '6. Heat & Cool', instruction: 'Warm flask on water bath to dissolve all fatty acids, then cool to room temperature. Click Continue when ready.' },
        'titrate-koh': { title: '7. Titrate with 0.1 N KOH', instruction: 'Add 2 drops phenolphthalein. Titrate drop-by-drop with 0.1 N KOH until faint permanent pink persists at V = 3.5 mL.' },
        'calculation': { title: '8. Calculations & Viva', instruction: 'Calculate the acid value of the oil sample in mg KOH / g oil.' },
        'results': { title: '9. Score Breakdown', instruction: 'Review your laboratory precision and scoring evaluation.' },
      },
    },
    hi: {
      title: 'वनस्पति तेल का अम्ल मान ज्ञात करना',
      description: 'KOH के साथ आयतनी अनुमापन द्वारा वनस्पति तेल के नमूने का अम्ल मान (मुक्त वसीय अम्ल मात्रा) ज्ञात करें।',
      steps: {
        'setup-stand': { title: '1. ब्यूरेट स्थापित करें', instruction: 'टूलबॉक्स से 50 mL ब्यूरेट को रिटॉर्ट स्टैंड के क्लैंप पर लगाएं।' },
        'fill-burette': { title: '2. ब्यूरेट में 0.1 N KOH भरें', instruction: '0.1 N KOH की बोतल को ब्यूरेट के शीर्ष पर ले जाकर 0.0 mL निशान तक भरें।' },
        'place-flask': { title: '3. फ्लास्क रखें', instruction: 'साफ शंक्वाकार फ्लास्क को क्लैंप की गई ब्यूरेट के नीचे बेंच पर रखें।' },
        'weigh-oil': { title: '4. 5.0 g तेल का नमूना डालें', instruction: '5.0 g वनस्पति तेल के नमूने को तौलकर शंक्वाकार फ्लास्क में डालें।' },
        'add-alcohol': { title: '5. 50 mL उदासीन अल्कोहल डालें', instruction: 'मुक्त वसीय अम्लों को घोलने के लिए 50 mL उदासीन एथिल अल्कोहल डालें।' },
        'warm-and-cool': { title: '6. गर्म करें और ठंडा करें', instruction: 'वसीय अम्लों को पूरी तरह घोलने के लिए फ्लास्क को जल कुंड में हल्का गर्म करें, फिर कमरे के तापमान पर ठंडा करें।' },
        'titrate-koh': { title: '7. 0.1 N KOH से अनुमापन करें', instruction: '2 बूंद फेनोल्फथेलिन डालें। 0.1 N KOH से तब तक अनुमापन करें जब तक हल्का स्थायी गुलाबी रंग न आ जाए (V = 3.5 mL)।' },
        'calculation': { title: '8. गणना एवं प्रश्नोत्तर', instruction: 'तेल के नमूने के अम्ल मान की गणना mg KOH / g तेल में करें।' },
        'results': { title: '9. अंक विवरण', instruction: 'अपनी प्रयोगशाला सटीकता और स्कोर की समीक्षा करें।' },
      },
    },
    mr: {
      title: 'खाद्य तेलाचे आम्ल मूल्य (Acid Value) निश्चित करणे',
      description: 'KOH सह अनुमापन करून वनस्पती तेलाच्या नमुन्यातील मुक्त फॅटी ॲसिडचे प्रमाण आणि आम्ल मूल्य निश्चित करा.',
      steps: {
        'setup-stand': { title: '1. ब्युरेट लावा', instruction: 'टूलबॉक्समधून 50 mL ब्युरेट रिटॉर्ट स्टँडच्या क्लॅम्पवर लावा.' },
        'fill-burette': { title: '2. ब्युरेटमध्ये 0.1 N KOH भरा', instruction: '0.1 N KOH बाटली ब्युरेटच्या वरच्या तोंडावर नेऊन 0.0 mL खुणेपर्यंत भरा.' },
        'place-flask': { title: '3. शंकूपात्र ठेवा', instruction: 'स्वच्छ शंकूपात्र ब्युरेटखाली लॅब बेंचवर ठेवा.' },
        'weigh-oil': { title: '4. 5.0 g तेलाचा नमुना घाला', instruction: '5.0 g वनस्पती तेलाचा नमुना मोजून शंकूपात्रात घाला.' },
        'add-alcohol': { title: '5. 50 mL न्यूट्रल अल्कोहोल घाला', instruction: 'मुक्त फॅटी ॲसिड विरघळवण्यासाठी 50 mL न्यूट्रल इथाईल अल्कोहोल घाला.' },
        'warm-and-cool': { title: '6. कोमट करा आणि थंड होऊ द्या', instruction: 'फॅटी ॲसिड विरघळण्यासाठी पात्र कोमट करा, नंतर खोलीच्या तापमानाला थंड होऊ द्या.' },
        'titrate-koh': { title: '7. 0.1 N KOH सह अनुमापन करा', instruction: '२ थेंब फेनॉल्फथलीन घाला. फिकट कायमस्वरूपी गुलाबी रंग येईपर्यंत (V = 3.5 mL) अनुमापन करा.' },
        'calculation': { title: '8. गणना आणि प्रश्नोत्तरे', instruction: 'तेलाच्या आम्ल मूल्याची mg KOH / g मध्ये गणना करा.' },
        'results': { title: '9. गुण आणि निकाल', instruction: 'आपल्या प्रयोगाचे मूल्यांकन आणि अचूकता तपासा.' },
      },
    },
  },
};

/**
 * Helper to get localized experiment title.
 */
export function getLocalizedExperimentTitle(expId: string, lang: Language, fallback: string): string {
  return EXPERIMENT_TRANSLATIONS[expId]?.[lang]?.title || fallback;
}

/**
 * Helper to get localized experiment description.
 */
export function getLocalizedExperimentDesc(expId: string, lang: Language, fallback: string): string {
  return EXPERIMENT_TRANSLATIONS[expId]?.[lang]?.description || fallback;
}

/**
 * Helper to get localized step instruction.
 */
export function getLocalizedStep(
  expId: string,
  stepId: string,
  lang: Language,
  fallbackTitle: string,
  fallbackInstruction: string
): { title: string; instruction: string; doGuidance?: string; dontGuidance?: string } {
  const exp = EXPERIMENT_TRANSLATIONS[expId]?.[lang];
  if (exp && exp.steps[stepId]) {
    return {
      title: exp.steps[stepId].title,
      instruction: exp.steps[stepId].instruction,
      doGuidance: exp.steps[stepId].doGuidance,
      dontGuidance: exp.steps[stepId].dontGuidance,
    };
  }
  return {
    title: fallbackTitle,
    instruction: fallbackInstruction,
  };
}
