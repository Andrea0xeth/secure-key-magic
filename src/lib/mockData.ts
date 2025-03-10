
// Mock data to use when Supabase is unavailable
export const mockEvents = [
  {
    id: "1",
    title: "Web3 Conference",
    description: "Join us for the latest in Web3 technologies and blockchain innovations.",
    location: "San Francisco, CA",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    created_at: new Date().toISOString(),
    nft_asset_id: null
  },
  {
    id: "2",
    title: "Algorand Developer Workshop",
    description: "Learn how to build decentralized applications on the Algorand blockchain.",
    location: "New York, NY",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    created_at: new Date().toISOString(),
    nft_asset_id: null
  },
  {
    id: "3",
    title: "Crypto Art Exhibition",
    description: "Explore the intersection of cryptography, blockchain, and digital art.",
    location: "Miami, FL",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    created_at: new Date().toISOString(),
    nft_asset_id: null
  }
];

export const mockUserNFTs = [
  {
    asset_id: "12345",
    minted_at: new Date().toISOString(),
    events: {
      title: "Past Blockchain Summit",
      description: "A gathering of blockchain enthusiasts and developers.",
      image_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      location: "Austin, TX",
      nft_asset_id: "12345"
    }
  }
];
