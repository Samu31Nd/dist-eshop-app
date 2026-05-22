import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import React from "react";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export const CustomBannerLogin = () => {
    const title = '7CV4Shop'
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <>
            {/* <CustomJumbotron title="7CV4 Shop" /> */}

            <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">

                <section className="bg-muted/30">
                    <div className="container mx-auto text-center">
                        <h1 className=" font-montserrat text-2xl lg:text-5xl tracking-tight mb-2">
                            {title}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-3 max-w-2xl mx-auto">
                            La tienda de ropa más grande del mundo, ahora con esteroides
                        </p>
                    </div>
                </section>

                <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-[10rem] sm:max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <div className="">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center">
                                            <img
                                                src={`/shop-static/item${index}.jpg`}
                                                alt={`shop item ${index}`}
                                                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>



                <h2 className="text-xl font-medium">Descubre nuestra colección</h2>

                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                    Crea una cuenta o inicia sesión para explorar todos nuestros
                    productos y realizar tu compra.
                </p>

                <div className="flex gap-3 mt-2 flex-wrap justify-center">
                    <Link to='/auth/register'>
                        <Button>
                            Crear cuenta
                        </Button>
                    </Link>
                    <Link to='/auth/login'>
                        <Button variant="outline">
                            Iniciar sesión
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                    Al registrarte aceptas nuestros{' '}
                    <a href="/terms" className="underline">términos y condiciones</a>.
                </p>
            </div>
        </>
    );
};