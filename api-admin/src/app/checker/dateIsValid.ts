import moment from 'moment';

export default function (date: string, format: string[]) {
  if (!moment(date, format, true).isValid()) {
    throw new Error(`Date is in incorrect format. Format should be ${format}.`);
  }
}
