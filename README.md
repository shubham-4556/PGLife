# PG Life - Property Rental Platform

A comprehensive PHP-based web application for finding and managing Paying Guest (PG) accommodations across major Indian cities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**PG Life** is a property rental platform designed to help students and working professionals find suitable PG accommodations in major Indian cities. The platform provides an intuitive interface for browsing properties, viewing detailed information, managing favorites, and user authentication.

### Key Highlights

- **Multi-city Support**: Delhi, Mumbai, Bengaluru, Hyderabad, Chennai
- **Property Categories**: Male, Female, and Unisex PGs
- **Rich Property Details**: Images, amenities, ratings, testimonials
- **User Dashboard**: Track interested properties and manage profile
- **Responsive Design**: Works on desktop and mobile devices

---

## ✨ Features

### For Users

| Feature | Description |
|---------|-------------|
| **City-based Search** | Browse PGs by major Indian cities |
| **Property Listings** | View all available properties with photos, rent, ratings |
| **Advanced Filtering** | Filter by gender (Male/Female/Unisex), sort by rent |
| **Property Details** | Comprehensive view with carousel, amenities, ratings, testimonials |
| **Interest Tracking** | Heart/favorite properties to track interest |
| **User Dashboard** | Personal profile and saved properties |
| **Authentication** | Secure signup/login with session management |

### Property Information Includes

- **Image Carousel** - Multiple property photos
- **Ratings** - Cleanliness, Food Quality, Safety (1-5 stars)
- **Amenities** - Categorized by Building, Common Area, Bedroom, Washroom
- **Testimonials** - Reviews from previous residents
- **Description** - Detailed property information
- **Gender-specific** - Male, Female, or Unisex accommodations

---

## 🛠 Tech Stack

### Backend
- **PHP 7.4+** - Server-side scripting
- **MySQL/MariaDB** - Relational database
- **mysqli** - Database extension (prepared statements recommended for production)

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with responsive design
- **Bootstrap 4** - CSS framework for responsive grid and components
- **jQuery** - DOM manipulation and AJAX
- **Font Awesome 5** - Icons

### Database
- **MySQL** - Primary database
- **Tables**: users, cities, properties, amenities, properties_amenities, testimonials, interested_users_properties

---

## 📁 Project Structure

```
PGLife/
├── api/
│   ├── login_submit.php      # User login handler
│   └── signup_submit.php     # User registration handler
├── css/
│   ├── bootstrap.min.css     # Bootstrap framework
│   ├── common.css            # Shared styles
│   ├── dashboard.css         # Dashboard page styles
│   ├── home.css              # Home page styles
│   ├── property_detail.css   # Property detail page styles
│   └── property_list.css     # Property listing page styles
├── img/
│   ├── amenities/            # Amenity icons (SVG)
│   ├── properties/           # Property images (organized by property ID)
│   ├── *.png                 # City images, icons, logos
│   └── *.gif                 # Loading spinners
├── includes/
│   ├── database_connect.php  # Database connection
│   ├── footer.php            # Footer template
│   ├── header.php            # Header/navigation template
│   ├── head_links.php        # Common head links (CSS, JS, meta)
│   ├── login_modal.php       # Login modal template
│   └── signup_modal.php      # Signup modal template
├── js/
│   ├── bootstrap.min.js      # Bootstrap JS
│   └── jquery.js             # jQuery library
├── index.php                 # Homepage with city search
├── dashboard.php             # User dashboard (protected)
├── property_list.php         # City-wise property listings
├── property_detail.php       # Detailed property view
├── logout.php                # Session destruction
├── setup_database.sql        # Complete database schema + seed data
└── favicon.ico               # Site favicon
```

---

## 🗄 Database Schema

### Tables

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (SHA1 hashed) |
| full_name | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | NOT NULL |
| gender | VARCHAR(10) | NOT NULL |
| college_name | VARCHAR(255) | NOT NULL |

#### `cities`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | UNIQUE, NOT NULL |

#### `properties`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| city_id | INT | FOREIGN KEY → cities(id) |
| name | VARCHAR(255) | NOT NULL |
| address | TEXT | NOT NULL |
| gender | VARCHAR(10) | NOT NULL (male/female/unisex) |
| rent | INT | NOT NULL |
| rating_clean | DECIMAL(2,1) | DEFAULT 0 |
| rating_food | DECIMAL(2,1) | DEFAULT 0 |
| rating_safety | DECIMAL(2,1) | DEFAULT 0 |
| description | TEXT | NULL |

#### `amenities`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| type | VARCHAR(50) | NOT NULL (Building/Common Area/Bedroom/Washroom) |
| icon | VARCHAR(255) | NOT NULL |

#### `properties_amenities` (Junction Table)
| Column | Type | Constraints |
|--------|------|-------------|
| property_id | INT | FOREIGN KEY → properties(id) |
| amenity_id | INT | FOREIGN KEY → amenities(id) |
| PRIMARY KEY | (property_id, amenity_id) | Composite |

