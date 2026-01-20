# Bestie Collabs - Brand-Creator Collaboration Platform

A Laravel-powered platform connecting brands with content creators for authentic collaborations and partnerships.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: React 19, Inertia.js v2, Tailwind CSS v4
- **Database**: PostgreSQL (with JSONB support)
- **Authentication**: Laravel Fortify
- **Testing**: PHPUnit
- **Code Quality**: Laravel Pint

## Feature Development Status

### ✅ Completed Features
- Initial project setup
- Development environment configuration
- **Database Foundation**: Brand and Creator models, migrations, and factories
  - UUID primary keys for both models
  - Comprehensive field definitions with proper casting
  - Factory definitions with realistic test data
  - JSONB support for creator follower demographics
- **Admin Authentication System**
  - Added `is_admin` field to users table
  - Created `EnsureUserIsAdmin` middleware
  - Registered middleware alias for route protection
- **Admin Panel - Brand Management**
  - Full CRUD controllers with Inertia responses
  - Form request validation (StoreBrandRequest, UpdateBrandRequest)
  - React/TypeScript pages: Index (list with pagination), Create, Edit, Show
  - Multi-section forms with validation feedback
  - Admin routes protected with auth and admin middleware
- **Admin Panel - Creator Management**
  - Full CRUD controllers with Inertia responses
  - Form request validation (StoreCreatorRequest, UpdateCreatorRequest)
  - React/TypeScript pages: Index (list with pagination), Create, Edit, Show
  - Language selection dropdown with 10 language options
  - Support for JSONB follower demographics
  - Admin routes protected with auth and admin middleware
- **Directory Card System**
  - BrandDirectoryCard model and migration (with scores, metrics, badges)
  - CreatorDirectoryCard model and migration (with scores, metrics, badges)
  - JSONB fields for social links, categories, demographics, content previews
  - Foreign key relationships to brands and creators
- **Messaging System Foundation**
  - Message model and migration
  - Polymorphic relationships for brand-to-creator and creator-to-brand messaging
  - Read status tracking
  - UUID primary keys with indexed polymorphic fields
- **Development Tooling**
  - Wayfinder TypeScript route generation configured
  - Laravel Pint code formatting applied
  - Frontend assets built successfully (Vite + React + Inertia)
- **Public Brand Directory**
  - BrandDirectoryController with index and show methods
  - Public routes at `/brands` and `/brands/{id}`
  - BrandCard component with badges, categories, social links
  - Grid layout with responsive design (4 columns on xl screens)
  - Pagination with prev/next and numbered pages
  - Empty state for when no brands exist
  - Truncated descriptions with "View Details" CTA
  - Social media icons (Instagram, TikTok, Website)
  - Comprehensive detail pages with gradient headers
  - Organized sections for about, demographics, and social connections
  - Clickable social media cards with branded icons
- **Public Creator Directory**
  - CreatorDirectoryController with index and show methods
  - Public routes at `/creators` and `/creators/{id}`
  - CreatorCard component with profile information
  - Grid layout matching brand directory design
  - Language and follower demographics display
  - Pagination and empty states
  - "View Profile" CTA buttons
  - Detailed profile pages with audience demographics
  - Platform-specific follower insights (Instagram, TikTok)
  - Gender distribution and location breakdowns
- **Bestie Score Calculation System**
  - BestieScoreService with weighted algorithms (0-5 scale)
  - Database migrations for bestie_score and metric fields
  - Brand scoring: collaborations, ratings, response rate, activity (4 factors)
  - Creator scoring: posts, engagement, growth, quality, frequency (5 factors)
  - Artisan command `bestie:calculate-scores` with filtering options
  - Dynamic score display on all directory cards and detail pages
  - Conditional rendering (only shows if score > 0)
  - Proper decimal casting in Eloquent models
- **Match Score AI Logic System**
  - MatchScoreService calculating brand-creator compatibility (0-5 scale)
  - BrandCreatorMatch pivot table with score breakdown storage
  - Age range overlap algorithm (40% weight)
  - Category alignment scoring with primary/secondary/tertiary matching (40% weight)
  - Geographic compatibility checks (10% weight)
  - Quality threshold using Bestie Scores (10% weight)
  - Artisan command `match:calculate-scores` with progress tracking
  - Top 6 matches displayed on brand and creator detail pages
  - Green match score badges on match cards
  - Threshold filtering to store only quality matches
