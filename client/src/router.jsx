import { Routes, Route } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import ProgramsPage from './pages/ProgramsPage'
import ImpactPage from './pages/ImpactPage'
import VolunteerPage from './pages/VolunteerPage'
import PartnerPage from './pages/PartnerPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import DonatePage from './pages/DonatePage'

import IdgcProjectPage from './pages/programs/IdgcProjectPage'
import HealthyPeriodPage from './pages/programs/HealthyPeriodPage'
import RiseProjectPage from './pages/programs/RiseProjectPage'
import ExcellenceAwardPage from './pages/programs/ExcellenceAwardPage'
import RuralToGlobalPage from './pages/programs/RuralToGlobalPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PageWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/idgc" element={<IdgcProjectPage />} />
        <Route path="/programs/healthy-period" element={<HealthyPeriodPage />} />
        <Route path="/programs/rise" element={<RiseProjectPage />} />
        <Route path="/programs/excellence-award" element={<ExcellenceAwardPage />} />
        <Route path="/programs/rural-to-global" element={<RuralToGlobalPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/donate" element={<DonatePage />} />
      </Route>
    </Routes>
  )
}
