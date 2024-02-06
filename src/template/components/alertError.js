import React from 'react'
import { Alert } from 'react-bootstrap';

export default function AlertDismissible({ error, onClose }) {
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>Login Error!</Alert.Heading>
      <p>{error}</p>
    </Alert>
  );
}