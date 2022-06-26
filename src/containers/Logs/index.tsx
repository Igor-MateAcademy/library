import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

import template from 'hoc/template';

import AddLogModal from './AddLogModal';

import { useStore } from 'stores';

import { Book, Customer, Log, PopulatedLog } from 'models';

import styles from './styles.module.scss';

const Logs: React.FC = () => {
  const { booksStore, customersStore, logsStore } = useStore();

  const [freeBooks, setFreeBooks] = useState<Book[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [logs, setLogs] = useState<PopulatedLog[]>([]);

  const init = async () => {
    const _freeBooks = await booksStore.getAvailableBooks();
    const _customers = await customersStore.getCustomers();
    const _logs = await logsStore.getLogs();

    setFreeBooks(_freeBooks);
    setCustomers(_customers);
    setLogs(_logs);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className={styles.title}>
        <h1>
          Logs
        </h1>

        <AddLogModal update={init} customers={customers} books={freeBooks}>
          <Button>
            Create log
          </Button>
        </AddLogModal>
      </div>

      <ul className={styles.list}>
        {logs.map((log: PopulatedLog) => {
          const { firstName, lastName } = log.customer;

          return (
            <li className={styles.item} key={log.id}>
              <AddLogModal log={log} update={init} customers={customers} books={freeBooks}>
                <button className={styles.button}>
                  <div className={styles.info}>
                    <span>
                      {`${firstName} ${lastName}`}
                    </span>

                    {` took `}

                    <span>
                      {`"${log.book.title}"`}
                    </span>
                  </div>
                </button>
              </AddLogModal>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default template(Logs);
