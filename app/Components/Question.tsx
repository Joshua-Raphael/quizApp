import { View, Text } from 'react-native'
import React from 'react'
import he from 'he';

interface QuestionProps {
    questionNr: number;
    question: string;
}

const Question = ({question, questionNr} : QuestionProps) => {
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center', 
        marginTop: 33,
        paddingRight: 10,
    }}>
        
          <Text style={{
            color: '006996',
            fontSize: 16,
            marginRight: 10
          }}>
              {questionNr}
          </Text>

          <Text style={{
            color:'#000',
            textAlign: 'left',
            fontSize: 16,
          }}>
              {he.decode(question)}
          </Text>

    </View>
  )
}

export default Question