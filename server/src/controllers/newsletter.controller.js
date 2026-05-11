import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmailSafely } from "../utils/email.js";
import { sendNewsletterSubscriptionConfirmation } from "../services/newsletter.service.js";
import { escapeHtml } from "../utils/helpers.js";
import { wrapEmailTemplate } from "../utils/emailTemplate.js";

export async function subscribe(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) throw new AppError("Email is required", 400);

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        // Resend confirmation email even if already subscribed
        await sendNewsletterSubscriptionConfirmation(email, false);
        return res.json({ success: true, message: "Already subscribed! We've resent your confirmation email." });
      }

      existing.isActive = true;
      await existing.save();
      const emailTasks = [sendNewsletterSubscriptionConfirmation(email, true)];

      if (process.env.ADMIN_EMAIL) {
        emailTasks.push(
          sendEmailSafely(
            {
            to: process.env.ADMIN_EMAIL,
            subject: "Newsletter Subscriber Re-activated",
            html: wrapEmailTemplate({
              heading: "RUGAN",
              subtitle: "Subscriber Re-activated",
              body: `<p style="font-size:15px;color:#374151;margin:0">Subscriber re-activated: <strong>${escapeHtml(email)}</strong></p>`,
            }),
            },
            "newsletter admin re-activation notification",
          ),
        );
      }

      await Promise.all(emailTasks);

      return res.json({
        success: true,
        message: "Welcome back! You are now re-subscribed.",
      });
    }

    await NewsletterSubscriber.create({ email });

    const emailTasks = [sendNewsletterSubscriptionConfirmation(email)];

    if (process.env.ADMIN_EMAIL) {
      emailTasks.push(
        sendEmailSafely(
          {
          to: process.env.ADMIN_EMAIL,
          subject: "New Newsletter Subscriber",
          html: wrapEmailTemplate({
            heading: "RUGAN",
            subtitle: "New Subscriber",
            body: `<p style="font-size:15px;color:#374151;margin:0">New subscriber: <strong>${escapeHtml(email)}</strong></p>`,
          }),
          },
          "newsletter admin notification",
        ),
      );
    }

    await Promise.all(emailTasks);

    res
      .status(201)
      .json({
        success: true,
        message: "Subscribed successfully! Check your email for confirmation.",
      });
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) throw new AppError("Email not found", 404);

    subscriber.isActive = false;
    await subscriber.save();
    res.json({ success: true, message: "Unsubscribed successfully." });
  } catch (err) {
    next(err);
  }
}

export async function getSubscribers(req, res, next) {
  try {
    const subscribers = await NewsletterSubscriber.find({
      isActive: true,
    }).sort({ subscribedAt: -1 });
    res.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (err) {
    next(err);
  }
}

export async function sendBroadcast(req, res, next) {
  try {
    const { subject, content } = req.body;
    
    if (!subject || !content) {
      throw new AppError("Subject and content are required.", 400);
    }

    // Process attachments from multer
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          name: file.originalname,
          content: file.buffer.toString('base64')
        });
      }
    }

    // Fetch active subscribers
    const subscribers = await NewsletterSubscriber.find({ isActive: true });
    
    if (subscribers.length === 0) {
      return res.json({ success: true, message: "No active subscribers found. Broadcast not sent." });
    }

    // Wrap the body in the standard email template
    const emailHtml = wrapEmailTemplate({
      heading: "RUGAN",
      subtitle: subject,
      body: content,
    });

    const emailTasks = subscribers.map((sub) => {
      return sendEmailSafely(
        {
          to: sub.email,
          subject: subject,
          html: emailHtml,
          attachments: attachments.length > 0 ? attachments : undefined
        },
        "newsletter broadcast"
      );
    });

    await Promise.allSettled(emailTasks);

    res.json({
      success: true,
      message: `Broadcast sent successfully to ${subscribers.length} subscriber(s).`
    });
  } catch (err) {
    next(err);
  }
}
