import { SetStateAction, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { ref, set } from "firebase/database";
import { db } from "../Components/firebaseConfig";
import LogoutButton from '../Components/LogoutButton';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

const categories = [
  { label: "General Knowledge", value: 9 },
  { label: "Entertainment: Books", value: 10 },
  { label: "Entertainment: Film", value: 11 },
  { label: "Entertainment: Music", value: 12 },
  { label: "Entertainment: Musicals & Theatres", value: 13 },
  { label: "Entertainment: Television", value: 14 },
  { label: "Entertainment: Video Games", value: 15 },
  { label: "Entertainment: Board Games", value: 16 },
  { label: "Science & Nature", value: 17 },
  { label: "Science: Computers", value: 18 },
  { label: "Science: Mathematics", value: 19 },
  { label: "Mythology", value: 20 },
  { label: "Sports", value: 21 },
  { label: "Geography", value: 22 },
  { label: "History", value: 23 },
  { label: "Politics", value: 24 },
  { label: "Art", value: 25 },
  { label: "Celebrities", value: 26 },
  { label: "Animals", value: 27 },
  { label: "Vehicles", value: 28 },
  { label: "Entertainment: Comics", value: 29 },
  { label: "Science: Gadgets", value: 30 },
  { label: "Japanese Anime & Manga", value: 31 },
  { label: "Cartoon & Animations", value: 32 },
];
const difficulties = ["easy", "medium", "hard"];

export default function CreateQuiz() {
  const [items, setItems] = useState("10");
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");
  const [animate, setAnimate] = useState(true); // State to control animation re-trigger

  const router = useRouter();
  const isFocused = useIsFocused(); // Track if the screen is focused

  const startQuiz = () => {
    const quizId = Date.now().toString();
    const userRef = ref(db, 'quizzes/' + quizId);
    set(userRef, {
      totalItems: items,
      category,
      difficulty,
    })
      .then(() => {
        router.push({
          pathname: '../Components/Quiz',
          params: { items, category, difficulty },
        });
      })
      .catch((error: any) => {
        console.error(error);
        Alert.alert('Error', 'Could not save quiz settings.');
      });
  };

  // Trigger animation on focus change
  useEffect(() => {
    if (isFocused) {
      setAnimate(true); // Trigger animation when screen is focused
    }
  }, [isFocused]);

  return (
    <Animatable.View
      animation={animate ? "fadeInUp" : undefined}
      duration={800}
      onAnimationEnd={() => setAnimate(false)} // Set animation state to false after animation ends
      style={styles.container}
    >
      <LogoutButton />
      <Animatable.Text animation="fadeInDown" duration={600} style={styles.title}>
        Welcome to the Quiz App!
      </Animatable.Text>

      {/* Animated Quiz Icon */}
      <Animatable.View animation="flipInY" delay={300} iterationCount="infinite">
        <FontAwesome5 name="question-circle" size={100} color="#007bff" style={styles.icon} />
      </Animatable.View>

      {/* Number of Items */}
      <Animatable.View animation="fadeInUp" delay={500} style={styles.inputGroup}>
        <Text style={styles.label}>Number of Items</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10"
          keyboardType="numeric"
          value={items}
          onChangeText={setItems}
        />
      </Animatable.View>

      {/* Category */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue: SetStateAction<number>) => setCategory(itemValue)}>
          {categories.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </Animatable.View>

      {/* Difficulty */}
      <Animatable.View animation="fadeInUp" delay={700} style={styles.inputGroup}>
        <Text style={styles.label}>Difficulty</Text>
        <Picker
          selectedValue={difficulty}
          style={styles.picker}
          onValueChange={(itemValue: SetStateAction<string>) => setDifficulty(itemValue)}>
          {difficulties.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
      </Animatable.View>

      {/* Start Button */}
      <Animatable.View animation="fadeInUp" delay={800} style={{ width: '100%' }}>
        <TouchableOpacity onPress={startQuiz} style={styles.button}>
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  icon: {
    marginBottom: 30,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
