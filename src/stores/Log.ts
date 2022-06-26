import { makeAutoObservable, action, observable } from 'mobx';
import * as _ from 'lodash';
import moment from 'moment';

import { api } from 'config';

import { Log } from 'models';

class LogStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable logs: Log[] = [];

  @action async getLogs() {
    const { data } = await api.get('logs');

    this.logs = data;

    return data;
  }

  @action async createLog(dto: Partial<Log>) {
    await api.post(`logs?dateTaking=${moment(dto.dateTaking).format('YYYY-MM-DD')}&dateShouldReturn=${moment(dto.dateShouldReturn).format('YYYY-MM-DD')}&bookId=${dto.bookId}&customerId=${dto.customerId}`);
  }

  @action async updateLog(id: number, dto: any) {    
    const _bookId = dto.bookId ? dto.bookId : dto.book.id;
    const _customerId = dto.customerId ? dto.customerId : dto.customer.id;

    await api.patch(`logs?logId=${id}&dateTaking=${moment(dto.dateTaking).format('YYYY-MM-DD')}&dateShouldReturn=${moment(dto.dateShouldReturn).format('YYYY-MM-DD')}&bookId=${_bookId}&customerId=${_customerId}`);
  }

  @action async deleteLog(id: number) {
    await api.delete(`logs?logId=${id}`);
  }

  @action async setAsReturned(id: number) {
    await api.put(`logs?logId=${id}&dateReturning=${moment().format('YYYY-MM-DD')}`);
  }
}

export default new LogStore();
