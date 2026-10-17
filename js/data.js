/**
 * JobUdaan - Standalone Data Store (js/data.js)
 * Manages Jobs, Mock Tests, Daily GK, and Study Material in localStorage.
 * No external API required! Runs directly in any browser.
 */

const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "GSSSB Senior Clerk & Head Clerk Recruitment 2026",
    organization: "Gujarat Subordinate Service Selection Board (GSSSB)",
    sector: "GOVERNMENT",
    department: "General Administrative Department",
    vacancies: 480,
    salary: "₹19,950 - ₹63,200 (Level 4)",
    qualification: "Any Graduate Degree / B.A / B.Com / B.Sc / B.Tech",
    state: "Gujarat",
    city: "Gandhinagar / All Districts",
    lastDate: "2026-11-20",
    applicationFee: "₹100 (General) / Exempted (Reserved)",
    ageLimit: "20 to 35 Years",
    description: "Recruitment for Senior Clerk, Head Clerk and Office Assistant in Gujarat Secretariat and District Collector offices under CCE framework.",
    applyUrl: "https://ojas.gujarat.gov.in",
    isVerified: true
  },
  {
    id: "job-2",
    title: "Gujarat Police Constable & PSI Recruitment 2026",
    organization: "Gujarat Police Recruitment Board (LRB)",
    sector: "GOVERNMENT",
    department: "Home Department",
    vacancies: 12472,
    salary: "₹26,000 - ₹81,100 (Level 5)",
    qualification: "12th Pass (HSC) for Constable / Graduate for PSI",
    state: "Gujarat",
    city: "All Gujarat Districts",
    lastDate: "2026-11-30",
    applicationFee: "₹100",
    ageLimit: "18 to 33 Years",
    description: "Massive recruitment drive for Unarmed Constable, Armed Police, SRPF, Jail Sepoy, and Police Sub-Inspectors across Gujarat.",
    applyUrl: "https://ojas.gujarat.gov.in",
    isVerified: true
  },
  {
    id: "job-3",
    title: "Drug Inspector (Class-2) & Junior Pharmacist",
    organization: "GPSC & CDSCO Western Zone",
    sector: "GOVERNMENT",
    department: "Food & Drugs Control Administration (FDCA)",
    vacancies: 95,
    salary: "₹44,900 - ₹1,42,400 (Level 8)",
    qualification: "B.Pharm / M.Pharm / Pharmaceutical Science",
    state: "Gujarat",
    city: "Ahmedabad & Vadodara",
    lastDate: "2026-12-05",
    applicationFee: "₹100",
    ageLimit: "21 to 36 Years",
    description: "Inspection of pharmaceutical manufacturing plants, retail chemist oversight, and enforcement of Drugs and Cosmetics Act 1940.",
    applyUrl: "https://gpsc.gujarat.gov.in",
    isVerified: true
  },
  {
    id: "job-4",
    title: "Railway RRB Non-Technical (NTPC) & Station Master",
    organization: "Railway Recruitment Control Board (RRB)",
    sector: "GOVERNMENT",
    department: "Ministry of Railways",
    vacancies: 11558,
    salary: "₹35,400 - ₹1,12,400",
    qualification: "Any Bachelor's Degree",
    state: "All India",
    city: "Western Railway (Ahmedabad/Mumbai)",
    lastDate: "2026-11-15",
    applicationFee: "₹500 (₹400 refundable on CBT)",
    ageLimit: "18 to 36 Years",
    description: "Station Master, Goods Train Manager, Senior Commercial cum Ticket Clerk across Indian Railways divisions.",
    applyUrl: "https://rrbahmedabad.gov.in",
    isVerified: true
  },
  {
    id: "job-5",
    title: "TCS National Qualifier Test (NQT) Freshers Drive 2026",
    organization: "Tata Consultancy Services (TCS)",
    sector: "PRIVATE",
    department: "IT & Engineering Services",
    vacancies: 25000,
    salary: "₹3.80 LPA - ₹9.20 LPA (Ninja & Digital Roles)",
    qualification: "B.E / B.Tech / BCA / MCA / B.Sc (IT/CS)",
    state: "All India",
    city: "Ahmedabad, Gandhinagar, Pune, Bengaluru",
    lastDate: "2026-11-25",
    applicationFee: "Free",
    ageLimit: "2024, 2025 & 2026 Batches",
    description: "Entry-level software engineer, cloud trainee, and full-stack developer hiring across TCS pan-India development centers.",
    applyUrl: "https://www.tcs.com/careers",
    isVerified: true
  },
  {
    id: "job-6",
    title: "Quality Assurance (QA) & QC Executive",
    organization: "Sun Pharmaceutical Industries Ltd.",
    sector: "PRIVATE",
    department: "Pharmaceutical Manufacturing",
    vacancies: 60,
    salary: "₹4.50 LPA - ₹7.00 LPA",
    qualification: "B.Pharm / M.Pharm / M.Sc Chemistry",
    state: "Gujarat",
    city: "Halol & Vadodara",
    lastDate: "2026-12-10",
    applicationFee: "Free",
    ageLimit: "21 to 32 Years",
    description: "HPLC, dissolution testing, analytical method validation, and GMP documentation in USFDA-approved manufacturing facility.",
    applyUrl: "https://sunpharma.com/careers",
    isVerified: true
  },
  {
    id: "job-7",
    title: "Graduate Engineer Trainee (GET) - Civil & Mechanical",
    organization: "Larsen & Toubro (L&T Construction)",
    sector: "PRIVATE",
    department: "Heavy Civil Infrastructure",
    vacancies: 180,
    salary: "₹6.00 LPA + Site Allowances",
    qualification: "B.Tech Civil / Mechanical Engineering",
    state: "Gujarat",
    city: "Surat & Hazira",
    lastDate: "2026-11-18",
    applicationFee: "Free",
    ageLimit: "Graduating batch with 60%+",
    description: "Bridge construction, metro rail projects, and structural design execution with L&T heavy civil division.",
    applyUrl: "https://www.larsentoubro.com/careers",
    isVerified: true
  },
  {
    id: "job-8",
    title: "SBI Junior Associate (Customer Support & Sales)",
    organization: "State Bank of India (SBI)",
    sector: "GOVERNMENT",
    department: "Banking & Financial Services",
    vacancies: 8773,
    salary: "₹19,900 - ₹47,920",
    qualification: "Graduation in any discipline",
    state: "Gujarat",
    city: "Branches across Gujarat",
    lastDate: "2026-12-01",
    applicationFee: "₹750",
    ageLimit: "20 to 28 Years",
    description: "Front office customer handling, cash management, loan account documentation, and digital banking assistance.",
    applyUrl: "https://sbi.co.in/careers",
    isVerified: true
  }
];

