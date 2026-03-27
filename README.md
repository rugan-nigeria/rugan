# RUGAN

Monorepo for the RUGAN website.

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Real-time**: Socket.io

## Getting Started

### 1. Install dependencies
```bash
# Install root deps
npm install

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Fill in your values
```

### 3. Run development servers
```bash
# From root — runs both client and server
npm run dev
```

Client runs on http://localhost:5173  
Server runs on http://localhost:5000



FILE STRUCTURE:

rugan/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md

├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── TeamPage.jsx
│       │   ├── ProgramsPage.jsx
│       │   ├── programs/
│       │   │   ├── IdgcProjectPage.jsx
│       │   │   ├── HealthyPeriodPage.jsx
│       │   │   ├── RiseProjectPage.jsx
│       │   │   ├── ExcellenceAwardPage.jsx
│       │   │   └── RuralToGlobalPage.jsx
│       │   ├── ImpactPage.jsx
│       │   ├── VolunteerPage.jsx
│       │   ├── PartnerPage.jsx
│       │   ├── BlogPage.jsx
│       │   ├── BlogPostPage.jsx
│       │   └── DonatePage.jsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── PageWrapper.jsx
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Badge.jsx
│       │   │   └── Modal.jsx
│       │   ├── sections/
│       │   │   ├── HeroSection.jsx
│       │   │   ├── ImpactStats.jsx
│       │   │   └── TeamGrid.jsx
│       │   ├── forms/
│       │   │   ├── DonateForm.jsx
│       │   │   ├── VolunteerForm.jsx
│       │   │   └── PartnerForm.jsx
│       │   └── blog/
│       │       ├── BlogCard.jsx
│       │       ├── BlogList.jsx
│       │       └── BlogFilter.jsx
│       ├── hooks/
│       │   ├── useSocket.js
│       │   ├── useFetch.js
│       │   └── useForm.js
│       ├── context/
│       │   ├── SocketContext.jsx
│       │   └── ThemeContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   └── socket.js
│       ├── assets/
│       │   ├── images/
│       │   ├── fonts/
│       │   └── icons/
│       ├── styles/
│       │   ├── globals.css
│       │   └── variables.css
│       ├── utils/
│       │   ├── formatDate.js
│       │   └── slugify.js
│       ├── router.jsx
│       └── main.jsx

└── backend/
    ├── package.json
    ├── server.js
    └── src/
        ├── routes/
        │   ├── blog.routes.js
        │   ├── donation.routes.js
        │   ├── volunteer.routes.js
        │   ├── partner.routes.js
        │   ├── programs.routes.js
        │   └── team.routes.js
        ├── controllers/
        │   ├── blog.controller.js
        │   ├── donation.controller.js
        │   ├── volunteer.controller.js
        │   ├── partner.controller.js
        │   ├── programs.controller.js
        │   └── team.controller.js
        ├── models/
        │   ├── BlogPost.model.js
        │   ├── Donation.model.js
        │   ├── Volunteer.model.js
        │   ├── Partner.model.js
        │   └── TeamMember.model.js
        ├── sockets/
        │   ├── index.js
        │   └── chat.socket.js
        ├── middleware/
        │   ├── errorHandler.js
        │   ├── rateLimiter.js
        │   └── cors.js
        ├── db/
        │   ├── connection.js
        │   └── migrations/
        ├── config/
        │   ├── app.config.js
        │   └── db.config.js
        └── utils/
            ├── sendEmail.js
            ├── validate.js
            └── logger.js