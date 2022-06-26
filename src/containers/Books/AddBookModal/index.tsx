import React, { useState } from 'react';
import { Input, Form, Modal, Button } from 'antd';

import { useStore } from 'stores';

import { Book } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  book?: Book; 
}

const { useForm, Item } = Form;

const AddBookModal: React.FC<Props> = ({ children, update, book }) => {
  const [form] = useForm();
  const { booksStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<Book>>(book ? { ...book } : {});

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const inputHandler = (field: keyof Book, value: string | number) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const submit = async () => {
    if (book) {
      await booksStore.updateBook(book.id, data);
    } else {
      await booksStore.createBook(data);
    }

    onToggle();
    await update();
  };

  const deleteBook = async () => {
    book && await booksStore.deleteBook(book.id);

    onToggle();
    await update();
  };

  return (
    <>
      {
        React.cloneElement(children as React.ReactElement<any>, {
          onClick: onToggle,
        })
      }

      <Modal onCancel={onToggle} visible={open} centered footer={null}>
        <Form
          layout="vertical"
          form={form}
          validateTrigger={['onBlur', 'onChange', 'onSubmit']}
          onFinish={submit}
          initialValues={book ? { ...book } : {}}
        >
          <Item name="title" label="Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('title', e.target.value);
            }} />
          </Item>

          <Item name="author" label="Author" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('author', e.target.value);
            }} />
          </Item>

          <Item name="publisher" label="Publisher" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('publisher', e.target.value);
            }} />
          </Item>

          <Item name="genre" label="Genre" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('genre', e.target.value);
            }} />
          </Item>

          <Item name="year" label="Year" rules={[{ required: true, message: 'This field is required' }, { pattern: /^[0-9]{1,4}$/g, message: 'Incorrect format' }]}>
            <Input onChange={e => {
              inputHandler('year', +e.target.value);
            }} />
          </Item>

          <Item name="numberOfPage" label="Pages count" rules={[{ required: true, message: 'This field is required' }, { pattern: /^[0-9]{1,4}$/g, message: 'Incorrect format' }]}>
            <Input onChange={e => {
              inputHandler('numberOfPage', +e.target.value);
            }} />
          </Item>

          <Button htmlType="submit">
            {book ? 'Update' : 'Add'}
          </Button>

          {book && (
            <Button onClick={deleteBook} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddBookModal;
