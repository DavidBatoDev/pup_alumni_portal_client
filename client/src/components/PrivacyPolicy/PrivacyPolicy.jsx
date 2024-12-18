import React from "react";
import "./PrivacyPolicy.css"
import ModalContainer from "../ModalContainer/ModalContainer";

const PrivacyPolicy = ({ closeModal }) => {
  const lastUpdate = "December 18, 2024"

  return (
    <ModalContainer title={"Privacy Policy"}
      showModal={true}
      fitcontent={true}
      mobileModal={true}
      hideHeader={true}
      closeModal={closeModal}
    >

      <div className="py-4">
        <h1 className="privacy--title">Privacy Policy</h1>
        <p>Last Updated {lastUpdate}</p>
        <p className="privacy--content">
          Welcome to the PUP ReConnect Alumni Portal. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform.
          <br />
          <br />
          1. <strong>Information Collection:</strong> We collect personal information that you voluntarily provide to us when you register on the portal, update your profile, participate in discussions, and engage in other activities on the platform. This may include your name, email address, graduation year, and other relevant details.
          <br />
          <br />
          2. <strong>Use of Information:</strong> The information we collect is used to facilitate your participation in the alumni network, enhance your experience on the portal, and communicate with you about events, surveys, and other alumni activities. Additionally, the information is used for conducting a tracer study to track the career progress and achievements of our alumni. All information gathered through surveys is part of our data gathering process and is collected with your consent, as explained in the Data Subject Consent Form under survey &quot;Development of Alumni Engagement Portal System for Tracer Studies&quot;, in compliance with the Data Privacy Act of 2012.
          <br />
          <br />
          3. <strong>Information Sharing:</strong> We do not share your personal information with third parties without your consent, except as required by law or to protect the rights and safety of our users and the portal.
          <br />
          <br />
          4. <strong>Data Security:</strong> We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
          <br />
          <br />
          5. <strong>Your Rights:</strong> You have the right to access, update, and delete your personal information at any time. You can do this through your profile settings or by contacting us at support@example.com.
          <br />
          <br />
          6. <strong>Changes to This Policy:</strong> We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on the portal and updating the effective date at the top of this document.
          <br />
          <br />
          By using the PUP ReConnect Alumni Portal, you agree to the terms of this Privacy Policy. If you have any questions or concerns about our privacy practices, please contact us at support@example.com.
        </p>
        <br />
        <div className="d-flex justify-content-center">
          <button className="btn btn-danger" onClick={closeModal}> I&apos;ve read and will accept the Privacy Policy Statement </button>
        </div>
      </div>
    </ModalContainer >
  )
};


export default PrivacyPolicy;