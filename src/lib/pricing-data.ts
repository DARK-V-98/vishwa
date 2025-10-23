
export interface Tier {
  name: string;
  price: string;
  features?: string[];
}

export interface Addon extends Tier {}

export interface Service {
  name: string;
  enabled: boolean;
  tiers: Tier[];
  addons?: Addon[];
}

export interface PricingCategory {
  id: string;
  category: string;
  icon: string;
  enabled: boolean;
  order: number;
  services: Service[];
}

export interface CommonAddons {
    id: string;
    category: string;
    icon: string;
    enabled: boolean;
    items: Addon[];
}

export const pricingData: (PricingCategory | CommonAddons)[] = [
    {
        "id": "web-dev",
        "category": "Web & App Development",
        "icon": "Code",
        "order": 1,
        "enabled": true,
        "services": [
            {
                "name": "Corporate Website",
                "enabled": true,
                "tiers": [
                    { "name": "Basic", "price": "Rs. 75,000" },
                    { "name": "Standard", "price": "Rs. 150,000" },
                    { "name": "Premium", "price": "Rs. 300,000" }
                ],
                "addons": [
                    { "name": "Advanced SEO", "price": "Rs. 25,000" },
                    { "name": "Blog Integration", "price": "Rs. 20,000" }
                ]
            },
            {
                "name": "E-Commerce Platform",
                "enabled": true,
                "tiers": [
                    { "name": "Starter", "price": "Rs. 120,000" },
                    { "name": "Business", "price": "Rs. 250,000" },
                    { "name": "Enterprise", "price": "Rs. 500,000" }
                ]
            }
        ]
    },
    {
        "id": "design-services",
        "category": "Graphic Design",
        "icon": "Palette",
        "order": 2,
        "enabled": true,
        "services": [
            {
                "name": "Logo Design",
                "enabled": true,
                "tiers": [
                    { "name": "Essential", "price": "Rs. 10,000" },
                    { "name": "Pro", "price": "Rs. 20,000" }
                ]
            },
            {
                "name": "Social Media Posts",
                "enabled": true,
                "tiers": [
                    { "name": "5 Posts", "price": "Rs. 8,000" },
                    { "name": "10 Posts", "price": "Rs. 15,000" }
                ]
            }
        ]
    },
    {
        "id": "common-addons",
        "category": "Common Add-ons",
        "icon": "Plus",
        "order": 99,
        "enabled": true,
        "items": [
            { "name": "1 Year Domain & Hosting", "price": "Rs. 18,000" },
            { "name": "Priority Support (Monthly)", "price": "Rs. 30,000" },
            { "name": "Content Writing (per page)", "price": "Rs. 5,000" }
        ]
    }
];

export const getPricingCategories = (): PricingCategory[] => {
    return pricingData
        .filter(d => d.id !== 'common-addons' && d.enabled)
        .map(category => {
            const cat = category as PricingCategory;
            if (cat.services) {
                cat.services = cat.services.filter(service => service.enabled);
            }
            return cat;
        })
        .filter(category => (category as PricingCategory).services && (category as PricingCategory).services.length > 0) as PricingCategory[];
}

export const getCommonAddons = (): CommonAddons | null => {
    return pricingData.find(d => d.id === 'common-addons') as CommonAddons | null;
}
