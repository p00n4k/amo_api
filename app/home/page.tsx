import HomeSlider from "./Components/Homeslider";
import LastProjects from "./Components/LastProjects";
import QuoteHead from "./Components/Quote";
import SignatureCollections from "./Components/SignatureCollections";
export default function HomePage() {
    
    return (
        <main className="min-h-screen">
            <HomeSlider />
            <QuoteHead />
            <SignatureCollections />
            <LastProjects />
        </main>
    );
}
