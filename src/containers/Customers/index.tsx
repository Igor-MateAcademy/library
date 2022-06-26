import React, { useState, useEffect } from 'react';
import { Button, Avatar, Input, Select } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import stringToColor from 'string-to-color';

import template from 'hoc/template';

import AddCustomerModal from './AddCustomerModal';

import { useStore } from 'stores';

import { Customer } from 'models';

import styles from './styles.module.scss';

const Customers: React.FC = () => {
  const { customersStore } = useStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState({
    key: '',
    query: '',
  });

  const init = async () => {
    const _customers = await customersStore.getCustomers();

    setCustomers(_customers);
    setSearch({
      key: '',
      query: '',
    });
  };

  const getCustomersByQuery = async () => {
    const data = await customersStore.getCustomersByQuery(search.key, search.query);

    setCustomers(data);
  };

  const getInitials = (obj: Customer) => `${obj.firstName.split('')[0]}${obj.lastName.split('')[0]}`;

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className={styles.title}>
        <h1>
          Customer
        </h1>

        <AddCustomerModal update={init}>
          <Button>
            Add customer
          </Button>
        </AddCustomerModal>
      </div>

      <div className={styles.search}>
        <Select placeholder="Search by..." style={{ width: '20%' }} options={[
          {
            value: 'firstName',
            label: 'First Name',
          },
          {
            value: 'lastName',
            label: 'Last Name',
          },
          {
            value: 'birthDate',
            label: 'birthDate',
          },
          {
            value: 'address',
            label: 'Address',
          },
          {
            value: 'workPlace',
            label: 'Work place',
          },
          {
            value: 'passport',
            label: 'Passport',
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

        <Button onClick={getCustomersByQuery} icon={<SearchOutlined />} type="primary" shape="circle" disabled={search.query.length === 0 || search.key.length === 0}></Button>

        <Button onClick={init} icon={<CloseOutlined />} shape="circle"></Button>
      </div>

      <ul className={styles.list}>
        {customers.map(customer => {
          const initials = getInitials(customer);

          return (
            <li className={styles.item} key={customer.id}>
              <AddCustomerModal update={init} customer={customer}>
                <button className={styles.button}>
                  <Avatar size={56} style={{ backgroundColor: stringToColor(initials) }}>
                    {initials}
                  </Avatar>

                  <div className={styles.name}>
                    {`${customer.firstName} ${customer.lastName}`}
                  </div>
                </button>
              </AddCustomerModal>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default template(Customers);
