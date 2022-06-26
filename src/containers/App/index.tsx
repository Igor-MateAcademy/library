import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { Books, Customers, Logs } from 'containers';

import store from 'stores';

import 'sources/styles/styles.scss';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <Routes>
          <Route path="/" element={<Navigate to="books" />} />
          <Route path="books" element={<Books />} />
          <Route path="customers" element={<Customers />} />
          <Route path="logs" element={<Logs />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
