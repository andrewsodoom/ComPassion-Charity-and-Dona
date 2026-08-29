import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCampaignUpdateEmail = async ({
  recipient,
  campaign,
  update
}) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: recipient,
    subject: `${campaign.title}: ${update.title}`,
    html: `
      <h2>${update.title}</h2>
      <p>${update.content}</p>
      <p>
        <a href="${process.env.CLIENT_URL}/campaigns/${campaign.id}">
          View campaign
        </a>
      </p>
    `
  });
};