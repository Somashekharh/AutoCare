const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 3000;


const app = express();

// Set up view engine and static file directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static('public'));

Set up MySQL connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'autocare',
    password: 'root'
});

connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('MySQL Database is connected Successfully');
    }
});

// Set up session management
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Landing Page
app.get("/", (req, res) => {
    res.render("user/landing");
});

// Home Page
app.get("/home", (req, res) => {
    if (req.session.userId) {
        res.render("user/home");
    } else {
        res.redirect("/login");
    }
});

// User Login
app.get("/login", (req, res) => {
    res.render("user/login");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const query = `SELECT * FROM users WHERE username = ?`;
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).send('Server Error');
            }

            if (results.length > 0) {
                if (results[0].password === password) {
                    req.session.userId = results[0].id;
                    res.redirect("/home");
                } else {
                    res.send("Wrong Password. Please try again!");
                }
            } else {
                res.send("User not found");
            }
        });
    } else {
        res.send("Please Enter Username and Password");
    }
});

// User Registration
app.get("/register", (req, res) => {
    res.render("user/register");
});

app.post("/register", (req, res) => {
    const { name, username, email, vehicle_name, registration_number, address, phone, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).send('Name, Username, and Password are required.');
    }

    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
    connection.query(checkUserQuery, [username], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Server Error');
        }

        if (results.length > 0) {
            return res.status(400).send('Username already exists. Please choose another.');
        }

        const query = `INSERT INTO users (name, username, email, vehicle_name, registration_number, address, phone, password)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(query, [name, username, email, vehicle_name, registration_number, address, phone, password], (error) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).send('Server Error');
            }
            res.redirect("/login");
        });
    });
});

// Service Pages
app.get("/service", (req, res) => {
    connection.query('SELECT * FROM services', (error, results) => {
        if (error) {
            console.error('Error fetching services:', error);
            return res.status(500).send('Server Error');
        }
        res.render("user/service", { services: results });
    });
});

//login Service Pages and  Back Button
app.get("/login-service", (req, res) => {
    connection.query('SELECT * FROM services', (error, results) => {
        if (error) {
            console.error('Error fetching services:', error);
            return res.status(500).send('Server Error');
        }
        res.render("user/login-service", { services: results });
    });
});

const serviceRoutes = [
    { path: '/routine-maintenance', title: "Routine Maintenance", description: "Oil changes, tire rotations, and fluid checks are part of our routine maintenance services to keep your vehicle running smoothly.", services: ["Oil Change", "Tire Rotation", "Fluid Checks", "General Inspection"] },
    { path: '/repairs', title: "Repairs", description: "Comprehensive repair services to fix any issue your vehicle might have.", services: ["Engine Repair", "Transmission Repair", "Electrical Repair"] },
    { path: '/diagnostics', title: "Diagnostics", description: "Full vehicle diagnostics to detect and solve any issue.", services: ["Engine Diagnostics", "Electrical Diagnostics", "Performance Check"] },
    { path: '/body-work', title: "Body Work", description: "High-quality bodywork services to restore and repair your vehicle's exterior.", services: ["Paint Job", "Dent Removal", "Frame Straightening"] },
    { path: '/towing', title: "Towing & Roadside Assistance", description: "Fast and reliable towing services available 24/7.", services: ["Towing", "Flat Tire Change", "Battery Jumpstart", "Fuel Delivery"] }
];

serviceRoutes.forEach(service => {
    app.get(service.path, (req, res) => {
        res.render(`user${service.path.replace('-', '_')}`, { title: service.title, description: service.description, services: service.services });
    });

    app.post(service.path, (req, res) => {
        handleFormSubmission(req, res, service.path.substring(1).replace('-', '_'));
    });
});

// Function to handle form submissions
function handleFormSubmission(req, res, serviceName) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const { location, vehicle_details, service_date, service_time, pickup_date, pickup_time } = req.body;
    const userId = req.session.userId;

    // Use backticks around table names to avoid SQL syntax errors
    let query, values;
    if (serviceName === 'towing') {
        query = `INSERT INTO \`${serviceName}\` (user_id, location, vehicle_details, pickup_date, pickup_time) VALUES (?, ?, ?, ?, ?)`;
        values = [userId, location, vehicle_details, pickup_date, pickup_time];
    } else {
        query = `INSERT INTO \`${serviceName}\` (user_id, location, vehicle_details, service_date, service_time) VALUES (?, ?, ?, ?, ?)`;
        values = [userId, location, vehicle_details, service_date, service_time];
    }

    connection.query(query, values, (error) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Server Error');
        }

        const queryBookings = `SELECT * FROM \`${serviceName}\` WHERE user_id = ? ORDER BY ${serviceName === 'towing' ? 'pickup_date' : 'service_date'} DESC, ${serviceName === 'towing' ? 'pickup_time' : 'service_time'} DESC`;
        connection.query(queryBookings, [userId], (error, results) => {
            if (error) {
                console.error('Error fetching bookings:', error);
                return res.status(500).send('Server Error');
            }

            res.render('user/confirmation', {
                message: `Your request for ${serviceName.replace('_', ' ')} has been sent to AutoCare.`,
                bookings: results
            });
        });
    });
}

