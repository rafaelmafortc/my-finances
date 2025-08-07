import { Footer } from '@/components/landingpage/footer';
import { Founder } from '@/components/landingpage/founder';
import { Header } from '@/components/landingpage/header';
import { Main } from '@/components/landingpage/main';

export default function LandingPage() {
    return (
        <main className="bg-primary p-2 sm:px-4 sm:pt-4">
            <Header />
            <Main />
            <Founder />
            <Footer />
        </main>
    );
}
