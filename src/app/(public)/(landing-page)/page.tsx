import { Header } from './_components/header';
import { Main } from './_components/main';
import { Founder } from './_components/founder';
import { Footer } from './_components/footer';

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