#### `testimonials`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| property_id | INT | FOREIGN KEY → properties(id) |
| user_name | VARCHAR(255) | NOT NULL |
| content | TEXT | NOT NULL |

#### `interested_users_properties` (Junction Table)
| Column | Type | Constraints |
|--------|------|-------------|
| user_id | INT | FOREIGN KEY → users(id) |
| property_id | INT | FOREIGN KEY → properties(id) |
| PRIMARY KEY | (user_id, property_id) | Composite |

---

## 🚀 Installation & Setup

### Prerequisites

- **Web Server**: Apache/Nginx with PHP support
- **PHP**: 7.4 or higher
- **MySQL/MariaDB**: 5.7 or higher
- **Extensions**: mysqli, session

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubham-4556/PGLife.git
   cd PGLife
   ```

2. **Configure Database**
   - Create a MySQL database
   - Import the schema:
     ```bash
     mysql -u your_username -p < setup_database.sql
     ```
   - Or run the SQL directly in your MySQL client

3. **Configure Database Connection**
   Edit `includes/database_connect.php` with your credentials:
   ```php
   $conn = mysqli_connect("localhost", "username", "password", "pglife");
   ```

4. **Set up Web Server**
   - Point document root to the project directory
   - Ensure PHP is enabled
   - For Apache, ensure `mod_rewrite` is enabled (if using .htaccess)

5. **File Permissions** (Linux/Mac)
   ```bash
   chmod 755 img/properties/*/ -R
   chmod 644 img/properties/*/* -R
   ```

6. **Access the Application**
   - Open `http://localhost/PGLife/` in your browser

---

## 💻 Usage

### Homepage (`index.php`)
- Search PGs by city name
- Quick access to major cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai)
- Login/Signup modals

### Property Listings (`property_list.php?city=<city_name>`)
- View all properties in a selected city
- Filter by gender type
- Sort by rent (ascending/descending)
- See interest count and ratings

### Property Details (`property_detail.php?property_id=<id>`)
- Full-screen image carousel
- Complete amenities list (categorized)
- Detailed ratings breakdown
- Testimonials from residents
- "Book Now" and "Heart/Interest" actions

### Dashboard (`dashboard.php`)
- **Requires login**
- View profile information
- Track all interested properties
- Quick navigation to property details

### Authentication
- **Signup**: Full name, phone, email, password, college, gender
- **Login**: Email + password (SHA1 hashed)
- Session-based authentication

---

## 🔌 API Endpoints

### POST `/api/signup_submit.php`
Register a new user.

**Request Body** (form-data):
| Field | Type | Required |
|-------|------|----------|
| full_name | string | Yes |
| phone | string | Yes |
| email | string | Yes |
| password | string | Yes |
| college_name | string | Yes |
| gender | string (male/female/other) | Yes |

**Response**: HTML with success/error message

### POST `/api/login_submit.php`
Authenticate user and create session.

**Request Body** (form-data):
| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

**Response**: Redirects to `index.php` on success, error message on failure

### GET `/logout.php`
Destroy session and redirect to homepage.

---

## 🖼 Screenshots

### Homepage
- City search with autocomplete
- Major city cards for quick navigation

### Property Listing
- Grid of property cards with images
- Star ratings and interest counts
- Filter modal for gender selection

### Property Detail
- Full-width image carousel
- Amenities grouped by category
- Three-criteria rating system
- Testimonial carousel

### Dashboard
- User profile card
- Saved/Interested properties grid
- Quick view navigation

---

## ⚠️ Security Considerations

> **Important**: This is a demonstration/educational project. For production use, implement the following:

### Current Limitations
- **Password Hashing**: Uses SHA1 (insecure) - upgrade to `password_hash()`/`password_verify()` (bcrypt/argon2)
- **SQL Injection**: Direct string interpolation in queries - use prepared statements
- **XSS Protection**: No output escaping - use `htmlspecialchars()` on all user data
- **CSRF Protection**: No CSRF tokens on forms
- **Session Security**: No secure/httponly cookie flags
- **Input Validation**: Minimal server-side validation

### Recommended Improvements
```php
// Prepared statement example
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

// Password hashing
$hash = password_hash($password, PASSWORD_ARGON2ID);
if (password_verify($password, $hash)) { /* valid */ }

// XSS prevention
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Maintain responsive design principles
- Test across browsers (Chrome, Firefox, Safari, Edge)
- Ensure mobile compatibility

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shubham Deo**
- GitHub: [@shubham-4556](https://github.com/shubham-4556)

---

## 🙏 Acknowledgments

- Bootstrap team for the CSS framework
- Font Awesome for icons
- Sample images from various free stock photo sites
- Community contributors

---

## 📞 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/shubham-4556/PGLife/issues) page.

---

*Last updated: September 2026*