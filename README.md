# CulturalMind AI - AI Brand Strategist PWA

> **"Cultural Intelligence for AI-Powered Marketing"**

A comprehensive Progressive Web Application that transforms generic AI responses into culturally-intelligent, actionable business strategies by combining Google Gemini with Qloo's Taste AI™ for unprecedented marketing insights.

## 🎯 **The Problem We Solve**

Traditional AI marketing advice is generic and predictable:
- "Partner with influencers"
- "Use social media campaigns"
- "Target millennials"

**CulturalMind AI** goes beyond generic suggestions by understanding the **cultural why** behind consumer behavior.

## 🧠 **What Makes This Different**

### **LLM Grounding Architecture**
We've built the first platform to "ground" Large Language Models with real cultural taste data:

```
User Query → Qloo Cultural Analysis → Enhanced Prompt → Gemini LLM → Culturally-Grounded Response
```

### **Real Example:**
- **Generic AI**: "Coffee shops should use Instagram marketing"
- **CulturalMind AI**: "Your premium coffee customers over-index on documentary films and outdoor gear - sponsor a film festival or create a co-branded hiking blend with Patagonia"

## 🚀 **Key Features**

### **🔄 Before/After Comparison Engine**
- Interactive demos showing generic vs. culturally-grounded responses
- Real-time processing with visual improvement metrics
- Specificity, actionability, and cultural relevance scoring

### **🎬 Interactive Demo Scenarios**
1. **Artisanal Coffee Shop** - Audience targeting and brand positioning
2. **Tech Startup** - Product launch strategy and market penetration  
3. **Sustainable Fashion** - Trend analysis and conscious consumer engagement

### **📊 Real-Time Marketing Intelligence Dashboard**
- Live market sentiment analysis
- Cultural trend monitoring  
- Personalized strategy recommendations
- Auto-saving action plans with MongoDB persistence

### **🎯 Qloo-Powered Marketing Tasks**
- **Audience Analysis**: Deep psychographic profiling beyond demographics
- **Content Strategy**: Culturally-relevant content recommendations
- **Trend Intelligence**: Emerging cultural movements and opportunities
- **Campaign Concepts**: Specific, actionable marketing strategies

### **💾 Comprehensive Data Persistence**
- MongoDB integration with user-specific action plans
- Conversation history with performance metrics
- Auto-save functionality across all components
- Fallback mechanisms for offline functionality

### **📱 Progressive Web App**
- Installable on mobile and desktop
- Offline-capable with service worker
- Real-time WebSocket connections with polling fallbacks
- Native app-like experience

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and developer experience
- **TailwindCSS** for rapid, responsive UI development
- **Framer Motion** for smooth animations and micro-interactions

### **Backend & APIs**
- **Next.js API Routes** for serverless backend functionality
- **Qloo Taste AI™** for cultural intelligence and audience insights
- **Google Gemini** for advanced language model capabilities
- **NextAuth.js** for secure authentication (Google OAuth + credentials)

### **Database & Persistence**
- **MongoDB Atlas** for scalable data storage
- **Mongoose** for elegant object modeling
- **Real-time data synchronization** across components
- **localStorage fallbacks** for offline functionality

### **AI Integration Pipeline**
```typescript
// LLM Grounding Process
async function generateGroundedResponse(query: string, category: string) {
  // 1. Analyze with Qloo for cultural insights
  const culturalData = await qlooService.getAudienceInsights(category);
  
  // 2. Enhance prompt with cultural context
  const enhancedPrompt = `
    User Query: ${query}
    Cultural Context: ${culturalData.insights}
    Audience Preferences: ${culturalData.preferences}
    
    Generate specific, actionable recommendations based on this cultural intelligence.
  `;
  
  // 3. Generate response with Gemini
  const response = await geminiService.generateContent(enhancedPrompt);
  
  return {
    originalQuery: query,
    culturalInsights: culturalData,
    groundedResponse: response,
    metrics: calculateImprovementMetrics(response)
  };
}
```

