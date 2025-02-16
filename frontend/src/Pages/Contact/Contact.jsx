import React, { useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import emailjs from '@emailjs/browser';
import './Contact.css'

function Contact() {
  const form = useRef();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("maniyanstores11@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_11in22d',
        'template_qfiiveg',
        form.current,
        '_cT6ER_78yVU_h6gP'
      )
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Email sent successfully!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send email. Please try again.');
        }
      );
  };

  return (
    <div>
      <Navbar />
      <div className="contact-container">
        <div className='contact-left'>
          <div className="contact-address">
            <i className='contact-icon'>
              <FontAwesomeIcon icon={faLocationDot} />
            </i>
            <p> 3/57, Kangayam Road, Uthukkuli R.S, Uthukuli Taluk, Tiruppur - 638752</p>
          </div>
          <div className="contact-mail">
            <i className="contact-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </i>
            <p 
              className="copy-email" 
              onClick={handleCopy} 
              title={copied ? "Copied!" : "Click to copy"}>
              maniyanstores11@gmail.com
            </p>
          </div>

          <div className="contact-map">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.2094024658654!2d77.3491801777247!3d11.09776546089203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907bfe83d4f77%3A0x761b138da737f59!2s357%2C%20Kangayam%20Rd%2C%20Aranmanai%20Pudur%2C%20Tiruppur%2C%20Tamil%20Nadu%20641604!5e0!3m2!1sen!2sin!4v1739376376976!5m2!1sen!2sin"
              className='contact-map-style'
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className='contact-right'>
          <form ref={form} onSubmit={sendEmail}>
            {/* Sender's Name */}
            <div className="inputBox">
              <input type="text" id="from_name" name="from_name" required />
              <span>Name</span>
              <i></i>
            </div>
            
            {/* Sender's Email */}
            <div className="inputBox">
              <input type="email" id="user_email" name="user_email" required />
              <span>Email</span>
              <i></i>
            </div>

            {/* Message */}
            <div className="contact-message">
              <textarea id="message" name="message"  placeholder='Message' required />
            </div>

            {/* Button */}
            <div className="contact-message">
              <input className="send-button" type="submit" value="Send" />
            </div>
            
          </form>
        </div>
      </div>
      <div className='contact-whatsapp'>
        <FontAwesomeIcon className='whatsapp-icon' icon={faWhatsapp} />
        <p>+91 1234567890</p>
      </div>
    </div>
  );
}

export default Contact;
