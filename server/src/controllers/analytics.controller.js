import BlogPost from "../models/BlogPost.model.js";
import Donation from "../models/Donation.model.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.model.js";
import PartnershipInquiry from "../models/PartnershipInquiry.model.js";
import User from "../models/User.model.js";
import VolunteerApplication from "../models/VolunteerApplication.model.js";

export const getAnalytics = async (req, res, next) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalNewsletterSubscribers = await NewsletterSubscriber.countDocuments();
    const totalVolunteers = await VolunteerApplication.countDocuments();
    const totalPartnerships = await PartnershipInquiry.countDocuments();

    // Blog aggregates
    const blogAggregates = await BlogPost.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalPublished: {
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
          },
          totalDrafts: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
        },
      },
    ]);

    const blogStats = blogAggregates[0] || { totalViews: 0, totalPublished: 0, totalDrafts: 0 };

    // Donation aggregates
    const donationAggregates = await Donation.aggregate([
      { $match: { status: "successful" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const donationStats = donationAggregates[0] || { totalAmount: 0, totalCount: 0 };

    res.json({
      success: true,
      data: {
        users: totalUsers,
        subscribers: totalNewsletterSubscribers,
        volunteers: totalVolunteers,
        partnerships: totalPartnerships,
        blog: {
          views: blogStats.totalViews,
          published: blogStats.totalPublished,
          drafts: blogStats.totalDrafts,
        },
        donations: {
          amount: donationStats.totalAmount,
          count: donationStats.totalCount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
