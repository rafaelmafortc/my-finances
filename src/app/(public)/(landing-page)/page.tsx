import { Header } from '@/components/landingpage/header';
import { Main } from '@/components/landingpage/main';
import { Founder } from '@/components/landingpage/founder';
import { Footer } from '@/components/landingpage/footer';

export default function LandingPage() {
    return (
        <main className="bg-primary p-2 sm:p-6">
            <Header />
            <Main />
            <Founder />
            <Footer />
        </main>
    );
}
