import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Navbar />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
