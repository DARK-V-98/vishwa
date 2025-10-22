import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { products as ProductType } from "@/lib/data";
import { Heart, ShoppingCart } from "lucide-react";

type Product = typeof ProductType[0];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find(img => img.id === product.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-w-4 aspect-h-3">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="object-cover w-full h-full"
              data-ai-hint={productImage.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 truncate">{product.name}</CardTitle>
        <p className="text-xl font-body font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button variant="outline" size="icon" className="shrink-0">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
