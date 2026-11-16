import PageHeroBanner from "../components/common/PageHeroBanner";
import Button from "../components/ui/Button";
import { Link } from "react-router";
import ProgramCard from "../components/common/ProgramCard";
import CTABanner from "../components/common/CTABanner";
import ChecklistItem from "../components/common/ChecklistItem";
import AnimatedCount from "../components/common/AnimatedCount";
import SEO from "../components/SEO";
import { PROGRAMME_LIST } from "@/data/programmes";
import { Target, TrendingUp, Users, MapPin, Heart, Award } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import RevealText from "../components/motion/RevealText";
import RevealImage from "../components/motion/RevealImage";
import Marquee from "../components/motion/Marquee";
import Magnetic from "../components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1];

const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const cardRise = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

const FOCUS_AREAS = [
  "Quality education",
  "Mentorship",
  "Menstrual health",
  "Life skills",
  "Leadership",
  "Economic empowerment",
  "Community advocacy",
];

export default function HomePage() {
  const programs = PROGRAMME_LIST.map((programme) => ({
    title: programme.cardTitle,
    description: programme.teaser,
    image: programme.cardImage,
    to: `/programmes/${programme.slug}`,
  }));

  const Impact = [
    { title: "4,750+", description: "Girls Reached", icon: Users },
    { title: "20+", description: "Communities Served", icon: MapPin },
    { title: "70+", description: "Active Volunteers", icon: Heart },
    { title: "20+", description: "Programmes Delivered", icon: Award },
    { title: "10+", description: "States in Nigeria", icon: Target },
  ];

  const challenges = [
    "Limited access to quality education",
    "Gender inequality and early marriage pressure",
    "Lack of mentorship and role models",
    "Inadequate menstrual health resources",
    "Restricted economic opportunities",
  ];

  const Mission = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "RUGAN exists to break down the barriers facing rural girl-children and women by providing access to quality education, life skills, mentorship, and practical resources that empower them to become self-reliant, confident, and impactful leaders.",
    },
    {
      icon: TrendingUp,
      title: "Our Vision",
      description:
        "A world where every rural girl has equal access to opportunities, can realise her full potential, and grows into a global leader who shapes her community and the world with confidence and purpose.",
    },
  ];

  function IconFeatureCard({
    title,
    description,
    icon: Icon,
    variant = "outlined",
  }) {
    const isFilled = variant === "filled";

    return (
      <motion.div
        variants={cardRise}
        whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE } }}
        className={`group relative flex min-h-[240px] flex-col gap-4 overflow-hidden rounded-[20px] p-6 transition-shadow duration-500 sm:min-h-[260px] sm:gap-5 sm:p-8 ${
          isFilled
            ? "bg-[#4F7B44] shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_22px_40px_-12px_rgba(61,98,53,0.55)]"
            : "bg-white border border-[#E5E7EB] shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_22px_40px_-16px_rgba(16,24,40,0.2)]"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110 ${
            isFilled ? "bg-white/20" : "bg-[#4F7B44]"
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>

        <h3
          className={`text-[22px] font-bold ${
            isFilled ? "text-white" : "text-[#111]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-base leading-7 ${
            isFilled ? "text-[#E5E7EB]" : "text-[#6B7280]"
          }`}
        >
          {description}
        </p>
      </motion.div>
    );
  }

  function StatCard({ icon: Icon, title, description }) {
    return (
      <motion.div
        variants={cardRise}
        whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE } }}
        className="group flex flex-col items-center gap-4 rounded-[20px] border border-transparent bg-[#F9FAFB] px-5 py-7 text-center transition-[box-shadow,border-color,background-color] duration-500 hover:border-[#E1EDDE] hover:bg-white hover:shadow-[0_18px_36px_-16px_rgba(79,123,68,0.35)]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F0EA] transition-colors duration-300 group-hover:bg-[#4F7B44]">
          <Icon
            size={26}
            className="text-[#4F7B44] transition-[color,transform] duration-500 group-hover:scale-110 group-hover:text-white"
          />
        </div>

        <AnimatedCount
          as="h2"
          value={title}
          className="text-[32px] font-bold text-[#4F7B44]"
        />

        <p className="text-[15px] text-[#6B7280]">{description}</p>
      </motion.div>
    );
  }

  return (
    <div>
      <SEO
        title="RUGAN – Empowering Rural Girl-Children in Nigeria"
        description="RUGAN (The Rural Girl-Child Advancement Network) empowers rural girl-children in Nigeria through education, mentorship, menstrual health support, and leadership development."
        keywords="RUGAN, The Rural Girl-Child Advancement Network, RUGAN Nigeria, rural girl empowerment, girls education Nigeria, menstrual health education, girl-child mentorship, nonprofit Nigeria"
        path="/"
        pageType="AboutPage"
      />
      {/* HERO */}
      <PageHeroBanner
        title={
          <RevealText
            trigger="mount"
            delay={0.2}
            stagger={0.07}
            lines={[
              "Empowering Rural Girls",
              "to Become Tomorrow's",
              "Leaders",
            ]}
            className="block max-w-[700px] text-[clamp(1.75rem,7vw,3rem)] font-semibold leading-[1.14] tracking-[-0.03em] text-white sm:leading-[1.18] sm:tracking-[-0.04em]"
          />
        }
        subtitle={
          <span className="block max-w-[42rem] pt-3 pb-1 text-[clamp(0.9375rem,3.8vw,1.25rem)] font-normal leading-[1.6] tracking-[-0.01em] text-white/90 sm:pt-4 sm:pb-2 sm:leading-[1.7]">
            Breaking down barriers facing rural girl-children through quality
            education, life skills, mentorship, and practical resources.
          </span>
        }
        backgroundImage="/images/homepage/Hero.jpg"
        className="min-h-[480px] md:min-h-[500px] lg:min-h-[540px]"
      >
        <div className="mt-2 flex flex-col items-stretch gap-3 sm:mt-0 sm:flex-row sm:items-start sm:gap-4">
          <Magnetic className="w-full sm:w-auto">
            <Button
              as={Link}
              to="/donate"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto sm:min-w-[200px]"
            >
              Make a Donation
            </Button>
          </Magnetic>

          <Magnetic className="w-full sm:w-auto">
            <Button
              as={Link}
              to="/volunteers"
              variant="volunteer"
              size="lg"
              className="w-full sm:w-auto sm:min-w-[200px]"
            >
              Volunteer with Us
            </Button>
          </Magnetic>
        </div>
      </PageHeroBanner>

      {/* FOCUS AREAS STRIP */}
      <div className="border-b border-[#E1EDDE] bg-[#F0F7EE] py-4 text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#3d6235] sm:py-5 sm:text-base">
        <Marquee items={FOCUS_AREAS} speed={45} label="Our focus areas" />
      </div>

      {/* CHALLENGES */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col items-center justify-between gap-6 sm:gap-8 lg:flex-row lg:gap-10">
          <div className="w-full max-w-[520px] shrink-0">
            <RevealImage
              src="/images/homepage/rural-girls-with-card.png"
              alt="Girls education and teaching"
              from="top"
              className="aspect-[4/5] rounded-2xl border border-[#E5E5E5] shadow-lg"
            />
          </div>

          <div className="w-full max-w-[560px]">
            <RevealText
              as="h2"
              text="Breaking Down Barriers to Education"
              className="mb-4 block text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-[#111827]"
            />

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mb-8 text-[#555] leading-7"
            >
              Rural girl-children face persistent barriers to education,
              accurate information, mentorship, and economic empowerment.
              Poverty, gender inequality, early marriage, and limited community
              support restrict their opportunities and prevent them from
              building independent, impactful futures.
            </motion.p>

            <motion.ul
              className="flex flex-col gap-3.5 font-bold"
              variants={stagger(0.09, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {challenges.map((challenge, i) => (
                <ChecklistItem
                  key={i}
                  text={challenge}
                  variant="plain"
                  iconColor="#FFFFFF"
                  iconFill="none"
                  iconWrapperBg="#E07856"
                />
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Targeted School-Based Programmes"
            subtitle="RUGAN delivers comprehensive programmes that support rural girls at different stages of their life journey, equipping them with knowledge, confidence, and practical support."
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-6">
            {programs.slice(0, 3).map((program, i) => (
              <div key={program.title} className="lg:col-span-2">
                <ProgramCard {...program} variant="overlay" delay={i * 0.1} />
              </div>
            ))}

            {programs.slice(3, 5).map((program, i) => (
              <div key={program.title} className="lg:col-span-3">
                <ProgramCard {...program} variant="overlay" delay={i * 0.12} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Our Impact Across Nigeria"
            subtitle="Serving rural and underserved communities with targeted programmes that create lasting grassroots impact"
          />

          <div className="lg:hidden">
            <motion.div
              className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:gap-6"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {Impact.slice(0, 4).map((impact, i) => (
                <StatCard key={i} {...impact} />
              ))}
            </motion.div>

            <motion.div
              className="mx-auto mt-4 w-full max-w-[280px] sm:mt-6"
              variants={stagger()}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <StatCard {...Impact[4]} />
            </motion.div>
          </div>

          <motion.div
            className="mx-auto hidden max-w-6xl gap-6 lg:grid lg:grid-cols-5"
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {Impact.map((impact, i) => (
              <StatCard key={i} {...impact} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section-padding bg-gray-50">
        <motion.div
          className="container-rugan grid grid-cols-1 gap-6 lg:grid-cols-2"
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {Mission.map((item, i) => (
            <IconFeatureCard
              key={i}
              {...item}
              variant={i === 1 ? "filled" : "outlined"}
            />
          ))}
        </motion.div>
      </section>

      {/* ACROSS NIGERIA */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col items-center justify-between gap-6 sm:gap-8 lg:flex-row lg:gap-10">
          <div className="w-full max-w-[560px]">
            <RevealText
              as="h2"
              text="Serving Rural Nigeria"
              className="mb-4 block text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-[#111827]"
            />

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mb-8 text-[#555] leading-7"
            >
              RUGAN currently serves rural and underserved communities, with a
              focus on rural areas in Nigeria, working directly with
              girl-children, women, families, and community stakeholders to
              create lasting grassroots impact.
            </motion.p>

            <motion.div
              className="space-y-5"
              variants={stagger(0.12, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4EA]">
                  <MapPin size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="10+" className="inline-block" />{" "}
                    States Reached
                  </h3>
                  <p className="text-sm text-[#777]">Across rural Nigeria</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4EA]">
                  <Users size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="20+" className="inline-block" />{" "}
                    Communities
                  </h3>
                  <p className="text-sm text-[#777]">
                    Direct grassroots engagement
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="w-full max-w-[520px] shrink-0">
            <RevealImage
              src="/images/homepage/group-of-girls.jpg"
              alt="A group of girls taking part in a RUGAN programme"
              from="right"
              className="h-[260px] w-full rounded-2xl border border-[#E5E5E5] shadow-lg sm:h-[320px] lg:h-[430px]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Join Us in Empowering Rural Girls"
        subtitle="Your support helps us to reach more girls, deliver more programs, and create lasting change in rural communities across Nigeria."
        buttons={[
          {
            label: "Volunteer With Us",
            to: "/volunteers",
            variant: "volunteer",
          },
          {
            label: "Make a Donation",
            to: "/donate",
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
