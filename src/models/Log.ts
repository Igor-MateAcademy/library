import moment from 'moment';
import { Book, Customer } from 'models';

export interface Log {
  id: number
  dateTaking: moment.Moment | string;
  dateShouldReturn: moment.Moment | string;
  dateReturning: string;
  bookId: number;
  customerId: number;
}

export interface PopulatedLog {
  id: number
  dateTaking: moment.Moment | string;
  dateShouldReturn: moment.Moment | string;
  dateReturning: string;
  book: Book;
  customer: Customer;
}