// Orders Page
app.get("/orders", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const userId = req.session.userId;

    // Query to fetch all bookings for the logged-in user
    const queries = {
        routine_maintenance: `SELECT 'Routine Maintenance' as service_name, service_date, service_time, location, vehicle_details FROM routine_maintenance WHERE user_id = ? ORDER BY service_date DESC, service_time DESC`,
        repairs: `SELECT 'Repairs' as service_name, service_date, service_time, location, vehicle_details FROM repairs WHERE user_id = ? ORDER BY service_date DESC, service_time DESC`,
        diagnostics: `SELECT 'Diagnostics' as service_name, service_date, service_time, location, vehicle_details FROM diagnostics WHERE user_id = ? ORDER BY service_date DESC, service_time DESC`,
        body_work: `SELECT 'Body Work' as service_name, service_date, service_time, location, vehicle_details FROM body_work WHERE user_id = ? ORDER BY service_date DESC, service_time DESC`,
        towing: `SELECT 'Towing' as service_name, pickup_date as service_date, pickup_time as service_time, location, vehicle_details FROM towing WHERE user_id = ? ORDER BY pickup_date DESC, pickup_time DESC`
    };

    let allBookings = [];
    let queryCount = 0;

    // Fetch bookings from all service tables
    Object.keys(queries).forEach((serviceName) => {
        connection.query(queries[serviceName], [userId], (error, results) => {
            if (error) {
                console.error('Error fetching bookings:', error);
                return res.status(500).send('Server Error');
            }

            // Merge the results from each query into the allBookings array
            allBookings = allBookings.concat(results);
            queryCount++;

            // When all queries are complete, render the orders page
            if (queryCount === Object.keys(queries).length) {
                res.render("user/orders", { bookings: allBookings });
            }
        });
    });
});
//Service-prices
app.get("/service-prices", (req, res) => {
    connection.query('SELECT * FROM services', (error, results) => {
        if (error) {
            console.error('Error fetching services:', error);
            return res.status(500).send('Server Error');
        }
        res.render("user/service-prices", { services: results });
    });
});

////////
// In app.js or routes file
app.get("/login-service-prices", (req, res) => {
    res.render("login-serviceprices");
});


/////////
// Service Testing Pages
app.get("/battery-services", (req, res) => {
    res.render("user/service-testing", {
        title: "Battery Services"
    });
});

app.get("/cooling-system", (req, res) => {
    res.render("user/service-testing", {
        title: "Cooling System"
    });
});

app.get("/suspension-steering", (req, res) => {
    res.render("user/service-testing", {
        title: "Suspension and Steering"
    });
});

app.get("/air-conditioning", (req, res) => {
    res.render("user/service-testing", {
        title: "Air Conditioning Services"
    });
});

app.get("/transmission-services", (req, res) => {
    res.render("user/service-testing", {
        title: "Transmission Services"
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 404 Page
app.use((req, res) => {
    res.status(404).render('user/404');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
