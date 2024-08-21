import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '../components/Navbar';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Navbar />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
