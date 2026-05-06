import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Problems } from '@/components/Problems';
import { Solution } from '@/components/Solution';
import { Day1 } from '@/components/Day1';
import { Roadmap } from '@/components/Roadmap';
import { ProductRoadmap } from '@/components/ProductRoadmap';
import { Voices } from '@/components/Voices';
import { Whitepaper } from '@/components/Whitepaper';
import { Waitlist } from '@/components/Waitlist';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Problems />
      <Solution />
      <Day1 />
      <Roadmap />
      <ProductRoadmap />
      <Voices />
      <Whitepaper />
      <Waitlist />
      <Footer />
    </>
  );
}
