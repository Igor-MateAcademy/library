import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Select, DatePicker, Switch } from 'antd';
import moment from 'moment';

import { useStore } from 'stores';

import { Log, Book, Customer, PopulatedLog } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  books: Book[];
  customers: Customer[];
  log?: PopulatedLog;
}

const { Item, useForm } = Form;

const AddLogModal: React.FC<Props> = ({ children, update, customers, books, log }) => {
  const { logsStore } = useStore();
  const [form] = useForm();

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<Log>>({ dateTaking: moment() });
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const inputHandler = (field: keyof Log, value: moment.Moment | number) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const submit = async () => {
    if (log) {
      await logsStore.updateLog(log.id, data);
    } else {
      await logsStore.createLog(data);
    }

    onToggle();
    await update();
  };

  const deleteLog = async () => {
    log && logsStore.deleteLog(log.id);

    onToggle();
    await update();
  };

  const markAsReturned = async () => {
    log && logsStore.setAsReturned(log.id);
  };

  useEffect(() => {
    log && setData({ ...log });
    setAvailableBooks(log ? [...availableBooks, log.book] : [...books]);
  }, []);

  return (
    <>
      {
        React.cloneElement(children as React.ReactElement<any>, {
          onClick: onToggle,
        })
      }

      <Modal visible={open} onCancel={onToggle} footer={null} centered>
        <Form form={form} validateTrigger={['onBlur', 'onChange', 'onSubmit']} layout="vertical" onFinish={submit} initialValues={{
          dateShouldReturn: log ? moment(log.dateShouldReturn) : '',
          bookId: log ? log.book.id : '',
          customerId: log ? log.customer.id : '',
        }}>
          <Item name="dateShouldReturn" label="Return at" rules={[{ required: true, message: 'This field is required' }]}>
            <DatePicker disabledDate={current => current && current < moment().endOf('day')} format="DD MMM YYYY" onChange={date => {
              date && inputHandler('dateShouldReturn', date);
            }} />
          </Item>

          <Item name="bookId" label="Book" rules={[{ required: true, message: 'This field is required' }]}>
            <Select onSelect={(e: number) => {
              inputHandler('bookId', e);
            }} options={availableBooks.map(book => ({ value: book.id, label: book.title }))} />
          </Item>

          <Item name="customerId" label="Customer" rules={[{ required: true, message: 'This field is required' }]}>
            <Select onSelect={(e: number) => {
              inputHandler('customerId', e);
            }} options={customers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} />
          </Item>

          <Button htmlType="submit">
            {log ? 'Update' : 'Add'}
          </Button>

          {(log && log.dateReturning) && (
            <Button onClick={deleteLog} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}

          {log && (
            <span style={{ marginLeft: '20px' }}>
              <span>Mark as returned</span>

              <Switch checked={!!log.dateReturning} style={{ marginLeft: '20px' }} onChange={markAsReturned} disabled={!!log.dateReturning} />
            </span>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddLogModal;
