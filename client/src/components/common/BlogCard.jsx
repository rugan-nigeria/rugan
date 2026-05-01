import { motion } from 'framer-motion'
import { scaleIn, viewportOnce } from '@/lib/motion'
import { Link } from 'react-router'
import { ArrowRight, User, Calendar } from 'lucide-react'
import OptimizedImage from '@/components/common/OptimizedImage'

/**
 * BlogCard
 * Used on: Blog listing page
 */
export default function BlogCard({ image, title, excerpt, author, date, to, tags, className = '' }) {
  return (
    <div
      className={className}
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: '1rem',
        overflow: 'hidden',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.10)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Image */}
      <OptimizedImage
        src={image}
        alt={title}
        aspectRatio="16/9"
        style={{ flexShrink: 0 }}
      />

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1rem', fontWeight: 700, color: '#111827',
          lineHeight: 1.45, marginBottom: '0.625rem',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {title}
        </h3>

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
            {tags.map(tag => (
              <span key={tag} style={{ padding: '2px 10px', borderRadius: '9999px', background: '#E8F2E6', color: '#3d6235', fontSize: '0.75rem', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt grows to fill available space, pushing meta + link to bottom */}
        {excerpt && (
          <p style={{
            fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.65,
            marginBottom: '1rem', flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          fontSize: '0.8125rem', color: '#9CA3AF',
          marginBottom: '1rem',
        }}>
          {author && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <User size={13} />{author}
            </span>
          )}
          {date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={13} />{date}
            </span>
          )}
        </div>

        {/* Read More */}
        <Link
          to={to}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.875rem', fontWeight: 600,
            color: 'var(--color-primary)', textDecoration: 'none',
            transition: 'gap 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = '0.625rem' }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = '0.375rem' }}
        >
          Read More <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
