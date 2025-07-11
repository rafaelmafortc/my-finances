import { Footer } from './_components/footer';
import { Main } from './_components/main';
import { Header } from './_components/header';

export default function LandingPage() {
    return (
        <main className="bg-primary p-8">
            <Header />
            <Main />
            <Footer />
        </main>
    );
}