## 🛠️ **Installation & Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/akcode7/BrandIQ.git
cd BrandIQ
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
Create `.env.local` file:
```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# API Keys
QLOO_API_KEY=your-qloo-api-key
GEMINI_API_KEY=your-gemini-api-key

# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### **4. Database Setup**
The app will automatically create necessary MongoDB collections on first run. For testing, you can use:
```bash
node test-auth.js  # Creates test user credentials
```

### **5. Start Development**
```bash
npm run dev
```
Navigate to [http://localhost:3001](http://localhost:3001)

## 📁 **Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── conversations/        # Chat history management
│   │   ├── action-plans/         # Action plan CRUD
│   │   └── qloo/                 # Qloo integration endpoints
│   ├── dashboard/                # Real-time dashboard
│   ├── login/                    # Authentication pages
│   └── signup/                   
├── components/                   # React Components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard widgets
│   ├── demo/                     # Interactive demo components
│   ├── layout/                   # Layout components
│   └── sections/                 # Landing page sections
├── lib/                          # Core Utilities
│   ├── models/                   # MongoDB Mongoose models
│   │   ├── ActionPlan.ts         # Action plan schema
│   │   └── ChatSession.ts        # Conversation schema
│   ├── services/                 # External API integrations
│   │   ├── qloo.ts              # Qloo API service
│   │   └── gemini.ts            # Google Gemini service
│   ├── auth.ts                   # NextAuth configuration
│   ├── mongodb.ts                # Database connection
│   └── data/                     # Static data and scenarios
├── hooks/                        # Custom React hooks
├── styles/                       # Global styles and Tailwind
└── public/                       # Static assets and PWA files
```

## 🎮 **Usage Examples**

### **1. Interactive Demo**
Visit the homepage and try the three pre-built scenarios:
- **Artisanal Coffee Shop**: See how cultural data reveals documentary film enthusiasts
- **Tech Startup**: Discover unexpected lifestyle correlations
- **Sustainable Fashion**: Understand conscious consumption patterns

### **2. Marketing Task Generator**
1. Navigate to the dashboard
2. Select a task category (Audience, Content, Trends, Campaigns)
3. Describe your brand/product
4. Get culturally-grounded insights with actionable steps

### **3. Real-Time Dashboard**
- Monitor live market sentiment
- Track conversation history
- Access saved action plans
- View performance metrics

## 🔧 **Development Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing & Utilities
node test-auth.js        # Test database connection & create user
npm run type-check       # TypeScript type checking
```

## 📊 **Performance & Metrics**

### **Real-Time Analytics**
- **Improvement Metrics**: Specificity, Actionability, Cultural Relevance
- **Response Time**: <3 seconds for Qloo + Gemini processing
- **Offline Capability**: Full functionality with cached responses
- **Progressive Enhancement**: Works across all connectivity levels

### **Scalability Features**
- MongoDB Atlas for global scalability
- Next.js serverless functions for automatic scaling
- CDN-optimized static assets
- Service worker caching for performance

## 🌐 **Deployment**

### **Vercel (Recommended)**
```bash
npm run build
vercel deploy
```

### **Environment Variables for Production**
Ensure all environment variables are configured in your deployment platform:
- Database connection strings
- API keys for Qloo and Gemini
- Authentication secrets
- App URLs

### **PWA Configuration**
The app includes comprehensive PWA support:
- Web app manifest for installation
- Service worker for offline functionality
- Optimized caching strategies
- Push notification capability (ready for implementation)

## 🎨 **Design Philosophy**

### **User Experience**
- **Progressive Disclosure**: Complex insights presented intuitively
- **Visual Comparison**: Before/after shows clear AI improvement
- **Real-time Feedback**: Loading states educate about grounding process
- **Accessibility**: Full keyboard navigation and screen reader support

### **Technical Excellence**
- **Type Safety**: End-to-end TypeScript for reliability
- **Error Handling**: Graceful degradation with multiple fallback layers
- **Performance**: Optimized bundle size and lazy loading
- **Security**: Secure authentication and API key management

## 🏆 **Innovation Highlights**

### **1. First-of-Kind LLM Grounding**
Revolutionary approach combining cultural intelligence with language models for marketing applications.

### **2. Multi-Modal AI Integration**
Seamless orchestration of Qloo Taste AI™ and Google Gemini in a single user experience.

### **3. Real-Time Cultural Intelligence**
Live dashboard showing market trends, sentiment analysis, and personalized recommendations.

### **4. Production-Ready Architecture**
Comprehensive error handling, authentication, data persistence, and deployment readiness.

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 **License**

MIT License - Built for the Qloo LLM Hackathon 2025

## 🙏 **Acknowledgments**

- **Qloo** for providing the Taste AI™ API and cultural intelligence platform
- **Google** for Gemini AI integration
- **Next.js team** for the outstanding React framework
- **MongoDB** for reliable data persistence
- **Vercel** for seamless deployment platform

---

**Built with ❤️ for the Qloo LLM Hackathon**

*Transform your marketing strategy from guesswork into cultural intelligence.*
