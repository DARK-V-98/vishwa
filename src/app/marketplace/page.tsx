import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/marketplace/product-card";
import { products } from "@/lib/data";
import { Search } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover a curated selection of products. Buy and sell with confidence in our secure and user-friendly marketplace.
        </p>
      </div>

      <div className="mb-8 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for products..." className="pl-10" />
            </div>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">Price: Low to High</SelectItem>
                    <SelectItem value="desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
