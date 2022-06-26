import { makeAutoObservable, action, observable } from 'mobx';
import * as _ from 'lodash';

import { api } from 'config';

import { Book } from 'models';

class BookStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable books: Book[] = []; 

  @action async getBooks() {
    const { data } = await api.get('books');

    this.books = data;

    return data;
  }

  @action async getBooksByQuery(key: string, query: string) {
    const { data } = await api.get(`books/search?${key}=${query}`);

    return data;
  } 

  @action async getAvailableBooks() {
    const { data } = await api.get('books/free'); 

    return data;
  }

  @action async createBook(dto: Partial<Book>) {
    await api.post(`books`, dto);
  }

  @action async deleteBook(id: number) {
    await api.delete(`books?bookId=${id}`);
  }

  @action async updateBook(id: number, dto: Partial<Book>) {
    await api.patch(`books?bookId=${id}`, _.omit(dto, ['busy', 'excluded', 'reasonExclude', 'id']));
  }
}

export default new BookStore();