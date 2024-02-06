import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import _ from 'lodash';
import { useMutation } from '@apollo/client';
import { SAVE_FILE } from '../../pages/_profile/gql';
import RegistryClient from '../../RegistryClient';

const { REACT_APP_FILE_SERVICE } = process.env;
const UPLOAD_URL = `${REACT_APP_FILE_SERVICE}/upload-image`;

const upload = (file, userUid) => new Promise((resolve, reject) => {
  const { type } = file;
  const splitType = type && type.split('/');
  const ext = splitType.length && _.last(splitType);
  const fileName = `user-avatar.${ext}`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('userUid', userUid);
  formData.append('fileName', fileName);

  axios.post(UPLOAD_URL, formData)
    .then(resolve).catch(reject);
});

export default function uploadAvatarForm({ userUid, onError }) {
  const [saving, setSaving] = useState(false);
  const {
    control, reset,
  } = useForm();

  const [saveFile] = useMutation(SAVE_FILE, { client: RegistryClient, refetchQueries: ['GetUser'] });

  const handleUpload = (e) => {
    setSaving(true);
    const fileList = e.target.files;
    upload(fileList[0], userUid).then((result) => {
      const data = _.has(result, 'data') ? result.data : null;

      saveFile({
        variables: {
          userUid,
          fileCategory: 'USER_AVATAR',
          storage: { ...data },
        },
      }).then(() => {
        setSaving(false);
        reset();
      }).catch((error) => {
        if (onError) {
          onError(error.toString());
        }
        setSaving(false);
        reset();
      });
    }).catch((error) => {
      if (onError) {
        onError(error.toString());
      }
      setSaving(false);
      reset();
    });
  };

  return (
    <Form>
      <Form.Group className="change-photo-btn">
        {!saving ? (
          <span>
            <i className="fa fa-upload" />
            {' '}
            Upload Avatar
          </span>
        ) : 'Uploading...'}
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <Form.Control
              className="upload"
              autoFocus
              type="file"
              onChange={handleUpload}
            />
          )}
        />
      </Form.Group>
    </Form>
  );
}