- **CRM Messaging System**
  - Message model with polymorphic sender/recipient relationships
  - MessageController with inbox, conversation, and send message functionality
  - Inbox page showing all conversations with unread count badges
  - Conversation page with chat-style message bubbles and auto-scroll
  - "Send Message" buttons on brand and creator detail pages
  - Auto-marking messages as read when viewing
  - Message timestamps with relative time formatting (date-fns)
  - Protected routes requiring authentication
  - Message validation (max 5000 characters)
- **Directory Search & Filter System**
  - Search by name or description (case-insensitive PostgreSQL ilike)
  - Category filter matching primary/secondary/tertiary categories
  - Age range filter with overlap calculation
  - Sort by latest or Bestie Score
  - Apply and Clear Filters buttons with conditional visibility
  - Query string preservation for filtered pagination
  - Responsive 4-column filter grid layout
  - React state management for filter values
- **CSV Bulk Upload System**
  - BrandImportController and CreatorImportController for CSV processing
  - Import pages accessible from admin Brand and Creator index pages
  - CSV file upload with validation (max 10MB, .csv/.txt files)
  - Row-by-row validation with comprehensive error reporting
  - Success and error feedback with detailed error messages per row
  - Automatic data type conversion (boolean, integer casting)
  - Transaction-safe imports (continues on individual row failures)
  - CSV format examples and required column documentation
  - "Import CSV" buttons on admin index pages
  - Protected routes under admin middleware
- **Manual Outreach Workflow System**
  - OutreachAttempt model with polymorphic relationships
  - Track outreach across multiple channels (email, Instagram, TikTok)
  - OutreachController for creating and managing contact attempts
  - Automatic attempt numbering for progressive engagement
  - Status tracking (pending, sent, responded, failed, bounced)
  - Outreach history displayed on brand/creator admin pages
  - 7-contact rule: Direct messaging unlocked after 7 successful outreach attempts
  - MessageController validation enforcing outreach requirement
  - canReceiveDirectMessages() method on Brand and Creator models
  - Admin routes for outreach management with filters
  - Complete UI: Index page with filtering, Create form, Show/update page
  - Outreach history sections on brand/creator detail pages with status badges
  - Quick create outreach buttons integrated throughout admin panel

### 🚧 In Progress Features
None currently

### 📋 Planned Features

#### 1. Admin Panel - Brand and Creator Uploads
**Status**: ✅ Completed (Core Features)
**Description**: Admin interface for uploading and managing brands and creators data.

**What's Built**:
- ✅ Full CRUD operations for brands and creators
- ✅ Complete UI: Index (list), Create, Edit, Show pages
- ✅ Form validation with custom error messages
- ✅ React/TypeScript admin pages with Tailwind v4 styling
- ✅ Pagination support (20 items per page)
- ✅ Protected routes with admin middleware
- ✅ Language selection for creators (10 languages)
- ✅ Multi-section forms with organized field groups
- ✅ Social media URL fields (Instagram, TikTok)
- ✅ Age range validation for demographics
- ✅ Category management (primary, secondary, tertiary)

**CSV Bulk Upload** (✅ Completed):
- ✅ CSV file upload for both brands and creators
- ✅ Row-by-row validation with error reporting
- ✅ Import pages with format examples
- ✅ "Import CSV" buttons on index pages

**Future Enhancements**:
- Advanced follower demographics editor (JSONB field support in CSV)

---

#### 2. Brand Directory - Brand Cards Display
**Status**: ✅ Completed
**Description**: Public-facing directory showing brand cards with key metrics and match scores.

**What's Built**:
- ✅ Public routes `/brands` and `/brands/{id}`
- ✅ BrandCard component with responsive grid layout
- ✅ Category badges and social media links
- ✅ Age demographics and US-based status
- ✅ Pagination with smart page numbering (max 5 visible)
- ✅ Empty state for no brands
- ✅ Bestie Score badge on cards
- ✅ Truncated descriptions with read more
- ✅ "View Details" CTA buttons
- ✅ Dark mode support
- ✅ Search by brand name or description (case-insensitive)
- ✅ Filter by category (primary/secondary/tertiary)
- ✅ Filter by customer age range overlap
- ✅ Sort by latest or Bestie Score
- ✅ Clear filters button
- ✅ Query string preservation for filtered pagination

**Future Enhancements**:
- Advanced directory card metrics (sales, collabs, posts)

---

#### 3. Creator Directory - Creator Cards Display
**Status**: ✅ Completed
**Description**: Public-facing directory showing creator cards with performance metrics.

