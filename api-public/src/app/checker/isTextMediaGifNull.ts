import {UserInputError} from 'apollo-server-express';
import {InputMedia} from './isMediaNotEmpty';

export default function (text?: string | null, Media?: InputMedia[] | null, gif?: string | null) {
  if (!text && !Media && !gif) {
    throw new UserInputError('Text, Media and Gif cannot be empty.');
  }
}
