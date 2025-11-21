import { QualifiedLead } from './lead-qualifier';
import { generateQualificationSummary } from './lead-qualifier';

export interface NotificationConfig {
  email?: {
    enabled: boolean;
    to: string[];
    from: string;
    smtp?: {
      host: string;
      port: number;
      user: string;
      password: string;
    };
  };
  whatsapp?: {
    enabled: boolean;
    apiKey?: string;
    phoneNumber?: string;
  };
  slack?: {
    enabled: boolean;
    webhookUrl?: string;
  };
  crm?: {
    enabled: boolean;
    type: 'hubspot' | 'salesforce' | 'pipedrive' | 'custom';
    apiKey?: string;
    webhookUrl?: string;
  };
}

// Default notification config (can be overridden via environment variables)
const defaultConfig: NotificationConfig = {
  email: {
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
    to: (process.env.EMAIL_NOTIFICATION_TO || 'sales@example.com').split(','),
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  whatsapp: {
    enabled: process.env.WHATSAPP_NOTIFICATIONS_ENABLED === 'true',
    apiKey: process.env.WHATSAPP_API_KEY,
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
  },
  slack: {
    enabled: process.env.SLACK_NOTIFICATIONS_ENABLED === 'true',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
  },
  crm: {
    enabled: process.env.CRM_INTEGRATION_ENABLED === 'true',
    type: (process.env.CRM_TYPE as any) || 'hubspot',
    apiKey: process.env.CRM_API_KEY,
    webhookUrl: process.env.CRM_WEBHOOK_URL,
  },
};

// Send email notification
export async function sendEmailNotification(
  lead: QualifiedLead,
  config: NotificationConfig = defaultConfig
): Promise<boolean> {
  if (!config.email?.enabled) {
    console.log('Email notifications disabled');
    return false;
  }

  try {
    const summary = generateQualificationSummary(lead);
    const subject = `🔥 ${lead.status} LEAD: ${lead.name} - Score: ${lead.qualificationScore}/100`;
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${lead.status === 'HOT' ? '#dc2626' : lead.status === 'WARM' ? '#f59e0b' : '#3b82f6'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .score { font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }
    .info { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; }
    .action { background: #fef3c7; padding: 15px; margin: 10px 0; border-left: 4px solid #f59e0b; }
    .button { display: inline-block; padding: 12px 24px; background: #0284c7; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${lead.status} LEAD ALERT</h1>
      <p>New qualified lead requires immediate attention</p>
    </div>
    <div class="content">
      <div class="score" style="color: ${lead.status === 'HOT' ? '#dc2626' : lead.status === 'WARM' ? '#f59e0b' : '#3b82f6'}">
        ${lead.qualificationScore}/100
      </div>
      
      <div class="info">
        <h3>Lead Information</h3>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
        ${lead.propertyTitle ? `<p><strong>Property:</strong> ${lead.propertyTitle}</p>` : ''}
      </div>
      
      <div class="action">
        <h3>Recommended Action</h3>
        <p>${lead.recommendedAction}</p>
      </div>
      
      <div class="info">
        <h3>Key Insights</h3>
        <ul>
          ${lead.insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="tel:${lead.phone}" class="button">Call Now</a>
        <a href="mailto:${lead.email}" class="button">Send Email</a>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // In production, use nodemailer or similar
    // For now, log the email (you can integrate with SendGrid, AWS SES, etc.)
    console.log('📧 EMAIL NOTIFICATION:', {
      to: config.email.to,
      subject,
      body: emailBody,
    });

    // Example: Send via API (uncomment and configure)
    /*
    if (config.email.smtp) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: true,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.password,
        },
      });
      
      await transporter.sendMail({
        from: config.email.from,
        to: config.email.to.join(','),
        subject,
        html: emailBody,
      });
    }
    */

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

// Send WhatsApp notification
export async function sendWhatsAppNotification(
  lead: QualifiedLead,
  config: NotificationConfig = defaultConfig
): Promise<boolean> {
  if (!config.whatsapp?.enabled) {
    console.log('WhatsApp notifications disabled');
    return false;
  }

  try {
    const message = `🔥 *${lead.status} LEAD ALERT*

*${lead.name}*
📊 Score: ${lead.qualificationScore}/100
📧 ${lead.email}
📱 ${lead.phone}
${lead.propertyTitle ? `🏠 Property: ${lead.propertyTitle}` : ''}

*Recommended Action:*
${lead.recommendedAction}

*Key Insights:*
${lead.insights.slice(0, 3).map(i => `• ${i}`).join('\n')}

View in Admin Panel: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin-panel`;

    // In production, use Twilio WhatsApp API or similar
    console.log('💬 WHATSAPP NOTIFICATION:', {
      to: config.whatsapp.phoneNumber,
      message,
    });

    // Example: Send via Twilio (uncomment and configure)
    /*
    if (config.whatsapp.apiKey) {
      const twilio = require('twilio');
      const client = twilio(config.whatsapp.apiKey, config.whatsapp.apiSecret);
      
      await client.messages.create({
        from: `whatsapp:${config.whatsapp.phoneNumber}`,
        to: `whatsapp:${process.env.SALES_TEAM_WHATSAPP}`,
        body: message,
      });
    }
    */

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}

// Send Slack notification
export async function sendSlackNotification(
  lead: QualifiedLead,
  config: NotificationConfig = defaultConfig
): Promise<boolean> {
  if (!config.slack?.enabled || !config.slack.webhookUrl) {
    console.log('Slack notifications disabled');
    return false;
  }

  try {
    const color = lead.status === 'HOT' ? 'danger' : lead.status === 'WARM' ? 'warning' : 'good';
    
    const payload = {
      text: `🔥 ${lead.status} LEAD: ${lead.name}`,
      attachments: [
        {
          color,
          fields: [
            {
              title: 'Qualification Score',
              value: `${lead.qualificationScore}/100`,
              short: true,
            },
            {
              title: 'Status',
              value: lead.status,
              short: true,
            },
            {
              title: 'Contact',
              value: `${lead.email}\n${lead.phone}`,
              short: true,
            },
            {
              title: 'Property',
              value: lead.propertyTitle || 'General Enquiry',
              short: true,
            },
            {
              title: 'Recommended Action',
              value: lead.recommendedAction,
              short: false,
            },
            {
              title: 'Key Insights',
              value: lead.insights.slice(0, 5).join('\n'),
              short: false,
            },
          ],
          actions: [
            {
              type: 'button',
              text: 'Call Now',
              url: `tel:${lead.phone}`,
            },
            {
              type: 'button',
              text: 'View in Admin',
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin-panel`,
            },
          ],
        },
      ],
    };

    const response = await fetch(config.slack.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}

// Send to CRM
export async function sendToCRM(
  lead: QualifiedLead,
  config: NotificationConfig = defaultConfig
): Promise<boolean> {
  if (!config.crm?.enabled) {
    console.log('CRM integration disabled');
    return false;
  }

  try {
    const crmData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      qualification_score: lead.qualificationScore,
      lead_status: lead.status,
      property_interest: lead.propertyTitle,
      recommended_action: lead.recommendedAction,
      insights: lead.insights,
      qualified_at: lead.qualifiedAt,
    };

    // HubSpot integration example
    if (config.crm.type === 'hubspot' && config.crm.apiKey) {
      console.log('📊 Sending to HubSpot:', crmData);
      
      // Example implementation (uncomment and configure)
      /*
      const hubspot = require('@hubspot/api-client');
      const hubspotClient = new hubspot.Client({ apiKey: config.crm.apiKey });
      
      await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          email: lead.email,
          firstname: lead.name.split(' ')[0],
          lastname: lead.name.split(' ').slice(1).join(' '),
          phone: lead.phone,
          qualification_score: lead.qualificationScore.toString(),
          lead_status: lead.status,
        },
      });
      */
    }

    // Webhook integration (generic)
    if (config.crm.webhookUrl) {
      const response = await fetch(config.crm.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crmData),
      });

      return response.ok;
    }

    console.log('📊 CRM DATA:', crmData);
    return true;
  } catch (error) {
    console.error('Error sending to CRM:', error);
    return false;
  }
}

// Send all notifications for a hot lead
export async function notifyHotLead(
  lead: QualifiedLead,
  config: NotificationConfig = defaultConfig
): Promise<{
  email: boolean;
  whatsapp: boolean;
  slack: boolean;
  crm: boolean;
}> {
  const results = {
    email: false,
    whatsapp: false,
    slack: false,
    crm: false,
  };

  if (lead.status === 'HOT') {
    // Send all notifications in parallel
    const [email, whatsapp, slack, crm] = await Promise.allSettled([
      sendEmailNotification(lead, config),
      sendWhatsAppNotification(lead, config),
      sendSlackNotification(lead, config),
      sendToCRM(lead, config),
    ]);

    results.email = email.status === 'fulfilled' && email.value;
    results.whatsapp = whatsapp.status === 'fulfilled' && whatsapp.value;
    results.slack = slack.status === 'fulfilled' && slack.value;
    results.crm = crm.status === 'fulfilled' && crm.value;
  }

  return results;
}

