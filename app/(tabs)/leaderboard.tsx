import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { auth, db } from '../Components/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../Components/LogoutButton';
import * as Animatable from 'react-native-animatable';
import quiz from '../Components/Quiz';
import { useIsFocused } from '@react-navigation/native';

const difficultyWeights = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const [animate, setAnimate] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!auth.currentUser ) {
      console.error('No authenticated user found.');
      return;
    }
    const scoresRef = ref(db, `users/${auth.currentUser .uid}/quizzes`);
    onValue(scoresRef, (snapshot) => {
      const val = snapshot.val() || {};
      const formatted = Object.entries(val).map(([key, user]: [string, any]) => {
        const percentage = (user.score / user.totalItems) * 100;
        const difficultyKey = user.difficulty.toLowerCase() as keyof typeof difficultyWeights;
        const weightedScore = percentage * (difficultyWeights[difficultyKey] || 1);
        return { key, ...user, percentage, weightedScore };
      }).sort((a, b) => b.weightedScore - a.weightedScore);

      setData(formatted);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      setAnimate(true);
    }
  }, [isFocused]);

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this entry?');
      if (confirmed) {
        if (auth.currentUser) {
          remove(ref(db, `users/${auth.currentUser.uid}/quizzes/${id}`));
        } else {
          console.error('No authenticated user found.');
        }
      }
    } else {
      Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (auth.currentUser) {
              remove(ref(db, `users/${auth.currentUser.uid}/quizzes/${id}`));
            } else {
              console.error('No authenticated user found.');
            }
          },
        },
      ]);
    }
  };

  const handleRequiz = async (user: any) => {
    const category = user.category || 'defaultCategory';
    const difficulty = user.difficulty || 'easy';
    const items = user.totalItems || 10;

    await new Promise(resolve => setTimeout(resolve, 150));

    router.push({
      pathname: '../Components/Quiz',
      params: {
        items,
        category,
        difficulty,
        quizKey: user.key,
      }
    });
  };

const [animateWobble, setAnimateWobble] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    setAnimateWobble(true);
    setTimeout(() => setAnimateWobble(false), 1000); // Run wobble for 1 second
  }, 2000); // Every 2 seconds

  return () => clearInterval(interval); // Clean up
}, []);

  return (
    <Animatable.View
    animation={animate ? 'fadeInDown' : undefined}
    duration={800}
    style={{ flex: 1, padding: 20 }}
    onAnimationEnd={() => setAnimate(false)}
>
  <LogoutButton />
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>🏆 Leaderboard</Text>

  <View style={{ flex: 1 }}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={({ item, index }) => (
        <Animatable.View
          animation="fadeInDown"
          useNativeDriver={true}
          delay={index * 100}
          duration={600}
          style={{
            marginVertical: 8,
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 12,
            borderColor: '#ddd',
            borderWidth: 1,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            {item.avatar && (
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 50, height: 50, borderRadius: 25, marginBottom: 10 }}
              />
            )}
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{index + 1}. {item.username}</Text>
            <Text>Score: {item.score}/{item.totalItems}</Text>
            <Text>Difficulty: {item.difficulty}</Text>
            <Text>Weighted: {item.weightedScore.toFixed(2)}</Text>
          </View>

          {animateWobble ? (
            <Animatable.View animation="wobble" duration={1000}>
                <TouchableOpacity onPress={() => handleRequiz(item)} style={{ marginLeft: 10 }}>
                  <Ionicons name="refresh-outline" size={24} color="blue" />
                </TouchableOpacity>
              </Animatable.View>
            ) : (
              <TouchableOpacity onPress={() => handleRequiz(item)} style={{ marginLeft: 10 }}>
                <Ionicons name="refresh-outline" size={24} color="blue" />
              </TouchableOpacity>
            )}


          <TouchableOpacity onPress={() => handleDelete(item.key)} style={{ marginLeft: 10 }}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </Animatable.View>
      )}
    />
  </View>
</Animatable.View>
  );
}