**What's Built**:
- ✅ Public routes `/creators` and `/creators/{id}`
- ✅ CreatorCard component with responsive grid layout
- ✅ Category badges and language display
- ✅ Follower age demographics
- ✅ Social media links (Instagram, TikTok)
- ✅ Pagination matching brand directory
- ✅ Empty state for no creators
- ✅ Bestie Score badge on cards
- ✅ "View Profile" CTA buttons
- ✅ Dark mode support
- ✅ Search by creator name or description (case-insensitive)
- ✅ Filter by category (primary/secondary/tertiary)
- ✅ Filter by follower age range overlap
- ✅ Sort by latest or Bestie Score
- ✅ Clear filters button
- ✅ Query string preservation for filtered pagination

**Future Enhancements**:
- Advanced creator metrics (followers, engagement, GMV)
- Video/content previews

---

#### 4. Match Score AI Logic
**Status**: ✅ Completed
**Description**: AI-powered algorithm to calculate compatibility between brands and creators.

**What's Built**:
- ✅ MatchScoreService with weighted compatibility algorithm (0-5 scale)
- ✅ BrandCreatorMatch model and pivot table for storing calculated matches
- ✅ Age range overlap calculation (40% weight) - compares customer age vs follower age
- ✅ Category alignment scoring (40% weight) - matches primary, secondary, tertiary categories
- ✅ Geographic compatibility check (10% weight) - both US-based = 5.0, mixed = 2.5
- ✅ Quality threshold scoring (10% weight) - average of both Bestie Scores
- ✅ Artisan command `match:calculate-scores` with --fresh and --threshold options
- ✅ Top 6 matched creators displayed on brand detail pages
- ✅ Top 6 matched brands displayed on creator detail pages
- ✅ Match score badges (green pill) on match cards
- ✅ Progressive bar showing match calculation progress
- ✅ Minimum threshold filtering (default: 2.0/5.0)

**Algorithm Details**:
- Age overlap: 100% overlap = 5.0, proportional scoring for partial overlap
- Category matching: Primary match worth 2 points, secondary/tertiary worth 1-1.5 points
- Geographic: Both US-based = 5.0, one US-based = 2.5, both international = 1.0
- Quality: Average of brand and creator Bestie Scores

**Future Enhancements**:
- Real-time match calculation on entity updates
- Match score trending and history
- Detailed match breakdown showing individual component scores
- Admin panel to manually adjust match scores
- Notification system for new high-quality matches

---

#### 5. Bestie Scores Calculation
**Status**: ✅ Completed
**Description**: Performance-based scoring system for both brands and creators.

**What's Built**:
- ✅ BestieScoreService with weighted algorithm (0-5 scale)
- ✅ Database fields for bestie_score and supporting metrics
- ✅ Brand score calculation (collaborations, ratings, response rate, activity)
- ✅ Creator score calculation (posts, engagement, growth, quality, frequency)
- ✅ Artisan command `bestie:calculate-scores` with --brands and --creators options
- ✅ Real-time score display in directory cards and detail pages
- ✅ Conditional display (only shows badge if score > 0)
- ✅ Model casts for proper decimal handling

**Brand Bestie Score Factors**:
- Total collaborations (weight: 25%)
- Average rating (weight: 30%)
- Response rate (weight: 25%)
- Platform activity score (weight: 20%)

**Creator Bestie Score Factors**:
- Total posts (weight: 20%)
- Engagement rate (weight: 30%)
- Follower growth rate (weight: 20%)
- Content quality score (weight: 20%)
- Posting frequency (weight: 10%)

**Future Enhancements**:
- Scheduled job to recalculate scores periodically
- Admin panel to manually adjust/override scores
- Score history tracking and trending

---

#### 6. CRM Messaging System
**Status**: ✅ Completed
**Description**: In-platform messaging system for brand-creator communication.

**What's Built**:
- ✅ Message model with polymorphic relationships (sender/recipient)
- ✅ MessageController with inbox, conversation view, and send message methods
- ✅ Inbox page (/messages) showing all conversations
- ✅ Conversation page (/messages/{type}/{id}) for viewing and sending messages
- ✅ Auto-marking messages as read when viewing conversation
- ✅ Unread message count badges on inbox
- ✅ "Send Message" buttons on brand and creator detail pages (auth required)
- ✅ Real-time conversation grouping by other party
- ✅ Message timestamps with "time ago" formatting (date-fns)
- ✅ Chat-style message bubbles (blue for sent, gray for received)
- ✅ Auto-scroll to latest message
- ✅ Message validation (max 5000 characters)
- ✅ Protected routes (auth middleware required)

