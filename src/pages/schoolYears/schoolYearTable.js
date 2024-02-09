/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Button,
  Card, Col, Row,
} from 'react-bootstrap';
import { CustomTable } from '../../components';
import UsersContext from './schoolYear.context';
import styledComponents from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GET_SCHOOL_YEARS, DELETE_SY } from './gql';
import { useQuery, useMutation } from '@apollo/client';
import CreateSchoolYearModal from './createSchoolYearModal'
import DeleteConfirmationModal from './deleteSchoolYearModal';
import ChangeStatus from './changeStatus'

const StyledRow = styledComponents(Row)`
  table {
    font-size: 12px;

    .btn-link {
      font-size: 12px;
    }
  }
`;

export default function Index() {
  const {
    userId
  } = useContext(UsersContext);
  const navigate = useNavigate()

  const [schoolYears, setSchoolYears] = useState([]);

  const { data, loading } = useQuery(GET_SCHOOL_YEARS);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [SYToDelete, setSYToDelete] = useState(null);
  const [deleteSY] = useMutation(DELETE_SY);

  const handleDelete = (syId) => {
    setSYToDelete(syId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      deleteSY({ variables: { syId: SYToDelete, userId } });
      const updatedSY = schoolYears.filter(schoolYears => schoolYears.id !== SYToDelete);
      setSchoolYears(updatedSY);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting section:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    const sys = _.has(data, 'getSchoolYears') ? data.getSchoolYears : [];

    setSchoolYears(sys);
  }, [data]);

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataKey: 'name',
      // render: (name, row) => {
      //   const syId = _.has(row, 'id') ? row.id : null

      //   return <Button variant='link' onClick={() => navigate('view', { state: { syId } })}>{name}</Button>
      // }
    },
    {
      title: 'Start Date',
      dataKey: 'startDate',
      center: true,
      render: (startDate) => {
        return moment(startDate).format('ll')
      },
    },
    {
      title: 'Closing Date',
      dataKey: 'endDate',
      center: true,
      render: (endDate) => {
        // return moment().format('lll')
        return moment(endDate).format('ll')
      },
    },
    {
      title: 'STATUS',
      dataKey: 'status',
      render: (status, row) => {
        const id = _.has(row, 'id') ? row.id : null

        return (
          <ChangeStatus id={id}>
            {
              ({ onClick }) => <><Button variant='link' onClick={onClick}>{status}</Button></>
            }
          </ChangeStatus>
        )
      },
    },
    {
      title: 'Actions',
      dataKey: 'id',
      render: (row) => {
        const sectionId = row 
        return (
          <Button variant='danger' onClick={() => handleDelete(sectionId)}>Delete</Button>
        );
      },
    },
  ]);

  const addUser = useCallback(() => {
    navigate('add');
  }, [])

  return (
    <>
      <h3 className="pb-3">School Years</h3>
      <StyledRow>
        <Col>
          <Card>
            <Card.Header>
              <CreateSchoolYearModal />
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                dataValues={schoolYears}
                loading={loading}
              />
              <DeleteConfirmationModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                handleConfirmDelete={handleConfirmDelete}
              />
            </Card.Body>
          </Card>
        </Col>
      </StyledRow>
    </>
  );
}