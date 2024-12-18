import { useState } from 'react';
import "./TermsOfService.css"
import ModalContainer from '../ModalContainer/ModalContainer';

const TermsOfService = ({ closeModal }) => {
  const lastUpdated = "December 18, 2024"

  return (
    <ModalContainer title={"Terms of Service"} showModal={true} hideHeader={true} fitcontent={true} mobileModal={true} closeModal={closeModal}>
      <div className="py-4">
        <h1 className="tos--title">Terms of Service</h1>
        <p>Last Updated {lastUpdated}</p>
        <p className="tos--content">
          By using this website, you agree to the following terms of service:
          <br />
          <br />
          1. You will not use this website for any illegal or unauthorized purpose.
          <br />
          2. You will not use this website to harass, threaten, or impersonate others.
          <br />
          3. You will not use this website to spam or distribute malware.
          <br />
          4. You will respect the privacy and personal information of other users.
          <br />
          5. You will not attempt to hack, exploit vulnerabilities, or otherwise interfere with the website’s operation.
          <br />
          6. You will comply with all applicable local, national, and international laws and regulations.
          <br />
          7. You acknowledge that the website owners may monitor your use of the website to ensure compliance with these terms.
          <br />
          8. You understand that your use of the website is at your own risk and that the website is provided "as is" without any warranties.
          <br />
          9. You agree to indemnify and hold harmless the website owners from any claims arising out of your use of the website.
          <br />
          10. You acknowledge that the website owners reserve the right to terminate your access to the website at any time for any reason.
          <br />
          11. You will not use this website to upload, post, or otherwise transmit any content that is offensive, harmful, or violates the rights of others.
          <br />
          12. You will not use this website to advertise or promote any products or services without prior authorization from the website owners.
          <br />
          <br />
          By continuing to use this website, you acknowledge that you have read and agree to these terms of service.
          <br />
          If you have any questions about these terms, please contact us.
        </p>

        <div className="d-flex justify-content-center">
          <button className="btn btn-danger" onClick={closeModal}> I&apos;ve read and will accept the Terms and Condition </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default TermsOfService;