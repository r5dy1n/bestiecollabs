# Social Media API Integration Setup

This guide explains how to obtain API credentials for each social media platform and configure them in BestieCollabs.

## Current Status

**Mode:** Mock Data (Development)
- Set `SOCIAL_MEDIA_USE_MOCK=true` in `.env` to use realistic fake data
- Set `SOCIAL_MEDIA_USE_MOCK=false` to use real API calls

---

## Instagram (Meta Graph API)

### Requirements
- Facebook/Meta Developer Account
- Instagram Business or Creator Account
- Facebook App with Instagram Basic Display or Instagram Graph API

### Setup Steps

1. **Create a Facebook App**
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create a new app → Select "Business" type
   - Add Instagram Basic Display or Instagram Graph API product

2. **Get Credentials**
   - **App ID** → `INSTAGRAM_API_KEY`
   - **App Secret** → `INSTAGRAM_API_SECRET`

3. **Generate Access Token**
   - Configure OAuth redirect URIs
   - Implement Instagram Login flow
   - Exchange authorization code for access token → `INSTAGRAM_ACCESS_TOKEN`

4. **Business Account ID (Optional)**
   - Required for Business Discovery features
   - Found in Instagram Professional Dashboard → `INSTAGRAM_BUSINESS_ACCOUNT_ID`

### Environment Variables
```bash
INSTAGRAM_API_KEY=your_app_id
INSTAGRAM_API_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### API Limitations
- Instagram Graph API doesn't have public user search
- Business Discovery requires Instagram Business account
- Rate limit: 200 calls per hour per user
- Requires user authentication for most endpoints

### Documentation
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)

---

## TikTok (TikTok for Developers)

### Requirements
- TikTok Developer Account
- Approved TikTok App

### Setup Steps

1. **Register as Developer**
   - Go to [TikTok for Developers](https://developers.tiktok.com/)
   - Create developer account

2. **Create App**
   - Create new app in Developer Portal
   - Select appropriate use case (e.g., Login Kit, Research API)
   - Submit for review (may take several days)

3. **Get Credentials**
   - **Client Key** → `TIKTOK_API_KEY`
   - **Client Secret** → `TIKTOK_API_SECRET`

4. **OAuth Flow**
   - Implement OAuth 2.0 login
   - Get user access token → `TIKTOK_ACCESS_TOKEN`

5. **Research API (Optional)**
   - Requires separate application and approval
   - Needed for advanced search features → `TIKTOK_RESEARCH_ACCESS_TOKEN`

### Environment Variables
```bash
TIKTOK_API_KEY=your_client_key
TIKTOK_API_SECRET=your_client_secret
TIKTOK_ACCESS_TOKEN=user_access_token
TIKTOK_RESEARCH_ACCESS_TOKEN=research_access_token
```

### API Limitations
- Requires app review and approval
- User consent needed for data access
- Search requires Research API (separate approval)
- Rate limits vary by endpoint

### Documentation
- [TikTok for Developers](https://developers.tiktok.com/doc)
- [TikTok Login Kit](https://developers.tiktok.com/doc/login-kit-web)
- [TikTok Research API](https://developers.tiktok.com/doc/research-api-overview)

---

## YouTube (YouTube Data API v3)

### Requirements
- Google Cloud Account
- Google API Project

### Setup Steps

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project

2. **Enable YouTube Data API v3**
   - Navigate to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create API Key**
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the generated key → `YOUTUBE_API_KEY`
   - (Optional) Restrict API key to YouTube Data API v3 only

4. **Configure Quotas**
   - Default quota: 10,000 units per day
   - Each search costs 100 units
   - Monitor usage in Cloud Console

### Environment Variables
```bash
YOUTUBE_API_KEY=your_api_key
```

### API Limitations
- Default quota: 10,000 units/day
- Search query: 100 units
- Video list: 1 unit
- Channel list: 1 unit
- No authentication required for public data

### Documentation
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [API Reference](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

---

## Twitter/X (Twitter API v2)

### Requirements
- Twitter/X Developer Account
- Approved Developer App
- Elevated or Academic Research access (for search)

### Setup Steps

1. **Apply for Developer Account**
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Apply for developer account (requires approval)

2. **Create App**
   - Create new app in Developer Portal
   - Describe use case

3. **Request Elevated Access**
   - Basic tier doesn't include user search
   - Apply for Elevated access (free tier with limits)
   - Or Academic Research access (extended limits)

4. **Get Credentials**
   - **API Key** → `TWITTER_API_KEY`
   - **API Secret** → `TWITTER_API_SECRET`
   - **Bearer Token** → `TWITTER_BEARER_TOKEN`

### Environment Variables
```bash
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

### API Limitations
- Basic tier: Very limited (read-only, no search)
- Elevated tier (Free): 500k tweets/month, user lookup
- Rate limits: 300 requests per 15 minutes (user lookup)
- User search requires Elevated access or higher

### Documentation
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Authentication](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [Access Levels](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api)

---

## Switching from Mock to Real APIs

### Step 1: Obtain API Credentials
Follow the platform-specific guides above to get all required credentials.

### Step 2: Update .env File
```bash
SOCIAL_MEDIA_USE_MOCK=false

# Add all credentials from above sections
INSTAGRAM_API_KEY=...
INSTAGRAM_API_SECRET=...
# ... etc
```

### Step 3: Test Each Platform
```bash
# Test via Tinker
php artisan tinker

# Test Instagram
$service = app(\App\Services\SocialMediaService::class);
$results = $service->searchCreators('fashion', 'instagram');

# Test YouTube
$results = $service->searchCreators('tech', 'youtube');

# Test Twitter
$results = $service->searchCreators('news', 'twitter');

# Test TikTok
$results = $service->searchCreators('dance', 'tiktok');
```

### Step 4: Monitor Logs
```bash
tail -f storage/logs/laravel.log
```

All API errors are logged with details. Check logs if results are empty or errors occur.

---

## Development Workflow

### Use Mock Data During Development
```bash
SOCIAL_MEDIA_USE_MOCK=true
```
- Faster development
- No API costs
- No rate limits
- Consistent test data

### Switch to Real APIs for Testing
```bash
SOCIAL_MEDIA_USE_MOCK=false
```
- Verify API integration works
- Test with real data
- Monitor quota usage

### Production Recommendations
- Use real APIs in production
- Implement caching to reduce API calls
- Set up monitoring for quota limits
- Consider fallback to mock data if quota exceeded

---

## Troubleshooting

### "Failed to fetch profile"
- Check API credentials are correct
- Verify API is enabled in platform console
- Check rate limits haven't been exceeded
- Review logs for specific error messages

### Empty Search Results
- Instagram: Requires Business Discovery setup
- TikTok: Requires Research API approval
- Twitter: Requires Elevated access or higher
- YouTube: Check quota hasn't been exhausted

### Rate Limit Errors
- Implement caching (already configured in app)
- Reduce search frequency
- Upgrade API tier if needed
- Use batch operations where possible

---

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Instagram | ✅ Free (with limits) | N/A |
| TikTok | ✅ Free (with approval) | Contact sales |
| YouTube | ✅ 10k quota/day | Pay per additional quota |
| Twitter | ❌ Basic very limited | $100/mo Elevated, $5k/mo+ for search |

**Recommendation:** Start with YouTube (easiest free tier) and Instagram (free but requires setup). Twitter requires paid tier for useful features.
