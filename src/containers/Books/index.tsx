import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

import template from 'hoc/template';
import AddBookModal from './AddBookModal';

import { useStore } from 'stores';

import { Book } from 'models';

import styles from './styles.module.scss';

const Books: React.FC = () => {
  const { booksStore } = useStore();

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState({
    key: '',
    query: '',
  });

  const init = async () => {
    const _books = await booksStore.getBooks();

    setBooks(_books);
    setSearch({
      key: '',
      query: '',
    });
  };

  const getBooksByQuery = async () => {
    const data = await booksStore.getBooksByQuery(search.key, search.query);

    setBooks(data);
  };

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <div className={styles.title}>
        <h1>
          Books
        </h1>

        <AddBookModal update={init}>
          <Button>
            Add book
          </Button>
        </AddBookModal>
      </div>

      <div className={styles.search}>
        <Select placeholder="Search by..." style={{ width: '20%' }} options={[
          {
            value: 'title',
            label: 'Title',
          },
          {
            value: 'genre',
            label: 'Genre',
          },
          {
            value: 'year',
            label: 'Year',
          },
          {
            value: 'publisher',
            label: 'Publisher',
          },
          {
            value: 'numberOfPage',
            label: 'Pages count',
          },
        ]} onSelect={(e: string) => {
          setSearch({
            ...search,
            key: e,
          });
        }} />

        <Input placeholder="Start typing..." style={{ width: '20%' }} disabled={search.key.length === 0} onChange={e => {
          setSearch({
            ...search,
            query: e.target.value,
          })
        }} />

        <Button onClick={getBooksByQuery} icon={<SearchOutlined />} type="primary" shape="circle" disabled={search.query.length === 0 || search.key.length === 0 }></Button>

        <Button onClick={init} icon={<CloseOutlined />} shape="circle"></Button>
      </div>

      <ul className={styles.list}>
        {books.map(book => (
          <li className={styles.item} key={book.id}>
            <AddBookModal update={init} book={book}>
              <button className={styles.button}>
                <h3 className={styles.name}>
                  {book.title}
                </h3>

                <div className={styles.author}>
                  {book.author}
                </div>

                <div className={styles.publisher}>
                  {book.publisher}
                </div>
              </button>
            </AddBookModal>
          </li>
        ))}
      </ul>
    </>
  );
};

export default template(Books);
