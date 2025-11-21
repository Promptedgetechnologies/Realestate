# Workflows

## 1. Customer Search & Filter Workflow

```
┌─────────────┐
│  Homepage   │
└──────┬──────┘
       │ User enters search query
       ▼
┌─────────────────┐
│ Search Bar      │
│ - Location      │
│ - Price         │
│ - Type          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Properties Page │
│ - Filters       │
│ - Sort Options  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Filtered Results│
│ - Property Cards│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Property Details│
│ - Full Info     │
│ - Forms         │
└─────────────────┘
```

### Steps:
1. Customer visits homepage
2. Enters search query in search bar
3. Redirected to properties page with search params
4. Applies additional filters (location, price, type, bedrooms, amenities)
5. Sorts results (price, popularity)
6. Views property details
7. Submits enquiry or schedules visit

## 2. Customer Enquiry Workflow

```
┌─────────────────┐
│ Property Details│
└──────┬──────────┘
       │ User clicks "Send Enquiry"
       ▼
┌─────────────────┐
│  Enquiry Form   │
│ - Name          │
│ - Email         │
│ - Phone         │
│ - Message       │
└──────┬──────────┘
       │ Submit
       ▼
┌─────────────────┐
│ POST /api/      │
│   enquiries     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Data Loader     │
│ addEnquiry()    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ In-Memory Array │
│ (enquiries)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Success Message │
│ "Enquiry        │
│  Submitted!"    │
└─────────────────┘
```

### Steps:
1. Customer views property details
2. Clicks "Send Enquiry" tab
3. Fills out enquiry form
4. Submits form → API call
5. Data added to in-memory enquiries array
6. Success message displayed
7. Admin can view enquiry in admin panel

## 3. Schedule Site Visit Workflow

```
┌─────────────────┐
│ Property Details│
└──────┬──────────┘
       │ User clicks "Schedule Visit"
       ▼
┌─────────────────┐
│   Visit Form    │
│ - Name          │
│ - Email         │
│ - Phone         │
│ - Date          │
│ - Time          │
│ - Notes         │
└──────┬──────────┘
       │ Submit
       ▼
┌─────────────────┐
│ POST /api/visits│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Data Loader     │
│ addVisit()      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ In-Memory Array │
│ (visits)        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Success Message │
│ "Visit          │
│  Scheduled!"    │
└─────────────────┘
```

## 4. AI Chatbot Interaction Workflow

```
┌─────────────────┐
│  Chatbot Widget │
└──────┬──────────┘
       │ User sends message
       ▼
┌─────────────────┐
│ Intent Detection│
│ - Price Query   │
│ - Location      │
│ - Recommendation│
│ - EMI Query     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Extract         │
│ Requirements    │
│ - Location      │
│ - Price Range   │
│ - Bedrooms      │
│ - Type          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Property        │
│ Matching        │
│ - Filter by reqs│
│ - Sort by score │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Generate        │
│ Response        │
│ - Text response │
│ - Properties    │
│ - Actions       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Display Response│
│ - Message       │
│ - Property Cards│
│ - Forms         │
└─────────────────┘
```

### Example Conversation:
1. User: "Show me 3BHK apartments in Mumbai"
2. Bot detects: Recommendation intent
3. Extracts: bedrooms=3, location=Mumbai, type=Apartment
4. Matches properties from JSON data
5. Returns: List of matching properties with details
6. User: "What's the EMI for ₹50L?"
7. Bot detects: EMI query
8. Shows EMI calculator with calculations

## 5. Admin Property Management Workflow

```
┌─────────────────┐
│  Admin Panel    │
│  /admin-panel   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Property Mgmt   │
│ Tab             │
└──────┬──────────┘
       │
       ├─── Add Property ───┐
       │                    │
       ├─── Edit Property ──┤
       │                    │
       └─── Delete Property │
                            │
                            ▼
                    ┌───────────────┐
                    │ Property Form │
                    │ - All Fields  │
                    └───────┬───────┘
                            │ Submit
                            ▼
                    ┌───────────────┐
                    │ API Route     │
                    │ POST/PUT/DELETE│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Data Loader   │
                    │ - addProperty │
                    │ - updateProperty│
                    │ - deleteProperty│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ In-Memory     │
                    │ Update        │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ UI Refresh    │
                    │ (Properties   │
                    │  List Updated)│
                    └───────────────┘
```

## 6. Admin Lead Management Workflow

```
┌─────────────────┐
│  Admin Panel    │
│  Lead Mgmt Tab  │
└──────┬──────────┘
       │
       ├─── Enquiries Tab ───┐
       │                     │
       └─── Visits Tab ──────┤
                             │
                             ▼
                    ┌───────────────┐
                    │ View Leads    │
                    │ - Table View  │
                    │ - Status      │
                    └───────┬───────┘
                            │
                            ├─── Update Status ───┐
                            │                    │
                            ├─── Add Comment ────┤
                            │                    │
                            └─── Export CSV ─────┤
                                                 │
                                                 ▼
                                        ┌───────────────┐
                                        │ Client-Side   │
                                        │ CSV Export    │
                                        └───────────────┘
```

## 7. Data Update Flow (No Persistence)

```
┌─────────────────┐
│  User Action    │
│  (Add/Edit/Delete)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  API Route      │
│  (POST/PUT/DELETE)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Data Loader    │
│  Function       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  In-Memory Array│
│  Updated        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Response       │
│  Returned       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  UI Refreshed   │
│  (Client-side)  │
└─────────────────┘

⚠️  Note: Changes are lost on server restart
⚠️  JSON files are read-only (not updated)
```

## 8. Chatbot to Enquiry Conversion

```
┌─────────────────┐
│  Chatbot        │
│  Conversation   │
└──────┬──────────┘
       │ User asks about property
       ▼
┌─────────────────┐
│  Bot Shows      │
│  Properties     │
└──────┬──────────┘
       │ User clicks property
       ▼
┌─────────────────┐
│  Redirect to    │
│  Property Page  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Enquiry Form   │
│  Pre-filled     │
│  (if possible)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Submit Enquiry │
└─────────────────┘
```

## Key Workflow Characteristics

1. **No Authentication**: All workflows are accessible without login
2. **In-Memory Storage**: All data changes are temporary
3. **Client-Side Heavy**: Most operations happen on client
4. **API-Driven**: All data operations go through API routes
5. **Real-Time Updates**: UI updates immediately after operations
6. **No Persistence**: Data resets on server restart

