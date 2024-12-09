# HOY Event Platform Design System

## Core Design Principles

1. Event Visibility First
2. Easy Navigation & Discovery
3. Clear Event Information Hierarchy
4. Immersive Event Previews
5. Seamless User Flow

## Key UI Components

### Event Card System

```typescript:frontend/components/events/EventCard.tsx
export const EventCard = styled(motion.div)`
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: rgba(27, 27, 27, 0.95);
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  
  .event-image {
    aspect-ratio: 16/9;
    position: relative;
    overflow: hidden;
    
    img {
      transition: transform 0.6s ease;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
    
    .event-date {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 215, 0, 0.9);
      color: #161618;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
    }
  }

  .event-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`
```

### Event Calendar View

```typescript:frontend/components/events/CalendarView.tsx
export const EventCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  
  .calendar-day {
    background: #1B1B1B;
    aspect-ratio: 1;
    padding: 0.5rem;
    
    &.has-event {
      background: linear-gradient(
        45deg,
        rgba(255, 215, 0, 0.1),
        rgba(255, 215, 0, 0.05)
      );
    }
    
    &.selected {
      border: 2px solid #FFD700;
    }
  }
`
```

### Quick Event Details

```typescript:frontend/components/events/QuickView.tsx
export const EventQuickView = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  padding: 2rem;
  background: rgba(33, 36, 39, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  
  .quick-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #E5E4E6;
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`
```

### Event Filters

```typescript:frontend/components/events/FilterBar.tsx
export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #212427;
  border-radius: 12px;
  overflow-x: auto;
  
  .filter-chip {
    padding: 0.5rem 1rem;
    background: ${props => props.selected ? '#FFD700' : 'transparent'};
    color: ${props => props.selected ? '#161618' : '#E5E4E6'};
    border: 1px solid ${props => props.selected ? '#FFD700' : 'rgba(255,255,255,0.1)'};
    border-radius: 20px;
    white-space: nowrap;
    cursor: pointer;
    
    &:hover {
      border-color: #FFD700;
    }
  }
`
```

### Event Details Page

```typescript:frontend/components/events/EventDetails.tsx
export const EventDetailsLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    .hero-image {
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 2rem;
    }
    
    .event-description {
      background: #1B1B1B;
      padding: 2rem;
      border-radius: 16px;
    }
  }
  
  .sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }
`
```

### Typography for Events

```typescript:frontend/styles/typography.ts
const eventTypography = {
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: 600,
    lineHeight: 1.2,
    fontFamily: 'var(--font-grotesk)',
  },
  
  metadata: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  price: {
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
    fontWeight: 700,
    color: '#FFD700',
  },
  
  description: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'rgba(229, 228, 230, 0.9)',
  }
}
```

### Interactive Elements

```typescript:frontend/components/ui/ActionButtons.tsx
export const PrimaryButton = styled(motion.button)`
  background: #FFD700;
  color: #161618;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  
  &:disabled {
    background: rgba(255, 215, 0, 0.3);
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #FFD700;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid #FFD700;
  cursor: pointer;
`
```

### Loading States

```typescript:frontend/components/ui/EventSkeleton.tsx
export const EventSkeleton = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: #1B1B1B;
  border-radius: 16px;
  
  .skeleton-line {
    height: 1rem;
    background: linear-gradient(
      90deg,
      #212427 25%,
      #2A2D31 50%,
      #212427 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`
```

## Typography System

### Font Configuration

```typescript:app/lib/fonts.ts
import { Inter, Clash_Display } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const clash = Clash_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-clash',
})
```

### Typography Scale
```css:app/styles/typography.css
:root {
  --font-heading: var(--font-clash);
  --font-body: var(--font-inter);
  
  /* Font Sizes */
  --text-xs: clamp(0.75rem, 2vw, 0.875rem);
  --text-sm: clamp(0.875rem, 2vw, 1rem);
  --text-base: clamp(1rem, 2.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 3vw, 1.25rem);
  --text-xl: clamp(1.25rem, 4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 5vw, 2rem);
  --text-3xl: clamp(2rem, 6vw, 3rem);
  --text-4xl: clamp(3rem, 8vw, 4rem);
}
``` 