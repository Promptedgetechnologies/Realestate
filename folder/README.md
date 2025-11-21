# Real Estate Web Application

A complete Real Estate Web Application built with **Next.js 14**, featuring a customer-facing website and admin panel. This application uses **NO DATABASE** and **NO LOGIN** - all data is stored in hardcoded JSON files.

## 🚀 Features

### Customer View (Public Website)
- ✅ **Homepage** with animated banners, property categories, featured properties, trending locations, videos, and photo gallery
- ✅ **Property Listing Page** with advanced filters (location, price, type, bedrooms, amenities)
- ✅ **Property Details Page** with images, description, features, amenities, and nearby facilities
- ✅ **EMI Calculator** for property financing
- ✅ **Enquiry Form** to submit property inquiries (triggers AI Lead Qualification)
- ✅ **Schedule Site Visit** form
- ✅ **AI Chatbot** with property recommendations and multi-language support
- ✅ **Fully Responsive** - Optimized for mobile, tablet, and desktop

### Business View (Admin Panel)
- ✅ **Property Management** - Add, Edit, Delete properties
- ✅ **Lead Management** - View enquiries and scheduled visits
- ✅ **AI Qualified Leads** - View and manage AI-qualified leads (HOT/WARM/COLD)
- ✅ **Analytics Dashboard** - Property stats, trending locations, most viewed properties
- ✅ **CSV Export** for leads data
- ✅ **Lead Qualification Stats** - Track qualification performance

### AI Lead Qualification System 🚀
- ✅ **Instant Qualification** - Automatically qualifies leads within 0-30 seconds
- ✅ **Smart Scoring** - 0-100 score based on 7 key questions
- ✅ **Lead Classification** - HOT (70+), WARM (40-69), COLD (<40)
- ✅ **Notification System** - Email, WhatsApp, Slack, CRM ready
- ✅ **Persistent Storage** - Saves all qualified leads
- ✅ **Admin Dashboard** - View, filter, and export qualified leads
- ✅ **Appointment Booking** - Automatic appointment scheduling

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Data Storage**: JSON files (no database)
- **Authentication**: None (direct access)
- **Deployment**: Vercel, Netlify, or any Node.js host

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── properties/
│   │   ├── page.tsx            # Property listing
│   │   └── [id]/page.tsx       # Property details
│   ├── admin-panel/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       ├── properties/         # Property CRUD API
│       ├── enquiries/          # Enquiry API
│       ├── visits/             # Visit API
│       └── chatbot/            # Chatbot API
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PropertyCard.tsx
│   ├── EnquiryForm.tsx
│   ├── VisitForm.tsx
│   ├── EMICalculator.tsx
│   ├── ChatbotWidget.tsx
│   └── admin/
│       ├── PropertyManagement.tsx
│       ├── LeadManagement.tsx
│       └── AnalyticsDashboard.tsx
├── data/
│   ├── properties.json          # Property data
│   ├── locations.json           # Location data
│   ├── enquiries.json           # Enquiry data
│   ├── visits.json              # Visit data
│   └── chatbot-knowledge.json   # Chatbot knowledge base
├── lib/
│   ├── data-loader.ts           # Data management
│   └── chatbot.ts               # Chatbot logic
└── docs/
    ├── ARCHITECTURE.md          # System architecture
    ├── WORKFLOWS.md             # User workflows
    ├── DEPLOYMENT.md            # Deployment guide
    └── SECURITY.md              # Security plan
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Customer View
1. Visit homepage: `http://localhost:3000`
2. Browse properties or use search
3. Apply filters on properties page
4. View property details
5. Submit enquiry or schedule visit
6. Interact with AI chatbot

### Admin Panel
1. Access admin panel: `http://localhost:3000/admin-panel`
2. Manage properties (Add/Edit/Delete)
3. View and manage leads (Enquiries & Visits)
4. View analytics dashboard
5. Export data to CSV

## 🤖 AI Chatbot

The chatbot provides:
- Property recommendations based on requirements
- Price and EMI information
- Location details
- Multi-language support (extensible)
- Property matching logic
- Conversational interface

### Example Queries:
- "Show me 3BHK apartments in Mumbai"
- "What's the EMI for ₹50L?"
- "Tell me about Downtown location"
- "I need a villa with garden"

