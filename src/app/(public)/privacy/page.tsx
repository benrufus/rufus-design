import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rufus Design',
  description: 'Privacy Policy for Rufus Design Limited.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
  label="Legal"
  title="Privacy Policy"
  intro="Last updated: June 2026"
/>

<section className="section">
  <div className="container">

    <p>
      This privacy policy applies between you, the User of this Website and
      Rufus Design Limited, the owner and provider of this Website...
    </p>

    <h2>Definitions and Interpretation</h2>

    <h3>Data</h3>
    <p>
      Collectively all information that you submit to Rufus Design Limited via
      the Website...
    </p>

    <h3>Cookies</h3>
    <p>
      A small text file placed on your computer by this Website...
    </p>

    <h3>Data Protection Laws</h3>
    <p>
      Any applicable law relating to the processing of personal Data...
    </p>

    <h2>Scope of this Privacy Policy</h2>

    <p>
      This privacy policy applies only to the actions of Rufus Design Limited
      and Users with respect to this Website...
    </p>

    <h2>Data Collected</h2>

    <p>
      We may collect the following Data, which includes personal Data, from
      you:
    </p>

    <ul>
      <li>Name</li>
      <li>Job title</li>
      <li>Profession</li>
      <li>Contact information such as email addresses and telephone numbers</li>
      <li>IP address</li>
      <li>Web browser type and version</li>
      <li>Operating system</li>
      <li>
        A list of URLs starting with a referring site, your activity on this
        Website and the site you exit to
      </li>
    </ul>

    <h2>How We Collect Data</h2>

    <h3>Data Given To Us By You</h3>

    <ul>
      <li>When you contact us through the Website</li>
      <li>By telephone</li>
      <li>By post</li>
      <li>By email</li>
      <li>When you use our services</li>
    </ul>

    <h3>Data Received From Third Parties</h3>

    <ul>
      <li>Google</li>
      <li>Google Analytics</li>
      <li>Facebook</li>
      <li>Instagram</li>
      <li>LinkedIn</li>
    </ul>

    <h2>Our Use of Data</h2>

    <p>
      Any or all of the above Data may be required by us from time to time in
      order to provide you with the best possible service and experience when
      using our Website.
    </p>

    <ul>
      <li>Improvement of our products and services</li>
      <li>Email marketing communications</li>
      <li>Market research</li>
      <li>Website customisation and improvement</li>
    </ul>

    <h2>Who We Share Data With</h2>

    <ul>
      <li>Group companies and affiliates</li>
      <li>Employees, agents and professional advisers</li>
    </ul>

    <h2>Keeping Data Secure</h2>

    <p>
      We will use technical and organisational measures to safeguard your Data.
    </p>

    <ul>
      <li>Secure servers</li>
      <li>Password protected systems</li>
      <li>Controlled access to data</li>
    </ul>

    <h2>Data Retention</h2>

    <p>
      Unless a longer retention period is required or permitted by law, we will
      only hold your Data for as long as necessary.
    </p>

    <h2>Your Rights</h2>

    <ul>
      <li>Right to access</li>
      <li>Right to correct</li>
      <li>Right to erase</li>
      <li>Right to restrict processing</li>
      <li>Right to data portability</li>
      <li>Right to object</li>
    </ul>

    <p>
      To exercise your rights, please contact:
      <br />
      <a href="mailto:hello@rufusdesign.co.uk">
        hello@rufusdesign.co.uk
      </a>
    </p>

    <h2>Links To Other Websites</h2>

    <p>
      This Website may, from time to time, provide links to other websites...
    </p>

    <h2>Changes Of Business Ownership And Control</h2>

    <p>
      Rufus Design Limited may, from time to time, expand or reduce our
      business...
    </p>

    <h2>Cookies</h2>

    <p>
      This Website may place and access certain Cookies on your computer...
    </p>

    <table>
      <thead>
        <tr>
          <th>Type of Cookie</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Strictly Necessary Cookies</td>
          <td>
            Required for the operation of the Website and essential services.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>General</h2>

    <p>
      This Agreement will be governed by and interpreted according to the law
      of England and Wales.
    </p>

    <h2>Changes To This Privacy Policy</h2>

    <p>
      Rufus Design Limited reserves the right to change this privacy policy as
      we may deem necessary from time to time or as may be required by law.
    </p>

    <p>
      You may contact us by email at{' '}
      <a href="mailto:hello@rufusdesign.co.uk">
        hello@rufusdesign.co.uk
      </a>.
    </p>

  </div>
</section>
    </>
  )
}
