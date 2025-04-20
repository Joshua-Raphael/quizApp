import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect, Fragment } from 'react'
import { Difficulty, getQuizQuestions, QuestionState } from './Utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ref, push, set } from 'firebase/database';
import { auth } from './firebaseConfig';

const {height, width} = Dimensions.get('window')

// COMPONETS
import Button from './Button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ANswers from './Answers';
import Question from './Question';
import { TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

export default function quiz() {
  const router = useRouter()

  // const { username, items, category, difficulty } = useLocalSearchParams<{
  //   username: string;
  //   items: string;
  //   category: string;
  //   difficulty: string;
  // }>();

  const { items, category, difficulty, quizKey } = useLocalSearchParams<{
    items: string;
    category: string;
    difficulty: string;
    quizKey?: string;
  }>();
  
  
  const user = auth.currentUser;

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [gameover, setGameover] = useState(true);
    const [TOTAL_QUESTIONS] = useState(50);
    const [number, setNumber] = useState(0);
    const setAnswer = useRef(null)

    const startQuiz = async () => {
        setLoading(true);
        setGameover(false);

        const newQuestion = await getQuizQuestions(
          Number(items), 
          difficulty as Difficulty,
          category,
        );

        setQuestions(newQuestion);
        setScore(0);
        setUserAnswers([])
        setNumber(0);
        setLoading(false);
    };
    const checkAnswer = (onComplete?: () => void) => {
      if (!gameover || number == TOTAL_QUESTIONS) {
        const answer = setAnswer.current;
        const correct = questions[number].correct_answer === answer;
    
        const newScore = correct ? score + 1 : score;
        if (correct) {
          setScore(newScore);
        }
    
        const answerObject = {
          question: questions[number].question,
          answer,
          correct,
          correctAnswer: questions[number].correct_answer,
        };
    
        setUserAnswers((prev) => [...prev, answerObject]);
    
        const isLastQuestion = number + 1 === Number(items);
    
        setTimeout(() => {
          if (isLastQuestion) {
            setGameover(true);
    
            if (user) {
              const quizId = quizKey || `${category}-${difficulty}-${Date.now()}`;
              set(ref(db, `users/${user.uid}/quizzes/${quizId}`), {
                email: user.email,
                score: newScore,
                totalItems: Number(items),
                difficulty,
                category,
                date: Date.now(),
              }).then(() => {
                if (onComplete) onComplete();
              });
            } else {
              if (onComplete) onComplete();
            }
          } else {
            setNumber((prev) => prev + 1);
          }
        }, 800);
      }
    };
    

    // const checkAnswer =  () => {
    //     if(!gameover || number == TOTAL_QUESTIONS){
    //       const answer = setAnswer.current;

    //       const correct = questions[number].correct_answer === answer;

    //       if (correct){
    //         setScore((prev) => prev + 1);
    //       }

    //       const answerObject = {
    //         question: questions[number].question,
    //         answer,
    //         correct,
    //         correctAnswer: questions[number].correct_answer,
    //       };

    //       setUserAnswers((prev) => [...prev, answerObject]);
    //       setTimeout(() => {
    //         nextQuestion()
    //       }, 800);
    //     }
    // };

    const nextQuestion = () => {
      const nextQ = number + 1;

      if (nextQ == Number(items)){
        setGameover(true);

        if (user) {
          const quizId = quizKey || `${category}-${difficulty}-${Date.now()}`;
          set(ref(db, `users/${user.uid}/quizzes/${quizId}`), {
            email: user.email,
            score,
            totalItems: Number(items),
            difficulty,
            category,
            date: Date.now(),
          });
        }
        

        // if (user) {
        //   const quizId = `${category}-${difficulty}-${Date.now()}`;
        //   set(ref(db, `users/${user.uid}/quizzes/${quizId}`), {
        //     email: user.email,
        //     score,
        //     totalItems: Number(items),
        //     difficulty,
        //     category,
        //     date: Date.now(),
        //   });
        // }
        
  //       set(ref(db, `scores/${username}`), {
  //         username,
  //         score,
  //         totalItems: Number(items),
  //         difficulty,
  //         category,
  //         date: Date.now(),

  //       // push(ref(db, 'scores/'), {
  //       // username,
  //       // score,
  //       // totalItems: Number(items),
  //       // difficulty,
  //       // category,
  //       // date: Date.now(),
  // });
      }else {
        setNumber(nextQ);
      }
    }

    useEffect(() => {
        startQuiz();
    },[]);

  return (

    // CONTAINER VIEW
    <View style={{
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
        padding: 20,
        backgroundColor: '#fff'
    }}>


      {/* HEAD CONTAINER */}
      <View style={{flex: 1}}>

        {!loading ? 
        <Fragment>

          <View style={{
            flexDirection: 'row',
            marginTop: 70,
            justifyContent: 'space-between',

          }}>
              <Text style={{
                fontSize: 16,
              }}>
                  Questions
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#006996'
              }}>
                  {number+1}/{questions.length} 
              </Text>
          </View>

          <View style ={{ marginVertical: 20}}>
              <Text style={{
                fontSize: 16,
                color: '#006996'
              }}>
                 {score}
              </Text>
          </View>

          {questions.length > 0 ? (
            <>
              {/* QUESTION TEXT */}
              <Question 
              questionNr = {number+1}
              question= {questions[number].question}/>
              
              {/* CONTAINER VIEW */}
              <ANswers
              answers={questions[number].answers}
              setAnswer={setAnswer}
              checkAnswer={checkAnswer}
              userAnswer={userAnswers ? userAnswers[number] : undefined}/>
            </>
          ): null}
        </Fragment> : (
            
            <ActivityIndicator style={{alignItems: 'center',
              justifyContent: 'center'}} size="large" color="#006996"/>
          
          )}
         
      </View>


      {/* NEXT BUTTON */}
      <View style={{
            padding: 20,
            backgroundColor: '#006996',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 300,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 20, 
            right: 20,
        }}>

          
              {!gameover && !loading && number != TOTAL_QUESTIONS - 1 ? 
              (
                <TouchableWithoutFeedback onPress={() => nextQuestion()}>
                  <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#006996',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}>

                      <Text style={{ color: 'white', fontSize: 24 }}>→</Text>

                  </View>
                </TouchableWithoutFeedback>
              ) : 
              (
                <TouchableOpacity onPress={() => router.push('/(tabs)/leaderboard')}>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: '#006996',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}>
    
                        <Text style={{ color: 'white', fontSize: 24 }}>DONE</Text>
    
                    </View>
                </TouchableOpacity>
              )}
              
          

      </View>
    </View>
  )
}