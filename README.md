# 🚀 JobUdaan — National Govt & Corporate Career Hub 2026

**JobUdaan** એ સરકારી (UPSC, GPSC, GSSSB, Police, Railways, Banking) અને ખાનગી (TCS, Infosys, Sun Pharma, L&T) ભરતીઓ, ફ્રી ઓનલાઈન મોક ટેસ્ટ્સ (MCQs) અને પરીક્ષા તૈયારી ગાઈડ માટેનું સંપૂર્ણ પોર્ટલ છે.

---

## 📁 ફોલ્ડર સ્ટ્રક્ચર (Project Structure)

```text
JobUdaan/
├── index.html         # હોમ પેજ (Hero, Live GK, Featured Jobs, Popular Mock Tests)
├── jobs.html          # તમામ જોબ્સ (લાઇવ કીવર્ડ સર્ચ, સેક્ટર ફિલ્ટર, સ્ટેટ ફિલ્ટર, ડિટેઈલ મોડલ)
├── mock-tests.html    # ઓનલાઈન CBT મોક ટેસ્ટ એન્જિન (ટાઈમર, સ્કોરકાર્ડ, નેગેટિવ માર્કિંગ, સોલ્યુશન્સ)
├── preparation.html   # પરીક્ષા તૈયારી બ્લુપ્રિન્ટ (GSSSB, Police, Talati, GPSC ટાઈમટેબલ)
├── admin.html         # એડમિન પોર્ટલ (જોબ પોસ્ટિંગ + JSON MCQ અપલોડર)
├── about.html         # અમારા વિશે (Mission & Vision)
├── contact.html       # સંપર્ક ફોર્મ અને સહાય
│
├── css/
│   ├── style.css      # મુખ્ય ડિઝાઇન, કલર્સ, ટાઇપોગ્રાફી, બટન્સ, કાર્ડ્સ
│   ├── admin.css      # એડમિન ડેશબોર્ડ, સ્ટેટ્સ કાર્ડ્સ, JSON એડિટર
│   └── responsive.css # મોબાઈલ ડ્રોઅર અને બોટમ નેવિગેશન બાર
│
├── js/
│   ├── data.js        # સરકારી અને પ્રાઇવેટ જોબ્સ, મોક ટેસ્ટ્સ અને ડેઇલી જીકે ડેટા સ્ટોર (No API needed!)
│   ├── auth.js        # ક્લાયન્ટ-સાઇડ ઓથેન્ટિકેશન (Google Login, Dhaval, Tushar, Admin)
│   ├── jobs.js        # જોબ્સ ફિલ્ટરિંગ, સર્ચ અને મોડલ પોપઅપ
│   ├── admin.js       # જોબ પોસ્ટિંગ અને JSON MCQ પારસિંગ એન્જિન
│   ├── mock-test.js   # લાઈવ CBT મોક ટેસ્ટ રનર અને સ્કોરિંગ
│   └── script.js      # ગ્લોબલ ઇન્ટરેક્શન્સ, હેડર સ્ટેટ, ડેઇલી જીકે ક્વિઝ
│
├── images/            # લોગો, અશોક સ્તંભ એમ્બલેમ અને ગ્રાફિક્સ
├── package.json       # પ્રોજેક્ટ સેટઅપ
└── README.md          # પ્રોજેક્ટ ડોક્યુમેન્ટેશન
```

---

## 👥 પર્સનલ અને એડમિન એકાઉન્ટ્સ (Login Credentials)

| વપરાશકર્તા (User) | ઈમેઈલ (Email) | પાસવર્ડ (Password) | રોલ (Role) | સુવિધા (Feature) |
| :--- | :--- | :--- | :--- | :--- |
| **Dhaval** | `dhaval@careersetu.com` | `123456` | `MCQ_EDITOR` | સીધું JSON MCQ Upload ટૂલ ખુલે છે |
| **Tushar** | `tushar@careersetu.com` | `123456` | `MCQ_EDITOR` | સીધું JSON MCQ Upload ટૂલ ખુલે છે |
| **Super Admin** | `admin@careersetu.com` | `123456` | `ADMIN` | સંપૂર્ણ એડમિન પોર્ટલ અને જોબ પોસ્ટિંગ |
| **Candidate Demo**| `candidate@jobudaan.in` | `123456` | `CANDIDATE` | વિદ્યાર્થી / ઉમેદવાર વ્યુ |

*નોંધ: લોગિન પેજ પર નીચે 1-ક્લિક બટન આપેલું છે જેથી ટાઇપ કર્યા વગર પણ સીધું લૉગિન કરી શકાય છે.*

---

## ⚡ કેવી રીતે ચલાવવું (How to Run)

કોઈપણ પ્રકારના બેકએન્ડ કે API વગર સીધું ચાલે છે:
1. `JobUdaan` ફોલ્ડરમાંથી કોઈપણ ફાઈલ (દા.ત. `index.html`) સીધી બ્રાઉઝરમાં ડબલ-ક્લિક કરીને ખોલી શકાય છે.
2. અથવા લોકલ સર્વર માટે ટર્મિનલમાં:
   ```bash
   npx serve .
   ```
