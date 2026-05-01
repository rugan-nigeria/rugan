import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import ProgramCard from "@/components/common/ProgramCard";
import CTABanner from "@/components/common/CTABanner";

const PROGRAMS = [
  {
    slug: "rugan-idgc-school-tours",
    title: "RUGAN IDGC School Tours",
    description:
      "Annual empowerment sessions in rural secondary schools building confidence, leadership skills, and self-belief during International Day of the Girl Child.",
    image: "/images/programs/card-1.jpg",
  },
  {
    slug: "rugan-healthy-period-project",
    title: "RUGAN Healthy Period Project",
    description:
      "Providing menstrual health education, reducing stigma, and distributing sanitary pads to ensure girls can participate fully in school.",
    image: "/images/programs/card-2.jpg",
  },
  {
    slug: "excellence-award-project",
    title: "Excellence Awards",
    description:
      "Recognising and rewarding outstanding academic performance among rural secondary school girls to motivate excellence and retention.",
    image: "/images/programs/card-3.jpg",
  },
  {
    slug: "the-rise-project",
    title: "The RISE Project",
    description:
      "Guiding SS3 girls on life after secondary school, including educational, vocational, and career pathways for a confident transition.",
    image: "/images/programs/card-4.jpg",
  },
  {
    slug: "rural-to-global-programme",
    title: "Rural-to-Global Programme",
    description:
      "Highlighting success stories and providing mentorship to help rural girls dream bigger and access global opportunities.",
    image: "/images/programs/card-5.jpg",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeroBanner
        title="Our Programmes"
        subtitle="Comprehensive initiatives designed to empower girl-children and create lasting change in communities"
        backgroundImage="/images/programs/programs-hero.jpg"
        centerText
        darkOverlay
      />

      <section className="section-padding">
        <div className="container-rugan">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {PROGRAMS.map((programme) => (
              <motion.div
                key={programme.slug}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <ProgramCard
                  image={programme.image}
                  title={programme.title}
                  description={programme.description}
                  to={`/programmes/${programme.slug}`}
                  variant="plain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Want to Support Our Programmes?"
        subtitle="Your contribution helps us reach more girls and expand our impact."
        buttons={[
          { label: "Make a Donation", to: "/donate", variant: "primary" },
          {
            label: "Become a Partner",
            to: "/partnership",
            variant: "volunteer",
          },
        ]}
      />
    </>
  );
}
