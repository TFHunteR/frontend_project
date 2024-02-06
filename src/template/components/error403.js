import React from 'react'
import { useNavigate } from 'react-router-dom'
import styledComponents from 'styled-components';
import { Button } from 'react-bootstrap';

const StyledButtonNav = styledComponents(Button)`
  padding: unset;
  font-size: inherit;
  margin: unset;
  line-height: unset;
  text-align: unset;
  vertical-align: unset;
  border: unset;
  border-radius: unset;
`;

export default () => {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <div className="main-wrapper">
        <div className="content" style={{ padding: '100px 0px' }}>
          <div className="account-content">
            <div class="page-wrap d-flex flex-row align-items-center">
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center">
                    <span class="display-1 d-block">403</span>
                    <div class="mb-4 lead">The page you are looking for was not found.</div>
                    {/* <a onClick={() => navigate('/')} class="btn btn-link">Back to Home</a> */}
                    <StyledButtonNav variant='button' onClick={() => navigate('/')}>Back to Home</StyledButtonNav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}