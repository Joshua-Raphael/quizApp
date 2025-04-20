import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
      headerShown: false, // optional: hides the top header if you want
      }}
    >
      <Tabs.Screen
      name="createQuiz"
      options={{
        title: 'Generate Quiz',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen
      name="leaderboard"
      options={{
        title: 'Leaderboard',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="trophy-outline" size={size} color={color} />
        ),
      }}
      />
    </Tabs>
  );
}
