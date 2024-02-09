/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useContext } from 'react';
import _ from 'lodash';
import { Card, Col, Row, Button } from 'react-bootstrap'; // Import Button component
import { CustomTable, LoadingSpinner } from '../../../components';
import styled from 'styled-components'; // Import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client';
import AnnouncementModal from './announcementModal';
import DeleteAnnouncementModal from './deleteAnnouncementModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { GET_ANNOUNCEMENTS, DELETE_ANNOUNCEMENT, getUser } from './gql';


const StyledRow = styled(Row)` // Use styled directly
  table {
    font-size: 12px;

    .btn-link {
      font-size: 12px;
    }
  }
`;

const RedButton = styled(Button)` // Define RedButton styled component
  color: red;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: darkred;
    text-decoration: underline;
  }
`;

export default function Index() {

  const [announcements, setAnnouncements] = useState([])

  const { data, loading } = useQuery(GET_ANNOUNCEMENTS)

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [annToDelete, setAnnToDelete] = useState(null);
  const [deleteAnn] = useMutation(DELETE_ANNOUNCEMENT);

  const handleDelete = (annId) => {
    setAnnToDelete(annId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      deleteAnn({ variables: { annId: annToDelete } });
      const updatedAnnouncement = announcements.filter(announcements => announcements.id !== annToDelete);
      setAnnouncements(updatedAnnouncement);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting section:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };
  

  useEffect(() => {
    const iRecords = _.has(data, 'getAnnouncements')
      ? data.getAnnouncements
      : []

    setAnnouncements(iRecords)
  }, [data])

  const columns = useMemo(() => [
    {
      title: 'Message',
      dataKey: 'message',
      render: (message) => {
        return _.truncate(message)
      }
    },
    {
      title: 'Created At',
      dataKey: 'createdAt'
    },
    {
      title: 'Create By',
      dataKey: 'createdBy',
      render: (createdBy) => {
        return <CreatedBy createdBy={createdBy} />
      }
    },
    {
      title: 'STATUS',
      dataKey: 'status'
    },
    {
      title: 'ACTION',
      dataKey: 'id',
      render: (id) => {
        return (
        <>
          <AnnouncementModal id={id}>
            <FontAwesomeIcon icon={solid('edit')} />
            {' '}
            EDIT
          </AnnouncementModal>
          {' '}
          <RedButton variant='link' onClick={() => handleDelete(id)}><FontAwesomeIcon icon={solid('trash')} />
            {' '}
            Delete</RedButton>
        </>
        )
      }
    }
  ])

  return (
    <>
      <DeleteAnnouncementModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirmDelete={handleConfirmDelete}
          handleDelete={handleDelete}
        />
      <h3 className='pb-3'>Announcements</h3>
      <StyledRow>
        <Col>
          <Card>
            <Card.Header>
              <AnnouncementModal>
                <FontAwesomeIcon icon={solid('plus')} />
                {` `}
                Create Announcement
              </AnnouncementModal>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                dataValues={announcements}
                loading={loading}
              />
            </Card.Body>
          </Card>
        </Col>
      </StyledRow>
    </>
  )
}

const CreatedBy = ({ createdBy }) => {
  const [name, setName] = useState(null)

  const { data, loadingUser } = useQuery(getUser, {
    variables: {
      id: createdBy
    }
  })

  useEffect(() => {
    const user = _.has(data, 'getUser') ? data.getUser : null
    const profile = _.has(user, 'profile') ? user.profile : null
    const fName = _.has(profile, 'firstName') ? profile.firstName : null
    const lName = _.has(profile, 'lastName') ? profile.lastName : null
    const fullName = `${fName} ${lName}`

    setName(fullName)
  }, [data])

  return loadingUser ? <LoadingSpinner /> : name
}
