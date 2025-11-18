import { useState, useEffect } from "react";
import { Row, Col, Image, Spin } from "antd";
import Logo from "../../assets/img/Logo.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import { useNavigate } from "react-router-dom";
import { SignUp } from "./RouteConst";

const TermsandConditions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading ? (
        <div className="spin-overlay">
          <Spin size="large" className="mainloader"/>
        </div>
      ) : (
      <div className="terms-and-conditions container">
        <div className="d-flex justify-content-between align-items-center mt-4 ">
          <Image preview={false} src={Logo} className="sessionlogo" />
        </div>
        <div className="mt-5 heading-main-sub d-flex">
          <Image
            src={LeftArrow}
            alt="back"
            height={40}
            width={40}
            preview={false}
            className="mt-2 cursor"
            onClick={() => {
              navigate(SignUp);
            }}
          />
          <h1 className="mt-2 mx-4 mb-5"> General Terms and conditions</h1>
        </div>

        <Row gutter={16}>
          {/* <Col md={8}>
            <Anchor>
              <Link href="#General" title="1. General" />
              <Link href="#Eligibility" title="2. Eligibility" />
              <Link href="#Acceptance-Terms" title="3. Acceptance Of Terms" />
              <Link href="#Amendments" title="4. Amendments" />
              <Link href="#Submitting-Data" title="5. Submitting Of Data" />
              <Link href="#Compliance" title="6. Compliance With The Terms And ..." />
              <Link href="#Data-Collection" title="7. Data Collection" />
              <Link href="#Account" title="8. Account" />
              <Link href="#Closing-Account" title="9. Closing An Account" />
              <Link href="#Digital-Escrow-Service" title="10. Digital Escrow Service" />
              <Link href="#Trustin-Trade" title="11. TrustIn" />
              <Link href="#Internet-Access" title="12. Internet Access" />
              <Link href="#Restricted-Activities" title="13. Restricted Activities" />
              <Link href="#Transmissions-And-Communications" title="14. Transmissions And Communications" />
              <Link href="#Records" title="15. Records" />
              <Link href="#Responsibility" title="16. Responsibility For Loss Or Damage" />
              <Link href="#Termination" title="17. Termination" />
              <Link href="#Information-Security" title="18. Information Security And" />
              <Link href="#Limitation-Of-Liability " title="19. Limitation Of Liability " />
              <Link href="#Indemnity" title="20. Indemnity" />
              <Link href="#Notices" title="21. Notices" />
              <Link href="#Assignment" title="22. Assignment" />
              <Link href="#Severability" title="23. Severability" />
              <Link href="#Waiver" title="24. Waiver" />
              <Link href="#Translation" title="26. Translation" />
              <Link href="#Rights-Third" title="26. Rights Of Third Parties " />
              <Link href="#Governing-Jurisdiction" title="27. Governing Law And Jurisdiction" />
            </Anchor>
          </Col> */}

          <Col md={24} className="mt-2">
            <div className=" ">
              <div id="General">
                <h2 className="">1. General</h2>
                <p>
                  1. This document (“General Terms and Conditions” or “Terms”)
                  is an agreement between you and TrustIn Limited. (License No
                  XXXXXX) (“Company”) which set outs the term and conditions
                  governing your use and access of:
                </p>

                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) the electronic platform that is owned and operated by
                      the Company (“TrustIn”); and
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b)the products and services offered by the Company and
                      third parties engaged by, or in partnership with, the
                      Company through TrustIn (“Services”).
                    </p>
                  </li>
                </ul>
                <p>
                  2. The fees applicable to you (if any) for the use of TrustIn
                  Trade and/or the Services shall be communicated to you through
                  TrustIn or through such other means as the Company may
                  prescribe from time to time (“Fees”) and the Fees are strictly
                  non-refundable unless stated otherwise by the Company.
                </p>
                <p>
                  3. The version of the Terms currently in force will be
                  available through TrustIn and on the official website of
                  the Company at
                  {/* <a href='https://Trustintrade.ae'>Trustintrade.ae</a> */}
                  and you agree that it shall be your sole responsibility to
                  check for any updates to the Terms. For any other information
                  or support, please contact us:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>(a) Email: care@trustin.ae</p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) Post: TrustIn Limited, XXXXXX, XXX, United Arab
                      Emirate.
                    </p>
                  </li>
                </ul>
                <p>
                  4.In interpreting the Terms, the intention and purpose behind
                  the specific paragraph or paragraphs must be taken into
                  consideration.
                </p>
                <p>5.The Terms shall be of a continuing nature.</p>
              </div>

              <div id="Eligibility">
                <h2 className="mt-5">2. Eligibility</h2>
                <p>
                  1. To be eligible to use TrustIn and/or the Services,
                  you must:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) in the case of an individual:
                      <ul>
                        <li data-list-text="▪">
                          <p>
                            have attained at least 18 years of age at the time
                            of accessing and/or using TrustIn and/or the
                            Services; and
                          </p>
                        </li>
                        <li data-list-text="▪">
                          <p>
                            have the legal capacity to accept the Terms under
                            the laws applicable to you; or
                          </p>
                        </li>
                      </ul>
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) in the case of a legal entity other than an
                      individual, have the full legal capacity (including
                      obtaining the necessary approvals) to accept the Terms.
                      <br /> (each an “Eligible User”).
                    </p>
                  </li>
                </ul>
                <p>
                  2. By accessing and/or using TrustIn, you are
                  representing and warranting to the Company that you are an
                  Eligible User.
                </p>
                <p>
                  3. Despite being an Eligible User, the Company reserves the
                  right to limit your access and/or use of TrustIn and/or
                  the Services in accordance with the Terms at the sole
                  discretion of the Company.
                </p>
              </div>

              <div id="Acceptance-Terms">
                <h2 className="mt-5">3. Acceptance Of Terms</h2>
                <p>
                  1. By accessing and/or using TrustIn, you expressly
                  acknowledge and represent that you have carefully read,
                  understood and accepted the Terms in its entirety as a legally
                  binding agreement between yourself and the Company.
                </p>
                <p>
                  2. You should immediately stop accessing and/or using TrustIn
                  Trade if you do not accept the Terms.
                </p>
              </div>

              <div id="Amendments">
                <h2 className="mt-5">4. Amendments To The Terms</h2>
                <p>
                  1. The Company may, from time to time, amend, restate or
                  supplement the Terms (including the Fees) at the sole
                  discretion of the Company, including to take into account
                  future developments such as change in industry trends and/or
                  any changes in legal and/or regulatory requirements applicable
                  to the Company.
                </p>
                <p>
                  2. Any amendment, restatement or supplement to the Terms shall
                  be available through TrustIn and on the Website and,
                  unless stated otherwise, shall be effective and binding on you
                  upon publication or at such time as may be prescribed by the
                  Company.
                </p>
                <p>
                  3. You agree that the publication of any amendment,
                  restatement or supplement to the Terms through TrustIn
                  and on the Website shall be sufficient notice to you and that
                  your continued access and/or use of TrustIn and/or the
                  Services after such amendment shall constitute your acceptance
                  of such amendment, restatement or supplement to the Terms.
                </p>
              </div>

              <div id="Submitting-Data">
                <h2 className="mt-5">5. Submitting Of Data</h2>
                <p>
                  1. It shall be your sole responsibility to ensure that any
                  data, document or other information, whether electronic
                  otherwise, that you submit to the Company (whether through
                  TrustIn or otherwise):
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) is complete, true and accurate in all respects at all
                      times;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) where applicable, is provided within reasonable time;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) is not false, misleading or deceptive in any respect
                      at all times; and
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) does not omit anything that affects or is likely to
                      affect the meaning or significance of such data, document
                      or other information in any respect at all times.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Compliance">
                <h2 className="mt-5">
                  6. Compliance With The Terms And Applicable Laws
                </h2>
                <p>
                  1. In accessing and/or using TrustIn and/or the
                  Services, you agree that it is your sole responsibility to
                  ensure your compliance with the following at all times:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) is complete, true and accurate in all respects at all
                      times;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>(a) the Terms; and</p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) all applicable laws and regulations (whether in or out
                      of United Arab Emirate).
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Data-Collection">
                <h2 className="mt-5">7. Data Collection</h2>
                <p>
                  1. In order to access and/or use the Services, you may be
                  asked to create a TrustIn account with the Company
                  (“Account”) and in registering for an account, you may be
                  required to provide us with data relating to you (including
                  personal data as defined under the Personal Data Protection
                  Act 2012 of United Arab Emirate), including:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>(a) your full legal name;</p>
                  </li>
                  <li data-list-text="▪">
                    <p>(b) date of birth/incorporation;</p>
                  </li>
                  <li data-list-text="▪">
                    <p>(c) residential/registered address.</p>
                  </li>
                  <li data-list-text="▪">
                    <p>(d) in the case of individuals, your nationality;</p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) Trade License No , EID or passport number (in the case
                      of individuals) or unique entity number (in the case of
                      entities);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (f) contact details, including an email address and
                      telephone number at which you can be contacted at;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (g) other information as may be required to verify your
                      identity, the identity of the legal entity that you
                      represent, and all data provided by you to us; and
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (h) other information as may be required to allow the
                      Company to comply with all legal and regulatory
                      obligations under the applicable laws.
                    </p>
                  </li>
                </ul>
                <p>
                  2. “Personal data” is defined under the Personal Data
                  Protection Act 2012 of United Arab Emirate as data, whether
                  true or not, about an individual who can be identified:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>(a) from that data; or</p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) from that data and other information to which the
                      organisation has or is likely to have access.
                    </p>
                  </li>
                </ul>
                <p>
                  3. Please refer to the Privacy Policy of the Company which is
                  available at https://TrustinTrade.ae/legal/ for details on how
                  the Company collects, uses, stores and protects personal data
                  that the Company comes into possession of. The provisions of
                  our Privacy Policy are deemed incorporated into these Terms.
                </p>
                <p>
                  4. You must not open an Account or otherwise access and/or use
                  TrustIn and/or the Services (whether in part or in
                  whole) unless you consent to the collection, use and
                  disclosure of personal data by the Company as set out in the
                  Privacy Policy.
                </p>
                <p>
                  5. Your opening of an Account, access and/or use of TrustIn
                  Trade and/or the Services (whether in part or in whole), shall
                  constitute your acknowledgement and acceptance of the Privacy
                  Policy and your consent to the collection, use and disclosure
                  of personal data by the Company in accordance therewith.
                </p>
                <p>
                  6. The Company reserves the right to request for further
                  information from you relating to your Account (whether active
                  or inactive) at any time and you agree to promptly respond to
                  any such request for further information.
                </p>
              </div>

              <div id="Account">
                <h2 className="mt-5">8. Account</h2>
                <h3>General</h3>
                <p>
                  1. You may apply for an Account by following the relevant
                  instructions on the Website.
                </p>
                <p>
                  2. Where the Company approves your application for an Account
                  for TrustIn, the Company will issue you an Account and
                  access will be granted to your authorised representatives that
                  have been approved (each such authorised representative a
                  “Registered User”).
                </p>
                <h3>Responsibility for your Account</h3>
                <p>
                  3. Your Account can only be used by you and/or your Registered
                  User(s) (as the case may be) and you acknowledge and agree
                  that you shall be fully liable at all times for any
                  communication, transaction, instruction and/or operation made
                  or performed, processed or effected through your Account (each
                  an “Instruction”) by you or any person purporting to be you,
                  acting on your behalf or purportedly acting on your behalf,
                  with or without your consent.
                </p>
                <p>
                  4. You must immediately notify the Company if you suspect or
                  become aware of the use of your Account by any person other
                  than yourself and/or your Registered User(s).
                </p>
                <p>
                  5. Without prejudice to any other provision of the Terms, you
                  authorise the Company to act upon any Instruction (though the
                  Company is not obliged to) which the Company believes was
                  given by you (whether through your Registered User(s) or
                  otherwise).
                </p>
                <p>
                  6. Any Instruction shall not be considered to have been
                  received by the Company until it has actually been received
                  successfully by the Company (whether electronically or
                  otherwise).
                </p>
                <p>
                  7. The Company shall not be responsible for confirming and/or
                  verifying any Instruction or for monitoring or refusing to
                  process any duplicate Instructions.
                </p>
                <p>
                  You acknowledge and agree that any records created and
                  maintained by the Company of Instructions by you or any person
                  purporting to be you, acting on your behalf or purportedly
                  acting on your behalf, with or without your consent, shall be
                  binding on you for all purposes and shall be conclusive
                  evidence of such Instructions.
                </p>
                <p>
                  You acknowledge and agree that any records created and
                  maintained by the Company of Instructions by you or any person
                  purporting to be you, acting on your behalf or purportedly
                  acting on your behalf, with or without your consent, shall be
                  binding on you for all purposes and shall be conclusive
                  evidence of such Instructions.
                </p>
                <h3>Investigations</h3>
                <p>
                  10. The Company shall have the absolute discretion to
                  investigate your Account, including where the Company suspects
                  or has determined that:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) you and/or your Registered User(s) are in breach of
                      any the Terms (or any part thereof);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) you and/or your Registered User(s) and/or your Account
                      is/are associated with any unusual or illegal activities,
                      including any form of fraud;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) you and/or your Account is/are related to any pending
                      litigation or investigation proceedings by any authority
                      (whether in or out of United Arab Emirate), including any
                      applicable regulatory authority;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) there are security risks associated with your Account
                      that cannot be or have not been adequately mitigated or
                      resolved;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) you and/or the operation of your Account is in breach
                      of any applicable laws or regulations (whether in or out
                      of United Arab Emirate);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (f) there is any other reason which could compromise the
                      provision of TrustIn and/or the Services by the
                      Company or any other operations of the Company
                    </p>
                  </li>
                </ul>
                <p>
                  11. In the event the Company commences any investigation into
                  your Account, the Company shall provide you with written
                  notice of the commencement of such investigation and the
                  nature of the allegations that form the basis of the
                  investigation and you shall have 7 calendar days to respond to
                  such allegations, provided always that the Company may take
                  any action it deems necessary at its sole discretion even
                  before such written notice is received by you.
                </p>
                <h3>Right to suspend or terminate an Account</h3>
                <p>
                  12. The Company reserves the right to take any action that the
                  Company deems necessary at its sole discretion at any time,
                  including the suspension or termination of your Account and/or
                  access and/or use of the Services, whether in whole or in
                  part, if the Company has reasonable grounds to believe that
                  any of the events set out in Investigations section above has
                  occurred.
                </p>
                <h3>Inactive Account</h3>
                <p>
                  13. The Company has the right to suspend and review your
                  Account if it is not accessed and/or used for a continuous
                  period of [6 months] (“Inactive Account”).
                </p>
                <p>
                  14. Following the review, where the Company deems your Account
                  to be an Inactive Account, the Company will notify you of the
                  same through such means of communication as the Company may
                  prescribe from time to time (“Notice of Inactivity”).
                </p>
                <p>
                  15. If you do not respond within the period stipulated in the
                  Notice of Inactivity, a monthly fee may be charged in relation
                  to each Inactive Account for as long as it remains inactive
                  starting the day immediately following the end of the 6 months
                  stated above.
                </p>
                <p>
                  16. In addition to charging the monthly fee, the Company may
                  take any other action it deems necessary at its sole
                  discretion in relation to any Inactive Account, including
                  terminating such Inactive Account.
                </p>
                <p>
                  17. You may request to reactivate your Inactive Account by
                  filing a request with the Company and the Company may require
                  you to provide such information and/or documents as the
                  Company deems necessary before deciding on whether to
                  reactivate your Inactive Account.
                </p>
              </div>

              <div id="Closing-Account">
                <h2 className="mt-5">9. Closing An Account</h2>
                <p>
                  1. You may close your Account by following the instructions on
                  TrustIn.
                </p>
                <p>
                  2. Notwithstanding anything in the Terms, you cannot close
                  your Account while there is any outstanding escrow transaction
                  in relation to your Account.
                </p>
                <p>
                  3. Where you attempt to close your Account that is the subject
                  of an investigation under paragraph 11 above, the Company may,
                  at its sole discretion, refuse to close the Account.
                </p>
                <p>
                  For the avoidance of doubt, where you close your Account that
                  is the subject of an investigation, you shall remain liable
                  for all obligations arising from or in connection with such
                  Account until the conclusion of the investigation and where
                  all necessary actions have been taken by the Company (if any).
                </p>
              </div>

              <div id="Digital-Escrow-Service">
                <h2 className="mt-5">10. Digital Escrow Service</h2>
                <p>
                  1. You and/or your Registered User(s) (where applicable) may
                  use the digital escrow service (“Escrow Service”) available on
                  TrustIn to process payment for sale (or purchase) of
                  goods and services.
                </p>
                <p>
                  2. For more details about Escrow Service, visit Escrow Service
                  Terms and Condition
                </p>
              </div>

              <div id="Trustin-Trade">
                <h2 className="mt-5">11. TrustIn</h2>
                <p>
                  1. TrustIn and the Services and all content contained
                  therein (except for data belonging to you), including any
                  data, images, links, sounds, graphics, video, software,
                  applications and other digital materials (“Platform
                  Materials”) are the property of the Company.
                </p>
                <p>
                  2. TrustIn and the Services are provided on an “as is”
                  and “as available” basis and may be modified, suspended or
                  discontinued (whether in part or in whole) from time to time
                  at the sole discretion of the Company. Neither the Company nor
                  any Relevant Persons make any representation or warranty about
                  TrustIn and the Services, or their reliability,
                  availability, or ability to meet your requirements.
                </p>
                <h3>No Representations and Warranties by the Company</h3>
                <p>
                  3. Without prejudice to the generality of the foregoing,
                  TrustIn and the Services are provided by the Company
                  without any representation and/or warranty by the Company,
                  whether express or implied, including any representation
                  and/or warranty that:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) TrustIn will be provided uninterrupted, secure
                      and/or free from any error and/or omission and that any
                      identified defects will be corrected;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) TrustIn is fit for any particular purpose or
                      requirements of any person;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) any data transmitted by you or to you through TrustIn
                      Trade is secure, including the possibility of such data
                      transmission being intercepted;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) there will be no delay and/or interruption to any
                      transmission of data through TrustIn.
                    </p>
                  </li>{" "}
                </ul>
                <p>
                  4. While the Company will take measures to ensure the
                  continuous operations and security of TrustIn and the
                  Service, the Company does not guarantee and/or represent in
                  any way that such measures will be sufficient.
                </p>
                <p>
                  5. The Company controls and maintains TrustIn and the
                  Services from United Arab Emirate and makes no representation
                  that TrustIn is appropriate and/or available for access
                  and/or use outside of United Arab Emirate.
                </p>
              </div>

              <div id="Internet-Access">
                <h2 className="mt-5">12. Internet Access</h2>
                <p>
                  1. You agree and acknowledge that the Terms, TrustIn,
                  the Services and the Platform Materials do not include the
                  provision of internet access or other telecommunication
                  services by the Company.
                </p>
                <p>
                  2. Any internet access or telecommunications services (such as
                  mobile data connectivity) required by you to access to and/or
                  use TrustIn and/or the Services and/or the Platform
                  Materials shall be your sole responsibility and shall be
                  separately obtained by you, at your own cost.
                </p>
              </div>

              <div id="Restricted-Activities">
                <h2 className="mt-5">13. Restricted Activities</h2>
                <p>
                  1. You agree and undertake not to do any one or more of the
                  following:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) use or upload, in any way, any software or material
                      that contains, or which you have reason to suspect
                      contains, computer virus or other malicious, destructive
                      or corrupting code, agent, program or macros (including
                      those which may impair or corrupt the Platform Materials
                      or damage or interfere with the operation of any
                      electronic device of any other user or TrustIn);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) post, promote or transmit any materials or information
                      through TrustIn which are or may be illegal,
                      misleading, incomplete, erroneous, offensive, indecent,
                      defamatory or which may not be lawfully disseminated under
                      applicable laws or which are otherwise objectionable;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) use TrustIn and/or any of the Services other
                      than in conformance with the acceptable use policies of
                      any connected computer networks, any applicable internet
                      standards and any other applicable laws;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) use TrustIn and/or any of the Services for any
                      illicit activities;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) impersonate any person or entity or to falsely state
                      or otherwise misrepresent your affiliation with any person
                      or entity;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (f) anything which will amount to a contravention of the
                      Terms and/or any applicable laws and regulations.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Transmissions-And-Communications">
                <h2 className="mt-5">14. Transmissions And Communications</h2>
                <p>
                  1. With respect to all contents of transmissions or
                  communications you make or submit through the TrustIn,
                  the Company shall be free to reproduce, use, disclose, host,
                  publish, transmit and distribute all such contents of
                  transmissions or communications or any part thereof to others
                  without limitations, and you hereby grant to TrustIn and
                  its agents (if any), a non-exclusive, world-wide,
                  royalty-free, irrevocable licence and right to do the same.
                </p>
                <p>
                  2. You accept the risk that any data transmitted or
                  communicated through TrustIn may be accessed by
                  unauthorised third parties and that the transmission of data
                  or communications over the internet may be subject to
                  interruption, transmission blackout, delayed transmission due
                  to internet traffic or incorrect data transmission due to the
                  public nature of the internet.
                </p>
              </div>

              <div id="Records">
                <h2 className="mt-5">15. Records</h2>
                <p>
                  1. You acknowledge and agree that any records created and
                  maintained by the Company of the communications, transactions,
                  instructions and/or operations made or performed, processed or
                  effected through TrustIn by you or any person purporting
                  to be you, acting on your behalf or purportedly acting on your
                  behalf, with or without your consent, shall be binding on you
                  for all purposes and shall be conclusive evidence of such
                  communications, transactions, instructions and/or operations.
                </p>
              </div>

              <div id="Responsibility">
                <h2 className="mt-5">16. Responsibility For Loss Or Damage</h2>
                <p>
                  1. The Company makes no representation and/or warranty as to
                  having reviewed and/or verified the relevance, timeliness,
                  accuracy, adequacy, commercial value, completeness or
                  reliability of any systems, services, content, materials,
                  products and/or programmes provided and/or offered by third
                  parties through TrustIn.
                </p>
                <p>2. Unless expressly stated otherwise, the Company:</p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) does not endorse, sponsor and/or certify any systems,
                      services, content, materials, products and/or programmes
                      provided and/or offered by third parties through TrustIn
                      Trade; and
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) is not involved in the provision of such systems,
                      services, content, materials, products and/or programmes
                      provided and/or offered by third parties through TrustIn
                      Trade.
                    </p>
                  </li>
                </ul>
                <p>
                  3. Unless expressly provided for, the Company is not a party
                  to any agreement between you and any third-party (whether
                  provided and/or offered through TrustIn) relating to
                  your access to and/or use of systems, services, content,
                  materials, products and/or programmes provided and/or offered
                  by such third-party through TrustIn (“Third-Party
                  Agreement”).
                </p>
                <p>
                  4. For the avoidance of doubt, neither the Company nor any
                  Relevant Person shall be liable for any losses, liabilities,
                  damages, costs and/or expenses (including any direct,
                  indirect, incidental, special, consequential or punitive
                  damages or economic loss or any claims for loss of profits or
                  loss of use) (collectively “Losses”), howsoever caused or
                  arising (including without limitation, cyber attacks), arising
                  from or in connection with your access to the Services and/or
                  use of systems, services, content, materials, products or
                  programmes under any Third-Party Agreement, or for any
                  purchase and/or subscription made in relation thereto.
                </p>
                <p>
                  5. We have no control over websites linked to and from our
                  Website and assume no responsibility for their content or any
                  loss or damage that may arise from your use of them. You
                  acknowledge and agree that you will be solely responsible for
                  any access to and/or use of the Services, any third- party
                  systems, services, content, materials, products or programmes
                  provided and/or offered through TrustIn.
                </p>
              </div>

              <div id="Termination">
                <h2 className="mt-5">17. Termination </h2>
                <p>
                  1. You agree that the Company may, at its sole discretion,
                  deny you access to TrustIn (or any part thereof) and/or
                  the Platform Materials (whether in part or in whole) for any
                  reason, including where:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) the Company believes that you have violated or acted
                      inconsistently with any terms or conditions set out
                      herein;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) the Company and/or any regulatory authority (including
                      the ADGM or any Regulatory Authority of United Arab
                      Emirate) is of the opinion that it is not suitable to
                      continue providing the services relating to TrustIn
                      and/or the Platform Materials, whether generally or
                      specifically to you.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Information-Security">
                <h2 className="mt-5">
                  18. Information Security And Intellectual Property{" "}
                </h2>
                <p>
                  1. The Company and its licensor(s) (if any) reserves and
                  retains all rights (including copyrights, trademarks, patents
                  as well as any other intellectual property right) in relation
                  to the products, services and all content and data contained
                  in or provided on or via TrustIn and/or the Platform
                  Materials (including all texts, graphics and logos). You shall
                  not do anything that will violate or infringe such
                  intellectual property rights.
                </p>
                <p>2. You shall not:</p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) copy, download, publish, distribute, transmit,
                      disseminate, sell, broadcast, circulate, exploit (whether
                      for commercial benefit or otherwise) or reproduce any of
                      the information or content contained in or provided on or
                      via TrustIn and/or the Platform Materials in any
                      form without the prior written permission of the Company
                      and/or its licensor(s) (as the case may be);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) modify, copy, tamper with or otherwise create
                      derivative works of any software included in the Platform
                      Materials;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) reverse engineer, disassemble, or decompile the
                      Platform Materials or the Services or apply any other
                      process or procedure to derive the source code of any
                      software included in the Platform Materials or as part of
                      the Services;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) remove, obscure, or alter any notice of any of our
                      trade marks, or other intellectual property appearing on
                      or contained within the Services and/or on any Platform
                      Materials;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) misuse TrustIn or our Services by introducing
                      viruses, trojans, worms, logic bombs or other material
                      which is harmful;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (f) attempt to gain unauthorised access to TrustIn,
                      or our servers, computers or databases, attack TrustIn
                      Trade via a denial- of-service attack or distributed
                      denial-of-service attack.
                    </p>
                  </li>
                </ul>
                <p>
                  3. Subject to paragraph 86 below?, No part or parts of TrustIn
                  Trade and/or any Platform Materials may be reproduced,
                  distributed, republished, displayed, broadcast, hyperlinked,
                  mirrored, framed, transferred or transmitted in any manner or
                  by any means or stored in an information retrieval system
                  without the prior written permission of the Company and/or its
                  licensor(s) (as the case may be).
                </p>
                <p>
                  4. Subject to any other applicable terms, guidelines, notices,
                  rules and policies, the Company grants you a non-transferable,
                  non-exclusive, revocable, limited licence to use and access
                  TrustIn and the Platform Materials solely for your own
                  personal, informational and non- commercial use, provided that
                  you do not modify any Platform Materials and that you retain
                  all copyright and other proprietary notices contained in the
                  Platform Materials.
                </p>
                <p>
                  5. Save as expressly provided otherwise in the Terms, you
                  acknowledge that you are not granted any licence, interest or
                  right by virtue of your use of or access to TrustIn
                  and/or the Platform Materials.
                </p>
              </div>

              <div id="Limitation-Of-Liability">
                <h2 className="mt-5">19. Limitation Of Liability </h2>
                <p>
                  1. No director, officer, employee, agent or representative of
                  the Company (each a “Relevant Person”) shall, save for any
                  wilful default or fraud on the part of the Relevant Person, be
                  liable to you for any Losses arising from or in connection
                  with, or anything done or not done as a direct or indirect
                  consequence to, the provision of TrustIn and/or the
                  Services (whether in whole or in part), including any one or
                  more of the following:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) any failure, error, delay or malfunction of TrustIn
                      Trade, howsoever caused and whether or not identified or
                      identifiable;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) the access to, use of or inability to use TrustIn
                      Trade;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) the access to, use of or inability to use any
                      third-party services that may be accessed through or used
                      on TrustIn;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) any thing done or omitted to be done in the course of,
                      or in connection with the discharge or purported discharge
                      of the obligations and/or rights of the Company under any
                      applicable laws and regulations or in accordance with the
                      Terms;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) the exercise of the discretion of the Company under
                      the Terms;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (f) any failure, error, delay or malfunction of the
                      provision of any services (whether in whole or in part) by
                      any service provider engaged by the Company;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (g) the termination of the services (whether in whole or
                      in part) provided by any service provider engaged by the
                      Company (whether in whole or in part and whether at the
                      election of such service provider or otherwise) that
                      allows the Company to provide TrustIn and/or the
                      Services;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (h) any virus or other disruptive, destructive, malicious
                      or corrupting program, code, agent, script or macro;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (i) any loss of data and/or corruption of any data that is
                      a result of any means other than those in sub-paragraph
                      (h) above.
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (j) the originality, accuracy, adequacy, timeliness or
                      completeness of TrustIn and/or any Platform
                      Materials (collectively, the “Content”);
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (k) any reliance by you on the Content or any part
                      thereof;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (l) any information transmitted or received through
                      TrustIn, or the interception of or access to such
                      information by any unauthorised person;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (m) any event, occurrence, or circumstance beyond the
                      reasonable control of the Company, including any act of
                      God, civil commotion, riot, act of war or terrorism,
                      strike, government action, accident or equipment or
                      transmission failure;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (n) the provision of TrustIn and/or the Services.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Indemnity">
                <h2 className="mt-5"> 20. Indemnity</h2>
                <p>
                  1. You expressly agree to indemnify, defend, save and hold
                  harmless the Company and all Relevant Persons from all
                  liabilities, claims and Losses arising out of or in connection
                  with:
                </p>
                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) your Account and/or the suspension or termination
                      thereof by the Company in exercising its rights under
                      these Terms and Conditions;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) the access and use of TrustIn and the Services;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) any services provided by third-party service providers
                      engaged by the Company;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) any breach by you of these Terms or any applicable
                      laws or regulations;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (e) any wrongful, negligent act and/or omission by you in
                      connection with TrustIn and/or the Terms; other than
                      through the wilful default or fraud by the Relevant
                      Person.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Notices">
                <h2 className="mt-5">21. Notices </h2>
                <p>
                  1. You acknowledge and agree that any communication and/or
                  document to be sent to you may be by way of electronic
                  communication and you shall be considered to have received any
                  such communication and/or document:
                </p>

                <ul>
                  <li data-list-text="▪">
                    <p>
                      (a) at the time of posting of such communication to our
                      Website at https://TrustinTrade.ae/ and/or TrustIn
                      or such other time as may be prescribed in such
                      communication;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (b) at the time of which the email containing such
                      communication and/or document is sent to you or such other
                      time as may be prescribed in the email;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (c) at the time of posting (whether through ordinary post
                      or otherwise) such communication and/or document to you or
                      such other time as may be prescribed in such communication
                      and/or document;
                    </p>
                  </li>
                  <li data-list-text="▪">
                    <p>
                      (d) through such other means at such times as the Company
                      may prescribe from time to time.
                    </p>
                  </li>
                </ul>
              </div>

              <div id="Assignment">
                <h2 className="mt-5">22. Assignment </h2>
                <p>
                  1. The Company may, at any time, assign, mortgage, charge or
                  otherwise transfer any or all of our rights and obligations
                  under the Terms without restriction.
                </p>
                <p>
                  2. You may not assign, mortgage, charge or otherwise transfer
                  any of your rights and obligations under the Terms (including
                  the licence granted to you under the Terms) without the prior
                  written consent of the Company and any attempted assignment
                  mortgage, charge or otherwise transfer in violation of the
                  Terms shall be null and void.
                </p>
              </div>

              <div id="Severability">
                <h2 className="mt-5">23. Severability </h2>
                <p>
                  1. If any provision of the Terms or part thereof is rendered
                  void, invalid, illegal or unenforceable by any legislation to
                  which it is subject or by a decision of a court of competent
                  jurisdiction (“Affected Provision”), the Affected Provision
                  shall be rendered void, invalid, illegal or unenforceable only
                  to that extent and it shall in no way affect or prejudice the
                  enforceability of the remainder of the Affected Provision or
                  the other provisions of the Terms.
                </p>
              </div>

              <div id="Waiver">
                <h2 className="mt-5">24. Waiver </h2>
                <p>
                  1. No failure or delay to exercise or enforce any right
                  conferred upon the Company under the Terms shall be deemed to
                  be a waiver of any such rights or operate so as to bar the
                  exercise or enforcement thereof at any subsequent time or
                  times.
                </p>
                <p>
                  2. Any waiver of any right arising from a breach or
                  non-performance of the Terms or arising upon default under the
                  Terms granted to you shall be null and void unless made in
                  writing and signed by the Company.
                </p>
              </div>

              <div id="Translation">
                <h2 className="mt-5">25. Translation </h2>
                <p>
                  1. If the Terms are translated into a language other than the
                  English language and there is any conflict or inconsistency
                  between such translation and the English text, the English
                  text shall prevail.
                </p>
              </div>

              <div id="Rights-Third">
                <h2 className="mt-5">26. Rights Of Third Parties </h2>
                <p>
                  1. Save for a Relevant Person(s), no person or entity who is
                  not a party to the Terms shall have no right under the
                  Contracts (Rights of Third Parties) Act (Cap. 53B) of United
                  Arab Emirate or other similar laws to enforce the Terms or any
                  part thereof, regardless of whether such person or entity has
                  been identified by name, as a member of a class or as
                  answering a particular description.
                </p>
                <p>
                  2. For the avoidance of doubt, any amendments to the Terms in
                  accordance with the provisions herein shall not require any
                  consent from any person or entity (including any Relevant
                  Person) who is not a party to the Terms.
                </p>
                <p>
                  3. Nothing in paragraph above shall affect the rights of any
                  permitted assignee or transferee under the Terms
                </p>
              </div>

              <div id="Governing-Jurisdiction">
                <h2 className="mt-5">27. Governing Law And Jurisdiction</h2>
                <p>
                  1. The Terms shall be governed by and construed in accordance
                  with the laws of United Arab Emirate or ADGM.
                </p>
                <p>
                  2. In the event of any claim, dispute or difference
                  (“Dispute”) that may arise out of or in connection with the
                  Terms and/or TrustIn (including any question relating to
                  the existence, validity of termination of the Terms), you
                  agree to enter into negotiations with the Company in good
                  faith to resolve such Dispute (“Good Faith Negotiations”).
                </p>
                <p>
                  3. Where a Dispute is not resolved within 90 days of the
                  commencement of Good Faith Negotiations, the Dispute shall be
                  referred to and finally resolved by arbitration administered
                  by the United Arab Emirate International Arbitration Centre
                  (“UIAC”)in accordance with the Arbitration Rules of the UIAC
                  (“UIAC Rules”) for the time being in force, the UIAC Rules
                  being (Parallel authority in UAE to be mentioned)deemed to be
                  incorporated by reference in this paragraph.
                </p>
                <p>4. The seat of arbitration shall be United Arab Emirate.</p>
                <p>
                  5. The arbitration shall be conducted by a single arbitrator
                  and wholly in the English language.
                </p>
                <p>
                  6. You further agree that following the commencement of
                  arbitration, you will attempt in good faith to resolve the
                  Dispute through mediation at the United Arab Emirate
                  International Mediation Centre (“UIMC”) in accordance with the
                  SIAC-SIMC Arb-Med-Arb Protocol(Parallel authority in UAE to be
                  mentioned) for the time being in force.
                </p>
                <p>
                  7. Any settlement reached in the course of mediation shall be
                  referred to the arbitrator appointed by the SIAC (Parallel
                  authority in UAE to be mentioned) may be made a consent award
                  on agreed terms.
                </p>
                <p>
                  8. Any decision and/or award made by an arbitrator in
                  accordance with the Terms shall be final and binding on the
                  parties to such arbitration and the parties to such
                  arbitration expressly waive their rights to appeal any such
                  decision and/or award.
                </p>
              </div>
            </div>
          </Col>
          {/* <BackTop>
            <div><ArrowUpOutlined /></div>
          </BackTop> */}
        </Row>
      </div>
      )}
    </>
  );
};

export default TermsandConditions;
