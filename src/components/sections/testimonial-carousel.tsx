
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  imageUrl: string;
  rating: number;
}

export default function TestimonialCarousel() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const testimonialsCollection = collection(firestore, 'testimonials');
    return query(testimonialsCollection, orderBy('createdAt', 'desc'));
  }, [firestore]);
  const { data: testimonials, isLoading: testimonialsLoading } = useCollection<Omit<Testimonial, 'id'>>(testimonialsQuery);

  return (
    <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]} className="w-full max-w-6xl mx-auto">
        <CarouselContent className="-ml-4">
            {(testimonialsLoading ? [...Array(3)] : testimonials)?.map((testimonial, idx) => (
            <CarouselItem key={testimonial?.id || idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
                <CardContent className="p-6 flex flex-col flex-grow">
                    {testimonial ? (
                    <>
                        <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-12 h-12 border-2 border-primary/20"><AvatarImage src={testimonial.imageUrl} /><AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                        </div>
                        </div>
                        <p className="text-muted-foreground italic flex-grow">"{testimonial.message}"</p>
                        <div className="flex gap-1 mt-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30'}`} />)}
                        </div>
                    </>
                    ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-full"/><div className="space-y-2"><Skeleton className="h-4 w-24"/><Skeleton className="h-4 w-16"/></div></div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    )}
                </CardContent>
                </Card>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
    </Carousel>
  );
}
