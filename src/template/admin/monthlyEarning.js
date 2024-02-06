import { gql, useQuery } from '@apollo/client';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPesoSign } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../../components'

import PaymentClient from '../../PaymentClient';

const GET_MONTHLY_EARNING = gql`
query Query($monthYear: String!) {
    getMonthlyEarnings(monthYear: $monthYear)
  }
`;

export default function monthlyEarning() {
  const { data, loading: currentLoading } = useQuery(GET_MONTHLY_EARNING, {
    client: PaymentClient,
    variables: {
      monthYear: moment().format('YYYY-MM-DD'),
    },
  });

  const { data: prevData, loading: prevLoading } = useQuery(GET_MONTHLY_EARNING, {
    client: PaymentClient,
    variables: {
      monthYear: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    },
  });

  const currentMonth = _.has(data, 'getMonthlyEarnings') ? data.getMonthlyEarnings : null;
  const prevMonth = _.has(prevData, 'getMonthlyEarnings') ? prevData.getMonthlyEarnings : null;

  const currentTotalGrossPay = _.has(currentMonth, 'totalGrossPay') ? currentMonth.totalGrossPay : 0;
  const currentTotalFees = _.has(currentMonth, 'totalFees') ? currentMonth.totalFees : 0;
  const currentDeductions = _.has(currentMonth, 'totalDeductions') ? currentMonth.totalDeductions : 0;
  const currentIncentives = _.has(currentMonth, 'totalIncentives') ? currentMonth.totalIncentives : 0;
  const currentTutorIncome = _.has(currentMonth, 'totalTutorIncome') ? currentMonth.totalTutorIncome : 0;

  const prevTotalGrossPay = _.has(prevMonth, 'totalGrossPay') ? prevMonth.totalGrossPay : 0;
  const prevTotalFees = _.has(prevMonth, 'totalFees') ? prevMonth.totalFees : 0;
  const prevDeductions = _.has(prevMonth, 'totalDeductions') ? prevMonth.totalDeductions : 0;
  const prevIncentives = _.has(prevMonth, 'totalIncentives') ? prevMonth.totalIncentives : 0;
  const prevTutorIncome = _.has(prevMonth, 'totalTutorIncome') ? prevMonth.totalTutorIncome : 0;

  return (
    <Row>
      <Col lg={6}>
        <div className="dash-board-list pink">
          <div className="dash-widget" style={{ height: '100%' }}>
            <div className="circle-bar">
              <div className="icon-col">
                <i className="fas fa-money-bill" />
              </div>
            </div>
            { !currentLoading ? <div className="dash-widget-info">
              <h3>
                <PesoIcon value={currentTotalGrossPay} />
              </h3>
              <p>
                Total Learnlive Fees:
                {' '}
                <PesoIcon value={currentTotalFees} />
              </p>
              <p>
                Total Deductions:
                {' '}
                <PesoIcon value={currentDeductions} />
              </p>
              <p>
                Total Incentives:
                {' '}
                <PesoIcon value={currentIncentives} />
              </p>
              <p>
                Total Tutor Income:
                {' '}
                <PesoIcon value={currentTutorIncome} />
              </p>
              <div>
                <h5>Current Month</h5>
              </div>
            </div>: <LoadingSpinner/>}
          </div>
        </div>
      </Col>
      <Col lg={6}>
        <div className="dash-board-list yellow">
          <div className="dash-widget" style={{ height: '100%' }}>
            <div className="circle-bar">
              <div className="icon-col">
                <i className="fas fa-money-bill" />
              </div>
            </div>
            { !prevLoading ? <div className="dash-widget-info">
              <h3>
                <PesoIcon value={prevTotalGrossPay} />
              </h3>
              <p>
                Total Learnlive Fees:
                {' '}
                <PesoIcon value={prevTotalFees} />
              </p>
              <p>
                Total Deductions:
                {' '}
                <PesoIcon value={prevDeductions} />
              </p>
              <p>
                Total Incentives:
                {' '}
                <PesoIcon value={prevIncentives} />
              </p>
              <p>
                Total Tutor Income:
                {' '}
                <PesoIcon value={prevTutorIncome} />
              </p>
              <div>
                <h5>Previous Month</h5>
              </div>
            </div>: <LoadingSpinner/>}
          </div>
        </div>
      </Col>
    </Row>
  );
}

function PesoIcon({ value }) {
  return (
    <>
      <FontAwesomeIcon icon={faPesoSign} />
      {value.toFixed(2)}
    </>
  );
}
