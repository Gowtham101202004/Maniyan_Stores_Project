import React, { useEffect, useState } from 'react';
import './EditProfile.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Backdrop, CircularProgress, Modal, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar-edit';
import DefaultProfile from './default-profile.png';
import EditImg from './edit-img.png';
import SaveImg from './save-img.png';
import Edit from './edit.gif';
import Save from './save.gif';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phonenumber: '',
    image: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(''); 
  const [preview, setPreview] = useState(null); 
  const [isImageEditorVisible, setIsImageEditorVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = localStorage.getItem('userdata');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData?._id) {
          setIsLoading(true);
          try {
            const response = await axios.get(`http://localhost:8080/user/get-user/${parsedData._id}`);
            setUserData(response.data);
            setId(response.data._id);
            if (response.data.image) {
              setPreview(response.data.image);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    setIsSubmitting(true);
    try {
        const updatedData = { 
          ...userData, 
          image: preview || "" 
        };

        const response = await axios.put(
          `http://localhost:8080/user/update-user/${id}`, 
          updatedData, 
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setUserData(response.data);
        
        const storedData = localStorage.getItem('userdata');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          localStorage.setItem('userdata', JSON.stringify({
            ...parsedData,
            name: response.data.name,
            email: response.data.email,
            address: response.data.address,
            phonenumber: response.data.phonenumber,
            image: response.data.image
          }));
        }

        setIsEditable(false);
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEditMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationType(isEditable ? 'save' : 'edit');
    setTimeout(() => {
      setIsAnimating(false);
      isEditable ? handleProfileUpdate() : setIsEditable(true);
    }, 2000); 
  };

  const handleAvatarCrop = (croppedImage) => {
    setPreview(croppedImage);
  };

  const openImageEditor = () => {
    setIsImageEditorVisible(true);
  };

  const cancelImageEdit = () => {
    setIsImageEditorVisible(false);
    setPreview(userData.image || null);
  };

  const confirmImageEdit = () => {
    setIsImageEditorVisible(false);
    setUserData(prev => ({ ...prev, image: preview || "" }));
  };

  const removeProfileImage = () => {
    setPreview(null);
    setUserData((prevData) => ({ ...prevData, image: "" }));
    setIsImageEditorVisible(false);
  };

  const handleBackClick = () => navigate("/");

  return (
    <>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading || isSubmitting}>
            <CircularProgress sx={{ color: "rgb(255, 119, 0)" }}/>
        </Backdrop>
        <div className="whole-edit-profile-container">
            <form>
            <div className="profile-container">
                <div className="profile-title-container">
                    <button className="back-button" onClick={handleBackClick}>
                        <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft" />
                    </button>
                    <h2>Edit Profile</h2>
                    <div onClick={toggleEditMode} className='edit-icon-container' style={{ cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
                        {isAnimating ? (
                        animationType === 'edit' ? (
                            <img src={Edit} className='edit-anim-icon' alt="Editing..." />
                        ) : (
                            <img src={Save} className='save-anim-icon' alt="Saving..." />
                        )
                        ) : (
                        isEditable ? (
                            <img src={SaveImg} className='save-icon' alt="Save" />
                        ) : (
                            <img src={EditImg} className='edit-icon' alt="Edit" />
                        )
                        )}
                    </div>
                </div>

                <div className="profile-picture-section">
                  <div className="current-profile-picture">
                      <img 
                      src={preview || DefaultProfile} 
                      alt="Profile" 
                      className="profile-picture" 
                      onClick={isEditable ? openImageEditor : null} 
                      />
                  </div>
                </div>
                <Modal open={isImageEditorVisible} onClose={cancelImageEdit}>
                  <Box className="modal-box">
                      <div className="avatar-container">
                        <Avatar width={390} height={300} onCrop={handleAvatarCrop} src={userData.image || null} label="CHOOSE A FILE" />
                      </div>
                      <div className="image-editor-buttons">
                          <button onClick={removeProfileImage} className="remove">REMOVE</button>
                          <button onClick={cancelImageEdit} className="cancel">CANCEL</button>
                          <button onClick={confirmImageEdit} className="ok" disabled={!preview}>OK</button>
                      </div>
                  </Box>
                </Modal>

                <div className="profile-item">
                    <label className="label">Full name</label>
                    <input type="text" name="name" value={userData.name} onChange={handleChange} className="input-field" disabled={!isEditable} />
                </div>

                <div className="profile-item">
                    <label className="label">Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} className="input-field" disabled />
                </div>

                <div className="profile-item">
                    <label className="label">Phone number</label>
                    <input type="text" name="phonenumber" value={userData.phonenumber} onChange={handleChange} className="input-field" disabled={!isEditable} />
                </div>

                <div className="profile-item">
                    <label className="label">Address</label>
                    <input type="text" name="address" value={userData.address} onChange={handleChange} className="input-field" disabled={!isEditable} />
                </div>
            </div>
          </form>
      </div>
    </>
  );
};

export default EditProfile;