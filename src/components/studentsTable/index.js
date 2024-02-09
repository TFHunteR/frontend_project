/* eslint-disable react/prop-types */
import React, { useContext, useMemo, useEffect, useState  } from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Button,
  Card, Col, Row,
  FormControl,
} from 'react-bootstrap';
import CustomTable from '../table';
import UsersContext from './page.context';
import styledComponents from 'styled-components';
import ChangeUserStatus from '../changeUserStatus'

const StyledRow = styledComponents(Row)`
  table {
    font-size: 12px;

    .btn-link {
      font-size: 12px;
    }
  }
  .searchBar-style input {
    width: 200px !important;
    margin-left: auto;
    margin-bottom: 20px;
  }
`;

export default function Index({ title = 'Students', headers = null }) {
  const {
    users,
    loading,
  } = useContext(UsersContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Use useEffect to log the users data when the component mounts
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.profile.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const columns = useMemo(() => [
    {
      title: 'LRN #',
      dataKey: 'profile',
      render: (profile) => {
        const lrn = _.has(profile, 'lrnNo') ? profile.lrnNo : null

        return lrn || ''
      }
    },
    {
      title: 'Name',
      dataKey: 'profile',
      render: (profile) => {
        const firstName = _.has(profile, 'firstName') ? profile.firstName : null;
        const lastName = _.has(profile, 'lastName') ? profile.lastName : null;
        const fullName = `${firstName} ${lastName}`

        return fullName;
      },
    },
    {
      title: 'Gender',
      dataKey: 'profile',
      render: (profile) => {
        const gender = _.has(profile, 'gender') ? profile.gender : null;

        return gender || '';
      },
    },
    {
      title: 'Date Started',
      dataKey: 'profile',
      center: true,
      render: (profile) => {
        return moment().subtract('M', 6).format('lll')
      },
    },
    {
      title: 'Contact',
      dataKey: 'profile',
      center: true,
      render: (profile) => {
        const mobile = _.has(profile, 'mobile') ? profile.mobile : null;

        return mobile || '';
      },
    },
    {
      title: 'STATUS',
      dataKey: 'status',
      render: (status, row) => {
        const userId = _.has(row, 'id') ? row.id : null

        return (
          <ChangeUserStatus userId={userId}>
            {
              ({ onClick }) => <><Button variant='link' onClick={onClick}>{status}</Button></>
            }
          </ChangeUserStatus>
        )
      },
    },
  ]);

  return (
    <>
      <h3 className="pb-3">{title}</h3>
      <StyledRow>
        <Col>
          <Card>
            <Card.Header>
              {headers}
            </Card.Header>
            <Card.Body>
            <div className="searchBar-style">
              <FormControl
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
              <CustomTable
                columns={columns}
                dataValues={filteredUsers}
                loading={loading}
              />
            </Card.Body>
          </Card>
        </Col>
      </StyledRow>
    </>
  );
}