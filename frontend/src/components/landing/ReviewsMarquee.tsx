'use client';

import Marquee from 'react-fast-marquee';

const reviews = [
  {
    name: 'Priya Sharma',
    brand: 'Zara Skin Co.',
    role: 'Founder',
    review:
      'Generated my first Meta campaign in 12 minutes. The targeting was so specific — Nykaa buyers, engaged shoppers, metro women. Exactly what I needed.',
    rating: 5,
    category: 'Beauty & Skincare',
  },
  {
    name: 'Rahul Agarwal',
    brand: 'UrbanThreads',
    role: 'Co-Founder',
    review:
      'Agencies quoted ₹40,000/month for what Optimeta gave me in seconds. The ad copies actually sound human, not AI-generated.',
    rating: 5,
    category: 'Fashion & Apparel',
  },
  {
    name: 'Sneha Patel',
    brand: 'GlowRoot Organics',
    role: 'CEO',
    review:
      'The COD strategy section alone was worth it. Never thought about mentioning COD in ad copies — CTR went up immediately after implementing.',
    rating: 5,
    category: 'D2C Beauty',
  },
  {
    name: 'Arjun Mehta',
    brand: 'FitFuel India',
    role: 'Founder',
    review:
      'Finally a tool that understands Indian audiences. The Tier 2 city targeting and INR benchmarks are spot on. ROAS went from 1.2x to 3.1x.',
    rating: 5,
    category: 'Health & Wellness',
  },
  {
    name: 'Kavya Nair',
    brand: 'Handcrafted by Kavya',
    role: 'Owner',
    review:
      'I had zero Meta ads knowledge. The 8-step checklist and first 7 days plan made it so easy. My first campaign got 47 orders in a week.',
    rating: 5,
    category: 'Jewellery',
  },
  {
    name: 'Vikram Singh',
    brand: 'SaaSify HQ',
    role: 'Product Lead',
    review:
      'We used it for our SaaS lead gen campaign. The WhatsApp CTA suggestion was genius — 3x more leads than our previous Facebook form campaign.',
    rating: 5,
    category: 'SaaS',
  },
  {
    name: 'Deepika Joshi',
    brand: 'Mitti & More',
    role: 'Co-Founder',
    review:
      'The blueprint told us exactly which interests to target for our handmade pottery brand. We had never thought of targeting home decor bloggers.',
    rating: 5,
    category: 'Home Decor',
  },
  {
    name: 'Rohan Kapoor',
    brand: 'QuickEats Cloud Kitchen',
    role: 'Founder',
    review:
      'Generated a complete Reels-first strategy for our cloud kitchen. The hook suggestions were fire — one video got 2.3 lakh views organically.',
    rating: 5,
    category: 'Food & Beverage',
  },
  {
    name: 'Ananya Reddy',
    brand: 'Kurta Collective',
    role: 'Founder',
    review:
      'Optimeta understood our festive collection strategy without us explaining. The targeting combinations for wedding season were perfect.',
    rating: 5,
    category: 'Fashion',
  },
  {
    name: 'Nikhil Verma',
    brand: 'CodeCraft Academy',
    role: 'Director',
    review:
      'Used it for our coding bootcamp ads. The CPL benchmark of ₹200-400 it predicted was accurate. We hit ₹280 CPL in week 2.',
    rating: 5,
    category: 'EdTech',
  },
  {
    name: 'Pooja Gupta',
    brand: 'Little Wonders Baby',
    role: 'Founder',
    review:
      'The new parents demographic targeting was something I never knew existed on Meta. Completely changed our campaign performance.',
    rating: 5,
    category: 'Baby Products',
  },
  {
    name: 'Sameer Khan',
    brand: 'Desi Protein',
    role: 'Co-Founder',
    review:
      'Competitor targeting suggestions were gold. Targeting MyFitness and MuscleBlaze buyers directly was the missing piece in our strategy.',
    rating: 5,
    category: 'Health & Fitness',
  },
  {
    name: 'Ritu Agarwal',
    brand: 'Craft & Clay Studio',
    role: 'Owner',
    review:
      'As a solo founder with ₹8,000 monthly budget, Optimeta told me exactly how to structure it. No wastage, pure focus on what works.',
    rating: 5,
    category: 'Art & Craft',
  },
  {
    name: 'Amit Sharma',
    brand: 'TechHire Solutions',
    role: 'Founder',
    review:
      'Our B2B recruitment agency had never run Meta ads. The blueprint made it so clear — LinkedIn-style targeting on Meta actually works.',
    rating: 5,
    category: 'B2B Services',
  },
  {
    name: 'Meera Iyer',
    brand: 'Spice Route Kitchen',
    role: 'Co-Founder',
    review:
      'The UGC brief it generated was exactly what I gave our content creator. She said it was the clearest brief she had ever received.',
    rating: 5,
    category: 'Food Brand',
  },
  {
    name: 'Karan Malhotra',
    brand: 'Nomad Gear India',
    role: 'Founder',
    review:
      'Scaling from ₹15k to ₹50k monthly ad spend was scary. The scaling logic in the blueprint gave me exact thresholds to follow safely.',
    rating: 5,
    category: 'Travel & Outdoor',
  },
];

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="flex-shrink-0 w-80 mx-3 bg-[#0F0F1A] border border-[#1E1E3A] hover:border-[#7B2FBE]/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(123,47,190,0.15)]">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(review.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        ))}
      </div>

      {/* Review text */}
      <p className="text-[#A0A0C0] text-sm leading-relaxed mb-4 line-clamp-3">
        &ldquo;{review.review}&rdquo;
      </p>

      {/* Divider */}
      <div className="border-t border-[#1E1E3A] pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">{review.name}</p>
            <p className="text-[#606080] text-xs">
              {review.role}, {review.brand}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-[#7B2FBE]/10 border border-[#7B2FBE]/20 text-[#7B2FBE] flex-shrink-0">
            {review.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-[#7B2FBE]/20 border border-[#7B2FBE]/40 px-3 py-1 rounded-full mb-3">
          Loved by Indian Brands
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          What Founders Are{' '}
          <span className="bg-gradient-to-r from-[#7B2FBE] to-[#C026D3] bg-clip-text text-transparent">
            Saying
          </span>
        </h2>
        <p className="text-[#A0A0C0] mt-2 text-sm">
          Join 200+ Indian brands running smarter Meta campaigns
        </p>
      </div>

      <Marquee
        speed={40}
        pauseOnHover={true}
        gradient={true}
        gradientColor="#0A0A0F"
        gradientWidth={80}
      >
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </Marquee>
    </section>
  );
}
