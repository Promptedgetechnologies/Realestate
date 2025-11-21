# 🚀 Quick Start - Where to Check AI Lead Qualification

## 📍 Main Location: Admin Panel

### Step 1: Access Admin Panel
```
URL: http://localhost:3000/admin-panel
```

### Step 2: Click "AI Qualified Leads" Tab
You'll see 4 tabs:
1. Property Management
2. Lead Management  
3. **AI Qualified Leads** ← Click this one!
4. Analytics

### Step 3: View Qualified Leads
The dashboard shows:
- 📊 Statistics (Total, HOT, WARM, COLD, Avg Score)
- 🔍 Filter by status
- 📋 Table with all qualified leads
- 📥 Export to CSV button

## 🧪 How to Test It

### Option 1: Submit an Enquiry Form
1. Go to any property page: `http://localhost:3000/properties/[id]`
2. Scroll to "Send Enquiry" form
3. Fill in: Name, Email, Phone, Message
4. Click "Send Enquiry"
5. **Watch the qualification widget appear!**
6. Then go to Admin Panel → AI Qualified Leads tab

### Option 2: Direct API Test
Open browser console and run:
```javascript
fetch('/api/lead-qualification')
  .then(r => r.json())
  .then(data => console.log('Qualified Leads:', data))
```

## 📊 What You'll See

### In Admin Panel:
```
┌─────────────────────────────────────┐
│  AI Qualified Leads                 │
├─────────────────────────────────────┤
│  Stats:                              │
│  Total: 10  HOT: 3  WARM: 5  COLD: 2│
│  Avg Score: 65                      │
├─────────────────────────────────────┤
│  [Filter: All Leads ▼] [Export CSV] │
├─────────────────────────────────────┤
│  Name      | Status | Score | Actions│
│  John Doe  | 🔥 HOT | 85/100| View   │
│  Jane Smith| ⏰ WARM | 55/100| View   │
│  ...                                │
└─────────────────────────────────────┘
```

### In Qualification Widget (after form submission):
```
┌─────────────────────────────┐
│  AI Lead Qualification       │
│  Qualifying John Doe         │
├─────────────────────────────┤
│  🔥 HOT LEAD                 │
│  Score: 85/100              │
│                              │
│  Recommended Action:         │
│  Contact within 1 hour...   │
└─────────────────────────────┘
```

## 🔗 Direct Links

- **Admin Panel**: `http://localhost:3000/admin-panel`
- **API Endpoint**: `http://localhost:3000/api/lead-qualification`
- **Stats API**: `http://localhost:3000/api/lead-qualification/stats`
- **Data File**: `folder/data/qualified-leads.json`

## 📱 Mobile View

The admin panel is fully responsive! Access it on mobile:
- Same URL: `http://localhost:3000/admin-panel`
- Tap "AI Qualified Leads" tab
- View all leads with mobile-optimized layout

## 🎯 Quick Checklist

- [ ] Start the app: `npm run dev`
- [ ] Go to: `http://localhost:3000/admin-panel`
- [ ] Click "AI Qualified Leads" tab
- [ ] Submit a test enquiry
- [ ] Check the widget appears
- [ ] Refresh admin panel to see the new lead

## 💡 Pro Tips

1. **Filter by Status**: Use the dropdown to see only HOT leads
2. **Export Data**: Click "Export CSV" to download all leads
3. **View Details**: Click "View Details" on any lead for full information
4. **Call/Email**: Use the action buttons to contact leads directly

---

**That's it! Everything is ready to use.** 🎉

