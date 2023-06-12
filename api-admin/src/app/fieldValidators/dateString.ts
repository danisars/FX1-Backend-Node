import {define} from 'superstruct';
import moment from 'moment';

export default (inputs: string[]) =>
  define<string>(`DateString ${inputs}`, x =>
    !x ? true : moment(<any>x, inputs, true).isValid()
  );
