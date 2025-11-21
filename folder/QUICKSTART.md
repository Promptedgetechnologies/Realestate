# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:3000`

### Step 4: Explore the Application

#### Customer View
- **Homepage**: `http://localhost:3000`
  - Browse featured properties
  - Search for properties
  - View trending locations

- **Properties**: `http://localhost:3000/properties`
  - Filter by location, price, type, bedrooms
  - Sort by price or popularity
  - Click any property to view details

- **Property Details**: `http://localhost:3000/properties/[id]`
  - View full property information
  - Submit enquiry
  - Schedule site visit
  - Calculate EMI

- **Chatbot**: Click the chat icon (bottom right)
  - Ask: "Show me 3BHK apartments in Mumbai"
  - Ask: "What's the EMI for ₹50L?"
  - Ask: "Tell me about Downtown location"

#### Admin Panel
- **Admin Dashboard**: `http://localhost:3000/admin-panel`
  - **Property Management**: Add, Edit, Delete properties
  - **Lead Management**: View enquiries and visits
  - **Analytics**: View statistics and trends

## 📝 Sample Data

The application comes with sample data:
- 6 sample properties
- 2 sample enquiries
- 2 sample visits
- Location data for 5 cities
- Chatbot knowledge base

## 🎯 Key Features to Test

### 1. Property Search
- Go to homepage
- Enter search query
- Apply filters
- Sort results

### 2. Property Details
- Click any property
- View all tabs (Details, Enquiry, Visit, EMI)
- Submit an enquiry
- Schedule a visit

### 3. AI Chatbot
- Click chat icon
- Try these queries:
  - "Show me apartments in Bangalore"
  - "I need a 2BHK villa"
  - "Calculate EMI for ₹1 crore"
  - "What properties do you have?"

### 4. Admin Panel
- Go to `/admin-panel`
- Add a new property
- Edit existing property
- View leads
- Export data to CSV
- Check analytics

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run linter
```

## 📁 Important Files

- `data/properties.json` - Property data
- `data/locations.json` - Location data
- `data/enquiries.json` - Enquiry data
- `data/visits.json` - Visit data
- `lib/data-loader.ts` - Data management
- `lib/chatbot.ts` - Chatbot logic

## ⚠️ Important Notes

1. **Data Persistence**: Data is stored in-memory. Changes are lost on server restart.

2. **Admin Access**: Admin panel is accessible at `/admin-panel` without authentication.

3. **No Database**: All data comes from JSON files. No database connection needed.

4. **API Routes**: All API routes work in development and production.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. **Customize Data**: Edit JSON files in `data/` folder
2. **Modify Theme**: Update `tailwind.config.js`
3. **Add Features**: Extend components in `components/`
4. **Deploy**: Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
  },
}
```

### Add Properties
1. Go to Admin Panel
2. Click "Add New Property"
3. Fill in details
4. Submit

### Modify Chatbot
Edit `lib/chatbot.ts`:
- Add new intents
- Modify property matching logic
- Update response templates

## 📞 Need Help?

- Check [README.md](README.md) for overview
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture
- Review [docs/WORKFLOWS.md](docs/WORKFLOWS.md) for workflows
- Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment

---

**Happy Coding! 🎉**

