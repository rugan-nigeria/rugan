import { useEffect, useState } from "react";
import {
  BarChart2,
  Eye,
  FileText,
  Heart,
  Users,
  UserPlus,
  Mail,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

function StatCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#6B7280]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#111827]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs font-medium text-[#6B7280]">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await api.get("/analytics");
        setData(response.data.data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #E5E7EB",
            borderTopColor: "#4F7B44",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center text-center text-red-600">
          <AlertCircle size={48} className="mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => new Intl.NumberFormat().format(num || 0);
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(num || 0);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#101828]">Website Analytics</h1>
        <p className="text-sm text-[#475467]">
          Overview of key performance and engagement metrics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Blog Views"
          value={formatNumber(data?.blog?.views)}
          icon={Eye}
          colorClass="bg-[#E8F2E6] text-[#4F7B44]"
        />
        <StatCard
          title="Published Articles"
          value={formatNumber(data?.blog?.published)}
          subtitle={`${formatNumber(data?.blog?.drafts)} in drafts`}
          icon={FileText}
          colorClass="bg-[#EAF3FE] text-[#1E5DDE]"
        />
        <StatCard
          title="Total Donations"
          value={formatCurrency(data?.donations?.amount)}
          subtitle={`${formatNumber(data?.donations?.count)} successful transactions`}
          icon={Heart}
          colorClass="bg-[#FCE8E8] text-[#D92D20]"
        />
        <StatCard
          title="Admin Users"
          value={formatNumber(data?.users)}
          icon={Users}
          colorClass="bg-[#F3F0FF] text-[#6941C6]"
        />
        <StatCard
          title="Newsletter Subscribers"
          value={formatNumber(data?.subscribers)}
          icon={Mail}
          colorClass="bg-[#FEF3F2] text-[#B42318]"
        />
        <StatCard
          title="Volunteer Applications"
          value={formatNumber(data?.volunteers)}
          icon={UserPlus}
          colorClass="bg-[#ECFDF3] text-[#027A48]"
        />
        <StatCard
          title="Partnership Inquiries"
          value={formatNumber(data?.partnerships)}
          icon={Briefcase}
          colorClass="bg-[#FFF4ED] text-[#B54708]"
        />
      </div>
    </div>
  );
}
