import { makeAutoObservable, action, observable } from 'mobx';
import * as _ from 'lodash';
import moment from 'moment';

import { api } from 'config';

import { Customer } from 'models';

class CustomerStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable customers: Customer[] = [];

  @action async getCustomers() {
    const { data } = await api.get('customers');

    this.customers = data;

    return data;
  }

  @action async getCustomersByQuery(key: string, query: string) {
    const { data } = await api.get(`customers/search?${key}=${query}`);

    return data;
  }

  @action async createCustomer(dto: Partial<Customer>) {
    await api.post(`customers?birthDate=${moment(dto.birthDate).format('YYYY-MM-DD')}`, _.omit(dto, 'id'));
  }

  @action async deleteCustomer(id: number) {
    await api.delete(`customers?customerId=${id}`);
  }

  @action async updateCustomer(id: number, dto: Partial<Customer>) {
    await api.patch(`customers?customerId=${id}&birthDate=${moment(dto.birthDate).format('YYYY-MM-DD')}`, _.omit(dto, 'id', 'birthDate'));
  }
}

export default new CustomerStore();