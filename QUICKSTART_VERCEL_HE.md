# 🚀 התקנה מהירה - Vercel + Railway

## המלצה: Frontend ב-Vercel, Backend ב-Railway

### ⏱️ זמן משוער: 15-20 דקות

---

## 📝 מה שתצטרך:

1. חשבון GitHub (כבר יש לך)
2. חשבון Vercel (חינם) - [vercel.com](https://vercel.com)
3. חשבון Railway (חינם) - [railway.app](https://railway.app)

---

## 🎯 שלב 1: פרוס את ה-Backend (Railway)

### 1.1 התחבר ל-Railway
- לך ל-[railway.app](https://railway.app)
- לחץ "Login" → "Login with GitHub"
- אשר את הגישה

### 1.2 צור פרויקט חדש
1. לחץ על **"New Project"**
2. בחר **"Deploy from GitHub repo"**
3. בחר את הפרויקט: `price-offer--claud-code`
4. בחר ענף: `claude/docs-builder-mvp-011CUNVpKuQ3ZbzrPaTZwAi1`

### 1.3 הוסף מסד נתונים
1. בפרויקט החדש, לחץ **"+ New"**
2. בחר **"Database"** → **"Add PostgreSQL"**
3. ✅ זהו! הדאטאבייס נוצר

### 1.4 הגדר משתני סביבה
לחץ על השירות (Service) → **"Variables"** → לחץ **"New Variable"**

הוסף אחד אחד:
```
NODE_ENV = production
PORT = 3001
JWT_SECRET = ortam-ai-super-secret-key-2024-change-in-production
JWT_EXPIRES_IN = 7d
FRONTEND_URL = https://temp.vercel.app
```

(את `FRONTEND_URL` נעדכן אחר כך)

### 1.5 הגדר את ה-Build
לחץ על **"Settings"** → **"Build"**:

- **Build Command**:
  ```
  cd backend && npm install && npx prisma generate && npm run build
  ```

- **Start Command**:
  ```
  cd backend && npx prisma migrate deploy && npm start
  ```

### 1.6 Deploy!
- לחץ על **"Deploy"** למעלה
- חכה 2-3 דקות
- לחץ על השירות → **"Settings"** → **"Domains"**
- העתק את ה-URL (למשל: `https://xxxxx.up.railway.app`)

📋 **שמור את ה-URL הזה!** תצטרך אותו בשלב הבא.

---

## 🎨 שלב 2: פרוס את ה-Frontend (Vercel)

### 2.1 התחבר ל-Vercel
- לך ל-[vercel.com](https://vercel.com)
- לחץ "Sign Up" → "Continue with GitHub"
- אשר את הגישה

### 2.2 צור פרויקט חדש
1. לחץ על **"Add New..."** → **"Project"**
2. מצא את `price-offer--claud-code`
3. לחץ **"Import"**

### 2.3 הגדרות פרויקט
השאר את ה-Framework זיהוי אוטומטי, ושנה רק:

**Framework Preset**: `Vite`

**Root Directory**: לחץ **"Edit"** → הקלד `frontend` → סמן ✓

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### 2.4 הוסף משתני סביבה
לפני Deploy, לחץ על **"Environment Variables"**:

הוסף:
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://xxxxx.up.railway.app/api`
  (ה-URL של Railway מהשלב 1.6 + `/api` בסוף!)

### 2.5 Deploy!
- לחץ על **"Deploy"**
- חכה 2-3 דקות
- תראה הודעה "Congratulations!" 🎉
- לחץ על **"Visit"** או על ה-URL

📋 **שמור את ה-URL של Vercel!** (למשל: `https://price-offer-xxx.vercel.app`)

---

## 🔗 שלב 3: חבר את השניים

### 3.1 עדכן את Railway
1. חזור ל-Railway
2. לך לשירות ה-Backend → **"Variables"**
3. מצא את `FRONTEND_URL`
4. ערוך אותו ל-URL של Vercel (מהשלב 2.5)
   ```
   FRONTEND_URL = https://price-offer-xxx.vercel.app
   ```
5. לחץ **"Redeploy"** (אם לא קורה אוטומטית)

---

## 👤 שלב 4: צור משתמש Admin

### 4.1 צור משתמש דרך API
פתח טרמינל והרץ (החלף את ה-URL ב-URL של Railway שלך):

```bash
curl -X POST https://xxxxx.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ortam.ai",
    "password": "Admin123456",
    "name": "Admin ORTAM",
    "role": "ADMIN"
  }'
```

אם זה עובד, תראה תשובה עם פרטי המשתמש.

---

## ✅ שלב 5: התחבר!

1. פתח את ה-URL של Vercel בדפדפן
2. התחבר עם:
   - **Email**: `admin@ortam.ai`
   - **Password**: `Admin123456`
3. 🎉 **זהו! המערכת רצה!**

---

## 🔍 בדיקות

### בדוק שה-Backend חי:
```bash
curl https://xxxxx.up.railway.app/health
```

צריך להחזיר:
```json
{"status":"ok","timestamp":"..."}
```

### בדוק שה-Frontend טוען:
פתח את ה-URL של Vercel - צריך לראות את עמוד ההתחברות

---

## 🐛 פתרון בעיות

### ❌ "Network Error" כשמנסה להתחבר
**פתרון**:
1. לך ל-Vercel → Project → Settings → Environment Variables
2. ודא ש-`VITE_API_BASE_URL` מכיל את ה-URL הנכון + `/api`
3. Redeploy את Vercel

### ❌ "CORS Error" ב-Console
**פתרון**:
1. לך ל-Railway → Variables
2. ודא ש-`FRONTEND_URL` מכיל את ה-URL הנכון של Vercel
3. Redeploy את Railway

### ❌ "Database connection failed"
**פתרון**:
1. לך ל-Railway → PostgreSQL service
2. ודא שהוא running
3. לחץ על Backend service → Logs
4. חפש שגיאות

### ❌ עמוד לבן / 404
**פתרון**:
1. לך ל-Vercel → Project → Settings
2. ודא ש-Root Directory הוא `frontend`
3. Redeploy

---

## 📱 מה הלאה?

עכשיו אתה יכול:
- ✅ ליצור מסמכים חדשים
- ✅ לערוך עם Rich Text Editor
- ✅ לייצא PDF
- ✅ ליצור משתמשים נוספים (Admin בלבד)
- ✅ להוסיף דומיין מותאם אישית (Vercel → Settings → Domains)

---

## 💰 עלויות

### Railway (Free Tier):
- $5 credit חינם לחודש
- מספיק ל-500 שעות/חודש
- אחרי זה: ~$5/חודש

### Vercel (Free Tier):
- 100GB Bandwidth
- 100GB-Hours לחודש
- בחינם לפרויקטים אישיים

---

## 🆘 עזרה

אם משהו לא עובד:
1. בדוק את ה-Logs ב-Railway (Dashboard → Service → Logs)
2. בדוק את ה-Logs ב-Vercel (Dashboard → Deployment → Functions)
3. ודא שה-URLs נכונים בכל מקום

---

**בהצלחה! 🚀**
