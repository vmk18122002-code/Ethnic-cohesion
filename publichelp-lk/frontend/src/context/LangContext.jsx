import { createContext, useContext, useEffect, useState } from 'react';

// Full-site UI copy in Sinhala, Tamil and English.
// NOTE: machine/best-effort translation — have native speakers review before
// relying on this for real government guidance (same caution as the passport
// case content in data/passport.js).
const STRINGS = {
  en: {
    tagline: 'Government services, made clear',
    heroTitle: 'Your passport, step by step.',
    heroSub: 'Ask in Sinhala, Tamil or English. Get the official steps, documents and fees — each with a source link and last-checked date.',
    newPassport: 'New passport', child: 'Child passport', lost: 'Lost passport', abroad: 'I am abroad',
    signIn: 'Sign in', signUp: 'Create account', getStarted: 'Get started', notClear: 'Not clear? Call 1962',
    askPlaceholder: 'e.g. I lost my passport while working in Dubai',

    // Nav / footer
    navHow: 'How it works', navServices: 'Services', navTrust: 'Trust & safety', navImpact: 'Impact',
    statCases: 'passport cases verified', statLangs: 'languages: සිං · த · EN', statForms: 'official forms mapped', statHotline: 'hotline, one tap away',
    footerTagline: 'A multilingual government-service guidance assistant for Sri Lanka. Not an official government website — always follow the linked official source.',
    footerPassport: 'Passport', footerHelp: 'Help', footerOfficial: 'Official',
    footerAllCases: 'All cases', footerFeeCalc: 'Fee calculator', footerForms: 'Forms',
    footerHotline: 'Hotline 1962', footerOffices: 'Offices & hours', footerContacts: 'Contacts',
    footerMissions: 'Overseas Missions',
    footerBottom: '© 2026 PublicHelp LK · Research prototype', footerChecked: 'Passport data last checked 12 November 2026',

    // Landing sections
    problemEyebrow: 'The problem', problemTitle: 'Information exists. Turning it into action is the hard part.',
    problemBody: 'Government information is online, but citizens struggle to find, interpret and sequence the official steps for their specific need. PublicHelp LK builds on the existing digital-government ecosystem — it does not replace it.',
    oldLabel: 'Directory', oldTitle: 'Find information',
    oldList: ['Information organised by agency', 'You work out the order of steps', 'Language versions vary page to page', "Hard to tell what's current"],
    newLabel: 'Task-oriented guide', newTitle: 'Understand goal → guide action',
    newList: ['Guidance starts from your real-life goal', 'Steps sequenced around your task', 'One guided path in Sinhala, Tamil or English', 'A source + last-checked date on every step'],

    howEyebrow: 'How it works', howTitle: 'From a question to an official next step — in 5 moves',
    howBody: 'The proposed user journey, built into every passport guide.',
    journeySteps: [
      { title: 'Ask a real-life question', text: 'In Sinhala, Tamil or English — in your own words.' },
      { title: 'Detect goal & language', text: 'We identify the task you are trying to complete.' },
      { title: 'Retrieve official evidence', text: 'Only details confirmed on official pages are used.' },
      { title: 'Present a clear sequence', text: 'Numbered steps, documents and fees, in order.' },
      { title: 'Link to the agency', text: 'Every step points to the responsible department.' },
    ],
    stepWord: 'STEP',
    safetyNote: 'Safety rule: if official evidence is missing or unclear, we say so and direct you to the responsible agency — never a guess.',

    servicesEyebrow: 'Services', servicesTitle: 'Passports and driving licences are live. Growing to every common task.',
    servicesBody: 'Target scope: 10–20 common government-service tasks, each tested against a human-verified answer key. Passports and driving licences are live now.',
    services: [
      { title: 'Passport services', text: '15 verified cases: new, urgent, child, lost, overseas, amendments and more.', live: true },
      { title: 'Driving licence', text: "Learner's permit, new licence, renewal, lost licence and international permit.", live: true },
      { title: 'Birth certificate copy', text: 'Order a certified copy from the Registrar General.' },
      { title: 'National Identity Card', text: 'First NIC, replacement and corrections.' },
      { title: 'Police clearance', text: 'Certificates for overseas employment and migration.' },
      { title: 'Marriage registration', text: 'Registering a marriage and obtaining copies.' },
    ],
    liveTag: '● Live', comingSoon: 'Coming soon', openGuide: 'Open guide',

    trustEyebrow: 'Trust & safety', trustTitle: 'Public-service guidance must be trustworthy', trustBody: 'Each risk is paired with a safeguard.',
    risks: [
      ['Outdated information', 'Official source link + last-checked date'],
      ['Missing or unclear evidence', 'State the uncertainty; direct to the responsible agency'],
      ['Incorrect task interpretation', 'Make the identified goal and steps easy to review'],
      ['Language ambiguity', 'Keep the same verified meaning across languages'],
    ],
    pillSource: 'Source link on every step', pillChecked: 'Last checked: 12 Nov 2026', pillVerified: 'Human-verified answer key',

    impactEyebrow: 'SDG alignment & impact', impactTitle: 'Accessible, transparent public institutions',
    sdg16Title: 'Peace, Justice and Strong Institutions', sdg16Body: 'Primary goal — especially accessible and transparent public institutions.',
    sdg10Title: 'Reduced Inequalities', sdg10Body: 'Supporting goal — if the project measurably reduces language or access barriers.',
    ctaTitle: 'Ready to sort out your passport?', ctaBody: 'Create a free account to save your progress, tick off documents and calculate fees.',

    // Sidebar / dashboard chrome
    navMain: 'Main', navPassportGroup: 'Passport services', navOtherGroup: 'Other services', navAccount: 'Account',
    navOverview: 'Overview', navAssistant: 'Ask the assistant', navGuide: 'Passport guide', navJourneys: 'My journeys',
    navFees: 'Fee calculator', navForms: 'Forms & downloads', navOffices: 'Offices & hours', navContacts: 'Contacts',
    navBirth: 'Birth certificate', navNic: 'National ID (NIC)', navDriving: 'Driving licence', navPolice: 'Police clearance',
    navProfile: 'Profile & settings', soon: 'Soon', signOut: 'Sign out',
    topSearchPlaceholder: 'Ask anything… e.g. passport for my baby',

    // Overview
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
    overviewIntro: 'What do you need to do today? Pick a task below or ask a question in your own words — in Sinhala, Tamil or English.',
    askAssistantBtn: 'Ask the assistant', calcFees: 'Calculate fees',
    actionNew: 'Ordinary, urgent, dual citizen', actionChild: 'Separate passport for under-16s',
    actionLost: 'Report, cancel and replace', actionAbroad: 'Apply through a Mission',
    myJourneys: 'My journeys', seeAll: 'See all', noJourneysTitle: 'No journeys yet',
    noJourneysBody: 'Open any passport case and tick steps or documents — your progress is saved here.',
    browseCases: 'Browse passport cases', goodToKnow: 'Good to know', importantPoints: 'Important points',
    headOfficeHours: 'Head Office hours', allOffices: 'All offices →', updated: 'Updated', viewSteps: 'View steps',
    passportChecked: 'Passport data checked 12 Nov 2026',

    // Assistant
    assistantHeadline: 'What do you need help with?',
    assistantIntro: "Describe your situation in Sinhala, Tamil or English. I only answer from verified official sources — if I'm not sure, I'll tell you who to call.",
    detected: 'Detected', clearMatch: 'Clear match', confirmTask: 'Please confirm this is your task',
    looksLikeYouWant: 'It looks like you want to:', openFullGuide: 'Open full guide & checklist', notQuite: 'Not quite? Try:',
    moreSteps: 'more steps', callHotline: 'Call 1962', askBtn: 'Ask',

    // Cases
    allCasesTab: 'All cases', filterCases: 'Filter cases…', noCasesMatch: 'No cases match. Try the assistant or call 1962.',

    // Case detail
    backToCases: 'All passport cases', caseWord: 'Case', factWhere: 'Where', factFee: 'Fee', factTime: 'Time',
    stepByStep: 'Step-by-step', tapStep: "Tap a step when you've done it",
    docsChecklist: 'Documents checklist', bringOriginals: 'Bring originals + photocopies',
    specialSituations: 'Special situations', done: 'done', of: 'of',
    saving: 'Saving…', savedToAccount: 'Saved to your account', resetProgress: 'Reset progress',
    notClearTitle: 'Not clear?', notClearBody: 'If anything is missing or unclear, the Department is the final authority.',
    sourceLabel: 'Official source', lastCheckedLabel: 'last checked',

    // Fees
    feesStep1: '1. Passport type', feesStep2: '2. Service', feesStep3: '3. Was a passport lost?', feesStep4: '4. Extra services',
    svcNormal: 'Normal · 30 days', svcUrgent: 'Urgent · same day', svcNone: 'No new passport',
    lostNo: 'No', lostWithin1: 'Within 1 year', lostAfter1: 'After 1 year',
    officialFeeTable: 'Official fee table', colPassport: 'Passport', colNormal: 'Normal', colUrgent: 'Urgent',
    colService: 'Service', colFee: 'Fee', colNote: 'Note',
    estimatedTotal: 'Estimated total', delivery: 'Delivery', nothingSelected: 'Nothing selected', validity: 'Validity',

    // Forms/Offices/Contacts
    allForms: 'All forms', inSriLanka: 'In Sri Lanka', overseas: 'Overseas',
    formsAlert: 'Downloaded forms should be laser printed on A4 paper. Forms are also free at the Head Office, Regional Offices, Divisional Secretariats and Overseas Missions.',
    officialDownloads: 'Official downloads page', source: 'Source', lastChecked: 'last checked',
    headOffice: 'Head Office', locationMap: 'Location map', regionalOffices: 'Regional offices',
    overseasFpYes: 'Overseas-passport fingerprints listed', overseasFpNo: 'Overseas fingerprints not listed — check first',
    workingHours: 'Working hours (weekdays)', colOffice: 'Office', colHours: 'Hours',
    officesWarning: 'The official page lists one-day hours for Regional Offices but also says one-day service is Head Office only. Call 1962 before travelling for an urgent application.',
    contactsOverseasNote: 'Overseas? Contact your nearest Sri Lankan Mission.', call: 'Call', email: 'Email',

    // Journeys
    journeysIntro: "Each journey saves which steps you've completed and which documents you've gathered.",
    journeysEmptyBody: 'Open a passport case and tick a step to start tracking.',
    continueWord: 'Continue', stepsWord: 'steps', documentsWord: 'documents',

    // Profile
    memberSince: 'member since', personalDetails: 'Personal details', fullName: 'Full name', nicNumber: 'NIC number',
    mobile: 'Mobile', preferredLanguage: 'Preferred language', saveChanges: 'Save changes',
    changePassword: 'Change password', currentPassword: 'Current password', newPassword: 'New password',
    updatePassword: 'Update password', profileUpdated: 'Profile updated.', passwordChanged: 'Password changed.', optional: 'Optional',

    // Auth
    homeWord: 'Home', welcomeBack: 'Welcome back', signInSub: 'Sign in to continue your passport journey.',
    emailAddress: 'Email address', password: 'Password', newHere: 'New to PublicHelp LK?',
    createAccountTitle: 'Create your account', createAccountSub: 'Free. Takes less than a minute.',
    asOnNic: 'As on your NIC', confirmPassword: 'Confirm password', alreadyHaveAccount: 'Already have an account?',
    authPoints: ['Save progress on every step and document', 'Personal fee calculator and checklists', 'Sinhala, Tamil and English'],
    authHeroTitle: 'Your passport journey,', authHeroGradient: 'saved and guided.',
    strengthWeak: 'Weak', strengthFair: 'Fair', strengthGood: 'Good', strengthStrong: 'Strong',
    consentText: 'I understand PublicHelp LK is a guidance service, not an official government website, and I will confirm details with the Department.',

    // Misc / 404
    comingSoonBody: 'We add a service only after every step is verified against the official source and tested against a human-verified answer key. Passport services are live now.',
    goToGuide: 'Go to passport guide', notFoundTitle: "This page doesn't exist.", backHome: 'Back home',

    // Passport illustration chips
    artFormReady: 'Form K 35 A ready', artSourceChecked: 'Official source · checked', artStep: 'Step 4 of 10',

    // Service picker
    chooseService: 'Which service do you need?', chooseServiceSub: 'Pick one to get the official steps, documents and fees.',
    servicePassport: 'Passport services', servicePassportDesc: '15 verified cases: new, urgent, child, lost, overseas, amendments and more.',
    serviceLicense: 'Driving licence', serviceLicenseDesc: "Learner's permit, new licence, renewal, lost licence, foreign conversion and more.",
    openService: 'Open', vehicleClassesTitle: 'Vehicle classes',
  },

  si: {
    tagline: 'රජයේ සේවා, පැහැදිලිව',
    heroTitle: 'ඔබේ ගමන් බලපත්‍රය, පියවරෙන් පියවර.',
    heroSub: 'සිංහලෙන්, දෙමළෙන් හෝ ඉංග්‍රීසියෙන් අසන්න. නිල පියවර, ලේඛන සහ ගාස්තු — නිල මූලාශ්‍ර සබැඳිය සමඟ.',
    newPassport: 'නව ගමන් බලපත්‍රය', child: 'ළමා ගමන් බලපත්‍රය', lost: 'නැතිවූ ගමන් බලපත්‍රය', abroad: 'මම විදේශයක සිටිමි',
    signIn: 'පිවිසෙන්න', signUp: 'ගිණුමක් සාදන්න', getStarted: 'ආරම්භ කරන්න', notClear: 'පැහැදිලි නැද්ද? 1962 අමතන්න',
    askPlaceholder: 'උදා: මගේ ගමන් බලපත්‍රය නැති වුණා',

    navHow: 'මෙය ක්‍රියා කරන ආකාරය', navServices: 'සේවා', navTrust: 'විශ්වාසය සහ ආරක්ෂාව', navImpact: 'බලපෑම',
    statCases: 'සත්‍යාපිත ගමන් බලපත්‍ර අවස්ථා', statLangs: 'භාෂා: සිං · த · EN', statForms: 'නිල පෝරම සිතියම්ගත කර ඇත', statHotline: 'හදිසි අංකය, එක් ස්පර්ශයකින්',
    footerTagline: 'ශ්‍රී ලංකාව සඳහා බහුභාෂා රාජ්‍ය සේවා මග පෙන්වන සහායකයෙකි. මෙය නිල රජයේ වෙබ් අඩවියක් නොවේ — සෑම විටම සබැඳි නිල මූලාශ්‍රය අනුගමනය කරන්න.',
    footerPassport: 'ගමන් බලපත්‍රය', footerHelp: 'උදව්', footerOfficial: 'නිල',
    footerAllCases: 'සියලු අවස්ථා', footerFeeCalc: 'ගාස්තු ගණකය', footerForms: 'පෝරම',
    footerHotline: 'හදිසි අංකය 1962', footerOffices: 'කාර්යාල සහ වේලාවන්', footerContacts: 'සම්බන්ධතා',
    footerMissions: 'විදේශ දූත මණ්ඩල',
    footerBottom: '© 2026 PublicHelp LK · පර්යේෂණ මූලාකෘතිය', footerChecked: 'ගමන් බලපත්‍ර දත්ත අවසන් වරට පරීක්ෂා කළේ 2026 නොවැම්බර් 12',

    problemEyebrow: 'ගැටලුව', problemTitle: 'තොරතුරු තිබේ. ඒවා ක්‍රියාමාර්ගයක් බවට පත් කිරීම අසීරුය.',
    problemBody: 'රජයේ තොරතුරු අන්තර්ජාලයේ තිබුණත්, තම නිශ්චිත අවශ්‍යතාවය සඳහා නිල පියවර සොයා ගැනීමට, තේරුම් ගැනීමට සහ පිළිවෙළකට සකස් කිරීමට පුරවැසියන් අපහසුතාවයට පත් වෙති. PublicHelp LK පවතින ඩිජිටල් රජයේ පද්ධතිය මත ගොඩනැගේ — එය ප්‍රතිස්ථාපනය නොකරයි.',
    oldLabel: 'නාමාවලිය', oldTitle: 'තොරතුරු සොයන්න',
    oldList: ['ආයතනය අනුව තොරතුරු සංවිධානය කර ඇත', 'පියවර අනුපිළිවෙල ඔබම සොයාගත යුතුය', 'භාෂා අනුවාද පිටුවෙන් පිටුවට වෙනස් වේ', 'වත්මන් තොරතුරු කුමක්දැයි දැන ගැනීම අපහසුය'],
    newLabel: 'කාර්යය-කේන්ද්‍රීය මාර්ගෝපදේශය', newTitle: 'ඉලක්කය තේරුම් ගන්න → ක්‍රියාමාර්ගයට මග පෙන්වයි',
    newList: ['මග පෙන්වීම ඔබේ සැබෑ ජීවිත ඉලක්කයෙන් ආරම්භ වේ', 'පියවර ඔබේ කාර්යය වටා අනුපිළිවෙලින්', 'සිංහල, දෙමළ හෝ ඉංග්‍රීසි එක් මග පෙන්වීමක් පමණි', 'සෑම පියවරකම මූලාශ්‍රය + අවසන් පරීක්ෂා කළ දිනය'],

    howEyebrow: 'මෙය ක්‍රියා කරන ආකාරය', howTitle: 'ප්‍රශ්නයක සිට නිල ඊළඟ පියවරට — පියවර 5කින්',
    howBody: 'සෑම ගමන් බලපත්‍ර මාර්ගෝපදේශයකම ගොඩනගා ඇති යෝජිත පරිශීලක ගමන.',
    journeySteps: [
      { title: 'සැබෑ ජීවිත ප්‍රශ්නයක් අසන්න', text: 'සිංහල, දෙමළ හෝ ඉංග්‍රීසි — ඔබේම වචනවලින්.' },
      { title: 'ඉලක්කය සහ භාෂාව හඳුනාගන්න', text: 'ඔබ සම්පූර්ණ කිරීමට උත්සාහ කරන කාර්යය අපි හඳුනා ගනිමු.' },
      { title: 'නිල සාක්ෂි ලබාගන්න', text: 'නිල පිටුවල තහවුරු කළ විස්තර පමණක් භාවිතා වේ.' },
      { title: 'පැහැදිලි අනුපිළිවෙලක් ඉදිරිපත් කරන්න', text: 'අංකනය කළ පියවර, ලේඛන සහ ගාස්තු, අනුපිළිවෙලින්.' },
      { title: 'ආයතනයට සම්බන්ධ කරන්න', text: 'සෑම පියවරක්ම වගකිව යුතු දෙපාර්තමේන්තුව වෙත යොමු කරයි.' },
    ],
    stepWord: 'පියවර',
    safetyNote: 'ආරක්ෂණ රීතිය: නිල සාක්ෂි නොමැති හෝ අපැහැදිලි නම්, අපි එය පවසා වගකිව යුතු ආයතනය වෙත යොමු කරමු — කිසි විටෙකත් අනුමාන නොකරමු.',

    servicesEyebrow: 'සේවා', servicesTitle: 'ගමන් බලපත්‍ර සහ රියදුරු බලපත්‍ර දැන් සජීවීයි. සෑම පොදු කාර්යයක් සඳහාම වර්ධනය වේ.',
    servicesBody: 'ඉලක්ක විෂය පථය: පොදු රජයේ-සේවා කාර්යයන් 10–20ක්, එක් එක් මනුෂ්‍ය-සත්‍යාපිත පිළිතුරු යතුරකට එරෙහිව පරීක්ෂා කර ඇත. ගමන් බලපත්‍ර සහ රියදුරු බලපත්‍ර දැන් සජීවීයි.',
    services: [
      { title: 'ගමන් බලපත්‍ර සේවා', text: 'සත්‍යාපිත අවස්ථා 15ක්: නව, හදිසි, ළමා, නැතිවූ, විදේශ, සංශෝධන සහ තවත්.', live: true },
      { title: 'රියදුරු බලපත්‍රය', text: 'ඉගෙනුම් බලපත්‍රය, නව බලපත්‍රය, අලුත් කිරීම, නැතිවූ බලපත්‍රය සහ ජාත්‍යන්තර බලපත්‍රය.', live: true },
      { title: 'උප්පැන්න සහතික පිටපත', text: 'රෙජිස්ට්‍රාර් ජනරාල්ගෙන් සහතික කළ පිටපතක් ඇණවුම් කරන්න.' },
      { title: 'ජාතික හැඳුනුම්පත', text: 'පළමු NIC, ප්‍රතිස්ථාපනය සහ නිවැරදි කිරීම්.' },
      { title: 'පොලිස් නිශ්චිත සහතිකය', text: 'විදේශ රැකියා සහ සංක්‍රමණය සඳහා සහතික.' },
      { title: 'විවාහ ලියාපදිංචිය', text: 'විවාහයක් ලියාපදිංචි කිරීම සහ පිටපත් ලබාගැනීම.' },
    ],
    liveTag: '● සජීවී', comingSoon: 'ළඟදීම', openGuide: 'මාර්ගෝපදේශය විවෘත කරන්න',

    trustEyebrow: 'විශ්වාසය සහ ආරක්ෂාව', trustTitle: 'රාජ්‍ය සේවා මග පෙන්වීම විශ්වාසදායක විය යුතුය', trustBody: 'සෑම අවදානමක්ම ආරක්ෂණයක් සමඟ යුගල කර ඇත.',
    risks: [
      ['යල් පැන ගිය තොරතුරු', 'නිල මූලාශ්‍ර සබැඳිය + අවසන් පරීක්ෂා කළ දිනය'],
      ['නැතිවූ හෝ අපැහැදිලි සාක්ෂි', 'අවිනිශ්චිතතාව සඳහන් කරන්න; වගකිව යුතු ආයතනය වෙත යොමු කරන්න'],
      ['වැරදි කාර්ය අර්ථකථනය', 'හඳුනාගත් ඉලක්කය සහ පියවර පහසුවෙන් සමාලෝචනය කළ හැකි කරන්න'],
      ['භාෂා අපැහැදිලිභාවය', 'භාෂා හරහා එකම සත්‍යාපිත අර්ථය පවත්වා ගන්න'],
    ],
    pillSource: 'සෑම පියවරකම මූලාශ්‍ර සබැඳිය', pillChecked: 'අවසන් පරීක්ෂාව: 2026 නොවැ 12', pillVerified: 'මනුෂ්‍ය-සත්‍යාපිත පිළිතුරු යතුර',

    impactEyebrow: 'SDG අනුකූලතාව සහ බලපෑම', impactTitle: 'ප්‍රවේශ විය හැකි, විනිවිද පෙනෙන රාජ්‍ය ආයතන',
    sdg16Title: 'සාමය, යුක්තිය සහ ශක්තිමත් ආයතන', sdg16Body: 'ප්‍රධාන ඉලක්කය — විශේෂයෙන් ප්‍රවේශ විය හැකි සහ විනිවිද පෙනෙන රාජ්‍ය ආයතන.',
    sdg10Title: 'අසමානතා අවම කිරීම', sdg10Body: 'සහායක ඉලක්කය — ව්‍යාපෘතිය භාෂා හෝ ප්‍රවේශ බාධක මනාව අඩු කරන්නේ නම්.',
    ctaTitle: 'ඔබේ ගමන් බලපත්‍රය සකස් කිරීමට සූදානම්ද?', ctaBody: 'ඔබේ ප්‍රගතිය සුරැකීමට, ලේඛන සලකුණු කිරීමට සහ ගාස්තු ගණනය කිරීමට නොමිලේ ගිණුමක් සාදන්න.',

    navMain: 'ප්‍රධාන', navPassportGroup: 'ගමන් බලපත්‍ර සේවා', navOtherGroup: 'අනෙකුත් සේවා', navAccount: 'ගිණුම',
    navOverview: 'දළ විශ්ලේෂණය', navAssistant: 'සහායකගෙන් අසන්න', navGuide: 'ගමන් බලපත්‍ර මාර්ගෝපදේශය', navJourneys: 'මගේ ගමන්',
    navFees: 'ගාස්තු ගණකය', navForms: 'පෝරම සහ බාගත කිරීම්', navOffices: 'කාර්යාල සහ වේලාවන්', navContacts: 'සම්බන්ධතා',
    navBirth: 'උප්පැන්න සහතිකය', navNic: 'ජාතික හැඳුනුම්පත (NIC)', navDriving: 'රියදුරු බලපත්‍රය', navPolice: 'පොලිස් නිශ්චිත සහතිකය',
    navProfile: 'පැතිකඩ සහ සැකසුම්', soon: 'ළඟදීම', signOut: 'පිටවන්න',
    topSearchPlaceholder: 'ඕනෑම දෙයක් අසන්න… උදා: බබාගේ ගමන් බලපත්‍රය',

    goodMorning: 'සුබ උදෑසනක්', goodAfternoon: 'සුබ දහවලක්', goodEvening: 'සුබ සැන්දෑවක්',
    overviewIntro: 'ඔබට අද කුමක් කිරීමට අවශ්‍යද? පහත කාර්යයක් තෝරන්න හෝ ඔබේම වචනවලින් ප්‍රශ්නයක් අසන්න — සිංහල, දෙමළ හෝ ඉංග්‍රීසි භාෂාවෙන්.',
    askAssistantBtn: 'සහායකගෙන් අසන්න', calcFees: 'ගාස්තු ගණනය කරන්න',
    actionNew: 'සාමාන්‍ය, හදිසි, ද්විත්ව පුරවැසි', actionChild: 'අවුරුදු 16ට අඩු අයට වෙනම ගමන් බලපත්‍රය',
    actionLost: 'වාර්තා කර, අවලංගු කර, ප්‍රතිස්ථාපනය කරන්න', actionAbroad: 'දූත මණ්ඩලයක් හරහා අයදුම් කරන්න',
    myJourneys: 'මගේ ගමන්', seeAll: 'සියල්ල බලන්න', noJourneysTitle: 'තවම ගමන් නැත',
    noJourneysBody: 'ඕනෑම ගමන් බලපත්‍ර අවස්ථාවක් විවෘත කර පියවර හෝ ලේඛන සලකුණු කරන්න — ඔබේ ප්‍රගතිය මෙහි සුරැකේ.',
    browseCases: 'ගමන් බලපත්‍ර අවස්ථා පිරික්සන්න', goodToKnow: 'දැන ගැනීම වටී', importantPoints: 'වැදගත් කරුණු',
    headOfficeHours: 'ප්‍රධාන කාර්යාලයේ වේලාවන්', allOffices: 'සියලු කාර්යාල →', updated: 'යාවත්කාලීන කළේ', viewSteps: 'පියවර බලන්න',
    passportChecked: 'ගමන් බලපත්‍ර දත්ත 2026 නොවැ 12 දින පරීක්ෂා කරන ලදී',

    assistantHeadline: 'ඔබට උදව් අවශ්‍ය කුමක්ද?',
    assistantIntro: 'ඔබේ තත්ත්වය සිංහල, දෙමළ හෝ ඉංග්‍රීසි භාෂාවෙන් විස්තර කරන්න. මම පිළිතුරු දෙන්නේ සත්‍යාපිත නිල මූලාශ්‍රවලින් පමණි — මට විශ්වාස නැත්නම්, කාට අමතන්නදැයි මම කියමි.',
    detected: 'හඳුනාගත්', clearMatch: 'පැහැදිලි ගැලපීමක්', confirmTask: 'මෙය ඔබේ කාර්යය බව තහවුරු කරන්න',
    looksLikeYouWant: 'ඔබට අවශ්‍ය බව පෙනෙන්නේ:', openFullGuide: 'සම්පූර්ණ මාර්ගෝපදේශය සහ ලැයිස්තුව විවෘත කරන්න', notQuite: 'හරියටම නැද්ද? උත්සාහ කරන්න:',
    moreSteps: 'තවත් පියවර', callHotline: '1962 අමතන්න', askBtn: 'අසන්න',

    allCasesTab: 'සියලු අවස්ථා', filterCases: 'අවස්ථා පෙරහන් කරන්න…', noCasesMatch: 'අවස්ථා නොගැලපේ. සහායකයා උත්සාහ කරන්න හෝ 1962 අමතන්න.',

    backToCases: 'සියලු ගමන් බලපත්‍ර අවස්ථා', caseWord: 'අවස්ථාව', factWhere: 'කොහේ', factFee: 'ගාස්තුව', factTime: 'කාලය',
    stepByStep: 'පියවරෙන් පියවර', tapStep: 'ඔබ කළ පසු පියවරක් ස්පර්ශ කරන්න',
    docsChecklist: 'ලේඛන ලැයිස්තුව', bringOriginals: 'මුල් පිටපත් + ජායා පිටපත් ගෙන එන්න',
    specialSituations: 'විශේෂ තත්ත්වයන්', done: 'අවසන්', of: '/',
    saving: 'සුරකිමින්…', savedToAccount: 'ඔබේ ගිණුමට සුරකින ලදී', resetProgress: 'ප්‍රගතිය යළි පිහිටුවන්න',
    notClearTitle: 'පැහැදිලි නැද්ද?', notClearBody: 'යමක් අස්ථානගත හෝ අපැහැදිලි නම්, දෙපාර්තමේන්තුව අවසන් බලධාරියා වේ.',
    sourceLabel: 'නිල මූලාශ්‍රය', lastCheckedLabel: 'අවසන් පරීක්ෂාව',

    feesStep1: '1. ගමන් බලපත්‍ර වර්ගය', feesStep2: '2. සේවාව', feesStep3: '3. ගමන් බලපත්‍රයක් නැති වී තිබේද?', feesStep4: '4. අමතර සේවා',
    svcNormal: 'සාමාන්‍ය · දින 30', svcUrgent: 'හදිසි · එදිනම', svcNone: 'නව ගමන් බලපත්‍රයක් නැත',
    lostNo: 'නැත', lostWithin1: 'වසර 1ක් ඇතුළත', lostAfter1: 'වසර 1කට පසු',
    officialFeeTable: 'නිල ගාස්තු වගුව', colPassport: 'ගමන් බලපත්‍රය', colNormal: 'සාමාන්‍ය', colUrgent: 'හදිසි',
    colService: 'සේවාව', colFee: 'ගාස්තුව', colNote: 'සටහන',
    estimatedTotal: 'ඇස්තමේන්තුගත එකතුව', delivery: 'භාරදීම', nothingSelected: 'කිසිවක් තෝරා නැත', validity: 'වලංගුභාවය',

    allForms: 'සියලු පෝරම', inSriLanka: 'ශ්‍රී ලංකාවේ', overseas: 'විදේශගතව',
    formsAlert: 'බාගත කළ පෝරම A4 කඩදාසි මත ලේසර් මුද්‍රණය කළ යුතුය. ප්‍රධාන කාර්යාලයේ, ප්‍රාදේශීය කාර්යාලවල, ප්‍රාදේශීය ලේකම් කාර්යාලවල සහ විදේශ දූත මණ්ඩලවල ද පෝරම නොමිලේ ලබාගත හැක.',
    officialDownloads: 'නිල බාගත කිරීම් පිටුව', source: 'මූලාශ්‍රය', lastChecked: 'අවසන් පරීක්ෂාව',
    headOffice: 'ප්‍රධාන කාර්යාලය', locationMap: 'ස්ථාන සිතියම', regionalOffices: 'ප්‍රාදේශීය කාර්යාල',
    overseasFpYes: 'විදේශ-ගමන් බලපත්‍ර ඇඟිලි සලකුණු ලැයිස්තුගත කර ඇත', overseasFpNo: 'විදේශ ඇඟිලි සලකුණු ලැයිස්තුගත කර නැත — පළමුව පරීක්ෂා කරන්න',
    workingHours: 'වැඩ කරන වේලාවන් (සතියේ දින)', colOffice: 'කාර්යාලය', colHours: 'වේලාවන්',
    officesWarning: 'නිල පිටුවේ ප්‍රාදේශීය කාර්යාල සඳහා එක්දින වේලාවන් ලැයිස්තුගත කර ඇතත්, එක්දින සේවාව ප්‍රධාන කාර්යාලයට පමණක් බවද සඳහන් කරයි. හදිසි අයදුම්පතක් සඳහා යාමට පෙර 1962 අමතන්න.',
    contactsOverseasNote: 'විදේශගතද? ළඟම ඇති ශ්‍රී ලංකා දූත මණ්ඩලය අමතන්න.', call: 'අමතන්න', email: 'විද්‍යුත් තැපෑල',

    journeysIntro: 'සෑම ගමනක්ම ඔබ සම්පූර්ණ කළ පියවර සහ රැස් කළ ලේඛන සුරකියි.',
    journeysEmptyBody: 'ලුහුබැඳීම ආරම්භ කිරීමට ගමන් බලපත්‍ර අවස්ථාවක් විවෘත කර පියවරක් සලකුණු කරන්න.',
    continueWord: 'දිගටම කරගෙන යන්න', stepsWord: 'පියවර', documentsWord: 'ලේඛන',

    memberSince: 'සාමාජිකත්වය ලද දිනය', personalDetails: 'පුද්ගලික විස්තර', fullName: 'සම්පූර්ණ නම', nicNumber: 'NIC අංකය',
    mobile: 'ජංගම දුරකථනය', preferredLanguage: 'කැමති භාෂාව', saveChanges: 'වෙනස්කම් සුරකින්න',
    changePassword: 'මුරපදය වෙනස් කරන්න', currentPassword: 'වත්මන් මුරපදය', newPassword: 'නව මුරපදය',
    updatePassword: 'මුරපදය යාවත්කාලීන කරන්න', profileUpdated: 'පැතිකඩ යාවත්කාලීන කරන ලදී.', passwordChanged: 'මුරපදය වෙනස් කරන ලදී.', optional: 'අත්‍යවශ්‍ය නොවේ',

    homeWord: 'මුල් පිටුව', welcomeBack: 'නැවත සාදරයෙන් පිළිගනිමු', signInSub: 'ඔබේ ගමන් බලපත්‍ර ගමන දිගටම කරගෙන යාමට පිවිසෙන්න.',
    emailAddress: 'විද්‍යුත් තැපැල් ලිපිනය', password: 'මුරපදය', newHere: 'PublicHelp LK සඳහා අලුත්ද?',
    createAccountTitle: 'ඔබේ ගිණුම සාදන්න', createAccountSub: 'නොමිලේ. මිනිත්තුවකටත් අඩු කාලයක් ගතවේ.',
    asOnNic: 'ඔබේ NIC හි ඇති පරිදි', confirmPassword: 'මුරපදය තහවුරු කරන්න', alreadyHaveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
    authPoints: ['සෑම පියවරක සහ ලේඛනයක ම ප්‍රගතිය සුරකින්න', 'පෞද්ගලික ගාස්තු ගණකය සහ ලැයිස්තු', 'සිංහල, දෙමළ සහ ඉංග්‍රීසි'],
    authHeroTitle: 'ඔබේ ගමන් බලපත්‍ර ගමන,', authHeroGradient: 'සුරැකී මග පෙන්වනු ලැබේ.',
    strengthWeak: 'දුර්වලයි', strengthFair: 'සාමාන්‍යයි', strengthGood: 'හොඳයි', strengthStrong: 'ශක්තිමත්',
    consentText: 'PublicHelp LK යනු මග පෙන්වීමේ සේවාවක් මිස නිල රජයේ වෙබ් අඩවියක් නොවන බව මම තේරුම් ගනිමි. මම දෙපාර්තමේන්තුව සමඟ විස්තර තහවුරු කරගන්නෙමි.',

    comingSoonBody: 'සෑම පියවරක්ම නිල මූලාශ්‍රයට එරෙහිව තහවුරු කර මනුෂ්‍ය-සත්‍යාපිත පිළිතුරු යතුරකට එරෙහිව පරීක්ෂා කළ පසුව පමණක් අපි සේවාවක් එකතු කරමු. ගමන් බලපත්‍ර සේවා දැන් සජීවීව ඇත.',
    goToGuide: 'ගමන් බලපත්‍ර මාර්ගෝපදේශයට යන්න', notFoundTitle: 'මෙම පිටුව නොපවතී.', backHome: 'මුල් පිටුවට',

    artFormReady: 'K 35 A පෝරමය සූදානම්', artSourceChecked: 'නිල මූලාශ්‍රය · පරීක්ෂා කළා', artStep: 'පියවර 4/10',

    chooseService: 'ඔබට අවශ්‍ය සේවාව කුමක්ද?', chooseServiceSub: 'නිල පියවර, ලේඛන සහ ගාස්තු ලබාගැනීමට එකක් තෝරන්න.',
    servicePassport: 'ගමන් බලපත්‍ර සේවා', servicePassportDesc: 'සත්‍යාපිත අවස්ථා 15ක්: නව, හදිසි, ළමා, නැතිවූ, විදේශ, සංශෝධන සහ තවත්.',
    serviceLicense: 'රියදුරු බලපත්‍රය', serviceLicenseDesc: 'ඉගෙනුම් බලපත්‍රය, නව බලපත්‍රය, අලුත් කිරීම, නැතිවූ බලපත්‍රය, විදේශ පරිවර්තනය සහ තවත්.',
    openService: 'විවෘත කරන්න', vehicleClassesTitle: 'වාහන පංති',
  },

  ta: {
    tagline: 'அரச சேவைகள், தெளிவாக',
    heroTitle: 'உங்கள் கடவுச்சீட்டு, படிப்படியாக.',
    heroSub: 'சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் கேளுங்கள். அதிகாரபூர்வ படிகள், ஆவணங்கள், கட்டணங்கள் — மூல இணைப்புடன்.',
    newPassport: 'புதிய கடவுச்சீட்டு', child: 'குழந்தை கடவுச்சீட்டு', lost: 'தொலைந்த கடவுச்சீட்டு', abroad: 'நான் வெளிநாட்டில் இருக்கிறேன்',
    signIn: 'உள்நுழைக', signUp: 'கணக்கை உருவாக்கு', getStarted: 'தொடங்குங்கள்', notClear: 'தெளிவில்லையா? 1962 ஐ அழைக்கவும்',
    askPlaceholder: 'உ.தா: எனது கடவுச்சீட்டு தொலைந்துவிட்டது',

    navHow: 'இது எவ்வாறு செயல்படுகிறது', navServices: 'சேவைகள்', navTrust: 'நம்பிக்கை மற்றும் பாதுகாப்பு', navImpact: 'தாக்கம்',
    statCases: 'சரிபார்க்கப்பட்ட கடவுச்சீட்டு வழக்குகள்', statLangs: 'மொழிகள்: සිං · த · EN', statForms: 'அதிகாரபூர்வ படிவங்கள் வரைபடமாக்கப்பட்டன', statHotline: 'அவசர எண், ஒரே தொடுதலில்',
    footerTagline: 'இலங்கைக்கான பல்மொழி அரச சேவை வழிகாட்டி உதவியாளர். இது அதிகாரபூர்வ அரசாங்க இணையதளம் அல்ல — எப்போதும் இணைக்கப்பட்ட அதிகாரபூர்வ மூலத்தைப் பின்பற்றவும்.',
    footerPassport: 'கடவுச்சீட்டு', footerHelp: 'உதவி', footerOfficial: 'அதிகாரபூர்வ',
    footerAllCases: 'அனைத்து வழக்குகளும்', footerFeeCalc: 'கட்டண கணிப்பான்', footerForms: 'படிவங்கள்',
    footerHotline: 'அவசர எண் 1962', footerOffices: 'அலுவலகங்கள் & நேரங்கள்', footerContacts: 'தொடர்புகள்',
    footerMissions: 'வெளிநாட்டு தூதரகங்கள்',
    footerBottom: '© 2026 PublicHelp LK · ஆராய்ச்சி முன்மாதிரி', footerChecked: 'கடவுச்சீட்டு தரவு கடைசியாக சரிபார்க்கப்பட்டது 12 நவம்பர் 2026',

    problemEyebrow: 'பிரச்சினை', problemTitle: 'தகவல் உள்ளது. அதை செயலாக மாற்றுவதே கடினமானது.',
    problemBody: 'அரசாங்க தகவல் இணையத்தில் உள்ளது, ஆனால் தங்கள் குறிப்பிட்ட தேவைக்கான அதிகாரபூர்வ படிகளைக் கண்டறிய, புரிந்துகொள்ள மற்றும் வரிசைப்படுத்த குடிமக்கள் சிரமப்படுகிறார்கள். PublicHelp LK ஏற்கனவே உள்ள டிஜிட்டல்-அரசாங்க சூழலமைப்பின் மீது கட்டமைக்கப்பட்டுள்ளது — அதை மாற்றவில்லை.',
    oldLabel: 'அடைவு', oldTitle: 'தகவலைக் கண்டறியவும்',
    oldList: ['நிறுவனம் வாரியாக தகவல் ஒழுங்கமைக்கப்பட்டுள்ளது', 'படிகளின் வரிசையை நீங்களே கண்டறிய வேண்டும்', 'மொழி பதிப்புகள் பக்கத்திற்கு பக்கம் வேறுபடும்', 'எது தற்போதையது என்று கூற கடினம்'],
    newLabel: 'பணி-சார்ந்த வழிகாட்டி', newTitle: 'இலக்கைப் புரிந்துகொள் → செயலுக்கு வழிகாட்டு',
    newList: ['உங்கள் உண்மையான வாழ்க்கை இலக்கிலிருந்து வழிகாட்டுதல் தொடங்குகிறது', 'உங்கள் பணியைச் சுற்றி படிகள் வரிசைப்படுத்தப்பட்டுள்ளன', 'சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் ஒரே வழிகாட்டப்பட்ட பாதை', 'ஒவ்வொரு படியிலும் ஒரு மூலமும் கடைசியாக சரிபார்க்கப்பட்ட தேதியும்'],

    howEyebrow: 'இது எவ்வாறு செயல்படுகிறது', howTitle: 'ஒரு கேள்வியிலிருந்து அதிகாரபூர்வ அடுத்த படி வரை — 5 நகர்வுகளில்',
    howBody: 'ஒவ்வொரு கடவுச்சீட்டு வழிகாட்டியிலும் கட்டமைக்கப்பட்ட முன்மொழியப்பட்ட பயனர் பயணம்.',
    journeySteps: [
      { title: 'ஒரு உண்மையான வாழ்க்கை கேள்வியைக் கேளுங்கள்', text: 'சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் — உங்கள் சொந்த வார்த்தைகளில்.' },
      { title: 'இலக்கு & மொழியைக் கண்டறியவும்', text: 'நீங்கள் முடிக்க முயற்சிக்கும் பணியை நாங்கள் அடையாளம் காண்கிறோம்.' },
      { title: 'அதிகாரபூர்வ ஆதாரத்தைப் பெறுங்கள்', text: 'அதிகாரபூர்வ பக்கங்களில் உறுதிப்படுத்தப்பட்ட விவரங்கள் மட்டுமே பயன்படுத்தப்படும்.' },
      { title: 'தெளிவான வரிசையை வழங்குங்கள்', text: 'எண்ணிடப்பட்ட படிகள், ஆவணங்கள் மற்றும் கட்டணங்கள், வரிசையாக.' },
      { title: 'நிறுவனத்துடன் இணைக்கவும்', text: 'ஒவ்வொரு படியும் பொறுப்பான துறையை சுட்டிக்காட்டுகிறது.' },
    ],
    stepWord: 'படி',
    safetyNote: 'பாதுகாப்பு விதி: அதிகாரபூர்வ ஆதாரம் இல்லாவிட்டாலோ அல்லது தெளிவில்லாவிட்டாலோ, நாங்கள் அதைக் கூறி பொறுப்பான நிறுவனத்திற்கு வழிகாட்டுவோம் — ஒருபோதும் யூகிக்க மாட்டோம்.',

    servicesEyebrow: 'சேவைகள்', servicesTitle: 'கடவுச்சீட்டு மற்றும் ஓட்டுநர் உரிமம் இப்போது செயலில். ஒவ்வொரு பொதுவான பணிக்கும் வளர்கிறது.',
    servicesBody: 'இலக்கு நோக்கம்: 10–20 பொதுவான அரசு-சேவை பணிகள், ஒவ்வொன்றும் மனித-சரிபார்க்கப்பட்ட பதில் திறவுகோலுக்கு எதிராக சோதிக்கப்பட்டது. கடவுச்சீட்டு மற்றும் ஓட்டுநர் உரிமம் இப்போது செயலில் உள்ளன.',
    services: [
      { title: 'கடவுச்சீட்டு சேவைகள்', text: '15 சரிபார்க்கப்பட்ட வழக்குகள்: புதிய, அவசர, குழந்தை, தொலைந்த, வெளிநாட்டு, திருத்தங்கள் மற்றும் பல.', live: true },
      { title: 'ஓட்டுநர் உரிமம்', text: 'கற்றல் உரிமம், புதிய உரிமம், புதுப்பித்தல், தொலைந்த உரிமம் மற்றும் சர்வதேச உரிமம்.', live: true },
      { title: 'பிறப்பு சான்றிதழ் நகல்', text: 'பதிவாளர் ஜெனரலிடமிருந்து சான்றளிக்கப்பட்ட நகலை ஆர்டர் செய்யுங்கள்.' },
      { title: 'தேசிய அடையாள அட்டை', text: 'முதல் NIC, மாற்றீடு மற்றும் திருத்தங்கள்.' },
      { title: 'போலீஸ் தெளிவு சான்றிதழ்', text: 'வெளிநாட்டு வேலைவாய்ப்பு மற்றும் குடியேற்றத்திற்கான சான்றிதழ்கள்.' },
      { title: 'திருமண பதிவு', text: 'திருமணத்தைப் பதிவு செய்தல் மற்றும் நகல்களைப் பெறுதல்.' },
    ],
    liveTag: '● செயலில்', comingSoon: 'விரைவில்', openGuide: 'வழிகாட்டியைத் திற',

    trustEyebrow: 'நம்பிக்கை மற்றும் பாதுகாப்பு', trustTitle: 'பொது-சேவை வழிகாட்டுதல் நம்பகமானதாக இருக்க வேண்டும்', trustBody: 'ஒவ்வொரு ஆபத்தும் ஒரு பாதுகாப்புடன் இணைக்கப்பட்டுள்ளது.',
    risks: [
      ['காலாவதியான தகவல்', 'அதிகாரபூர்வ மூல இணைப்பு + கடைசியாக சரிபார்க்கப்பட்ட தேதி'],
      ['இல்லாத அல்லது தெளிவற்ற ஆதாரம்', 'நிச்சயமின்மையைக் கூறுங்கள்; பொறுப்பான நிறுவனத்திற்கு வழிகாட்டவும்'],
      ['தவறான பணி விளக்கம்', 'அடையாளம் காணப்பட்ட இலக்கு மற்றும் படிகளை எளிதில் மதிப்பாய்வு செய்யக்கூடியதாக ஆக்குங்கள்'],
      ['மொழி தெளிவின்மை', 'மொழிகளில் ஒரே சரிபார்க்கப்பட்ட அர்த்தத்தை பராமரிக்கவும்'],
    ],
    pillSource: 'ஒவ்வொரு படியிலும் மூல இணைப்பு', pillChecked: 'கடைசியாக சரிபார்க்கப்பட்டது: 12 நவ 2026', pillVerified: 'மனித-சரிபார்க்கப்பட்ட பதில் திறவுகோல்',

    impactEyebrow: 'SDG இணக்கம் & தாக்கம்', impactTitle: 'அணுகக்கூடிய, வெளிப்படையான பொது நிறுவனங்கள்',
    sdg16Title: 'அமைதி, நீதி மற்றும் வலுவான நிறுவனங்கள்', sdg16Body: 'முதன்மை இலக்கு — குறிப்பாக அணுகக்கூடிய மற்றும் வெளிப்படையான பொது நிறுவனங்கள்.',
    sdg10Title: 'குறைந்த சமத்துவமின்மைகள்', sdg10Body: 'ஆதரவு இலக்கு — திட்டம் மொழி அல்லது அணுகல் தடைகளை அளவிடத்தக்க வகையில் குறைத்தால்.',
    ctaTitle: 'உங்கள் கடவுச்சீட்டை சரிசெய்ய தயாரா?', ctaBody: 'உங்கள் முன்னேற்றத்தை சேமிக்க, ஆவணங்களை குறியிட, கட்டணங்களை கணக்கிட இலவச கணக்கை உருவாக்குங்கள்.',

    navMain: 'முதன்மை', navPassportGroup: 'கடவுச்சீட்டு சேவைகள்', navOtherGroup: 'மற்ற சேவைகள்', navAccount: 'கணக்கு',
    navOverview: 'மேலோட்டம்', navAssistant: 'உதவியாளரிடம் கேளுங்கள்', navGuide: 'கடவுச்சீட்டு வழிகாட்டி', navJourneys: 'எனது பயணங்கள்',
    navFees: 'கட்டண கணிப்பான்', navForms: 'படிவங்கள் & பதிவிறக்கங்கள்', navOffices: 'அலுவலகங்கள் & நேரங்கள்', navContacts: 'தொடர்புகள்',
    navBirth: 'பிறப்பு சான்றிதழ்', navNic: 'தேசிய அடையாள அட்டை (NIC)', navDriving: 'ஓட்டுநர் உரிமம்', navPolice: 'போலீஸ் தெளிவு சான்றிதழ்',
    navProfile: 'சுயவிவரம் & அமைப்புகள்', soon: 'விரைவில்', signOut: 'வெளியேறு',
    topSearchPlaceholder: 'எதையும் கேளுங்கள்… உ.தா: எனது குழந்தைக்கு கடவுச்சீட்டு',

    goodMorning: 'காலை வணக்கம்', goodAfternoon: 'மதிய வணக்கம்', goodEvening: 'மாலை வணக்கம்',
    overviewIntro: 'இன்று நீங்கள் என்ன செய்ய வேண்டும்? கீழே ஒரு பணியைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் சொந்த வார்த்தைகளில் ஒரு கேள்வியைக் கேளுங்கள் — சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில்.',
    askAssistantBtn: 'உதவியாளரிடம் கேளுங்கள்', calcFees: 'கட்டணங்களை கணக்கிடுங்கள்',
    actionNew: 'சாதாரண, அவசர, இரட்டை குடியுரிமை', actionChild: '16 வயதுக்குட்பட்டவர்களுக்கு தனி கடவுச்சீட்டு',
    actionLost: 'புகாரளித்து, ரத்து செய்து, மாற்றவும்', actionAbroad: 'தூதரகம் மூலம் விண்ணப்பிக்கவும்',
    myJourneys: 'எனது பயணங்கள்', seeAll: 'அனைத்தையும் காண்க', noJourneysTitle: 'இதுவரை பயணங்கள் இல்லை',
    noJourneysBody: 'ஏதேனும் கடவுச்சீட்டு வழக்கைத் திறந்து படிகள் அல்லது ஆவணங்களைக் குறியிடுங்கள் — உங்கள் முன்னேற்றம் இங்கே சேமிக்கப்படும்.',
    browseCases: 'கடவுச்சீட்டு வழக்குகளை உலாவுங்கள்', goodToKnow: 'தெரிந்துகொள்ள வேண்டியவை', importantPoints: 'முக்கிய குறிப்புகள்',
    headOfficeHours: 'தலைமை அலுவலக நேரங்கள்', allOffices: 'அனைத்து அலுவலகங்களும் →', updated: 'புதுப்பிக்கப்பட்டது', viewSteps: 'படிகளைக் காண்க',
    passportChecked: 'கடவுச்சீட்டு தரவு 12 நவ 2026 அன்று சரிபார்க்கப்பட்டது',

    assistantHeadline: 'உங்களுக்கு என்ன உதவி தேவை?',
    assistantIntro: 'உங்கள் சூழ்நிலையை சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் விவரிக்கவும். நான் சரிபார்க்கப்பட்ட அதிகாரபூர்வ மூலங்களிலிருந்து மட்டுமே பதிலளிக்கிறேன் — எனக்கு உறுதியில்லை என்றால், யாரை அழைக்க வேண்டும் என்று சொல்கிறேன்.',
    detected: 'கண்டறியப்பட்டது', clearMatch: 'தெளிவான பொருத்தம்', confirmTask: 'இது உங்கள் பணி என்பதை உறுதிப்படுத்தவும்',
    looksLikeYouWant: 'உங்களுக்கு தேவை என்று தெரிகிறது:', openFullGuide: 'முழு வழிகாட்டி & சரிபார்ப்பு பட்டியலைத் திற', notQuite: 'சரியில்லையா? முயற்சிக்கவும்:',
    moreSteps: 'மேலும் படிகள்', callHotline: '1962 ஐ அழைக்கவும்', askBtn: 'கேள்',

    allCasesTab: 'அனைத்து வழக்குகளும்', filterCases: 'வழக்குகளை வடிகட்டுங்கள்…', noCasesMatch: 'வழக்குகள் பொருந்தவில்லை. உதவியாளரை முயற்சிக்கவும் அல்லது 1962 ஐ அழைக்கவும்.',

    backToCases: 'அனைத்து கடவுச்சீட்டு வழக்குகளும்', caseWord: 'வழக்கு', factWhere: 'எங்கே', factFee: 'கட்டணம்', factTime: 'நேரம்',
    stepByStep: 'படிப்படியாக', tapStep: 'நீங்கள் செய்தவுடன் ஒரு படியைத் தட்டவும்',
    docsChecklist: 'ஆவண சரிபார்ப்பு பட்டியல்', bringOriginals: 'மூலப் பிரதிகள் + நகல்களைக் கொண்டு வாருங்கள்',
    specialSituations: 'சிறப்பு சூழ்நிலைகள்', done: 'முடிந்தது', of: '/',
    saving: 'சேமிக்கிறது…', savedToAccount: 'உங்கள் கணக்கில் சேமிக்கப்பட்டது', resetProgress: 'முன்னேற்றத்தை மீட்டமை',
    notClearTitle: 'தெளிவில்லையா?', notClearBody: 'ஏதேனும் விடுபட்டோ தெளிவில்லாமலோ இருந்தால், துறையே இறுதி அதிகாரம்.',
    sourceLabel: 'அதிகாரபூர்வ மூலம்', lastCheckedLabel: 'கடைசியாக சரிபார்க்கப்பட்டது',

    feesStep1: '1. கடவுச்சீட்டு வகை', feesStep2: '2. சேவை', feesStep3: '3. கடவுச்சீட்டு தொலைந்ததா?', feesStep4: '4. கூடுதல் சேவைகள்',
    svcNormal: 'சாதாரணம் · 30 நாட்கள்', svcUrgent: 'அவசரம் · அதே நாள்', svcNone: 'புதிய கடவுச்சீட்டு இல்லை',
    lostNo: 'இல்லை', lostWithin1: '1 வருடத்திற்குள்', lostAfter1: '1 வருடத்திற்குப் பிறகு',
    officialFeeTable: 'அதிகாரபூர்வ கட்டண அட்டவணை', colPassport: 'கடவுச்சீட்டு', colNormal: 'சாதாரணம்', colUrgent: 'அவசரம்',
    colService: 'சேவை', colFee: 'கட்டணம்', colNote: 'குறிப்பு',
    estimatedTotal: 'மதிப்பிடப்பட்ட மொத்தம்', delivery: 'வழங்கல்', nothingSelected: 'எதுவும் தேர்ந்தெடுக்கப்படவில்லை', validity: 'செல்லுபடியாகும் தன்மை',

    allForms: 'அனைத்து படிவங்களும்', inSriLanka: 'இலங்கையில்', overseas: 'வெளிநாட்டில்',
    formsAlert: 'பதிவிறக்கம் செய்யப்பட்ட படிவங்கள் A4 காகிதத்தில் லேசர் அச்சிடப்பட வேண்டும். தலைமை அலுவலகம், மாகாண அலுவலகங்கள், பிரிவு செயலகங்கள் மற்றும் வெளிநாட்டு தூதரகங்களிலும் படிவங்கள் இலவசமாக கிடைக்கும்.',
    officialDownloads: 'அதிகாரபூர்வ பதிவிறக்க பக்கம்', source: 'மூலம்', lastChecked: 'கடைசியாக சரிபார்க்கப்பட்டது',
    headOffice: 'தலைமை அலுவலகம்', locationMap: 'இருப்பிட வரைபடம்', regionalOffices: 'மாகாண அலுவலகங்கள்',
    overseasFpYes: 'வெளிநாட்டு-கடவுச்சீட்டு விரல்ரேகைகள் பட்டியலிடப்பட்டுள்ளன', overseasFpNo: 'வெளிநாட்டு விரல்ரேகைகள் பட்டியலிடப்படவில்லை — முதலில் சரிபார்க்கவும்',
    workingHours: 'வேலை நேரங்கள் (வார நாட்களில்)', colOffice: 'அலுவலகம்', colHours: 'நேரங்கள்',
    officesWarning: 'அதிகாரபூர்வ பக்கம் மாகாண அலுவலகங்களுக்கான ஒரு நாள் நேரங்களை பட்டியலிடுகிறது, ஆனால் ஒரு நாள் சேவை தலைமை அலுவலகத்திற்கு மட்டுமே என்றும் கூறுகிறது. அவசர விண்ணப்பத்திற்கு பயணிக்கும் முன் 1962 ஐ அழைக்கவும்.',
    contactsOverseasNote: 'வெளிநாட்டிலா? உங்களுக்கு அருகிலுள்ள இலங்கை தூதரகத்தை தொடர்பு கொள்ளவும்.', call: 'அழைக்கவும்', email: 'மின்னஞ்சல்',

    journeysIntro: 'ஒவ்வொரு பயணமும் நீங்கள் முடித்த படிகள் மற்றும் சேகரித்த ஆவணங்களைச் சேமிக்கிறது.',
    journeysEmptyBody: 'கண்காணிப்பைத் தொடங்க ஒரு கடவுச்சீட்டு வழக்கைத் திறந்து ஒரு படியைக் குறியிடுங்கள்.',
    continueWord: 'தொடரவும்', stepsWord: 'படிகள்', documentsWord: 'ஆவணங்கள்',

    memberSince: 'உறுப்பினரான தேதி', personalDetails: 'தனிப்பட்ட விவரங்கள்', fullName: 'முழு பெயர்', nicNumber: 'NIC எண்',
    mobile: 'மொபைல்', preferredLanguage: 'விருப்பமான மொழி', saveChanges: 'மாற்றங்களை சேமிக்கவும்',
    changePassword: 'கடவுச்சொல்லை மாற்றவும்', currentPassword: 'தற்போதைய கடவுச்சொல்', newPassword: 'புதிய கடவுச்சொல்',
    updatePassword: 'கடவுச்சொல்லை புதுப்பிக்கவும்', profileUpdated: 'சுயவிவரம் புதுப்பிக்கப்பட்டது.', passwordChanged: 'கடவுச்சொல் மாற்றப்பட்டது.', optional: 'விருப்பத்திற்குரியது',

    homeWord: 'முகப்பு', welcomeBack: 'மீண்டும் வரவேற்கிறோம்', signInSub: 'உங்கள் கடவுச்சீட்டு பயணத்தைத் தொடர உள்நுழையவும்.',
    emailAddress: 'மின்னஞ்சல் முகவரி', password: 'கடவுச்சொல்', newHere: 'PublicHelp LK க்கு புதியவரா?',
    createAccountTitle: 'உங்கள் கணக்கை உருவாக்குங்கள்', createAccountSub: 'இலவசம். ஒரு நிமிடத்திற்கும் குறைவான நேரம் எடுக்கும்.',
    asOnNic: 'உங்கள் NIC இல் உள்ளபடி', confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்', alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    authPoints: ['ஒவ்வொரு படி மற்றும் ஆவணத்திலும் முன்னேற்றத்தை சேமிக்கவும்', 'தனிப்பட்ட கட்டண கணிப்பான் மற்றும் சரிபார்ப்பு பட்டியல்கள்', 'சிங்களம், தமிழ் மற்றும் ஆங்கிலம்'],
    authHeroTitle: 'உங்கள் கடவுச்சீட்டு பயணம்,', authHeroGradient: 'சேமிக்கப்பட்டு வழிகாட்டப்படுகிறது.',
    strengthWeak: 'பலவீனம்', strengthFair: 'சராசரி', strengthGood: 'நல்லது', strengthStrong: 'வலுவானது',
    consentText: 'PublicHelp LK ஒரு வழிகாட்டி சேவை என்றும், அதிகாரபூர்வ அரசாங்க இணையதளம் அல்ல என்றும் நான் புரிந்துகொள்கிறேன், மேலும் துறையுடன் விவரங்களை உறுதிப்படுத்துவேன்.',

    comingSoonBody: 'ஒவ்வொரு படியும் அதிகாரபூர்வ மூலத்திற்கு எதிராக சரிபார்க்கப்பட்டு, மனித-சரிபார்க்கப்பட்ட பதில் திறவுகோலுக்கு எதிராக சோதிக்கப்பட்ட பிறகே நாங்கள் ஒரு சேவையைச் சேர்க்கிறோம். கடவுச்சீட்டு சேவைகள் இப்போது செயலில் உள்ளன.',
    goToGuide: 'கடவுச்சீட்டு வழிகாட்டிக்குச் செல்லவும்', notFoundTitle: 'இந்தப் பக்கம் இல்லை.', backHome: 'முகப்புக்குத் திரும்பு',

    artFormReady: 'K 35 A படிவம் தயார்', artSourceChecked: 'அதிகாரபூர்வ மூலம் · சரிபார்க்கப்பட்டது', artStep: 'படி 4/10',

    chooseService: 'உங்களுக்கு எந்த சேவை தேவை?', chooseServiceSub: 'அதிகாரபூர்வ படிகள், ஆவணங்கள் மற்றும் கட்டணங்களைப் பெற ஒன்றைத் தேர்ந்தெடுக்கவும்.',
    servicePassport: 'கடவுச்சீட்டு சேவைகள்', servicePassportDesc: '15 சரிபார்க்கப்பட்ட வழக்குகள்: புதிய, அவசர, குழந்தை, தொலைந்த, வெளிநாட்டு, திருத்தங்கள் மற்றும் பல.',
    serviceLicense: 'ஓட்டுநர் உரிமம்', serviceLicenseDesc: 'கற்றல் உரிமம், புதிய உரிமம், புதுப்பித்தல், தொலைந்த உரிமம், வெளிநாட்டு மாற்றம் மற்றும் பல.',
    openService: 'திற', vehicleClassesTitle: 'வாகன வகுப்புகள்',
  },
};

export const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'si', label: 'සිංහල', short: 'සිං' },
  { code: 'ta', label: 'தமிழ்', short: 'த' },
];

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('phlk_lang') || 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    try { localStorage.setItem('phlk_lang', lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
