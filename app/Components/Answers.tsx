import { View, Text} from 'react-native'
import React, { Fragment } from 'react'
import Button from './Button';
import {AnswerObject} from './Quiz';


interface AnswerProps {
  answers: string[];
  setAnswer: any;
  checkAnswer: (onComplete?: () => void) => void;
  userAnswer: AnswerObject | undefined;
  isLastQuestion?: boolean;
  onLastAnswer?: () => void;
}

const ANswers = ({
  answers,
  setAnswer,
  checkAnswer,
  userAnswer,
  isLastQuestion,
  onLastAnswer,
}: AnswerProps) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 14,
        paddingHorizontal: 24.5,
        marginTop: 30,
      }}
    >
      {answers.map((answer) => (
        <Fragment key={answer}>
          <Button
            variant="default"
            correct={userAnswer?.correctAnswer === answer}
            answer={answer}
            disabled={!!userAnswer}
            onPress={() => {
              setAnswer.current = answer;
              if (isLastQuestion) {
                checkAnswer(onLastAnswer);
              } else {
                checkAnswer();
              }
            } } key={0}          />
        </Fragment>
      ))}
    </View>
  );
};

export default ANswers;