**Database Schema**:
- UUID primary keys for messages
- Polymorphic relationships: sender_id/sender_type, recipient_id/recipient_type
- read_status boolean field
- Indexed polymorphic fields for performance

**Future Enhancements**:
- Email notifications for new messages
- Message search functionality
- File/image attachments
- Spam/abuse reporting
- Message deletion
- Typing indicators

---

#### 7. Manual Outreach Process Workflow
**Status**: ✅ Completed
**Description**: Workflow automation for tracking multi-channel outreach attempts.

**What's Built**:
- ✅ OutreachAttempt model with UUID and polymorphic relationships
- ✅ Database migration tracking channel, status, attempt number, timestamps
- ✅ OutreachController with index, create, store, show, updateStatus methods
- ✅ Automatic attempt numbering (increments for each contactable entity)
- ✅ Multi-channel support (email, Instagram, TikTok)
- ✅ Status tracking (pending, sent, responded, failed, bounced)
- ✅ Outreach history display on brand/creator admin detail pages (last 10 attempts)
- ✅ 7-contact rule enforcement via canReceiveDirectMessages() method
- ✅ MessageController validation blocking direct messages until 7+ sent attempts
- ✅ Admin routes with filters (contactable_type, status, channel)
- ✅ Relationships on Brand and Creator models for outreachAttempts

**UI Completed**:
- ✅ Admin/Outreach/Index page with filtering by type, status, channel
- ✅ Admin/Outreach/Create page with form and validation
- ✅ Admin/Outreach/Show page with status update interface
- ✅ Outreach history sections on Brand and Creator admin detail pages
- ✅ Direct messaging status badges (enabled/contact count)
- ✅ Quick create buttons from brand/creator pages

**Future Enhancements**:
- Anti-bot detection measures
- Email/SMS integration for automated sending
- Bulk outreach operations
- Response tracking automation
- Outreach analytics and reporting

---

#### 8. Connected Status & Badges
**Status**: Todo
**Description**: Verification system and collaboration enablement features.

**Key Features**:
- Connected vs. Unconnected badge display
- Account linking verification
- Collaboration agreement templates
- AI-generated collaboration scripts
- Commission and payout management
- Free collaboration management tools

---

## Database Schema Overview

### Core Tables
- `brands` - Brand profiles and information
- `creators` - Creator profiles and demographics
- `brands_directory_cards` - Computed brand card data
- `creators_directory_cards` - Computed creator card data
- `messages` - CRM messaging system

### Key Design Decisions
- UUID primary keys for all main entities
- JSONB fields for flexible data (social links, demographics, previews)
- Age ranges stored as min/max integers
- US-based boolean filter for both brands and creators
- Polymorphic relationships for messaging system

## Getting Started

### Prerequisites
- PHP 8.4+
- Composer
- Node.js & npm
- PostgreSQL

### Installation

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Build frontend assets
npm run build
```

### Development

```bash
# Run development server
php artisan serve

# Watch frontend assets
npm run dev

# Run tests
php artisan test

# Format code
vendor/bin/pint
```

## Development Workflow

1. **Feature Branch**: Create a feature branch for each new feature
2. **Database First**: Create migrations and models
3. **Test Coverage**: Write tests before implementation
4. **Code Review**: Ensure Laravel and project conventions are followed
5. **Format Code**: Run `vendor/bin/pint` before committing

## Next Steps

The following features are ready to be built:

1. **Connection Status & Badges** - User verification and collaboration features
   - Connected/unconnected badge system
   - Account linking workflow
   - AI-generated collaboration scripts
   - Commission/payout management
   - Collaboration agreement templates

3. **Email Notifications** - Notification system for messages and matches
   - Email notifications for new messages
   - Match notification alerts
   - Digest emails for activity summaries

4. **Advanced Metrics Display** - Enhanced directory card information
   - Brand metrics: total collaborations, GMV, conversion rates
   - Creator metrics: engagement rates, follower counts, content previews
   - Historical trending data

## Contributing

- Follow Laravel best practices
- Write comprehensive tests for all features
- Use TypeScript types with Wayfinder for route safety
- Maintain Tailwind v4 conventions for styling
- Update this README when completing features

## License

Proprietary - All rights reserved

---

**Last Updated**: 2025-12-24
**Current Version**: 1.2.0-alpha
