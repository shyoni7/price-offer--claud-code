# ORTAM Docs Builder

מערכת פנימית ליצירת מסמכים מעוצבים של ORTAM AI בהתבסס על שדות טופס ופרומפט שפה טבעית, עם תצוגה מקדימה וייצוא ל-PDF.

## 🎯 תכונות עיקריות

- **יצירת מסמכים מקצועיים** - הצעות מחיר, הסכמים, בריפים ועוד
- **תצוגה מקדימה בזמן אמת** - רואים את המסמך תוך כדי עריכה
- **עורך טקסט עשיר** - עם תמיכה מלאה ב-RTL/LTR
- **יצירת תוכן אוטומטי** - באמצעות פרומפטים בשפה טבעית
- **חישוב מחירים אוטומטי** - כולל מע"מ 18%
- **ייצוא ל-PDF** - עם header ו-footer מעוצבים
- **ניהול גרסאות** - שמירה אוטומטית של גרסאות קודמות
- **תמיכה בעברית ואנגלית** - כולל תמיכה מלאה ב-RTL

## 🏗️ ארכיטקטורה

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT
- **PDF Generation**: Puppeteer
- **AI Integration**: Ready for OpenAI/Anthropic

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Rich Text Editor**: TipTap
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📋 דרישות מקדימות

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## 🚀 התקנה והרצה

### 1. שכפול הפרויקט

```bash
git clone <repository-url>
cd price-offer--claud-code
```

### 2. התקנת תלויות

```bash
npm install
```

זה יתקין את כל התלויות עבור הפרויקט כולו (frontend + backend).

### 3. הגדרת מסד הנתונים

#### התקנת PostgreSQL

