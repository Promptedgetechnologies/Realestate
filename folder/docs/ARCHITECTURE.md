# System Architecture

## Overview

This Real Estate Web Application is built using **Next.js 14** with **TypeScript** and follows a **no-database, no-login** architecture. All data is stored in JSON files and managed in-memory during runtime.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Homepage   │  │  Properties  │  │   Property   │      │
│  │              │  │    Listing   │  │   Details    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Chatbot    │  │   Enquiry    │  │ Visit Form  │      │
│  │   Widget     │  │    Form      │  │             │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ADMIN PANEL (/admin-panel)              │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │ Properties │ │   Leads    │ │ Analytics  │      │   │
│  │  │ Management│ │ Management │ │ Dashboard   │      │   │
│  │  └────────────┘ └────────────┘ └────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /api/properties  │  /api/enquiries  │  /api/visits         │
│  /api/chatbot     │  (All CRUD operations)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  Data Loader     │  │  Chatbot Engine  │                  │
│  │  (lib/data-      │  │  (lib/chatbot.ts)│                  │
│  │   loader.ts)     │  │                  │                  │
│  │                  │  │  - Intent        │                  │
│  │  - getProperties │  │    Detection     │                  │
│  │  - addProperty   │  │  - Property      │                  │
│  │  - updateProperty│  │    Matching     │                  │
│  │  - deleteProperty│  │  - Response      │                  │
│  │  - getEnquiries  │  │    Generation    │                  │
│  │  - addEnquiry    │  │  - EMI Calc      │                  │
│  │  - getVisits     │  │                  │                  │
│  │  - addVisit      │  └──────────────────┘                  │
│  └──────────────────┘                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ properties.  │  │ locations.   │  │ enquiries.   │      │
│  │    json      │  │    json      │  │    json      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  visits.json │  │  chatbot-    │                         │
│  │              │  │  knowledge.  │                         │
│  │              │  │    json      │                         │
│  └──────────────┘  └──────────────┘                         │
│                                                               │
│  ⚠️  All data stored in-memory during runtime                │
│  ⚠️  Changes persist only during session                     │
│  ⚠️  No database, no file writes                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Framer Motion** - Animation library (optional)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **No external database** - In-memory data storage
- **JSON files** - Static data source

### Data Storage
- **JSON files** in `/data` directory
- **In-memory arrays** for runtime operations
- **No persistent storage** (data resets on server restart)

## Component Structure

```
components/
├── Navbar.tsx              # Main navigation
├── Footer.tsx              # Site footer
├── PropertyCard.tsx        # Property card component
├── EnquiryForm.tsx         # Customer enquiry form
├── VisitForm.tsx           # Site visit scheduling form
├── EMICalculator.tsx       # EMI calculation component
├── ChatbotWidget.tsx       # AI chatbot widget
└── admin/
    ├── PropertyManagement.tsx
    ├── LeadManagement.tsx
    └── AnalyticsDashboard.tsx
```

## Page Structure

```
app/
├── page.tsx                 # Homepage
├── layout.tsx               # Root layout
├── properties/
│   ├── page.tsx            # Property listing page
│   └── [id]/
│       └── page.tsx        # Property details page
├── admin-panel/
│   └── page.tsx            # Admin dashboard
└── api/
    ├── properties/
    │   └── route.ts        # Property CRUD API
    ├── enquiries/
    │   └── route.ts        # Enquiry API
    ├── visits/
    │   └── route.ts        # Visit API
    └── chatbot/
        └── route.ts        # Chatbot API
```

## Data Flow

### Customer Flow
1. User visits homepage → Views featured properties
2. User searches/filters → Property listing page
3. User clicks property → Property details page
4. User submits enquiry/visit → API route → Data loader → In-memory storage
5. User interacts with chatbot → Chatbot engine → Property matching → Response

### Admin Flow
1. Admin accesses `/admin-panel` (no authentication)
2. Admin views/manages properties → API routes → Data loader
3. Admin views leads → Enquiries & Visits from in-memory storage
4. Admin exports data → Client-side CSV generation

## Key Features

### 1. No Database Architecture
- All data loaded from JSON files at startup
- In-memory arrays for runtime operations
- Changes persist only during server session
- Perfect for demos, prototypes, and static deployments

### 2. AI Chatbot
- Rules-based intent detection
- Property matching based on requirements
- JSON-based knowledge base
- No external LLM API required (can be extended)

### 3. Admin Panel
- Direct URL access (no login)
- Full CRUD operations for properties
- Lead management with status updates
- Analytics dashboard with real-time stats

## Security Considerations

Since there's no login system:
- Admin panel is accessible via direct URL
- No authentication or authorization
- Suitable for internal/demo use only
- For production, add authentication layer

## Scalability

### Current Limitations
- Data resets on server restart
- No concurrent user data isolation
- Limited to in-memory storage capacity

### Future Enhancements
- Add database (PostgreSQL/MongoDB)
- Implement authentication
- Add file-based persistence
- Add caching layer
- Implement real-time updates

