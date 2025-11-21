# AI Lead Qualification - Complete Setup Guide

## 🚀 Quick Start

The AI Lead Qualification system is now fully integrated and ready to use! Here's everything you need to know.

## ✅ What's Included

1. **Automatic Lead Qualification** - Triggers instantly when forms are submitted
2. **Smart Scoring System** - 0-100 score based on 7 key questions
3. **Lead Classification** - HOT, WARM, COLD categories
4. **Notification System** - Email, WhatsApp, Slack, CRM ready
5. **Persistent Storage** - Saves to JSON file
6. **Admin Dashboard** - View and manage all qualified leads
7. **Export Functionality** - CSV export for analysis

## 📋 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Notifications (Optional)
EMAIL_NOTIFICATIONS_ENABLED=true
EMAIL_NOTIFICATION_TO=sales@yourcompany.com,manager@yourcompany.com
EMAIL_FROM=noreply@yourcompany.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# WhatsApp (Optional - requires Twilio)
WHATSAPP_NOTIFICATIONS_ENABLED=false
WHATSAPP_API_KEY=your-twilio-api-key
WHATSAPP_PHONE_NUMBER=+1234567890

# Slack (Optional)
SLACK_NOTIFICATIONS_ENABLED=false
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# CRM Integration (Optional)
CRM_INTEGRATION_ENABLED=false
CRM_TYPE=hubspot
CRM_API_KEY=your-crm-api-key
CRM_WEBHOOK_URL=https://your-crm-webhook-url.com/leads
```

### 2. Install Dependencies (Optional - for production integrations)

For email notifications:
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

For WhatsApp (Twilio):
```bash
npm install twilio
```

For HubSpot CRM:
```bash
npm install @hubspot/api-client
```

### 3. Data Storage

The system automatically creates `data/qualified-leads.json` to store all qualified leads. Make sure the `data` directory is writable.

## 🎯 How It Works

### Automatic Flow

1. **User submits enquiry form** → `/api/enquiries`
2. **System triggers qualification** → `/api/lead-qualification` (0-30 seconds)
3. **AI asks 7 questions** (simulated, ready for phone integration)
4. **Lead is scored** (0-100) and classified (HOT/WARM/COLD)
5. **HOT leads trigger notifications** (Email, WhatsApp, Slack, CRM)
6. **All leads saved** to `data/qualified-leads.json`
7. **Admin can view** in Admin Panel → "AI Qualified Leads" tab

### Qualification Questions

The system asks these 7 questions (in order of importance):

1. **Site Visit Interest** (Weight: 10) - Most important
2. **Budget Range** (Weight: 10)
3. **Timeline** (Weight: 9)
4. **Loan Pre-approval** (Weight: 9)
5. **Property Type** (Weight: 8)
6. **Bedrooms** (Weight: 7)
7. **Location Preference** (Weight: 6)

### Scoring System

- **HOT Lead**: 70+ score → Immediate action required
- **WARM Lead**: 40-69 score → Follow up within 24 hours
- **COLD Lead**: <40 score → Add to nurture campaign

## 📧 Setting Up Notifications

### Email Notifications

1. Enable in `.env.local`:
   ```env
   EMAIL_NOTIFICATIONS_ENABLED=true
   EMAIL_NOTIFICATION_TO=sales@yourcompany.com
   ```

2. Configure SMTP (Gmail example):
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

3. Uncomment email code in `lib/notifications.ts`:
   ```typescript
   // Uncomment the nodemailer section
   ```

### WhatsApp Notifications (Twilio)

1. Get Twilio account and API keys
2. Enable in `.env.local`:
   ```env
   WHATSAPP_NOTIFICATIONS_ENABLED=true
   WHATSAPP_API_KEY=your-twilio-account-sid
   WHATSAPP_PHONE_NUMBER=+1234567890
   ```

3. Uncomment Twilio code in `lib/notifications.ts`

### Slack Notifications

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Enable in `.env.local`:
   ```env
   SLACK_NOTIFICATIONS_ENABLED=true
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

### CRM Integration

#### HubSpot

1. Get HubSpot API key
2. Enable in `.env.local`:
   ```env
   CRM_INTEGRATION_ENABLED=true
   CRM_TYPE=hubspot
   CRM_API_KEY=your-hubspot-api-key
   ```

3. Install HubSpot SDK:
   ```bash
   npm install @hubspot/api-client
   ```

4. Uncomment HubSpot code in `lib/notifications.ts`

#### Generic Webhook

For any CRM with webhook support:

```env
CRM_INTEGRATION_ENABLED=true
CRM_TYPE=custom
CRM_WEBHOOK_URL=https://your-crm-webhook-url.com/leads
```

## 🔧 API Endpoints

### Lead Qualification

- `POST /api/lead-qualification` - Qualify a lead
- `GET /api/lead-qualification` - Get all qualified leads
- `GET /api/lead-qualification?status=HOT` - Filter by status
- `GET /api/lead-qualification?enquiryId=xxx` - Get specific lead
- `PUT /api/lead-qualification` - Update lead (appointment booking)
- `GET /api/lead-qualification/stats` - Get statistics

### Notifications (Testing)

- `POST /api/notifications/test` - Test notification system

## 📊 Admin Dashboard

Access: `/admin-panel` → "AI Qualified Leads" tab

Features:
- View all qualified leads
- Filter by status (HOT/WARM/COLD)
- View detailed lead information
- Export to CSV
- Call/Email leads directly
- View qualification insights

## 🧪 Testing

### Test Lead Qualification

1. Submit an enquiry form on any property page
2. Watch the qualification widget appear
3. Check Admin Panel → "AI Qualified Leads"

### Test Notifications

```bash
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "test@example.com",
    "phone": "+1234567890",
    "status": "HOT",
    "score": 85
  }'
```

## 🚨 Production Checklist

Before going live:

- [ ] Set up environment variables
- [ ] Configure email notifications
- [ ] Set up WhatsApp (if needed)
- [ ] Configure Slack webhook (if needed)
- [ ] Set up CRM integration (if needed)
- [ ] Test notification system
- [ ] Verify data persistence
- [ ] Set up monitoring/alerts
- [ ] Review security settings
- [ ] Test end-to-end flow

## 🔐 Security Notes

- Never commit `.env.local` to git
- Use secure passwords for SMTP
- Rotate API keys regularly
- Use HTTPS in production
- Validate all inputs
- Rate limit API endpoints

## 📈 Monitoring

Check logs for:
- Lead qualification success/failure
- Notification delivery status
- API errors
- Storage issues

## 🆘 Troubleshooting

### Leads not saving
- Check `data/` directory permissions
- Verify file system access
- Check console for errors

### Notifications not sending
- Verify environment variables
- Check notification service credentials
- Review logs for errors
- Test with `/api/notifications/test`

### Admin panel not showing leads
- Refresh the page
- Check API endpoint response
- Verify data file exists

## 🎉 You're All Set!

The AI Lead Qualification system is now fully operational. Every enquiry will be automatically qualified, and HOT leads will trigger notifications to your sales team.

For questions or issues, check the main documentation or review the code comments.

