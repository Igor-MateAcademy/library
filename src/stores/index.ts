import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

import booksStore from './Book';
import customersStore from './Customer';
import logsStore from './Log';

configure({ enforceActions: 'observed' });

class RootStore {
  @observable booksStore = booksStore;
  @observable customersStore = customersStore;
  @observable logsStore = logsStore;
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();