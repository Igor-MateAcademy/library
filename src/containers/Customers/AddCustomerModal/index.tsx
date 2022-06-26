import React, { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';

import { useStore } from 'stores';

import { Customer } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  customer?: Customer;
}

const { useForm, Item } = Form;

const AddCustomerModal: React.FC<Props> = ({ children, update, customer }) => {
  const { customersStore } = useStore();
  const [form] = useForm();

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<Customer>>(customer ? { ...customer } : {});

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const submit = async () => {
    if (customer) {
      await customersStore.updateCustomer(customer.id, data);
    } else {
      await customersStore.createCustomer(data);
    }

    onToggle();
    await update();
  };

  const inputHandler = (field: keyof Customer, value: string | moment.Moment) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const deleteCustomer = async () => {
    customer && await customersStore.deleteCustomer(customer.id);

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

      <Modal centered visible={open} onCancel={onToggle} footer={null}>
        <Form form={form} layout="vertical" onFinish={submit} validateTrigger={['onBlur', 'onSubmit', 'onChange']} initialValues={customer ? { ...customer, birthDate: moment(customer.birthDate) } : {}}>
          <Item name="firstName" label="First Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('firstName', e.target.value);
            }} />
          </Item>

          <Item name="lastName" label="Last Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('lastName', e.target.value);
            }} />
          </Item>

          <Item name="birthDate" label="Birthday" rules={[{ required: true, message: 'This field is required' }]}>
            <DatePicker format="DD MMM YYYY" onChange={date => {
              date && inputHandler('birthDate', date);
            }} disabledDate={current => current && current > moment().endOf('day')} />
          </Item>

          <Item name="phone" label="Phone number" rules={[{ required: true, message: 'This field is required' }, { pattern: /^\+?[0-9]{8,15}$/g, message: 'Incorrect format' }]}>
            <Input onChange={e => {
              inputHandler('phone', e.target.value);
            }} />
          </Item>

          <Item name="address" label="Address" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('address', e.target.value);
            }} />
          </Item>

          <Item name="workPlace" label="Work place" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('workPlace', e.target.value);
            }} />
          </Item>

          <Item name="position" label="Position" rules={[{ required: true, message: 'This field is required' }]}>
            <Input onChange={e => {
              inputHandler('position', e.target.value);
            }} />
          </Item>

          <Item name="passport" label="Passport" rules={[{ required: true, message: 'This field is required' }, { pattern: /^[0-9]{10}$/g, message: 'Passport number must contain 10 numeric values' }]}>
            <Input onChange={e => {
              inputHandler('passport', e.target.value);
            }} />
          </Item>

          <Button htmlType="submit">
            {customer ? 'Update' : 'Add'}
          </Button>

          {customer && (
            <Button onClick={deleteCustomer} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddCustomerModal;
