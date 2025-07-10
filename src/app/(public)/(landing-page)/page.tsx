import { Footer } from './components/footer';
import { Main } from './components/main';
import { Header } from './components/header';

export default function LandingPage() {
    return (
        <main className="bg-primary p-8">
            <Header />
            <Main />
            <Footer />
        </main>
    );
}
