# 🚀 מדריך פריסה ל-Vercel

## אסטרטגיית פריסה

מכיוון שיש לנו אפליקציה Full-Stack (Frontend + Backend + Database), נשתמש בגישה הזו:

- **Frontend (React)** → Vercel ✅
- **Backend (Express API)** → Railway ✅
- **Database (PostgreSQL)** → Railway ✅

---

## דרך 1: Frontend ב-Vercel + Backend ב-Railway (מומלץ!)

### 🔷 חלק 1: פריסת Backend + Database ל-Railway

#### 1. הרשמה ל-Railway
1. גש ל-[railway.app](https://railway.app)
2. התחבר עם GitHub
3. אשר גישה ל-repository שלך

#### 2. יצירת פרויקט חדש
1. לחץ על **"New Project"**
2. בחר **"Deploy from GitHub repo"**
3. בחר את ה-repository: `shyoni7/price-offer--claud-code`
4. בחר את הענף: `claude/docs-builder-mvp-011CUNVpKuQ3ZbzrPaTZwAi1`

#### 3. הוספת PostgreSQL Database
1. בפרויקט, לחץ על **"+ New"**
2. בחר **"Database"** → **"Add PostgreSQL"**
3. Railway יצור את מסד הנתונים אוטומטית

#### 4. הגדרת משתני סביבה ל-Backend
לחץ על שירות ה-Backend → **"Variables"** → הוסף:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-production-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**חשוב**:
- `DATABASE_URL` יתחבר אוטומטית ל-PostgreSQL שיצרת
- `FRONTEND_URL` תעדכן אחרי שתפרוס ל-Vercel

#### 5. הגדרת Build
ב-Settings של השירות:
- **Build Command**: `cd backend && npm install && npm run prisma:generate && npm run build`
- **Start Command**: `cd backend && npm run prisma:migrate deploy && npm start`
- **Root Directory**: השאר ריק (/)

#### 6. Deploy!
לחץ על **"Deploy"** - Railway יפרוס את ה-Backend

📝 שמור את ה-URL של ה-Backend (למשל: `https://your-backend.railway.app`)

---

### 🔷 חלק 2: פריסת Frontend ל-Vercel

#### 1. התקנת Vercel CLI (אופציונלי)
```bash
npm install -g vercel
```

#### 2. גש ל-Vercel Dashboard
1. לך ל-[vercel.com](https://vercel.com)
2. התחבר עם GitHub
3. לחץ על **"Add New..."** → **"Project"**

#### 3. ייבוא הפרויקט
1. בחר את ה-repository: `shyoni7/price-offer--claud-code`
2. בחר את הענף: `claude/docs-builder-mvp-011CUNVpKuQ3ZbzrPaTZwAi1`

#### 4. הגדרות הפרויקט
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

#### 5. משתני סביבה
לחץ על **"Environment Variables"** והוסף:

```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

החלף את `your-backend.railway.app` ב-URL האמיתי של ה-Backend מ-Railway!

#### 6. Deploy!
לחץ על **"Deploy"** - Vercel יפרוס את ה-Frontend

📝 שמור את ה-URL של ה-Frontend (למשל: `https://your-app.vercel.app`)

---

### 🔷 חלק 3: עדכון ההגדרות

#### עדכון FRONTEND_URL ב-Railway
1. חזור ל-Railway
2. לך למשתני הסביבה של ה-Backend
3. עדכן את `FRONTEND_URL` ל-URL האמיתי של Vercel:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Deploy מחדש את ה-Backend

#### עדכון CORS ב-Backend (אם צריך)
אם יש בעיות CORS, ודא שב-`backend/src/index.ts` ה-CORS מוגדר נכון:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

### 🧪 בדיקת הפריסה

1. **בדוק Backend**:
   ```bash
   curl https://your-backend.railway.app/health
   ```
   צריך להחזיר: `{"status":"ok",...}`

2. **בדוק Frontend**:
   פתח את `https://your-app.vercel.app`
   צריך לראות את עמוד ההתחברות

3. **צור משתמש ראשון**:
   ```bash
   curl -X POST https://your-backend.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@ortam.ai",
       "password": "YourPassword123",
       "name": "Admin User",
       "role": "ADMIN"
     }'
   ```

4. **התחבר למערכת**!

---

## דרך 2: הכל ב-Vercel (מתקדם)

אם בכל זאת רוצה להריץ גם את ה-Backend ב-Vercel:

### הערות חשובות:
⚠️ **Puppeteer לא יעבוד טוב ב-Vercel** (גודל Chrome binary)
⚠️ תצטרך להשתמש ב-**Vercel Postgres** או **Supabase** למסד נתונים
⚠️ ה-Backend יהיה **Serverless Functions** (לא Express רגיל)

### שלבים בקצרה:

1. **המרת Backend ל-Serverless Functions**:
   - צריך להמיר כל route ל-API route נפרד
   - דורש שינויים משמעותיים בקוד

2. **שימוש ב-Vercel Postgres**:
   ```bash
   npm i @vercel/postgres
   ```

3. **החלפת Puppeteer**:
   השתמש ב-API חיצוני כמו:
   - [html-pdf-node](https://www.npmjs.com/package/html-pdf-node)
   - [PDFShift API](https://pdfshift.io/)
   - או שלח ל-serverless function נפרד

---

## 📋 Checklist

- [ ] Backend פרוס ב-Railway
- [ ] PostgreSQL פעיל ב-Railway
- [ ] Frontend פרוס ב-Vercel
- [ ] משתני סביבה מוגדרים נכון
- [ ] CORS מוגדר נכון
- [ ] נוצר משתמש Admin
- [ ] ניתן להתחבר למערכת
- [ ] ייצוא PDF עובד

---

## 🔧 פתרון בעיות נפוצות

### בעיה: "Network Error" בעת התחברות
**פתרון**: ודא ש-`VITE_API_BASE_URL` ב-Vercel מכיל את ה-URL הנכון של ה-Backend

### בעיה: CORS Error
**פתרון**: ודא ש-`FRONTEND_URL` ב-Railway מכיל את ה-URL הנכון של Vercel

### בעיה: Database Connection Error
**פתרון**: ודא ש-Prisma migrations רצו:
```bash
# ב-Railway Settings → Deploy Logs
npm run prisma:migrate deploy
```

### בעיה: PDF Export לא עובד
**פתרון**: Puppeteer דורש Chrome. ב-Railway זה אמור לעבוד. אם לא:
1. הוסף buildpacks ל-Railway
2. או השתמש ב-API חיצוני ל-PDF

---

## 💡 טיפים

1. **Environment Variables**: אל תשכח לעדכן את כל ה-URLs אחרי הפריסה
2. **Database Backups**: Railway מציע backups אוטומטיים
3. **Monitoring**: השתמש ב-Railway logs לניטור ה-Backend
4. **Custom Domain**: אפשר להוסיף דומיין מותאם אישי ב-Vercel וב-Railway

---

**זהו! המערכת שלך צריכה להיות חיה! 🎉**

אם יש בעיות, בדוק את ה-logs:
- Railway: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Function Logs
