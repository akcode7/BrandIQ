// Demo scenarios data
export const demoScenarios = [
  {
    id: 'coffee',
    title: 'Premium Ethical Coffee Brand',
    description: 'Launching a sustainable, ethically-sourced coffee brand',
    query: "I'm launching a new brand of premium, ethically sourced coffee. Suggest some marketing partnership ideas.",
    industry: 'Food & Beverage',
    icon: '☕'
  },
  {
    id: 'fashion',
    title: 'Sustainable Fashion Startup',
    description: 'Eco-friendly clothing brand for millennials',
    query: "I'm starting a sustainable fashion brand targeting environmentally conscious millennials. What marketing partnerships should I consider?",
    industry: 'Fashion',
    icon: '👕'
  },
  {
    id: 'fitness',
    title: 'Fitness App for Professionals',
    description: 'Wellness app designed for busy professionals',
    query: "I'm developing a fitness app specifically for busy professionals. How should I approach marketing partnerships?",
    industry: 'Technology',
    icon: '💪'
  }
]

// Mock grounded responses for demo
export const mockGroundedResponses = {
  coffee: {
    content: "Your target audience over-indexes 340% on documentary films and sustainable outdoor activities. Consider sponsoring a local film festival's documentary category targeting environmentally conscious viewers, or creating a co-branded 'Trail Brew' with outdoor gear retailers like Patagonia. A content partnership with The New Yorker could also effectively reach this demographic, as your audience shows 260% higher engagement with intellectual content.",
    metrics: {
      specificity: 89,
      actionability: 94,
      culturalRelevance: 87
    }
  },
  fashion: {
    content: "Your millennial audience over-indexes 260% on indie music festivals and 310% on sustainable lifestyle content. Partner with music festivals to create limited-edition festival wear, collaborate with sustainability influencers on TikTok and Instagram, and consider a capsule collection with ethical outdoor brands. Your audience also shows 180% higher engagement with podcast advertising, particularly shows focused on entrepreneurship and sustainability.",
    metrics: {
      specificity: 92,
      actionability: 88,
      culturalRelevance: 91
    }
  },
  fitness: {
    content: "Professional audiences over-index 290% on business podcasts and 220% on productivity content. Advertise on shows like 'How I Built This' and partner with co-working spaces for in-office wellness programs. Your target demographic shows 340% higher engagement with LinkedIn content and values partnerships with productivity software companies like Notion or Slack for integrated wellness tracking.",
    metrics: {
      specificity: 85,
      actionability: 91,
      culturalRelevance: 88
    }
  }
}

// Mock ungrounded responses
export const mockUngroundedResponses = {
  coffee: "Partner with food bloggers, collaborate with lifestyle influencers on Instagram, offer discounts at local farmers' markets, and consider partnerships with local cafes for cross-promotion.",
  fashion: "Use social media marketing, partner with fashion influencers, attend trade shows, and collaborate with other sustainable brands for cross-promotion opportunities.",
  fitness: "Create partnerships with gyms, use social media advertising, partner with health and wellness influencers, and consider corporate wellness programs for businesses."
}
