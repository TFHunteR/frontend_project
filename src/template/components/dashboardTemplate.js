import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import LoginContext from '../../pages/login/login.context'
import { nav } from '../../constants'
import { Avatar } from '../../components'
import styledComponents from 'styled-components'
import { Button } from 'react-bootstrap'

const StyledButtonNav = styledComponents(Button)`
  padding: unset;
  font-size: inherit;
  margin: unset;
  line-height: unset;
  text-align: unset;
  vertical-align: unset;
  border: unset;
  border-radius: unset;
`

const StyledButtonSideNav = styledComponents(Button)`
  padding: unset;
  font-size: inherit;
  margin: unset;
  border: unset;
  border-radius: unset;
  text-align: left;
`

const getUserQuery = gql`
  query Query($id: ID!) {
    getUser(id: $id) {
      id
      roleCode
      status
      username
      profile {
        id
        userId
        firstName
        middleName
        lastName
        email
        mobile
        birthDay
        address
        __typename
      }
      __typename
    }
  }
`

export default function Index({ children }) {
  const { userId, roleCode } = useContext(LoginContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [activeNav, setActiveNav] = useState(0)
  const [activeSubNav, setActiveSubNav] = useState(0)
  const pathname = _.has(location, 'pathname') ? location.pathname : null
  const { sideNav } = nav

  const found = _.find(sideNav, { roleCode })

  const navs = _.has(found, 'links') ? found.links : []
  const splitted = _.split(pathname, '/')
  const breadLabel = _.startCase(_.toLower(_.last(splitted)))
  const [roleName, setRoleName] = useState(null)

  const [fullName, setFullName] = useState(null)

  const { data: getUserResult } = useQuery(getUserQuery, {
    skip: !userId,
    variables: { id: userId }
  })

  useEffect(() => {
    const user = _.has(getUserResult, 'getUser') ? getUserResult.getUser : null
    const profile = _.has(user, 'profile') ? user.profile : null
    const firstName = _.has(profile, 'firstName') ? profile.firstName : null
    const middleName = _.has(profile, 'middleName') ? profile.middleName : null
    const lastName = _.has(profile, 'lastName') ? profile.lastName : null
    const wholeName = `${firstName || ''} ${middleName || ''} ${lastName || ''}`

    switch (roleCode) {
      case 'TEACHER':
        setRoleName('TEACHER')
        break
      case 'REGISTRAR':
        setRoleName('REGISTRAR')
        break
      case 'SYSTEM_ADMIN':
        setRoleName('SYSTEM ADMIN')
        break
      case 'SCHOOL_ADMIN':
        setRoleName('SCHOOL ADMIN')
        break
      default:
        setRoleName('STUDENT')
    }

    setFullName(wholeName)
  }, [roleCode, getUserResult])

  const onNavigate = ({ navKey, subKey, path }) => {
    if (navKey !== undefined) {
      setActiveNav(navKey)
    }

    if (subKey !== undefined) {
      setActiveSubNav(subKey)
    }

    navigate(path)
  }

  useEffect(() => {
    const keyString = _.findKey(navs, { path: pathname })
    const key = keyString && parseInt(keyString)

    setActiveNav(key)
  }, [pathname])

  return (
    <>
      <div className='breadcrumb-bar'>
        <div className='container-fluid'>
          <div className='row align-items-center'>
            <div className='col-md-12 col-12'>
              <nav aria-label='breadcrumb' className='page-breadcrumb'>
                <ol className='breadcrumb'>
                  <li className='breadcrumb-item'>
                    <StyledButtonNav
                      variant='button'
                      onClick={() => navigate('/')}
                    >
                      Home
                    </StyledButtonNav>
                  </li>
                  <li className='breadcrumb-item active' aria-current='page'>
                    {breadLabel}
                  </li>
                </ol>
              </nav>
              <h2 className='breadcrumb-title'>{breadLabel}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='content'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-5 col-lg-4 col-xl-3 theiaStickySidebar'>
              <div className='profile-sidebar'>
                <div className='user-widget'>
                  <Avatar size='default' noClick />
                  <div className='user-info-cont'>
                    <h4 className='usr-name'>{fullName}</h4>
                    <p className='mentor-type'>{roleName}</p>
                  </div>
                </div>

                <div className='custom-sidebar-nav'>
                  <ul>
                    {_.map(navs, (nav, mainKey) => {
                      const label = _.has(nav, 'label') ? nav.label : null
                      const path = _.has(nav, 'path') ? nav.path : null
                      const icon = _.has(nav, 'icon') ? nav.icon : null
                      const sub = _.has(nav, 'sub') ? nav.sub : []

                      if (sub.length) {
                        return (
                          <li
                            key={`sidenav-has-submenu-${mainKey}`}
                            className={`has-submenu ${
                              mainKey === activeNav ? 'active' : ''
                            }`}
                          >
                            <StyledButtonSideNav
                              variant='link'
                              className={`${
                                mainKey === activeNav ? 'active' : ''
                              }`}
                              onClick={() => {
                                onNavigate({ path, navKey: mainKey })
                              }}
                            >
                              <i className={`fas ${icon}`} />
                              {label}{' '}
                              <span>
                                <i
                                  className={`fas fa-chevron-${
                                    mainKey === activeNav ? 'down' : 'right'
                                  }`}
                                />
                              </span>
                            </StyledButtonSideNav>

                            <ul
                              className='submenu'
                              style={{
                                display: `${
                                  mainKey === activeNav ? '' : 'none'
                                }`
                              }}
                            >
                              {_.map(sub, (i, sKey) => {
                                const subLabel = _.has(i, 'label')
                                  ? i.label
                                  : null
                                const subPath = _.has(i, 'path') ? i.path : null
                                const subKey = `${mainKey}-${sKey}`
                                return (
                                  <li
                                    key={`sidenav-sub-${sKey}`}
                                    className={`${
                                      subKey === activeSubNav ? 'active' : ''
                                    }`}
                                  >
                                    <StyledButtonSideNav
                                      variant='link'
                                      className={`${
                                        subKey === activeSubNav ? 'active' : ''
                                      }`}
                                      onClick={() =>
                                        onNavigate({
                                          path: subPath,
                                          navKey: mainKey,
                                          subKey
                                        })
                                      }
                                    >
                                      {subLabel}
                                    </StyledButtonSideNav>
                                  </li>
                                )
                              })}
                            </ul>
                          </li>
                        )
                      }

                      return (
                        <li
                          key={`sidenav-${mainKey}`}
                          className={`${mainKey === activeNav ? 'active' : ''}`}
                        >
                          {/* <a className={`${mainKey === activeNav ? 'active' : ''}`} onClick={() => onNavigate({ path, navKey: mainKey })}>
                              <i className={`fas ${icon}`} />
                              {label}
                              {' '}
                              <span><i className="fas fa-chevron-right" /></span>
                            </a> */}
                          <StyledButtonSideNav
                            variant='link'
                            className={`${
                              mainKey === activeNav ? 'active' : ''
                            }`}
                            onClick={() =>
                              onNavigate({ path, navKey: mainKey })
                            }
                          >
                            <i className={`fas ${icon}`} />
                            {label}{' '}
                            <span>
                              <i className='fas fa-chevron-right' />
                            </span>
                          </StyledButtonSideNav>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className='col-md-7 col-lg-8 col-xl-9'>{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
