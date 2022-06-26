import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

const template = (WrappedComponent: any) => {
  const Layout: React.FC = () => {
    return (
      <>
        <header className={styles.header}>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Link to="/books">
                Books
              </Link>
            </li>

            <li className={styles.item}>
              <Link to="/customers">
                Customers
              </Link>
            </li>

            <li className={styles.item}>
              <Link to="/logs">
                Logs
              </Link>
            </li>
          </ul>
        </header>

        <main className={styles.main}>
          <WrappedComponent />
        </main>
      </>
    );
  };

  return Layout;
};

export default template;
