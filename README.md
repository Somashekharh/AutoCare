
# 📄 **AutoCare - Project Report**

## 1. 📚 **Project Overview**
The **AutoCare** project is a full-stack web application developed using **Node.js, Express.js, EJS, and MySQL**. It provides a platform for users to register, log in, book services, and manage car maintenance records. Admins can manage service prices and monitor bookings.

---

## 2. ⚙️ **Technologies Used**
- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS
- **Database:** MySQL
- **Admin Panel:** Separate Express app running on a different port
- **CSS & JS:** Custom styles and scripts to enhance user experience

---

## 3. 📊 **Database Structure**
The project uses a MySQL database named `autocare`, which consists of the following tables:

### 🔹 `users`
- `id` - Primary key, auto-incremented
- `name` - Name of the user
- `username` - Unique username
- `email` - Email address
- `vehicle_name` - Name of the user's vehicle
- `registration_number` - Vehicle registration number
- `address` - User's address
- `phone` - Contact number
- `password` - Encrypted password
- `role` - User role (`customer`, `admin`, `mechanic`)

### 🔹 `services`
- `id` - Primary key
- `service_name` - Name of the service
- `description` - Description of the service
- `price` - Service price
- `duration` - Estimated duration of the service

### 🔹 `bookings`
- `id` - Primary key
- `user_id` - Reference to the `users` table
- `service_id` - Reference to the `services` table
- `booking_date` - Date and time of booking
- `status` - Status of the booking (`pending`, `completed`, `cancelled`)

---

## 4. 📂 **File/Folder Structure**
```
/AutoCare
├── /admin
│   ├── /views
│   │   ├── admin-home.ejs
│   │   └── service-prices.ejs
│   └── app.js   # Admin app running on a different port
├── /node_modules
├── /public
│   ├── /css
│   │   └── styles.css
│   └── /js
│       └── scripts.js
├── /views
│   ├── /user
│   │   ├── landing.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── home.ejs
│   │   ├── service.ejs
│   │   ├── login-service.ejs
│   │   ├── confirmation.ejs
│   │   ├── orders.ejs
│   │   ├── service-prices.ejs
│   │   ├── routine_maintenance.ejs
│   │   ├── repairs.ejs
│   │   ├── diagnostics.ejs
│   │   ├── body_work.ejs
│   │   └── towing.ejs
│   └── /partials
│       ├── header.ejs
│       └── footer.ejs
├── /services
│   └── services.json
├── app.js
├── package.json
└── README.md
```

---

## 5. 🚀 **Instructions to Run the Project**
### ⚡️ **Step 1: Clone the Project**
```bash
git clone https://github.com/your-repo/autocare.git
cd autocare
```

### ⚡️ **Step 2: Install Dependencies**
```bash
npm install
```

### ⚡️ **Step 3: Set Up Database**
1. Open **MySQL Workbench**.
2. Run the SQL file `Auto Care Database.sql` to create the required database and tables.

### ⚡️ **Step 4: Configure Database**
Update the database connection in `/app.js`:
```js
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password
    database: 'autocare'
});
```

### ⚡️ **Step 5: Run the Main App**
```bash
node app.js
```

### ⚡️ **Step 6: Run the Admin App**
```bash
cd admin
node app.js
```

### ⚡️ **Step 7: Access the Application**
- **User App:** [http://localhost:3000](http://localhost:3000)  
- **Admin Panel:** [http://localhost:4000](http://localhost:4000)

---

## 6. 🖼️ **Screenshots**
- Landing Page 
https://github.com/Somashekharh/Autocare/blob/fad1e62e64d913aaa8af61877133ca1415b719bc/AutoCare/autocare_main/public/AutoCare%20-%20Professional%20Auto%20Services.jpg
- Login Page
https://github.com/Somashekharh/Autocare/blob/fad1e62e64d913aaa8af61877133ca1415b719bc/AutoCare/autocare_main/public/Login%20-%20AutoCare.pdf.jpg
- Register Page
https://github.com/Somashekharh/Autocare/blob/fad1e62e64d913aaa8af61877133ca1415b719bc/AutoCare/autocare_main/public/Register%20-%20AutoCare.jpg
