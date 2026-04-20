import { Experience, Project, Testimonial, OtherRole } from '../types';
import vegasSportsbook from '../assets/vegas_sportsbook.png';
import pointingAtTv from '../assets/pointing_at_tv.png';

export const RESUME_DATA = {
  name: "Ankush Singla",
  role: "Product Executive & AI Strategist",
  bio: "I build products that move the needle and capture headlines. From 0-to-1 concepts to 10-to-100 scaling, I specialize in turning emerging tech — Generative AI, agentic systems, IoT — into enterprise realities that ship and scale.\n\nMy work doesn't just drive business metrics; it gets featured in Forbes, presented to Boards, and cited in investor 10-Ks.\n\nCurrently operating at the intersection of AI and consumer at FanDuel.",
  experience: [
    {
      company: "FanDuel",
      role: "Director, Technology Innovation and Transformation",
      period: "2024 - Present",
      description: "Pioneered 'Ace', the industry's first customer-facing generative AI product, improving share-of-wallet and time spent in app. Defined and operationalized FanDuel's generative AI strategy, resulting in 95% of employees adopting GenAI tools to reinvent internal operational efficiency, including a custom agentic AI platform and co-innovation with partners like Google and Amazon.",
      link: "http://www.fanduel.com",
      group: "Product Leadership",
      motivation: "Sports, competition, and predicting the future have always been personal — I've been a fan long before I ever thought about building products. FanDuel was a rare chance to combine everything: sports, math, consumer behavior, and the opportunity to literally build what comes next."
    },
    {
      company: "The Buyer Base",
      role: "Founder",
      period: "2023 - 2024",
      description: "Founded a startup focused on improving the B2B buying journey for SaaS buyers. Conducted extensive competitive and user research to design mockups and build an MVP, while developing business models, financial projections, and validating the concept with pre-seed venture capital firms.",
      group: "Product Leadership",
      motivation: "I was Head of Product at DefenseStorm — things were going well — and I still left to build something from scratch. That's how strongly I believed in the pain point. As a SaaS buyer myself, I knew the procurement process was broken and couldn't find a solution that actually fixed it."
    },
    {
      company: "DefenseStorm",
      role: "Head of Product / Senior Director, Product",
      period: "2022 - 2023",
      description: "Led all data science, design, and product management teams representing 10% of the total staff. Developed a compelling product vision that secured $20M in venture funding and built products that supported 98%+ gross revenue retention while increasing internal services capacity by over 50%.",
      link: "http://www.defensestorm.com",
      group: "Product Leadership",
      motivation: "Growing into full product leadership — owning not just AI/ML but design, data science, and PM — was the next logical step after building the AI practice. We had so much opportunity ahead of us, we just needed someone to lead us forward."
    },
    {
      company: "DefenseStorm",
      role: "Product Lead, AI & ML",
      period: "2020 - 2022",
      description: "Started and grew the company's AI initiative from zero, managing data science and ML engineering teams. Defined the strategy and roadmap to increase gross margins by 50% and establish a common machine learning framework, leading to the acquisition of the company's largest customer.",
      link: "http://www.defensestorm.com",
      group: "Product Leadership",
      motivation: "I previously built products differentiated by AI; this was the role that convinced me AI was my lane. Starting a practice from scratch — no team, no roadmap, no precedent — in a regulated industry with real consequences is exactly the kind of constraint that sharpens your thinking."
    },
    {
      company: "Acoustic (formerly IBM Watson Marketing)",
      role: "Head of Product Management, Content",
      period: "2019 - 2020",
      description: "Built and led a global team of 5 PMs to develop a new hybrid CMS. Drove product strategy, revamped business models, and updated positioning and pricing to enable a projected 10x global revenue growth over 2 years following the divestiture from IBM.",
      link: "https://acoustic.com",
      group: "Product Leadership",
      motivation: "The IBM divestiture was a rare chance to act like a startup inside a product that already had thousands of enterprise customers. Rebuilding the strategy, team, and business model from scratch — without the IBM brand as a crutch — was genuinely exciting."
    },
    {
      company: "IBM, Watson Marketing",
      role: "Principal Product Manager",
      period: "2018 - 2019",
      description: "Led the modernization of a core outbound marketing platform generating $300M in ARR across 5 agile development teams. Improved customer sentiment by over 30% by evangelizing customer advocacy across the company and uncovering trends in user feedback.",
      link: "https://www.ibm.com/watson",
      group: "Early Product Career",
      motivation: "Modernizing a $300M platform, and the processes used to get us to the next stage, is a specific kind of pressure. It taught me that scale changes everything — what works at a startup will break at IBM — and that customer obsession has to be structural, not just a stated value."
    },
    {
      company: "IBM, Watson Marketing",
      role: "Senior Product Manager",
      period: "2017 - 2018",
      description: "Analyzed market data, employed design thinking techniques, and collected user research to make data-driven decisions. Partnered with cross-functional stakeholders including sales, marketing, and support to launch new foundational capabilities.",
      group: "Early Product Career",
      motivation: "Moving into the IBM ecosystem forced me to professionalize my product process and exposed me to building products at a global company and on a global scale. It helped me understand the quiet, persistent work of making enterprise software actually delightful."
    },
    {
      company: "Overlens",
      role: "Co-founder",
      period: "2016 - 2017",
      description: "Co-founded a startup focused on helping marketers understand ROI by applying AI to video advertising and data tagging. Built a compelling proof-of-concept, won multiple pitch competitions, and earned an invitation to join the Austin Tech Incubator’s SEAL program.",
      group: "MBA Work",
      motivation: "My first foray into true software entrepreneurship (one of the reasons I chose to go to McCombs). An early bet on computer vision + marketing at a time when nobody was doing it. We built it to win pitch competitions and prove the concept could fly. It didn't scale — but it taught me more about consumer behavior, product validation, and my own risk tolerance than any class ever did."
    },
    {
      company: "Samsung",
      role: "Smart Home Product Marketer (MBA Internship)",
      period: "2016",
      description: "Crafted product positioning and go-to-market strategies for emerging smart home hardware. I defined core positioning statements and bridged the gap between highly technical hardware capabilities and end-user value propositions.",
      link: "https://www.samsung.com/us/smartthings/",
      group: "MBA Work",
      motivation: "I wanted to understand how a global consumer hardware company thinks about positioning and GTM — the translation layer between engineering and the market. SmartThings was an early, ambitious bet on connected home that gave me a first-hand look at how hard consumer adoption really is."
    },
    {
      company: "Australian Baseball League",
      role: "League Expansion Strategy (MBA Externship)",
      period: "2015",
      description: "Executed a strategic deep-dive into league expansion mechanics, assisting the organization in evaluating new market viability.",
      link: "https://theabl.com.au/",
      group: "MBA Work",
      motivation: "Pitched this project myself after discovering the league — working remotely with an Australian sports organization on expansion strategy was too on-brand to pass up. You've probably noticed a theme of sports by now."
    },
    {
      company: "IBB Consulting Group",
      role: "Consultant (New Products & Innovation)",
      period: "2014 - 2015",
      description: "Developed the go-to-market strategy, managed operations, and created financial models for a first-of-its-kind B2C product offering at Comcast. Expanded the business by growing the retail footprint by 80%, automated processes using ML, and leveraged predictive analytics to improve operational efficiency.",
      link: "https://newsroom.accenture.com/news/2017/accenture-to-acquire-ibb-consulting-to-expand-accenture-strategy-capabilities-in-communications-media-and-technology-industry",
      group: "Early Career",
      motivation: "Chose this role specifically to work on new product builds in consumer and media — two industries I knew I wanted to be in. Living in NYC for the first time was a bonus I actively sought out."
    },
    {
      company: "Deloitte Consulting",
      role: "Business Technology Consultant & Team Lead",
      period: "2013 - 2014",
      description: "Led a critical post-integration data remediation for a major PBM, successfully navigating potential regulatory sanctions.",
      link: "https://www2.deloitte.com/us/en/services/consulting.html",
      group: "Early Career",
      motivation: "Earning a promotion and team lead role within two years confirmed what I'd suspected — I work well under pressure and I lead naturally. This role also gave me my first real taste of high-stakes problem-solving where getting it wrong had regulatory consequences."
    },
    {
      company: "Deloitte Consulting",
      role: "Business Technology Analyst",
      period: "2011 - 2013",
      description: "Mastered the fundamentals of technical product management and PMO operations. Delivered technical roadmaps and requirements gathering for enterprise clients in the healthcare and public sectors.",
      link: "https://www2.deloitte.com/us/en/services/consulting.html",
      group: "Early Career",
      motivation: "Graduated from Georgia Tech wanting to understand how industries actually work before committing to one. Consulting was the fastest way to do that — and it came with travel, which was always part of the plan."
    },
    {
      company: "Bobby Dodd Stadium (Georgia Tech)",
      role: "IoT Sensor Network Designer & Developer",
      period: "2010",
      description: "Developed and installed a sensor network inside the stadium to detect crowd noise for play highlights. The system was designed for future expansion to monitor concession lines and provide safety features like fire sensing.",
      group: "Early Projects",
      motivation: "Built this because I wanted to be the person who figured out how a stadium could react to its own crowd. The intersection of sports, technology, and innovation started here for me."
    },
    {
      company: "BlackBerry",
      role: "Antenna Design Intern",
      period: "2010",
      description: "Designed a WiFi and Bluetooth antenna for a BlackBerry smartphone.",
      group: "Early Projects",
      motivation: "Working on hardware that millions of people would actually hold in their hands was genuinely exciting. BlackBerry was a real product with real users — that distinction mattered to me early on."
    },
    {
      company: "The University of Texas at Austin, McCombs School of Business",
      role: "Master of Business Administration (MBA)",
      period: "Class of 2017",
      description: "Entrepreneurship, Strategy & Innovation",
      isEducation: true
    },
    {
      company: "Georgia Institute of Technology (Georgia Tech), College of Engineering",
      role: "Bachelor of Science (BS)",
      period: "Class of 2011",
      description: "Electrical Engineering with High Honors",
      isEducation: true
    }
  ],
  otherRoles: [
    {
      org: "Various Tech Startups",
      role: "Startup Advisor",
      period: "2023 - Present"
    },
    {
      org: "STE(A)M Truck",
      role: "Board Member",
      period: "2022 - 2024",
      link: "http://www.steamtruck.org"
    },
    {
      org: "The University of Texas at Austin, McCombs School of Business",
      role: "Industry Career Consultant, MBA and MS Programs",
      period: "2021 - 2022",
      link: "https://www.mccombs.utexas.edu/"
    },
    {
      org: "General Assembly",
      role: "Instructor, Product Management",
      period: "2019 - 2021",
      link: "https://generalassemb.ly/instructors/ankush-singla/20009"
    }
  ],
  education: [
    {
      school: "The University of Texas at Austin, McCombs School of Business",
      degree: "Master of Business Administration (MBA)",
      period: "Class of 2017",
      focus: "Entrepreneurship, Strategy & Innovation"
    },
    {
      school: "Georgia Institute of Technology (Georgia Tech)",
      degree: "Bachelor of Science (BS)",
      period: "Class of 2011",
      focus: "Electrical Engineering with High Honors"
    }
  ],
  techStack: {
    building: ["Claude Code", "Cursor", "Lovable"],
    workflow: ["Claude", "ChatGPT", "NotebookLM"],
    other: ["Braintrust", "Internal MCP-based platform tools"]
  },
  projects: [
    {
      title: "Leading with AI: My Philosophy in Action",
      category: "Leadership Philosophy",
      year: "2026",
      description: "A demonstration of how I use AI tooling - from custom MCP pipelines to commercial agents - to support daily executive execution.",
      image: "https://drive.google.com/thumbnail?id=1tu9Dv22jC-FMSzBSvlHJithJ6IyyMK5I&sz=w1000",
      aspectRatio: "16/9",
      deepDive: "Effective AI executives must remain hands-on to understand friction, evaluate capabilities, and push the boundaries of what their teams can build. My daily operational speed is augmented by a fluid ecosystem of tools, ranging from the Claude Suite (including Claude Code) to proprietary internal MCP-based platform tools we've designed for specific workflows and data pipelines.\n\nAs a practical example of this philosophy, I architected this portfolio through generative AI:\n\n1. Google Stitch: Defined the design system, creating the tokens, colors, and layout foundations.\n2. Google AI Studio: Used for the initial rapid prototyping and structuring of the component architecture.\n3. Google Antigravity: Acted as the primary IDE agent for refining the complex logic, timeline carousels, and responsive layouts.\n\nBy continually building across diverse AI ecosystems, I maintain the hands-on capability to lead AI product teams and drive enterprise AI transformation.",
      screenshots: [
        { url: "https://drive.google.com/thumbnail?id=1tu9Dv22jC-FMSzBSvlHJithJ6IyyMK5I&sz=w1000", caption: "Google Stitch: Design System" },
        { url: "https://drive.google.com/thumbnail?id=17jBzZkB-YZVRhzwzTGNWx9EjPMTbR_rP&sz=w1000", caption: "Google AI Studio: Prototyping" },
        { url: "https://drive.google.com/thumbnail?id=1MhWlUlyGOS5YHJfELPFyRHNqcXdbxu4i&sz=w1000", caption: "Google Antigravity: IDE Refinement" }
      ]
    },
    {
      title: "Ace AI: The First Conversational AI for Sports Bettors",
      category: "Consumer GenAI Product",
      year: "2025",
      description: "Launched the world's first conversational sports betting AI assistant, defining the next generation of consumer wagering.",
      image: vegasSportsbook,
      aspectRatio: "16/9",
      deepDive: "Ace was conceived as a highly integrated generative AI solution to remove the friction users face when constructing multi-layered bets. By bridging real-time data pipelines with conversational LLMs, we shifted user behavior from external research platforms back into the core application, drastically expanding the share-of-wallet.",
      articleLink: "https://www.forbes.com/sites/mattrybaltowski/2025/03/11/fanduel-launches-first-ai-sports-betting-chat-experience/"
    },
    {
      title: "The Buyer Base",
      category: "Entrepreneurship / B2B SaaS Procurement",
      year: "2023",
      description: "Founded an AI-native B2B procurement engine to rethink the SaaS buying journey.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
      aspectRatio: "16/9",
      deepDive: "The Buyer Base was built on the thesis that B2B SaaS procurement is fundamentally broken. By leveraging an AI-native approach, we aimed to streamline the discovery, evaluation, and purchasing lifecycle.",
      articleLink: "https://drive.google.com/file/d/1zMhvQCRb5-RxQtFzDB1CzmM_ChU0s_rY/view?usp=drive_link",
      articleCtaText: "Read Pitch Deck Overview"
    },
    {
      title: "Relaunching Acoustic Content & COVID-19 Response",
      category: "Product Strategy & Market Responsiveness",
      year: "2020",
      description: "Repositioned Acoustic Content to maximize the market opportunity ahead of us and embrace being scrappy without the IBM name.",
      image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=1200&auto=format&fit=contain",
      aspectRatio: "16/9",
      deepDive: "Following the divestiture from IBM, I defined the growth strategy for Acoustic Content to transform it into a high-performance standalone solution. I restructured the global product team to focus on core capabilities rather than siloed features and revamped the business model, including pricing and packaging, to facilitate the organization’s first successful cross-sell path into other portfolio products. We achieved a 3x increase in the largest ACV signed and established a trajectory for 10x projected revenue growth over two years. This growth was further accelerated by rapid market adaptations, such as launching a COVID-19 Response Center initiative within a single week to address shifting customer needs during the global shutdown."
    },
    {
      title: "Modernizing Watson Campaign Automation",
      category: "Product Strategy & UX",
      year: "2019",
      description: "Brought modern product practices to IBM's Watson Marketing portfolio.",
      image: "https://drive.google.com/thumbnail?id=1CJzaivJcf3uA4vrtaqMOmSvVGTwacfj9&sz=w1200",
      aspectRatio: "16/9",
      deepDive: "I led a comprehensive revitalization of the Watson Campaign Automation platform, focusing on both customer-facing functionality and internal decision-making frameworks. By implementing a rigorous voice-of-the-customer program using metrics like NPS and UMUX-lite, I translated qualitative feedback into a data-driven product roadmap. I introduced journey tagging and advanced analytics to identify user friction points, allowing the team to set precise OKRs that directly addressed performance gaps. These initiatives resulted in a 30% improvement in customer sentiment and transformed the product into a more intuitive, user-centric interface that prioritized high-value requests and modernized foundational marketing workflows."
    },
    {
      title: "Overlens",
      category: "Entrepreneurship / Marketing AI & Analytics",
      year: "2016",
      description: "Co-founded an early-stage startup focused on improving conversion and tracking of money spent on product placement.",
      image: pointingAtTv,
      aspectRatio: "16/9",
      deepDive: "Overlens represented a deep dive into the mechanics of early-stage entrepreneurship. Operating in a highly ambiguous environment, our focus was entirely on validating a concept, getting feedback from potential customers, and proving the concept could be built and would resonate with marketers.",
      articleLink: "https://drive.google.com/file/d/11EVH0b5nenL98wiJw2_GwXCGrVetnHfn/view?usp=drive_link",
      articleCtaText: "Read Pitch Deck Overview"
    }
  ],
  testimonials: [
    {
      quote: "He's the best hire we've ever made.",
      author: "VP, DefenseStorm",
      context: "... about my overall impact"
    },
    {
      quote: "It's like looking into the future.",
      author: "CEO, Flutter Entertainment (parent company of FanDuel)",
      context: "... about using AI in my personal workflows"
    },
    {
      quote: "His ability to set a north star while allowing priorities to evolve has been critical in an AI landscape that changes week to week. His steady demeanor and collaborative style build trust and make others better.",
      author: "Executive / Previous Manager",
      context: "... about my cross-functional leadership"
    },
    {
      quote: "I experienced Ankush being helpful, diplomatic, optimistic, encouraging of colleagues, and at the same time holding high standards, communicating clearly, and making hard decisions for the benefit of the overall customer and user experience.",
      author: "Lead UX Designer",
      context: "... about cross-functional leadership and product standards"
    },
    {
      quote: "Ankush's calmness through the chaos, ability to brush off the pressure from executives and general smooth demeanor in tense meetings was amazing.",
      author: "Lead Architect",
      context: "... about executive presence under pressure"
    },
    {
      quote: "The more we dig in, the more good stuff we find. So many of the common requests and issues that our clients bring to us are solved by this, and in a really intuitive interface too! …this is really exciting.",
      author: "Customer & Business Partner",
      context: "... about a 0 -> 1 product launch"
    },
    {
      quote: "You are doing a great job making things easier. It's gotten a bunch of my people into the product that wouldn't have otherwise!",
      author: "Customer",
      context: "... about product improvements driving adoption in a technical environment"
    },
    {
      quote: "Ankush is great at... challenging me to do more than I probably feel comfortable with sometimes, which has been great for my development/learning.",
      author: "Product Manager (direct report)",
      context: "... about my management and mentorship"
    },
    {
      quote: "Very interactive and helped me understand how to use participants to drive an ideation workshop!",
      author: "Workshop Participant",
      context: "... about a product and innovation workshop I facilitated"
    }
  ],
  contact: {
    contactForm: "https://forms.gle/soQmsLvjnWWaPJZD9",
    linkedin: "https://www.linkedin.com/in/singlaankush",
    github: "https://github.com/ankushsingla",
    engagements: [
      { label: "Advising", description: "Business and product planning for early-stage startups" },
      { label: "Teaching", description: "Workshops or mentorship for product, engineering, or innovation teams" },
      { label: "Speaking", description: "Innovation, AI, agents, and the future of work" },
      { label: "Strategy", description: "Consulting for growth-stage or enterprise organizations" },
      { label: "Impact", description: "Non-profit boards or mission-driven projects" },
      { label: "The Right Role", description: "When the right opportunity comes along, I'm open to a conversation" }
    ]
  }
};
