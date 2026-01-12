export interface AnswerContactRequest {
  answer: string;
  newState: 'ACCEPTED' | 'REJECTED';
}
