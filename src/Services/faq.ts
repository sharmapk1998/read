import {Share} from 'react-native';

export const shareFaq = (ques: string, ans: string) => {
  try {
    Share.share({
      message: `Q: ${ques}\n\nAns. ${ans}`,
    });
  } catch (error) {
    console.log('Faq Share error', error);
  }
};