אם PostgreSQL לא מותקן, התקן אותו:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
הורד והתקן מ-[postgresql.org](https://www.postgresql.org/download/windows/)

#### יצירת מסד נתונים

```bash
sudo -u postgres psql
CREATE DATABASE ortam_docs;
CREATE USER ortam_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ortam_docs TO ortam_user;
\q
```

### 4. הגדרת משתני סביבה

#### Backend

```bash
cd backend
cp .env.example .env
```

ערוך את הקובץ `.env`:

```env
DATABASE_URL="postgresql://ortam_user:your_password@localhost:5432/ortam_docs?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Optional - for AI document generation
# OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env
```

הקובץ `.env` יכול להישאר ריק (משתמש ב-proxy).

### 5. הרצת Prisma Migrations

```bash
cd ../backend
npm run prisma:generate
npm run prisma:migrate
```

### 6. יצירת משתמש ראשוני (אופציונלי)

אחרי שהשרת רץ, תוכל ליצור משתמש ראשוני דרך API:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ortam.ai",
    "password": "your-password",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### 7. הרצת הפרויקט

#### Development Mode - הכל ביחד

```bash
# מהתיקייה הראשית
npm run dev
```

זה ירוץ את:
- Backend על http://localhost:3001
- Frontend על http://localhost:5173

#### Development Mode - בנפרד

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 8. גישה למערכת

פתח דפדפן בכתובת: http://localhost:5173

התחבר עם המשתמש שיצרת.

## 📁 מבנה הפרויקט

```
.
├── backend/                 # Backend API
│   ├── prisma/             # Database schema & migrations
│   │   └── schema.prisma   # Prisma schema definition
│   ├── src/
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── db.ts          # Prisma client
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # Zustand stores
│   │   ├── lib/          # Utilities & API client
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── package.json           # Root package.json (workspace)
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - רישום משתמש חדש
- `POST /api/auth/login` - התחברות
- `GET /api/auth/me` - פרטי המשתמש המחובר

### Documents
- `GET /api/docs` - קבלת כל המסמכים
- `GET /api/docs/:id` - קבלת מסמך ספציפי
- `POST /api/docs` - יצירת מסמך חדש
- `PUT /api/docs/:id` - עדכון מסמך
- `POST /api/docs/:id/generate` - יצירת תוכן עם AI
- `POST /api/docs/:id/export/pdf` - ייצוא ל-PDF
- `DELETE /api/docs/:id` - מחיקת מסמך (Admin בלבד)

### Templates
- `GET /api/templates` - קבלת כל התבניות
- `GET /api/templates/:id` - קבלת תבנית ספציפית
- `POST /api/templates` - יצירת תבנית (Admin בלבד)
- `PUT /api/templates/:id` - עדכון תבנית (Admin בלבד)

### Senders
- `GET /api/senders` - קבלת רשימת שולחים
- `POST /api/senders` - הוספת שולח (Admin בלבד)
- `PUT /api/senders/:id` - עדכון שולח (Admin בלבד)

## 🎨 עיצוב ומיתוג

### צבעים
- **Primary**: #06B6D4 (ציאן)
- **Accent**: #FF2F87 (ורוד)
- **Text Primary**: #1F2937
- **Text Secondary**: #6B7280
- **Background**: #FFFFFF

### פונטים
- **עברית**: Heebo
- **אנגלית**: Inter

### תבניות
- Template A - Header + Footer קלאסי
- Template B - עיצוב בלוקי מודרני
- Template C - עיצוב עם סרגל צד ולוגו קבוע

## 👥 הרשאות

### Admin
- ניהול משתמשים
- ניהול תבניות
- שינוי מע"מ
- צפייה בכל המסמכים
- מחיקת מסמכים

### Editor
- יצירת מסמכים
- עריכת מסמכים
- ייצוא PDF
- צפייה במסמכים אישיים בלבד

## 📝 סוגי מסמכים נתמכים

1. הצעת מחיר
2. הסכם משווק
3. הסכם ריסלר
4. הסכם אפיליאט
5. בריף קורס חדש
6. תכנית הכשרה מקצועית
7. דרישת תשלום
8. מכתב רשמי
9. Auto (זיהוי אוטומטי)

## 🔧 פיתוח

### Build Production

```bash
npm run build
```

### Lint & Format

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run build
```

### Database Studio

```bash
cd backend
npm run prisma:studio
```

## 🚢 Deploy

### Backend

1. הגדר משתני סביבה בסביבת הייצור (לדוגמה Railway)
   - `DATABASE_URL` עם פרטי מסד הנתונים
   - `JWT_SECRET` ו-`JWT_EXPIRES_IN`
   - `FRONTEND_URL` עם כתובת הדומיין של ה-Frontend (ניתן לציין כמה דומיינים באמצעות פסיק, למשל `https://app.vercel.app,https://app-git-main.vercel.app`)
2. הרץ migrations: `npm run prisma:migrate`
3. Build: `npm run build`
4. Start: `npm start`

### Frontend

1. אם מפריסים ל-Vercel, הגדר משתנה סביבה `VITE_API_BASE_URL` שיצביע על כתובת ה-Backend בריילוויי כולל הסיומת `/api` (לדוגמה `https://ortam-docs-backend-production.up.railway.app/api`).
2. Build: `npm run build`
3. העתק את תיקיית `dist/` לשרת סטטי

### רומנדציות Deploy
- Backend: Railway, Render, DigitalOcean, AWS
- Frontend: Vercel, Netlify, Cloudflare Pages
- Database: Railway, Supabase, DigitalOcean

## 🔐 אבטחה

- HTTPS בפרודקשן
- JWT Tokens
- Password hashing עם bcrypt
- Role-based access control
- AES-256 encryption for sensitive data
- CORS configuration

## 📊 Database Schema

ראה `backend/prisma/schema.prisma` לסכימה המלאה.

מודלים עיקריים:
- **User** - משתמשים
- **Document** - מסמכים
- **DocumentVersion** - גרסאות מסמכים
- **Template** - תבניות עיצוב
- **Sender** - שולחים

## 🤝 תרומה

זהו פרויקט פנימי של ORTAM AI.

## 📄 רישיון

Internal Use Only - ORTAM AI

## 📞 תמיכה

לשאלות או בעיות, פנה לצוות הפיתוח של ORTAM AI.

---

**🤖 Generated with Claude Code**
