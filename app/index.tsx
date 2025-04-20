import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Components/firebaseConfig';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('./(tabs)/createQuiz'); // Go to main screen if logged in
      } else {
        router.replace('./Components/login'); // Go to signup screen if not
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
