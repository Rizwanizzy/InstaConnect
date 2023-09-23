import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import SearchApi from '../api/SearchApi';
import {MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../utils/constants';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import PostDetailModal from './PostDetailModal';

const CenteredTable = styled(MDBTable)`
  width: 80%;
  margin: 0 auto;
  margin-top:30px;
`;

const StyledTableRow = styled.tr`
  border-width:0px;
  td {
    border-bottom: 0px none rgb(254, 254, 254);
    border-width:0;
    width:32%;
    &:hover {
      cursor: pointer;
      background-color: #EBEAEA !important;
    }
  }
`;
const Search = ({ isVisible, onClose }) => {

  const buttonStyle = {
    background:
      'radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), ' +
      'radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), ' +
      'radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), ' +
      'radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), ' +
      'radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), ' +
      'radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), ' +
      'radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), ' +
      'linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)',
  };

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchData , setSearchData] = useState([])
  const [postId,setPostId] =useState(null)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const data = await SearchApi(inputValue)
      setSearchData(data)
      const usersData = data?.user_data?.users;
      const postsData = data?.post_data?.posts;
      console.log('users:',usersData)
      console.log('posts:',postsData)
    } catch(error) {
      console.error(error)
    }
  }

  const handleViewPost = (postId) =>{
    setPostId(postId)
    setShowPostDetailModal(true)
  }

  return (
    <div>
      <Modal show={isVisible} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <PostDetailModal isVisible={showPostDetailModal} onClose={() =>setShowPostDetailModal(false)} postID={postId}/>
          <Form>
            <Form.Group className={`mb-3 ${isFocused ? 'focused' : ''}`} controlId="exampleForm.ControlInput1">
              <label htmlFor="searchInput" className="sr-only">
                Search
              </label>
              <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>
                <Form.Control
                  type="text"
                  id="searchInput"
                  name='searchInput'
                  placeholder={isFocused ? '' : 'Search'}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </Form.Group>
          </Form>
          {searchData ? 
            <CenteredTable>
              <MDBTable align='middle' style={{ borderWidth: '0px',marginTop:'-10px' }}>
                <MDBTableBody>
                {searchData?.user_data?.users && searchData.user_data.users.length > 0 && (
                  <p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px'}} className='text-bold'>Users</p>
                  )}
                    {searchData?.user_data?.users?.map((item) => (
                    <StyledTableRow >
                      <NavLink to={`/profile/${item.email}`} style={{ textDecoration: 'none' }}>
                        <td>
                            <div className='d-flex align-items-center'>
                              <img
                                  src={item.display_pic ? `${BASE_URL}${item.display_pic}` : '../images/default_picture.png' }
                                  alt={item.username}
                                  style={{ width: '45px', height: '45px' }}
                                  className='rounded-circle'
                              />
                              <div className='ms-3'>
                                <p className='fw-bold mb-0'>{item.username}</p>                            
                                <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    </StyledTableRow>
                    ))}

                {searchData?.post_data?.posts && searchData.post_data.posts.length > 0 && (
                  <p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px'}} className='text-bold'>Posts</p>
                  )}
                    {searchData?.post_data?.posts?.map((item) => (
                    <StyledTableRow >
                      <NavLink key={item.id} onClick={() => handleViewPost(item.id)} style={{ textDecoration: 'none' }}>
                        <td>
                            <div className='d-flex align-items-center'>
                              <img
                                  src={item.img ? `${BASE_URL}${item.img}` : '../images/default_picture.png' }
                                  alt={item.username}
                                  style={{ width: '90px', height: '60px',borderRadius: '10px' }}
                                  className=''
                              />
                              <div className='ms-3'>
                                <p className='fw-bold mb-0'>{item.author.username}</p>                            
                                <p className='text-muted mb-1'>{item.body}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    </StyledTableRow>
                    ))}
                  
                </MDBTableBody>
              </MDBTable>
            </CenteredTable>:''
      }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit} style={buttonStyle}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Search;