## 📊 Data Management

### Adding Properties
1. Go to Admin Panel → Property Management
2. Click "Add New Property"
3. Fill in all details
4. Submit

**Note**: Data is stored in-memory and resets on server restart.

### Data Files
- `data/properties.json` - Property listings
- `data/locations.json` - Location information
- `data/enquiries.json` - Customer enquiries
- `data/visits.json` - Scheduled visits
- `data/chatbot-knowledge.json` - Chatbot knowledge base

## 🔧 Configuration

### Environment Variables
Create `.env.local` (optional):
```env
# Admin panel secret path (optional)
ADMIN_SECRET_PATH=/admin-panel

# API key (if implementing)
API_KEY=your-api-key
```

### Customization
- Update `tailwind.config.js` for theme colors
- Modify JSON files for data
- Update `lib/chatbot.ts` for chatbot logic
- Customize components in `components/`

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Docker
```bash
docker build -t real-estate-app .
docker run -p 3000:3000 real-estate-app
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guide.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Workflows](docs/WORKFLOWS.md) - User workflows and processes
- [Deployment](docs/DEPLOYMENT.md) - Deployment guide and options
- [Security](docs/SECURITY.md) - Security considerations and plan

## ⚠️ Important Notes

### Data Persistence
- ⚠️ **Data is stored in-memory** - All changes are lost on server restart
- ⚠️ **JSON files are read-only** - They serve as initial data source
- ⚠️ **No database** - For production, add a database

### Security
- ⚠️ **No authentication** - Admin panel is accessible via direct URL
- ⚠️ **Suitable for demos** - Not recommended for production without security enhancements
- See [docs/SECURITY.md](docs/SECURITY.md) for security recommendations

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Data**: JSON files
- **Deployment**: Vercel/Netlify/Any Node.js host

## 📝 API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties?id={id}` - Get property by ID
- `POST /api/properties` - Add new property
- `PUT /api/properties` - Update property
- `DELETE /api/properties?id={id}` - Delete property

### Enquiries
- `GET /api/enquiries` - Get all enquiries
- `POST /api/enquiries` - Submit enquiry
- `PUT /api/enquiries` - Update enquiry status

### Visits
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Schedule visit
- `PUT /api/visits` - Update visit status

### Chatbot
- `POST /api/chatbot` - Chatbot interaction

### Lead Qualification
- `POST /api/lead-qualification` - Qualify a lead
- `GET /api/lead-qualification` - Get all qualified leads
- `GET /api/lead-qualification?status=HOT` - Filter by status
- `PUT /api/lead-qualification` - Update lead/appointment
- `GET /api/lead-qualification/stats` - Get statistics
- `POST /api/notifications/test` - Test notifications

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎯 AI Lead Qualification

The application includes a complete **AI Lead Qualification System** that:

- ✅ Automatically qualifies leads within 0-30 seconds
- ✅ Scores leads from 0-100 based on 7 smart questions
- ✅ Classifies leads as HOT, WARM, or COLD
- ✅ Sends notifications for HOT leads (Email, WhatsApp, Slack, CRM)
- ✅ Stores all qualified leads persistently
- ✅ Provides admin dashboard for managing qualified leads

**See [docs/AI_LEAD_QUALIFICATION.md](docs/AI_LEAD_QUALIFICATION.md) for full documentation.**

**See [docs/SETUP_AI_LEAD_QUALIFICATION.md](docs/SETUP_AI_LEAD_QUALIFICATION.md) for setup instructions.**

## 🎯 Future Enhancements

- [ ] Add database for persistence (currently using JSON files)
- [ ] Implement authentication for admin panel
- [ ] Add real-time updates via WebSockets
- [ ] Integrate external LLM for chatbot
- [ ] Add image upload functionality
- [ ] Implement search with Elasticsearch
- [ ] Integrate actual phone calling (Twilio)
- [ ] Mobile app version

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `docs/` folder
- Review code comments

## 🙏 Acknowledgments

Built with Next.js, TypeScript, and Tailwind CSS.

---

**Note**: This is a demo/prototype application. For production use, implement proper authentication, database, and security measures.

