export const _ = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export type Question = {
    category: string;
    correct_answer: string;
    difficult: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};

export type QuestionState = Question & {answers: string[]};

export const getQuizQuestions = async (
    amount: number, 
    difficulty: Difficulty, 
    category: string | number
) : Promise<QuestionState[]> => {
        const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=multiple`;
        const data = await(await fetch(endpoint)).json();
        
        return data.results.map((question: Question) => ({
            ...question,
            answers: _([...question.incorrect_answers, question.correct_answer]),
        }));
};