/* eslint-disable react/prop-types */
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import _ from 'lodash';
import {
  Button,
  Card, Col, Row,
} from 'react-bootstrap';
import { CustomTable } from '../../../components';
import UsersContext from './sections.context';
import styledComponents from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GET_SECTIONS, DELETE_SECTION  } from './gql';
import { useQuery, useMutation  } from '@apollo/client';
import CreateSectionModal from './createSectionModal';
import DeleteConfirmationModal from './deleteSectionModal';
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

  const [sections, setSections] = useState([]);

  const { data, loading } = useQuery(GET_SECTIONS);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [deleteSection] = useMutation(DELETE_SECTION);

  const handleDelete = (sectionId) => {
    setSectionToDelete(sectionId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      deleteSection({ variables: { sectionId: sectionToDelete, userId } });
      const updatedSections = sections.filter(section => section.id !== sectionToDelete);
      setSections(updatedSections);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting section:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };
  

  useEffect(() => {
    const iSections = _.has(data, 'getSections') ? data.getSections : [];

    setSections(iSections);
  }, [data]);

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataKey: 'name',
      render: (name, row) => {
        const sectionId = _.has(row, 'id') ? row.id : null;

        return <Button variant='link' onClick={() => navigate('/school-admin/section', { state: { sectionId } })}>{name}</Button>
      },
    },
    {
      title: 'Grade Level',
      dataKey: 'gradeLevel',
      center: true
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

  return (
    <>
      <h3 className="pb-3">Sections</h3>
      <StyledRow>
        <Col>
          <Card>
            <Card.Header>
              <CreateSectionModal />
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                dataValues={sections}
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