const INITIAL_MOCK_TESTS = [
  {
    id: "test-gsssb-cce",
    slug: "gsssb-cce-model-paper",
    title: "GSSSB CCE Senior Clerk & Head Clerk Model Paper 2026",
    category: "GSSSB",
    categoryName: "GSSSB CCE",
    totalQuestions: 25,
    durationMinutes: 30,
    totalMarks: 25,
    negativeMarks: 0.25,
    language: "Gujarati",
    difficulty: "Medium",
    description: "Comprehensive practice paper for GSSSB Clerk exams covering Gujarati Grammar, Reasoning, and Constitution.",
    questions: [
      {
        id: 1,
        question: "નીચેનામાંથી કયો શબ્દ 'અલંકાર' નો સાચો પ્રકાર નથી?",
        options: {
          A: "ઉપમા",
          B: "રૂપક",
          C: "છંદાવલી",
          D: "ઉત્પ્રેક્ષા"
        },
        correctAnswer: "C",
        explanation: "ઉપમા, રૂપક અને ઉત્પ્રેક્ષા એ અર્થાલંકારના પ્રકારો છે, જ્યારે છંદાવલી એ કોઈ અલંકાર નથી.",
        subject: "Gujarati Grammar"
      },
      {
        id: 2,
        question: "ગુજરાત પંચાયત અધિનિયમ કયા વર્ષમાં પસાર કરવામાં આવ્યો હતો?",
        options: {
          A: "1961",
          B: "1993",
          C: "1950",
          D: "2002"
        },
        correctAnswer: "B",
        explanation: "73મા બંધારણીય સુધારા બાદ ગુજરાતમાં 'ગુજરાત પંચાયત અધિનિયમ, 1993' અમલમાં આવ્યો હતો.",
        subject: "Panchayati Raj"
      },
      {
        id: 3,
        question: "જો CODE = 24 અને DANCE = 27 હોય, તો CLERK નો સરવાળો કેટલો થાય?",
        options: {
          A: "53",
          B: "51",
          C: "49",
          D: "47"
        },
        correctAnswer: "A",
        explanation: "C(3) + L(12) + E(5) + R(18) + K(11) = 49. Alphabetical position logic.",
        subject: "Reasoning"
      },
      {
        id: 4,
        question: "ભારતીય બંધારણમાં મૂળભૂત ફરજો કયા અનુચ્છેદ હેઠળ નિર્દેશિત છે?",
        options: {
          A: "અનુચ્છેદ 19",
          B: "અનુચ્છેદ 21-A",
          C: "અનુચ્છેદ 51-A",
          D: "અનુચ્છેદ 32"
        },
        correctAnswer: "C",
        explanation: "42મા બંધારણીય સુધારા 1976 દ્વારા અનુચ્છેદ 51-A હેઠળ મૂળભૂત ફરજો સામેલ કરાઈ હતી.",
        subject: "Constitution"
      },
      {
        id: 5,
        question: "ગુજરાતમાં 'સુદર્શન તળાવ' નું સમારકામ કયા શાસકના સમયમાં થયું હતું?",
        options: {
          A: "રુદ્રદામા અને સ્કંદગુપ્ત",
          B: "સિદ્ધરાજ જયસિંહ",
          C: "કુમારપાળ",
          D: "વનરાજ ચાવડા"
        },
        correctAnswer: "A",
        explanation: "ચંદ્રગુપ્ત મૌર્યએ બંધાવેલા સુદર્શન તળાવનું સમારકામ મહાક્ષત્રપ રુદ્રદામા અને ગુપ્ત સમ્રાટ સ્કંદગુપ્તના સુબાઓએ કરાવ્યું હતું.",
        subject: "Gujarat History"
      }
    ]
  },
  {
    id: "test-police-constable",
    slug: "gujarat-police-constable-test",
    title: "Gujarat Police Constable & PSI Mock Test 2026",
    category: "Police",
    categoryName: "Police & Defense",
    totalQuestions: 25,
    durationMinutes: 30,
    totalMarks: 25,
    negativeMarks: 0.25,
    language: "Gujarati",
    difficulty: "Medium",
    description: "Specialized mock test covering Law basics, Gujarat Geography, Everyday Science, and Reasoning.",
    questions: [
      {
        id: 1,
        question: "ભારતીય દંડ સંહિતા (IPC) ની જગ્યાએ 2024 થી કયો નવો કાયદો અમલમાં આવ્યો?",
        options: {
          A: "ભારતીય સાક્ષ્ય અધિનિયમ",
          B: "ભારતીય ન્યાય સંહિતા (BNS)",
          C: "ભારતીય નાગરિક સુરક્ષા સંહિતા",
          D: "પોલીસ અધિનિયમ 2024"
        },
        correctAnswer: "B",
        explanation: "IPC 1860 ની જગ્યાએ 'ભારતીય ન્યાય સંહિતા, 2023' (BNS) 1 જુલાઈ 2024 થી અમલમાં આવી.",
        subject: "Law & BNS"
      },
      {
        id: 2,
        question: "ગુજરાતમાં સૌથી લાંબો દરિયાકિનારો કયા જિલ્લાને મળેલો છે?",
        options: {
          A: "ભાવનગર",
          B: "કચ્છ",
          C: "જામનગર",
          D: "ગીર સોમનાથ"
        },
        correctAnswer: "B",
        explanation: "કચ્છ જિલ્લાને આશરે 406 કિ.મી. લાંબો દરિયાકિનારો પ્રાપ્ત છે જે ગુજરાતમાં સૌથી વધુ છે.",
        subject: "Gujarat Geography"
      },
      {
        id: 3,
        question: "માનવ શરીરમાં રક્તદાન માટે 'સાર્વત્રિક દાતા' (Universal Donor) રક્તજૂથ કયું છે?",
        options: {
          A: "AB+",
          B: "O Negative (O-)",
          C: "A+",
          D: "B-"
        },
        correctAnswer: "B",
        explanation: "O Negative રક્તજૂથમાં કોઈપણ એન્ટિજેન ન હોવાથી તે કોઈને પણ સુરક્ષિત રીતે આપી શકાય છે.",
        subject: "General Science"
      }
    ]
  }
];

