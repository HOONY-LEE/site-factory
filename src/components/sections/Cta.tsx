import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { CtaContent } from "@/types/content";

export default function Cta({ headline, description, buttonLabel, buttonHref }: CtaContent) {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            {description}
          </p>
          <div className="mt-8">
            <Button href={buttonHref} variant="secondary" size="lg">
              {buttonLabel}
            </Button>
          </div>

          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        </div>
      </Container>
    </section>
  );
}
