import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import {Tab,initTE} from "tw-elements";
import Modal from 'react-bootstrap/Modal';
import SearchApi from '../api/SearchApi';
import {MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../utils/constants';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import PostDetailModal from './PostDetailModal';
import notificationSeenApi from '../api/notificationSeenApi';

const GlobalStyle = createGlobalStyle`
  .scrollbar {
    margin-left: 30px;
    float: left;
    height: 20px;
    width: 65px;
    background: #fff;
    overflow-y: scroll;
    margin-bottom: 25px;
  }
  
  .scrollbar-ripe-malinka {
    scrollbar-color: #f5576c #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
    border-radius: 10px;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-image: -webkit-linear-gradient(330deg, #f093fb 0%, #f5576c 100%);
    background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
  }
`;

const CenteredTable = styled(MDBTable)`
  width: 80%;
  margin: 0 auto;
  margin-top:30px;
`;

const modalBodyStyle = {
  maxHeight: '650px',
};

const contentStyle = {
  maxHeight: '450px',
};

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
const Networkmodal = ({ isVisible, onClose }) => {

  initTE({Tab})
  const [followers,setfollowers] =useState([])
  const [following,setfollowing] = useState([])
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)

  if (!isVisible) return null

  const handleClose = () => {
     onClose();
  };

  const closePostModal = () =>{
    setShowPostDetailModal(false)
  }

  const getNotificationMessage = (notification) => {
    const { notification_type , post , comment } = notification

    if (post) {
        if ( notification_type === 'comment' ){
            return 'commented on your post'
        } else if ( notification_type === 'like') {
            return 'liked on your post'
        } else if ( notification_type === 'post') {
            return 'created a new post'
        } else if ( notification_type === 'blocked') {
            return 'blocked your post'
        }
    } else if (comment) {
        if ( notification_type === 'comment') {
            return 'replied to your comment'
        }
    }
    return 'has started following you'
  }

  const onClick = async (notificationId , email , notificationType , postId) =>{
    try {
        await notificationSeenApi(notificationId)
        removeNotification(notificationId)
        onClose()
        if (notificationType === 'like' || notificationType === 'comment' || notificationType === 'post') {
            <PostDetailModal isVisible={showPostDetailModal} onClose={closePostModal} postID={postId} />
        } else if (notificationType === 'blocked' ) {
            console.log('blocked')
        } else {
            navigate(`/profile/${email}`)
        }
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div>
      <GlobalStyle />
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>

          <div className="overflow-auto scrollbar-ripe-malinka" style={contentStyle}>
            <CenteredTable>
              <MDBTable align='middle' style={{ borderWidth: '0px',marginTop:'-10px' }}>
                <MDBTableBody>
                    {notification && notification?.length > 0 ? (
                        notification.map((note,index) => (
                            <StyledTableRow >
                                <td key={index}>
                                    <p
                                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm public hover:bg-neutral-100 active:no-underline cursor-pointer"
                                        onClick={() => onClick(note.id, note.from_user.email, note.notification_type, note.post?.id )}
                                        data-te-dropdown-item-ref
                                    >
                                        {note.notification_type === "blocked"
                                            ? "Admin blocked you post"
                                            : `${note.from_user.first_name} ${note.from_user.last_name} ${getNotificationMessage(note)}`}
                                    </p>
                                </td>
                            </StyledTableRow>
                        ))
                    ):(
                        <p>No notifications</p>
                    )}

                </MDBTableBody>
              </MDBTable>
            </CenteredTable>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Networkmodal;