const INITIAL_DAILY_GK = {
  id: "gk-today",
  date: "આજનું જીકે ક્વેશ્ચન (Today's Highlight)",
  question: "ભારતનું પ્રથમ સેમિકન્ડક્ટર પ્લાન્ટ ગુજરાતના કયા શહેરમાં નિર્માણ પામી રહ્યું છે?",
  options: [
    { text: "સાણંદ (અમદાવાદ)", isCorrect: true },
    { text: "અંકલેશ્વર (ભરૂચ)", isCorrect: false },
    { text: "ધોલેરા (SIR)", isCorrect: false },
    { text: "હજીરા (સુરત)", isCorrect: false }
  ],
  explanation: "ટાટા ઇલેક્ટ્રોનિક્સ અને માઇક્રોન દ્વારા ગુજરાતના સાણંદ અને ધોલેરામાં અબજો રૂપિયાનું સેમિકન્ડક્ટર યુનિટ સ્થાપિત થઈ રહ્યું છે."
};

// Initialize Store
const DataStore = {
  init() {
    if (!localStorage.getItem("jobudaan_jobs")) {
      localStorage.setItem("jobudaan_jobs", JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem("jobudaan_mock_tests")) {
      localStorage.setItem("jobudaan_mock_tests", JSON.stringify(INITIAL_MOCK_TESTS));
    }
    if (!localStorage.getItem("jobudaan_gk")) {
      localStorage.setItem("jobudaan_gk", JSON.stringify(INITIAL_DAILY_GK));
    }
  },

  getJobs() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem("jobudaan_jobs") || "[]");
    } catch {
      return INITIAL_JOBS;
    }
  },

  saveJob(job) {
    const jobs = this.getJobs();
    job.id = "job-" + Date.now();
    job.isVerified = true;
    jobs.unshift(job);
    localStorage.setItem("jobudaan_jobs", JSON.stringify(jobs));
    return job;
  },

  getMockTests() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem("jobudaan_mock_tests") || "[]");
    } catch {
      return INITIAL_MOCK_TESTS;
    }
  },

  saveMockTest(testData) {
    const tests = this.getMockTests();
    testData.id = "test-" + Date.now();
    testData.slug = testData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    tests.unshift(testData);
    localStorage.setItem("jobudaan_mock_tests", JSON.stringify(tests));
    return testData;
  },

  getDailyGK() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem("jobudaan_gk") || "null") || INITIAL_DAILY_GK;
    } catch {
      return INITIAL_DAILY_GK;
    }
  }
};

DataStore.init();
